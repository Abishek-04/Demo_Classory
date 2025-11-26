import React from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Activity, 
  Video, 
  UserPlus, 
  HardDrive, 
  FileText, 
  Image, 
  Film, 
  Cpu, 
  Zap, 
  MessageSquare, 
  Server, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// --- Custom Micro-Charts ---

const WaveChart = ({ color = "#2A9D8F", data = [20, 40, 30, 70, 40, 60, 50, 80, 60, 90] }) => {
  const max = Math.max(...data);
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d / max) * 100}`).join(' ');
  
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
      <path d={`M0,100 L0,${100 - (data[0]/max)*100} ${points} L100,100 Z`} fill={color} fillOpacity="0.1" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const BarChart = ({ color = "#F4A261", data = [40, 70, 50, 90, 60] }) => (
  <div className="flex items-end justify-between gap-1 h-full w-full">
    {data.map((h, i) => (
      <div key={i} className="w-full rounded-t-sm opacity-80" style={{ height: `${h}%`, backgroundColor: color }}></div>
    ))}
  </div>
);

const DonutChart = ({ value, color = "#2A9D8F", size = 120, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle cx={size/2} cy={size/2} r={radius} stroke="#E5E7EB" className="dark:stroke-gray-700" strokeWidth={strokeWidth} fill="none" />
        <circle 
          cx={size/2} cy={size/2} r={radius} 
          stroke={color} 
          strokeWidth={strokeWidth} 
          fill="none" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-gray-900 dark:text-white">{value}%</span>
      </div>
    </div>
  );
};

// --- Widgets ---

const StatCard = ({ title, value, subtext, trend, trendValue, icon: Icon, chartType = 'wave', color }: any) => (
  <div className="bg-white dark:bg-brand-darkCard p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between h-[160px] relative overflow-hidden group hover:border-brand-teal/30 transition-all">
    <div className="flex justify-between items-start z-10">
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
      </div>
      <div className={`p-2 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
         <Icon size={20} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
    
    <div className="z-10 mt-auto">
       <div className="flex items-center gap-2 mb-2">
         {trend === 'up' ? (
           <span className="flex items-center text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
             <ArrowUpRight size={12} className="mr-0.5" /> {trendValue}
           </span>
         ) : (
            <span className="flex items-center text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 rounded">
             <ArrowDownRight size={12} className="mr-0.5" /> {trendValue}
           </span>
         )}
         <span className="text-xs text-gray-400">{subtext}</span>
       </div>
    </div>

    {/* Chart Background */}
    <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 mask-image-gradient">
        {chartType === 'wave' ? <WaveChart color={color === 'bg-brand-teal' ? '#2A9D8F' : color === 'bg-orange-500' ? '#F4A261' : '#3B82F6'} /> : null}
        {chartType === 'bar' ? <div className="h-8 w-24 ml-auto mr-4 mb-4"><BarChart color={color === 'bg-brand-teal' ? '#2A9D8F' : '#F4A261'} /></div> : null}
    </div>
  </div>
);

