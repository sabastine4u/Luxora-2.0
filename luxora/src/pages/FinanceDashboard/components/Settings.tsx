import { useState } from 'react';
import { 
  Mail, Smartphone, Shield, KeyRound, Monitor, FileBarChart
} from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { useSession } from '../../../contexts/SessionContext';
import { SettingsLayout } from '../../../components/dashboard/shared/layouts/SettingsLayout';
import { SettingsSection } from '../../../components/dashboard/shared/settings/SettingsSection';
import { SettingsToggle } from '../../../components/dashboard/shared/settings/SettingsToggle';
import { useToast } from '../../../contexts/ToastContext';

export default function Settings() {
  const { user } = useSession();
  const { showToast } = useToast();
  
  const [notifs, setNotifs] = useState({
    email: true, sms: false, push: true, transactionAlerts: true, approvalRequests: true, budgetAlerts: true
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
      showToast({ type: 'success', title: 'Backend Integration', description: 'This feature is ready and will become fully functional during backend integration.' });
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <SettingsLayout
      title="Finance Settings"
      subtitle="Manage your profile, notification preferences, and security settings."
      saveSuccess={saveSuccess}
      successMessage="Settings saved successfully!"
    >
      <SettingsSection 
        title="Finance Profile" 
        description="Update your personal information and contact details."
        headerAction={
          <>
            <GhostButton size="sm" className="mr-2">Cancel</GhostButton>
            <GoldButton size="sm" onClick={handleMockSave} disabled={isSaving}>
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
            </div>
            <GhostButton size="sm">Change Photo</GhostButton>
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.name || "Sophia Williams"}
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Role / Title</label>
                <input 
                  type="text" 
                  defaultValue={user?.role || "Finance Manager"}
                  disabled
                  className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-sm text-ink/50 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Notification Preferences" description="Choose how and when you want to be notified.">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-cream flex items-center gap-2 border-b border-white/10 pb-2">
              <Monitor className="h-4 w-4 text-gold-400" /> Notification Channels
            </h4>
            <div className="space-y-4">
              <SettingsToggle 
                icon={<Mail className="h-4 w-4" />}
                label="Email Notifications" 
                description="Receive daily summaries and urgent alerts via email." 
                checked={notifs.email} 
                onChange={() => toggleNotif('email')} 
              />
              <SettingsToggle 
                icon={<Smartphone className="h-4 w-4" />}
                label="SMS Alerts" 
                description="Receive text messages for critical transactions." 
                checked={notifs.sms} 
                onChange={() => toggleNotif('sms')} 
              />
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-cream flex items-center gap-2 border-b border-white/10 pb-2">
              <FileBarChart className="h-4 w-4 text-gold-400" /> Alert Types
            </h4>
            <div className="space-y-4">
              <SettingsToggle 
                label="Transaction Alerts" 
                description="Get notified when high-value transactions occur." 
                checked={notifs.transactionAlerts} 
                onChange={() => toggleNotif('transactionAlerts')} 
              />
              <SettingsToggle 
                label="Approval Requests" 
                description="Alerts for pending invoice and refund approvals." 
                checked={notifs.approvalRequests} 
                onChange={() => toggleNotif('approvalRequests')} 
              />
              <SettingsToggle 
                label="Budget Variance" 
                description="Get notified when department budgets exceed thresholds." 
                checked={notifs.budgetAlerts} 
                onChange={() => toggleNotif('budgetAlerts')} 
              />
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Security & Authentication" description="Manage your password and 2FA settings.">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-cream flex items-center gap-2 border-b border-white/10 pb-2">
              <KeyRound className="h-4 w-4 text-gold-400" /> Password
            </h4>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Current Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">New Password</label>
              <input 
                type="password" 
                placeholder="Enter new password"
                className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
              />
            </div>
            <GoldButton size="sm" onClick={handleMockSave}>Update Password</GoldButton>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-cream flex items-center gap-2 border-b border-white/10 pb-2">
              <Shield className="h-4 w-4 text-gold-400" /> Two-Factor Authentication
            </h4>
            <p className="text-xs text-ink/60">
              Two-factor authentication adds an extra layer of security to your account. To log in, you'll need to provide a code along with your password.
            </p>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-400">2FA is Enabled</p>
                <p className="text-xs text-ink/60 mt-1">Authenticator App (Primary)</p>
              </div>
              <GhostButton size="sm" onClick={handleMockSave}>Manage 2FA</GhostButton>
            </div>
          </div>
        </div>
      </SettingsSection>
    </SettingsLayout>
  );
}
