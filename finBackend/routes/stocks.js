// routes/stocks.js
const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Mock stock data - In real implementation, integrate with financial APIs
const mockStocks = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    price: 2456.75,
    change: 23.45,
    changePercent: 0.96,
    marketCap: 1659234,
    peRatio: 28.5,
    sector: 'Energy',
    rating: 4,
    fundamentals: {
      eps: 86.23,
      bookValue: 1289.45,
      dividend: 0.68,
      roe: 12.5,
      debtToEquity: 0.42
    }
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    price: 3234.50,
    change: -12.30,
    changePercent: -0.38,
    marketCap: 1178945,
    peRatio: 25.2,
    sector: 'Technology',
    rating: 5,
    fundamentals: {
      eps: 128.45,
      bookValue: 456.78,
      dividend: 1.25,
      roe: 18.7,
      debtToEquity: 0.08
    }
  }
];

// Get stock screener results
router.get('/screener', auth, async (req, res) => {
  try {
    const {
      marketCap,
      sector,
      peRatioMin,
      peRatioMax,
      priceMin,
      priceMax,
      minRating
    } = req.query;

    let filteredStocks = [...mockStocks];

    // Apply filters
    if (sector) {
      filteredStocks = filteredStocks.filter(stock => 
        stock.sector.toLowerCase() === sector.toLowerCase()
      );
    }

    if (peRatioMin) {
      filteredStocks = filteredStocks.filter(stock => 
        stock.peRatio >= parseFloat(peRatioMin)
      );
    }

    if (peRatioMax) {
      filteredStocks = filteredStocks.filter(stock => 
        stock.peRatio <= parseFloat(peRatioMax)
      );
    }

    if (priceMin) {
      filteredStocks = filteredStocks.filter(stock => 
        stock.price >= parseFloat(priceMin)
      );
    }

    if (priceMax) {
      filteredStocks = filteredStocks.filter(stock => 
        stock.price <= parseFloat(priceMax)
      );
    }

    if (minRating) {
      filteredStocks = filteredStocks.filter(stock => 
        stock.rating >= parseInt(minRating)
      );
    }

    res.json({
      success: true,
      data: filteredStocks,
      count: filteredStocks.length
    });
  } catch (error) {
    console.error('Stock screener error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stock data',
      error: error.message
    });
  }
});

// Get detailed stock information
router.get('/:symbol', auth, async (req, res) => {
  try {
    const { symbol } = req.params;
    
    const stock = mockStocks.find(s => 
      s.symbol.toLowerCase() === symbol.toLowerCase()
    );

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found'
      });
    }

    // Add historical data (mock)
    const historicalData = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const basePrice = stock.price;
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      
      historicalData.push({
        date: date.toISOString().split('T')[0],
        open: basePrice * (1 + variation),
        high: basePrice * (1 + variation + Math.random() * 0.02),
        low: basePrice * (1 + variation - Math.random() * 0.02),
        close: basePrice * (1 + variation),
        volume: Math.floor(Math.random() * 1000000) + 100000
      });
    }

    res.json({
      success: true,
      data: {
        ...stock,
        historicalData,
        analysis: {
          recommendation: stock.rating >= 4 ? 'BUY' : stock.rating >= 3 ? 'HOLD' : 'SELL',
          targetPrice: stock.price * (1 + (stock.rating - 3) * 0.1),
          analyst: {
            summary: generateStockAnalysis(stock),
            strengths: getStockStrengths(stock),
            risks: getStockRisks(stock)
          }
        }
      }
    });
  } catch (error) {
    console.error('Stock detail error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stock details',
      error: error.message
    });
  }
});

// Helper functions for stock analysis
function generateStockAnalysis(stock) {
  const analyses = {
    'RELIANCE': 'Strong fundamentals with diversified business portfolio. Leader in petrochemicals and expanding into digital services.',
    'TCS': 'Leading IT services company with strong client relationships and consistent growth. Well-positioned for digital transformation trends.'
  };
  
  return analyses[stock.symbol] || 'Solid company with good growth prospects based on current metrics.';
}

function getStockStrengths(stock) {
  const strengths = [];
  if (stock.peRatio < 30) strengths.push('Reasonable valuation');
  if (stock.fundamentals.roe > 15) strengths.push('Strong return on equity');
  if (stock.fundamentals.debtToEquity < 0.5) strengths.push('Low debt levels');
  if (stock.rating >= 4) strengths.push('High analyst rating');
  
  return strengths.length > 0 ? strengths : ['Stable business model'];
}

function getStockRisks(stock) {
  const risks = [];
  if (stock.peRatio > 35) risks.push('High valuation multiples');
  if (stock.changePercent < -5) risks.push('Recent price volatility');
  if (stock.fundamentals.debtToEquity > 0.7) risks.push('High debt burden');
  
  return risks.length > 0 ? risks : ['Market volatility', 'Sector-specific risks'];
}

module.exports = router;
