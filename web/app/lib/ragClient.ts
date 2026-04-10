/**
 * Browser-side RAG (TF–IDF + template) using the same JSON as the backend.
 * Used when NEXT_PUBLIC_MYFI_API_URL is unset or the API call fails (static hosting).
 */

export type KbChunk = { id: string; title: string; text: string }

type IndexedChunk = KbChunk & { tokens: string[] }

type Corpus = {
  chunks: IndexedChunk[]
  idf: Record<string, number>
  vectors: Record<string, number>[]
}

const KB_URL = '/rag/knowledge-chunks.json'

/** Common typos / variants so queries still match KB text. */
function normalizeToken(t: string): string {
  const map: Record<string, string> = {
    minumum: 'minimum',
    payement: 'payment',
    payements: 'payments',
    instalment: 'installment',
    emis: 'emi',
    lacs: 'lakh',
    lac: 'lakh',
    lakhs: 'lakh',
    rs: 'rupees',
    inr: 'rupees',
    creditcard: 'credit',
    payoff: 'pay',
    payed: 'pay',
  }
  return map[t] ?? t
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097F\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(normalizeToken)
}

function computeIdf(chunks: IndexedChunk[]): Record<string, number> {
  const df: Record<string, number> = {}
  const N = chunks.length
  chunks.forEach(({ tokens }) => {
    const seen = new Set(tokens)
    seen.forEach((t) => {
      df[t] = (df[t] || 0) + 1
    })
  })
  const idf: Record<string, number> = {}
  Object.keys(df).forEach((t) => {
    idf[t] = Math.log((N + 1) / (df[t] + 1)) + 1
  })
  return idf
}

function tfidfVector(tokens: string[], idf: Record<string, number>): Record<string, number> {
  const tf: Record<string, number> = {}
  tokens.forEach((t) => {
    tf[t] = (tf[t] || 0) + 1
  })
  const maxTf = Math.max(...Object.values(tf), 1)
  const vec: Record<string, number> = {}
  Object.keys(tf).forEach((t) => {
    if (idf[t] !== undefined) {
      vec[t] = (tf[t] / maxTf) * idf[t]
    }
  })
  return vec
}

function cosineSim(a: Record<string, number>, b: Record<string, number>): number {
  let dot = 0
  let na = 0
  let nb = 0
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  keys.forEach((k) => {
    const va = a[k] || 0
    const vb = b[k] || 0
    dot += va * vb
    na += va * va
    nb += vb * vb
  })
  if (na === 0 || nb === 0) return 0
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

function buildCorpusFromJson(list: KbChunk[]): Corpus {
  const chunks: IndexedChunk[] = list.map((c) => ({
    ...c,
    tokens: tokenize(`${c.title} ${c.text}`),
  }))
  const idf = computeIdf(chunks)
  const vectors = chunks.map((c) => tfidfVector(c.tokens, idf))
  return { chunks, idf, vectors }
}

let corpusPromise: Promise<Corpus> | null = null

function loadCorpus(): Promise<Corpus> {
  if (!corpusPromise) {
    corpusPromise = fetch(KB_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`KB ${r.status}`)
        return r.json() as Promise<KbChunk[]>
      })
      .then(buildCorpusFromJson)
      .catch((e) => {
        corpusPromise = null
        throw e
      })
  }
  return corpusPromise
}

function retrieve(message: string, corpus: Corpus, topK = 5) {
  const qTokens = tokenize(message)
  const qVec = tfidfVector(qTokens, corpus.idf)
  const scored = corpus.vectors.map((v, i) => ({
    chunk: corpus.chunks[i],
    score: cosineSim(qVec, v),
  }))
  scored.sort((x, y) => y.score - x.score)
  return scored.slice(0, topK).filter((s) => s.score > 0)
}

function buildStubReply(userMessage: string): string {
  const lower = userMessage.toLowerCase()
  let reply =
    "Here is general guidance (we couldn’t match a specific knowledge article closely—try rephrasing with words like **minimum payment**, **credit card**, **EMI**, or **CIBIL**):\n\n"
  if (/debt|pay off|balance|interest|credit card|minimum|lakh|bill/i.test(userMessage)) {
    reply +=
      'For credit card debt: paying only the **minimum** keeps the account current but **interest keeps accruing** on what you owe. **Payoff time in months or years depends on your APR and the minimum formula**—it is not one fixed number. Check your statement’s repayment illustration or use your APR and balance in a calculator. Paying more than the minimum, especially early, saves the most interest. Strategies people use: **avalanche** (highest APR first) or **snowball** (smallest balance first).'
  } else if (/credit score|utilization|crif|experian|cibil/i.test(lower)) {
    reply +=
      'Credit scores usually benefit from **on-time payments** and **lower utilization**. Pull your bureau report to see factors and dispute errors if any.'
  } else if (/save|savings|sip|invest|mutual|gold/i.test(lower)) {
    reply +=
      'For savings and investing, align amount and horizon with your goals, read scheme documents, and remember market-linked products carry risk.'
  } else {
    reply +=
      'You can ask about **UPI safety**, **SIP**, **gold**, **insurance**, **home loans**, **BNPL**, **budgeting**, and more.'
  }
  return reply
}

function templateFromRag(userMessage: string, matches: { chunk: IndexedChunk; score: number }[]): string {
  const threshold = 0.012
  if (!matches.length || matches[0].score < threshold) {
    return buildStubReply(userMessage)
  }
  const parts = matches.slice(0, 3).map((m) => `**${m.chunk.title}**\n${m.chunk.text}`)
  const wantsTiming = /how long|how many month|months to|years to|time to|close my|pay off|clear.*bill/i.test(
    userMessage
  )
  const footer = wantsTiming
    ? '\n\n---\n**How long to clear the balance?** There is no single answer without your **exact APR** and how the **minimum due** is calculated (it changes as the balance drops). Use the repayment estimate on your **card statement** or an amortization calculator with your real numbers. Paying only the minimum usually means **many years** and **large total interest** for a two-lakh-style balance at typical Indian card APRs.'
    : '\n\n---\nGeneral educational information only—not personalized financial advice. Verify rates and terms on your statements.'
  return 'Here is guidance based on MYFI’s knowledge base (matched to your question):\n\n' + parts.join('\n\n') + footer
}

/** Call when API is unavailable or returns an error. */
export async function clientRagReply(message: string): Promise<string> {
  try {
    const corpus = await loadCorpus()
    const matches = retrieve(message, corpus, 5)
    return templateFromRag(message, matches)
  } catch {
    return buildStubReply(message)
  }
}
