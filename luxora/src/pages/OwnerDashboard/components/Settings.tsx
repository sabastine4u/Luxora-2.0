import { useEffect, useRef, useState } from 'react';
import {
  User,
  Mail,
  Shield,
  KeyRound,
  Smartphone,
  Camera,
  MapPin,
  AlertTriangle,
  Monitor,
  Edit3,
  Landmark,
  FileText,
  Building,
  Link as LinkIcon,
  Power,
} from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { useSession } from '../../../contexts/SessionContext';
import { SettingsLayout } from '../../../components/dashboard/shared/layouts/SettingsLayout';
import { SettingsSection } from '../../../components/dashboard/shared/settings/SettingsSection';
import { SettingsToggle } from '../../../components/dashboard/shared/settings/SettingsToggle';
import { useToast } from '../../../contexts/ToastContext';
import PasswordChangeModal from './modals/PasswordChangeModal';
import ConfirmationModal from './modals/ConfirmationModal';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';

export default function Settings() {
  const {
  user,
  updateAccountSettings,
  updateProfilePhoto,
  changePassword,
} = useSession();

  const { showToast } = useToast();

  // Store the editable Owner profile information.
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Store the Owner business settings returned by the backend.
  const [businessName, setBusinessName] = useState(
    user?.settings?.owner?.businessName || '',
  );

  const [businessType, setBusinessType] = useState(
    user?.settings?.owner?.businessType || 'Individual Owner',
  );

  const [registrationNumber, setRegistrationNumber] = useState(
    user?.settings?.owner?.registrationNumber || '',
  );

  const [website, setWebsite] = useState(
    user?.settings?.owner?.website || '',
  );

  const [officeAddress, setOfficeAddress] = useState(
    user?.settings?.owner?.officeAddress || '',
  );

  // Store Owner payout preferences.
  const [paymentMethod, setPaymentMethod] = useState(
    user?.settings?.owner?.paymentMethod ||
    'Bank Transfer (Direct Deposit)',
  );

  const [payoutFrequency, setPayoutFrequency] = useState(
    user?.settings?.owner?.payoutFrequency ||
    'Monthly (1st of Month)',
  );

  // Store Owner tax settings.
  const [taxId, setTaxId] = useState(
    user?.settings?.owner?.taxId || '',
  );

  const [taxStatus, setTaxStatus] = useState(
    user?.settings?.owner?.taxStatus ||
    'Sole Proprietor',
  );

  const [taxResidence, setTaxResidence] = useState(
    user?.settings?.owner?.taxResidence || 'Nigeria',
  );

  // Store Owner privacy settings.
  const [profileVisibility, setProfileVisibility] = useState(
    user?.settings?.owner?.profileVisibility || 'Public',
  );

  const [dataSharing, setDataSharing] = useState(
    user?.settings?.owner?.dataSharing || 'share',
  );

  useEffect(() => {
    // Keep the Owner Settings form synchronized with the authenticated backend user.
    setFullName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');

    setBusinessName(
      user?.settings?.owner?.businessName || '',
    );

    setBusinessType(
      user?.settings?.owner?.businessType ||
      'Individual Owner',
    );

    setRegistrationNumber(
      user?.settings?.owner?.registrationNumber || '',
    );

    setWebsite(
      user?.settings?.owner?.website || '',
    );

    setOfficeAddress(
      user?.settings?.owner?.officeAddress || '',
    );

    setPaymentMethod(
      user?.settings?.owner?.paymentMethod ||
      'Bank Transfer (Direct Deposit)',
    );

    setPayoutFrequency(
      user?.settings?.owner?.payoutFrequency ||
      'Monthly (1st of Month)',
    );

    setTaxId(
      user?.settings?.owner?.taxId || '',
    );

    setTaxStatus(
      user?.settings?.owner?.taxStatus ||
      'Sole Proprietor',
    );

    setTaxResidence(
      user?.settings?.owner?.taxResidence ||
      'Nigeria',
    );

    setProfileVisibility(
      user?.settings?.owner?.profileVisibility ||
      'Public',
    );

    setDataSharing(
      user?.settings?.owner?.dataSharing || 'share',
    );

    // Keep notification toggles synchronized with backend values.
    setNotifs({
      email: user?.settings?.notifications?.email ?? true,
      sms: user?.settings?.notifications?.sms ?? true,
      push: user?.settings?.notifications?.push ?? true,
      offers: user?.settings?.notifications?.offers ?? true,
      viewingRequests:
        user?.settings?.notifications?.viewingRequests ?? true,
      messages:
        user?.settings?.notifications?.messages ?? true,
    });
  }, [user]);

  // Use a hidden file input for the real profile-picture picker.
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [isBankUpdateOpen, setIsBankUpdateOpen] = useState(false);
  const [is2FAOpen, setIs2FAOpen] = useState(false);
  const [isSessionDrawerOpen, setIsSessionDrawerOpen] = useState(false);

  // Store notification preferences locally until the main Save action persists them.
  const [notifs, setNotifs] = useState({
    email: user?.settings?.notifications?.email ?? true,
    sms: user?.settings?.notifications?.sms ?? true,
    push: user?.settings?.notifications?.push ?? true,
    offers: user?.settings?.notifications?.offers ?? true,
    viewingRequests:
      user?.settings?.notifications?.viewingRequests ?? true,
    messages:
      user?.settings?.notifications?.messages ?? true,
  });
  // Track the real profile-save request.
  const [isSaving, setIsSaving] = useState(false);

  // Track the temporary success state used by SettingsLayout.
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Track profile-picture upload independently from the main save button.
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const toggleNotif = (key: keyof typeof notifs) => {
    setNotifs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Save the complete Owner settings object through the existing profile endpoint.
  const handleSaveChanges = async () => {
    if (!fullName.trim() || !email.trim()) {
      showToast({
        type: 'error',
        title: 'Incomplete Profile',
        description: 'Full name and email address are required.',
      });

      return;
    }

    try {
      // Show the saving state while the request is running.
      setIsSaving(true);
      setSaveSuccess(false);

      // Persist both the basic profile fields and the complete Owner settings.
      await updateAccountSettings({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || null,

        settings: {
          owner: {
            // Persist Owner business information.
            businessName: businessName.trim() || null,
            businessType,
            registrationNumber:
              registrationNumber.trim() || null,
            website: website.trim() || null,
            officeAddress:
              officeAddress.trim() || null,

            // Persist Owner payout preferences.
            paymentMethod,
            payoutFrequency,

            // Persist Owner tax information.
            taxId: taxId.trim() || null,
            taxStatus,
            taxResidence,

            // Persist Owner privacy settings.
            profileVisibility,
            dataSharing,
          },

          // Persist Owner notification preferences.
          notifications: {
            ...notifs,
          },
        },
      });

      // Show the existing success state.
      setSaveSuccess(true);

      window.setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);

      showToast({
        type: 'success',
        title: 'Settings Updated',
        description:
          'Your Owner account settings have been saved successfully.',
      });
    } catch (error: any) {
      // Surface the real backend error without breaking the page.
      console.error('Failed to update Owner settings:', error);

      showToast({
        type: 'error',
        title: 'Settings Update Failed',
        description:
          error?.response?.data?.message ||
          error?.message ||
          'We could not update your settings.',
      });
    } finally {
      // Always stop the saving state.
      setIsSaving(false);
    }
  };
  // Open the native file picker when the user clicks the camera or Update Photo button.
  const openPhotoPicker = () => {
    photoInputRef.current?.click();
  };

  // Upload the selected profile picture through the real backend.
  const handlePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    // Ignore the event when no file was selected.
    if (!file) {
      return;
    }

    // Only allow the same image types supported by the backend.
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      showToast({
        type: 'error',
        title: 'Unsupported Image',
        description: 'Please choose a JPG, PNG, or WebP image.',
      });

      event.target.value = '';
      return;
    }

    // Keep the frontend limit aligned with the backend's 10MB upload limit.
    if (file.size > 10 * 1024 * 1024) {
      showToast({
        type: 'error',
        title: 'Image Too Large',
        description: 'Your profile picture must be smaller than 10MB.',
      });

      event.target.value = '';
      return;
    }

    try {
      // Show upload progress while the real API request runs.
      setIsUploadingPhoto(true);

      // Persist the selected photo through SessionContext.
      await updateProfilePhoto(file);

      showToast({
        type: 'success',
        title: 'Photo Updated',
        description: 'Your profile picture has been updated successfully.',
      });
    } catch (error: any) {
      // Surface the real backend error when photo upload fails.
      console.error('Failed to upload Owner profile photo:', error);

      showToast({
        type: 'error',
        title: 'Photo Upload Failed',
        description:
          error?.response?.data?.message ||
          error?.message ||
          'We could not update your profile picture.',
      });
    } finally {
      // Reset the upload state after the request completes.
      setIsUploadingPhoto(false);

      // Reset the input so selecting the same file again still triggers change.
      event.target.value = '';
    }
  };

 // Change the authenticated Owner's password through the real backend endpoint.
const handleChangePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  try {
    // Send the current and new passwords to the backend.
    await changePassword(
      currentPassword,
      newPassword,
    );

    // Close the modal only after the backend confirms success.
    setPasswordModalOpen(false);

    showToast({
      type: 'success',
      title: 'Password Updated',
      description:
        'Your password has been changed successfully.',
    });
  } catch (error: any) {
    // Keep the modal open when the backend rejects the password change.
    console.error(
      'Failed to change Owner password:',
      error,
    );

    showToast({
      type: 'error',
      title: 'Password Change Failed',
      description:
        error?.response?.data?.message ||
        error?.message ||
        'We could not change your password.',
    });
  }
};
  return (
    <SettingsLayout
      title="Owner Account Center"
      subtitle="Manage your business profile, payment preferences, security, and account settings."
      saveSuccess={saveSuccess}
      successMessage="Settings saved successfully!"
      headerAction={
        <GoldButton
          onClick={handleSaveChanges}
          disabled={isSaving || isUploadingPhoto}
        >
          {isSaving ? 'Saving...' : 'Save All Changes'}
        </GoldButton>
      }
    >
      {/* Hidden native file input used by the real profile-picture upload flow. */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handlePhotoChange}
      />

      {/* SECTION 1: PERSONAL INFORMATION */}
      <SettingsSection
        title="Personal Information"
        headerAction={
          <GhostButton
            size="sm"
            onClick={() => {
              // Focus the first editable field when Edit Profile is clicked.
              const input = document.getElementById(
                'owner-full-name',
              ) as HTMLInputElement | null;

              input?.focus();
            }}
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </GhostButton>
        }
      >
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="h-28 w-28 rounded-full object-cover border-4 border-navy-900 shadow-xl bg-navy-800"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-navy-900 bg-navy-800 text-3xl font-bold text-gold-400 shadow-xl">
                  {user?.name?.charAt(0)?.toUpperCase() || 'O'}
                </div>
              )}

              <button
                type="button"
                onClick={openPhotoPicker}
                disabled={isUploadingPhoto}
                className="absolute bottom-0 right-0 p-2 bg-gold-400 rounded-full text-navy-900 hover:bg-gold-300 transition-colors shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Change profile picture"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <GhostButton
              size="sm"
              onClick={openPhotoPicker}
              disabled={isUploadingPhoto}
            >
              {isUploadingPhoto ? 'Uploading...' : 'Update Photo'}
            </GhostButton>

            <p className="text-[10px] text-ink/40 text-center">
              JPG, PNG or WebP • Max 10MB
            </p>
          </div>

          <div className="flex-1 grid gap-6 sm:grid-cols-2 w-full">
            <div className="space-y-2">
              <label
                htmlFor="owner-full-name"
                className="text-xs font-semibold text-ink/50 uppercase tracking-wider"
              >
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                <input
                  id="owner-full-name"
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="owner-email"
                className="text-xs font-semibold text-ink/50 uppercase tracking-wider"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                <input
                  id="owner-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                Phone Number
              </label>

              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+234..."
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* SECTION 2: BUSINESS INFORMATION */}
      <SettingsSection title="Business Information">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
              Business Name
            </label>

            <div className="relative">
              <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

              <input
                type="text"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
              Business Type
            </label>

            <select
              value={businessType}
              onChange={(event) => setBusinessType(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
            >
              <option value="Individual Owner">Individual Owner</option>
              <option value="Real Estate Agency">Real Estate Agency</option>
              <option value="Property Developer">Property Developer</option>
              <option value="Corporate Entity">Corporate Entity</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
              Registration Number
            </label>

            <div className="relative">
              <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

              <input
                type="text"
                value={registrationNumber}
                onChange={(event) => setRegistrationNumber(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
              Website
            </label>

            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

              <input
                type="url"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
              Office Address
            </label>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

              <input
                type="text"
                value={officeAddress}
                onChange={(event) => setOfficeAddress(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </SettingsSection>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* SECTION 3: PAYMENT PREFERENCES */}
        <SettingsSection title="Payment Preferences">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                Preferred Payment Method
              </label>

              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
              >
                <option value="Bank Transfer (Direct Deposit)">
                  Bank Transfer (Direct Deposit)
                </option>

                <option value="Wire Transfer (International)">
                  Wire Transfer (International)
                </option>

                <option value="Cheque">
                  Cheque
                </option>
              </select>
            </div>

            <div className="pt-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider block mb-3">
                Bank Information
              </label>

              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-navy-900 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                    <Landmark className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-cream">
                      Guaranty Trust Bank
                    </div>

                    <div className="text-xs text-ink/50">
                      Acct ending in ****4210
                    </div>
                  </div>
                </div>

                <GhostButton
                  size="sm"
                  onClick={() => setIsBankUpdateOpen(true)}
                >
                  Update
                </GhostButton>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                Payout Frequency
              </label>

              <select
                value={payoutFrequency}
                onChange={(event) => setPayoutFrequency(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
              >
                <option value="Monthly (1st of Month)">
                  Monthly (1st of Month)
                </option>

                <option value="Bi-weekly">
                  Bi-weekly
                </option>

                <option value="Immediate (Upon Clearing)">
                  Immediate (Upon Clearing)
                </option>
              </select>
            </div>
          </div>
        </SettingsSection>

        {/* SECTION 4: TAX INFORMATION */}
        <SettingsSection title="Tax Information">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                Tax ID Number (TIN)
              </label>

              <div className="relative">
                <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                <input
                  type="text"
                  value={taxId}
                  onChange={(event) => setTaxId(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                Tax Status
              </label>

              <select
                value={taxStatus}
                onChange={(event) => setTaxStatus(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
              >
                <option value="Registered Corporate Entity">
                  Registered Corporate Entity
                </option>

                <option value="Sole Proprietor">
                  Sole Proprietor
                </option>

                <option value="Non-resident">
                  Non-resident
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                Country of Tax Residence
              </label>

              <select
                value={taxResidence}
                onChange={(event) => setTaxResidence(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
              >
                <option value="Nigeria">Nigeria</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="United Arab Emirates">
                  United Arab Emirates
                </option>
              </select>
            </div>
          </div>
        </SettingsSection>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* SECTION 5: NOTIFICATIONS */}
        <SettingsSection title="Notifications">
          <div className="space-y-4">
            {[
              {
                id: 'email',
                label: 'Email Notifications',
                desc: 'Receive daily digests and important updates',
              },
              {
                id: 'sms',
                label: 'SMS Notifications',
                desc: 'Urgent alerts for offers and payments',
              },
              {
                id: 'push',
                label: 'Push Notifications',
                desc: 'In-app and browser notifications',
              },
              {
                id: 'offers',
                label: 'New Offers',
                desc: 'Alert me instantly when a bid is placed',
              },
              {
                id: 'viewingRequests',
                label: 'Viewing Requests',
                desc: 'When buyers request property tours',
              },
              {
                id: 'messages',
                label: 'Messages',
                desc: 'When you receive a new direct message',
              },
            ].map((item) => (
              <SettingsToggle
                key={item.id}
                label={item.label}
                description={item.desc}
                checked={notifs[item.id as keyof typeof notifs]}
                onChange={() =>
                  toggleNotif(item.id as keyof typeof notifs)
                }
              />
            ))}
          </div>
        </SettingsSection>

        {/* SECTION 6: SECURITY & SECTION 7: PRIVACY */}
        <div className="space-y-6">
          <SettingsSection title="Security">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-navy-900 rounded-lg">
                    <KeyRound className="h-5 w-5 text-gold-400" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-cream">
                      Password
                    </p>

                    <p className="text-xs text-ink/50">
                      Last changed 2 months ago
                    </p>
                  </div>
                </div>

                <GhostButton
                  size="sm"
                  onClick={() => setPasswordModalOpen(true)}
                >
                  Change
                </GhostButton>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-navy-900 rounded-lg">
                    <Shield className="h-5 w-5 text-emerald-400" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-cream">
                      Two-Factor Auth
                    </p>

                    <p className="text-xs text-ink/50">
                      Enabled via Authenticator App
                    </p>
                  </div>
                </div>

                <GhostButton
                  size="sm"
                  onClick={() => setIs2FAOpen(true)}
                >
                  Manage
                </GhostButton>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-4">
                <h4 className="text-sm font-semibold text-cream flex justify-between items-center">
                  Recent Login Activity

                  <GhostButton
                    size="sm"
                    onClick={() => setIsSessionDrawerOpen(true)}
                  >
                    View All
                  </GhostButton>
                </h4>

                <div className="flex items-center justify-between bg-navy-900/50 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-ink/50" />

                    <div>
                      <p className="text-sm font-medium text-cream">
                        MacBook Pro - Chrome
                      </p>

                      <p className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
                        Active Session • Lagos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection title="Privacy">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                  Profile Visibility
                </label>

                <select
                  value={profileVisibility}
                  onChange={(event) => setProfileVisibility(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
                >
                  <option value="Public">
                    Public (Visible to all buyers)
                  </option>

                  <option value="Private">
                    Private (Only visible on requested listings)
                  </option>

                  <option value="Hidden">
                    Hidden (Operate anonymously)
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                  Data Sharing Preferences
                </label>

                <select
                  value={dataSharing}
                  onChange={(event) =>
                    setDataSharing(
                      event.target.value as 'share' | 'do_not_share',
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
                >
                  <option value="share">
                    Share anonymized data for market insights
                  </option>

                  <option value="do_not_share">
                    Do not share my data
                  </option>
                </select>
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>

      {/* SECTION 8: ACCOUNT MANAGEMENT */}
      <SettingsSection
        title="Danger Zone"
        icon={<AlertTriangle className="h-5 w-5" />}
        isDanger
      >
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center">
          <GhostButton
            onClick={() => setDeactivateModalOpen(true)}
            className="w-full sm:w-auto text-orange-400 border-orange-400/30 hover:bg-orange-400/10"
          >
            <Power className="h-4 w-4 mr-2" />
            Deactivate Account
          </GhostButton>

          <GhostButton
            onClick={() => setDeleteModalOpen(true)}
            className="w-full sm:w-auto text-rose-400 border-rose-400/30 hover:bg-rose-400/10"
          >
            Delete Account
          </GhostButton>
        </div>
      </SettingsSection>

      {/* Password change modal */}
      <PasswordChangeModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSave={handleChangePassword}
      />

      {/* Delete account confirmation */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          showToast({
            type: 'error',
            title: 'Account Deleted',
            description:
              'Your account has been successfully deleted.',
          });

          setDeleteModalOpen(false);
        }}
        title="Delete Account"
        description="Are you sure you want to delete your Luxora Owner account? This action is permanent and cannot be undone. All your listings, financial history, analytics, and tenant data will be permanently erased."
        confirmText="Confirm Deletion"
        isDestructive={true}
      />

      {/* Deactivate account confirmation */}
      <ConfirmationModal
        isOpen={deactivateModalOpen}
        onClose={() => setDeactivateModalOpen(false)}
        onConfirm={() => {
          showToast({
            type: 'warning',
            title: 'Account Deactivated',
            description:
              'Your account has been deactivated.',
          });

          setDeactivateModalOpen(false);
        }}
        title="Deactivate Account"
        description="Deactivating your account will temporarily hide your profile and pause all active listings. You will not lose any data, and you can reactivate your account at any time by logging back in."
        confirmText="Deactivate Now"
        isDestructive={false}
      />

      {/* Bank update confirmation */}
      <ConfirmationModal
        isOpen={isBankUpdateOpen}
        onClose={() => setIsBankUpdateOpen(false)}
        onConfirm={() => {
          showToast({
            type: 'success',
            title: 'Bank Info Updated',
            description:
              'Your payout bank information has been successfully updated.',
          });

          setIsBankUpdateOpen(false);
        }}
        title="Update Bank Information"
        description="Are you sure you want to change your primary payout account? Future rental payments will be routed here."
        confirmText="Confirm Update"
      />

      {/* Two-factor authentication confirmation */}
      <ConfirmationModal
        isOpen={is2FAOpen}
        onClose={() => setIs2FAOpen(false)}
        onConfirm={() => {
          showToast({
            type: 'success',
            title: '2FA Updated',
            description:
              'Your Two-Factor Authentication settings have been updated.',
          });

          setIs2FAOpen(false);
        }}
        title="Manage Two-Factor Authentication"
        description="Secure your account by enforcing Two-Factor Authentication for all future sign-ins."
        confirmText="Enable 2FA"
      />

      {/* Session history drawer */}
      <EnterpriseDetailDrawer
        isOpen={isSessionDrawerOpen}
        onClose={() => setIsSessionDrawerOpen(false)}
        title="Session History"
      >
        <div className="space-y-4">
          <h4 className="font-semibold text-cream">
            Active Sessions
          </h4>

          <div className="p-4 rounded-xl bg-navy-900 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-medium text-cream">
                MacBook Pro - Chrome
              </div>

              <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
                Current
              </div>
            </div>

            <div className="text-xs text-ink/50">
              Lagos, Nigeria &bull; IP: 192.168.1.1
            </div>
          </div>

          <h4 className="font-semibold text-cream mt-8 pt-4 border-t border-white/5">
            Past Sessions
          </h4>

          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-navy-900/50 border border-white/5 space-y-2 opacity-70"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium text-cream">
                  iPhone 14 Pro - Safari
                </div>

                <div className="text-[10px] text-ink/50 uppercase tracking-wider">
                  Yesterday
                </div>
              </div>

              <div className="text-xs text-ink/50">
                Lagos, Nigeria &bull; IP: 192.168.1.2
              </div>
            </div>
          ))}
        </div>
      </EnterpriseDetailDrawer>
    </SettingsLayout>
  );
}