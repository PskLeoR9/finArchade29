// routes/ai.js
const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');

const router = express.Router();

// AI Chat endpoint
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Get user profile for personalized advice
    const user = await User.findById(req.userId);
    const portfolio = await Portfolio.findOne({ userId: req.userId });
    
    const response = await generateAIResponse(message, user, portfolio, context);
    
    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI response',
      error: error.message
    });
  }
});

// Portfolio analysis endpoint
router.get('/portfolio-analysis', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const portfolio = await Portfolio.findOne({ userId: req.userId });
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }
    
    const analysis = generatePortfolioAnalysis(portfolio, user);
    
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Portfolio analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze portfolio',
      error: error.message
    });
  }
});

// Investment recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const portfolio = await Portfolio.findOne({ userId: req.userId });
    
    const recommendations = generateRecommendations(user, portfolio);
    
    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      error: error.message
    });
  }
});

// Helper function to generate AI responses
async function generateAIResponse(message, user, portfolio, context) {
  const lowerMessage = message.toLowerCase();
  
  // Portfolio-related queries
  if (lowerMessage.includes('portfolio') || lowerMessage.includes('allocation')) {
    if (!portfolio) {
      return "I see you haven't set up your portfolio yet. Let's start by adding your current investments so I can provide personalized advice.";
    }
    
    const allocation = portfolio.allocation;
    return `Your current portfolio allocation is ${allocation.stocks}% stocks, ${allocation.mutualFunds}% mutual funds, and ${allocation.bonds}% bonds. Based on your ${user.riskTolerance} risk tolerance, I recommend optimizing your allocation for better diversification.`;
  }
  
  // Risk-based recommendations
  if (lowerMessage.includes('risk') || lowerMessage.includes('safe')) {
    const riskAdvice = getRiskBasedAdvice(user.riskTolerance);
    return riskAdvice;
  }
  
  // Goal-based planning
  if (lowerMessage.includes('goal') || lowerMessage.includes('plan')) {
    const goals = user.investmentGoals || [];
    if (goals.length === 0) {
      return "Let's set up your investment goals first. What are you looking to achieve - retirement planning, wealth creation, tax saving, or something else?";
    }
    
    return `Based on your goals of ${goals.join(', ')}, I recommend a diversified approach with a mix of equity and debt instruments. Would you like specific fund recommendations?`;
  }
  
  // Mutual fund queries
  if (lowerMessage.includes('mutual fund') || lowerMessage.includes('sip')) {
    return getMutualFundAdvice(user.riskTolerance, user.investmentGoals);
  }
  
  // Stock queries
  if (lowerMessage.includes('stock') || lowerMessage.includes('equity')) {
    return getStockAdvice(user.riskTolerance);
  }
  
  // Tax planning
  if (lowerMessage.includes('tax') || lowerMessage.includes('80c')) {
    return "For tax savings under Section 80C, consider ELSS funds which offer equity growth potential with tax benefits. PPF and NSC are also good options for conservative investors.";
  }
  
  // Default response
  return "I can help you with portfolio analysis, investment recommendations, mutual fund selection, stock advice, and financial planning. What specific area would you like assistance with?";
}

function getRiskBasedAdvice(riskTolerance) {
  const advice = {
    conservative: "For your conservative risk profile, I recommend 60% debt instruments (FDs, bonds, debt funds), 30% large-cap equity funds, and 10% gold/liquid funds for safety and liquidity.",
    moderate: "With moderate risk tolerance, consider 50% equity (mix of large-cap and mid-cap funds), 40% debt instruments, and 10% alternative investments for balanced growth.",
    aggressive: "For aggressive growth, allocate 70% to equity (including small-cap and international funds), 20% debt for stability, and 10% in high-growth sectors or crypto."
  };
  
  return advice[riskTolerance] || advice.moderate;
}

function getMutualFundAdvice(riskTolerance, goals) {
  const baseAdvice = "For mutual fund investments, I recommend starting with SIPs in diversified funds. ";
  
  const riskBasedFunds = {
    conservative: "Focus on large-cap funds like HDFC Top 100, ICICI Prudential Bluechip for stability.",
    moderate: "Mix of large-cap and mid-cap funds like Axis Bluechip, HDFC Mid-Cap Opportunities.",
    aggressive: "Include small-cap and sectoral funds like SBI Small Cap, ICICI Technology Fund."
  };
  
  return baseAdvice + (riskBasedFunds[riskTolerance] || riskBasedFunds.moderate);
}

function getStockAdvice(riskTolerance) {
  if (riskTolerance === 'conservative') {
    return "For conservative stock investing, focus on blue-chip stocks like TCS, HUL, HDFC Bank with strong fundamentals and consistent dividends.";
  } else if (riskTolerance === 'aggressive') {
    return "For aggressive growth, consider growth stocks in technology, healthcare, and emerging sectors. Research companies with strong revenue growth and market leadership.";
  } else {
    return "For moderate risk, build a portfolio of 70% large-cap stocks (RELIANCE, INFY, BHARTIARTL) and 30% mid-cap stocks with good growth prospects.";
  }
}

function generatePortfolioAnalysis(portfolio, user) {
  const analysis = {
    overall: 'Good',
    strengths: [],
    improvements: [],
    riskLevel: 'Medium',
    diversification: 'Adequate'
  };
  
  // Analyze allocation
  const { allocation } = portfolio;
  
  if (allocation.stocks > 70) {
    analysis.improvements.push('Consider reducing equity exposure and adding debt instruments for better balance');
  } else if (allocation.stocks < 30) {
    analysis.improvements.push('Increase equity allocation for better long-term growth potential');
  } else {
    analysis.strengths.push('Good equity-debt balance');
  }
  
  // Risk alignment
  const expectedEquity = {
    conservative: 40,
    moderate: 60,
    aggressive: 80
  };
  
  const userExpectedEquity = expectedEquity[user.riskTolerance] || 60;
  const actualEquity = allocation.stocks + allocation.mutualFunds * 0.7; // Assuming 70% equity in MF
  
  if (Math.abs(actualEquity - userExpectedEquity) > 15) {
    analysis.improvements.push(`Adjust allocation to match your ${user.riskTolerance} risk profile`);
  } else {
    analysis.strengths.push('Portfolio aligns with risk tolerance');
  }
  
  return analysis;
}

function generateRecommendations(user, portfolio) {
  const recommendations = [];
  
  // Based on risk tolerance
  if (user.riskTolerance === 'conservative') {
    recommendations.push({
      type: 'asset_allocation',
      title: 'Conservative Allocation',
      description: 'Increase debt fund allocation to 50% for stability',
      priority: 'high'
    });
  } else if (user.riskTolerance === 'aggressive') {
    recommendations.push({
      type: 'equity_increase',
      title: 'Growth Focus',
      description: 'Consider increasing small-cap allocation for higher returns',
      priority: 'medium'
    });
  }
  
  // Based on goals
  if (user.investmentGoals?.includes('Tax Saving')) {
    recommendations.push({
      type: 'tax_saving',
      title: 'ELSS Investment',
      description: 'Invest in ELSS funds for Section 80C tax benefits',
      priority: 'high'
    });
  }
  
  if (user.investmentGoals?.includes('Retirement Planning')) {
    recommendations.push({
      type: 'retirement',
      title: 'PPF Investment',
      description: 'Maximize PPF contribution for tax-free retirement corpus',
      priority: 'high'
    });
  }
  
  return recommendations;
}

module.exports = router;
