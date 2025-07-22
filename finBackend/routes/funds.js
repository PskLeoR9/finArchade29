const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Mock fund data - In real implementation, integrate with mutual fund APIs
const mockFunds = [
  {
    id: 1,
    name: 'HDFC Top 100 Fund',
    category: 'Large Cap',
    nav: 712.30,
    change: 5.23,
    changePercent: 0.74,
    rating: 5,
    aum: 25000,
    expenseRatio: 1.25,
    returns: {
      '1y': 12.5,
      '3y': 15.2,
      '5y': 11.8,
      '10y': 13.4
    },
    manager: 'Chirag Setalvad',
    riskLevel: 'Medium',
    minSIP: 500,
    minLumpsum: 5000,
    exitLoad: '1% if redeemed within 365 days',
    launchDate: '2000-01-01',
    benchmark: 'Nifty 100 TRI',
    holdings: [
      { name: 'Reliance Industries', percentage: 8.5 },
      { name: 'HDFC Bank', percentage: 7.2 },
      { name: 'Infosys', percentage: 6.8 }
    ]
  },
  {
    id: 2,
    name: 'SBI Bluechip Fund',
    category: 'Large Cap',
    nav: 58.42,
    change: -0.87,
    changePercent: -1.47,
    rating: 4,
    aum: 18500,
    expenseRatio: 1.68,
    returns: {
      '1y': 10.8,
      '3y': 13.5,
      '5y': 9.2,
      '10y': 11.5
    },
    manager: 'Dinesh Ahuja',
    riskLevel: 'Medium',
    minSIP: 500,
    minLumpsum: 5000,
    exitLoad: '1% if redeemed within 365 days',
    launchDate: '2006-02-15',
    benchmark: 'BSE 100 TRI'
  },
  {
    id: 3,
    name: 'Axis Mid Cap Fund',
    category: 'Mid Cap',
    nav: 68.23,
    change: 1.45,
    changePercent: 2.17,
    rating: 4,
    aum: 8900,
    expenseRatio: 1.85,
    returns: {
      '1y': 18.5,
      '3y': 22.1,
      '5y': 16.8,
      '10y': 19.2
    },
    manager: 'Shreyash Devalkar',
    riskLevel: 'High',
    minSIP: 500,
    minLumpsum: 5000,
    exitLoad: '1% if redeemed within 365 days',
    launchDate: '2005-12-30',
    benchmark: 'Nifty Midcap 100 TRI'
  },
  {
    id: 4,
    name: 'Mirae Asset Emerging Bluechip Fund',
    category: 'Large & Mid Cap',
    nav: 89.45,
    change: 2.34,
    changePercent: 2.68,
    rating: 5,
    aum: 15600,
    expenseRatio: 1.89,
    returns: {
      '1y': 16.8,
      '3y': 19.4,
      '5y': 15.2,
      '10y': 17.8
    },
    manager: 'Neelesh Surana',
    riskLevel: 'High',
    minSIP: 1000,
    minLumpsum: 5000,
    exitLoad: '1% if redeemed within 365 days',
    launchDate: '2010-07-02',
    benchmark: 'Nifty Large Midcap 250 TRI'
  }
];

