const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../database/connection');
const { setCache, getCache } = require('../database/redis');

// Register new user
async function register(req, res, next) {
  try {
    const { phone, email, name, password } = req.body;

    // Validate input
    if (!phone || !name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone, name, and password are required'
      });
    }

    // Check if user exists
    const existingUser = await query('SELECT id FROM users WHERE phone = $1', [phone]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this phone number'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await query(
      'INSERT INTO users (phone, email, name, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, phone, email, name, created_at',
      [phone, email || null, name, passwordHash]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          phone: user.phone,
          email: user.email,
          name: user.name
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
}

// Login
async function login(req, res, next) {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone and password are required'
      });
    }

    // Get user
    const result = await query('SELECT id, phone, email, name, password_hash, is_kyc_verified FROM users WHERE phone = $1', [phone]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          phone: user.phone,
          email: user.email,
          name: user.name,
          is_kyc_verified: user.is_kyc_verified
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
}

// Send OTP (simplified - in production use SMS service)
async function sendOTP(req, res, next) {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in Redis (expires in 5 minutes)
    await setCache(`otp:${phone}`, otp, 300);

    // In production, send SMS via Twilio/msg91/etc.
    console.log(`OTP for ${phone}: ${otp}`);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      // In development, return OTP. Remove in production!
      ...(process.env.NODE_ENV === 'development' && { otp })
    });
  } catch (error) {
    next(error);
  }
}

// Verify OTP
async function verifyOTP(req, res, next) {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone and OTP are required'
      });
    }

    // Get OTP from cache
    const storedOTP = await getCache(`otp:${phone}`);

    if (!storedOTP || storedOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // OTP verified - can proceed with login/registration
    res.json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    next(error);
  }
}

// Refresh token
async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    // Generate new access token
    const newToken = generateToken(decoded.userId);

    res.json({
      success: true,
      data: { token: newToken }
    });
  } catch (error) {
    next(error);
  }
}

// Logout
async function logout(req, res, next) {
  try {
    const tokenId = req.token?.jti;
    
    if (tokenId) {
      // Blacklist token
      await query(
        'INSERT INTO user_sessions (user_id, token_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'7 days\')',
        [req.user.id, tokenId]
      );
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
}

// Helper function to generate JWT
function generateToken(userId) {
  const tokenId = uuidv4();
  const token = jwt.sign(
    { userId, jti: tokenId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  return token;
}

module.exports = {
  register,
  login,
  sendOTP,
  verifyOTP,
  refreshToken,
  logout
};

