'use strict';

const knowledgeList = require('./knowledge-chunks.json');

const RAG_THRESHOLD = 0.012;

const SYSTEM_PROMPT = `You are **MYFI Assistant** — a professional, calm financial guide for people in **India**. You speak clear, modern English (and may briefly acknowledge Hindi terms users use like EMI, lakh, or SIP).

**Scope:** Personal finance only — credit cards, loans, UPI, savings, mutual funds/SIP, gold, insurance, budgeting, credit scores (CIBIL, etc.), taxes at a high level, scams, and app safety. If the user asks for non-finance topics, politely decline and offer to help with money instead.

**How to answer:**
- Sound **conversational and human** — like a trusted advisor. Use short paragraphs, optional bullet points when listing steps.
- **Ground answers** in the RETRIEVED CONTEXT provided for this turn. If context is thin, say so honestly and give cautious, general education — do not invent product rules or rates.
- **Never** claim you can see their bank balance, card APR, or live MYFI data unless they pasted numbers in the chat.
- For payoff timing: explain it depends on **APR**, **minimum-payment rules**, and **extra payments** — suggest **statement illustration** or a calculator. Do not fabricate months without inputs.
- End with a brief reminder that this is educational, not personalized tax/legal/investment advice.

**Safety:** No encouragement of fraud or tax evasion. Encourage official channels for disputes.`;

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
  return knowledgeList.map((c) => ({
    id: c.id,
    title: c.title,
    text: c.text,
    tokens: tokenize(`${c.title} ${c.text}`),
  }));
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

const chunks = loadChunks();
const idf = computeIdf(chunks);
const vectors = chunks.map((c) => tfidfVector(c.tokens, idf));

function retrieve(message, topK = 5) {
  const qTokens = tokenize(message);
  const qVec = tfidfVector(qTokens, idf);
  const scored = vectors.map((v, i) => ({
    chunk: chunks[i],
    score: cosineSim(qVec, v),
  }));
  scored.sort((x, y) => y.score - x.score);
  return scored.slice(0, topK).filter((s) => s.score > 0);
}

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

function buildStubReply(userMessage) {
  const lower = userMessage.toLowerCase();
  let reply =
    'I focus on **personal finance for India**. I could not match a strong knowledge-base article — try words like **credit card**, **minimum payment**, **SIP**, **CIBIL**, or **UPI**.\n\n';
  if (/debt|pay off|balance|interest|credit card|minimum|lakh|bill|card/i.test(userMessage)) {
    reply +=
      'On **card debt**: paying only the **minimum** avoids late fees but **interest keeps building** on the rest. Payoff time needs your real **APR** and rules — use your **statement** or a calculator. Paying extra, especially early, saves the most interest.';
  } else if (/credit score|utilization|cibil|crif|experian/i.test(lower)) {
    reply +=
      'Scores usually reward **on-time payments** and **lower credit utilization**. Pull your bureau report for factors and dispute errors if needed.';
  } else if (/save|sip|invest|mutual|gold|insurance/i.test(lower)) {
    reply +=
      'For investing and savings: match products to your **horizon** and **risk**; read scheme documents — market-linked options are not guaranteed.';
  }
  return reply;
}

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
    ? '**Payoff timeline:** Without your exact APR and minimum rules, no one can honestly give one fixed number of months. Use your **card statement** repayment estimate or a calculator.\n\n'
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
    `The following is retrieved from MYFI's knowledge base. Use it to ground your reply; synthesize in your own words.\n\n` +
    `---\n${contextBlock}\n---\n\n` +
    `User message:\n${latestUserText}`
  );
}

function runRag(latestUserText, priorMessages) {
  const query = retrievalQuery(latestUserText, priorMessages);
  const matches = retrieve(query, 5);
  const retrievedContext = matches.map((m) => ({
    title: m.chunk.title,
    snippet: m.chunk.text.slice(0, 280) + (m.chunk.text.length > 280 ? '…' : ''),
    score: Math.round(m.score * 1000) / 1000,
    id: m.chunk.id,
  }));
  const contextBlock = formatContext(matches);
  return { matches, retrievedContext, contextBlock };
}

module.exports = {
  SYSTEM_PROMPT,
  RAG_THRESHOLD,
  runRag,
  templateFromRag,
  trimHistory,
  buildContextualUserMessage,
  buildStubReply,
};
