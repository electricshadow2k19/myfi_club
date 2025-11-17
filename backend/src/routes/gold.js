const express = require('express');
const router = express.Router();
const goldController = require('../controllers/goldController');

// Get current gold price
router.get('/price', goldController.getGoldPrice);

// Buy digital gold
router.post('/buy/digital', goldController.buyDigitalGold);

// Buy physical gold
router.post('/buy/physical', goldController.buyPhysicalGold);

// Sell gold
router.post('/sell', goldController.sellGold);

// Get user gold holdings
router.get('/holdings', goldController.getHoldings);

module.exports = router;

