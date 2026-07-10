import { PieChart, TrendingUp, Users, HeartPulse } from 'lucide-react';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { GhostButton } from '../../../components/ui/ui';

export const WorkforceAnalytics = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <PieChart className="w-6 h-6 mr-3 text-gold-500" />
            Workforce Analytics
          </h2>
          <p className="text-gray-500 mt-1">Enterprise HR KPIs, attrition rates, and productivity metrics.</p>
        </div>
        <GhostButton>Export Dashboard</GhostButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <KPICard title="Headcount Growth" value="+12%" icon={TrendingUp} trend="Year-over-Year" trendColor="text-emerald-500" />
        <KPICard title="Employee Attrition" value="4.2%" icon={Users} trend="Below Avg" trendColor="text-emerald-500" />
        <KPICard title="Average Tenure" value="3.8 yrs" icon={PieChart} trend="Stable" trendColor="text-blue-500" />
        <KPICard title="Satisfaction Score" value="8.9/10" icon={HeartPulse} trend="+0.4 from Q1" trendColor="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 h-80 flex flex-col items-center justify-center">
          <p className="text-gray-400">Department Distribution Chart (Placeholder)</p>
        </div>
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 h-80 flex flex-col items-center justify-center">
          <p className="text-gray-400">Hiring vs Attrition Trend (Placeholder)</p>
        </div>
      </div>
    </div>
  );
};
