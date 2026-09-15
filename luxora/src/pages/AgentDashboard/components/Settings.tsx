import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import {
  User,
  Mail,
  Smartphone,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  FileText,
  Globe,
  Percent,
  Landmark,
  Shield,
  KeyRound,
  Monitor,
  AlertTriangle,
  Power,
  CheckCircle2,
  Edit3,
  Camera,
} from 'lucide-react';
import {
  GhostButton,
  GoldButton,
} from '../../../components/ui/ui';
import { useSession } from '../../../contexts/SessionContext';
import { Modal } from '../../../components/ui/Modal';
import { SettingsLayout } from '../../../components/dashboard/shared/layouts/SettingsLayout';
import { SettingsSection } from '../../../components/dashboard/shared/settings/SettingsSection';
import { SettingsToggle } from '../../../components/dashboard/shared/settings/SettingsToggle';
import { useToast } from '../../../contexts/ToastContext';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';

export default function Settings() {
  const {
    user,
    updateAccountSettings,
    updateProfilePhoto,
    changePassword,
  } = useSession();

  const { showToast } = useToast();

  // ============================================================
  // REAL ACCOUNT PROFILE
  // ============================================================

  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // ============================================================
  // SUPPORTED NOTIFICATION SETTINGS
  // ============================================================

  const [notifs, setNotifs] = useState({
    email:
      user?.settings?.notifications?.email ?? true,
    sms:
      user?.settings?.notifications?.sms ?? false,
    push:
      user?.settings?.notifications?.push ?? true,

    // Not currently supported by backend.
    newLeads: false,

    viewingRequests:
      user?.settings?.notifications?.viewingRequests ?? true,
    offers:
      user?.settings?.notifications?.offers ?? true,
    messages:
      user?.settings?.notifications?.messages ?? true,

    // Not currently supported by backend.
    commissionUpdates: false,
  });

  // ============================================================
  // MODAL / WORKFLOW STATE
  // ============================================================

  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);

  const [deactivateModalOpen, setDeactivateModalOpen] =
    useState(false);

  const [passwordModalOpen, setPasswordModalOpen] =
    useState(false);

  const [activeWorkflow, setActiveWorkflow] = useState<{
    title: string;
    type: string;
    data?: Record<string, unknown>;
  } | null>(null);

  // ============================================================
  // SAVE / PHOTO STATE
  // ============================================================

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] =
    useState(false);

  // ============================================================
  // PASSWORD STATE
  // ============================================================

  const [currentPassword, setCurrentPassword] =
    useState('');

  const [newPassword, setNewPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [isChangingPassword, setIsChangingPassword] =
    useState(false);

  // Hidden input used for profile photo selection.
  const photoInputRef =
    useRef<HTMLInputElement | null>(null);

  // ============================================================
  // KEEP FORM SYNCHRONIZED WITH SESSION USER
  // ============================================================

  useEffect(() => {
    setFullName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');

    setNotifs({
      email:
        user?.settings?.notifications?.email ?? true,
      sms:
        user?.settings?.notifications?.sms ?? false,
      push:
        user?.settings?.notifications?.push ?? true,

      newLeads: false,

      viewingRequests:
        user?.settings?.notifications?.viewingRequests ?? true,
      offers:
        user?.settings?.notifications?.offers ?? true,
      messages:
        user?.settings?.notifications?.messages ?? true,

      commissionUpdates: false,
    });
  }, [user]);

  // ============================================================
  // WORKFLOW HANDLER
  // ============================================================

  const handleAction = (
    title: string,
    type: string,
    data?: Record<string, unknown>,
  ) => {
    setActiveWorkflow({
      title,
      type,
      data,
    });
  };

  // ============================================================
  // SAVE PROFILE + SUPPORTED NOTIFICATIONS
  // ============================================================

  const handleSaveChanges = async () => {
    if (!fullName.trim() || !email.trim()) {
      showToast({
        type: 'error',
        title: 'Incomplete Profile',
        description:
          'Full name and email address are required.',
      });

      return;
    }

    try {
      setIsSaving(true);

      await updateAccountSettings({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        settings: {
          notifications: {
            email: notifs.email,
            sms: notifs.sms,
            push: notifs.push,
            viewingRequests:
              notifs.viewingRequests,
            offers: notifs.offers,
            messages: notifs.messages,
          },
        },
      });

      setSaveSuccess(true);

      showToast({
        type: 'success',
        title: 'Settings Saved',
        description:
          'Your profile and supported notification settings have been updated.',
      });

      window.setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error(
        'Failed to save Agent settings:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Save Failed',
        description:
          error?.response?.data?.message ||
          error?.message ||
          'Unable to save your settings.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================================
  // PROFILE PHOTO
  // ============================================================

  const handlePhotoChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      showToast({
        type: 'error',
        title: 'Unsupported Image',
        description:
          'Please choose a JPG, PNG, or WebP image.',
      });

      event.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast({
        type: 'error',
        title: 'Image Too Large',
        description:
          'Your profile picture must be smaller than 10MB.',
      });

      event.target.value = '';
      return;
    }

    try {
      setIsUploadingPhoto(true);

      await updateProfilePhoto(file);

      showToast({
        type: 'success',
        title: 'Photo Updated',
        description:
          'Your profile picture has been updated successfully.',
      });
    } catch (error: any) {
      console.error(
        'Failed to upload Agent profile photo:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Photo Upload Failed',
        description:
          error?.response?.data?.message ||
          error?.message ||
          'Unable to update your profile picture.',
      });
    } finally {
      setIsUploadingPhoto(false);

      if (photoInputRef.current) {
        photoInputRef.current.value = '';
      }
    }
  };

  // ============================================================
  // NOTIFICATION TOGGLE
  // ============================================================

  const toggleNotif = (
    key: keyof typeof notifs,
  ) => {
    // These notification types are not currently supported
    // by the backend schema.
    if (
      key === 'newLeads' ||
      key === 'commissionUpdates'
    ) {
      return;
    }

    setNotifs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ============================================================
  // CHANGE PASSWORD
  // ============================================================

  const handleChangePassword = async () => {
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      showToast({
        type: 'error',
        title: 'Incomplete Password Form',
        description:
          'Please fill in all password fields.',
      });

      return;
    }

    if (newPassword.length < 8) {
      showToast({
        type: 'error',
        title: 'Invalid Password',
        description:
          'Your new password must contain at least 8 characters.',
      });

      return;
    }

    if (newPassword !== confirmPassword) {
      showToast({
        type: 'error',
        title: 'Passwords Do Not Match',
        description:
          'New password and confirmation password must match.',
      });

      return;
    }

    try {
      setIsChangingPassword(true);

      await changePassword(
        currentPassword,
        newPassword,
      );

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setPasswordModalOpen(false);

      showToast({
        type: 'success',
        title: 'Password Changed',
        description:
          'Your password has been changed successfully.',
      });
    } catch (error: any) {
      console.error(
        'Failed to change Agent password:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Password Change Failed',
        description:
          error?.response?.data?.message ||
          error?.message ||
          'Unable to change your password.',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // ============================================================
  // UNSUPPORTED WORKFLOWS
  // ============================================================

  const executeWorkflow = () => {
    showToast({
      type: 'warning',
      title: 'Not Connected',
      description:
        'This Agent settings workflow does not have a backend integration yet.',
    });

    setActiveWorkflow(null);
  };

  return (
    <SettingsLayout
      title="Agent Settings"
      subtitle="Manage your agent profile, specializations, coverage areas, and preferences."
      saveSuccess={saveSuccess}
      successMessage="Settings saved successfully!"
      headerAction={
        <GoldButton
          onClick={handleSaveChanges}
          disabled={isSaving}
        >
          {isSaving
            ? 'Saving...'
            : 'Save All Changes'}
        </GoldButton>
      }
    >
      {/* ======================================================
          SECTION 1: PERSONAL INFORMATION
          ====================================================== */}

      <SettingsSection
        title="Personal Information"
        headerAction={
          <GhostButton
            size="sm"
            onClick={() =>
              document
                .getElementById('agent-full-name')
                ?.focus()
            }
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </GhostButton>
        }
      >
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="relative">
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || 'Agent',
                  )}&background=0D8ABC&color=fff`
                }
                alt="Profile"
                className="h-28 w-28 rounded-full object-cover border-4 border-navy-900 shadow-xl bg-navy-800"
              />

              <button
                type="button"
                disabled={isUploadingPhoto}
                onClick={() =>
                  photoInputRef.current?.click()
                }
                className="absolute bottom-0 right-0 p-2 bg-gold-400 rounded-full text-navy-900 hover:bg-gold-300 transition-colors shadow-lg disabled:opacity-50"
              >
                <Camera className="h-4 w-4" />
              </button>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            <GhostButton
              size="sm"
              onClick={() =>
                photoInputRef.current?.click()
              }
              disabled={isUploadingPhoto}
            >
              {isUploadingPhoto
                ? 'Uploading...'
                : 'Update Photo'}
            </GhostButton>
          </div>

          <div className="flex-1 grid gap-6 sm:grid-cols-2 w-full">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                <input
                  id="agent-full-name"
                  type="text"
                  value={fullName}
                  onChange={(event) =>
                    setFullName(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                Phone Number
              </label>

              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(
                      event.target.value,
                    )
                  }
                  placeholder="Add phone number"
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                Date of Birth
              </label>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                <input
                  type="date"
                  disabled
                  placeholder="Not connected"
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 pl-10 pr-4 text-sm text-ink/40 cursor-not-allowed focus:outline-none [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                Gender
              </label>

              <select
                disabled
                defaultValue=""
                className="w-full rounded-xl border border-white/10 bg-navy-900/50 p-3 text-sm text-ink/40 cursor-not-allowed focus:outline-none"
              >
                <option value="">
                  Not connected
                </option>
              </select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                Home Address
              </label>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                <input
                  type="text"
                  disabled
                  placeholder="Not connected to Agent settings API"
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 pl-10 pr-4 text-sm text-ink/40 cursor-not-allowed focus:outline-none placeholder:text-ink/40"
                />
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* ======================================================
          SECTION 2: PROFESSIONAL PROFILE
          ====================================================== */}

      <SettingsSection title="Professional Profile">
        <div className="mb-5 rounded-xl border border-gold-400/20 bg-gold-400/5 p-4">
          <p className="text-xs leading-relaxed text-gold-300/80">
            Professional Agent profile fields exist in the
            Agent profile backend, but this page does not yet
            have a dedicated Agent settings endpoint to load
            and update them.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
              Agency Name
            </label>

            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

              <input
                type="text"
                disabled
                placeholder="Not connected"
                className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 pl-10 pr-4 text-sm text-ink/40 cursor-not-allowed placeholder:text-ink/40"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
              License Number
            </label>

            <div className="relative">
              <Award className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

              <input
                type="text"
                disabled
                placeholder="Not connected"
                className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 pl-10 pr-4 text-sm text-ink/40 cursor-not-allowed placeholder:text-ink/40"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
              Years of Experience
            </label>

            <select
              disabled
              defaultValue=""
              className="w-full rounded-xl border border-white/10 bg-navy-900/50 p-3 text-sm text-ink/40 cursor-not-allowed"
            >
              <option value="">
                Not connected
              </option>
              <option>1-3 Years</option>
              <option>4-7 Years</option>
              <option>8-15 Years</option>
              <option>15+ Years</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
              Languages Spoken
            </label>

            <div className="relative">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

              <input
                type="text"
                disabled
                placeholder="Not connected"
                className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 pl-10 pr-4 text-sm text-ink/40 cursor-not-allowed placeholder:text-ink/40"
              />
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
              Professional Bio
            </label>

            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-ink/50" />

              <textarea
                rows={4}
                disabled
                placeholder="Not connected to Agent settings API"
                className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 pl-10 pr-4 text-sm text-ink/40 cursor-not-allowed placeholder:text-ink/40"
              />
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* ======================================================
          SECTION 3 + SECTION 4
          ====================================================== */}

      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsSection title="Areas of Specialization">
          <div className="mb-4 rounded-xl border border-white/5 bg-navy-900/40 p-3">
            <p className="text-xs text-ink/50">
              Agent specialization data is not yet connected
              to this settings page.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              'Residential',
              'Commercial',
              'Luxury',
              'Land',
              'Student Housing',
              'Short-let',
              'Industrial',
              'Mixed Use',
            ].map((label) => (
              <div
                key={label}
                className="flex items-center gap-3 p-3 rounded-xl border bg-navy-900/50 border-white/5 opacity-60"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-md border border-white/20 bg-transparent">
                  <CheckCircle2 className="h-3.5 w-3.5 text-ink/20" />
                </div>

                <span className="text-sm font-medium text-ink/50">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </SettingsSection>

        <SettingsSection title="Service Areas">
          <div className="mb-4 rounded-xl border border-white/5 bg-navy-900/40 p-3">
            <p className="text-xs text-ink/50">
              Service-area information exists in the Agent
              profile model but is not yet exposed through
              the current Agent settings API.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                States
              </label>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                <input
                  type="text"
                  disabled
                  placeholder="Not connected"
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 pl-10 pr-4 text-sm text-ink/40 cursor-not-allowed placeholder:text-ink/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                Cities & Neighborhoods
              </label>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                <input
                  type="text"
                  disabled
                  placeholder="Not connected"
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 pl-10 pr-4 text-sm text-ink/40 cursor-not-allowed placeholder:text-ink/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                Coverage Radius
              </label>

              <select
                disabled
                defaultValue=""
                className="w-full rounded-xl border border-white/10 bg-navy-900/50 p-3 text-sm text-ink/40 cursor-not-allowed"
              >
                <option value="">
                  Not connected
                </option>
                <option>Within 10 km</option>
                <option>Within 25 km</option>
                <option>Within 50 km</option>
                <option>Statewide</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                Preferred Locations
              </label>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                <input
                  type="text"
                  disabled
                  placeholder="Not connected"
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 pl-10 pr-4 text-sm text-ink/40 cursor-not-allowed placeholder:text-ink/40"
                />
              </div>
            </div>
          </div>
        </SettingsSection>
      </div>

      {/* ======================================================
          SECTION 5 + SECTION 6
          ====================================================== */}

      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsSection title="Availability">
          <div className="mb-4 rounded-xl border border-white/5 bg-navy-900/40 p-3">
            <p className="text-xs text-ink/50">
              Working hours, appointment availability and
              vacation mode are not connected to an Agent
              settings endpoint yet.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                Working Days
              </label>

              <select
                disabled
                defaultValue=""
                className="w-full rounded-xl border border-white/10 bg-navy-900/50 p-3 text-sm text-ink/40 cursor-not-allowed"
              >
                <option value="">
                  Not connected
                </option>
                <option>Monday - Friday</option>
                <option>Monday - Saturday</option>
                <option>Everyday</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                  Start Time
                </label>

                <select
                  disabled
                  defaultValue=""
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 p-3 text-sm text-ink/40 cursor-not-allowed"
                >
                  <option value="">
                    Not connected
                  </option>
                  <option>08:00 AM</option>
                  <option>09:00 AM</option>
                  <option>10:00 AM</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                  End Time
                </label>

                <select
                  disabled
                  defaultValue=""
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 p-3 text-sm text-ink/40 cursor-not-allowed"
                >
                  <option value="">
                    Not connected
                  </option>
                  <option>04:00 PM</option>
                  <option>05:00 PM</option>
                  <option>06:00 PM</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-navy-900/50 rounded-xl border border-white/5 opacity-60">
              <div>
                <p className="text-sm font-semibold text-cream">
                  Appointment Availability
                </p>

                <p className="text-xs text-ink/50">
                  Backend setting not connected
                </p>
              </div>

              <div className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-white/10">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-navy-900/50 rounded-xl border border-white/5 opacity-60">
              <div>
                <p className="text-sm font-semibold text-cream">
                  Vacation Mode
                </p>

                <p className="text-xs text-ink/50">
                  Backend setting not connected
                </p>
              </div>

              <div className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-white/10">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
              </div>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Commission Preferences">
          <div className="mb-4 rounded-xl border border-white/5 bg-navy-900/40 p-3">
            <p className="text-xs text-ink/50">
              Commission preferences and payout details are
              not currently connected to the Agent settings
              API. No mock commission figures are displayed.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                Default Commission %
              </label>

              <div className="relative">
                <Percent className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                <input
                  type="text"
                  disabled
                  placeholder="Not connected"
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 pl-10 pr-4 text-sm text-ink/40 cursor-not-allowed placeholder:text-ink/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                Bonus Structure (Optional)
              </label>

              <div className="relative">
                <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                <input
                  type="text"
                  disabled
                  placeholder="Not connected"
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 pl-10 pr-4 text-sm text-ink/40 cursor-not-allowed placeholder:text-ink/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                Preferred Payment Method
              </label>

              <select
                disabled
                defaultValue=""
                className="w-full rounded-xl border border-white/10 bg-navy-900/50 p-3 text-sm text-ink/40 cursor-not-allowed"
              >
                <option value="">
                  Not connected
                </option>
                <option>
                  Bank Transfer (Direct Deposit)
                </option>
                <option>
                  Wire Transfer (International)
                </option>
                <option>Cheque</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider block mb-3">
                Bank Information
              </label>

              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-navy-900 p-4 opacity-60">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-800 text-ink/40">
                    <Landmark className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-ink/50">
                      Not connected
                    </div>

                    <div className="text-xs text-ink/40">
                      Bank details are not available in Agent
                      settings yet.
                    </div>
                  </div>
                </div>

                <GhostButton
                  size="sm"
                  onClick={() =>
                    handleAction(
                      'Update Bank Information',
                      'update_bank_information',
                    )
                  }
                >
                  Update
                </GhostButton>
              </div>
            </div>
          </div>
        </SettingsSection>
      </div>

      {/* ======================================================
          SECTION 7 + SECTION 8 + SECTION 9
          ====================================================== */}

      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsSection title="Notification Preferences">
          <div className="space-y-4">
            {[
              {
                id: 'email',
                label: 'Email Notifications',
                desc:
                  'Receive daily digests and reports',
                supported: true,
              },
              {
                id: 'sms',
                label: 'SMS Notifications',
                desc:
                  'Urgent alerts for showings and offers',
                supported: true,
              },
              {
                id: 'push',
                label: 'Push Notifications',
                desc:
                  'In-app and browser notifications',
                supported: true,
              },
              {
                id: 'newLeads',
                label: 'New Leads',
                desc:
                  'When a new lead is assigned to you',
                supported: false,
              },
              {
                id: 'viewingRequests',
                label: 'Viewing Requests',
                desc:
                  'When buyers request property tours',
                supported: true,
              },
              {
                id: 'offers',
                label: 'Offers',
                desc:
                  'When a bid is placed on your listings',
                supported: true,
              },
              {
                id: 'messages',
                label: 'Messages',
                desc:
                  'When you receive a direct message',
                supported: true,
              },
              {
                id: 'commissionUpdates',
                label: 'Commission Updates',
                desc:
                  'Payouts and milestone alerts',
                supported: false,
              },
            ].map((item) => (
              <div
                key={item.id}
                className={
                  item.supported
                    ? ''
                    : 'opacity-60'
                }
              >
                <SettingsToggle
                  label={item.label}
                  description={
                    item.supported
                      ? item.desc
                      : `${item.desc} • Not connected yet`
                  }
                  checked={
                    notifs[
                      item.id as keyof typeof notifs
                    ]
                  }
                  onChange={() =>
                    toggleNotif(
                      item.id as keyof typeof notifs,
                    )
                  }
                />
              </div>
            ))}
          </div>
        </SettingsSection>

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
                      Managed through your account password
                    </p>
                  </div>
                </div>

                <GhostButton
                  size="sm"
                  onClick={() =>
                    setPasswordModalOpen(true)
                  }
                >
                  Change
                </GhostButton>
              </div>

              <div className="flex items-center justify-between opacity-60">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-navy-900 rounded-lg">
                    <Shield className="h-5 w-5 text-emerald-400" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-cream">
                      Two-Factor Auth
                    </p>

                    <p className="text-xs text-ink/50">
                      2FA backend integration is not available yet
                    </p>
                  </div>
                </div>

                <GhostButton
                  size="sm"
                  onClick={() =>
                    handleAction(
                      'Manage 2FA',
                      'manage_2fa',
                    )
                  }
                >
                  Manage
                </GhostButton>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-4">
                <h4 className="text-sm font-semibold text-cream flex justify-between items-center">
                  Recent Login Activity

                  <GhostButton
                    size="sm"
                    onClick={() =>
                      handleAction(
                        'Session History',
                        'session_history',
                      )
                    }
                  >
                    View All
                  </GhostButton>
                </h4>

                <div className="flex items-center justify-between bg-navy-900/50 p-3 rounded-xl border border-white/5 opacity-60">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-ink/50" />

                    <div>
                      <p className="text-sm font-medium text-ink/50">
                        Login history not connected
                      </p>

                      <p className="text-[10px] text-ink/40 uppercase tracking-wider font-semibold">
                        Session history backend unavailable
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection title="Privacy">
            <div className="mb-4 rounded-xl border border-white/5 bg-navy-900/40 p-3">
              <p className="text-xs text-ink/50">
                Agent privacy preferences do not currently
                have a dedicated backend settings field.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                  Profile Visibility
                </label>

                <select
                  disabled
                  defaultValue=""
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 p-3 text-sm text-ink/40 cursor-not-allowed"
                >
                  <option value="">
                    Not connected
                  </option>
                  <option>
                    Public (Visible to all buyers)
                  </option>
                  <option>
                    Private (Only visible on requested listings)
                  </option>
                  <option>
                    Hidden (Operate anonymously)
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                  Contact Visibility
                </label>

                <select
                  disabled
                  defaultValue=""
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 p-3 text-sm text-ink/40 cursor-not-allowed"
                >
                  <option value="">
                    Not connected
                  </option>
                  <option>
                    Display Email & Phone Number
                  </option>
                  <option>
                    Display Email Only
                  </option>
                  <option>
                    Hide All Contact Details (In-app messaging only)
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                  Data Sharing Preferences
                </label>

                <select
                  disabled
                  defaultValue=""
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 p-3 text-sm text-ink/40 cursor-not-allowed"
                >
                  <option value="">
                    Not connected
                  </option>
                  <option>
                    Share anonymized data for market insights
                  </option>
                  <option>
                    Do not share my data
                  </option>
                </select>
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>

      {/* ======================================================
          SECTION 10: DANGER ZONE
          ====================================================== */}

      <SettingsSection
        title="Danger Zone"
        icon={<AlertTriangle className="h-5 w-5" />}
        isDanger
      >
        <div className="mb-4 rounded-xl border border-orange-400/20 bg-orange-400/5 p-3">
          <p className="text-xs text-orange-300/80">
            Account deactivation and permanent deletion do
            not currently have Agent-specific backend
            endpoints.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center">
          <GhostButton
            onClick={() =>
              setDeactivateModalOpen(true)
            }
            className="w-full sm:w-auto text-orange-400 border-orange-400/30 hover:bg-orange-400/10"
          >
            <Power className="h-4 w-4 mr-2" />
            Deactivate Account
          </GhostButton>

          <GhostButton
            onClick={() =>
              setDeleteModalOpen(true)
            }
            className="w-full sm:w-auto text-rose-400 border-rose-400/30 hover:bg-rose-400/10"
          >
            Delete Account
          </GhostButton>
        </div>
      </SettingsSection>

      {/* ======================================================
          DELETE ACCOUNT MODAL
          ====================================================== */}

      <Modal
        isOpen={deleteModalOpen}
        onClose={() =>
          setDeleteModalOpen(false)
        }
        title="Delete Account"
        actionButton={
          <GhostButton
            onClick={() => {
              showToast({
                type: 'warning',
                title: 'Not Connected',
                description:
                  'Permanent Agent account deletion is not connected to a backend endpoint yet.',
              });

              setDeleteModalOpen(false);
            }}
            className="bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20"
            size="sm"
          >
            Close
          </GhostButton>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-ink/80">
            Permanent Agent account deletion is not
            currently connected to the backend.
          </p>

          <p className="text-sm text-ink/60">
            No account data will be deleted until a real
            deletion workflow is implemented.
          </p>
        </div>
      </Modal>

      {/* ======================================================
          DEACTIVATE ACCOUNT MODAL
          ====================================================== */}

      <Modal
        isOpen={deactivateModalOpen}
        onClose={() =>
          setDeactivateModalOpen(false)
        }
        title="Deactivate Account"
        actionButton={
          <GoldButton
            onClick={() => {
              showToast({
                type: 'warning',
                title: 'Not Connected',
                description:
                  'Agent account deactivation is not connected to a backend endpoint yet.',
              });

              setDeactivateModalOpen(false);
            }}
            size="sm"
          >
            Close
          </GoldButton>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-ink/80">
            Agent account deactivation is not currently
            connected to the backend.
          </p>

          <p className="text-sm text-ink/60">
            No account state will be changed until a real
            deactivation workflow is implemented.
          </p>
        </div>
      </Modal>

      {/* ======================================================
          CHANGE PASSWORD MODAL
          ====================================================== */}

      <Modal
        isOpen={passwordModalOpen}
        onClose={() => {
          if (!isChangingPassword) {
            setPasswordModalOpen(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
          }
        }}
        title="Change Password"
        actionButton={
          <GoldButton
            onClick={handleChangePassword}
            disabled={isChangingPassword}
            size="sm"
          >
            {isChangingPassword
              ? 'Changing...'
              : 'Change Password'}
          </GoldButton>
        }
      >
        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider block mb-2">
              Current Password
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(event) =>
                setCurrentPassword(
                  event.target.value,
                )
              }
              placeholder="Enter your current password"
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 px-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider block mb-2">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(
                  event.target.value,
                )
              }
              placeholder="Minimum 8 characters"
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 px-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider block mb-2">
              Confirm New Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value,
                )
              }
              placeholder="Repeat your new password"
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 px-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none"
            />
          </div>
        </div>
      </Modal>

      {/* ======================================================
          UNSUPPORTED WORKFLOW DRAWER
          ====================================================== */}

      <EnterpriseDetailDrawer
        isOpen={!!activeWorkflow}
        onClose={() =>
          setActiveWorkflow(null)
        }
        title={
          activeWorkflow?.title ||
          'Workflow'
        }
        footerActions={
          <GoldButton
            onClick={executeWorkflow}
            className="w-full justify-center"
          >
            Confirm Action
          </GoldButton>
        }
      >
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-white/10 bg-navy-900">
            <h4 className="text-sm font-semibold text-cream mb-2">
              Workflow Details
            </h4>

            <p className="text-sm text-ink/60 leading-relaxed">
              The{' '}
              <strong>
                {activeWorkflow?.type}
              </strong>{' '}
              workflow is currently displayed for UI
              continuity, but the required backend
              integration has not been implemented yet.
            </p>
          </div>

          {activeWorkflow?.data && (
            <div className="p-4 rounded-xl border border-white/10 bg-navy-900/50">
              <h4 className="text-sm font-semibold text-cream mb-4">
                Context Data
              </h4>

              <div className="space-y-2 text-sm text-ink/80">
                {Object.entries(
                  activeWorkflow.data,
                ).map(([key, value]) => {
                  if (
                    typeof value === 'string' ||
                    typeof value === 'number'
                  ) {
                    return (
                      <div
                        key={key}
                        className="flex justify-between border-b border-white/5 pb-2"
                      >
                        <span className="capitalize">
                          {key}
                        </span>

                        <span className="font-medium text-cream">
                          {value}
                        </span>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      </EnterpriseDetailDrawer>
    </SettingsLayout>
  );
}