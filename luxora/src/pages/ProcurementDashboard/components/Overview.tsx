import { ShoppingCart, Users, Handshake, ShieldAlert, TrendingUp, Package, FileCheck, Banknote, Activity } from 'lucide-react';

export default function Overview() {
  const kpis = [
    { label: 'Total Spend (YTD)', value: '₦1.2B', icon: Banknote, trend: '+12%', color: 'text-gold-400', bg: 'bg-gold-400/10' },
    { label: 'Open PRs', value: '14', icon: FileCheck, trend: '-2', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Pending POs', value: '8', icon: ShoppingCart, trend: '+3', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Active Vendors', value: '124', icon: Users, trend: '+15', color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Active Contracts', value: '45', icon: Handshake, trend: '0', color: 'text-rose-400', bg: 'bg-rose-400/10' },
    { label: 'Inventory Alerts', value: '3', icon: ShieldAlert, trend: '+1', color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Budget Utilized', value: '68%', icon: TrendingUp, trend: '+4%', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { label: 'Asset Requisitions', value: '12', icon: Package, trend: '-5', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  ];

  const recentActivity = [
    { id: 1, action: 'Purchase Order Approved', details: 'PO-8812 for Cisco Routers', time: '2 hours ago', icon: ShoppingCart, iconColor: 'text-emerald-400' },
    { id: 2, action: 'New Vendor Registered', details: 'SecureNet Solutions added to directory', time: '5 hours ago', icon: Users, iconColor: 'text-blue-400' },
    { id: 3, action: 'Inventory Alert', details: 'Office Supplies running low at HQ', time: '1 day ago', icon: ShieldAlert, iconColor: 'text-rose-400' },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h2 className="font-heading text-2xl font-bold text-cream">Procurement Overview</h2>
        <p className="text-sm text-ink/60">Monitor purchasing, vendors, and internal inventory.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
                <Icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
              <div className="text-sm text-ink/60 mb-1">{kpi.label}</div>
              <div className="flex items-end justify-between">
                <div className="font-heading text-3xl font-bold text-cream">{kpi.value}</div>
                <div className={`text-xs ${kpi.trend.startsWith('+') ? 'text-emerald-400' : kpi.trend.startsWith('-') ? 'text-rose-400' : 'text-ink/60'}`}>
                  {kpi.trend} this month
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-cream">Spend Analytics</h3>
            <button className="text-sm text-gold-400 hover:text-gold-300">View Full Report</button>
          </div>
          <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-white/10 bg-navy-900/50">
            <div className="text-center text-ink/40">
              <Activity className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p>Spend Analytics Chart Placeholder</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="mb-6 font-heading text-lg font-bold text-cream">Recent Activity</h3>
          <div className="space-y-6">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex gap-4">
                  <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 ${activity.iconColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-cream">{activity.action}</div>
                    <div className="text-sm text-ink/60">{activity.details}</div>
                    <div className="mt-1 text-xs text-ink/40">{activity.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
