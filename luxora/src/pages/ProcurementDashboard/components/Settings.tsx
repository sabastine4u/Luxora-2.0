import { useState } from 'react';
import { 
  User, Mail, Smartphone, MapPin, 
  Shield, KeyRound, Monitor, Camera 
} from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { useSession } from '../../../contexts/SessionContext';
import { SettingsLayout } from '../../../components/dashboard/shared/layouts/SettingsLayout';
import { SettingsSection } from '../../../components/dashboard/shared/settings/SettingsSection';
import { SettingsToggle } from '../../../components/dashboard/shared/settings/SettingsToggle';

export default function Settings() {
  const { user } = useSession();
  
  const [notifs, setNotifs] = useState({
    email: true, sms: true, push: true, procurementAlerts: true, approvalRequests: true, messages: true, inventoryUpdates: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleNotif = (key: keyof typeof notifs) => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMockSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <SettingsLayout
      title="Procurement Settings"
      subtitle="Manage your profile, notification preferences, and security settings."
      saveSuccess={saveSuccess}
      successMessage="Settings saved successfully!"
    >
      {/* Profile Information */}
      <SettingsSection 
        title="Procurement Profile" 
        description="Update your personal information and contact details."
        headerAction={
          <>
            <GhostButton>Cancel</GhostButton>
            <GoldButton onClick={handleMockSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </GoldButton>
          </>
        }
      >
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-gold-400/20 bg-navy-900">
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"} 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
              <button className="absolute inset-0 flex items-center justify-center bg-navy-950/60 opacity-0 transition-opacity hover:opacity-100">
                <Camera className="h-6 w-6 text-cream" />
              </button>
            </div>
            <GhostButton className="text-xs">Change Photo</GhostButton>
          </div>

          <div className="grid flex-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-ink/60">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                <input 
                  type="text" 
                  defaultValue={user?.name || "David Kim"} 
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-ink/60">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                <input 
                  type="email" 
                  defaultValue={user?.email || "procurement@luxora.com"} 
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-ink/60">Phone Number</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                <input 
                  type="tel" 
                  defaultValue="+234 800 555 0102" 
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-ink/60">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                <input 
                  type="text" 
                  defaultValue="Lagos, Nigeria" 
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Notification Preferences */}
      <SettingsSection 
        title="Notification Preferences" 
        description="Control how and when you receive updates."
        headerAction={
          <GoldButton onClick={handleMockSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </GoldButton>
        }
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-cream">Communication Channels</h4>
            <div className="space-y-3">
              <SettingsToggle 
                label="Email Notifications" 
                description="Receive daily summaries and critical alerts via email."
                checked={notifs.email} 
                onChange={() => toggleNotif('email')} 
              />
              <SettingsToggle 
                label="SMS Alerts" 
                description="Get SMS texts for urgent PR and PO updates."
                checked={notifs.sms} 
                onChange={() => toggleNotif('sms')} 
              />
              <SettingsToggle 
                label="Push Notifications" 
                description="Receive browser notifications while active."
                checked={notifs.push} 
                onChange={() => toggleNotif('push')} 
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-cream">Activity Alerts</h4>
            <div className="space-y-3">
              <SettingsToggle 
                label="Procurement Alerts" 
                description="Notifications for expiring contracts and low inventory."
                checked={notifs.procurementAlerts} 
                onChange={() => toggleNotif('procurementAlerts')} 
              />
              <SettingsToggle 
                label="Approval Requests" 
                description="Alerts when new PRs or RFQs need review."
                checked={notifs.approvalRequests} 
                onChange={() => toggleNotif('approvalRequests')} 
              />
              <SettingsToggle 
                label="Inventory Updates" 
                description="Notifications when assets are deployed or restocked."
                checked={notifs.inventoryUpdates} 
                onChange={() => toggleNotif('inventoryUpdates')} 
              />
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Security Settings */}
      <SettingsSection 
        title="Security & Authentication" 
        description="Manage your password and security settings."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-400/10 text-blue-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-cream">Two-Factor Authentication</div>
                  <div className="text-xs text-ink/60">Adds an extra layer of security</div>
                </div>
              </div>
              <GoldButton className="w-full justify-center">Enable 2FA</GoldButton>
            </div>

            <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-400/10 text-gold-400">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-cream">Password</div>
                  <div className="text-xs text-ink/60">Last changed 3 months ago</div>
                </div>
              </div>
              <GhostButton className="w-full justify-center border border-white/10">Change Password</GhostButton>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
            <div className="mb-4 flex items-center gap-2">
              <Monitor className="h-4 w-4 text-ink/40" />
              <h4 className="text-sm font-semibold text-cream">Active Sessions</h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-cream">Windows • Chrome</div>
                  <div className="text-xs text-emerald-400">Active Now • Lagos, NG</div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div>
                  <div className="text-sm font-medium text-cream">iPhone 14 Pro • Safari</div>
                  <div className="text-xs text-ink/60">Last active 2 hours ago • Lagos, NG</div>
                </div>
                <button className="text-xs font-medium text-rose-400 hover:text-rose-300">Revoke</button>
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>
    </SettingsLayout>
  );
}
