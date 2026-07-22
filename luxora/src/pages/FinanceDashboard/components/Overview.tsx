import { 
  TrendingUp, Activity, Banknote, Building2, Users, FileBarChart, PieChart, Wallet, ShieldAlert
} from 'lucide-react';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { useToast } from '../../../contexts/ToastContext';

export default function Overview() {
  const { showToast } = useToast();

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const kpis = [
    { title: 'Total Revenue', value: '₦8.42B', icon: TrendingUp, trend: '+12.5%', up: true },
    { title: 'Total Expenses', value: '₦2.15B', icon: Activity, trend: '+4.2%', up: false, trendColor: 'text-rose-400', iconColor: 'text-rose-400', backgroundColor: 'bg-rose-400/10' },
    { title: 'Net Profit', value: '₦6.27B', icon: Banknote, trend: '+15.8%', up: true },
    { title: 'Cash Flow', value: '₦1.45B', icon: Wallet, trend: '+8.1%', up: true },
    { title: 'Pending Invoices', value: '142', icon: FileBarChart, trend: '-12', up: true, trendColor: 'text-emerald-400' },
    { title: 'Budget Utilization', value: '68%', icon: PieChart, trend: 'On Track', up: true },
    { title: 'Mortgage Approvals', value: '₦4.2B', icon: Building2, trend: '+5.4%', up: true },
    { title: 'Commission Summary', value: '₦840M', icon: Users, trend: '+2.1%', up: true },
  ];

  const recentActivity = [
    { title: 'Large Payment Received', desc: '₦45,000,000 received for Property #PROP-001', time: '10 mins ago', icon: Banknote, color: 'text-emerald-400' },
    { title: 'Commission Processed', desc: 'Agent Sarah Jenkins paid ₦2,500,000', time: '1 hour ago', icon: Users, color: 'text-blue-400' },
    { title: 'Invoice Overdue', desc: 'Invoice #INV-492 is 5 days overdue', time: '3 hours ago', icon: ShieldAlert, color: 'text-rose-400' },
    { title: 'Budget Alert', desc: 'Marketing department exceeded Q3 budget by 5%', time: 'Yesterday', icon: PieChart, color: 'text-yellow-400' }
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Finance Overview</h2>
          <p className="text-sm text-ink/60">Executive summary of enterprise financial performance.</p>
        </div>
        <div className="flex gap-3">
          <GhostButton size="sm" onClick={() => handleAction('Export Report')}>Export Report</GhostButton>
          <GoldButton size="sm" onClick={() => handleAction('Create Invoice')}>Create Invoice</GoldButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <KPICard 
            key={index}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            trend={kpi.trend}
            trendColor={kpi.trendColor || (kpi.up ? 'text-emerald-400' : 'text-rose-400')}
            iconColor={kpi.iconColor || 'text-gold-400'}
            backgroundColor={kpi.backgroundColor || 'bg-gold-400/10'}
            trendPosition="bottom-right"
          />
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Revenue Trends */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-lg font-bold text-cream">Revenue vs. Expenses</h3>
            <select 
              className="rounded-xl border border-white/10 bg-navy-900/80 py-1.5 px-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none"
              onChange={() => handleAction('Change Date Range')}
            >
              <option>Year to Date</option>
              <option>Last Quarter</option>
              <option>Last 12 Months</option>
            </select>
          </div>
          <div className="flex-1 min-h-[300px] border-b border-l border-white/10 relative flex items-end justify-between px-4 pt-10 pb-4 mt-4">
            {/* Mock Chart Bars for Revenue and Expenses */}
            {[
              { r: 40, e: 20 }, { r: 60, e: 25 }, { r: 45, e: 30 }, { r: 80, e: 35 }, 
              { r: 55, e: 20 }, { r: 90, e: 40 }, { r: 75, e: 35 }, { r: 100, e: 45 }
            ].map((d, i) => (
              <div key={i} className="w-8 flex items-end gap-1 group relative">
                <div className="w-3 bg-rose-400/80 rounded-t-sm transition-all group-hover:bg-rose-400" style={{ height: `${d.e}%` }}></div>
                <div className="w-3 bg-emerald-400/80 rounded-t-sm transition-all group-hover:bg-emerald-400" style={{ height: `${d.r}%` }}></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between px-4 mt-4 text-xs text-ink/40 font-medium">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <ActivityTimeline 
            title="Recent Activity" 
            items={recentActivity} 
            showViewAll 
            onViewAll={() => handleAction('View All Activity')}
          />
        </div>
      </div>
    </div>
  );
}
