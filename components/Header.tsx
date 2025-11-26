import React from 'react';
import { Menu, BarChart3, Bell, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, isDarkMode, toggleTheme }) => {
  const tabs = [
    'Overview',
    'Basic Details',
    'Plans & Billing',
    'User',
    'Settings'
  ];

  return (
    <header className="bg-white dark:bg-brand-darkCard border-b border-gray-100 dark:border-gray-800 pt-5 sticky top-0 z-10 transition-colors duration-300">
      {/* Top Bar: Mobile Toggle + Actions */}
      <div className="px-8 flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 rounded-md">
            <Menu size={20} />
          </button>
        </div>

        <div className="flex items-center gap-4">
           {/* Theme Toggle */}
           <button 
             onClick={toggleTheme}
             className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
           >
             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
           </button>

           {/* Actions */}
           <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
             <BarChart3 size={20} />
           </button>
           <div className="relative">
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <Bell size={20} />
            </button>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-brand-darkCard"></span>
           </div>
           
           {/* Profile */}
           <div className="w-9 h-9 rounded-full bg-blue-100 overflow-hidden border border-gray-200 dark:border-gray-700">
             <img src="https://picsum.photos/100/100" alt="Profile" className="w-full h-full object-cover" />
           </div>
        </div>
      </div>

      {/* Tenant Info */}
      <div className="px-8 mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Lady Doak college</h2>
          <span className="px-3 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
            Active
          </span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">ldceduin.classory.app</p>
      </div>

      {/* Tabs */}
      <div className="px-8">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border border-gray-200 dark:border-gray-700 rounded-full p-1.5 w-fit max-w-full bg-white dark:bg-gray-900/50">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-teal text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Bottom spacer to separate content */}
      <div className="h-6"></div>
    </header>
  );
};