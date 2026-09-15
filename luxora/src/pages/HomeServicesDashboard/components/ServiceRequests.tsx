import { useEffect, useState } from 'react';
import { Wrench } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import type { ServiceRequest } from '../../../types';
import { ServiceRequestModal } from './modals/ServiceRequestModal';
import { ProviderAssignmentModal } from './modals/ProviderAssignmentModal';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { useToast } from '../../../contexts/ToastContext';
import { homeServicesApi } from '../../../api/home-services.api';

export default function ServiceRequests() {
  const { showToast } = useToast();

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] =
    useState<ServiceRequest | null>(null);

  const [modalState, setModalState] = useState<
    'none' | 'create' | 'edit' | 'assign' | 'reject'
  >('none');

  const loadRequests = async () => {
    try {
      setIsLoading(true);

      const response =
        await homeServicesApi.getServiceRequests();

      setRequests(response.requests || []);
    } catch (error) {
      console.error(
        'Failed to load service requests:',
        error,
      );

      showToast({
        title: 'Error',
        description:
          'Failed to load service requests.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleCreate = async (
    data: Partial<ServiceRequest>,
  ) => {
    try {
      await homeServicesApi.createServiceRequest({
        customerName: data.customerName,
        category: data.category,
        priority: data.priority,
        location: data.location,
        description: data.description,
      });

      await loadRequests();

      showToast({
        title: 'Success',
        description:
          'Service request created successfully.',
        type: 'success',
      });

      setModalState('none');
    } catch (error) {
      console.error(
        'Failed to create service request:',
        error,
      );

      showToast({
        title: 'Error',
        description:
          'Failed to create service request.',
        type: 'error',
      });
    }
  };
  
const handleAssign = async (data: {
  providerId: string;
  notes?: string;
}) => {
  if (!selectedRequest) return;

  try {
    const response =
      await homeServicesApi.assignServiceRequest(
        selectedRequest.id,
        data,
      );

    const updatedRequest = response.request;

    setSelectedRequest(updatedRequest);

    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === updatedRequest.id
          ? updatedRequest
          : request,
      ),
    );

    showToast({
      title: 'Success',
      description:
        'Provider assigned to request successfully.',
      type: 'success',
    });

    setModalState('none');
  } catch (error) {
    console.error(
      'Failed to assign provider:',
      error,
    );

    showToast({
      title: 'Error',
      description:
        'Failed to assign provider to request.',
      type: 'error',
    });
  }
};

  const handleReject = async () => {
    if (!selectedRequest) return;

    try {
      await homeServicesApi.rejectServiceRequest(
        selectedRequest.id,
      );

      await loadRequests();

      showToast({
        title: 'Success',
        description:
          'Service request rejected successfully.',
        type: 'success',
      });

      setModalState('none');
      setSelectedRequest(null);
    } catch (error) {
      console.error(
        'Failed to reject service request:',
        error,
      );

      showToast({
        title: 'Error',
        description:
          'Failed to reject service request.',
        type: 'error',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <DataTableToolbar
          searchPlaceholder="Search requests..."
          onFilter={() => {}}
        />

        <GoldButton
          className="flex items-center gap-2"
          onClick={() => setModalState('create')}
        >
          <Wrench className="h-4 w-4" />
          Create Request
        </GoldButton>
      </div>

      <div className="bg-navy-800/50 rounded-2xl border border-white/10 p-6">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-ink/50">
            Loading service requests...
          </div>
        ) : (
          <DataTable
            columns={[
              {
                header: 'ID',
                render: (req: ServiceRequest) =>
                  req.id,
              },
              {
                header: 'Customer',
                render: (req: ServiceRequest) =>
                  req.customerName,
              },
              {
                header: 'Category',
                render: (req: ServiceRequest) =>
                  req.category,
              },
              {
                header: 'Priority',
                render: (req: ServiceRequest) =>
                  req.priority,
              },
              {
                header: 'Status',
                render: (req: ServiceRequest) => (
                  <EnterpriseStatusBadge
                    status={req.status}
                  />
                ),
              },
              {
                header: 'Actions',
                render: (req: ServiceRequest) => (
                  <GhostButton
                    size="sm"
                    onClick={() =>
                      setSelectedRequest(req)
                    }
                  >
                    View Details
                  </GhostButton>
                ),
              },
            ]}
            keyExtractor={(req: ServiceRequest) =>
              req.id
            }
            data={requests}
          />
        )}
      </div>

      <EnterpriseDetailDrawer
        isOpen={!!selectedRequest}
        onClose={() =>
          setSelectedRequest(null)
        }
        title="Request Details"
      >
        {selectedRequest && (
          <div className="space-y-6 text-cream">
            <div>
              <p className="text-sm text-ink/60">
                Request ID
              </p>
              <p className="font-medium">
                {selectedRequest.id}
              </p>
            </div>

            <div>
              <p className="text-sm text-ink/60">
                Customer
              </p>
              <p className="font-medium">
                {selectedRequest.customerName}
              </p>
            </div>

            <div>
              <p className="text-sm text-ink/60">
                Description
              </p>
              <p className="font-medium">
                {selectedRequest.description}
              </p>
            </div>

            <div>
              <p className="text-sm text-ink/60">
                Location
              </p>
              <p className="font-medium">
                {selectedRequest.location}
              </p>
            </div>

            <div>
              <p className="text-sm text-ink/60">
                Priority
              </p>
              <p className="font-medium">
                {selectedRequest.priority}
              </p>
            </div>

            <div>
              <p className="text-sm text-ink/60">
                Status
              </p>

              <EnterpriseStatusBadge
                status={selectedRequest.status}
              />
            </div>

            {selectedRequest.assignedProviderName && (
              <div>
                <p className="text-sm text-ink/60">
                  Assigned Provider
                </p>

                <p className="font-medium">
                  {
                    selectedRequest.assignedProviderName
                  }
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-6 border-t border-white/10">
              <GoldButton
                onClick={() =>
                  setModalState('assign')
                }
                className="flex-1"
                disabled={
                  selectedRequest.status ===
                    'Completed' ||
                  selectedRequest.status ===
                    'Cancelled'
                }
              >
                Assign Provider
              </GoldButton>

              <GhostButton
                onClick={() =>
                  setModalState('reject')
                }
                className="flex-1 text-red-400 hover:text-red-300"
                disabled={
                  selectedRequest.status ===
                    'Completed' ||
                  selectedRequest.status ===
                    'Cancelled'
                }
              >
                Reject Request
              </GhostButton>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <ServiceRequestModal
        isOpen={
          modalState === 'create' ||
          modalState === 'edit'
        }
        onClose={() =>
          setModalState('none')
        }
        onSubmit={handleCreate}
        initialData={
          modalState === 'edit'
            ? selectedRequest
            : undefined
        }
      />

      <ProviderAssignmentModal
        isOpen={
          modalState === 'assign'
        }
        onClose={() =>
          setModalState('none')
        }
        onSubmit={handleAssign}
        requestCategory={
          selectedRequest?.category
        }
      />

      <ConfirmationModal
        isOpen={
          modalState === 'reject'
        }
        onClose={() =>
          setModalState('none')
        }
        onConfirm={handleReject}
        title="Reject Service Request"
        message="Are you sure you want to reject this request? This action cannot be undone."
        confirmText="Reject"
        isDestructive={true}
      />
    </div>
  );
}