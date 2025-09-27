import React from 'react';
import { LogOut, Bell, User, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DarkModeToggle from './DarkModeToggle';

const Header: React.FC = () => {
  const { currentUser, logout, notifications } = useApp();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EventSync
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-800 dark:hover:text-gray-100 transition-colors" />
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{currentUser?.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{currentUser?.role}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;