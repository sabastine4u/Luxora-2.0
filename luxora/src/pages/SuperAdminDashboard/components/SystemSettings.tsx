import { Server, Database, Save, RotateCcw } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';

export default function SystemSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Advanced System Settings</h2>
          <p className="text-sm text-ink/60">Core system variables, feature flags, and API integrations.</p>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
            <Server className="h-5 w-5 text-blue-400" />
            <h3 className="font-heading text-lg font-semibold text-cream">Feature Flags</h3>
          </div>
          
          <div className="space-y-4">
             <div className="flex items-center justify-between">
               <div>
                 <div className="text-sm font-semibold text-cream">Enable Cryptocurrency Payments</div>
                 <div className="text-xs text-ink/60">Allow users to pay for properties using BTC/USDT.</div>
               </div>
               <div className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors bg-emerald-400`}>
                 <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6`} />
               </div>
             </div>
             
             <div className="flex items-center justify-between">
               <div>
                 <div className="text-sm font-semibold text-cream">AI Price Estimation (Beta)</div>
                 <div className="text-xs text-ink/60">Show AI-generated property valuations on listings.</div>
               </div>
               <div className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors bg-white/10`}>
                 <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1`} />
               </div>
             </div>

             <div className="flex items-center justify-between">
               <div>
                 <div className="text-sm font-semibold text-cream">Global Maintenance Mode</div>
                 <div className="text-xs text-rose-400">Takes the entire platform offline for updates.</div>
               </div>
               <div className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors bg-white/10`}>
                 <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1`} />
               </div>
             </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
            <Database className="h-5 w-5 text-gold-400" />
            <h3 className="font-heading text-lg font-semibold text-cream">API & Third-Party Integrations</h3>
          </div>

          <div className="space-y-6">
             <div className="space-y-2">
               <label className="text-sm font-medium text-ink/70">SendGrid API Key (Email)</label>
               <input type="password" value="********************************" readOnly className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 px-4 text-ink/50 focus:outline-none" />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium text-ink/70">Stripe Secret Key (Payments)</label>
               <input type="password" value="********************************" readOnly className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 px-4 text-ink/50 focus:outline-none" />
             </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <GhostButton className="flex items-center gap-2"><RotateCcw className="h-4 w-4" /> Reset Defaults</GhostButton>
          <GoldButton className="flex items-center gap-2"><Save className="h-4 w-4" /> Save Configuration</GoldButton>
        </div>
      </div>
    </div>
  );
}
