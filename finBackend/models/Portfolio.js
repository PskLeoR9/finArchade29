// models/Portfolio.js
const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['stock', 'mutual_fund', 'bond', 'etf'],
    required: true 
  },
  quantity: { type: Number, required: true },
  avgPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  sector: String,
  exchange: String,
  purchaseDate: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
});

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  holdings: [holdingSchema],
  totalInvestment: { type: Number, default: 0 },
  currentValue: { type: Number, default: 0 },
  totalGainLoss: { type: Number, default: 0 },
  totalGainLossPercent: { type: Number, default: 0 },
  allocation: {
    stocks: { type: Number, default: 0 },
    mutualFunds: { type: Number, default: 0 },
    bonds: { type: Number, default: 0 },
    cash: { type: Number, default: 0 }
  },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Calculate portfolio metrics before saving
portfolioSchema.pre('save', function(next) {
  let totalInvestment = 0;
  let currentValue = 0;
  
  this.holdings.forEach(holding => {
    totalInvestment += holding.quantity * holding.avgPrice;
    currentValue += holding.quantity * holding.currentPrice;
  });
  
  this.totalInvestment = totalInvestment;
  this.currentValue = currentValue;
  this.totalGainLoss = currentValue - totalInvestment;
  this.totalGainLossPercent = totalInvestment > 0 ? ((currentValue - totalInvestment) / totalInvestment) * 100 : 0;
  this.lastUpdated = new Date();
  
  next();
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
