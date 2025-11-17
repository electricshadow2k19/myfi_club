const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register new user
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Send OTP
router.post('/send-otp', authController.sendOTP);

// Verify OTP
router.post('/verify-otp', authController.verifyOTP);

// Refresh token
router.post('/refresh-token', authController.refreshToken);

// Logout
router.post('/logout', authController.logout);

module.exports = router;

