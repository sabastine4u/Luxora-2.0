import { useState } from 'react';
import { GhostButton } from '../../../components/ui/ui';
import { SettingsLayout } from '../../../components/dashboard/shared/layouts/SettingsLayout';
import { SettingsSection } from '../../../components/dashboard/shared/settings/SettingsSection';
import { SettingsToggle } from '../../../components/dashboard/shared/settings/SettingsToggle';
import { useToast } from '../../../contexts/ToastContext';
import { MapPin, Mail, Smartphone, Shield, Zap, UserCheck } from 'lucide-react';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';

export default function Settings() {
  const { showToast } = useToast();
  
  const [notifs, setNotifs] = useState({
    email: true,
    push: true,
    newRequests: true,
    providerOnboarding: true,
  });

  const [serviceConfig, setServiceConfig] = useState({
    autoAssign: false,
    manualApproval: true,
    escalation: true,
  });

  const [modalState, setModalState] = useState<'none' | 'save'>('none');

  const handleSave = () => {
    showToast({ title: 'Success', description: 'Settings updated successfully', type: 'success' });
    setModalState('none');
  };

  return (
    <div className="max-w-4xl">
      <SettingsLayout
        title="Service Configuration"
        subtitle="Manage home service preferences, provider approval workflows, and notification settings."
        onSave={() => setModalState('save')}
      >
        <SettingsSection title="Service Preferences" description="Configure how service requests and providers are handled.">
          <div className="space-y-4">
            <SettingsToggle
              label="Auto-Assign Providers"
              description="Automatically assign verified providers to low-priority requests."
              checked={serviceConfig.autoAssign}
              onChange={(c) => setServiceConfig(prev => ({ ...prev, autoAssign: c }))}
              icon={<Zap />}
            />
            <SettingsToggle
              label="Manual Provider Approval"
              description="Require admin approval for all new provider registrations."
              checked={serviceConfig.manualApproval}
              onChange={(c) => setServiceConfig(prev => ({ ...prev, manualApproval: c }))}
              icon={<UserCheck />}
            />
            <SettingsToggle
              label="High Priority Escalation"
              description="Automatically escalate emergency service requests to senior admins."
              checked={serviceConfig.escalation}
              onChange={(c) => setServiceConfig(prev => ({ ...prev, escalation: c }))}
              icon={<Shield />}
            />
          </div>
        </SettingsSection>

        <SettingsSection title="Service Areas" description="Manage active regions for Home Services.">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Lagos', 'Abuja', 'Port Harcourt'].map((area) => (
              <div key={area} className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5">
                <MapPin className="h-5 w-5 text-gold-400" />
                <span className="text-cream font-medium">{area}</span>
              </div>
            ))}
            <GhostButton className="h-full border border-dashed border-white/20">
              + Add Area
            </GhostButton>
          </div>
        </SettingsSection>

        <SettingsSection title="Notifications" description="Manage how you receive alerts.">
          <div className="space-y-4">
            <SettingsToggle
              label="Email Notifications"
              description="Receive daily summaries and critical alerts via email."
              checked={notifs.email}
              onChange={(c) => setNotifs(prev => ({ ...prev, email: c }))}
              icon={<Mail />}
            />
            <SettingsToggle
              label="Push Notifications"
              description="Real-time alerts for emergency requests and high-priority issues."
              checked={notifs.push}
              onChange={(c) => setNotifs(prev => ({ ...prev, push: c }))}
              icon={<Smartphone />}
            />
          </div>
        </SettingsSection>
      </SettingsLayout>

      <ConfirmationModal
        isOpen={modalState === 'save'}
        onClose={() => setModalState('none')}
        onConfirm={handleSave}
        title="Save Changes"
        message="Are you sure you want to save these configuration changes?"
        confirmText="Save Settings"
      />
    </div>
  );
}
