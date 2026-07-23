import { Server, ShieldCheck, Activity, AlertCircle, Clock, Database, CheckCircle2, Thermometer, Wifi } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { SettingsToggle } from '../../../components/dashboard/shared/settings/SettingsToggle';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { useState } from 'react';

export default function SystemSettings() {
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean; type: 'maintenance' | 'scan' | 'backup' | 'audit' | null}>({ isOpen: false, type: null });

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader 
        name="Platform Operations" 
        subtitle="Platform stability monitor, infrastructure health, feature flags, and security status."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2" onClick={() => setConfirmModal({ isOpen: true, type: 'maintenance' })}>
              <Clock className="h-4 w-4" /> Maintenance Schedule
            </GhostButton>
            <GoldButton className="flex items-center gap-2" onClick={() => setConfirmModal({ isOpen: true, type: 'scan' })}>
              <ShieldCheck className="h-4 w-4" /> Run Security Scan
            </GoldButton>
          </div>
        }
      />

      <div className="grid md:grid-cols-3 gap-6">
        {/* Platform Stability Monitor & Infrastructure Health Dashboard */}
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-400/20 rounded-xl">
              <Server className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="font-heading text-xl font-bold text-cream">Infrastructure Health Dashboard</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-navy-900/50 border border-white/5 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-cream flex items-center gap-2"><Database className="h-4 w-4 text-blue-400" /> Database Cluster</span>
                <span className="text-emerald-400 text-xs font-bold px-2 py-1 bg-emerald-400/10 rounded-full">Healthy</span>
              </div>
              <div className="text-xs text-ink/60">Replication Lag: 12ms • Load: 45%</div>
            </div>
            <div className="p-4 bg-navy-900/50 border border-white/5 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-cream flex items-center gap-2"><Wifi className="h-4 w-4 text-gold-400" /> API Gateway</span>
                <span className="text-emerald-400 text-xs font-bold px-2 py-1 bg-emerald-400/10 rounded-full">Healthy</span>
              </div>
              <div className="text-xs text-ink/60">Response Time: 210ms • Error Rate: 0.01%</div>
            </div>
            <div className="p-4 bg-navy-900/50 border border-white/5 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-cream flex items-center gap-2"><Server className="h-4 w-4 text-purple-400" /> Web App Nodes</span>
                <span className="text-orange-400 text-xs font-bold px-2 py-1 bg-orange-400/10 rounded-full">Degraded</span>
              </div>
              <div className="text-xs text-ink/60">Node 4 Offline • Auto-scaling initiated</div>
            </div>
            <div className="p-4 bg-navy-900/50 border border-white/5 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-cream flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Edge Security</span>
                <span className="text-emerald-400 text-xs font-bold px-2 py-1 bg-emerald-400/10 rounded-full">Protected</span>
              </div>
              <div className="text-xs text-ink/60">DDoS Mitigation Active • WAF Rules Enforced</div>
            </div>
          </div>
        </div>

        {/* Operational Bottleneck Detection & Security Status */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-rose-400" /> Bottleneck Detection
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-rose-400/10 border border-rose-400/20 rounded-xl">
                <div className="text-sm font-semibold text-rose-400 mb-1 flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Image Processing</div>
                <div className="text-xs text-cream/90">Property image uploads are experiencing 15s delays due to high compression queue volume.</div>
              </div>
              <div className="p-3 bg-navy-900/50 border border-white/5 rounded-xl">
                <div className="text-sm font-medium text-cream flex justify-between">Security Status <span className="text-emerald-400">Optimal</span></div>
                <div className="text-xs text-ink/60 mt-1">Last penetration test passed 4 days ago.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="System Uptime" value="99.99%" trend="Last 90 Days" trendColor="text-emerald-400" icon={Activity} />
        <KPICard title="Critical Services" value="12/12" trend="All Operational" trendColor="text-emerald-400" icon={CheckCircle2} />
        <KPICard title="Avg Response Time" value="184ms" trend="-12ms vs Last Wk" trendColor="text-emerald-400" icon={Clock} />
        <KPICard title="Active Threats" value="0" trend="Blocked 42 attempts" trendColor="text-blue-400" icon={ShieldCheck} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Feature Flag Center */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-lg font-bold text-cream mb-6 flex items-center gap-2">
            <Server className="h-5 w-5 text-blue-400" /> Feature Flag Center
          </h3>
          <div className="space-y-4">
             <SettingsToggle
               label="AI Price Estimation (Beta)"
               description="Enable AI-driven property valuation tools for agents and owners."
               checked={true}
               checkedColor="bg-emerald-400"
               onChange={() => {}}
             />
             <SettingsToggle
               label="Crypto Payment Gateway Integration"
               description="Allow real estate transactions to be settled via USDC/BTC."
               checked={false}
               onChange={() => {}}
             />
             <SettingsToggle
               label="Global Maintenance Mode"
               description="Takes the entire platform offline for scheduled database migrations."
               descriptionClassName="text-xs text-rose-400"
               checked={false}
               onChange={() => {}}
             />
          </div>
        </div>

        {/* Maintenance Schedule & Integration Status */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-lg font-bold text-cream mb-6 flex items-center gap-2">
            <Database className="h-5 w-5 text-gold-400" /> System Integration Status
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-navy-900/50 border border-white/5 rounded-xl">
               <div>
                 <div className="font-semibold text-cream text-sm">SendGrid (Email Delivery)</div>
                 <div className="text-xs text-ink/60 mt-1">API Status: Connected</div>
               </div>
               <span className="text-emerald-400 text-xs font-bold px-2 py-1 bg-emerald-400/10 rounded-full">Healthy</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-navy-900/50 border border-white/5 rounded-xl">
               <div>
                 <div className="font-semibold text-cream text-sm">Stripe (Payment Processing)</div>
                 <div className="text-xs text-ink/60 mt-1">API Status: Connected</div>
               </div>
               <span className="text-emerald-400 text-xs font-bold px-2 py-1 bg-emerald-400/10 rounded-full">Healthy</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-navy-900/50 border border-white/5 rounded-xl">
               <div>
                 <div className="font-semibold text-cream text-sm">Twilio (SMS Notifications)</div>
                 <div className="text-xs text-ink/60 mt-1">API Status: Error</div>
               </div>
               <span className="text-rose-400 text-xs font-bold px-2 py-1 bg-rose-400/10 rounded-full">Degraded</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        {/* Storage Configuration */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-lg font-bold text-cream mb-6 flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-400" /> Storage & Backup Controls
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-navy-900/50 border border-white/5 rounded-xl">
               <div>
                 <div className="font-semibold text-cream text-sm">Automated Database Backups</div>
                 <div className="text-xs text-ink/60 mt-1">Runs daily at 02:00 UTC</div>
               </div>
               <GhostButton size="sm" onClick={() => setConfirmModal({ isOpen: true, type: 'backup' })}>Trigger Now</GhostButton>
            </div>
            <div className="flex justify-between items-center p-4 bg-navy-900/50 border border-white/5 rounded-xl">
               <div>
                 <div className="font-semibold text-cream text-sm">Media Storage (AWS S3)</div>
                 <div className="text-xs text-ink/60 mt-1">Total Usage: 4.2TB / 10TB</div>
               </div>
               <span className="text-emerald-400 text-xs font-bold px-2 py-1 bg-emerald-400/10 rounded-full">Optimal</span>
            </div>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-lg font-bold text-cream flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" /> Platform Audit Logs
            </h3>
            <GhostButton size="sm" onClick={() => setConfirmModal({ isOpen: true, type: 'audit' })}>Download CSV</GhostButton>
          </div>
          <div className="space-y-4 flex-1">
            <div className="flex gap-4">
              <div className="mt-1"><div className="w-2 h-2 rounded-full bg-blue-400"></div></div>
              <div>
                <div className="text-sm font-medium text-cream">API Key Rotated</div>
                <div className="text-xs text-ink/60">Stripe production key was rotated by System via scheduled task.</div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1"><div className="w-2 h-2 rounded-full bg-rose-400"></div></div>
              <div>
                <div className="text-sm font-medium text-cream">Failed Admin Login</div>
                <div className="text-xs text-ink/60">IP 192.168.1.104 attempted login with invalid credentials.</div>
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
          confirmModal.type === 'maintenance' ? 'Schedule Maintenance' : 
          confirmModal.type === 'scan' ? 'Run Security Scan' : 
          confirmModal.type === 'backup' ? 'Trigger Manual Backup' : 
          'Download Audit Logs'
        }
        message={
          confirmModal.type === 'maintenance' ? 'Are you sure you want to schedule a global maintenance window? This will notify all logged-in users 15 minutes prior to shutdown.' : 
          confirmModal.type === 'scan' ? 'Are you sure you want to execute a full security scan on the production cluster? This may cause minor degradation in API response times.' : 
          confirmModal.type === 'backup' ? 'Trigger a manual database snapshot? This will capture the current state of the production cluster.' : 
          'Download a full CSV export of the last 30 days of global platform audit logs?'
        }
        confirmText={
          confirmModal.type === 'maintenance' ? 'Schedule' : 
          confirmModal.type === 'scan' ? 'Start Scan' : 
          confirmModal.type === 'backup' ? 'Start Backup' : 
          'Download'
        }
        isDestructive={false}
      />
    </div>
  );
}
