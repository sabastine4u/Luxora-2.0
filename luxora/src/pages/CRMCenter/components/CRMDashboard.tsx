import { useCRMCenter } from '../hooks/useCRMCenter';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { Users, Building2, UserCheck, Focus, Target, CalendarClock, TrendingUp, Handshake } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';

export const CRMDashboard = () => {
  const { metrics, activities } = useCRMCenter();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">CRM Dashboard</h2>
          <p className="text-gray-500">Enterprise Relationship Management overview.</p>
        </div>
        <div className="flex space-x-3">
          <GhostButton>Export Report</GhostButton>
          <GoldButton>Add Contact</GoldButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard title="Total Contacts" value={metrics.totalContacts} icon={Users} trend="+12" trendColor="text-emerald-500" />
        <KPICard title="Active Buyers" value={metrics.activeBuyers} icon={UserCheck} trend="+3" trendColor="text-emerald-500" />
        <KPICard title="Active Owners" value={metrics.activeOwners} icon={Focus} trend="-1" trendColor="text-red-500" />
        <KPICard title="Organizations" value={metrics.organizations} icon={Building2} trend="+2" trendColor="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard title="Open Leads" value={metrics.openLeads} icon={Target} trend="+5" trendColor="text-emerald-500" />
        <KPICard title="Opportunities" value={metrics.opportunities} icon={Handshake} trend="+1" trendColor="text-emerald-500" />
        <KPICard title="Pipeline Value" value={formatCurrency(metrics.pipelineValue)} icon={TrendingUp} trend="+15%" trendColor="text-emerald-500" />
        <KPICard title="Today's Follow-ups" value={metrics.todaysFollowUps} icon={CalendarClock} trend="2 Overdue" trendColor="text-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Pipeline Overview</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-ink-light rounded-lg">
            <span className="text-gray-400">Pipeline Chart Placeholder</span>
          </div>
        </div>

        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {activities.slice(0, 5).map(activity => (
              <div key={activity.id} className="flex space-x-3 items-start">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-gold-500 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{activity.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{formatMessageTime(activity.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
          <GhostButton className="w-full justify-center mt-4 text-xs">View All Activity</GhostButton>
        </div>
      </div>
    </div>
  );
};
