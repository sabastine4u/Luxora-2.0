import { ShoppingCart, Users, Handshake, ShieldAlert, TrendingUp, Package, FileCheck, Banknote, Activity } from 'lucide-react';
import { useState } from 'react';
import { useSession } from '../../../contexts/SessionContext';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { useWorkflowToast } from '../utils/workflowUtils';

export default function Overview() {
  const { user } = useSession();
  const { showWorkflowToast } = useWorkflowToast();
  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'Confirm',
    onConfirm: () => {}
  });
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

  const handleViewReport = () => {
    setConfirmationState({
      isOpen: true,
      title: 'View Spend Analytics',
      description: 'Do you want to generate and view the full Spend Analytics report?',
      confirmText: 'Generate Report',
      onConfirm: () => showWorkflowToast('Generate Report')
    });
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <DashboardHeader
        name={`Good morning, ${user?.name?.split(' ')[0] || 'Manager'}.`}
        subtitle="Monitor purchasing, vendors, and internal inventory operations."
        actions={<div className="flex gap-3"></div>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.label}
            value={kpi.value}
            trend={`${kpi.trend} this month`}
            trendColor={kpi.trend.startsWith('+') ? 'text-emerald-400' : kpi.trend.startsWith('-') ? 'text-rose-400' : 'text-ink/60'}
            icon={kpi.icon}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-cream">Spend Analytics</h3>
            <button onClick={handleViewReport} className="text-sm text-gold-400 hover:text-gold-300 transition-colors">View Full Report</button>
          </div>
          <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-white/10 bg-navy-900/50">
            <div className="text-center text-ink/40">
              <Activity className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p>Spend Analytics Chart Placeholder</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <ActivityTimeline
            title="Recent Activity"
            items={recentActivity.map(activity => ({
              title: activity.action,
              desc: activity.details,
              time: activity.time,
              icon: activity.icon,
              color: activity.iconColor
            }))}
          />
        </div>
      </div>
      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={() => setConfirmationState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationState.onConfirm}
        title={confirmationState.title}
        description={confirmationState.description}
        confirmText={confirmationState.confirmText}
      />
    </div>
  );
}
