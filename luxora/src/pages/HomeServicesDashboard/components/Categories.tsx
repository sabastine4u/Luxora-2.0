import { useState } from 'react';
import { Plus } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { serviceCategories } from '../../../data/homeServicesData';
import type { ServiceCategory } from '../../../types';
import { CategoryFormModal } from './modals/CategoryFormModal';
import { ConfirmationModal } from './modals/ConfirmationModal';
import { useToast } from '../../../contexts/ToastContext';

export default function Categories() {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [modalState, setModalState] = useState<'none' | 'create' | 'edit' | 'toggle'>('none');

  const handleSave = () => {
    showToast({ title: 'Success', description: 'Category saved successfully', type: 'success' });
    setModalState('none');
    setSelectedCategory(null);
  };

  const handleToggle = () => {
    showToast({ title: 'Success', description: 'Category status updated', type: 'success' });
    setModalState('none');
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <DataTableToolbar searchPlaceholder="Search categories..." onFilter={() => {}} />
        <GoldButton className="flex items-center gap-2" onClick={() => setModalState('create')}>
          <Plus className="h-4 w-4" /> Add Category
        </GoldButton>
      </div>

      <div className="bg-navy-800/50 rounded-2xl border border-white/10 p-6">
        <DataTable
          columns={[
            { header: 'Category Name', render: (c) => c.name },
            { header: 'Providers', render: (c) => c.activeProviders },
            { header: 'Active Requests', render: (c) => c.activeRequests },
            { header: 'Monthly Revenue', render: (c) => `₦${c.monthlyRevenue.toLocaleString()}` },
            { header: 'Status', render: (c) => <EnterpriseStatusBadge status={c.status} /> },
            { header: 'Actions', render: (c) => (
              <div className="flex gap-2">
                <GhostButton size="sm" onClick={() => { setSelectedCategory(c); setModalState('edit'); }}>Edit</GhostButton>
                <GhostButton size="sm" onClick={() => { setSelectedCategory(c); setModalState('toggle'); }}>
                  {c.status === 'Active' ? 'Disable' : 'Enable'}
                </GhostButton>
              </div>
            )}
          ]}
          keyExtractor={(c) => c.id}
          data={serviceCategories}
        />
      </div>

      <CategoryFormModal
        isOpen={modalState === 'create' || modalState === 'edit'}
        onClose={() => { setModalState('none'); setSelectedCategory(null); }}
        onSubmit={handleSave}
        initialData={modalState === 'edit' ? selectedCategory : undefined}
      />

      <ConfirmationModal
        isOpen={modalState === 'toggle'}
        onClose={() => { setModalState('none'); setSelectedCategory(null); }}
        onConfirm={handleToggle}
        title={`${selectedCategory?.status === 'Active' ? 'Disable' : 'Enable'} Category`}
        message={`Are you sure you want to ${selectedCategory?.status === 'Active' ? 'disable' : 'enable'} the ${selectedCategory?.name} category?`}
        confirmText="Confirm"
        isDestructive={selectedCategory?.status === 'Active'}
      />
    </div>
  );
}
