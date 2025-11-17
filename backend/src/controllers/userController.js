const { query } = require('../database/connection');

async function getProfile(req, res, next) {
  try {
    const userId = req.user.id;
    
    const result = await query(
      'SELECT id, phone, email, name, is_kyc_verified, kyc_status, pan_number, date_of_birth, created_at FROM users WHERE id = $1',
      [userId]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, email, date_of_birth } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (email) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }
    if (date_of_birth) {
      updates.push(`date_of_birth = $${paramCount++}`);
      values.push(date_of_birth);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userId);

    const result = await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, phone, email, name, date_of_birth`,
      values
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

async function submitKYC(req, res, next) {
  try {
    const userId = req.user.id;
    const { pan_number, aadhaar_number, date_of_birth } = req.body;

    if (!pan_number || !aadhaar_number || !date_of_birth) {
      return res.status(400).json({
        success: false,
        message: 'PAN, Aadhaar, and Date of Birth are required'
      });
    }

    // In production, integrate with KYC service provider
    const result = await query(
      'UPDATE users SET pan_number = $1, aadhaar_number = $2, date_of_birth = $3, kyc_status = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING id, kyc_status',
      [pan_number, aadhaar_number, date_of_birth, 'pending', userId]
    );

    res.json({
      success: true,
      message: 'KYC submitted successfully. Verification in progress.',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

async function getKYCStatus(req, res, next) {
  try {
    const userId = req.user.id;
    
    const result = await query(
      'SELECT kyc_status, is_kyc_verified, pan_number FROM users WHERE id = $1',
      [userId]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  submitKYC,
  getKYCStatus
};

