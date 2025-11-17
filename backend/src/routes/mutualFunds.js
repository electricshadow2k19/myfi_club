const express = require('express');
const router = express.Router();
const mutualFundController = require('../controllers/mutualFundController');

// Search mutual funds
router.get('/search', mutualFundController.searchFunds);

// Get fund details
router.get('/:schemeCode', mutualFundController.getFundDetails);

// Create SIP
router.post('/sip/create', mutualFundController.createSIP);

// Create Lumpsum investment
router.post('/lumpsum/create', mutualFundController.createLumpsum);

// Get user investments
router.get('/investments/list', mutualFundController.getUserInvestments);

// Pause SIP
router.put('/sip/:id/pause', mutualFundController.pauseSIP);

// Stop SIP
router.put('/sip/:id/stop', mutualFundController.stopSIP);

module.exports = router;

