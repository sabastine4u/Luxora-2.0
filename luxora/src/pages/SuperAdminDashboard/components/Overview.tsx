import { useState } from 'react';
import { Activity, ShieldCheck, Banknote, Users, AlertTriangle, Crown, Plus, Server, Database, TrendingUp } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';

export default function Overview() {
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, type: string | null}>({ isOpen: false, type: null });

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader 
        name="Platform Overview" 
        subtitle="Global command center for enterprise intelligence and governance."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2" onClick={() => setConfirmModal({ isOpen: true, type: 'export' })}>
              <Activity className="h-4 w-4" /> Export Report
            </GhostButton>
            <GoldButton className="flex items-center gap-2" onClick={() => setConfirmModal({ isOpen: true, type: 'add_admin' })}>
              <Plus className="h-4 w-4" /> Add Administrator
            </GoldButton>
          </div>
        }
      />

      {/* Global Health Snapshot */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Platform Revenue" value="₦4.2B" trend="+15% MTD" trendColor="text-emerald-400" icon={Banknote} />
        <KPICard title="Active Users" value="142.5K" trend="+4.8% MTD" trendColor="text-emerald-400" icon={Users} />
        <KPICard title="Active Fraud Alerts" value="3" trend="Requires Review" trendColor="text-rose-400" icon={AlertTriangle} />
        <KPICard title="System Uptime" value="99.99%" trend="All Services Operational" trendColor="text-emerald-400" icon={Server} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions & Governance */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-6 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" /> Enterprise Governance Actions
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setConfirmModal({ isOpen: true, type: 'add_admin' })}
                className="flex items-center justify-between p-4 bg-navy-900/50 border border-white/5 rounded-xl hover:bg-white/[0.02] transition-colors text-left"
              >
                <div>
                  <div className="font-semibold text-cream text-sm">Provision Administrator</div>
                  <div className="text-xs text-ink/60 mt-1">Create a new global admin account.</div>
                </div>
                <div className="p-2 bg-gold-400/10 text-gold-400 rounded-lg"><Plus className="h-4 w-4" /></div>
              </button>
              
              <button 
                onClick={() => setConfirmModal({ isOpen: true, type: 'maintenance' })}
                className="flex items-center justify-between p-4 bg-navy-900/50 border border-white/5 rounded-xl hover:bg-white/[0.02] transition-colors text-left"
              >
                <div>
                  <div className="font-semibold text-cream text-sm">Maintenance Window</div>
                  <div className="text-xs text-ink/60 mt-1">Schedule global downtime.</div>
                </div>
                <div className="p-2 bg-rose-400/10 text-rose-400 rounded-lg"><Database className="h-4 w-4" /></div>
              </button>
            </div>
          </div>
          
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-heading text-lg font-bold text-cream flex items-center gap-2">
                 <TrendingUp className="h-5 w-5 text-blue-400" /> Recent Platform Activity
               </h3>
             </div>
             <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="mt-1"><div className="w-2 h-2 rounded-full bg-emerald-400"></div></div>
                  <div>
                    <div className="text-sm font-medium text-cream">System Backup Completed</div>
                    <div className="text-xs text-ink/60">Automated daily backup finished successfully across all regions.</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1"><div className="w-2 h-2 rounded-full bg-rose-400"></div></div>
                  <div>
                    <div className="text-sm font-medium text-cream">High Risk Account Suspended</div>
                    <div className="text-xs text-ink/60">Compliance engine automatically suspended Agency ADG-892 for KYC violation.</div>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Pending Verifications & Rankings */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-gold-400" /> Pending Verifications
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-navy-900/50 border border-white/5 rounded-xl">
                 <span className="text-sm font-medium text-cream">Agents</span>
                 <span className="text-xs bg-gold-400/10 text-gold-400 px-2 py-1 rounded-full font-bold">42 Queue</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-navy-900/50 border border-white/5 rounded-xl">
                 <span className="text-sm font-medium text-cream">Agencies</span>
                 <span className="text-xs bg-blue-400/10 text-blue-400 px-2 py-1 rounded-full font-bold">12 Queue</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-navy-900/50 border border-white/5 rounded-xl">
                 <span className="text-sm font-medium text-cream">Owners</span>
                 <span className="text-xs bg-purple-400/10 text-purple-400 px-2 py-1 rounded-full font-bold">18 Queue</span>
              </div>
            </div>
          </div>
          
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Crown className="h-4 w-4 text-emerald-400" /> Top Agency Highlights
            </h3>
            <div className="space-y-3">
               <div className="flex items-center gap-3">
                 <div className="font-bold text-xl text-ink/20">1</div>
                 <div>
                   <div className="text-sm font-bold text-cream">Lagos Luxury Realty</div>
                   <div className="text-xs text-ink/60">₦1.2B Volume • 12 Active</div>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <div className="font-bold text-xl text-ink/20">2</div>
                 <div>
                   <div className="text-sm font-bold text-cream">Abuja Prime Estates</div>
                   <div className="text-xs text-ink/60">₦850M Volume • 8 Active</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null })}
        onConfirm={() => setConfirmModal({ isOpen: false, type: null })}
        title={
          confirmModal.type === 'add_admin' ? 'Provision Administrator' : 
          confirmModal.type === 'maintenance' ? 'Schedule Maintenance' : 
          'Export Global Report'
        }
        message={
          confirmModal.type === 'add_admin' ? 'Are you sure you want to provision a new Administrator account? A setup link will be securely emailed to them.' : 
          confirmModal.type === 'maintenance' ? 'Schedule a global maintenance window? This will notify all users 15 minutes prior.' :
          'Are you sure you want to export the complete platform intelligence report as a CSV file?'
        }
        confirmText={
          confirmModal.type === 'add_admin' ? 'Create Account' : 
          confirmModal.type === 'maintenance' ? 'Schedule' :
          'Download'
        }
        isDestructive={false}
      />
    </div>
  );
}
