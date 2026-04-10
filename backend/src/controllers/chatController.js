const Joi = require('joi');
const { answerChat } = require('../services/ragChatService');

/**
 * MYFI AI Assistant — RAG over local JSON + optional free-tier LLM (Groq / Gemini).
 * POST /api/v1/chat
 */

const messageSchema = Joi.object({
  message: Joi.string().trim().min(1).max(4000).required(),
  conversationId: Joi.string().uuid().optional(),
});

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

  let data;
  try {
    data = await answerChat(message);
  } catch (e) {
    console.error('[postChat]', e);
    return res.status(500).json({
      success: false,
      message: 'Assistant temporarily unavailable',
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      reply: data.reply,
      conversationId: conversationId || null,
      mode: data.mode,
      retrievedContext: data.retrievedContext,
      model: data.model,
      disclaimer:
        'Educational information only—not personalized financial, legal, or tax advice. Verify rates and terms on your statements and official documents.',
    },
  });
}

module.exports = {
  postChat,
};
