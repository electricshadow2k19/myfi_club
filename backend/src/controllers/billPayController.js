const { v4: uuidv4 } = require('uuid');
const { query } = require('../database/connection');

// Get billers list
async function getBillers(req, res, next) {
  try {
    // In production, fetch from BBPS API
    const billers = [
      { id: 'electricity', name: 'Electricity', category: 'utilities' },
      { id: 'gas', name: 'Gas', category: 'utilities' },
      { id: 'dth', name: 'DTH', category: 'entertainment' },
      { id: 'credit_card', name: 'Credit Card', category: 'finance' },
      { id: 'water', name: 'Water', category: 'utilities' }
    ];

    res.json({
      success: true,
      data: billers
    });
  } catch (error) {
    next(error);
  }
}

// Fetch bill details
async function fetchBill(req, res, next) {
  try {
    const { biller_id, customer_id } = req.body;

    if (!biller_id || !customer_id) {
      return res.status(400).json({
        success: false,
        message: 'Biller ID and Customer ID are required'
      });
    }

    // In production, call BBPS API to fetch bill
    res.json({
      success: true,
      data: {
        biller_id,
        customer_id,
        amount: 1000,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        bill_number: `BILL${Date.now()}`
      }
    });
  } catch (error) {
    next(error);
  }
}

// Pay bill
async function payBill(req, res, next) {
  try {
    const userId = req.user.id;
    const { biller_id, biller_name, bill_type, customer_id, amount } = req.body;

    if (!biller_id || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid biller and amount are required'
      });
    }

    const transactionId = uuidv4();
    const paymentRefId = `PAY${Date.now()}`;

    // In production, process payment via Razorpay/Juspay
    const result = await query(
      `INSERT INTO bill_payments (user_id, biller_id, biller_name, bill_type, customer_id, amount, status, payment_reference_id, transaction_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [userId, biller_id, biller_name || biller_id, bill_type || 'utility', customer_id, amount, 'paid', paymentRefId, transactionId]
    );

    res.json({
      success: true,
      message: 'Bill paid successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

// Get payment history
async function getPaymentHistory(req, res, next) {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    const result = await query(
      `SELECT * FROM bill_payments 
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

module.exports = {
  getBillers,
  fetchBill,
  payBill,
  getPaymentHistory
};

