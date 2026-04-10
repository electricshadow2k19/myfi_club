const Joi = require('joi');
const { answerChat } = require('../services/ragChatService');

/**
 * MYFI AI Assistant — multi-turn RAG + optional Groq / Gemini.
 * POST /api/v1/chat
 *
 * Body (either):
 * - { "message": "string" } — single turn
 * - { "messages": [{ "role": "user"|"assistant", "content": "..." }, ...] } — must end with role "user"
 */

const turnSchema = Joi.object({
  role: Joi.string().valid('user', 'assistant').required(),
  content: Joi.string().trim().min(1).max(12000).required(),
});

const bodySchema = Joi.object({
  message: Joi.string().trim().min(1).max(4000),
  messages: Joi.array().items(turnSchema).min(1).max(40),
  conversationId: Joi.string().uuid().optional(),
})
  .or('message', 'messages')
  .messages({
    'object.missing': 'Provide either "message" or "messages"',
  });

function parseBody(value) {
  if (value.messages && value.messages.length > 0) {
    const last = value.messages[value.messages.length - 1];
    if (last.role !== 'user') {
      return { error: 'Last item in messages must have role "user"' };
    }
    const latestUserText = last.content;
    const priorMessages = value.messages.slice(0, -1);
    return { latestUserText, priorMessages, conversationId: value.conversationId };
  }
  return {
    latestUserText: value.message,
    priorMessages: [],
    conversationId: value.conversationId,
  };
}

async function postChat(req, res) {
  const { error, value } = bodySchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      details: error.details.map((d) => d.message),
    });
  }

  const parsed = parseBody(value);
  if (parsed.error) {
    return res.status(400).json({ success: false, message: parsed.error });
  }

  const { latestUserText, priorMessages, conversationId } = parsed;

  let data;
  try {
    data = await answerChat(latestUserText, priorMessages);
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
      model: data.model,
      llmEnabled: data.llmEnabled,
      retrievedContext: data.retrievedContext,
      disclaimer:
        'Educational information only—not personalized financial, legal, or tax advice. Verify rates and terms on your statements and official documents.',
    },
  });
}

module.exports = {
  postChat,
};
