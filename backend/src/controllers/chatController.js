const Joi = require('joi');

/**
 * MYFI AI Assistant — stub endpoint (RAG + LLM integration comes next).
 * POST /api/v1/chat
 *
 * For now: validates input, returns a safe placeholder response with mock "retrieved context".
 * Production: wire to vector DB retrieval + OpenAI (or similar) with guardrails.
 */

const messageSchema = Joi.object({
  message: Joi.string().trim().min(1).max(4000).required(),
  conversationId: Joi.string().uuid().optional(),
});

function buildStubReply(userMessage) {
  const lower = userMessage.toLowerCase();
  let reply =
    "Thanks for using MYFI Assistant (preview). I'm not connected to live financial data or a full RAG pipeline yet—this is a stub response for integration testing.\n\n";
  if (/debt|pay off|balance|interest/i.test(userMessage)) {
    reply +=
      "For credit card debt in general: prioritize high-APR balances, pay at least the minimum on all cards, and consider the avalanche (highest rate first) or snowball (smallest balance first) strategy. Verify numbers against your actual statements in the MYFI app.";
  } else if (/credit score|utilization|crif|experian/i.test(lower)) {
    reply +=
      "Credit scores often improve when utilization stays low and payments are on time. Check your latest score and factors inside MYFI's credit section once live data is linked.";
  } else if (/save|savings|sip|invest/i.test(lower)) {
    reply +=
      "For savings and investing, align amount and horizon with your goals. MYFI will surface personalized insights once your accounts and risk profile are connected.";
  } else {
    reply +=
      "Ask me about debt payoff, credit utilization, or savings goals—I'll respond with educational guidance grounded in MYFI policies once RAG is enabled.";
  }
  return reply;
}

async function postChat(req, res) {
  const { error, value } = messageSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      details: error.details.map((d) => d.message),
    });
  }

  const { message, conversationId } = value;
  const reply = buildStubReply(message);

  return res.status(200).json({
    success: true,
    data: {
      reply,
      conversationId: conversationId || null,
      mode: 'stub',
      retrievedContext: [
        {
          title: 'MYFI product knowledge base (placeholder)',
          snippet:
            'No vector embeddings loaded yet. Future: chunks from card policy PDFs, RBI FAQs, and internal runbooks.',
          score: null,
        },
      ],
      model: 'stub',
      disclaimer:
        'Educational information only—not personalized financial, legal, or tax advice. Live RAG + LLM integration pending.',
    },
  });
}

module.exports = {
  postChat,
};
