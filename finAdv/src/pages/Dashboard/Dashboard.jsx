// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [portfolioData, setPortfolioData] = useState(null);
  const [marketData, setMarketData] = useState([]);

  useEffect(() => {
    // Fetch portfolio and market data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // API calls would go here
    setPortfolioData({
      totalValue: 245000,
      todayChange: 2350,
      todayChangePercent: 0.97,
      allocation: {
        stocks: 65,
        mutualFunds: 25,
        bonds: 10
      }
    });

    setMarketData([
      { name: 'Jan', value: 220000 },
      { name: 'Feb', value: 225000 },
      { name: 'Mar', value: 235000 },
      { name: 'Apr', value: 242000 },
      { name: 'May', value: 245000 }
    ]);
  };

  const StatCard = ({ title, value, change, changePercent, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {change >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change >= 0 ? '+' : ''}{change} ({changePercent}%)
              </span>
            </div>
          )}
        </div>
        <Icon className="h-8 w-8" style={{ color }} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Portfolio Value"
          value="₹2,45,000"
          change={2350}
          changePercent={0.97}
          icon={DollarSign}
          color="#10B981"
        />
        <StatCard
          title="Stocks Allocation"
          value="65%"
          icon={TrendingUp}
          color="#3B82F6"
        />
        <StatCard
          title="Mutual Funds"
          value="25%"
          icon={PieChart}
          color="#8B5CF6"
        />
        <StatCard
          title="Bonds & Others"
          value="10%"
          icon={BarChart3}
          color="#F59E0B"
        />
      </div>

      {/* Portfolio Performance Chart */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Portfolio Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={marketData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Portfolio Value']} />
            <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">AI Recommendations</h2>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-semibold text-blue-800">Rebalancing Suggestion</h3>
            <p className="text-blue-700">Consider reducing tech stocks by 5% and increasing FMCG allocation for better diversification.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <h3 className="font-semibold text-green-800">Growth Opportunity</h3>
            <p className="text-green-700">Based on your risk profile, consider SIP in large-cap equity funds for long-term wealth creation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
