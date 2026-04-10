/**
 * Free RAG stack:
 * - Retrieval: TF–IDF cosine similarity over local JSON chunks (no API, no cost).
 * - Generation (optional, free tiers): GROQ_API_KEY (Groq) or GEMINI_API_KEY (Google AI Studio).
 * - Fallback: template answer from top chunks + keyword stub if nothing matches.
 */

const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { buildStubReply } = require('../utils/assistantStub');

const KB_PATH = path.join(__dirname, '../../data/rag/knowledge-chunks.json');

const SYSTEM_PROMPT = `You are MYFI Assistant, a helpful but cautious finance education helper for Indian users.
Rules:
- Use ONLY the CONTEXT below plus general reasoning. If context is insufficient, say so briefly.
- Never invent account-specific numbers; user balances are unknown unless stated in their message.
- No personalized legal/tax/investment advice; keep answers educational.
- Short paragraphs, plain language. If mentioning payoff time, stress it depends on APR and payment amount unless user gave numbers you can use for a rough illustration.`;

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

function formatContext(matches) {
  if (!matches.length) return '(No matching knowledge base passages.)';
  return matches
    .map((m, i) => `[${i + 1}] ${m.chunk.title}\n${m.chunk.text}`)
    .join('\n\n');
}

function templateFromRag(userMessage, matches) {
  const threshold = 0.012;
  if (!matches.length || matches[0].score < threshold) {
    return buildStubReply(userMessage);
  }
  const parts = matches.slice(0, 3).map((m) => `**${m.chunk.title}**\n${m.chunk.text}`);
  const wantsTiming = /how long|how many month|months to|years to|time to|close my|pay off|clear.*bill/i.test(
    userMessage
  );
  const footer = wantsTiming
    ? '\n\n---\n**How long to clear the balance?** There is no single answer without your **exact APR** and how the **minimum due** is calculated. Use the repayment estimate on your **card statement** or a calculator with your real numbers. Paying only the minimum usually means **many years** and **large total interest** for a large balance at typical card APRs.'
    : '\n\n---\nThis is general educational information—not personalized advice. Check your card agreement and statements for exact APRs, minimums, and payoff estimates.';
  return 'Here is guidance based on MYFI’s knowledge base (retrieved for your question):\n\n' + parts.join('\n\n') + footer;
}

async function generateGroq(userMessage, contextBlock) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  const userContent = `CONTEXT:\n${contextBlock}\n\nUSER QUESTION:\n${userMessage}`;
  const { data } = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
      temperature: 0.35,
      max_tokens: 1024,
    },
    {
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      timeout: 45000,
    }
  );
  const text = data?.choices?.[0]?.message?.content;
  return text ? String(text).trim() : null;
}

async function generateGemini(userMessage, contextBlock) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const userPart = `CONTEXT:\n${contextBlock}\n\nUSER QUESTION:\n${userMessage}`;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
  const { data } = await axios.post(
    url,
    {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: userPart }] }],
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 1024,
      },
    },
    { timeout: 45000 }
  );
  const parts = data?.candidates?.[0]?.content?.parts;
  const text = parts?.map((p) => p.text).join('');
  return text ? String(text).trim() : null;
}

/**
 * @returns {Promise<{ reply: string, retrievedContext: Array, mode: string, model: string }>}
 */
async function answerChat(userMessage) {
  const matches = retrieve(userMessage, 5);
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
      reply = await generateGroq(userMessage, contextBlock);
      if (reply) {
        mode = 'rag-groq';
        model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
      }
    }
    if (!reply && process.env.GEMINI_API_KEY) {
      reply = await generateGemini(userMessage, contextBlock);
      if (reply) {
        mode = 'rag-gemini';
        model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
      }
    }
  } catch (err) {
    console.error('[ragChatService] LLM error:', err.message);
  }

  if (!reply) {
    reply = templateFromRag(userMessage, matches);
    if (matches.length && matches[0].score >= 0.02) {
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
  };
}

module.exports = {
  answerChat,
  retrieve,
};
