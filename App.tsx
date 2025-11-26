import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PlanContent } from './components/PlanContent';
import { SettingsContent } from './components/SettingsContent';
import { BasicDetailsContent } from './components/BasicDetailsContent';
import { UserContent } from './components/UserContent';
import { OverviewContent } from './components/OverviewContent';
import { PlanSection } from './types';
import { User, Layers, PlusCircle, CreditCard, ShoppingBag } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeSection, setActiveSection] = useState<PlanSection>(PlanSection.ACTUAL_PLAN);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  
  // Lifted Status State (to share between PlanContent and SettingsContent)
  const [tenantStatus, setTenantStatus] = useState<'Active' | 'Suspended' | 'Paused' | 'Terminated'>('Active');

  const planMenuItems = [
    { id: PlanSection.ACTUAL_PLAN, icon: User, label: 'Actual Plan' },
    { id: PlanSection.FALLBACK_PLAN, icon: Layers, label: 'FallBack Plan' },
    { id: PlanSection.ADD_ONS, icon: PlusCircle, label: 'Add-ons' },
    { id: PlanSection.SUBSCRIPTIONS, icon: CreditCard, label: 'Subscriptions' },
    { id: PlanSection.BUY_OR_UPGRADE, icon: ShoppingBag, label: 'Buy Or Upgrade' },
  ];

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-darkBg flex font-sans transition-colors duration-300">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header activeTab={activeTab} onTabChange={setActiveTab} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* Page Grid Layout */}
          <div className="max-w-7xl mx-auto">
            
            {activeTab === 'Plans & Billing' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Plan Menu */}
                <div className="lg:col-span-3">
                  <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm sticky top-32 transition-colors">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 px-4 py-3 mb-2">Direct Plan</h3>
                    <div className="space-y-1">
                      {planMenuItems.map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                              isActive 
                                ? 'bg-brand-orangeLight dark:bg-orange-900/30 text-brand-orange' 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                          >
                            <item.icon 
                              size={18} 
                              className={`transition-colors ${isActive ? 'text-brand-orange' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} 
                            />
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Column: Content */}
                <div className="lg:col-span-9">
                  <PlanContent 
                    activeSection={activeSection} 
                    tenantStatus={tenantStatus}
                    setTenantStatus={setTenantStatus}
                    onNavigateToSettings={() => setActiveTab('Settings')}
                  />
                </div>

              </div>
            ) : activeTab === 'Settings' ? (
              <SettingsContent tenantStatus={tenantStatus} setTenantStatus={setTenantStatus} />
            ) : activeTab === 'Basic Details' ? (
              <BasicDetailsContent />
            ) : activeTab === 'User' ? (
              <UserContent />
            ) : activeTab === 'Overview' ? (
              <OverviewContent />
            ) : (
              <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                Content for {activeTab} coming soon.
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;