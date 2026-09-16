import { useCallback } from 'react';
import { AlertTriangle, Building2, TrendingUp, Users } from 'lucide-react';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { GhostButton } from '../../../components/ui/ui';
import { propertyManagementApi } from '../../../api/property-management.api';
import { usePropertyManagementResource } from '../usePropertyManagementResource';

const formatMoney = (value = 0) => `₦${Number(value).toLocaleString()}`;

export default function Overview() {
  const load = useCallback(async () => {
    const [summaryResult, analyticsResult, propertiesResult] = await Promise.all([propertyManagementApi.summary(), propertyManagementApi.analytics(), propertyManagementApi.properties()]);
    return { summary: (summaryResult as any).summary, analytics: (analyticsResult as any).analytics, properties: (propertiesResult as any).properties || [] };
  }, []);
  const { data, loading, error, refresh } = usePropertyManagementResource(load, [load]);
  if (loading) return <div className="space-y-6 max-w-7xl animate-pulse"><div className="h-8 w-72 rounded bg-white/10" /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <div key={i} className="h-36 rounded-2xl bg-white/10" />)}</div></div>;
  if (error) return <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-6 text-rose-200">{error} <GhostButton className="ml-3" onClick={() => void refresh()}>Retry</GhostButton></div>;
  const { summary, analytics, properties } = data!;
  const tasks = [summary.openWorkOrders && `${summary.openWorkOrders} open work order(s)`, summary.pendingInspections && `${summary.pendingInspections} pending inspection(s)`, summary.pendingExpenses && `${summary.pendingExpenses} expense(s) awaiting approval`, summary.pendingRentPayments && `${summary.pendingRentPayments} rent payment(s) requiring attention`].filter(Boolean);
  return <div className="space-y-6 max-w-7xl">
    <div className="flex items-center justify-between gap-4"><div><h2 className="font-heading text-2xl font-bold text-cream">Property Manager Overview</h2><p className="text-sm text-ink/60">Your command center for portfolio operations.</p></div><GhostButton disabled title="Reporting is not available in the Property Manager API">Generate Report</GhostButton></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><KPICard title="Total Properties" value={String(summary.properties)} icon={Building2} iconColor="text-gold-400" trend={`${properties.length} assigned to your portfolio`} trendColor="text-ink/60" /><KPICard title="Active Occupancies" value={String(summary.activeTenants)} icon={Users} iconColor="text-emerald-400" trend={`${analytics.totalOccupancyRecords} total occupancy records`} trendColor="text-ink/60" /><KPICard title="Pending Requests" value={String(summary.openWorkOrders)} icon={AlertTriangle} iconColor="text-rose-400" trend={`${summary.pendingInspections} inspection(s) pending`} trendColor="text-ink/60" /><KPICard title="Rent Collected" value={formatMoney(analytics.rentCollected)} icon={TrendingUp} iconColor="text-blue-400" trend={`${formatMoney(analytics.overdueRent)} overdue`} trendColor="text-ink/60" /></div>
    <div className="grid gap-6 lg:grid-cols-2"><section className="rounded-2xl border border-white/10 bg-navy-800/50 p-6"><h3 className="font-heading text-lg font-semibold text-cream">Pending Tasks</h3><div className="mt-5 space-y-3">{tasks.length ? tasks.map(task => <div key={task} className="rounded-xl border border-white/5 bg-navy-900/50 p-4 text-cream">{task}</div>) : <p className="text-sm text-ink/60">No pending tasks in your portfolio.</p>}</div></section><section className="rounded-2xl border border-white/10 bg-navy-800/50 p-6"><h3 className="font-heading text-lg font-semibold text-cream">Recent Activities</h3><p className="mt-5 text-sm text-ink/60">Activity history is not provided by the current Property Manager API.</p></section></div>
  </div>;
}
