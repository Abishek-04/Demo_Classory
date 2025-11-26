import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  LayoutGrid, 
  CreditCard, 
  CalendarDays, 
  Bot, 
  HelpCircle,
  GraduationCap
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: false },
    { icon: Building2, label: 'Tenants', active: true }, // Active context
    { icon: LayoutGrid, label: 'Analytics', active: false },
    { icon: CreditCard, label: 'Transactions', active: false },
    { icon: CalendarDays, label: 'Planners', active: false },
    { icon: Bot, label: 'Ai bot', active: false },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-white dark:bg-brand-darkCard border-r border-gray-100 dark:border-gray-800 flex flex-col z-20 hidden lg:flex transition-colors duration-300">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-2 mb-4">
        <div className="relative">
            <GraduationCap className="w-8 h-8 text-gray-900 dark:text-white" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-teal rounded-full border-2 border-white dark:border-brand-darkCard"></div>
        </div>
        <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Classory</h1>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">One Classroom, Millions of Stories</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
              item.active 
                ? 'bg-teal-50 dark:bg-teal-900/20 text-brand-teal' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <item.icon size={20} strokeWidth={1.5} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Help Center Widget */}
      <div className="p-4 mt-auto">
        <div className="bg-orange-50/50 dark:bg-orange-900/10 rounded-2xl p-6 text-center relative overflow-hidden">
          {/* Decorative bubble */}
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-orange-100/50 dark:bg-orange-500/10 rounded-full blur-xl"></div>
          
          <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <HelpCircle size={16} />
          </div>
          <h3 className="text-gray-900 dark:text-white font-semibold mb-1 text-sm">Help Center</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
            Having trouble in Classory?<br/>Please contact us
          </p>
          <button className="w-full bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-semibold py-2.5 px-4 rounded-full transition-colors shadow-sm">
            Contact us
          </button>
        </div>
      </div>
    </aside>
  );
};