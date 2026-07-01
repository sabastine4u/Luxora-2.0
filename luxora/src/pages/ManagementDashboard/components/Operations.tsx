import { Settings, ShieldCheck, Database, Zap } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function Operations() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Operations</h2>
          <p className="text-sm text-ink/60">Day-to-day platform activity and system health.</p>
        </div>
        <GhostButton>System Logs</GhostButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
            <Database className="h-6 w-6" />
          </div>
          <div className="text-sm text-ink/60 mb-1">Database Load</div>
          <div className="font-heading text-3xl font-bold text-cream">34%</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
            <Zap className="h-6 w-6" />
          </div>
          <div className="text-sm text-ink/60 mb-1">API Latency</div>
          <div className="font-heading text-3xl font-bold text-cream">42ms</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="text-sm text-ink/60 mb-1">Active Staff</div>
          <div className="font-heading text-3xl font-bold text-cream">24</div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
         <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
           <Settings className="h-5 w-5 text-ink/40" /> Recent Operations Log
         </h3>
         <div className="space-y-4">
           <div className="flex items-center justify-between text-sm">
             <span className="text-ink/60">System backup completed successfully</span>
             <span className="text-emerald-400 font-semibold">10 mins ago</span>
           </div>
           <div className="flex items-center justify-between text-sm">
             <span className="text-ink/60">Payment gateway sync</span>
             <span className="text-emerald-400 font-semibold">1 hour ago</span>
           </div>
           <div className="flex items-center justify-between text-sm">
             <span className="text-ink/60">High traffic alert triggered (15k concurrent users)</span>
             <span className="text-gold-400 font-semibold">2 hours ago</span>
           </div>
         </div>
      </div>
    </div>
  );
}
