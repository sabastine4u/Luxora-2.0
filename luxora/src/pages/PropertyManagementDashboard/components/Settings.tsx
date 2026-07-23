import { useState } from 'react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { useSession } from '../../../contexts/SessionContext';
import { SettingsLayout } from '../../../components/dashboard/shared/layouts/SettingsLayout';
import { SettingsSection } from '../../../components/dashboard/shared/settings/SettingsSection';
import { SettingsToggle } from '../../../components/dashboard/shared/settings/SettingsToggle';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { UploadModal } from './modals/UploadModal';
import { useToast } from '../../../contexts/ToastContext';
import { Mail, Smartphone, Shield, KeyRound, Monitor, FileBarChart, Moon, Sun } from 'lucide-react';
export default function Settings() {
  const { user } = useSession();
  const { showToast } = useToast();
  
  const [notifs, setNotifs] = useState({
    email: true, sms: false, push: true, maintenanceAlerts: true, rentAlerts: true, leaseAlerts: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [modalState, setModalState] = useState<'cancel' | 'photo' | 'password' | '2fa' | null>(null);

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
      title="Property Management Settings"
      subtitle="Manage your profile, notification preferences, and security settings."
      saveSuccess={saveSuccess}
      successMessage="Settings saved successfully!"
    >
      <SettingsSection 
        title="Management Profile" 
        description="Update your personal information and contact details."
        headerAction={
          <>
            <GhostButton size="sm" className="mr-2" onClick={() => setModalState('cancel')}>Cancel</GhostButton>
            <GoldButton size="sm" onClick={handleMockSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </GoldButton>
          </>
        }
      >
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0 flex flex-col items-center space-y-4">
            <div className="flex items-center gap-6 mt-4 p-4 border border-white/10 rounded-xl bg-navy-900/30">
              <div className="h-16 w-16 rounded-full bg-gold-400/20 flex items-center justify-center text-gold-400 font-bold text-xl shrink-0">
                PM
              </div>
              <div>
                <h4 className="text-cream font-medium">Profile Photo</h4>
                <p className="text-xs text-ink/60 mt-1 mb-3">JPG, GIF or PNG. Max size of 800K</p>
                <GhostButton size="sm" onClick={() => setModalState('photo')}>Change Photo</GhostButton>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink/60">First Name</label>
                <input type="text" defaultValue={user?.name.split(' ')[0]} className="w-full rounded-lg border border-white/10 bg-navy-900/50 px-4 py-2 text-sm text-cream focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink/60">Last Name</label>
                <input type="text" defaultValue={user?.name.split(' ')[1]} className="w-full rounded-lg border border-white/10 bg-navy-900/50 px-4 py-2 text-sm text-cream focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400 transition-colors" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-medium text-ink/60">Email Address</label>
                <input type="email" defaultValue={user?.email} className="w-full rounded-lg border border-white/10 bg-navy-900/50 px-4 py-2 text-sm text-cream focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Appearance">
        <div className="p-6">
          <p className="text-ink/60 text-sm mb-4">Customize the dashboard's look and feel.</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gold-400/30 bg-gold-400/5 rounded-xl p-4 cursor-pointer text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gold-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Moon className="h-6 w-6 text-gold-400 mx-auto mb-2" />
              <span className="text-cream font-medium text-sm">Dark Navy (Default)</span>
              <div className="absolute top-2 right-2 h-3 w-3 rounded-full bg-gold-400" />
            </div>
            <div className="border border-white/10 bg-navy-900/30 rounded-xl p-4 cursor-not-allowed text-center opacity-50 relative overflow-hidden group">
              <Sun className="h-6 w-6 text-ink/40 mx-auto mb-2" />
              <span className="text-ink/60 font-medium text-sm">Light Mode (Coming Soon)</span>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Notifications" description="Configure how you receive operational alerts.">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-cream">Delivery Methods</h4>
            <SettingsToggle
              icon={<Mail className="h-5 w-5 text-ink/40" />}
              label="Email Notifications"
              description="Receive summaries and reports via email"
              checked={notifs.email}
              onChange={() => toggleNotif('email')}
            />
            <SettingsToggle
              icon={<Smartphone className="h-5 w-5 text-ink/40" />}
              label="SMS Alerts"
              description="Get text messages for critical maintenance requests"
              checked={notifs.sms}
              onChange={() => toggleNotif('sms')}
            />
            <SettingsToggle
              icon={<Monitor className="h-5 w-5 text-ink/40" />}
              label="Push Notifications"
              description="Browser and app push notifications"
              checked={notifs.push}
              onChange={() => toggleNotif('push')}
            />
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-cream">Alert Types</h4>
            <SettingsToggle
              icon={<Shield className="h-5 w-5 text-ink/40" />}
              label="Maintenance Alerts"
              description="Notify on emergency and high-priority tickets"
              checked={notifs.maintenanceAlerts}
              onChange={() => toggleNotif('maintenanceAlerts')}
            />
            <SettingsToggle
              icon={<FileBarChart className="h-5 w-5 text-ink/40" />}
              label="Rent Collection Alerts"
              description="Notify on delinquent payments"
              checked={notifs.rentAlerts}
              onChange={() => toggleNotif('rentAlerts')}
            />
            <SettingsToggle
              icon={<FileBarChart className="h-5 w-5 text-ink/40" />}
              label="Lease Expiration Alerts"
              description="Notify 60 days before lease end"
              checked={notifs.leaseAlerts}
              onChange={() => toggleNotif('leaseAlerts')}
            />
          </div>
        </div>
      </SettingsSection>
      
      <SettingsSection title="Security" description="Manage your password and security settings.">
          <div className="space-y-2 mt-4">
            <GhostButton className="w-full justify-start text-ink/80 hover:text-cream" onClick={() => setModalState('password')}>
              <KeyRound className="h-4 w-4 mr-3" /> Change Password
            </GhostButton>
            <GhostButton className="w-full justify-start text-ink/80 hover:text-cream" onClick={() => setModalState('2fa')}>
              <Shield className="h-4 w-4 mr-3" /> Two-Factor Authentication
            </GhostButton>
          </div>
      </SettingsSection>

      <ConfirmationModal 
        isOpen={modalState === 'cancel'}
        onClose={() => setModalState(null)}
        title="Discard Changes"
        description="Are you sure you want to discard your unsaved changes to preferences?"
        onConfirm={() => {
          handleAction('Changes Discarded');
          setModalState(null);
        }}
      />

      <ConfirmationModal 
        isOpen={modalState === 'password'}
        onClose={() => setModalState(null)}
        title="Reset Password"
        description="We will send a password reset link to your registered email address. Proceed?"
        onConfirm={() => {
          handleAction('Password Reset Link Sent');
          setModalState(null);
        }}
      />

      <ConfirmationModal 
        isOpen={modalState === '2fa'}
        onClose={() => setModalState(null)}
        title="Setup Two-Factor Authentication"
        description="This will log you out and require you to set up an authenticator app upon next login. Proceed?"
        onConfirm={() => {
          handleAction('2FA Setup Initiated');
          setModalState(null);
        }}
      />

      <UploadModal 
        isOpen={modalState === 'photo'}
        onClose={() => setModalState(null)}
        title="Upload Profile Photo"
        onSubmit={(data) => {
          handleAction(`Photo updated with ${data.name}`);
          setModalState(null);
        }}
      />
    </SettingsLayout>
  );
}