// Get all funds with filtering
router.get('/', auth, async (req, res) => {
  try {
    const {
      category,
      rating,
      expenseRatio,
      returnPeriod,
      minReturn,
      maxReturn,
      sortBy,
      sortOrder
    } = req.query;

    let filteredFunds = [...mockFunds];

    // Apply filters
    if (category) {
      filteredFunds = filteredFunds.filter(fund => 
        fund.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (rating) {
      filteredFunds = filteredFunds.filter(fund => 
        fund.rating >= parseInt(rating)
      );
    }

    if (expenseRatio) {
      filteredFunds = filteredFunds.filter(fund => 
        fund.expenseRatio <= parseFloat(expenseRatio)
      );
    }

    if (returnPeriod && minReturn) {
      filteredFunds = filteredFunds.filter(fund => 
        fund.returns[returnPeriod] >= parseFloat(minReturn)
      );
    }

    if (returnPeriod && maxReturn) {
      filteredFunds = filteredFunds.filter(fund => 
        fund.returns[returnPeriod] <= parseFloat(maxReturn)
      );
    }

    // Apply sorting
    if (sortBy) {
      filteredFunds.sort((a, b) => {
        let aValue, bValue;
        
        if (sortBy === 'returns') {
          aValue = a.returns[returnPeriod || '1y'];
          bValue = b.returns[returnPeriod || '1y'];
        } else if (sortBy === 'nav') {
          aValue = a.nav;
          bValue = b.nav;
        } else if (sortBy === 'rating') {
          aValue = a.rating;
          bValue = b.rating;
        } else if (sortBy === 'aum') {
          aValue = a.aum;
          bValue = b.aum;
        } else {
          aValue = a[sortBy];
          bValue = b[sortBy];
        }

        if (sortOrder === 'desc') {
          return bValue - aValue;
        }
        return aValue - bValue;
      });
    }

    res.json({
      success: true,
      data: filteredFunds,
      count: filteredFunds.length,
      filters: {
        category,
        rating,
        expenseRatio,
        returnPeriod,
        minReturn,
        maxReturn
      }
    });
  } catch (error) {
    console.error('Get funds error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch funds',
      error: error.message
    });
  }
});

// Get fund details by ID
router.get('/:fundId', auth, async (req, res) => {
  try {
    const { fundId } = req.params;
    
    const fund = mockFunds.find(f => f.id === parseInt(fundId));

    if (!fund) {
      return res.status(404).json({
        success: false,
        message: 'Fund not found'
      });
    }

    // Add historical NAV data (mock)
    const historicalNav = generateHistoricalNav(fund.nav);
    
    // Add detailed analysis
    const analysis = {
      ...fund,
      historicalNav,
      analysis: {
        recommendation: fund.rating >= 4 ? 'BUY' : fund.rating >= 3 ? 'HOLD' : 'SELL',
        strengths: getFundStrengths(fund),
        risks: getFundRisks(fund),
        suitability: getFundSuitability(fund)
      },
      comparison: {
        category: fund.category,
        peerFunds: mockFunds
          .filter(f => f.category === fund.category && f.id !== fund.id)
          .slice(0, 3)
          .map(f => ({
            name: f.name,
            nav: f.nav,
            returns: f.returns,
            rating: f.rating
          }))
      }
    };

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Get fund details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch fund details',
      error: error.message
    });
  }
});

// Get fund categories
router.get('/categories/list', auth, async (req, res) => {
  try {
    const categories = [
      'Large Cap',
      'Mid Cap',
      'Small Cap',
      'Multi Cap',
      'Flexi Cap',
      'Large & Mid Cap',
      'ELSS',
      'Debt',
      'Hybrid',
      'International',
      'Sectoral',
      'Thematic',
      'Index'
    ];

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// Compare funds
router.post('/compare', auth, async (req, res) => {
  try {
    const { fundIds } = req.body;

    if (!fundIds || !Array.isArray(fundIds) || fundIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Fund IDs are required'
      });
    }

    const funds = mockFunds.filter(fund => fundIds.includes(fund.id));

    if (funds.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No funds found'
      });
    }

    const comparison = {
      funds: funds.map(fund => ({
        id: fund.id,
        name: fund.name,
        category: fund.category,
        nav: fund.nav,
        rating: fund.rating,
        expenseRatio: fund.expenseRatio,
        returns: fund.returns,
        riskLevel: fund.riskLevel,
        aum: fund.aum,
        manager: fund.manager
      })),
      metrics: {
        bestReturns: {
          '1y': funds.reduce((best, fund) => 
            fund.returns['1y'] > best.returns['1y'] ? fund : best
          ),
          '3y': funds.reduce((best, fund) => 
            fund.returns['3y'] > best.returns['3y'] ? fund : best
          ),
          '5y': funds.reduce((best, fund) => 
            fund.returns['5y'] > best.returns['5y'] ? fund : best
          )
        },
        lowestExpense: funds.reduce((lowest, fund) => 
          fund.expenseRatio < lowest.expenseRatio ? fund : lowest
        ),
        highestRating: funds.reduce((highest, fund) => 
          fund.rating > highest.rating ? fund : highest
        )
      }
    };

    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    console.error('Compare funds error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to compare funds',
      error: error.message
    });
  }
});

