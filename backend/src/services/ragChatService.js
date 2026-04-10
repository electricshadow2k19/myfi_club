/**
 * RAG: TF–IDF retrieval over local JSON + optional LLM (Groq / Gemini) with multi-turn chat.
 */

const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { buildStubReply } = require('../utils/assistantStub');

const KB_PATH = path.join(__dirname, '../../data/rag/knowledge-chunks.json');

const SYSTEM_PROMPT = `You are **MYFI Assistant** — a professional, calm financial guide for people in **India**. You speak clear, modern English (and may briefly acknowledge Hindi terms users use like EMI, lakh, or SIP).

**Scope:** Personal finance only — credit cards, loans, UPI, savings, mutual funds/SIP, gold, insurance, budgeting, credit scores (CIBIL, etc.), taxes at a high level, scams, and app safety. If the user asks for non-finance topics (coding, recipes, politics), politely decline and offer to help with money instead.

**How to answer:**
- Sound **conversational and human** — like a trusted advisor, not a bulletin board. Use short paragraphs, optional bullet points when listing steps.
- **Ground answers** in the RETRIEVED CONTEXT provided for this turn. If context is thin, say so honestly and give cautious, general education — do not invent product rules or rates.
- **Never** claim you can see their bank balance, card APR, or live MYFI data unless they pasted numbers in the chat.
- For "how long to pay off" questions: explain that duration depends on **APR**, **minimum-payment rules**, and **extra payments** — suggest they use their **statement illustration** or a calculator with their real figures. Do not fabricate a specific number of months without their inputs.
- End with a **one-line disclaimer** when giving strategy: that this is educational, not personalized tax/legal/investment advice.

**Safety:** No encouragement of fraud, tax evasion, or hiding assets. Encourage official channels for disputes.`;

function normalizeToken(t) {
  const map = {
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
  };
  return map[t] || t;
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097F\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(normalizeToken);
}

function loadChunks() {
  const raw = fs.readFileSync(KB_PATH, 'utf8');
  const list = JSON.parse(raw);
  return list.map((c) => ({
    id: c.id,
    title: c.title,
    text: c.text,
    tokens: tokenize(`${c.title} ${c.text}`),
  }));
}

let cached = null;
function getCorpus() {
  if (!cached) {
    const chunks = loadChunks();
    const idf = computeIdf(chunks);
    const vectors = chunks.map((c) => tfidfVector(c.tokens, idf));
    cached = { chunks, idf, vectors };
  }
  return cached;
}

function computeIdf(chunks) {
  const df = {};
  const N = chunks.length;
  chunks.forEach(({ tokens }) => {
    const seen = new Set(tokens);
    seen.forEach((t) => {
      df[t] = (df[t] || 0) + 1;
    });
  });
  const idf = {};
  Object.keys(df).forEach((t) => {
    idf[t] = Math.log((N + 1) / (df[t] + 1)) + 1;
  });
  return idf;
}

function tfidfVector(tokens, idf) {
  const tf = {};
  tokens.forEach((t) => {
    tf[t] = (tf[t] || 0) + 1;
  });
  const maxTf = Math.max(...Object.values(tf), 1);
  const vec = {};
  Object.keys(tf).forEach((t) => {
    if (idf[t] !== undefined) {
      vec[t] = (tf[t] / maxTf) * idf[t];
    }
  });
  return vec;
}

