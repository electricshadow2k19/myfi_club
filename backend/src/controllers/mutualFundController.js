const { query } = require('../database/connection');

// Search mutual funds
async function searchFunds(req, res, next) {
  try {
    const { query: searchQuery } = req.query;

    // In production, call BSE Star MF API
    // Mock data for now
    const funds = [
      {
        scheme_code: 'SBI001',
        scheme_name: 'SBI Bluechip Fund',
        category: 'Large Cap',
        nav: 85.50,
        returns_1y: 12.5
      },
      {
        scheme_code: 'HDFC002',
        scheme_name: 'HDFC Equity Fund',
        category: 'Large Cap',
        nav: 120.30,
        returns_1y: 15.2
      }
    ];

    res.json({
      success: true,
      data: funds
    });
  } catch (error) {
    next(error);
  }
}

// Get fund details
async function getFundDetails(req, res, next) {
  try {
    const { schemeCode } = req.params;

    // In production, call BSE Star MF API
    res.json({
      success: true,
      data: {
        scheme_code: schemeCode,
        scheme_name: 'Sample Mutual Fund',
        nav: 85.50,
        category: 'Large Cap',
        returns_1y: 12.5,
        returns_3y: 18.2,
        returns_5y: 20.5
      }
    });
  } catch (error) {
    next(error);
  }
}

// Create SIP
async function createSIP(req, res, next) {
  try {
    const userId = req.user.id;
    const { scheme_code, scheme_name, amount, sip_date } = req.body;

    if (!scheme_code || !amount || amount < 500) {
      return res.status(400).json({
        success: false,
        message: 'Valid scheme code and amount (min ₹500) are required'
      });
    }

    // Calculate next SIP date
    const today = new Date();
    const nextSipDate = new Date(today.getFullYear(), today.getMonth(), sip_date || today.getDate());

    const result = await query(
      `INSERT INTO mutual_fund_investments (user_id, scheme_code, scheme_name, investment_type, amount, sip_date, next_sip_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, scheme_code, scheme_name, 'sip', amount, sip_date || today.getDate(), nextSipDate, 'active']
    );

    res.json({
      success: true,
      message: 'SIP created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

// Create Lumpsum investment
async function createLumpsum(req, res, next) {
  try {
    const userId = req.user.id;
    const { scheme_code, scheme_name, amount, nav } = req.body;

    if (!scheme_code || !amount || amount < 1000) {
      return res.status(400).json({
        success: false,
        message: 'Valid scheme code and amount (min ₹1000) are required'
      });
    }

    const units = nav ? (amount / nav) : 0;

    const result = await query(
      `INSERT INTO mutual_fund_investments (user_id, scheme_code, scheme_name, investment_type, amount, units, nav, current_value, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [userId, scheme_code, scheme_name, 'lumpsum', amount, units, nav || 0, amount, 'active']
    );

    res.json({
      success: true,
      message: 'Investment created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

// Get user investments
async function getUserInvestments(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await query(
      'SELECT * FROM mutual_fund_investments WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
}

// Pause SIP
async function pauseSIP(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await query(
      `UPDATE mutual_fund_investments SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 AND user_id = $3 AND investment_type = $4
       RETURNING *`,
      ['paused', id, userId, 'sip']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'SIP not found'
      });
    }

    res.json({
      success: true,
      message: 'SIP paused successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

// Stop SIP
async function stopSIP(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await query(
      `UPDATE mutual_fund_investments SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 AND user_id = $3 AND investment_type = $4
       RETURNING *`,
      ['stopped', id, userId, 'sip']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'SIP not found'
      });
    }

    res.json({
      success: true,
      message: 'SIP stopped successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  searchFunds,
  getFundDetails,
  createSIP,
  createLumpsum,
  getUserInvestments,
  pauseSIP,
  stopSIP
};

