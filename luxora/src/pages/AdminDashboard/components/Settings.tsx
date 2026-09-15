import {
  Shield,
  KeyRound,
  Globe,
  Percent,
  Server,
  AlertTriangle,
} from "lucide-react";

import { useEffect, useState } from "react";

import PasswordChangeModal from "../../OwnerDashboard/components/modals/PasswordChangeModal";

import {
  GoldButton,
  GhostButton,
} from "../../../components/ui/ui";

import { useSession } from "../../../contexts/SessionContext";

import { adminApi } from "../../../api/admin.api";

import { SettingsLayout } from "../../../components/dashboard/shared/layouts/SettingsLayout";
import { SettingsSection } from "../../../components/dashboard/shared/settings/SettingsSection";
import { SettingsToggle } from "../../../components/dashboard/shared/settings/SettingsToggle";
import { ConfirmationModal } from "../../../components/ui/ConfirmationModal";

interface SystemSettings {
  _id?: string;
  key?: string;
  platformFee: number;
  currency: "NGN" | "USD" | "GBP";
  maintenanceMode: boolean;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function Settings() {
  const {
    user,
    changePassword,
  } = useSession();

  const isSuperAdmin =
    user?.role === "Super Admin";

  /*
   * Real global platform settings loaded
   * from the backend.
   */
  const [systemSettings, setSystemSettings] =
    useState<SystemSettings | null>(
      null,
    );

  /*
   * Track the global settings request.
   */
  const [isLoadingSystemSettings, setIsLoadingSystemSettings] =
    useState(true);

  /*
   * Track the global settings save request.
   */
  const [isSavingSystemSettings, setIsSavingSystemSettings] =
    useState(false);

  /*
   * Track any settings loading error.
   */
  const [systemSettingsError, setSystemSettingsError] =
    useState<string | null>(null);

  /*
   * Load the real global platform settings.
   */
  useEffect(() => {
    const fetchSystemSettings =
      async () => {
        try {
          setIsLoadingSystemSettings(
            true,
          );

          setSystemSettingsError(
            null,
          );

          const response =
            await adminApi.getSystemSettings();

          setSystemSettings(
            response.settings as SystemSettings,
          );
        } catch (error) {
          console.error(
            "Failed to load global system settings:",
            error,
          );

          setSystemSettingsError(
            "Unable to load global platform settings.",
          );
        } finally {
          setIsLoadingSystemSettings(
            false,
          );
        }
      };

    /*
     * Only Super Admins can access
     * the global system-settings endpoint.
     */
    if (isSuperAdmin) {
      void fetchSystemSettings();
    } else {
      setIsLoadingSystemSettings(
        false,
      );
    }
  }, [isSuperAdmin]);

  const [confirmModal, setConfirmModal] =
    useState<{
      isOpen: boolean;
      type: "global" | null;
    }>({
      isOpen: false,
      type: null,
    });

  /*
   * Password modal state.
   */
  const [passwordModalOpen, setPasswordModalOpen] =
    useState(false);

  /*
   * Format the real account creation date
   * returned by the backend.
   */
  const administratorSince =
    user?.createdAt
      ? new Date(
          user.createdAt,
        ).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          },
        )
      : "Not available";

  /*
   * Department comes from the authenticated
   * User document.
   */
  const department =
    user?.department ||
    "Not assigned";

  /*
   * Change the password through the
   * existing authentication flow.
   */
  const handleChangePassword =
    async (
      currentPassword: string,
      newPassword: string,
    ) => {
      try {
        await changePassword(
          currentPassword,
          newPassword,
        );

        setPasswordModalOpen(false);

        alert(
          "Your password was changed successfully.",
        );
      } catch (error: any) {
        console.error(
          "Failed to change Admin password:",
          error,
        );

        alert(
          error?.response?.data
            ?.message ||
            error?.message ||
            "We could not change your password.",
        );
      }
    };

  /*
   * Save the edited global platform settings
   * through the real backend endpoint.
   */
  const handleSaveSystemSettings =
    async () => {
      if (
        !systemSettings ||
        !isSuperAdmin
      ) {
        return;
      }

      try {
        setIsSavingSystemSettings(
          true,
        );

        setSystemSettingsError(null);

        const response =
          await adminApi.updateSystemSettings(
            {
              platformFee:
                Number(
                  systemSettings.platformFee,
                ),
              currency:
                systemSettings.currency,
              maintenanceMode:
                systemSettings.maintenanceMode,
            },
          );

        setSystemSettings(
          response.settings as SystemSettings,
        );

        setConfirmModal({
          isOpen: false,
          type: null,
        });

        alert(
          "Global system settings were updated successfully.",
        );
      } catch (error: any) {
        console.error(
          "Failed to update global system settings:",
          error,
        );

        setConfirmModal({
          isOpen: false,
          type: null,
        });

        alert(
          error?.response?.data
            ?.message ||
            error?.message ||
            "We could not update the global system settings.",
        );
      } finally {
        setIsSavingSystemSettings(
          false,
        );
      }
    };

  /*
   * Values displayed by the global settings
   * controls.
   */
  const platformFee =
    systemSettings?.platformFee ??
    0;

  const currency =
    systemSettings?.currency ||
    "NGN";

  const maintenanceMode =
    systemSettings?.maintenanceMode ??
    false;

  return (
    <SettingsLayout
      title="System Configuration"
      subtitle="Global platform settings and administrative access controls."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Global Platform Settings */}
        <SettingsSection
          title="Global Parameters"
          size="2xl"
          className="lg:col-span-2"
        >
          {systemSettingsError && (
            <div className="mb-6 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
              {systemSettingsError}
            </div>
          )}

          <div className="space-y-4">
            {/* Platform Fee */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink/70">
                Luxora Base Platform Fee (GMV)
              </label>

              <div className="relative w-1/2">
                <Percent className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                <input
                  type="number"
                  value={
                    isLoadingSystemSettings
                      ? ""
                      : platformFee
                  }
                  onChange={(e) =>
                    setSystemSettings(
                      (prev) =>
                        prev
                          ? {
                              ...prev,
                              platformFee:
                                Number(
                                  e.target
                                    .value,
                                ),
                            }
                          : prev,
                    )
                  }
                  step="0.1"
                  min="0"
                  max="100"
                  disabled={
                    !isSuperAdmin ||
                    isLoadingSystemSettings ||
                    !systemSettings ||
                    isSavingSystemSettings
                  }
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-12 text-cream focus:border-gold-400/50 focus:outline-none disabled:opacity-50"
                  placeholder={
                    isLoadingSystemSettings
                      ? "Loading..."
                      : undefined
                  }
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ink/50">
                  %
                </div>
              </div>

              <p className="mt-1 text-xs text-ink/50">
                Current platform fee stored in
                the Luxora system configuration.
              </p>
            </div>

            {/* Currency */}
            <div className="space-y-2 pt-4">
              <label className="text-sm font-medium text-ink/70">
                Default Currency
              </label>

              <div className="relative w-1/2">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                <select
                  value={
                    isLoadingSystemSettings
                      ? ""
                      : currency
                  }
                  disabled={
                    !isSuperAdmin ||
                    isLoadingSystemSettings ||
                    !systemSettings ||
                    isSavingSystemSettings
                  }
                  onChange={(e) =>
                    setSystemSettings(
                      (prev) =>
                        prev
                          ? {
                              ...prev,
                              currency:
                                e.target
                                  .value as
                                  | "NGN"
                                  | "USD"
                                  | "GBP",
                            }
                          : prev,
                    )
                  }
                  className="w-full appearance-none rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-4 text-cream focus:border-gold-400/50 focus:outline-none disabled:opacity-50"
                >
                  <option value="">
                    {isLoadingSystemSettings
                      ? "Loading..."
                      : "Select Currency"}
                  </option>

                  <option value="NGN">
                    NGN (Nigerian Naira - ₦)
                  </option>

                  <option value="USD">
                    USD (US Dollar - $)
                  </option>

                  <option value="GBP">
                    GBP (British Pound - £)
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="space-y-4 border-t border-white/10 pt-4">
            <h3 className="font-heading text-lg font-semibold text-cream">
              System Status
            </h3>

            <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-4">
              <SettingsToggle
                label="Maintenance Mode"
                labelClassName="text-rose-400"
                description="Suspend all non-admin logins and disable new listings."
                checked={
                  isLoadingSystemSettings
                    ? false
                    : maintenanceMode
                }
                disabled={
                  !isSuperAdmin ||
                  isLoadingSystemSettings ||
                  !systemSettings ||
                  isSavingSystemSettings
                }
                onChange={(checked) =>
                  setSystemSettings(
                    (prev) =>
                      prev
                        ? {
                            ...prev,
                            maintenanceMode:
                              checked,
                          }
                        : prev,
                  )
                }
                icon={
                  <div className="mt-[-4px] flex h-10 w-10 items-center justify-center rounded-lg bg-rose-400/10 text-rose-400">
                    <Server className="h-5 w-5" />
                  </div>
                }
              />
            </div>

            {!isSuperAdmin && (
              <p className="flex items-center gap-1 text-xs text-rose-400/80">
                <AlertTriangle className="h-3 w-3" />

                Only Super Admins can alter global parameters or system status.
              </p>
            )}
          </div>

          {isSuperAdmin && (
            <div className="pt-4">
              <GoldButton
                disabled={
                  isLoadingSystemSettings ||
                  !systemSettings ||
                  isSavingSystemSettings
                }
                onClick={() =>
                  setConfirmModal({
                    isOpen: true,
                    type: "global",
                  })
                }
              >
                {isSavingSystemSettings
                  ? "Saving..."
                  : "Apply Global Changes"}
              </GoldButton>
            </div>
          )}
        </SettingsSection>

        {/* Administrator Profile */}
        <div className="space-y-6">
          <SettingsSection
            title="Administrator Profile"
            size="2xl"
            className="!space-y-4"
          >
            {/* Real role information */}
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Shield
                className={`h-5 w-5 ${
                  isSuperAdmin
                    ? "text-gold-400"
                    : "text-blue-400"
                }`}
              />

              <div className="flex-1">
                <p className="text-sm font-semibold text-cream">
                  Role & Permission Level
                </p>

                <p
                  className={`text-xs ${
                    isSuperAdmin
                      ? "text-gold-400"
                      : "text-blue-400"
                  }`}
                >
                  {user?.role ||
                    "Platform Administrator"}{" "}
                  •{" "}
                  {isSuperAdmin
                    ? "Full Access"
                    : "Restricted"}
                </p>
              </div>
            </div>

            {/* Real account information */}
            <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4">
              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-ink/60">
                  Department
                </p>

                <p className="text-sm font-medium text-cream">
                  {department}
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-ink/60">
                  Email
                </p>

                <p className="break-all text-sm font-medium text-cream">
                  {user?.email ||
                    "Not available"}
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-ink/60">
                  Full Name
                </p>

                <p className="text-sm font-medium text-cream">
                  {user?.name ||
                    "Not available"}
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-ink/60">
                  Account Status
                </p>

                <p
                  className={`text-sm font-medium ${
                    user?.isActive
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {user?.isActive
                    ? "Active"
                    : "Inactive"}
                </p>
              </div>

              <div className="col-span-2">
                <p className="mb-1 text-xs uppercase tracking-wider text-ink/60">
                  Administrator Since
                </p>

                <p className="text-sm font-medium text-cream">
                  {administratorSince}
                </p>
              </div>
            </div>

            {/* Password */}
            <div className="flex items-center gap-3 pt-2">
              <KeyRound className="h-5 w-5 text-ink/50" />

              <div className="flex-1">
                <p className="text-sm font-semibold text-cream">
                  Admin Password
                </p>

                <p className="text-xs text-ink/50">
                  Manage your account password
                </p>
              </div>

              <GhostButton
                size="sm"
                onClick={() =>
                  setPasswordModalOpen(
                    true,
                  )
                }
              >
                Update
              </GhostButton>
            </div>
          </SettingsSection>
        </div>
      </div>

      {/* Global settings confirmation */}
      <ConfirmationModal
        isOpen={
          confirmModal.isOpen
        }
        onClose={() =>
          setConfirmModal({
            isOpen: false,
            type: null,
          })
        }
        onConfirm={
          handleSaveSystemSettings
        }
        title="Apply Global Settings"
        message="Are you sure you want to apply these system-wide changes?"
        confirmText={
          isSavingSystemSettings
            ? "Saving..."
            : "Apply Changes"
        }
        isDestructive={false}
      />

      {/* Real password change flow */}
      <PasswordChangeModal
        isOpen={
          passwordModalOpen
        }
        onClose={() =>
          setPasswordModalOpen(false)
        }
        onSave={
          handleChangePassword
        }
      />
    </SettingsLayout>
  );
}