'use strict';

const {
  SYSTEM_PROMPT,
  RAG_THRESHOLD,
  runRag,
  templateFromRag,
  trimHistory,
  buildContextualUserMessage,
} = require('./ragShared');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

async function groqComplete(priorMessages, contextBlock, latestUserText) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  const history = trimHistory(priorMessages);
  const messages = [{ role: 'system', content: SYSTEM_PROMPT }];
  history.forEach((m) => messages.push({ role: m.role, content: m.content }));
  messages.push({ role: 'user', content: buildContextualUserMessage(contextBlock, latestUserText) });

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.45,
      max_tokens: 1400,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('[chat] Groq error', res.status, err);
    return null;
  }
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  return text ? String(text).trim() : null;
}

function parseBody(body) {
  let payload;
  try {
    payload = JSON.parse(body || '{}');
  } catch {
    return { error: 'Invalid JSON' };
  }
  const { message, messages, conversationId } = payload;
  if (messages && Array.isArray(messages) && messages.length > 0) {
    const last = messages[messages.length - 1];
    if (last.role !== 'user') return { error: 'Last message must be role user' };
    return {
      latestUserText: last.content,
      priorMessages: messages.slice(0, -1),
      conversationId: conversationId || null,
    };
  }
  if (message && typeof message === 'string' && message.trim()) {
    return {
      latestUserText: message.trim(),
      priorMessages: [],
      conversationId: conversationId || null,
    };
  }
  return { error: 'Provide "message" or "messages" ending with a user turn' };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  const parsed = parseBody(event.body);
  if (parsed.error) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: parsed.error }),
    };
  }

  const { latestUserText, priorMessages, conversationId } = parsed;
  const { matches, retrievedContext, contextBlock } = runRag(latestUserText, priorMessages);

  let reply = null;
  let mode = 'rag-template';
  let model = 'tfidf+template';

  try {
    reply = await groqComplete(priorMessages, contextBlock, latestUserText);
    if (reply) {
      mode = 'rag-groq';
      model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    }
  } catch (e) {
    console.error('[chat]', e);
  }

  if (!reply) {
    reply = templateFromRag(latestUserText, matches);
    if (matches.length && matches[0].score >= RAG_THRESHOLD) {
      mode = 'rag-template';
    } else {
      mode = 'stub';
      model = 'keyword-stub';
    }
  }

  const llmEnabled = !!process.env.GROQ_API_KEY;

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      success: true,
      data: {
        reply,
        conversationId,
        mode,
        model,
        llmEnabled,
        retrievedContext: retrievedContext.length
          ? retrievedContext
          : [
              {
                title: 'No strong KB match',
                snippet: 'Try rephrasing.',
                score: 0,
              },
            ],
        disclaimer:
          'Educational information only—not personalized financial, legal, or tax advice.',
      },
    }),
  };
};
