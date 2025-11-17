const express = require('express');
const router = express.Router();
const creditScoreController = require('../controllers/creditScoreController');

// Fetch credit score
router.post('/fetch', creditScoreController.fetchCreditScore);

// Get credit score history
router.get('/history', creditScoreController.getCreditScoreHistory);

// Get latest credit score
router.get('/latest', creditScoreController.getLatestCreditScore);

module.exports = router;