export const OverviewContent = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-10">
      
      {/* Date Header */}
      <div className="flex justify-between items-end mb-2 px-1">
        <div>
           <h2 className="text-lg font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
           <p className="text-xs text-gray-500 dark:text-gray-400">Last updated: Today, 09:42 AM</p>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard 
            title="Total Students" value="1,240" subtext="vs last month" trend="up" trendValue="12%" 
            icon={GraduationCap} color="bg-blue-500" chartType="wave" 
        />
        <StatCard 
            title="Total Teachers" value="84" subtext="Active Staff" trend="up" trendValue="2" 
            icon={BookOpen} color="bg-orange-500" chartType="wave" 
        />
        <StatCard 
            title="Total Courses" value="42" subtext="8 Archived" trend="up" trendValue="5 New" 
            icon={Activity} color="bg-brand-teal" chartType="bar" 
        />
        <StatCard 
            title="Attendance" value="94%" subtext="Today's Avg" trend="down" trendValue="1.2%" 
            icon={CheckCircle2} color="bg-green-500" chartType="wave" 
        />
        <StatCard 
            title="Active Classes" value="8" subtext="Live Now" trend="up" trendValue="+2" 
            icon={Video} color="bg-red-500" chartType="bar" 
        />
        <StatCard 
            title="New Signups" value="12" subtext="This Week" trend="up" trendValue="+4" 
            icon={UserPlus} color="bg-purple-500" chartType="wave" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Left Column (2/3) */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Storage & Drive Analytics */}
            <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <HardDrive size={20} className="text-gray-400" /> Storage & Drive
                    </h3>
                    <button className="text-xs font-semibold text-brand-teal hover:bg-teal-50 dark:hover:bg-teal-900/30 px-3 py-1.5 rounded-lg transition-colors">
                        Manage Storage
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <div className="flex flex-col items-center">
                        <DonutChart value={65} color="#F4A261" />
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-4">650 GB <span className="text-gray-400 font-normal">/ 1 TB</span></p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Storage Used</p>
                    </div>
                    <div className="md:col-span-2 space-y-6">
                        <div>
                             <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                                <span>File Distribution</span>
                                <span>Total Files: 12,450</span>
                             </div>
                             <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-50 dark:bg-red-900/30 text-red-600 p-1.5 rounded-lg"><FileText size={14} /></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Documents (PDF, Docx)</span>
                                            <span className="text-gray-500 dark:text-gray-400">45%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full"><div className="h-full bg-red-400 rounded-full" style={{width: '45%'}}></div></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 p-1.5 rounded-lg"><Image size={14} /></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Images</span>
                                            <span className="text-gray-500 dark:text-gray-400">30%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full"><div className="h-full bg-blue-400 rounded-full" style={{width: '30%'}}></div></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 p-1.5 rounded-lg"><Film size={14} /></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Videos & Recordings</span>
                                            <span className="text-gray-500 dark:text-gray-400">25%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full"><div className="h-full bg-purple-400 rounded-full" style={{width: '25%'}}></div></div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Academic Analytics */}
            <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <GraduationCap size={20} className="text-gray-400" /> Academic Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Course Completion</h4>
                        <div className="space-y-4">
                            {[
                                { name: 'Computer Science 101', progress: 78, color: 'bg-brand-teal' },
                                { name: 'Advanced Mathematics', progress: 45, color: 'bg-brand-orange' },
                                { name: 'Physics Laboratory', progress: 92, color: 'bg-blue-500' }
                            ].map((course, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">{course.name}</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{course.progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className={`h-full ${course.color} rounded-full`} style={{ width: `${course.progress}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Exam & Assessments</h4>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-1 bg-white dark:bg-brand-darkCard p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-center">
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                                <p className="text-[10px] text-gray-500 uppercase font-semibold">Upcoming</p>
                            </div>
                            <div className="flex-1 bg-white dark:bg-brand-darkCard p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-center">
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">85%</p>
                                <p className="text-[10px] text-gray-500 uppercase font-semibold">Avg Score</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between items-center text-xs p-2 bg-white dark:bg-brand-darkCard rounded-lg border border-gray-100 dark:border-gray-700">
                              <span className="text-gray-600 dark:text-gray-300 font-medium">Mid-Term Finals</span>
                              <span className="text-orange-600 bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5 rounded font-bold">Dec 15</span>
                           </div>
                           <div className="flex justify-between items-center text-xs p-2 bg-white dark:bg-brand-darkCard rounded-lg border border-gray-100 dark:border-gray-700">
                              <span className="text-gray-600 dark:text-gray-300 font-medium">Physics Quiz 2</span>
                              <span className="text-orange-600 bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5 rounded font-bold">Dec 18</span>
                           </div>
                        </div>
                    </div>
                </div>
            </div>

         </div>

         {/* Right Column (1/3) */}
         <div className="space-y-6">
            
            {/* Subscription Mini Card */}
            <div className="bg-gradient-to-br from-brand-teal to-teal-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-white/20">Active Plan</span>
                        <Zap size={20} className="text-yellow-300 fill-yellow-300" />
                    </div>
                    <h3 className="text-2xl font-bold mb-1">Campus Starter</h3>
                    <p className="text-white/80 text-sm mb-6">Next renewal: Dec 12, 2025</p>
                    <button className="w-full bg-white text-brand-teal font-bold py-3 rounded-xl text-sm hover:bg-teal-50 transition-colors shadow-sm">
                        Manage Subscription
                    </button>
                </div>
            </div>

            {/* AI Usage Analytics */}
            <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Cpu size={20} className="text-purple-500" /> AI Usage
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-50 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600"><Zap size={16}/></div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Tokens Used</p>
                            <div className="flex justify-between items-baseline">
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">842K</h4>
                                <span className="text-xs text-gray-400">/ 1M Limit</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{width: '84%'}}></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                             <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Summaries</p>
                             <p className="font-bold text-gray-900 dark:text-white">1,204</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                             <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Queries</p>
                             <p className="font-bold text-gray-900 dark:text-white">4,521</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Health */}
            <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-green-500" /> System Health
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <Server size={16} className="text-gray-400"/>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Server Uptime</span>
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">99.9%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <RefreshCw size={16} className="text-gray-400"/>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Sync</span>
                        </div>
                        <span className="text-xs font-medium text-gray-500">2 mins ago</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <AlertCircle size={16} className="text-gray-400"/>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Error Logs</span>
                        </div>
                        <span className="text-xs font-bold text-gray-400">0 Issues</span>
                    </div>
                </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white dark:bg-brand-darkCard rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm max-h-[400px] overflow-y-auto">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Clock size={20} className="text-gray-400" /> Recent Activity
                </h3>
                <div className="space-y-0 relative">
                    <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-gray-700"></div>
                    
                    {[
                        { title: 'Live Class Started', user: 'Prof. Robert', time: '10 mins ago', icon: Video, color: 'bg-red-50 dark:bg-red-900/30 text-red-600' },
                        { title: 'New Course Added', user: 'Admin Sarah', time: '2 hours ago', icon: BookOpen, color: 'bg-brand-teal/10 dark:bg-teal-900/30 text-brand-teal' },
                        { title: 'Payment Received', user: 'System', time: 'Yesterday', icon: CheckCircle2, color: 'bg-green-50 dark:bg-green-900/30 text-green-600' },
                        { title: 'Storage Warning', user: 'System', time: '2 days ago', icon: AlertCircle, color: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600' },
                    ].map((event, i) => (
                        <div key={i} className="flex gap-4 relative py-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white dark:border-brand-darkCard ${event.color}`}>
                                <event.icon size={16} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{event.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{event.user} • {event.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

         </div>
      </div>
    </div>
  );
};