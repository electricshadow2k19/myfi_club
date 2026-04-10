const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

/**
 * MYFI AI Assistant (RAG preview — stub)
 * POST / — { "message": "string", "conversationId?": "uuid" }
 */
router.post('/', chatController.postChat);

module.exports = router;
