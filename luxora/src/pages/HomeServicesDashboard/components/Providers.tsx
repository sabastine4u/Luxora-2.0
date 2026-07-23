import { useState } from 'react';
import { Plus } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { serviceProviders } from '../../../data/homeServicesData';
import type { ServiceProvider } from '../../../types';
import { ProviderFormModal } from './modals/ProviderFormModal';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { useToast } from '../../../contexts/ToastContext';

export default function Providers() {
  const { showToast } = useToast();
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [modalState, setModalState] = useState<'none' | 'create' | 'suspend' | 'approve'>('none');

  const handleCreate = () => {
    showToast({ title: 'Success', description: 'Provider onboarding submitted', type: 'success' });
    setModalState('none');
  };

  const handleSuspend = () => {
    showToast({ title: 'Success', description: 'Provider suspended', type: 'success' });
    setModalState('none');
    setSelectedProvider(null);
  };

  const handleApprove = () => {
    showToast({ title: 'Success', description: 'Provider approved', type: 'success' });
    setModalState('none');
    setSelectedProvider(null);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <DataTableToolbar searchPlaceholder="Search providers..." onFilter={() => {}} />
        <GoldButton className="flex items-center gap-2" onClick={() => setModalState('create')}>
          <Plus className="h-4 w-4" /> Onboard Provider
        </GoldButton>
      </div>

      <div className="bg-navy-800/50 rounded-2xl border border-white/10 p-6">
        <DataTable
          columns={[
            { header: 'Provider Name', render: (p) => p.name },
            { header: 'Category', render: (p) => p.category },
            { header: 'Rating', render: (p) => p.rating },
            { header: 'Revenue', render: (p) => `₦${p.revenue.toLocaleString()}` },
            { header: 'Verification', render: (p) => <EnterpriseStatusBadge status={p.verificationStatus === 'Verified' ? 'Active' : 'Pending'} /> },
            { header: 'Status', render: (p) => <EnterpriseStatusBadge status={p.status} /> },
            { header: 'Actions', render: (p) => (
              <GhostButton size="sm" onClick={() => setSelectedProvider(p)}>View</GhostButton>
            )}
          ]}
          keyExtractor={(p) => p.id}
          data={serviceProviders}
        />
      </div>

      <EnterpriseDetailDrawer
        isOpen={!!selectedProvider}
        onClose={() => setSelectedProvider(null)}
        title="Provider Details"
      >
        {selectedProvider && (
          <div className="space-y-6 text-cream">
            <div>
              <p className="text-sm text-ink/60">Provider Name</p>
              <p className="font-medium">{selectedProvider.name}</p>
            </div>
            <div>
              <p className="text-sm text-ink/60">Category</p>
              <p className="font-medium">{selectedProvider.category}</p>
            </div>
            <div>
              <p className="text-sm text-ink/60">Contact</p>
              <p className="font-medium">{selectedProvider.contactEmail}</p>
              <p className="font-medium">{selectedProvider.contactPhone}</p>
            </div>
            <div>
              <p className="text-sm text-ink/60">Performance</p>
              <p className="font-medium">{selectedProvider.rating} / 5.0 ({selectedProvider.reviews} reviews)</p>
              <p className="font-medium">{selectedProvider.completedJobs} Completed Jobs</p>
            </div>

            <div className="flex gap-3 pt-6 border-t border-white/10">
              {selectedProvider.verificationStatus !== 'Verified' && (
                <GoldButton onClick={() => setModalState('approve')} className="flex-1">Approve Provider</GoldButton>
              )}
              {selectedProvider.status === 'Active' && (
                <GhostButton onClick={() => setModalState('suspend')} className="flex-1 text-red-400 hover:text-red-300">Suspend Provider</GhostButton>
              )}
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <ProviderFormModal
        isOpen={modalState === 'create'}
        onClose={() => setModalState('none')}
        onSubmit={handleCreate}
      />

      <ConfirmationModal
        isOpen={modalState === 'suspend'}
        onClose={() => setModalState('none')}
        onConfirm={handleSuspend}
        title="Suspend Provider"
        message={`Are you sure you want to suspend ${selectedProvider?.name}?`}
        confirmText="Suspend"
        isDestructive={true}
      />

      <ConfirmationModal
        isOpen={modalState === 'approve'}
        onClose={() => setModalState('none')}
        onConfirm={handleApprove}
        title="Approve Provider"
        message={`Approve ${selectedProvider?.name} for the Luxora platform?`}
        confirmText="Approve"
      />
    </div>
  );
}
