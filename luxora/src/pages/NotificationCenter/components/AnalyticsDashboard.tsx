import { BarChart3, Clock, Bell, CheckCircle2, ShieldAlert } from 'lucide-react';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';

export const AnalyticsDashboard = () => {
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-ink-dark/30">
      
      {/* Header */}
      <div className="h-16 border-b border-gray-100 dark:border-ink-light bg-white dark:bg-ink flex items-center justify-between px-6 shrink-0">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">Activity Analytics</h2>
          <p className="text-xs text-gray-500">Notification & workflow intelligence</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard 
            title="Total Notifications" 
            value="842" 
            trend="+15% vs yesterday" 
            trendColor="text-emerald-500" 
            icon={Bell}
            iconColor="text-blue-500"
            backgroundColor="bg-blue-50 dark:bg-blue-900/20"
          />
          <KPICard 
            title="Read Rate" 
            value="94.2%" 
            trend="+1.2%" 
            trendColor="text-emerald-500" 
            icon={CheckCircle2}
            iconColor="text-emerald-500"
            backgroundColor="bg-emerald-50 dark:bg-emerald-900/20"
          />
          <KPICard 
            title="Avg Response Time" 
            value="14m" 
            trend="-2m" 
            trendColor="text-emerald-500" 
            icon={Clock}
            iconColor="text-gold-500"
            backgroundColor="bg-gold-50 dark:bg-gold-900/20"
          />
          <KPICard 
            title="Missed Alerts" 
            value="3" 
            trend="-2" 
            trendColor="text-emerald-500" 
            icon={ShieldAlert}
            iconColor="text-red-500"
            backgroundColor="bg-red-50 dark:bg-red-900/20"
          />
        </div>

        {/* Charts & Health Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="col-span-2 bg-white dark:bg-ink rounded-2xl border border-gray-200 dark:border-ink-light p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">Notification Volume</h3>
              <select className="bg-gray-50 dark:bg-ink-light border border-gray-200 dark:border-ink rounded-lg px-3 py-1 text-sm text-gray-600 dark:text-gray-300">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            {/* Chart Placeholder */}
            <div className="h-64 flex items-end justify-between space-x-2 pb-4 border-b border-gray-100 dark:border-ink-light">
              {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="w-full bg-blue-500/20 hover:bg-blue-500 transition-colors rounded-t-sm relative group cursor-pointer" style={{ height: `${h}%` }}>
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity">
                    {h * 15}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          <div className="bg-white dark:bg-ink rounded-2xl border border-gray-200 dark:border-ink-light p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-gold-500" />
              Activity by Department
            </h3>
            
            <div className="space-y-5">
              {[
                { name: 'Sales', val: 88, color: 'bg-emerald-500' },
                { name: 'Finance', val: 65, color: 'bg-blue-500' },
                { name: 'Compliance', val: 42, color: 'bg-gold-500' },
                { name: 'Procurement', val: 28, color: 'bg-purple-500' },
              ].map(dept => (
                <div key={dept.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-300">{dept.name}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{dept.val}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-ink-light rounded-full h-2">
                    <div className={`${dept.color} h-2 rounded-full`} style={{ width: `${dept.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/50">
              <p className="text-sm text-blue-800 dark:text-blue-400">
                <strong>Insight:</strong> Sales department generated 45% of total notifications today, largely driven by new property listings.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
