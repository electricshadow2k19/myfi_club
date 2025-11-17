const { query } = require('../database/connection');

// Fetch credit score
async function fetchCreditScore(req, res, next) {
  try {
    const userId = req.user.id;
    const { provider = 'crif' } = req.body;

    // In production, call CRIF/Experian API
    // For now, return mock data
    const score = Math.floor(650 + Math.random() * 150); // 650-800

    const result = await query(
      `INSERT INTO credit_scores (user_id, score, provider, report_date, factors)
       VALUES ($1, $2, $3, CURRENT_DATE, $4)
       RETURNING *`,
      [userId, score, provider, JSON.stringify({
        payment_history: 'Good',
        credit_utilization: 'Low',
        credit_age: 'Average'
      })]
    );

    res.json({
      success: true,
      message: 'Credit score fetched successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

// Get credit score history
async function getCreditScoreHistory(req, res, next) {
  try {
    const userId = req.user.id;
    const { limit = 12 } = req.query;

    const result = await query(
      `SELECT * FROM credit_scores 
       WHERE user_id = $1 
       ORDER BY report_date DESC 
       LIMIT $2`,
      [userId, limit]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
}

// Get latest credit score
async function getLatestCreditScore(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT * FROM credit_scores 
       WHERE user_id = $1 
       ORDER BY report_date DESC 
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No credit score found. Please fetch your credit score first.'
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
  fetchCreditScore,
  getCreditScoreHistory,
  getLatestCreditScore
};

