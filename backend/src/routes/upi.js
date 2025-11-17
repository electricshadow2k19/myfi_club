const express = require('express');
const router = express.Router();
const upiController = require('../controllers/upiController');

// Create UPI ID
router.post('/create-upi', upiController.createUPI);

// Send money via UPI
router.post('/send', upiController.sendMoney);

// Request money via UPI
router.post('/request', upiController.requestMoney);

// Get transaction history
router.get('/transactions', upiController.getTransactions);

// Get transaction details
router.get('/transactions/:id', upiController.getTransactionDetails);

module.exports = router;

