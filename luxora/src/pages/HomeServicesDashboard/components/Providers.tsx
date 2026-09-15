import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import type { ServiceProvider } from '../../../types';
import { ProviderFormModal } from './modals/ProviderFormModal';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { useToast } from '../../../contexts/ToastContext';
import { homeServicesApi } from '../../../api/home-services.api';

export default function Providers() {
  const { showToast } = useToast();

  const [providers, setProviders] =
    useState<ServiceProvider[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [selectedProvider, setSelectedProvider] =
    useState<ServiceProvider | null>(null);

  const [modalState, setModalState] = useState<
    'none' | 'create' | 'suspend' | 'approve'
  >('none');

  const loadProviders = async () => {
    try {
      setIsLoading(true);

      const response =
        await homeServicesApi.getServiceProviders();

      setProviders(response.providers || []);
    } catch (error) {
      console.error(
        'Failed to load service providers:',
        error,
      );

      showToast({
        title: 'Error',
        description:
          'Failed to load service providers.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const handleCreate = async (
    data: Partial<ServiceProvider>,
  ) => {
    try {
      await homeServicesApi.createServiceProvider({
        name: data.name,
        category: data.category,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
      });

      await loadProviders();

      showToast({
        title: 'Success',
        description:
          'Provider onboarding submitted successfully.',
        type: 'success',
      });

      setModalState('none');
    } catch (error) {
      console.error(
        'Failed to onboard provider:',
        error,
      );

      showToast({
        title: 'Error',
        description:
          'Failed to onboard provider.',
        type: 'error',
      });
    }
  };

  const handleSuspend = async () => {
    if (!selectedProvider) return;

    try {
      await homeServicesApi.suspendServiceProvider(
        selectedProvider.id,
      );

      await loadProviders();

      showToast({
        title: 'Success',
        description:
          'Provider suspended successfully.',
        type: 'success',
      });

      setModalState('none');
      setSelectedProvider(null);
    } catch (error) {
      console.error(
        'Failed to suspend provider:',
        error,
      );

      showToast({
        title: 'Error',
        description:
          'Failed to suspend provider.',
        type: 'error',
      });
    }
  };

  const handleApprove = async () => {
    if (!selectedProvider) return;

    try {
      await homeServicesApi.approveServiceProvider(
        selectedProvider.id,
      );

      await loadProviders();

      showToast({
        title: 'Success',
        description:
          'Provider approved successfully.',
        type: 'success',
      });

      setModalState('none');
      setSelectedProvider(null);
    } catch (error) {
      console.error(
        'Failed to approve provider:',
        error,
      );

      showToast({
        title: 'Error',
        description:
          'Failed to approve provider.',
        type: 'error',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <DataTableToolbar
          searchPlaceholder="Search providers..."
          onFilter={() => {}}
        />

        <GoldButton
          className="flex items-center gap-2"
          onClick={() => setModalState('create')}
        >
          <Plus className="h-4 w-4" />
          Onboard Provider
        </GoldButton>
      </div>

      <div className="bg-navy-800/50 rounded-2xl border border-white/10 p-6">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-ink/50">
            Loading service providers...
          </div>
        ) : (
          <DataTable
            columns={[
              {
                header: 'Provider Name',
                render: (p: ServiceProvider) =>
                  p.name,
              },
              {
                header: 'Category',
                render: (p: ServiceProvider) =>
                  p.category,
              },
              {
                header: 'Rating',
                render: (p: ServiceProvider) =>
                  p.rating,
              },
              {
                header: 'Revenue',
                render: (p: ServiceProvider) =>
                  `₦${p.revenue.toLocaleString()}`,
              },
              {
                header: 'Verification',
                render: (p: ServiceProvider) => (
                  <EnterpriseStatusBadge
                    status={
                      p.verificationStatus ===
                      'Verified'
                        ? 'Active'
                        : 'Pending'
                    }
                  />
                ),
              },
              {
                header: 'Status',
                render: (p: ServiceProvider) => (
                  <EnterpriseStatusBadge
                    status={p.status}
                  />
                ),
              },
              {
                header: 'Actions',
                render: (p: ServiceProvider) => (
                  <GhostButton
                    size="sm"
                    onClick={() =>
                      setSelectedProvider(p)
                    }
                  >
                    View
                  </GhostButton>
                ),
              },
            ]}
            keyExtractor={(p: ServiceProvider) =>
              p.id
            }
            data={providers}
          />
        )}
      </div>

      <EnterpriseDetailDrawer
        isOpen={!!selectedProvider}
        onClose={() =>
          setSelectedProvider(null)
        }
        title="Provider Details"
      >
        {selectedProvider && (
          <div className="space-y-6 text-cream">
            <div>
              <p className="text-sm text-ink/60">
                Provider Name
              </p>
              <p className="font-medium">
                {selectedProvider.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-ink/60">
                Category
              </p>
              <p className="font-medium">
                {selectedProvider.category}
              </p>
            </div>

            <div>
              <p className="text-sm text-ink/60">
                Contact
              </p>

              <p className="font-medium">
                {selectedProvider.contactEmail}
              </p>

              <p className="font-medium">
                {selectedProvider.contactPhone}
              </p>
            </div>

            <div>
              <p className="text-sm text-ink/60">
                Performance
              </p>

              <p className="font-medium">
                {selectedProvider.rating} / 5.0 (
                {selectedProvider.reviews} reviews)
              </p>

              <p className="font-medium">
                {selectedProvider.completedJobs}{' '}
                Completed Jobs
              </p>
            </div>

            <div className="flex gap-3 pt-6 border-t border-white/10">
              {selectedProvider.verificationStatus !==
                'Verified' && (
                <GoldButton
                  onClick={() =>
                    setModalState('approve')
                  }
                  className="flex-1"
                >
                  Approve Provider
                </GoldButton>
              )}

              {selectedProvider.status ===
                'Active' && (
                <GhostButton
                  onClick={() =>
                    setModalState('suspend')
                  }
                  className="flex-1 text-red-400 hover:text-red-300"
                >
                  Suspend Provider
                </GhostButton>
              )}
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <ProviderFormModal
        isOpen={modalState === 'create'}
        onClose={() =>
          setModalState('none')
        }
        onSubmit={handleCreate}
      />

      <ConfirmationModal
        isOpen={modalState === 'suspend'}
        onClose={() =>
          setModalState('none')
        }
        onConfirm={handleSuspend}
        title="Suspend Provider"
        message={`Are you sure you want to suspend ${selectedProvider?.name}?`}
        confirmText="Suspend"
        isDestructive={true}
      />

      <ConfirmationModal
        isOpen={modalState === 'approve'}
        onClose={() =>
          setModalState('none')
        }
        onConfirm={handleApprove}
        title="Approve Provider"
        message={`Approve ${selectedProvider?.name} for the Luxora platform?`}
        confirmText="Approve"
      />
    </div>
  );
}