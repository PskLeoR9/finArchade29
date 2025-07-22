// src/pages/AIAdvisor/AIAdvisor.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Send, Bot, User, TrendingUp, PieChart, Target } from 'lucide-react';

const AIAdvisor = () => {
  const { user } = useSelector(state => state.auth);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello ${user?.firstName}! I'm your AI Financial Advisor. I can help you with investment strategies, portfolio analysis, and financial planning. What would you like to discuss today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateAIResponse(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('portfolio') || lowerInput.includes('allocation')) {
      return `Based on your current portfolio and risk profile, I recommend maintaining a 70-20-10 allocation across equity, debt, and alternative investments. Your current equity allocation of 65% could be increased slightly for better long-term growth potential.`;
    }
    
    if (lowerInput.includes('mutual fund') || lowerInput.includes('sip')) {
      return `For your investment goals and moderate risk tolerance, I suggest starting with large-cap equity funds like HDFC Top 100 or ICICI Prudential Bluechip. Consider a monthly SIP of ₹10,000-15,000 across 2-3 diversified funds.`;
    }
    
    if (lowerInput.includes('stock') || lowerInput.includes('equity')) {
      return `Given current market conditions, I recommend focusing on quality large-cap stocks in defensive sectors like FMCG and Healthcare. Companies like HUL, Nestle, and Dr. Reddy's show strong fundamentals and consistent performance.`;
    }
    
    if (lowerInput.includes('tax') || lowerInput.includes('80c')) {
      return `To optimize your tax savings under Section 80C, consider ELSS mutual funds which offer equity growth potential along with tax benefits. PPF and EPF are also excellent for long-term wealth creation with tax advantages.`;
    }
    
    return `I understand you're looking for financial guidance. Could you be more specific about your investment goals, time horizon, or the particular area you'd like help with? I can assist with portfolio analysis, fund selection, stock recommendations, or tax planning strategies.`;
  };

  const QuickAction = ({ icon: Icon, title, description, onClick }) => (
    <div
      onClick={onClick}
      className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 cursor-pointer transition-colors"
    >
      <div className="flex items-center space-x-3">
        <Icon className="h-6 w-6 text-indigo-600" />
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );

  const quickActions = [
    {
      icon: PieChart,
      title: "Portfolio Analysis",
      description: "Get insights on your current allocation",
      message: "Please analyze my current portfolio allocation and suggest improvements"
    },
    {
      icon: TrendingUp,
      title: "Stock Recommendations",
      description: "Find stocks matching your profile",
      message: "What are your top stock recommendations for long-term investment?"
    },
    {
      icon: Target,
      title: "Goal Planning",
      description: "Plan for your financial goals",
      message: "Help me plan investments for my retirement in 25 years"
    }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">AI Financial Advisor</h1>
        <p className="text-gray-600 mt-2">Get personalized investment advice powered by AI</p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user' ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div className={`p-4 rounded-lg ${message.type === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-3xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="p-4 rounded-lg bg-gray-100">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 p-6 border-t border-gray-200">
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me about investments, portfolio analysis, or financial planning..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="w-80 border-l border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <QuickAction
                key={index}
                icon={action.icon}
                title={action.title}
                description={action.description}
                onClick={() => setInputMessage(action.message)}
              />
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Your Investment Profile</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Risk Tolerance:</span>
                <span className="font-medium">{user?.riskTolerance || 'Moderate'}</span>
              </div>
              <div className="flex justify-between">
                <span>Portfolio Value:</span>
                <span className="font-medium">₹2,45,000</span>
              </div>
              <div className="flex justify-between">
                <span>Goals:</span>
                <span className="font-medium">{user?.investmentGoals?.length || 0} Set</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
