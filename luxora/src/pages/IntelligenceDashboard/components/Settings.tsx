import { useState } from 'react';
import { 
  Mail, Smartphone, Shield, KeyRound, Monitor, FileBarChart, Brain
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
    email: true, sms: false, push: true, marketAlerts: true, aiInsights: true, reportDelivery: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleNotif = (key: keyof typeof notifs) => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAction = (action: string) => {
    showToast({
      title: 'Backend Integration',
      description: `Action "${action}" is ready for backend integration.`,
      type: 'info'
    });
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
      title="Intelligence Settings"
      subtitle="Manage your profile, notification preferences, and security settings."
      saveSuccess={saveSuccess}
      successMessage="Settings saved successfully!"
    >
      <SettingsSection 
        title="Intelligence Profile" 
        description="Update your personal information and contact details."
        headerAction={
          <>
            <GhostButton size="sm" className="mr-2" onClick={() => handleAction('Cancel Changes')}>Cancel</GhostButton>
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
            <GhostButton size="sm" onClick={() => handleAction('Change Photo')}>Change Photo</GhostButton>
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.name || "James Rodriguez"}
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Role / Title</label>
                <input 
                  type="text" 
                  defaultValue={user?.role || "Data Analyst"}
                  disabled
                  className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-sm text-ink/50 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Notification & Alerts" description="Choose how and when you want to be notified.">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-cream flex items-center gap-2 border-b border-white/10 pb-2">
              <Monitor className="h-4 w-4 text-gold-400" /> Notification Channels
            </h4>
            <div className="space-y-4">
              <SettingsToggle 
                icon={<Mail className="h-4 w-4" />}
                label="Email Notifications" 
                description="Receive updates via email"
                checked={notifs.email}
                onChange={() => toggleNotif('email')}
              />
              <SettingsToggle 
                icon={<Smartphone className="h-4 w-4" />}
                label="Push Notifications" 
                description="Receive push notifications"
                checked={notifs.push}
                onChange={() => toggleNotif('push')}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-cream flex items-center gap-2 border-b border-white/10 pb-2">
              <FileBarChart className="h-4 w-4 text-gold-400" /> Intelligence Alerts
            </h4>
            <div className="space-y-4">
              <SettingsToggle 
                label="Market Alerts" 
                description="Get notified about major market shifts"
                checked={notifs.marketAlerts}
                onChange={() => toggleNotif('marketAlerts')}
              />
              <SettingsToggle 
                icon={<Brain className="h-4 w-4" />}
                label="AI Insights" 
                description="Receive AI-generated market predictions"
                checked={notifs.aiInsights}
                onChange={() => toggleNotif('aiInsights')}
              />
              <SettingsToggle 
                label="Report Delivery" 
                description="Automated delivery of generated reports"
                checked={notifs.reportDelivery}
                onChange={() => toggleNotif('reportDelivery')}
              />
            </div>
          </div>
        </div>
      </SettingsSection>
      
      <SettingsSection title="Security" description="Manage your password and security settings.">
         <div className="space-y-4 max-w-md">
            <GhostButton className="w-full justify-start text-ink/80 hover:text-cream" onClick={() => handleAction('Change Password')}>
              <KeyRound className="mr-3 h-4 w-4" /> Change Password
            </GhostButton>
            <GhostButton className="w-full justify-start text-ink/80 hover:text-cream" onClick={() => handleAction('Two-Factor Authentication')}>
              <Shield className="mr-3 h-4 w-4" /> Two-Factor Authentication (2FA)
            </GhostButton>
         </div>
      </SettingsSection>
    </SettingsLayout>
  );
}
