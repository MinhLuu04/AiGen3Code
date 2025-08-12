import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, LogOut, User, BookOpen } from 'lucide-react';

function Header() {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              AI Personal Journal
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a 
              href="#dashboard" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </a>
            <a 
              href="#new-entry" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              New Entry
            </a>
            <a 
              href="#insights" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Insights
            </a>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* User menu */}
            {currentUser && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentUser.displayName || currentUser.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
