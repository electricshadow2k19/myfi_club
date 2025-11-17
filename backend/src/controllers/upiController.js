const { v4: uuidv4 } = require('uuid');
const { query } = require('../database/connection');

// Create UPI ID
async function createUPI(req, res, next) {
  try {
    const userId = req.user.id;
    const { upi_id } = req.body;

    // In production, integrate with UPI PSP partner
    // For now, return success
    res.json({
      success: true,
      message: 'UPI ID created successfully',
      data: { upi_id: upi_id || `${req.user.phone}@myfi` }
    });
  } catch (error) {
    next(error);
  }
}

// Send money via UPI
async function sendMoney(req, res, next) {
  try {
    const userId = req.user.id;
    const { recipient_upi, amount, description } = req.body;

    if (!recipient_upi || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid recipient UPI and amount are required'
      });
    }

    const transactionId = uuidv4();
    const pspReferenceId = `PSP${Date.now()}`;

    // In production, call UPI PSP API
    const result = await query(
      `INSERT INTO upi_transactions (user_id, transaction_id, upi_id, amount, type, status, recipient_upi, description, psp_reference_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [userId, transactionId, `${req.user.phone}@myfi`, amount, 'send', 'success', recipient_upi, description || '', pspReferenceId]
    );

    res.json({
      success: true,
      message: 'Payment sent successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

// Request money via UPI
async function requestMoney(req, res, next) {
  try {
    const userId = req.user.id;
    const { sender_upi, amount, description } = req.body;

    if (!sender_upi || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid sender UPI and amount are required'
      });
    }

    const transactionId = uuidv4();

    const result = await query(
      `INSERT INTO upi_transactions (user_id, transaction_id, upi_id, amount, type, status, recipient_upi, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, transactionId, `${req.user.phone}@myfi`, amount, 'receive', 'pending', sender_upi, description || '']
    );

    res.json({
      success: true,
      message: 'Payment request sent',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

// Get transaction history
async function getTransactions(req, res, next) {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    const result = await query(
      `SELECT * FROM upi_transactions 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
}

// Get transaction details
async function getTransactionDetails(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await query(
      'SELECT * FROM upi_transactions WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUPI,
  sendMoney,
  requestMoney,
  getTransactions,
  getTransactionDetails
};

