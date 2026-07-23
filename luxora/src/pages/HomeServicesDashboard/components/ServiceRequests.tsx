import { useState } from 'react';
import { Wrench } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { serviceRequests } from '../../../data/homeServicesData';
import type { ServiceRequest } from '../../../types';
import { ServiceRequestModal } from './modals/ServiceRequestModal';
import { ProviderAssignmentModal } from './modals/ProviderAssignmentModal';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { useToast } from '../../../contexts/ToastContext';

export default function ServiceRequests() {
  const { showToast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [modalState, setModalState] = useState<'none' | 'create' | 'edit' | 'assign' | 'reject'>('none');

  const handleCreate = () => {
    showToast({ title: 'Success', description: 'Service request created successfully', type: 'success' });
    setModalState('none');
  };

  const handleAssign = () => {
    showToast({ title: 'Success', description: 'Provider assigned to request', type: 'success' });
    setModalState('none');
    setSelectedRequest(null);
  };

  const handleReject = () => {
    showToast({ title: 'Success', description: 'Request rejected', type: 'success' });
    setModalState('none');
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <DataTableToolbar searchPlaceholder="Search requests..." onFilter={() => {}} />
        <GoldButton className="flex items-center gap-2" onClick={() => setModalState('create')}>
          <Wrench className="h-4 w-4" /> Create Request
        </GoldButton>
      </div>

      <div className="bg-navy-800/50 rounded-2xl border border-white/10 p-6">
        <DataTable
          columns={[
            { header: 'ID', render: (req) => req.id },
            { header: 'Customer', render: (req) => req.customerName },
            { header: 'Category', render: (req) => req.category },
            { header: 'Priority', render: (req) => req.priority },
            { header: 'Status', render: (req) => <EnterpriseStatusBadge status={req.status} /> },
            { header: 'Actions', render: (req) => (
              <GhostButton size="sm" onClick={() => setSelectedRequest(req)}>View Details</GhostButton>
            )}
          ]}
          keyExtractor={(req) => req.id}
          data={serviceRequests}
        />
      </div>

      <EnterpriseDetailDrawer
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="Request Details"
      >
        {selectedRequest && (
          <div className="space-y-6 text-cream">
            <div>
              <p className="text-sm text-ink/60">Request ID</p>
              <p className="font-medium">{selectedRequest.id}</p>
            </div>
            <div>
              <p className="text-sm text-ink/60">Customer</p>
              <p className="font-medium">{selectedRequest.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-ink/60">Description</p>
              <p className="font-medium">{selectedRequest.description}</p>
            </div>
            <div>
              <p className="text-sm text-ink/60">Location</p>
              <p className="font-medium">{selectedRequest.location}</p>
            </div>
            <div>
              <p className="text-sm text-ink/60">Priority</p>
              <p className="font-medium">{selectedRequest.priority}</p>
            </div>
            <div>
              <p className="text-sm text-ink/60">Status</p>
              <EnterpriseStatusBadge status={selectedRequest.status} />
            </div>

            <div className="flex gap-3 pt-6 border-t border-white/10">
              <GoldButton onClick={() => setModalState('assign')} className="flex-1">Assign Provider</GoldButton>
              <GhostButton onClick={() => setModalState('reject')} className="flex-1 text-red-400 hover:text-red-300">Reject Request</GhostButton>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <ServiceRequestModal
        isOpen={modalState === 'create' || modalState === 'edit'}
        onClose={() => setModalState('none')}
        onSubmit={handleCreate}
        initialData={modalState === 'edit' ? selectedRequest : undefined}
      />
      
      <ProviderAssignmentModal
        isOpen={modalState === 'assign'}
        onClose={() => setModalState('none')}
        onSubmit={handleAssign}
        requestCategory={selectedRequest?.category}
      />

      <ConfirmationModal
        isOpen={modalState === 'reject'}
        onClose={() => setModalState('none')}
        onConfirm={handleReject}
        title="Reject Service Request"
        message="Are you sure you want to reject this request? This action cannot be undone."
        confirmText="Reject"
        isDestructive={true}
      />
    </div>
  );
}
