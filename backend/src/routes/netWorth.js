const express = require('express');
const router = express.Router();
const netWorthController = require('../controllers/netWorthController');

// Get current net worth
router.get('/current', netWorthController.getCurrentNetWorth);

// Get net worth history
router.get('/history', netWorthController.getNetWorthHistory);

// Add bank account
router.post('/bank-account', netWorthController.addBankAccount);

// Update bank account balance
router.put('/bank-account/:id', netWorthController.updateBankAccount);

// Get all assets
router.get('/assets', netWorthController.getAllAssets);

module.exports = router;

