import { useEffect, useRef, useState } from 'react';
import { Camera, KeyRound, Mail, Smartphone, User } from 'lucide-react';
import PasswordChangeModal from '../../BuyerDashboard/components/modals/PasswordChangeModal';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { SettingsLayout } from '../../../components/dashboard/shared/layouts/SettingsLayout';
import { SettingsSection } from '../../../components/dashboard/shared/settings/SettingsSection';
import { useSession } from '../../../contexts/SessionContext';

// Procurement owns no separate profile. This is the same authenticated User
// account flow used by the established dashboard settings pages.
export default function Settings() {
  const { user, updateAccountSettings, updateProfilePhoto, changePassword } = useSession();
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordOpen, setPasswordOpen] = useState(false);
  const photoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFullName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');
  }, [user]);

  const save = async () => {
    setIsSaving(true); setError(''); setSuccessMessage('');
    try {
      await updateAccountSettings({ fullName, email, phone: phone.trim() || null });
      setSuccessMessage('Profile saved successfully.');
    } catch (error: any) {
      setError(error?.message || 'Unable to save your profile.');
    } finally { setIsSaving(false); }
  };

  const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(''); setSuccessMessage('');
    try {
      await updateProfilePhoto(file);
      setSuccessMessage('Profile picture updated successfully.');
    } catch (error: any) {
      setError(error?.message || 'Unable to update your profile picture.');
    } finally { event.target.value = ''; }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordOpen(false);
      setError('');
      setSuccessMessage('Password changed successfully.');
    } catch (error: any) {
      setError(error?.message || 'Unable to change your password.');
    }
  };

  const fieldClass = 'w-full rounded-xl border border-white/10 bg-navy-900/50 px-4 py-2.5 text-sm text-cream focus:border-gold-400/50 focus:outline-none';
  return <SettingsLayout title="Procurement Settings" subtitle="Manage your authenticated Luxora profile and security settings." saveSuccess={Boolean(successMessage)} successMessage={successMessage}>
    <SettingsSection title="Profile Information" description="Changes are saved to your Luxora user account." headerAction={<GoldButton onClick={() => void save()} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</GoldButton>}>
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <div className="flex flex-col items-center gap-3">
          <button type="button" onClick={() => photoInput.current?.click()} className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-gold-400/20 bg-navy-900" aria-label="Change profile picture">
            <img src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0D8ABC&color=fff`} alt="Profile" className="h-full w-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-navy-950/60 opacity-0 transition-opacity hover:opacity-100"><Camera className="h-6 w-6 text-cream" /></span>
          </button>
          <GhostButton onClick={() => photoInput.current?.click()} className="text-xs">Change Photo</GhostButton>
          <input ref={photoInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadPhoto} className="hidden" />
        </div>
        <div className="grid flex-1 gap-5 md:grid-cols-2">
          <label className="space-y-2 text-xs font-medium text-ink/60"><span className="flex items-center gap-2"><User className="h-4 w-4" />Full Name</span><input value={fullName} onChange={(e) => setFullName(e.target.value)} className={fieldClass} /></label>
          <label className="space-y-2 text-xs font-medium text-ink/60"><span className="flex items-center gap-2"><Mail className="h-4 w-4" />Email Address</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} /></label>
          <label className="space-y-2 text-xs font-medium text-ink/60"><span className="flex items-center gap-2"><Smartphone className="h-4 w-4" />Phone Number</span><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClass} /></label>
        </div>
      </div>
    </SettingsSection>
    {error && <p className="rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
    <SettingsSection title="Security" description="Use your current password to set a new password.">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-navy-900/50 p-4"><div><div className="flex items-center gap-2 font-semibold text-cream"><KeyRound className="h-4 w-4 text-gold-400" />Password</div><p className="mt-1 text-xs text-ink/60">Your password is never stored in this dashboard.</p></div><GhostButton onClick={() => setPasswordOpen(true)}>Change Password</GhostButton></div>
    </SettingsSection>
    <PasswordChangeModal isOpen={passwordOpen} onClose={() => setPasswordOpen(false)} onSave={(current, next) => void updatePassword(current, next)} />
  </SettingsLayout>;
}
