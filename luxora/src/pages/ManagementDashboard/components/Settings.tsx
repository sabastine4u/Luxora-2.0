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
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';

export default function Settings() {
  const { user } = useSession();
  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'Confirm',
    onConfirm: () => {}
  });
  
  const [notifs, setNotifs] = useState({
    email: true, sms: true, push: true, operationalAlerts: true, approvalRequests: true, messages: true, performanceUpdates: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleNotif = (key: keyof typeof notifs) => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMockSave = () => {
    setConfirmationState({
      isOpen: true,
      title: 'Save Settings',
      description: 'Are you sure you want to save all changes to your profile and notification preferences?',
      confirmText: 'Save Changes',
      onConfirm: () => {
        setIsSaving(true);
        setTimeout(() => {
          setIsSaving(false);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        }, 800);
      }
    });
  };

  const handleAction = (title: string, description: string, confirmText: string = 'Confirm') => {
    setConfirmationState({
      isOpen: true,
      title,
      description,
      confirmText,
      onConfirm: () => {
        // Mock action
      }
    });
  };

  return (
    <SettingsLayout
      title="Management Settings"
      subtitle="Manage your manager profile, notification preferences, and security settings."
      saveSuccess={saveSuccess}
      successMessage="Settings saved successfully!"
      headerAction={
        <GoldButton onClick={handleMockSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save All Changes'}
        </GoldButton>
      }
    >
      {/* 1. Profile Section */}
      <SettingsSection
        title="Manager Profile"
        description="Update your personal information and profile picture."
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-white/10">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-navy-800">
                    <User className="h-8 w-8 text-ink/40" />
                  </div>
                )}
              </div>
              <button 
                onClick={() => handleAction('Change Picture', 'Are you sure you want to change your profile picture?', 'Upload New')}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-navy-900/60 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Camera className="h-6 w-6 text-cream" />
              </button>
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-cream">{user?.name || 'Management User'}</h3>
              <p className="text-sm text-ink/60">{user?.role} • ID: MGT-40291</p>
              <div className="mt-2 flex gap-2">
                <GhostButton size="sm" onClick={() => handleAction('Change Picture', 'Are you sure you want to change your profile picture?', 'Upload New')}>Change Picture</GhostButton>
                <GhostButton size="sm" className="text-rose-400 hover:text-rose-300" onClick={() => handleAction('Remove Picture', 'Are you sure you want to remove your profile picture?', 'Remove')}>Remove</GhostButton>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm text-ink/60">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-ink/40" />
                <input type="text" defaultValue={user?.name} className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-cream focus:border-gold-400 focus:outline-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-ink/60">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-ink/40" />
                <input type="email" defaultValue={user?.email} className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-cream focus:border-gold-400 focus:outline-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-ink/60">Phone Number</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-3 h-4 w-4 text-ink/40" />
                <input type="tel" defaultValue="+234 800 000 0000" className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-cream focus:border-gold-400 focus:outline-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-ink/60">Office Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-ink/40" />
                <input type="text" defaultValue="Lagos HQ" className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-cream focus:border-gold-400 focus:outline-none" />
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* 2. Notification Preferences */}
      <SettingsSection
        title="Notification Preferences"
        description="Choose how and when you want to be notified."
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold text-cream uppercase tracking-wider">Delivery Methods</h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <SettingsToggle 
                label="Email Notifications" 
                checked={notifs.email} 
                onChange={() => toggleNotif('email')} 
              />
              <SettingsToggle 
                label="Push Notifications" 
                checked={notifs.push} 
                onChange={() => toggleNotif('push')} 
              />
              <SettingsToggle 
                label="SMS Alerts" 
                checked={notifs.sms} 
                onChange={() => toggleNotif('sms')} 
              />
            </div>
          </div>

          <div className="h-px w-full bg-white/10" />

          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold text-cream uppercase tracking-wider">Alert Types</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <SettingsToggle 
                label="Operational Alerts" 
                description="Get notified about system issues or compliance flags."
                checked={notifs.operationalAlerts} 
                onChange={() => toggleNotif('operationalAlerts')} 
              />
              <SettingsToggle 
                label="Approval Requests" 
                description="Receive alerts for items requiring your approval."
                checked={notifs.approvalRequests} 
                onChange={() => toggleNotif('approvalRequests')} 
              />
              <SettingsToggle 
                label="Direct Messages" 
                description="Notifications for messages from your team."
                checked={notifs.messages} 
                onChange={() => toggleNotif('messages')} 
              />
              <SettingsToggle 
                label="Performance Updates" 
                description="Weekly summaries of KPI changes."
                checked={notifs.performanceUpdates} 
                onChange={() => toggleNotif('performanceUpdates')} 
              />
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* 3. Security Settings */}
      <SettingsSection
        title="Security & Authentication"
        description="Manage your password and security protocols."
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-800 text-ink/40">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-cream">Password</p>
                <p className="text-sm text-ink/60">Last changed 3 months ago</p>
              </div>
            </div>
            <GhostButton size="sm" onClick={() => handleAction('Update Password', 'Are you sure you want to update your password? You will be redirected to the secure portal.', 'Update')}>Update Password</GhostButton>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-cream">Two-Factor Authentication (2FA)</p>
                <p className="text-sm text-ink/60">Authenticator app is configured</p>
              </div>
            </div>
            <GhostButton size="sm" onClick={() => handleAction('Configure 2FA', 'Are you sure you want to modify your Two-Factor Authentication settings?', 'Configure')}>Configure</GhostButton>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-800 text-ink/40">
                <Monitor className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-cream">Active Sessions</p>
                <p className="text-sm text-ink/60">You are logged in on 2 devices</p>
              </div>
            </div>
            <GhostButton size="sm" onClick={() => handleAction('Manage Devices', 'Are you sure you want to review and manage your active sessions?', 'Manage')}>Manage Devices</GhostButton>
          </div>
        </div>
      </SettingsSection>
      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={() => setConfirmationState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationState.onConfirm}
        title={confirmationState.title}
        description={confirmationState.description}
        confirmText={confirmationState.confirmText}
      />
    </SettingsLayout>
  );
}
