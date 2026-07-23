import { Shield, KeyRound } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { useSession } from '../../../contexts/SessionContext';
import { SettingsLayout } from '../../../components/dashboard/shared/layouts/SettingsLayout';
import { SettingsSection } from '../../../components/dashboard/shared/settings/SettingsSection';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { useState } from 'react';

export default function Settings() {
  const { user } = useSession();
  const [confirmModal, setConfirmModal] = useState(false);

  return (
    <SettingsLayout
      title="Personal Profile Settings"
      subtitle="Manage your Super Admin identity and security credentials."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Security & Access */}
        <div className="space-y-6">
          <SettingsSection
            title="My Access"
            size="2xl"
            className="!space-y-4"
          >
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-gold-400" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-cream">Role</p>
                <p className="text-xs text-gold-400">{user?.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <KeyRound className="h-5 w-5 text-ink/50" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-cream">Email Address</p>
                <p className="text-xs text-ink/50">{user?.email}</p>
              </div>
              <GhostButton size="sm" onClick={() => setConfirmModal(true)}>Update</GhostButton>
            </div>
            <div className="flex items-center gap-3">
              <KeyRound className="h-5 w-5 text-ink/50" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-cream">Admin Password</p>
                <p className="text-xs text-ink/50">Required every 30 days</p>
              </div>
              <GhostButton size="sm" onClick={() => setConfirmModal(true)}>Update</GhostButton>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-emerald-400" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-cream">Two-Factor Authentication (2FA)</p>
                <p className="text-xs text-emerald-400">Enabled</p>
              </div>
              <GhostButton size="sm" onClick={() => setConfirmModal(true)}>Manage</GhostButton>
            </div>
          </SettingsSection>
        </div>
        
        {/* Additional Preferences */}
        <div className="space-y-6">
          <SettingsSection
            title="Notification Preferences"
            size="2xl"
            className="!space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-semibold text-cream">Critical Security Alerts</p>
                <p className="text-xs text-ink/50">Immediate email & SMS</p>
              </div>
              <div className="w-8 h-4 bg-gold-400 rounded-full relative"><div className="w-4 h-4 bg-navy-900 border-2 border-gold-400 rounded-full absolute right-0"></div></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-semibold text-cream">Daily Digest</p>
                <p className="text-xs text-ink/50">Morning email summary</p>
              </div>
              <div className="w-8 h-4 bg-navy-900 border border-white/20 rounded-full relative"><div className="w-4 h-4 bg-ink/40 rounded-full absolute left-0"></div></div>
            </div>
          </SettingsSection>
          
          <SettingsSection
            title="Active Sessions"
            size="2xl"
            className="!space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-cream">Current Session (Windows, Chrome)</p>
                <p className="text-xs text-emerald-400">Active Now • Abuja, NG</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-cream">MacBook Pro, Safari</p>
                <p className="text-xs text-ink/50">Last active 2 days ago • London, UK</p>
              </div>
              <button className="text-xs text-rose-400 hover:underline" onClick={() => setConfirmModal(true)}>Revoke</button>
            </div>
          </SettingsSection>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        onConfirm={() => setConfirmModal(false)}
        title="Update Password"
        message="Are you sure you want to request a password reset link to your registered email?"
        confirmText="Send Link"
        isDestructive={false}
      />
    </SettingsLayout>
  );
}
