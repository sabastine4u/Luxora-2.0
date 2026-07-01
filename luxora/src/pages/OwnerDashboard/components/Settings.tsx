import { User, Mail, Bell, Shield, KeyRound, Smartphone, Landmark } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { useSession } from '../../../contexts/SessionContext';

export default function Settings() {
  const { user } = useSession();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-heading text-2xl font-bold text-cream">Account Settings</h2>
        <p className="text-sm text-ink/60">Manage your profile, security, and payout preferences.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Settings */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 lg:col-span-2 space-y-6">
          <h3 className="font-heading text-lg font-semibold text-cream border-b border-white/10 pb-4">Profile Information</h3>
          
          <div className="flex items-center gap-6">
            <img src={user?.avatar} alt="Profile" className="h-20 w-20 rounded-full object-cover border-2 border-gold-400/50" />
            <div>
              <GhostButton size="sm">Change Photo</GhostButton>
              <p className="mt-2 text-xs text-ink/50">JPG, GIF or PNG. Max size of 800K</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink/70">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input 
                  type="text" 
                  defaultValue={user?.name}
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-4 text-cream focus:border-gold-400/50 focus:outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink/70">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input 
                  type="email" 
                  defaultValue={user?.email}
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-4 text-cream focus:border-gold-400/50 focus:outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink/70">Phone Number</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input 
                  type="tel" 
                  defaultValue="+234 800 123 4567"
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-4 text-cream focus:border-gold-400/50 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-cream">Payout Details</h3>
            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                  <Landmark className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-cream">Guaranty Trust Bank</div>
                  <div className="text-xs text-ink/50">**** **** 4210</div>
                </div>
              </div>
              <GhostButton size="sm">Edit</GhostButton>
            </div>
          </div>

          <div className="pt-4">
            <GoldButton>Save Changes</GoldButton>
          </div>
        </div>

        {/* Security & Preferences */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-cream border-b border-white/10 pb-4">Security</h3>
            <div className="flex items-center gap-3">
              <KeyRound className="h-5 w-5 text-ink/50" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-cream">Password</p>
                <p className="text-xs text-ink/50">Last changed 3 months ago</p>
              </div>
              <GhostButton size="sm">Update</GhostButton>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-emerald-400" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-cream">Two-Factor Auth</p>
                <p className="text-xs text-ink/50">Enabled via SMS</p>
              </div>
              <GhostButton size="sm">Manage</GhostButton>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-cream border-b border-white/10 pb-4">Notifications</h3>
            {[
              { label: 'Offers & Bids', desc: 'Alert me on new offers immediately', icon: Mail, on: true },
              { label: 'Verification Updates', desc: 'Status changes on my properties', icon: Bell, on: true },
              { label: 'Tenant Messages', desc: 'Send to my SMS as well', icon: Smartphone, on: false },
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <pref.icon className="h-5 w-5 text-ink/50" />
                  <div>
                    <p className="text-sm font-semibold text-cream">{pref.label}</p>
                    <p className="text-[10px] text-ink/50">{pref.desc}</p>
                  </div>
                </div>
                <div className={`relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors ${pref.on ? 'bg-gold-400' : 'bg-white/10'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pref.on ? 'translate-x-4' : 'translate-x-1'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
