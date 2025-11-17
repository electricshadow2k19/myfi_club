const jwt = require('jsonwebtoken');
const { query } = require('../database/connection');

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is blacklisted
    const sessionCheck = await query(
      'SELECT * FROM user_sessions WHERE token_id = $1 AND expires_at > NOW()',
      [decoded.jti]
    );

    if (sessionCheck.rows.length === 0 && decoded.jti) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token has been revoked' 
      });
    }

    // Get user details
    const userResult = await query('SELECT id, phone, email, name, is_kyc_verified FROM users WHERE id = $1', [decoded.userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    req.user = userResult.rows[0];
    req.token = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    next(error);
  }
}

module.exports = {
  authenticateToken
};

