const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get user profile
router.get('/profile', userController.getProfile);

// Update user profile
router.put('/profile', userController.updateProfile);

// KYC submission
router.post('/kyc/submit', userController.submitKYC);

// Get KYC status
router.get('/kyc/status', userController.getKYCStatus);

module.exports = router;

