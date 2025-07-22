const express = require('express');
const auth = require('../middleware/auth');
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');

const router = express.Router();

// Get user's portfolio
router.get('/', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.userId })
      .populate('userId', 'firstName lastName email');

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    res.json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolio',
      error: error.message
    });
  }
});

// Create or update portfolio
router.post('/', auth, async (req, res) => {
  try {
    const { holdings } = req.body;

    let portfolio = await Portfolio.findOne({ userId: req.userId });

    if (portfolio) {
      // Update existing portfolio
      portfolio.holdings = holdings;
      await portfolio.save();
    } else {
      // Create new portfolio
      portfolio = new Portfolio({
        userId: req.userId,
        holdings: holdings || []
      });
      await portfolio.save();
    }

    res.json({
      success: true,
      message: 'Portfolio updated successfully',
      data: portfolio
    });
  } catch (error) {
    console.error('Create/Update portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update portfolio',
      error: error.message
    });
  }
});

// Add holding to portfolio
router.post('/holdings', auth, async (req, res) => {
  try {
    const { symbol, name, type, quantity, avgPrice, currentPrice, sector, exchange } = req.body;

    // Validate required fields
    if (!symbol || !name || !type || !quantity || !avgPrice) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    let portfolio = await Portfolio.findOne({ userId: req.userId });

    if (!portfolio) {
      portfolio = new Portfolio({
        userId: req.userId,
        holdings: []
      });
    }

    // Check if holding already exists
    const existingHoldingIndex = portfolio.holdings.findIndex(
      holding => holding.symbol === symbol
    );

    const newHolding = {
      symbol,
      name,
      type,
      quantity: parseFloat(quantity),
      avgPrice: parseFloat(avgPrice),
      currentPrice: parseFloat(currentPrice || avgPrice),
      sector,
      exchange
    };

    if (existingHoldingIndex > -1) {
      // Update existing holding
      const existingHolding = portfolio.holdings[existingHoldingIndex];
      const totalQuantity = existingHolding.quantity + parseFloat(quantity);
      const totalValue = (existingHolding.quantity * existingHolding.avgPrice) + 
                        (parseFloat(quantity) * parseFloat(avgPrice));
      
      portfolio.holdings[existingHoldingIndex] = {
        ...existingHolding,
        quantity: totalQuantity,
        avgPrice: totalValue / totalQuantity,
        currentPrice: parseFloat(currentPrice || avgPrice)
      };
    } else {
      // Add new holding
      portfolio.holdings.push(newHolding);
    }

    await portfolio.save();

    res.json({
      success: true,
      message: 'Holding added successfully',
      data: portfolio
    });
  } catch (error) {
    console.error('Add holding error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add holding',
      error: error.message
    });
  }
});

// Update holding in portfolio
router.put('/holdings/:holdingId', auth, async (req, res) => {
  try {
    const { holdingId } = req.params;
    const { quantity, avgPrice, currentPrice } = req.body;

    const portfolio = await Portfolio.findOne({ userId: req.userId });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    const holdingIndex = portfolio.holdings.findIndex(
      holding => holding._id.toString() === holdingId
    );

    if (holdingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Holding not found'
      });
    }

    // Update holding
    if (quantity !== undefined) {
      portfolio.holdings[holdingIndex].quantity = parseFloat(quantity);
    }
    if (avgPrice !== undefined) {
      portfolio.holdings[holdingIndex].avgPrice = parseFloat(avgPrice);
    }
    if (currentPrice !== undefined) {
      portfolio.holdings[holdingIndex].currentPrice = parseFloat(currentPrice);
    }

    portfolio.holdings[holdingIndex].lastUpdated = new Date();

    await portfolio.save();

    res.json({
      success: true,
      message: 'Holding updated successfully',
      data: portfolio
    });
  } catch (error) {
    console.error('Update holding error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update holding',
      error: error.message
    });
  }
});

// Delete holding from portfolio
router.delete('/holdings/:holdingId', auth, async (req, res) => {
  try {
    const { holdingId } = req.params;

    const portfolio = await Portfolio.findOne({ userId: req.userId });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    portfolio.holdings = portfolio.holdings.filter(
      holding => holding._id.toString() !== holdingId
    );

    await portfolio.save();

    res.json({
      success: true,
      message: 'Holding deleted successfully',
      data: portfolio
    });
  } catch (error) {
    console.error('Delete holding error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete holding',
      error: error.message
    });
  }
});

// Get portfolio analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.userId });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    // Calculate analytics
    const analytics = {
      totalValue: portfolio.currentValue,
      totalInvestment: portfolio.totalInvestment,
      gainLoss: portfolio.totalGainLoss,
      gainLossPercent: portfolio.totalGainLossPercent,
      allocation: portfolio.allocation,
      topPerformers: portfolio.holdings
        .map(holding => ({
          symbol: holding.symbol,
          name: holding.name,
          gainLoss: (holding.currentPrice - holding.avgPrice) * holding.quantity,
          gainLossPercent: ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100
        }))
        .sort((a, b) => b.gainLoss - a.gainLoss)
        .slice(0, 5),
      sectorDistribution: calculateSectorDistribution(portfolio.holdings),
      monthlyPerformance: generateMonthlyPerformance(portfolio)
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Portfolio analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolio analytics',
      error: error.message
    });
  }
});

// Sync portfolio with external data
router.post('/sync', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.userId });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    // Mock sync with external API for current prices
    // In real implementation, integrate with actual stock API
    for (let holding of portfolio.holdings) {
      // Simulate price update (±5% variation)
      const variation = (Math.random() - 0.5) * 0.1;
      holding.currentPrice = holding.avgPrice * (1 + variation);
      holding.lastUpdated = new Date();
    }

    await portfolio.save();

    res.json({
      success: true,
      message: 'Portfolio synced successfully',
      data: portfolio
    });
  } catch (error) {
    console.error('Portfolio sync error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync portfolio',
      error: error.message
    });
  }
});

// Helper functions
function calculateSectorDistribution(holdings) {
  const sectorMap = {};
  let totalValue = 0;

  holdings.forEach(holding => {
    const value = holding.quantity * holding.currentPrice;
    const sector = holding.sector || 'Others';
    
    if (sectorMap[sector]) {
      sectorMap[sector] += value;
    } else {
      sectorMap[sector] = value;
    }
    totalValue += value;
  });

  return Object.entries(sectorMap).map(([sector, value]) => ({
    sector,
    value: parseFloat(((value / totalValue) * 100).toFixed(2))
  }));
}

function generateMonthlyPerformance(portfolio) {
  // Mock monthly performance data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const baseValue = portfolio.totalInvestment;
  
  return months.map((month, index) => ({
    month,
    value: baseValue * (1 + (index * 0.02) + (Math.random() - 0.5) * 0.05)
  }));
}

module.exports = router;
