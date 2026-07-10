import { Shield, KeyRound, Globe, Percent, Server, AlertTriangle } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { useSession } from '../../../contexts/SessionContext';
import { SettingsLayout } from '../../../components/dashboard/shared/layouts/SettingsLayout';
import { SettingsSection } from '../../../components/dashboard/shared/settings/SettingsSection';
import { SettingsToggle } from '../../../components/dashboard/shared/settings/SettingsToggle';

export default function Settings() {
  const { user } = useSession();
  const isSuperAdmin = user?.role === 'Super Admin';

  return (
    <SettingsLayout
      title="System Configuration"
      subtitle="Global platform settings and administrative access controls."
    >

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Platform Settings */}
        <SettingsSection
          title="Global Parameters"
          size="2xl"
          className="lg:col-span-2"
        >
          
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
            
            <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-4">
              <SettingsToggle
                label="Maintenance Mode"
                labelClassName="text-rose-400"
                description="Suspend all non-admin logins and disable new listings."
                checked={false}
                disabled={!isSuperAdmin}
                onChange={() => {}}
                icon={
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-400/10 text-rose-400 -mt-1">
                    <Server className="h-5 w-5" />
                  </div>
                }
              />
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
        </SettingsSection>

        {/* Security & Access */}
        <div className="space-y-6">
          <SettingsSection
            title="My Access"
            size="2xl"
            className="!space-y-4"
          >
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
          </SettingsSection>
        </div>

      </div>
    </SettingsLayout>
  );
}
