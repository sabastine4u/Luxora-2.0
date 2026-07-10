import { BarChart3, TrendingUp, Users, Target, Activity } from 'lucide-react';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { GhostButton } from '../../../components/ui/ui';

export const ContactAnalytics = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            <BarChart3 className="w-6 h-6 mr-3 text-gold-500" />
            Contact & Relationship Analytics
          </h2>
          <p className="text-gray-500">Enterprise CRM performance metrics and engagement tracking.</p>
        </div>
        <GhostButton>Export Data</GhostButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <KPICard title="Avg Response Time" value="1.2 hrs" icon={Activity} trend="-15m" trendColor="text-emerald-500" />
        <KPICard title="Lead Conversion" value="24.8%" icon={Target} trend="+2.1%" trendColor="text-emerald-500" />
        <KPICard title="Active Relationships" value="1,452" icon={Users} trend="+84" trendColor="text-emerald-500" />
        <KPICard title="Engagement Score" value="92/100" icon={TrendingUp} trend="+5 pts" trendColor="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 h-80 flex flex-col items-center justify-center">
          <p className="text-gray-400">Lead Source Conversion Chart (Placeholder)</p>
        </div>
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 h-80 flex flex-col items-center justify-center">
          <p className="text-gray-400">Engagement Velocity Timeline (Placeholder)</p>
        </div>
      </div>
    </div>
  );
};
