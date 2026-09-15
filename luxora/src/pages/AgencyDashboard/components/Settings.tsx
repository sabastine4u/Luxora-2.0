import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ChangeEvent } from 'react';

import {
  Building2,
  Mail,
  Smartphone,
  MapPin,
  Briefcase,
  Globe,
  Shield,
  KeyRound,
  Monitor,
  Camera,
  Edit3,
  FileText,
  CheckCircle2,
  Clock,
  Map,
  Star,
  Plus,
  Save,
  LockKeyhole,
} from 'lucide-react';

import {
  GhostButton,
  GoldButton,
} from '../../../components/ui/ui';

import {
  useSession,
} from '../../../contexts/SessionContext';

import {
  SettingsLayout,
} from '../../../components/dashboard/shared/layouts/SettingsLayout';

import {
  SettingsSection,
} from '../../../components/dashboard/shared/settings/SettingsSection';

import {
  SettingsToggle,
} from '../../../components/dashboard/shared/settings/SettingsToggle';

import {
  useToast,
} from '../../../contexts/ToastContext';

// Agency-specific API for reading and updating the Agency business profile.
import { agencyApi } from '../../../api/agency.api';

import PasswordChangeModal from '../../OwnerDashboard/components/modals/PasswordChangeModal';

interface AgencyProfile {
  id?: string;
  name?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface NotificationPreferences {
  // These six fields already exist in User.settings.notifications
  // and therefore persist through the backend.
  email: boolean;
  sms: boolean;
  push: boolean;
  offers: boolean;
  viewingRequests: boolean;
  messages: boolean;

  // These Agency workflow toggles remain UI-ready,
  // but the current backend schema does not persist them yet.
  ownerSubmitted: boolean;
  adminApproved: boolean;
  agentAccepted: boolean;
  agentDeclined: boolean;
  assignmentReturned: boolean;
  commissionGenerated: boolean;
  complianceExpiring: boolean;
  agentVerified: boolean;
  propertyPublished: boolean;

  // These Agency event toggles are also UI-ready.
  newLeads: boolean;
  complianceAlerts: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
  // Persisted delivery methods.
  email: true,
  sms: false,
  push: true,

  // Persisted general events.
  offers: true,
  viewingRequests: true,
  messages: true,

  // Agency workflow alerts.
  ownerSubmitted: true,
  adminApproved: true,
  agentAccepted: true,
  agentDeclined: true,
  assignmentReturned: true,
  commissionGenerated: true,
  complianceExpiring: true,
  agentVerified: true,
  propertyPublished: true,

  // Agency event settings.
  newLeads: true,
  complianceAlerts: true,
};

export default function Settings() {
  const {
    user,
    updateAccountSettings,
    updateProfilePhoto,
    changePassword,
  } = useSession();

  const {
    showToast,
  } = useToast();

  // Store the real Agency business profile returned by the backend.
  const [agency, setAgency] =
    useState<AgencyProfile | null>(null);

  // Controlled Agency profile fields.
  const [agencyName, setAgencyName] =
    useState('');

  const [contactPerson, setContactPerson] =
    useState('');

  const [businessEmail, setBusinessEmail] =
    useState('');

  const [businessPhone, setBusinessPhone] =
    useState('');

  // Store notification settings locally until the main Save action runs.
  const [notifs, setNotifs] =
    useState<NotificationPreferences>(
      DEFAULT_NOTIFICATIONS,
    );

  // Track initial Agency profile loading.
  const [isLoadingProfile, setIsLoadingProfile] =
    useState(true);

  // Track the main Save All Changes operation.
  const [isSaving, setIsSaving] =
    useState(false);

  // Used by SettingsLayout to show its success state.
  const [saveSuccess, setSaveSuccess] =
    useState(false);

  // Track profile-picture upload separately.
  const [isUploadingPhoto, setIsUploadingPhoto] =
    useState(false);

  // Control the shared password-change modal.
  const [passwordModalOpen, setPasswordModalOpen] =
    useState(false);

  // Hidden file input used for profile-picture selection.
  const profilePhotoInputRef =
    useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Load the real Agency business profile when Settings opens.
    const loadAgencyProfile = async () => {
      setIsLoadingProfile(true);

      try {
        const response =
          await agencyApi.getMyAgency();

        // http.js removes the success/message envelope,
        // so the Agency profile is expected at response.agency.
        const agencyData =
          response?.agency;

        if (!agencyData) {
          throw new Error(
            'Agency profile was not returned by the backend.',
          );
        }

        // Store the complete Agency profile.
        setAgency(agencyData);

        // Populate the editable fields with real MongoDB values.
        setAgencyName(
          agencyData.name || '',
        );

        setContactPerson(
          agencyData.contactPerson || '',
        );

        setBusinessEmail(
          agencyData.email || '',
        );

        setBusinessPhone(
          agencyData.phone || '',
        );
      } catch (error) {
        console.error(
          'Failed to load Agency profile:',
          error,
        );

        showToast({
          type: 'error',
          title: 'Settings Load Failed',
          description:
            'The Agency profile could not be loaded from the server.',
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    // Run the Agency profile request once when the Settings page opens.
    void loadAgencyProfile();
  }, [showToast]);

  useEffect(() => {
    // Restore notification settings from the authenticated User session.
    // SessionContext receives these values from /auth/me after login.
    const savedNotifications =
      user?.settings?.notifications;

    if (!savedNotifications) {
      return;
    }

    setNotifs((previous) => ({
      ...previous,

      // Persisted backend notification fields.
      email:
        savedNotifications.email ??
        previous.email,

      sms:
        savedNotifications.sms ??
        previous.sms,

      push:
        savedNotifications.push ??
        previous.push,

      offers:
        savedNotifications.offers ??
        previous.offers,

      viewingRequests:
        savedNotifications.viewingRequests ??
        previous.viewingRequests,

      messages:
        savedNotifications.messages ??
        previous.messages,
    }));
  }, [user?.settings?.notifications]);

  const toggleNotif = (
    key: keyof NotificationPreferences,
  ) => {
    // Toggle the selected preference immediately in the UI.
    setNotifs((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const openPhotoPicker = () => {
    // Open the existing hidden profile-photo input.
    profilePhotoInputRef.current?.click();
  };

  const handleProfilePhotoChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    // Accept image files only.
    if (!file.type.startsWith('image/')) {
      showToast({
        type: 'error',
        title: 'Invalid Image',
        description:
          'Please select a valid image file.',
      });

      event.target.value = '';
      return;
    }

    setIsUploadingPhoto(true);

    try {
      // Reuse the existing SessionContext upload flow.
      // This updates User.avatar in MongoDB and refreshes the session.
      await updateProfilePhoto(file);

      showToast({
        type: 'success',
        title: 'Profile Picture Updated',
        description:
          'Your Agency profile picture has been updated successfully.',
      });
    } catch (error) {
      console.error(
        'Failed to update Agency profile picture:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Upload Failed',
        description:
          'The profile picture could not be updated.',
      });
    } finally {
      setIsUploadingPhoto(false);

      // Allow the same file to be selected again later.
      event.target.value = '';
    }
  };

  const handleSave = async () => {
    // Validate the Agency fields required by the Agency model.
    if (
      !agencyName.trim() ||
      !contactPerson.trim() ||
      !businessEmail.trim()
    ) {
      showToast({
        type: 'error',
        title: 'Incomplete Agency Profile',
        description:
          'Agency name, contact person, and business email are required.',
      });

      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Save Agency-specific business fields into the Agency document.
      await agencyApi.updateMyAgency({
        name: agencyName.trim(),
        contactPerson:
          contactPerson.trim(),
        email: businessEmail.trim(),
        phone: businessPhone.trim(),
      });

      // Save the linked User account at the same time.
      // This also persists the supported notification preferences.
      const updatedUser =
        await updateAccountSettings({
          fullName:
            contactPerson.trim(),

          email:
            businessEmail.trim(),

          phone:
            businessPhone.trim(),

          // Only send notification fields currently
          // supported by User.settings.notifications.
          settings: {
            notifications: {
              email: notifs.email,
              sms: notifs.sms,
              push: notifs.push,
              offers: notifs.offers,
              viewingRequests:
                notifs.viewingRequests,
              messages: notifs.messages,
            },
          },
        });

      // Keep the notification controls synchronized with
      // the values returned by the backend.
      const savedNotifications =
        updatedUser.settings?.notifications;

      if (savedNotifications) {
        setNotifs((previous) => ({
          ...previous,

          email:
            savedNotifications.email ??
            previous.email,

          sms:
            savedNotifications.sms ??
            previous.sms,

          push:
            savedNotifications.push ??
            previous.push,

          offers:
            savedNotifications.offers ??
            previous.offers,

          viewingRequests:
            savedNotifications.viewingRequests ??
            previous.viewingRequests,

          messages:
            savedNotifications.messages ??
            previous.messages,
        }));
      }

      // Reflect the saved MongoDB values in local Agency state.
      setAgency((previous) => ({
        ...previous,
        name: agencyName.trim(),
        contactPerson:
          contactPerson.trim(),
        email:
          businessEmail.trim(),
        phone:
          businessPhone.trim(),
      }));

      setSaveSuccess(true);

      showToast({
        type: 'success',
        title: 'Settings Saved',
        description:
          'Your Agency profile and supported notification settings have been saved.',
      });

      // Hide the inline success state after a short period.
      window.setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error(
        'Failed to save Agency Settings:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Save Failed',
        description:
          error?.response?.data?.message ||
          error?.message ||
          'Your Agency settings could not be saved. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Change the authenticated Agency user's password through the real backend.
  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    try {
      // Send the current and new passwords through SessionContext.
      await changePassword(
        currentPassword,
        newPassword,
      );

      // Close the shared modal only after the backend confirms success.
      setPasswordModalOpen(false);

      showToast({
        type: 'success',
        title: 'Password Updated',
        description:
          'Your password has been changed successfully.',
      });
    } catch (error: any) {
      // Keep the modal open when the backend rejects the request.
      console.error(
        'Failed to change Agency password:',
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

  const verificationLabel = useMemo(() => {
    // Use the authenticated User verification state.
    return user?.isVerified
      ? 'Verified Agency Account'
      : 'Verification Pending';
  }, [user?.isVerified]);

  return (
    <>
      <SettingsLayout
        title="Agency Settings"
        subtitle="Manage your agency profile, business information, branches, documents, and communication preferences."
        saveSuccess={saveSuccess}
        successMessage="Settings saved successfully!"
        headerAction={
          <GoldButton
            onClick={handleSave}
            disabled={
              isSaving ||
              isLoadingProfile
            }
          >
            <Save className="h-4 w-4 mr-2" />

            {isSaving
              ? 'Saving...'
              : 'Save All Changes'}
          </GoldButton>
        }
      >
        {/* SECTION 1: AGENCY PROFILE */}
        <SettingsSection
          title="Agency Profile"
          headerAction={
            <GhostButton
              size="sm"
              onClick={() => {
                // Focus the first editable Agency field.
                document
                  .getElementById(
                    'agency-name',
                  )
                  ?.focus();
              }}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </GhostButton>
          }
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Agency profile picture */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="relative">
                <div className="h-28 w-28 rounded-xl border-4 border-navy-900 shadow-xl bg-navy-800 flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Agency Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-12 w-12 text-ink/20" />
                  )}
                </div>

                {/* Camera button opens the real profile-photo uploader. */}
                <button
                  type="button"
                  onClick={openPhotoPicker}
                  disabled={isUploadingPhoto}
                  className="absolute bottom-[-10px] right-[-10px] p-2 bg-gold-400 rounded-full text-navy-900 hover:bg-gold-300 transition-colors shadow-lg border-2 border-navy-900 disabled:opacity-60"
                  title="Change profile picture"
                  aria-label="Change profile picture"
                >
                  <Camera className="h-4 w-4" />
                </button>

                <input
                  ref={profilePhotoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={
                    handleProfilePhotoChange
                  }
                />
              </div>

              <GhostButton
                size="sm"
                onClick={openPhotoPicker}
                disabled={isUploadingPhoto}
              >
                {isUploadingPhoto
                  ? 'Uploading...'
                  : 'Update Profile Picture'}
              </GhostButton>
            </div>

            <div className="flex-1 grid gap-6 sm:grid-cols-2 w-full">
              {/* Real Agency name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                  Agency Name
                </label>

                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                  <input
                    id="agency-name"
                    type="text"
                    value={agencyName}
                    onChange={(event) =>
                      setAgencyName(
                        event.target.value,
                      )
                    }
                    disabled={
                      isLoadingProfile
                    }
                    className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Real linked User / Agency contact person */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                  Contact Person
                </label>

                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(event) =>
                      setContactPerson(
                        event.target.value,
                      )
                    }
                    disabled={
                      isLoadingProfile
                    }
                    className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Registration number is not currently stored in Agency. */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                  Registration Number
                </label>

                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />

                  <input
                    type="text"
                    value="Not available"
                    readOnly
                    className="w-full rounded-xl border border-white/5 bg-navy-950 py-3 pl-10 pr-4 text-sm text-ink/40 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Status comes directly from the Agency document. */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                  Agency Status
                </label>

                <div className="relative">
                  <CheckCircle2
                    className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${agency?.status ===
                        'Active'
                        ? 'text-emerald-400'
                        : 'text-yellow-400'
                      }`}
                  />

                  <input
                    type="text"
                    value={
                      agency?.status ||
                      'Unknown'
                    }
                    readOnly
                    className="w-full rounded-xl border border-white/5 bg-navy-950 py-3 pl-10 pr-4 text-sm text-emerald-400 font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Real business email */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                  Business Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                  <input
                    type="email"
                    value={businessEmail}
                    onChange={(event) =>
                      setBusinessEmail(
                        event.target.value,
                      )
                    }
                    disabled={
                      isLoadingProfile
                    }
                    className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Real business phone */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                  Business Phone
                </label>

                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                  <input
                    type="tel"
                    value={businessPhone}
                    onChange={(event) =>
                      setBusinessPhone(
                        event.target.value,
                      )
                    }
                    disabled={
                      isLoadingProfile
                    }
                    placeholder="Not provided"
                    className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Website is not currently part of the Agency model. */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                  Website
                </label>

                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />

                  <input
                    type="text"
                    value="Not configured"
                    readOnly
                    className="w-full rounded-xl border border-white/5 bg-navy-950 py-3 pl-10 pr-4 text-sm text-ink/40 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Rating is not currently stored by the Agency model. */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                  Agency Rating
                </label>

                <div className="relative">
                  <Star className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />

                  <input
                    type="text"
                    value="Not available"
                    readOnly
                    className="w-full rounded-xl border border-white/5 bg-navy-950 py-3 pl-10 pr-4 text-sm text-ink/40 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Verification comes from the authenticated User account. */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                  Business Verification
                </label>

                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />

                  <input
                    type="text"
                    value={verificationLabel}
                    readOnly
                    className="w-full rounded-xl border border-white/5 bg-navy-950 py-3 pl-10 pr-4 text-sm text-emerald-400 font-medium cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Verification explanation */}
          <div className="mt-6 p-4 rounded-xl border border-emerald-400/10 bg-emerald-400/5">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-emerald-400" />

              <div>
                <p className="text-sm font-semibold text-cream">
                  {verificationLabel}
                </p>

                <p className="text-xs text-ink/50 mt-1">
                  This status is taken from the authenticated Agency account.
                </p>
              </div>
            </div>
          </div>

          {/* The Agency model currently has no description/bio field. */}
          <div className="mt-6 p-4 rounded-xl border border-dashed border-white/10 bg-navy-900/30">
            <p className="text-xs font-semibold text-ink/50 uppercase tracking-wider mb-2">
              Agency Bio / Description
            </p>

            <p className="text-sm text-ink/50">
              Not configured. The current Agency backend model does not
              yet store an Agency description.
            </p>
          </div>
        </SettingsSection>

        {/* SECTION 2: OPERATIONS */}
        <SettingsSection title="Operations">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Operating hours */}
            <div className="p-4 rounded-xl border border-dashed border-white/10 bg-navy-900/30">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-ink/30" />

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-ink/40">
                    Operating Hours
                  </span>

                  <p className="text-sm text-ink/50 mt-1">
                    Not configured
                  </p>
                </div>
              </div>
            </div>

            {/* Coverage radius */}
            <div className="p-4 rounded-xl border border-dashed border-white/10 bg-navy-900/30">
              <div className="flex items-center gap-3">
                <Map className="h-5 w-5 text-ink/30" />

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-ink/40">
                    Coverage Radius
                  </span>

                  <p className="text-sm text-ink/50 mt-1">
                    Not configured
                  </p>
                </div>
              </div>
            </div>

            {/* Service states */}
            <div className="p-4 rounded-xl border border-dashed border-white/10 bg-navy-900/30">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-ink/30" />

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-ink/40">
                    Primary Service States
                  </span>

                  <p className="text-sm text-ink/50 mt-1">
                    Not configured
                  </p>
                </div>
              </div>
            </div>

            {/* Service cities */}
            <div className="p-4 rounded-xl border border-dashed border-white/10 bg-navy-900/30">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-ink/30" />

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-ink/40">
                    Primary Service Cities
                  </span>

                  <p className="text-sm text-ink/50 mt-1">
                    Not configured
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-ink/40 mt-4">
            Operations configuration will be connected once these fields
            are added to the Agency backend model.
          </p>
        </SettingsSection>

        {/* SECTION 3: BRANCH MANAGEMENT */}
        <SettingsSection
          title="Branch Management"
          headerAction={
            <GoldButton
              size="sm"
              onClick={() =>
                showToast({
                  type: 'info',
                  title: 'Branch Management',
                  description:
                    'Branch management is not connected to the current Agency backend yet.',
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Branch
            </GoldButton>
          }
        >
          <div className="py-10 text-center rounded-xl border border-dashed border-white/10 bg-navy-900/30">
            <Building2 className="h-8 w-8 text-ink/20 mx-auto mb-3" />

            <h4 className="text-sm font-semibold text-cream">
              No branch records
            </h4>

            <p className="text-xs text-ink/50 mt-1 max-w-md mx-auto">
              There are currently no real Agency branch records available
              from the backend.
            </p>

            <p className="text-[10px] text-ink/40 mt-3">
              The Add Branch action is retained for the future Branch module.
            </p>
          </div>
        </SettingsSection>

        {/* SECTION 4: COMPANY DOCUMENTS */}
        <SettingsSection title="Company Documents">
          <div className="py-10 text-center rounded-xl border border-dashed border-white/10 bg-navy-900/30">
            <FileText className="h-8 w-8 text-ink/20 mx-auto mb-3" />

            <h4 className="text-sm font-semibold text-cream">
              No document records
            </h4>

            <p className="text-xs text-ink/50 mt-1 max-w-md mx-auto">
              Company document storage and verification are not currently
              connected to the Agency backend.
            </p>
          </div>
        </SettingsSection>

        {/* SECTION 5: NOTIFICATION PREFERENCES */}
        <SettingsSection title="Notification Preferences">
          <div className="space-y-6">
            {/* Delivery methods */}
            <div>
              <h4 className="text-sm font-medium text-cream mb-4 flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-ink/50" />
                Delivery Methods
              </h4>

              <div className="grid sm:grid-cols-3 gap-4">
                <SettingsToggle
                  label="Email Notifications"
                  checked={notifs.email}
                  onChange={() =>
                    toggleNotif('email')
                  }
                />

                <SettingsToggle
                  label="SMS Alerts"
                  checked={notifs.sms}
                  onChange={() =>
                    toggleNotif('sms')
                  }
                />

                <SettingsToggle
                  label="Push Notifications"
                  checked={notifs.push}
                  onChange={() =>
                    toggleNotif('push')
                  }
                />
              </div>
            </div>

            <div className="h-px bg-white/5 w-full" />

            {/* General Agency events */}
            <div>
              <h4 className="text-sm font-medium text-cream mb-4 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-ink/50" />
                Agency Events
              </h4>

              <div className="grid sm:grid-cols-2 gap-4">
                <SettingsToggle
                  label="New Leads"
                  checked={notifs.newLeads}
                  onChange={() =>
                    toggleNotif('newLeads')
                  }
                />

                <SettingsToggle
                  label="Viewing Requests"
                  checked={
                    notifs.viewingRequests
                  }
                  onChange={() =>
                    toggleNotif(
                      'viewingRequests',
                    )
                  }
                />

                <SettingsToggle
                  label="Offers"
                  checked={notifs.offers}
                  onChange={() =>
                    toggleNotif('offers')
                  }
                />

                <SettingsToggle
                  label="Messages"
                  checked={notifs.messages}
                  onChange={() =>
                    toggleNotif('messages')
                  }
                />

                <SettingsToggle
                  label="Compliance Alerts"
                  checked={
                    notifs.complianceAlerts
                  }
                  onChange={() =>
                    toggleNotif(
                      'complianceAlerts',
                    )
                  }
                />
              </div>
            </div>

            <div className="h-px bg-white/5 w-full" />

            {/* Enterprise workflow alerts */}
            <div>
              <h4 className="text-sm font-medium text-cream mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-ink/50" />
                Enterprise Event Alerts
              </h4>

              <div className="grid sm:grid-cols-2 gap-4">
                <SettingsToggle
                  label="Owner Submitted Property"
                  description="Alert when a new property is submitted."
                  checked={
                    notifs.ownerSubmitted
                  }
                  onChange={() =>
                    toggleNotif(
                      'ownerSubmitted',
                    )
                  }
                />

                <SettingsToggle
                  label="Admin Approved Property"
                  description="Alert when Admin routes a property."
                  checked={
                    notifs.adminApproved
                  }
                  onChange={() =>
                    toggleNotif(
                      'adminApproved',
                    )
                  }
                />

                <SettingsToggle
                  label="Agent Accepted Assignment"
                  description="Alert when an agent accepts a property."
                  checked={
                    notifs.agentAccepted
                  }
                  onChange={() =>
                    toggleNotif(
                      'agentAccepted',
                    )
                  }
                />

                <SettingsToggle
                  label="Agent Declined Assignment"
                  description="Alert when an agent declines a property."
                  checked={
                    notifs.agentDeclined
                  }
                  onChange={() =>
                    toggleNotif(
                      'agentDeclined',
                    )
                  }
                />

                <SettingsToggle
                  label="Assignment Returned"
                  description="Alert when a property is returned."
                  checked={
                    notifs.assignmentReturned
                  }
                  onChange={() =>
                    toggleNotif(
                      'assignmentReturned',
                    )
                  }
                />

                <SettingsToggle
                  label="Commission Generated"
                  description="Alert when a commission is generated."
                  checked={
                    notifs.commissionGenerated
                  }
                  onChange={() =>
                    toggleNotif(
                      'commissionGenerated',
                    )
                  }
                />

                <SettingsToggle
                  label="Compliance Expiring"
                  description="Alert before document expiration."
                  checked={
                    notifs.complianceExpiring
                  }
                  onChange={() =>
                    toggleNotif(
                      'complianceExpiring',
                    )
                  }
                />

                <SettingsToggle
                  label="Agent Verification Completed"
                  description="Alert when agent verification changes."
                  checked={
                    notifs.agentVerified
                  }
                  onChange={() =>
                    toggleNotif(
                      'agentVerified',
                    )
                  }
                />

                <SettingsToggle
                  label="Property Published"
                  description="Alert when a listing goes live."
                  checked={
                    notifs.propertyPublished
                  }
                  onChange={() =>
                    toggleNotif(
                      'propertyPublished',
                    )
                  }
                />
              </div>

              <p className="text-[10px] text-ink/40 mt-4">
                The six shared notification preferences above are persisted
                by the current User settings API. These additional Agency
                workflow alerts remain UI-ready until their backend fields
                are added.
              </p>
            </div>
          </div>
        </SettingsSection>

        {/* SECTION 6: SECURITY & ACCESS */}
        <SettingsSection title="Security Settings">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Verification */}
            <div className="p-5 rounded-xl border border-white/5 bg-navy-900/30 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-emerald-400/10">
                  <Shield className="h-5 w-5 text-emerald-400" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-cream">
                    Account Verification
                  </h4>

                  <p className="text-xs text-ink/60">
                    Current verification state.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center bg-navy-950 p-3 rounded-lg border border-white/5">
                <span
                  className={`text-sm font-medium flex items-center gap-2 ${user?.isVerified
                      ? 'text-emerald-400'
                      : 'text-yellow-400'
                    }`}
                >
                  <CheckCircle2 className="h-4 w-4" />

                  Status:{' '}
                  {user?.isVerified
                    ? 'Verified'
                    : 'Pending'}
                </span>
              </div>
            </div>

            {/* Password */}
            <div className="p-5 rounded-xl border border-white/5 bg-navy-900/30 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gold-400/10">
                  <KeyRound className="h-5 w-5 text-gold-400" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-cream">
                    Password Management
                  </h4>

                  <p className="text-xs text-ink/60">
                    Change your Agency account password.
                  </p>
                </div>
              </div>

              {/* Open the shared password modal used by Buyer and Owner. */}
              <GoldButton
                size="sm"
                className="w-full"
                onClick={() =>
                  setPasswordModalOpen(true)
                }
              >
                Update Password
              </GoldButton>
            </div>

            {/* Active sessions */}
            <div className="p-5 rounded-xl border border-white/5 bg-navy-900/30 space-y-4 sm:col-span-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-400/10">
                  <Monitor className="h-5 w-5 text-blue-400" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-cream">
                    Active Sessions
                  </h4>

                  <p className="text-xs text-ink/60">
                    Session management is not yet connected to the backend.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-navy-950 p-4 rounded-lg border border-white/5">
                <LockKeyhole className="h-5 w-5 text-blue-400" />

                <div>
                  <p className="text-sm text-cream">
                    Current authenticated session
                  </p>

                  <p className="text-xs text-ink/50">
                    Your current browser session is active.
                  </p>
                </div>

                <span className="ml-auto text-xs text-emerald-400 font-medium px-2 py-1 rounded-full bg-emerald-400/10">
                  Active
                </span>
              </div>
            </div>
          </div>
        </SettingsSection>
      </SettingsLayout>

      {/* Shared password-change modal used across Buyer, Owner, and Agency Settings. */}
      <PasswordChangeModal
        isOpen={passwordModalOpen}
        onClose={() =>
          setPasswordModalOpen(false)
        }
        onSave={handleChangePassword}
      />
    </>
  );
}