import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { 
  X, 
  Sun, 
  Moon, 
  Monitor, 
  Bell, 
  Shield, 
  User, 
  Palette,
  Save,
  RefreshCw
} from 'lucide-react';

const SettingsModal = ({ isOpen, onClose }) => {
  const { theme, setLightTheme, setDarkTheme, setSystemTheme } = useTheme();
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  
  const [activeTab, setActiveTab] = useState('appearance');
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      portfolio: true,
      market: true,
      news: false
    },
    privacy: {
      shareData: false,
      analytics: true,
      marketingEmails: false
    },
    preferences: {
      currency: 'INR',
      language: 'en',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: 'indian'
    }
  });

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'account', label: 'Account', icon: User }
  ];

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // Save settings to backend/localStorage
    localStorage.setItem('userSettings', JSON.stringify(settings));
    // You can also dispatch to Redux store or make API call
    console.log('Settings saved:', settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 dark:bg-gray-900 p-4">
              <nav className="space-y-2">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme Preference</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button
                        onClick={setLightTheme}
                        className={`p-4 border-2 rounded-lg transition-colors ${
                          theme === 'light'
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <Sun className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                        <p className="font-medium text-gray-900 dark:text-white">Light</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Clean and bright interface</p>
                      </button>

                      <button
                        onClick={setDarkTheme}
                        className={`p-4 border-2 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <Moon className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <p className="font-medium text-gray-900 dark:text-white">Dark</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Easy on the eyes</p>
                      </button>

                      <button
                        onClick={setSystemTheme}
                        className={`p-4 border-2 rounded-lg transition-colors ${
                          !localStorage.getItem('theme')
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <Monitor className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                        <p className="font-medium text-gray-900 dark:text-white">System</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Follow system setting</p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Display Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Default currency for displaying amounts</p>
                        </div>
                        <select
                          value={settings.preferences.currency}
                          onChange={(e) => handleSettingChange('preferences', 'currency', e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="INR">₹ INR</option>
                          <option value="USD">$ USD</option>
                          <option value="EUR">€ EUR</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Format</label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">How dates are displayed</p>
                        </div>
                        <select
                          value={settings.preferences.dateFormat}
                          onChange={(e) => handleSettingChange('preferences', 'dateFormat', e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      {Object.entries(settings.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                              {key === 'email' ? 'Email Notifications' :
                               key === 'push' ? 'Push Notifications' :
                               key === 'portfolio' ? 'Portfolio Updates' :
                               key === 'market' ? 'Market Alerts' :
                               key === 'news' ? 'Financial News' : key}
                            </label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {key === 'email' ? 'Receive notifications via email' :
                               key === 'push' ? 'Browser push notifications' :
                               key === 'portfolio' ? 'Updates about your portfolio performance' :
                               key === 'market' ? 'Important market movements and alerts' :
                               key === 'news' ? 'Latest financial news and updates' : ''}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Privacy Settings</h3>
                    <div className="space-y-4">
                      {Object.entries(settings.privacy).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                              {key === 'shareData' ? 'Data Sharing' :
                               key === 'analytics' ? 'Analytics' :
                               key === 'marketingEmails' ? 'Marketing Emails' : key}
                            </label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {key === 'shareData' ? 'Allow sharing anonymized data for improving services' :
                               key === 'analytics' ? 'Help us improve by sharing usage analytics' :
                               key === 'marketingEmails' ? 'Receive promotional emails and offers' : ''}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handleSettingChange('privacy', key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <p className="text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <p className="text-gray-900 dark:text-white">{user?.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Risk Tolerance</label>
                        <p className="text-gray-900 dark:text-white capitalize">{user?.riskTolerance}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Investment Goals</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {user?.investmentGoals?.map(goal => (
                            <span key={goal} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs rounded-full">
                              {goal}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