function cosineSim(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  keys.forEach((k) => {
    const va = a[k] || 0;
    const vb = b[k] || 0;
    dot += va * vb;
    na += va * va;
    nb += vb * vb;
  });
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function retrieve(message, topK = 5) {
  const { chunks, idf, vectors } = getCorpus();
  const qTokens = tokenize(message);
  const qVec = tfidfVector(qTokens, idf);
  const scored = vectors.map((v, i) => ({
    chunk: chunks[i],
    score: cosineSim(qVec, v),
  }));
  scored.sort((x, y) => y.score - x.score);
  return scored.slice(0, topK).filter((s) => s.score > 0);
}

/** Build retrieval query from latest user message + recent user turns (follow-ups). */
function retrievalQuery(latestUserText, priorMessages) {
  const userTurns = priorMessages.filter((m) => m.role === 'user').map((m) => m.content);
  const tail = userTurns.slice(-2);
  return [...tail, latestUserText].join(' ').slice(0, 4000);
}

function formatContext(matches) {
  if (!matches.length) return '(No matching knowledge base passages.)';
  return matches
    .map((m, i) => `[${i + 1}] ${m.chunk.title}\n${m.chunk.text}`)
    .join('\n\n');
}

const RAG_THRESHOLD = 0.012;

function templateFromRag(userMessage, matches) {
  if (!matches.length || matches[0].score < RAG_THRESHOLD) {
    return buildStubReply(userMessage);
  }
  const top = matches[0].chunk;
  const extra = matches.slice(1, 3).map((m) => m.chunk);
  let body = `**Here is the straight answer**\n\n${top.text}\n\n`;
  if (extra.length) {
    body += `**Also good to know**\n\n`;
    extra.forEach((c) => {
      body += `• *${c.title}* — ${c.text}\n\n`;
    });
  }
  const wantsTiming = /how long|how many month|months to|years to|time to|close my|pay off|clear.*bill/i.test(
    userMessage
  );
  const footer = wantsTiming
    ? '**Payoff timeline:** Without your exact APR and minimum rules, nobody can honestly give you a single “X months” figure. Check the repayment table on your **card statement** or plug your balance and APR into a calculator — paying only the minimum on a large balance often stretches **many years** and costs a lot in interest.\n\n'
    : '';
  return `${body}${footer}*Educational guidance only — not personalized advice.*`;
}

function sanitizeHistory(msgs) {
  const out = [];
  for (const m of msgs) {
    if (!out.length && m.role === 'assistant') continue;
    out.push({ role: m.role, content: m.content });
  }
  return out;
}

function trimHistory(priorMessages, maxPairs = 8) {
  return sanitizeHistory(priorMessages).slice(-maxPairs * 2);
}

function buildContextualUserMessage(contextBlock, latestUserText) {
  return (
    `The following is retrieved from MYFI's knowledge base for this question. Use it to ground your reply; synthesize in your own words. If it doesn't fully answer the question, say what is missing and give careful general guidance.\n\n` +
    `---\n${contextBlock}\n---\n\n` +
    `User message:\n${latestUserText}`
  );
}

async function generateGroq(priorMessages, contextBlock, latestUserText) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  const history = trimHistory(priorMessages);
  const messages = [{ role: 'system', content: SYSTEM_PROMPT }];
  history.forEach((m) => {
    messages.push({ role: m.role, content: m.content });
  });
  messages.push({ role: 'user', content: buildContextualUserMessage(contextBlock, latestUserText) });

  const { data } = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model,
      messages,
      temperature: 0.45,
      max_tokens: 1400,
    },
    {
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    }
  );
  const text = data?.choices?.[0]?.message?.content;
  return text ? String(text).trim() : null;
}

async function generateGemini(priorMessages, contextBlock, latestUserText) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;

  const history = trimHistory(priorMessages);
  const contents = [];
  history.forEach((m) => {
    contents.push({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    });
  });
  contents.push({
    role: 'user',
    parts: [{ text: buildContextualUserMessage(contextBlock, latestUserText) }],
  });

  const { data } = await axios.post(
    url,
    {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: {
        temperature: 0.45,
        maxOutputTokens: 1400,
      },
    },
    { timeout: 60000 }
  );
  const parts = data?.candidates?.[0]?.content?.parts;
  const text = parts?.map((p) => p.text).join('');
  return text ? String(text).trim() : null;
}

/**
 * @param {string} latestUserText
 * @param {Array<{role:'user'|'assistant', content: string}>} priorMessages - messages before latest user turn
 */
async function answerChat(latestUserText, priorMessages = []) {
  const query = retrievalQuery(latestUserText, priorMessages);
  const matches = retrieve(query, 5);
  const retrievedContext = matches.map((m) => ({
    title: m.chunk.title,
    snippet: m.chunk.text.slice(0, 280) + (m.chunk.text.length > 280 ? '…' : ''),
    score: Math.round(m.score * 1000) / 1000,
    id: m.chunk.id,
  }));

  const contextBlock = formatContext(matches);

  let reply = null;
  let mode = 'rag-template';
  let model = 'tfidf+template';

  try {
    if (process.env.GROQ_API_KEY) {
      reply = await generateGroq(priorMessages, contextBlock, latestUserText);
      if (reply) {
        mode = 'rag-groq';
        model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
      }
    }
    if (!reply && process.env.GEMINI_API_KEY) {
      reply = await generateGemini(priorMessages, contextBlock, latestUserText);
      if (reply) {
        mode = 'rag-gemini';
        model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
      }
    }
  } catch (err) {
    console.error('[ragChatService] LLM error:', err.message);
  }

  if (!reply) {
    reply = templateFromRag(latestUserText, matches);
    if (matches.length && matches[0].score >= RAG_THRESHOLD) {
      mode = 'rag-template';
      model = 'tfidf+template';
    } else {
      mode = 'stub';
      model = 'keyword-stub';
    }
  }

  return {
    reply,
    retrievedContext: retrievedContext.length
      ? retrievedContext
      : [
          {
            title: 'No strong KB match',
            snippet: 'Try rephrasing or ask about credit cards, UPI, SIP, or gold.',
            score: 0,
          },
        ],
    mode,
    model,
    llmEnabled: !!(process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY),
  };
}

module.exports = {
  answerChat,
  retrieve,
};
