import { Shield, KeyRound, Globe, Percent, Server, AlertTriangle } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { useSession } from '../../../contexts/SessionContext';

export default function Settings() {
  const { user } = useSession();
  const isSuperAdmin = user?.role === 'Super Admin';

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-heading text-2xl font-bold text-cream">System Configuration</h2>
        <p className="text-sm text-ink/60">Global platform settings and administrative access controls.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Platform Settings */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 lg:col-span-2 space-y-6">
          <h3 className="font-heading text-lg font-semibold text-cream border-b border-white/10 pb-4">Global Parameters</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink/70">Luxora Base Platform Fee (GMV)</label>
              <div className="relative w-1/2">
                <Percent className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input 
                  type="number" 
                  defaultValue="5.0"
                  step="0.1"
                  disabled={!isSuperAdmin}
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-12 text-cream focus:border-gold-400/50 focus:outline-none disabled:opacity-50"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-sm">%</div>
              </div>
              <p className="text-xs text-ink/50 mt-1">The standard percentage Luxora takes from closed property deals.</p>
            </div>

            <div className="space-y-2 pt-4">
              <label className="text-sm font-medium text-ink/70">Default Currency</label>
              <div className="relative w-1/2">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <select disabled={!isSuperAdmin} className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-4 text-cream focus:border-gold-400/50 focus:outline-none appearance-none disabled:opacity-50">
                  <option>NGN (Nigerian Naira - ₦)</option>
                  <option>USD (US Dollar - $)</option>
                  <option>GBP (British Pound - £)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-cream">System Status</h3>
            
            <div className="flex items-center justify-between rounded-xl border border-rose-400/20 bg-rose-400/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-400/10 text-rose-400">
                  <Server className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-rose-400">Maintenance Mode</div>
                  <div className="text-xs text-ink/60 mt-1">Suspend all non-admin logins and disable new listings.</div>
                </div>
              </div>
              <div className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${!isSuperAdmin ? 'opacity-50 cursor-not-allowed bg-white/10' : 'bg-white/10 hover:bg-white/20'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1`} />
              </div>
            </div>
            {!isSuperAdmin && (
              <p className="text-xs text-rose-400/80 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Only Super Admins can alter global parameters or system status.</p>
            )}
          </div>

          {isSuperAdmin && (
            <div className="pt-4">
              <GoldButton>Apply Global Changes</GoldButton>
            </div>
          )}
        </div>

        {/* Security & Access */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-cream border-b border-white/10 pb-4">My Access</h3>
            <div className="flex items-center gap-3">
              <Shield className={`h-5 w-5 ${isSuperAdmin ? 'text-gold-400' : 'text-blue-400'}`} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-cream">Role</p>
                <p className={`text-xs ${isSuperAdmin ? 'text-gold-400' : 'text-blue-400'}`}>{user?.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <KeyRound className="h-5 w-5 text-ink/50" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-cream">Admin Password</p>
                <p className="text-xs text-ink/50">Required every 30 days</p>
              </div>
              <GhostButton size="sm">Update</GhostButton>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
