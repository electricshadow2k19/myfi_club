/**
 * Browser-side RAG when no chat API is configured. Supports multi-turn retrieval (recent user text).
 */

export type KbChunk = { id: string; title: string; text: string }

export type ChatTurn = { role: 'user' | 'assistant'; content: string }

type IndexedChunk = KbChunk & { tokens: string[] }

type Corpus = {
  chunks: IndexedChunk[]
  idf: Record<string, number>
  vectors: Record<string, number>[]
}

const KB_URL = '/rag/knowledge-chunks.json'
const RAG_THRESHOLD = 0.012

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

function retrievalQuery(latestUserText: string, priorMessages: ChatTurn[]): string {
  const userTurns = priorMessages.filter((m) => m.role === 'user').map((m) => m.content)
  const tail = userTurns.slice(-2)
  return [...tail, latestUserText].join(' ').slice(0, 4000)
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
    'I focus on **personal finance for India**. I could not match a strong knowledge-base article — try words like **credit card**, **minimum payment**, **SIP**, **CIBIL**, or **UPI**.\n\n'
  if (/debt|pay off|balance|interest|credit card|minimum|lakh|bill|card/i.test(userMessage)) {
    reply +=
      'On **card debt**: paying only the **minimum** avoids late fees but **interest keeps building** on the rest. Payoff time needs your real **APR** and rules — use your **statement** or a calculator. Paying extra, especially early, saves the most interest.'
  } else if (/credit score|utilization|cibil|crif|experian/i.test(lower)) {
    reply +=
      'Scores usually reward **on-time payments** and **lower credit utilization**. Pull your bureau report for factors and dispute errors if needed.'
  } else if (/save|savings|sip|invest|mutual|gold|insurance/i.test(lower)) {
    reply +=
      'For investing and savings: match products to your **horizon** and **risk**; read scheme documents — market-linked options are not guaranteed.'
  } else {
    reply += 'Ask me anything about **money in India** — cards, loans, UPI, investing, insurance, or scams.'
  }
  return reply
}

function templateFromRag(userMessage: string, matches: { chunk: IndexedChunk; score: number }[]): string {
  if (!matches.length || matches[0].score < RAG_THRESHOLD) {
    return buildStubReply(userMessage)
  }
  const top = matches[0].chunk
  const extra = matches.slice(1, 3).map((m) => m.chunk)
  let body = `**Here is the straight answer**\n\n${top.text}\n\n`
  if (extra.length) {
    body += `**Also good to know**\n\n`
    extra.forEach((c) => {
      body += `• *${c.title}* — ${c.text}\n\n`
    })
  }
  const wantsTiming = /how long|how many month|months to|years to|time to|close my|pay off|clear.*bill/i.test(
    userMessage
  )
  const footer = wantsTiming
    ? '**Payoff timeline:** Without your exact APR and minimum rules, no one can honestly give one fixed number of months. Use your **card statement** repayment estimate or a calculator.\n\n'
    : ''
  return `${body}${footer}*Educational guidance only — not personalized advice.*`
}

/** Offline / static: uses KB + multi-turn retrieval. */
export async function clientRagReply(latestUserText: string, priorMessages: ChatTurn[] = []): Promise<string> {
  try {
    const corpus = await loadCorpus()
    const query = retrievalQuery(latestUserText, priorMessages)
    const matches = retrieve(query, corpus, 5)
    return templateFromRag(latestUserText, matches)
  } catch {
    return buildStubReply(latestUserText)
  }
}
