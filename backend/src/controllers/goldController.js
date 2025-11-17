const { query } = require('../database/connection');

// Get current gold price
async function getGoldPrice(req, res, next) {
  try {
    // In production, fetch from MMTC-PAMP/SafeGold API
    // Mock data: Gold price per gram
    const pricePerGram = 6500 + Math.random() * 100; // ₹6500-6600

    res.json({
      success: true,
      data: {
        price_per_gram: Math.round(pricePerGram * 100) / 100,
        currency: 'INR',
        last_updated: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
}

// Buy digital gold
async function buyDigitalGold(req, res, next) {
  try {
    const userId = req.user.id;
    const { amount, quantity_grams } = req.body;

    if (!amount && !quantity_grams) {
      return res.status(400).json({
        success: false,
        message: 'Either amount or quantity in grams is required'
      });
    }

    // Get current gold price
    const pricePerGram = 6500; // Fetch from API in production
    const quantity = quantity_grams || (amount / pricePerGram);
    const purchasePrice = amount || (quantity * pricePerGram);

    const result = await query(
      `INSERT INTO gold_holdings (user_id, type, quantity_grams, purchase_price, current_price_per_gram, current_value, provider, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, 'digital', quantity, purchasePrice, pricePerGram, purchasePrice, 'safegold', 'active']
    );

    res.json({
      success: true,
      message: 'Digital gold purchased successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

// Buy physical gold
async function buyPhysicalGold(req, res, next) {
  try {
    const userId = req.user.id;
    const { amount, quantity_grams } = req.body;

    if (!amount && !quantity_grams) {
      return res.status(400).json({
        success: false,
        message: 'Either amount or quantity in grams is required'
      });
    }

    const pricePerGram = 6500;
    const quantity = quantity_grams || (amount / pricePerGram);
    const purchasePrice = amount || (quantity * pricePerGram);

    const result = await query(
      `INSERT INTO gold_holdings (user_id, type, quantity_grams, purchase_price, current_price_per_gram, current_value, provider, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, 'physical', quantity, purchasePrice, pricePerGram, purchasePrice, 'mmtc_pamp', 'active']
    );

    res.json({
      success: true,
      message: 'Physical gold order placed successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

// Sell gold
async function sellGold(req, res, next) {
  try {
    const userId = req.user.id;
    const { holding_id, quantity_grams } = req.body;

    if (!holding_id || !quantity_grams) {
      return res.status(400).json({
        success: false,
        message: 'Holding ID and quantity are required'
      });
    }

    // Get holding
    const holdingResult = await query(
      'SELECT * FROM gold_holdings WHERE id = $1 AND user_id = $2 AND status = $3',
      [holding_id, userId, 'active']
    );

    if (holdingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gold holding not found'
      });
    }

    const holding = holdingResult.rows[0];

    if (quantity_grams > holding.quantity_grams) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient gold quantity'
      });
    }

    // Update holding
    const remainingQuantity = holding.quantity_grams - quantity_grams;
    const sellPrice = (quantity_grams * holding.current_price_per_gram);

    if (remainingQuantity > 0) {
      await query(
        `UPDATE gold_holdings SET quantity_grams = $1, current_value = $2, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $3`,
        [remainingQuantity, remainingQuantity * holding.current_price_per_gram, holding_id]
      );
    } else {
      await query(
        `UPDATE gold_holdings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
        ['sold', holding_id]
      );
    }

    res.json({
      success: true,
      message: 'Gold sold successfully',
      data: {
        quantity_sold: quantity_grams,
        amount: sellPrice,
        remaining_quantity: remainingQuantity
      }
    });
  } catch (error) {
    next(error);
  }
}

// Get user gold holdings
async function getHoldings(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await query(
      'SELECT * FROM gold_holdings WHERE user_id = $1 AND status = $2 ORDER BY created_at DESC',
      [userId, 'active']
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
  getGoldPrice,
  buyDigitalGold,
  buyPhysicalGold,
  sellGold,
  getHoldings
};

