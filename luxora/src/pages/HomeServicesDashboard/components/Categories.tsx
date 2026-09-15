import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import type { ServiceCategory } from '../../../types';
import { CategoryFormModal } from './modals/CategoryFormModal';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { useToast } from '../../../contexts/ToastContext';
import { homeServicesApi } from '../../../api/home-services.api';

export default function Categories() {
  const { showToast } = useToast();

  const [categories, setCategories] =
    useState<ServiceCategory[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory | null>(null);

  const [modalState, setModalState] = useState<
    'none' | 'create' | 'edit' | 'toggle'
  >('none');

  const loadCategories = async () => {
    try {
      setIsLoading(true);

      const response =
        await homeServicesApi.getServiceCategories();

      setCategories(response.categories || []);
    } catch (error) {
      console.error(
        'Failed to load service categories:',
        error,
      );

      showToast({
        title: 'Error',
        description:
          'Failed to load service categories.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSave = async (
    data: Partial<ServiceCategory>,
  ) => {
    try {
      if (modalState === 'edit') {
        if (!selectedCategory) return;

        await homeServicesApi.updateServiceCategory(
          selectedCategory.id,
          {
            name: data.name,
            description: data.description,
          },
        );

        showToast({
          title: 'Success',
          description:
            'Category updated successfully.',
          type: 'success',
        });
      } else {
        await homeServicesApi.createServiceCategory({
          name: data.name,
          description: data.description,
        });

        showToast({
          title: 'Success',
          description:
            'Category created successfully.',
          type: 'success',
        });
      }

      await loadCategories();

      setModalState('none');
      setSelectedCategory(null);
    } catch (error) {
      console.error(
        'Failed to save service category:',
        error,
      );

      showToast({
        title: 'Error',
        description:
          'Failed to save service category.',
        type: 'error',
      });
    }
  };

  const handleToggle = async () => {
    if (!selectedCategory) return;

    try {
      await homeServicesApi.toggleServiceCategory(
        selectedCategory.id,
      );

      await loadCategories();

      showToast({
        title: 'Success',
        description:
          'Category status updated successfully.',
        type: 'success',
      });

      setModalState('none');
      setSelectedCategory(null);
    } catch (error) {
      console.error(
        'Failed to update category status:',
        error,
      );

      showToast({
        title: 'Error',
        description:
          'Failed to update category status.',
        type: 'error',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <DataTableToolbar
          searchPlaceholder="Search categories..."
          onFilter={() => {}}
        />

        <GoldButton
          className="flex items-center gap-2"
          onClick={() =>
            setModalState('create')
          }
        >
          <Plus className="h-4 w-4" />
          Add Category
        </GoldButton>
      </div>

      <div className="bg-navy-800/50 rounded-2xl border border-white/10 p-6">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-ink/50">
            Loading service categories...
          </div>
        ) : (
          <DataTable
            columns={[
              {
                header: 'Category Name',
                render: (c: ServiceCategory) =>
                  c.name,
              },
              {
                header: 'Providers',
                render: (c: ServiceCategory) =>
                  c.activeProviders,
              },
              {
                header: 'Active Requests',
                render: (c: ServiceCategory) =>
                  c.activeRequests,
              },
              {
                header: 'Monthly Revenue',
                render: (c: ServiceCategory) =>
                  `₦${c.monthlyRevenue.toLocaleString()}`,
              },
              {
                header: 'Status',
                render: (c: ServiceCategory) => (
                  <EnterpriseStatusBadge
                    status={c.status}
                  />
                ),
              },
              {
                header: 'Actions',
                render: (
                  c: ServiceCategory,
                ) => (
                  <div className="flex gap-2">
                    <GhostButton
                      size="sm"
                      onClick={() => {
                        setSelectedCategory(c);
                        setModalState('edit');
                      }}
                    >
                      Edit
                    </GhostButton>

                    <GhostButton
                      size="sm"
                      onClick={() => {
                        setSelectedCategory(c);
                        setModalState('toggle');
                      }}
                    >
                      {c.status === 'Active'
                        ? 'Disable'
                        : 'Enable'}
                    </GhostButton>
                  </div>
                ),
              },
            ]}
            keyExtractor={(c: ServiceCategory) =>
              c.id
            }
            data={categories}
          />
        )}
      </div>

      <CategoryFormModal
        isOpen={
          modalState === 'create' ||
          modalState === 'edit'
        }
        onClose={() => {
          setModalState('none');
          setSelectedCategory(null);
        }}
        onSubmit={handleSave}
        initialData={
          modalState === 'edit'
            ? selectedCategory
            : undefined
        }
      />

      <ConfirmationModal
        isOpen={modalState === 'toggle'}
        onClose={() => {
          setModalState('none');
          setSelectedCategory(null);
        }}
        onConfirm={handleToggle}
        title={`${
          selectedCategory?.status === 'Active'
            ? 'Disable'
            : 'Enable'
        } Category`}
        message={`Are you sure you want to ${
          selectedCategory?.status === 'Active'
            ? 'disable'
            : 'enable'
        } the ${selectedCategory?.name} category?`}
        confirmText="Confirm"
        isDestructive={
          selectedCategory?.status === 'Active'
        }
      />
    </div>
  );
}