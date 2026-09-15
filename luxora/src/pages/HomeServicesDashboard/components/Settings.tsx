import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { SettingsLayout } from '../../../components/dashboard/shared/layouts/SettingsLayout';
import { SettingsSection } from '../../../components/dashboard/shared/settings/SettingsSection';
import { SettingsToggle } from '../../../components/dashboard/shared/settings/SettingsToggle';
import { useToast } from '../../../contexts/ToastContext';
import {
  MapPin,
  Mail,
  Smartphone,
  Shield,
  Zap,
  UserCheck,
} from 'lucide-react';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { homeServicesApi } from '../../../api/home-services.api';

interface HomeServicesSettings {
  serviceConfig: {
    autoAssign: boolean;
    manualApproval: boolean;
    escalation: boolean;
  };

  areas: string[];

  notifications: {
    email: boolean;
    push: boolean;
    newRequests: boolean;
    providerOnboarding: boolean;
  };
}

export default function Settings() {
  const { showToast } = useToast();

  const [notifs, setNotifs] = useState({
    email: true,
    push: true,
    newRequests: true,
    providerOnboarding: true,
  });

  const [serviceConfig, setServiceConfig] =
    useState({
      autoAssign: false,
      manualApproval: true,
      escalation: true,
    });

  const [areas, setAreas] =
    useState<string[]>([]);

  const [newArea, setNewArea] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [isAreaModalOpen, setIsAreaModalOpen] =
    useState(false);

  const [modalState, setModalState] =
    useState<'none' | 'save'>('none');

  const loadSettings = async () => {
    try {
      setIsLoading(true);

      const response =
        await homeServicesApi.getSettings();

      const settings: HomeServicesSettings =
        response.settings;

      setServiceConfig(
        settings.serviceConfig,
      );

      setAreas(settings.areas || []);

      setNotifs(
        settings.notifications,
      );
    } catch (error) {
      console.error(
        'Failed to load Home Services settings:',
        error,
      );

      showToast({
        title: 'Error',
        description:
          'Failed to load service configuration.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      await homeServicesApi.updateSettings({
        serviceConfig,
        areas,
        notifications: notifs,
      });

      showToast({
        title: 'Success',
        description:
          'Settings updated successfully.',
        type: 'success',
      });

      setModalState('none');
    } catch (error) {
      console.error(
        'Failed to save Home Services settings:',
        error,
      );

      showToast({
        title: 'Error',
        description:
          'Failed to save service configuration.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddArea = () => {
    const trimmedArea =
      newArea.trim();

    if (!trimmedArea) {
      return;
    }

    const alreadyExists = areas.some(
      (area) =>
        area.toLowerCase() ===
        trimmedArea.toLowerCase(),
    );

    if (alreadyExists) {
      showToast({
        title: 'Area already exists',
        description:
          'This service area is already configured.',
        type: 'error',
      });

      return;
    }

    setAreas((currentAreas) => [
      ...currentAreas,
      trimmedArea,
    ]);

    setNewArea('');
    setIsAreaModalOpen(false);

    showToast({
      title: 'Area added',
      description:
        'The new service area has been added. Save your settings to persist the change.',
      type: 'success',
    });
  };

  const handleCloseAreaModal =
    useCallback(() => {
      setNewArea('');
      setIsAreaModalOpen(false);
    }, []);

  return (
    <div className="max-w-4xl">
      <SettingsLayout
        title="Service Configuration"
        subtitle="Manage home service preferences, provider approval workflows, and notification settings."
        onSave={() =>
          setModalState('save')
        }
      >
        {isLoading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <p className="text-sm text-ink/60">
              Loading service settings...
            </p>
          </div>
        ) : (
          <>
            <SettingsSection
              title="Service Preferences"
              description="Configure how service requests and providers are handled."
            >
              <div className="space-y-4">
                <SettingsToggle
                  label="Auto-Assign Providers"
                  description="Automatically assign verified providers to low-priority requests."
                  checked={
                    serviceConfig.autoAssign
                  }
                  onChange={(checked) =>
                    setServiceConfig(
                      (prev) => ({
                        ...prev,
                        autoAssign:
                          checked,
                      }),
                    )
                  }
                  icon={<Zap />}
                />

                <SettingsToggle
                  label="Manual Provider Approval"
                  description="Require admin approval for all new provider registrations."
                  checked={
                    serviceConfig.manualApproval
                  }
                  onChange={(checked) =>
                    setServiceConfig(
                      (prev) => ({
                        ...prev,
                        manualApproval:
                          checked,
                      }),
                    )
                  }
                  icon={<UserCheck />}
                />

                <SettingsToggle
                  label="High Priority Escalation"
                  description="Automatically escalate emergency service requests to senior admins."
                  checked={
                    serviceConfig.escalation
                  }
                  onChange={(checked) =>
                    setServiceConfig(
                      (prev) => ({
                        ...prev,
                        escalation:
                          checked,
                      }),
                    )
                  }
                  icon={<Shield />}
                />
              </div>
            </SettingsSection>

            <SettingsSection
              title="Service Areas"
              description="Manage active regions for Home Services."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {areas.map((area) => (
                  <div
                    key={area}
                    className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5"
                  >
                    <MapPin className="h-5 w-5 text-gold-400" />

                    <span className="text-cream font-medium">
                      {area}
                    </span>
                  </div>
                ))}

                <GhostButton
                  type="button"
                  className="h-full border border-dashed border-white/20"
                  onClick={() =>
                    setIsAreaModalOpen(true)
                  }
                >
                  + Add Area
                </GhostButton>
              </div>
            </SettingsSection>

            <SettingsSection
              title="Notifications"
              description="Manage how you receive alerts."
            >
              <div className="space-y-4">
                <SettingsToggle
                  label="Email Notifications"
                  description="Receive daily summaries and critical alerts via email."
                  checked={notifs.email}
                  onChange={(checked) =>
                    setNotifs(
                      (prev) => ({
                        ...prev,
                        email: checked,
                      }),
                    )
                  }
                  icon={<Mail />}
                />

                <SettingsToggle
                  label="Push Notifications"
                  description="Real-time alerts for emergency requests and high-priority issues."
                  checked={notifs.push}
                  onChange={(checked) =>
                    setNotifs(
                      (prev) => ({
                        ...prev,
                        push: checked,
                      }),
                    )
                  }
                  icon={<Smartphone />}
                />
              </div>
            </SettingsSection>
          </>
        )}
      </SettingsLayout>

      <Modal
        isOpen={isAreaModalOpen}
        onClose={handleCloseAreaModal}
        title="Add Service Area"
        size="md"
        actionButton={
          <GoldButton
            onClick={handleAddArea}
            disabled={!newArea.trim()}
          >
            Add Area
          </GoldButton>
        }
      >
        <div className="space-y-4">
          <Input
            label="Area"
            placeholder="e.g. Ibadan"
            value={newArea}
            onChange={(event) =>
              setNewArea(event.target.value)
            }
          />

          <p className="text-sm text-ink/60">
            The area will be added to your current
            configuration. Click Save Settings afterward
            to persist the change.
          </p>
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={
          modalState === 'save'
        }
        onClose={() =>
          isSaving
            ? undefined
            : setModalState('none')
        }
        onConfirm={handleSave}
        title="Save Changes"
        message="Are you sure you want to save these configuration changes?"
        confirmText={
          isSaving
            ? 'Saving...'
            : 'Save Settings'
        }
      />
    </div>
  );
}