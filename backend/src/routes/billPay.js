const express = require('express');
const router = express.Router();
const billPayController = require('../controllers/billPayController');

// Get billers list
router.get('/billers', billPayController.getBillers);

// Fetch bill details
router.post('/fetch-bill', billPayController.fetchBill);

// Pay bill
router.post('/pay', billPayController.payBill);

// Get payment history
router.get('/history', billPayController.getPaymentHistory);

module.exports = router;

