import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';
import JournalEntryForm from './components/JournalEntryForm';
import JournalList from './components/JournalList';
import Insights from './components/Insights';
import { BookOpen, Plus, List, Brain, BarChart3 } from 'lucide-react';

function App() {
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showAuthForm, setShowAuthForm] = useState('login');

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'new-entry', label: 'New Entry', icon: Plus },
    { id: 'entries', label: 'All Entries', icon: List },
    { id: 'insights', label: 'AI Insights', icon: Brain },
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'new-entry':
        return <JournalEntryForm onEntryAdded={() => setCurrentView('dashboard')} />;
      case 'entries':
        return <JournalList />;
      case 'insights':
        return <Insights />;
      default:
        return <Dashboard />;
    }
  };

  if (!currentUser) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            {/* Logo */}
            <div className="text-center">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                  <BookOpen className="h-10 w-10 text-primary-600" />
                </div>
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                AI Personal Journal
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Reflect, analyze, and grow with AI-powered insights
              </p>
            </div>

            {/* Auth Forms */}
            {showAuthForm === 'login' ? (
              <LoginForm onSwitchToSignup={() => setShowAuthForm('signup')} />
            ) : (
              <SignupForm onSwitchToLogin={() => setShowAuthForm('login')} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <div className="flex">
          {/* Sidebar Navigation */}
          <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 min-h-screen">
            <nav className="p-4">
              <ul className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setCurrentView(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          currentView === item.id
                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {renderCurrentView()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
