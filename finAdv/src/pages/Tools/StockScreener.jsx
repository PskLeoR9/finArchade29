// src/pages/Tools/StockScreener.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Star } from 'lucide-react';

const StockScreener = () => {
  const [filters, setFilters] = useState({
    marketCap: '',
    peRatio: { min: '', max: '' },
    sector: '',
    priceRange: { min: '', max: '' },
    dividend: ''
  });
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  const sectorOptions = [
    'Technology', 'Banking', 'Pharmaceuticals', 'Automobile', 
    'FMCG', 'Energy', 'Infrastructure', 'Telecom'
  ];

  const fetchStocks = async () => {
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setStocks([
        {
          id: 1,
          symbol: 'RELIANCE',
          name: 'Reliance Industries Ltd',
          price: 2456.75,
          change: 23.45,
          changePercent: 0.96,
          marketCap: '16,59,234 Cr',
          peRatio: 28.5,
          sector: 'Energy',
          rating: 4
        },
        {
          id: 2,
          symbol: 'TCS',
          name: 'Tata Consultancy Services',
          price: 3234.50,
          change: -12.30,
          changePercent: -0.38,
          marketCap: '11,78,945 Cr',
          peRatio: 25.2,
          sector: 'Technology',
          rating: 5
        },
        {
          id: 3,
          symbol: 'INFY',
          name: 'Infosys Limited',
          price: 1445.20,
          change: 8.75,
          changePercent: 0.61,
          marketCap: '6,12,890 Cr',
          peRatio: 22.1,
          sector: 'Technology',
          rating: 4
        },
        {
          id: 4,
          symbol: 'HDFCBANK',
          name: 'HDFC Bank Limited',
          price: 1532.40,
          change: -5.60,
          changePercent: -0.36,
          marketCap: '8,45,123 Cr',
          peRatio: 19.8,
          sector: 'Banking',
          rating: 5
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchStocks();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
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

  // Helper function to render change with proper icon
  const renderChange = (change, changePercent) => {
    const isPositive = change >= 0;
    const IconComponent = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
    
    return (
      <div className={`flex items-center text-sm ${colorClass}`}>
        <IconComponent className="h-4 w-4 mr-1" />
        <span>
          {isPositive ? '+' : ''}{change} ({changePercent}%)
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Stock Screener</h1>
        <button
          onClick={fetchStocks}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
        >
          <Search className="h-4 w-4" />
          <span>Search Stocks</span>
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Market Cap</label>
            <select
              value={filters.marketCap}
              onChange={(e) => handleFilterChange('marketCap', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All</option>
              <option value="large">Large Cap</option>
              <option value="mid">Mid Cap</option>
              <option value="small">Small Cap</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
            <select
              value={filters.sector}
              onChange={(e) => handleFilterChange('sector', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Sectors</option>
              {sectorOptions.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min PE Ratio</label>
            <input
              type="number"
              value={filters.peRatio.min}
              onChange={(e) => handleFilterChange('peRatio', { ...filters.peRatio, min: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max PE Ratio</label>
            <input
              type="number"
              value={filters.peRatio.max}
              onChange={(e) => handleFilterChange('peRatio', { ...filters.peRatio, max: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="100"
            />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Stock Results ({stocks.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Market Cap
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PE Ratio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <span className="ml-2">Loading stocks...</span>
                    </div>
                  </td>
                </tr>
              ) : stocks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No stocks found matching your criteria.
                  </td>
                </tr>
              ) : (
                stocks.map((stock) => (
                  <tr key={stock.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
                        <div className="text-sm text-gray-500">{stock.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{stock.price.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderChange(stock.change, stock.changePercent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stock.marketCap}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stock.peRatio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StarRating rating={stock.rating} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockScreener;
