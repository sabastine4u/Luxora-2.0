import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import {
  User,
  Mail,
  Smartphone,
  MapPin,
  Shield,
  KeyRound,
  Monitor,
  Camera,
} from "lucide-react";
import {
  GhostButton,
  GoldButton,
} from "../../../components/ui/ui";
import { useSession } from "../../../contexts/SessionContext";
import { SettingsLayout } from "../../../components/dashboard/shared/layouts/SettingsLayout";
import { SettingsSection } from "../../../components/dashboard/shared/settings/SettingsSection";
import { SettingsToggle } from "../../../components/dashboard/shared/settings/SettingsToggle";
import { ConfirmationModal } from "../../../components/ui/ConfirmationModal";

export default function Settings() {
  const {
    user,
    updateAccountSettings,
    updateProfilePhoto,
    changePassword,
  } = useSession();

  const photoInputRef =
    useRef<HTMLInputElement | null>(null);

  const [confirmationState, setConfirmationState] =
    useState<{
      isOpen: boolean;
      title: string;
      description: string;
      confirmText: string;
      onConfirm: () => void;
    }>({
      isOpen: false,
      title: "",
      description: "",
      confirmText: "Confirm",
      onConfirm: () => {},
    });

  const [fullName, setFullName] = useState(
    user?.name || "",
  );

  const [email, setEmail] = useState(
    user?.email || "",
  );

  const [phone, setPhone] = useState(
    user?.phone || "",
  );

  const [officeLocation, setOfficeLocation] =
    useState("");

  const [notifs, setNotifs] = useState({
    email:
      user?.settings?.notifications?.email ?? true,
    sms:
      user?.settings?.notifications?.sms ?? true,
    push:
      user?.settings?.notifications?.push ?? true,
    operationalAlerts:
      user?.settings?.notifications
        ?.operationalAlerts ?? true,
    approvalRequests:
      user?.settings?.notifications
        ?.approvalRequests ?? true,
    messages:
      user?.settings?.notifications?.messages ?? true,
    performanceUpdates:
      user?.settings?.notifications
        ?.performanceUpdates ?? true,
  });

  const [isSaving, setIsSaving] =
    useState(false);

  const [saveSuccess, setSaveSuccess] =
    useState(false);

  const [isUploadingPhoto, setIsUploadingPhoto] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isPasswordModalOpen, setIsPasswordModalOpen] =
    useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [isChangingPassword, setIsChangingPassword] =
    useState(false);

  const [passwordError, setPasswordError] =
    useState("");

  const toggleNotif = (
    key: keyof typeof notifs,
  ) => {
    setNotifs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveChanges = async () => {
    if (!fullName.trim()) {
      setErrorMessage(
        "Full name is required.",
      );
      return;
    }

    if (!email.trim()) {
      setErrorMessage(
        "Email address is required.",
      );
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");
      setSaveSuccess(false);

      await updateAccountSettings({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        settings: {
          notifications: {
            email: notifs.email,
            sms: notifs.sms,
            push: notifs.push,
            operationalAlerts:
              notifs.operationalAlerts,
            approvalRequests:
              notifs.approvalRequests,
            messages: notifs.messages,
            performanceUpdates:
              notifs.performanceUpdates,
          },
        },
      });

      setSaveSuccess(true);

      window.setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error(
        "Failed to save Management settings:",
        error,
      );

      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to save your settings.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handlePictureSelect = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setIsUploadingPhoto(true);
      setErrorMessage("");
      setSaveSuccess(false);

      await updateProfilePhoto(file);

      setSaveSuccess(true);

      window.setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error(
        "Failed to update profile picture:",
        error,
      );

      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to update your profile picture.",
      );
    } finally {
      setIsUploadingPhoto(false);

      if (photoInputRef.current) {
        photoInputRef.current.value = "";
      }
    }
  };

  const handleChangePicture = () => {
    photoInputRef.current?.click();
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      setPasswordError(
        "Current password is required.",
      );
      return;
    }

    if (!newPassword) {
      setPasswordError(
        "New password is required.",
      );
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(
        "New password must be at least 8 characters.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New passwords do not match.",
      );
      return;
    }

    try {
      setIsChangingPassword(true);
      setPasswordError("");
      setErrorMessage("");

      await changePassword(
        currentPassword,
        newPassword,
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setIsPasswordModalOpen(false);

      setSaveSuccess(true);

      window.setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error(
        "Failed to change password:",
        error,
      );

      setPasswordError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to change your password.",
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  const closePasswordModal = () => {
    if (isChangingPassword) {
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setIsPasswordModalOpen(false);
  };

  return (
    <SettingsLayout
      title="Management Settings"
      subtitle="Manage your manager profile, notification preferences, and security settings."
      saveSuccess={saveSuccess}
      successMessage="Settings saved successfully!"
      headerAction={
        <GoldButton
          onClick={handleSaveChanges}
          disabled={isSaving}
        >
          {isSaving
            ? "Saving..."
            : "Save All Changes"}
        </GoldButton>
      }
    >
      {errorMessage && (
        <div className="mb-6 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
          {errorMessage}
        </div>
      )}

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
                  <img
                    src={user.avatar}
                    alt={
                      user.name ||
                      "Management User"
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-navy-800">
                    <User className="h-8 w-8 text-ink/40" />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleChangePicture}
                disabled={isUploadingPhoto}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-navy-900/60 opacity-0 transition-opacity group-hover:opacity-100 disabled:cursor-not-allowed"
              >
                <Camera className="h-6 w-6 text-cream" />
              </button>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePictureSelect}
                className="hidden"
              />
            </div>

            <div>
              <h3 className="font-heading text-lg font-bold text-cream">
                {user?.name ||
                  "Management User"}
              </h3>

              <p className="text-sm text-ink/60">
                {user?.role || "Manager"} • ID:
                MGT-40291
              </p>

              <div className="mt-2 flex gap-2">
                <GhostButton
                  size="sm"
                  onClick={handleChangePicture}
                  disabled={isUploadingPhoto}
                >
                  {isUploadingPhoto
                    ? "Uploading..."
                    : "Change Picture"}
                </GhostButton>

                <GhostButton
                  size="sm"
                  className="text-rose-400 hover:text-rose-300"
                  disabled
                >
                  Remove
                </GhostButton>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm text-ink/60">
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-ink/40" />

                <input
                  type="text"
                  value={fullName}
                  onChange={(event) =>
                    setFullName(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-cream focus:border-gold-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-ink/60">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-ink/40" />

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-cream focus:border-gold-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-ink/60">
                Phone Number
              </label>

              <div className="relative">
                <Smartphone className="absolute left-3 top-3 h-4 w-4 text-ink/40" />

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-cream focus:border-gold-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-ink/60">
                Office Location
              </label>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-ink/40" />

                <input
                  type="text"
                  value={officeLocation}
                  onChange={(event) =>
                    setOfficeLocation(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-cream focus:border-gold-400 focus:outline-none"
                />
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
            <h4 className="font-heading text-sm font-semibold text-cream uppercase tracking-wider">
              Delivery Methods
            </h4>

            <div className="grid gap-4 sm:grid-cols-3">
              <SettingsToggle
                label="Email Notifications"
                checked={notifs.email}
                onChange={() =>
                  toggleNotif("email")
                }
              />

              <SettingsToggle
                label="Push Notifications"
                checked={notifs.push}
                onChange={() =>
                  toggleNotif("push")
                }
              />

              <SettingsToggle
                label="SMS Alerts"
                checked={notifs.sms}
                onChange={() =>
                  toggleNotif("sms")
                }
              />
            </div>
          </div>

          <div className="h-px w-full bg-white/10" />

          <div className="space-y-4">
            <h4 className="font-heading text-sm font-semibold text-cream uppercase tracking-wider">
              Alert Types
            </h4>

            <div className="grid gap-4 sm:grid-cols-2">
              <SettingsToggle
                label="Operational Alerts"
                description="Get notified about system issues or compliance flags."
                checked={
                  notifs.operationalAlerts
                }
                onChange={() =>
                  toggleNotif(
                    "operationalAlerts",
                  )
                }
              />

              <SettingsToggle
                label="Approval Requests"
                description="Receive alerts for items requiring your approval."
                checked={
                  notifs.approvalRequests
                }
                onChange={() =>
                  toggleNotif(
                    "approvalRequests",
                  )
                }
              />

              <SettingsToggle
                label="Direct Messages"
                description="Notifications for messages from your team."
                checked={notifs.messages}
                onChange={() =>
                  toggleNotif("messages")
                }
              />

              <SettingsToggle
                label="Performance Updates"
                description="Weekly summaries of KPI changes."
                checked={
                  notifs.performanceUpdates
                }
                onChange={() =>
                  toggleNotif(
                    "performanceUpdates",
                  )
                }
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
                <p className="font-medium text-cream">
                  Password
                </p>

                <p className="text-sm text-ink/60">
                  Last changed
                </p>
              </div>
            </div>

            <GhostButton
              size="sm"
              onClick={() => {
                setPasswordError("");
                setIsPasswordModalOpen(
                  true,
                );
              }}
            >
              Update Password
            </GhostButton>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                <Shield className="h-5 w-5" />
              </div>

              <div>
                <p className="font-medium text-cream">
                  Two-Factor Authentication (2FA)
                </p>

                <p className="text-sm text-ink/60"></p>
              </div>
            </div>

            <GhostButton
              size="sm"
              disabled
            >
              Configure
            </GhostButton>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-800 text-ink/40">
                <Monitor className="h-5 w-5" />
              </div>

              <div>
                <p className="font-medium text-cream">
                  Active Sessions
                </p>

                <p className="text-sm text-ink/60"></p>
              </div>
            </div>

            <GhostButton
              size="sm"
              disabled
            >
              Manage Devices
            </GhostButton>
          </div>
        </div>
      </SettingsSection>

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-navy-900 p-6 shadow-2xl">
            <div className="mb-6">
              <h2 className="font-heading text-xl font-bold text-cream">
                Update Password
              </h2>

              <p className="mt-1 text-sm text-ink/60">
                Enter your current password and
                choose a new password.
              </p>
            </div>

            {passwordError && (
              <div className="mb-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
                {passwordError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-ink/60">
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
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-cream outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-ink/60">
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
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-cream outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-ink/60">
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
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-cream outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <GhostButton
                size="sm"
                onClick={closePasswordModal}
                disabled={isChangingPassword}
              >
                Cancel
              </GhostButton>

              <GoldButton
                onClick={handleChangePassword}
                disabled={isChangingPassword}
              >
                {isChangingPassword
                  ? "Updating..."
                  : "Update Password"}
              </GoldButton>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={() =>
          setConfirmationState((prev) => ({
            ...prev,
            isOpen: false,
          }))
        }
        onConfirm={confirmationState.onConfirm}
        title={confirmationState.title}
        description={confirmationState.description}
        confirmText={confirmationState.confirmText}
      />
    </SettingsLayout>
  );
}