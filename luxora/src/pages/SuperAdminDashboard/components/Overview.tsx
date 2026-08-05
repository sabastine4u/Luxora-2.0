import { useState } from 'react';
import { Crown, FileCheck, Server, Activity } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { 
  executiveSummary, 
  platformKPIs, 
  verificationPipeline, 
  assignmentPipeline, 
  platformHealth, 
  governanceActions 
} from '../../../data/superAdminData';

export default function Overview() {
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, type: string | null}>({ isOpen: false, type: null });

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader 
        name="Platform Command Center" 
        subtitle="Global Governance • Enterprise Operations"
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2" onClick={() => setConfirmModal({ isOpen: true, type: 'export' })}>
              <FileCheck className="h-4 w-4" /> Enterprise Audit
            </GhostButton>
            <GoldButton className="flex items-center gap-2" onClick={() => setConfirmModal({ isOpen: true, type: 'settings' })}>
              <Server className="h-4 w-4" /> System Settings
            </GoldButton>
          </div>
        }
      />

      {/* Executive Summary */}
      <div className="rounded-2xl border border-gold-400/20 bg-gold-400/5 p-6">
        <h3 className="font-heading text-lg font-bold text-cream mb-2 flex items-center gap-2">
          <Crown className="h-5 w-5 text-gold-400" /> Executive Summary
        </h3>
        <p className="text-ink/80 text-sm leading-relaxed">
          {executiveSummary}
        </p>
      </div>

      {/* Platform KPIs - Row 1 */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {platformKPIs.row1.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <KPICard key={index} title={kpi.title} value={kpi.value} trend={kpi.trend} trendColor={kpi.trendColor} icon={Icon} />
          );
        })}
      </div>

      {/* Platform KPIs - Row 2 */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {platformKPIs.row2.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <KPICard key={index} title={kpi.title} value={kpi.value} trend={kpi.trend} trendColor={kpi.trendColor} icon={Icon} />
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Operational Status (Pipelines) */}
        <div className="lg:col-span-2 space-y-6">
          <SegmentedProgressBar 
            title="Verification Operations" 
            segments={verificationPipeline}
            showTotal={true}
          />
          
          <SegmentedProgressBar 
            title="Assignment Operations" 
            segments={assignmentPipeline}
            showTotal={true}
          />
        </div>

        {/* Platform Health & Quick Actions */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Server className="h-4 w-4 text-emerald-400" /> Platform Health
            </h3>
            <div className="space-y-4">
              {platformHealth.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className={`flex justify-between items-center p-3 bg-navy-900/50 border ${item.border} rounded-xl`}>
                     <span className="text-sm font-medium text-cream flex items-center gap-2">
                       <Icon className={`h-4 w-4 ${item.color}`}/> {item.label}
                     </span>
                     <EnterpriseStatusBadge status={item.badgeStatus} />
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-400" /> Governance Actions
            </h3>
            <div className="space-y-3">
               {governanceActions.map((action, index) => {
                 const Icon = action.icon;
                 return (
                   <button key={index} onClick={() => setConfirmModal({ isOpen: true, type: action.id })} className="w-full flex items-center justify-between p-3 bg-navy-900/50 border border-white/5 rounded-xl hover:bg-white/[0.02] transition-colors text-left">
                     <span className="text-sm font-medium text-cream flex items-center gap-2">
                       <Icon className={`h-4 w-4 ${action.color}`}/> {action.label}
                     </span>
                   </button>
                 );
               })}
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null })}
        onConfirm={() => setConfirmModal({ isOpen: false, type: null })}
        title={
          confirmModal.type === 'broadcast' ? 'Global Broadcast' : 
          confirmModal.type === 'maintenance' ? 'Schedule Maintenance' : 
          confirmModal.type === 'settings' ? 'System Settings' :
          'Enterprise Audit'
        }
        message={
          confirmModal.type === 'broadcast' ? 'Send a global notification to all users across the platform.' : 
          confirmModal.type === 'maintenance' ? 'Schedule a global maintenance window? This will notify all users 15 minutes prior.' :
          confirmModal.type === 'settings' ? 'Navigate to System Settings to configure global platform parameters.' :
          'Export the complete Enterprise Audit ledger for compliance review.'
        }
        confirmText={
          confirmModal.type === 'broadcast' ? 'Broadcast' : 
          confirmModal.type === 'maintenance' ? 'Schedule' :
          confirmModal.type === 'settings' ? 'Go to Settings' :
          'Download'
        }
        isDestructive={false}
      />
    </div>
  );
}
