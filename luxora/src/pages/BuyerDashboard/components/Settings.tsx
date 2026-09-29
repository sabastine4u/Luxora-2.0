import { useEffect, useRef, useState } from 'react';
import PasswordChangeModal from './modals/PasswordChangeModal';
import {
  User,
  Mail,
  Shield,
  KeyRound,
  Smartphone,
  Camera,
  MapPin,
  Briefcase,
  Calendar,
  Home,
  DollarSign,
  Bed,
  Bath,
  LogOut,
  Monitor,
  Globe,
  Moon,
  Clock,
} from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { useSession } from '../../../contexts/SessionContext';
import { useToast } from '../../../contexts/ToastContext';
import { SettingsLayout } from '../../../components/dashboard/shared/layouts/SettingsLayout';
import { SettingsSection } from '../../../components/dashboard/shared/settings/SettingsSection';
import { SettingsToggle } from '../../../components/dashboard/shared/settings/SettingsToggle';

type RegionalTheme = 'dark' | 'light' | 'system';
type RegionalLanguage = 'en-GB' | 'en-US' | 'fr';
type RegionalCurrency = 'NGN' | 'USD' | 'GBP' | 'EUR';

export default function Settings() {
  const {
    user,
    logout,
    updateAccountSettings,
    updateProfilePhoto,
    changePassword,
  } = useSession();

  const { showToast } = useToast();

  // Store the editable buyer profile information.
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Store buyer property preferences.
  const [purpose, setPurpose] = useState(
    user?.settings?.buyer?.purpose || 'buy',
  );

  const [propertyTypes, setPropertyTypes] = useState(
    user?.settings?.buyer?.propertyTypes?.join(', ') || '',
  );

  const [preferredLocations, setPreferredLocations] = useState(
    user?.settings?.buyer?.preferredLocations?.join(', ') || '',
  );

  const [budgetMin, setBudgetMin] = useState(
    user?.settings?.buyer?.budgetMin?.toString() || '',
  );

  const [budgetMax, setBudgetMax] = useState(
    user?.settings?.buyer?.budgetMax?.toString() || '',
  );

  const [minBedrooms, setMinBedrooms] = useState(
    user?.settings?.buyer?.minBedrooms?.toString() || '',
  );

  const [minBathrooms, setMinBathrooms] = useState(
    user?.settings?.buyer?.minBathrooms?.toString() || '',
  );

  // Store account regional preferences locally until Save is pressed.
  const [theme, setTheme] = useState<RegionalTheme>(
    (user?.settings?.regional?.theme as RegionalTheme) || 'dark',
  );

  const [language, setLanguage] = useState<RegionalLanguage>(
    (user?.settings?.regional?.language as RegionalLanguage) || 'en-GB',
  );

  const [timeZone, setTimeZone] = useState(
    user?.settings?.regional?.timeZone || 'Africa/Lagos',
  );

  const [currency, setCurrency] = useState<RegionalCurrency>(
    (user?.settings?.regional?.currency as RegionalCurrency) || 'NGN',
  );

  // Store notification preferences locally until the Save action persists them.
  const [notifs, setNotifs] = useState({
    email: user?.settings?.notifications?.email ?? true,
    sms: user?.settings?.notifications?.sms ?? false,
    push: user?.settings?.notifications?.push ?? true,
    property: user?.settings?.notifications?.property ?? true,
    priceDrop: user?.settings?.notifications?.priceDrop ?? true,
    mortgage: user?.settings?.notifications?.mortgage ?? false,
    marketing: user?.settings?.notifications?.marketing ?? false,
  });

  useEffect(() => {
    // Synchronize form state whenever the authenticated user changes.
    setFullName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');

    setPurpose(
      user?.settings?.buyer?.purpose || 'buy',
    );

    setPropertyTypes(
      user?.settings?.buyer?.propertyTypes?.join(', ') || '',
    );

    setPreferredLocations(
      user?.settings?.buyer?.preferredLocations?.join(', ') || '',
    );

    setBudgetMin(
      user?.settings?.buyer?.budgetMin?.toString() || '',
    );

    setBudgetMax(
      user?.settings?.buyer?.budgetMax?.toString() || '',
    );

    setMinBedrooms(
      user?.settings?.buyer?.minBedrooms?.toString() || '',
    );

    setMinBathrooms(
      user?.settings?.buyer?.minBathrooms?.toString() || '',
    );

    setTheme(
      (user?.settings?.regional?.theme as RegionalTheme) || 'dark',
    );

    setLanguage(
      (user?.settings?.regional?.language as RegionalLanguage) || 'en-GB',
    );

    setTimeZone(
      user?.settings?.regional?.timeZone || 'Africa/Lagos',
    );

    setCurrency(
      (user?.settings?.regional?.currency as RegionalCurrency) || 'NGN',
    );

    setNotifs({
      email: user?.settings?.notifications?.email ?? true,
      sms: user?.settings?.notifications?.sms ?? false,
      push: user?.settings?.notifications?.push ?? true,
      property: user?.settings?.notifications?.property ?? true,
      priceDrop: user?.settings?.notifications?.priceDrop ?? true,
      mortgage: user?.settings?.notifications?.mortgage ?? false,
      marketing: user?.settings?.notifications?.marketing ?? false,
    });
  }, [user]);

  // Reference the hidden file input used by the profile-photo controls.
  const profilePhotoInputRef = useRef<HTMLInputElement | null>(null);

  // Control the Buyer password-change modal.
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  // Change the authenticated Buyer's password through the real backend endpoint.
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
        title: 'Password changed',
        description:
          'Your Buyer account password has been updated successfully.',
      });
    } catch (error: any) {
      // Keep the modal open when the backend rejects the request.
      console.error(
        'Failed to change Buyer password:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Password change failed',
        description:
          error?.response?.data?.message ||
          error?.message ||
          'We could not change your password.',
      });
    }
  };

  // Track whether the settings form is currently being saved.
  const [isSaving, setIsSaving] = useState(false);

  // Track whether the most recent save completed successfully.
  const [isSaved, setIsSaved] = useState(false);

  // Store a user-facing save result message.
  const [saveMessage, setSaveMessage] = useState('');

  const toggleNotif = (
    key: keyof typeof notifs,
  ) => {
    setNotifs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Save the current Buyer settings to the authenticated user's backend record.
  const handleSaveSettings = async () => {
    try {
      // Show saving state and clear any previous result.
      setIsSaving(true);
      setIsSaved(false);
      setSaveMessage('');

      // Send editable account and Buyer preferences to the backend.
      await updateAccountSettings({
        fullName,
        email,
        phone: phone.trim() || null,

        settings: {
          buyer: {
            purpose,

            // Convert comma-separated property types into a clean array.
            propertyTypes: propertyTypes
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean),

            // Convert comma-separated locations into a clean array.
            preferredLocations: preferredLocations
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean),

            // Convert empty numeric inputs to null.
            budgetMin: budgetMin
              ? Number(budgetMin)
              : null,

            budgetMax: budgetMax
              ? Number(budgetMax)
              : null,

            minBedrooms: minBedrooms
              ? Number(minBedrooms)
              : null,

            minBathrooms: minBathrooms
              ? Number(minBathrooms)
              : null,
          },

          // Persist notification preferences alongside Buyer settings.
          notifications: {
            ...notifs,
          },

          // Persist regional preferences alongside the other settings.
          regional: {
            theme,
            language,
            timeZone,
            currency,
          },
        },
      });

      // Show the successful save state.
      setIsSaved(true);
      setSaveMessage('Settings saved successfully.');
    } catch (error) {
      // Log the technical error and show a safe user-facing message.
      console.error(
        'Failed to save Buyer settings:',
        error,
      );

      setIsSaved(false);
      setSaveMessage('');

      showToast({
        type: 'error',
        title: 'Settings could not be saved',
        description:
          'We could not save your Buyer settings. Please try again.',
      });
    } finally {
      // Always stop the loading state.
      setIsSaving(false);
    }
  };

  // Upload the selected profile picture through the existing backend endpoint.
  const handleProfilePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    // Stop when the user cancels the file picker.
    if (!file) {
      return;
    }

    try {
      // Upload the selected image and update the authenticated session.
      await updateProfilePhoto(file);

      // Clear the input so the same file can be selected again later if needed.
      event.target.value = '';
    } catch (error) {
      // Log upload failures for debugging while keeping the UI stable.
      console.error(
        'Failed to update profile photo:',
        error,
      );

      // Clear the failed selection.
      event.target.value = '';

      showToast({
        type: 'error',
        title: 'Photo upload failed',
        description:
          'We could not update your profile photo. Please try again.',
      });
    }
  };

  // Format the real account creation date supplied by the backend.
  const formattedJoinDate = user?.createdAt
    ? new Intl.DateTimeFormat('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(user.createdAt))
    : 'Not available';

  // Convert the backend role value into a readable display value.
  const formattedRole = user?.role
    ? user.role
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (character) =>
          character.toUpperCase(),
        )
    : 'Not available';

  // Keep the department display honest because the field can be null/undefined.
  const formattedDepartment =
    user?.department || 'Not provided';

  // The backend provides verification status, so this is real account data.
  const verificationStatus = user?.isVerified
    ? 'Verified'
    : 'Not Verified';

  // The backend provides active status, so the account state can also be displayed honestly.
  const accountStatus =
    user?.isActive === false
      ? 'Inactive'
      : 'Active';

  return (
    <SettingsLayout
      title="Buyer Account Center"
      subtitle="Manage your profile, preferences, security, and account settings."
      onSave={handleSaveSettings}
      isSaving={isSaving}
      isSaved={isSaved}
      saveSuccess={isSaved}
      successMessage={saveMessage}
    >
      {/* SECTION 1: PROFILE */}
      <SettingsSection title="Profile Information">
        {/* Keep the avatar and profile fields in one horizontal row. */}
        <div className="flex flex-col items-start gap-8 md:flex-row">
          {/* Profile photo area stays on the left side of the row. */}
          <div className="flex shrink-0 flex-col items-center gap-3">
            <div className="relative">
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop'
                }
                alt="Profile"
                className="h-28 w-28 rounded-full border-4 border-navy-900 object-cover shadow-xl bg-navy-800"
              />

              {/* Camera button opens the hidden file picker. */}
              <button
                type="button"
                onClick={() =>
                  profilePhotoInputRef.current?.click()
                }
                className="absolute bottom-0 right-0 rounded-full bg-gold-400 p-2 text-navy-900 shadow-lg transition-colors hover:bg-gold-300"
                aria-label="Change profile photo"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* Secondary upload control uses the same file picker. */}
            <GhostButton
              size="sm"
              onClick={() =>
                profilePhotoInputRef.current?.click()
              }
            >
              Upload Photo
            </GhostButton>

            {/* Hidden file input used by both upload controls. */}
            <input
              ref={profilePhotoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleProfilePhotoChange}
              className="hidden"
            />
          </div>

          {/* Profile fields occupy the right side of the row. */}
          <div className="grid w-full flex-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Real account name from SessionContext. */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                Full Name
              </label>

              <div className="flex items-center gap-2 text-cream">
                <User className="h-4 w-4 text-gold-400" />

                <input
                  id="buyer-full-name"
                  type="text"
                  value={fullName}
                  onChange={(event) =>
                    setFullName(event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Allow the buyer to edit the email address stored on the account. */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                Email Address
              </label>

              <div className="flex items-center gap-2 text-cream">
                <Mail className="h-4 w-4 text-gold-400" />

                <input
                  id="buyer-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Phone is persisted by the backend and can be edited from Buyer Settings. */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                Phone Number
              </label>

              <div className="flex items-center gap-2 text-cream">
                <Smartphone className="h-4 w-4 text-gold-400" />

                <input
                  id="buyer-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="+234..."
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Role is supplied directly by the backend account record. */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                Account Role
              </label>

              <div className="flex items-center gap-2 text-cream">
                <Briefcase className="h-4 w-4 text-gold-400" />
                {formattedRole}
              </div>
            </div>

            {/* Department is supplied by the backend when one exists. */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                Department
              </label>

              <div className="flex items-center gap-2 text-cream">
                <MapPin className="h-4 w-4 text-gold-400" />
                {formattedDepartment}
              </div>
            </div>

            {/* Date joined is calculated from the real createdAt timestamp. */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                Date Joined
              </label>

              <div className="flex items-center gap-2 text-cream">
                <Calendar className="h-4 w-4 text-gold-400" />
                {formattedJoinDate}
              </div>
            </div>
          </div>
        </div>

        {/* Keep verification and account status below the profile row. */}
        <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-navy-900/60 px-3 py-2 text-xs">
            <Shield className="h-4 w-4 text-emerald-400" />

            <span className="text-ink/60">
              Verification:
            </span>

            <span className="font-semibold text-cream">
              {verificationStatus}
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-navy-900/60 px-3 py-2 text-xs">
            <span
              className={`h-2 w-2 rounded-full ${
                user?.isActive === false
                  ? 'bg-rose-400'
                  : 'bg-emerald-400'
              }`}
            />

            <span className="text-ink/60">
              Account:
            </span>

            <span className="font-semibold text-cream">
              {accountStatus}
            </span>
          </div>
        </div>
      </SettingsSection>

      {/* SECTION 2: PROPERTY PREFERENCES */}
      <SettingsSection title="Property Preferences">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Buyer purpose. */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">
              Purpose
            </label>

            <select
              value={purpose}
              onChange={(event) =>
                setPurpose(
                  event.target.value as
                    | 'buy'
                    | 'rent'
                    | 'short-let',
                )
              }
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
            >
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
              <option value="short-let">Short-let</option>
            </select>
          </div>

          {/* Preferred property types. */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">
              Preferred Property Types
            </label>

            <div className="relative">
              <Home className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

              <input
                type="text"
                value={propertyTypes}
                onChange={(event) =>
                  setPropertyTypes(
                    event.target.value,
                  )
                }
                placeholder="Apartment, Villa"
                className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Preferred locations. */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">
              Preferred Locations
            </label>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

              <input
                type="text"
                value={preferredLocations}
                onChange={(event) =>
                  setPreferredLocations(
                    event.target.value,
                  )
                }
                placeholder="Ikoyi, Victoria Island, Lekki"
                className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Budget range. */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">
              Budget Range (₦)
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                <input
                  type="number"
                  value={budgetMin}
                  onChange={(event) =>
                    setBudgetMin(
                      event.target.value,
                    )
                  }
                  placeholder="Min"
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
                />
              </div>

              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                <input
                  type="number"
                  value={budgetMax}
                  onChange={(event) =>
                    setBudgetMax(
                      event.target.value,
                    )
                  }
                  placeholder="Max"
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Minimum bedrooms. */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">
              Minimum Bedrooms
            </label>

            <div className="relative">
              <Bed className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

              <select
                value={minBedrooms}
                onChange={(event) =>
                  setMinBedrooms(
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
              >
                <option value="">Any</option>
                <option value="3">3+ Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
              </select>
            </div>
          </div>

          {/* Minimum bathrooms. */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">
              Minimum Bathrooms
            </label>

            <div className="relative">
              <Bath className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

              <select
                value={minBathrooms}
                onChange={(event) =>
                  setMinBathrooms(
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-3 pl-10 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
              >
                <option value="">Any</option>
                <option value="3">3+ Bathrooms</option>
                <option value="4">4+ Bathrooms</option>
              </select>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* SECTION 3 & 4: NOTIFICATIONS and SECURITY */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* SECTION 3: NOTIFICATIONS */}
        <SettingsSection title="Notifications">
          <div className="space-y-4">
            {[
              {
                id: 'email',
                label: 'Email Notifications',
                desc: 'Receive important updates via email',
              },
              {
                id: 'sms',
                label: 'SMS Notifications',
                desc: 'Get text alerts for urgent items',
              },
              {
                id: 'push',
                label: 'Push Notifications',
                desc: 'In-app alerts and web push',
              },
              {
                id: 'property',
                label: 'Property Alerts',
                desc: 'When new matches are found',
              },
              {
                id: 'priceDrop',
                label: 'Price Drop Alerts',
                desc: 'When saved properties drop in price',
              },
              {
                id: 'mortgage',
                label: 'Mortgage Updates',
                desc: 'Status updates on applications',
              },
              {
                id: 'marketing',
                label: 'Marketing Emails',
                desc: 'Newsletters and promotions',
              },
            ].map((item) => (
              <SettingsToggle
                key={item.id}
                label={item.label}
                description={item.desc}
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
            ))}
          </div>
        </SettingsSection>

        {/* SECTION 4: SECURITY */}
        <SettingsSection title="Security">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-navy-900 p-2">
                  <KeyRound className="h-5 w-5 text-gold-400" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-cream">
                    Password
                  </p>

                  <p className="text-xs text-ink/50">
                    Password change tracking is not exposed by the current profile endpoint.
                  </p>
                </div>
              </div>

              <GhostButton
                size="sm"
                onClick={() =>
                  setPasswordModalOpen(true)
                }
              >
                Change Password
              </GhostButton>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-navy-900 p-2">
                  <Shield className="h-5 w-5 text-emerald-400" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-cream">
                    Two-Factor Auth
                  </p>

                  <p className="text-xs text-ink/50">
                    Two-factor authentication is not configured in the current backend.
                  </p>
                </div>
              </div>

              <span className="rounded-full border border-white/10 bg-navy-900/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink/50">
                Not available yet
              </span>
            </div>

            <div className="space-y-4 border-t border-white/10 pt-4">
              <h4 className="text-sm font-semibold text-cream">
                Recent Login Activity
              </h4>

              {/* The backend does not currently provide login-history records. */}
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-navy-900/50 p-3">
                <div className="flex items-center gap-3">
                  <Monitor className="h-5 w-5 text-ink/50" />

                  <div>
                    <p className="text-sm font-medium text-cream">
                      Current browser session
                    </p>

                    <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                      Active session
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-dashed border-white/10 bg-navy-900/30 p-4">
                <p className="text-xs text-ink/50">
                  Detailed login history will appear here once the backend exposes session activity records.
                </p>
              </div>
            </div>
          </div>
        </SettingsSection>
      </div>

      {/* SECTION 5: APPEARANCE & REGIONAL */}
      <SettingsSection title="Appearance & Regional">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/50">
              <Moon className="h-4 w-4" />
              Theme
            </label>

            <select
              value={theme}
              onChange={(event) =>
                setTheme(
                  event.target.value as RegionalTheme,
                )
              }
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
            >
              <option value="dark">
                Dark Mode
              </option>

              <option value="light">
                Light Mode
              </option>

              <option value="system">
                System Default
              </option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/50">
              <Globe className="h-4 w-4" />
              Language
            </label>

            <select
              value={language}
              onChange={(event) =>
                setLanguage(
                  event.target.value as RegionalLanguage,
                )
              }
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
            >
              <option value="en-GB">
                English (UK)
              </option>

              <option value="en-US">
                English (US)
              </option>

              <option value="fr">
                French
              </option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/50">
              <Clock className="h-4 w-4" />
              Time Zone
            </label>

            <select
              value={timeZone}
              onChange={(event) =>
                setTimeZone(event.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
            >
              <option value="Africa/Lagos">
                WAT (Africa/Lagos)
              </option>

              <option value="UTC">
                UTC
              </option>

              <option value="America/New_York">
                Eastern Time
              </option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/50">
              <DollarSign className="h-4 w-4" />
              Currency
            </label>

            <select
              value={currency}
              onChange={(event) =>
                setCurrency(
                  event.target.value as RegionalCurrency,
                )
              }
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-sm text-cream focus:border-gold-400/50 focus:outline-none"
            >
              <option value="NGN">
                NGN (₦)
              </option>

              <option value="USD">
                USD ($)
              </option>

              <option value="GBP">
                GBP (£)
              </option>

              <option value="EUR">
                EUR (€)
              </option>
            </select>
          </div>
        </div>

        <p className="mt-4 text-xs leading-5 text-ink/50">
          These preferences are saved to your Luxora account.
          Theme and language are currently stored as account
          preferences; the application interface remains in its
          current English presentation.
        </p>
      </SettingsSection>

      {/* SECTION 6: ACCOUNT */}
      <SettingsSection
        title="Account Actions"
        isDanger
      >
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="flex-1 rounded-xl border border-white/10 bg-navy-900/40 p-4">
            <p className="text-sm font-semibold text-cream">
              Account data management
            </p>

            <p className="mt-1 text-xs leading-5 text-ink/50">
              Data export and account deletion are not currently
              available in the Buyer account area.
            </p>
          </div>

          <GhostButton
            onClick={logout}
            className="w-full sm:w-auto"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </GhostButton>
        </div>
      </SettingsSection>

      {/* Buyer password change modal. */}
      <PasswordChangeModal
        isOpen={passwordModalOpen}
        onClose={() =>
          setPasswordModalOpen(false)
        }
        onSave={handleChangePassword}
      />
    </SettingsLayout>
  );
}