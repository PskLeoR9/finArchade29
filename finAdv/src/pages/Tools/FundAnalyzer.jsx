import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Star, Filter, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FundAnalyzer = () => {
  const [funds, setFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    rating: '',
    expense: '',
    returnPeriod: '1y'
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    'Large Cap', 'Mid Cap', 'Small Cap', 'Multi Cap', 'Flexi Cap',
    'ELSS', 'Debt', 'Hybrid', 'International', 'Sectoral'
  ];

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
        '5y': 11.8
      },
      manager: 'Chirag Setalvad',
      riskLevel: 'Medium',
      minSIP: 500,
      exitLoad: '1% if redeemed within 365 days'
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
        '5y': 9.2
      },
      manager: 'Dinesh Ahuja',
      riskLevel: 'Medium',
      minSIP: 500,
      exitLoad: '1% if redeemed within 365 days'
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
        '5y': 16.8
      },
      manager: 'Shreyash Devalkar',
      riskLevel: 'High',
      minSIP: 500,
      exitLoad: '1% if redeemed within 365 days'
    }
  ];

  useEffect(() => {
    fetchFunds();
  }, [filters]);

  const fetchFunds = async () => {
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      let filteredFunds = [...mockFunds];
      
      if (filters.category) {
        filteredFunds = filteredFunds.filter(fund => fund.category === filters.category);
      }
      
      if (filters.rating) {
        filteredFunds = filteredFunds.filter(fund => fund.rating >= parseInt(filters.rating));
      }
      
      setFunds(filteredFunds);
      setLoading(false);
    }, 1000);
  };

  const StarRating = ({ rating }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  const FundDetails = ({ fund }) => {
    const navHistory = [
      { month: 'Jan', value: 650 },
      { month: 'Feb', value: 665 },
      { month: 'Mar', value: 680 },
      { month: 'Apr', value: 695 },
      { month: 'May', value: 712 }
    ];

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{fund.name}</h2>
            <p className="text-gray-600">{fund.category} • {fund.manager}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">₹{fund.nav}</p>
            <div className={`flex items-center ${fund.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {fund.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {fund.change >= 0 ? '+' : ''}{fund.change} ({fund.changePercent}%)
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fund Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">AUM:</span>
                <span className="font-medium">₹{fund.aum.toLocaleString()} Cr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expense Ratio:</span>
                <span className="font-medium">{fund.expenseRatio}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Min SIP:</span>
                <span className="font-medium">₹{fund.minSIP}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Risk Level:</span>
                <span className="font-medium">{fund.riskLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rating:</span>
                <StarRating rating={fund.rating} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Returns</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">1 Year:</span>
                <span className="font-medium text-green-600">{fund.returns['1y']}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">3 Years:</span>
                <span className="font-medium text-green-600">{fund.returns['3y']}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">5 Years:</span>
                <span className="font-medium text-green-600">{fund.returns['5y']}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Info</h3>
            <div className="text-sm text-gray-600">
              <p><strong>Exit Load:</strong> {fund.exitLoad}</p>
              <p><strong>Fund Manager:</strong> {fund.manager}</p>
              <p><strong>Benchmark:</strong> Nifty 100 TRI</p>
              <p><strong>Launch Date:</strong> 1 Jan 2000</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">NAV Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={navHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex space-x-4">
          <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
            Start SIP
          </button>
          <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
            Invest Lumpsum
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Fund Analyzer</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2">
          <Search className="h-4 w-4" />
          <span>Search Funds</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
            <select
              value={filters.rating}
              onChange={(e) => setFilters({...filters, rating: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Any Rating</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Expense Ratio</label>
            <select
              value={filters.expense}
              onChange={(e) => setFilters({...filters, expense: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Any</option>
              <option value="1">Below 1%</option>
              <option value="1.5">Below 1.5%</option>
              <option value="2">Below 2%</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Return Period</label>
            <select
              value={filters.returnPeriod}
              onChange={(e) => setFilters({...filters, returnPeriod: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="1y">1 Year</option>
              <option value="3y">3 Years</option>
              <option value="5y">5 Years</option>
            </select>
          </div>
        </div>
      </div>

      {selectedFund ? (
        <div>
          <button
            onClick={() => setSelectedFund(null)}
            className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            ← Back to Fund List
          </button>
          <FundDetails fund={selectedFund} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Mutual Funds ({funds.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fund Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NAV
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    1Y Return
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    3Y Return
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expense Ratio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      Loading funds...
                    </td>
                  </tr>
                ) : funds.map((fund) => (
                  <tr key={fund.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{fund.name}</div>
                        <div className="text-sm text-gray-500">{fund.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{fund.nav}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center text-sm ${fund.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {fund.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                        {fund.change >= 0 ? '+' : ''}{fund.change} ({fund.changePercent}%)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {fund.returns['1y']}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {fund.returns['3y']}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StarRating rating={fund.rating} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {fund.expenseRatio}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedFund(fund)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        View Details
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Invest
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundAnalyzer;
