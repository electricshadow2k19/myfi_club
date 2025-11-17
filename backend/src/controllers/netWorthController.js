const { query } = require('../database/connection');

// Get current net worth
async function getCurrentNetWorth(req, res, next) {
  try {
    const userId = req.user.id;

    // Get bank balances
    const bankResult = await query(
      'SELECT COALESCE(SUM(balance), 0) as total FROM bank_accounts WHERE user_id = $1 AND is_active = true',
      [userId]
    );
    const bankBalance = parseFloat(bankResult.rows[0].total) || 0;

    // Get MF investments value
    const mfResult = await query(
      'SELECT COALESCE(SUM(current_value), 0) as total FROM mutual_fund_investments WHERE user_id = $1 AND status = $2',
      [userId, 'active']
    );
    const mfValue = parseFloat(mfResult.rows[0].total) || 0;

    // Get gold value
    const goldResult = await query(
      'SELECT COALESCE(SUM(current_value), 0) as total FROM gold_holdings WHERE user_id = $1 AND status = $2',
      [userId, 'active']
    );
    const goldValue = parseFloat(goldResult.rows[0].total) || 0;

    const totalAssets = bankBalance + mfValue + goldValue;
    const totalLiabilities = 0; // Add loan calculations later

    const netWorth = totalAssets - totalLiabilities;

    // Save snapshot
    await query(
      `INSERT INTO net_worth_snapshots (user_id, total_assets, total_liabilities, net_worth, breakdown, snapshot_date)
       VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)`,
      [userId, totalAssets, totalLiabilities, netWorth, JSON.stringify({
        bank_balance: bankBalance,
        mutual_funds: mfValue,
        gold: goldValue
      })]
    );

    res.json({
      success: true,
      data: {
        net_worth: netWorth,
        total_assets: totalAssets,
        total_liabilities: totalLiabilities,
        breakdown: {
          bank_balance: bankBalance,
          mutual_funds: mfValue,
          gold: goldValue
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

// Get net worth history
async function getNetWorthHistory(req, res, next) {
  try {
    const userId = req.user.id;
    const { limit = 30 } = req.query;

    const result = await query(
      `SELECT * FROM net_worth_snapshots 
       WHERE user_id = $1 
       ORDER BY snapshot_date DESC 
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

// Add bank account
async function addBankAccount(req, res, next) {
  try {
    const userId = req.user.id;
    const { bank_name, account_number, ifsc_code, account_type, balance } = req.body;

    if (!bank_name) {
      return res.status(400).json({
        success: false,
        message: 'Bank name is required'
      });
    }

    const result = await query(
      `INSERT INTO bank_accounts (user_id, bank_name, account_number, ifsc_code, account_type, balance)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, bank_name, account_number || null, ifsc_code || null, account_type || 'savings', balance || 0]
    );

    res.json({
      success: true,
      message: 'Bank account added successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

// Update bank account balance
async function updateBankAccount(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { balance } = req.body;

    const result = await query(
      `UPDATE bank_accounts SET balance = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 AND user_id = $3 
       RETURNING *`,
      [balance, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bank account not found'
      });
    }

    res.json({
      success: true,
      message: 'Bank account updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

// Get all assets
async function getAllAssets(req, res, next) {
  try {
    const userId = req.user.id;

    const [bankAccounts, mfInvestments, goldHoldings] = await Promise.all([
      query('SELECT * FROM bank_accounts WHERE user_id = $1 AND is_active = true', [userId]),
      query('SELECT * FROM mutual_fund_investments WHERE user_id = $1 AND status = $2', [userId, 'active']),
      query('SELECT * FROM gold_holdings WHERE user_id = $1 AND status = $2', [userId, 'active'])
    ]);

    res.json({
      success: true,
      data: {
        bank_accounts: bankAccounts.rows,
        mutual_funds: mfInvestments.rows,
        gold: goldHoldings.rows
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCurrentNetWorth,
  getNetWorthHistory,
  addBankAccount,
  updateBankAccount,
  getAllAssets
};

