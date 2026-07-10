import { BarChart3, Users, Clock, Zap, Activity } from 'lucide-react';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';

export const AnalyticsDashboard = () => {
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-ink-dark/30">
      
      {/* Header */}
      <div className="h-16 border-b border-gray-100 dark:border-ink-light bg-white dark:bg-ink flex items-center justify-between px-6">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">Communication Analytics</h2>
          <p className="text-xs text-gray-500">Enterprise Intelligence Dashboard</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard 
            title="Messages Today" 
            value="1,248" 
            trend="+12%" 
            trendColor="text-emerald-500" 
            icon={BarChart3}
            iconColor="text-gold-500"
            backgroundColor="bg-gold-50 dark:bg-gold-900/20"
          />
          <KPICard 
            title="Avg Response Time" 
            value="4m 12s" 
            trend="-1m 5s" 
            trendColor="text-emerald-500" 
            icon={Clock}
            iconColor="text-blue-500"
            backgroundColor="bg-blue-50 dark:bg-blue-900/20"
          />
          <KPICard 
            title="Active Users" 
            value="156" 
            trend="+4" 
            trendColor="text-emerald-500" 
            icon={Users}
            iconColor="text-emerald-500"
            backgroundColor="bg-emerald-50 dark:bg-emerald-900/20"
          />
          <KPICard 
            title="Productivity Score" 
            value="94/100" 
            trend="+2 pts" 
            trendColor="text-emerald-500" 
            icon={Zap}
            iconColor="text-purple-500"
            backgroundColor="bg-purple-50 dark:bg-purple-900/20"
          />
        </div>

        {/* Charts & Health Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="col-span-2 bg-white dark:bg-ink rounded-2xl border border-gray-200 dark:border-ink-light p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">Weekly Message Trend</h3>
              <select className="bg-gray-50 dark:bg-ink-light border border-gray-200 dark:border-ink rounded-lg px-3 py-1 text-sm text-gray-600 dark:text-gray-300">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            {/* Chart Placeholder */}
            <div className="h-64 flex items-end justify-between space-x-2 pb-4 border-b border-gray-100 dark:border-ink-light">
              {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="w-full bg-gold-500/20 hover:bg-gold-500 transition-colors rounded-t-sm relative group cursor-pointer" style={{ height: `${h}%` }}>
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
              <Activity className="w-5 h-5 mr-2 text-gold-500" />
              Communication Health
            </h3>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">Client Satisfaction</span>
                  <span className="font-medium text-gray-900 dark:text-white">98%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-ink-light rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">Follow-up Completion</span>
                  <span className="font-medium text-gray-900 dark:text-white">85%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-ink-light rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">Escalation Risk</span>
                  <span className="font-medium text-gray-900 dark:text-white">4%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-ink-light rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '4%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gold-50 dark:bg-gold-900/10 rounded-xl border border-gold-100 dark:border-gold-900/50">
              <p className="text-sm text-gold-800 dark:text-gold-400">
                <strong>Insight:</strong> Response times are 15% faster this week. The Sales team is performing exceptionally well in lead follow-ups.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