// Get fund recommendations
router.get('/recommendations/personalized', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const recommendations = generatePersonalizedRecommendations(user, mockFunds);

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations',
      error: error.message
    });
  }
});

// Search funds
router.get('/search/:query', auth, async (req, res) => {
  try {
    const { query } = req.params;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchResults = mockFunds.filter(fund => 
      fund.name.toLowerCase().includes(query.toLowerCase()) ||
      fund.category.toLowerCase().includes(query.toLowerCase()) ||
      fund.manager.toLowerCase().includes(query.toLowerCase())
    );

    res.json({
      success: true,
      data: searchResults,
      count: searchResults.length
    });
  } catch (error) {
    console.error('Search funds error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search funds',
      error: error.message
    });
  }
});

// Helper functions
function generateHistoricalNav(currentNav) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const baseNav = currentNav * 0.9; // Start 10% lower
  
  return months.map((month, index) => ({
    month,
    value: parseFloat((baseNav * (1 + (index * 0.02) + (Math.random() - 0.5) * 0.05)).toFixed(2))
  }));
}

function getFundStrengths(fund) {
  const strengths = [];
  
  if (fund.rating >= 4) strengths.push('High rating from analysts');
  if (fund.expenseRatio < 1.5) strengths.push('Low expense ratio');
  if (fund.returns['3y'] > 15) strengths.push('Strong 3-year performance');
  if (fund.aum > 10000) strengths.push('Large AUM indicating investor confidence');
  if (fund.returns['1y'] > 12) strengths.push('Good recent performance');
  
  return strengths.length > 0 ? strengths : ['Consistent performance'];
}

function getFundRisks(fund) {
  const risks = [];
  
  if (fund.riskLevel === 'High') risks.push('High volatility');
  if (fund.expenseRatio > 2) risks.push('High expense ratio');
  if (fund.returns['1y'] < 5) risks.push('Poor recent performance');
  if (fund.aum < 5000) risks.push('Small AUM');
  
  return risks.length > 0 ? risks : ['Market risk', 'Sector concentration risk'];
}

function getFundSuitability(fund) {
  const suitability = [];
  
  if (fund.category === 'Large Cap') {
    suitability.push('Conservative investors');
    suitability.push('First-time investors');
  } else if (fund.category === 'Mid Cap') {
    suitability.push('Moderate to aggressive investors');
    suitability.push('Long-term wealth creation');
  } else if (fund.category === 'Small Cap') {
    suitability.push('High risk tolerance investors');
    suitability.push('Long investment horizon');
  }
  
  return suitability.length > 0 ? suitability : ['General investors'];
}

function generatePersonalizedRecommendations(user, funds) {
  const recommendations = [];
  
  // Based on risk tolerance
  const riskBasedFunds = funds.filter(fund => {
    if (user.riskTolerance === 'conservative') {
      return fund.riskLevel === 'Low' || fund.riskLevel === 'Medium';
    } else if (user.riskTolerance === 'moderate') {
      return fund.riskLevel === 'Medium';
    } else {
      return fund.riskLevel === 'High';
    }
  });

  // Based on investment goals
  if (user.investmentGoals?.includes('Tax Saving')) {
    recommendations.push({
      category: 'Tax Saving',
      title: 'ELSS Funds for Tax Benefits',
      description: 'These funds offer tax deduction under Section 80C',
      funds: funds.filter(fund => fund.category === 'ELSS').slice(0, 3)
    });
  }

  if (user.investmentGoals?.includes('Wealth Creation')) {
    recommendations.push({
      category: 'Wealth Creation',
      title: 'High Growth Equity Funds',
      description: 'Suitable for long-term wealth building',
      funds: riskBasedFunds.filter(fund => fund.returns['5y'] > 12).slice(0, 3)
    });
  }

  return recommendations;
}

module.exports = router;
