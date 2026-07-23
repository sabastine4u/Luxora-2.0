import { useState } from 'react';
import { Wrench, Plus } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { useToast } from '../../../contexts/ToastContext';
import type { MaintenanceRequest } from '../../../types/propertyManager';
import { MaintenanceRequestModal } from './modals/MaintenanceRequestModal';
import { VendorSelectionModal } from './modals/VendorSelectionModal';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
export default function Maintenance() {
  const requests: MaintenanceRequest[] = [
    { id: 'MNT-102', title: 'Leaking AC Unit', propertyId: 'Lekki Phase 1 Apt', tenantId: 'Sarah Jenkins', priority: 'High', status: 'In Progress', createdAt: 'Oct 05, 2025', unit: 'Apt 4B' },
    { id: 'MNT-103', title: 'Broken Door Hinge', propertyId: 'Victoria Island Villa', tenantId: 'Dr. Ayo Balogun', priority: 'Low', status: 'Open', createdAt: 'Oct 06, 2025', unit: 'Entire House' },
    { id: 'MNT-104', title: 'Water Heater Malfunction', propertyId: 'Abuja Central Office', tenantId: 'TechFlow Ltd', priority: 'Emergency', status: 'Resolved', createdAt: 'Oct 02, 2025', unit: 'Floor 3' },
  ];

  const { showToast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [modalState, setModalState] = useState<'create' | 'vendor' | 'status' | 'vendorBulk' | null>(null);

  const handleAction = (action: string) => {
    showToast({
      title: 'Backend Integration',
      description: `Action "${action}" is ready for backend integration.`,
      type: 'info'
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <DataTableToolbar 
          searchPlaceholder="Search work orders..."
          onFilter={() => console.log('Filter')}
        />
        <GoldButton className="flex items-center gap-2" onClick={() => setModalState('create')}><Plus className="h-4 w-4" /> Create Ticket</GoldButton>
      </div>

      <DataTableToolbar
        searchPlaceholder="Search tickets..."
        actions={
          <div className="flex gap-2">
            <GhostButton className="px-4" onClick={() => setModalState('vendorBulk')}>Assign Vendor</GhostButton>
          </div>
        }
      />

      <DataTable
        data={requests}
        keyExtractor={(req) => req.id}
        columns={[
          {
            header: "Ticket ID",
            render: (req) => <span className="font-medium text-cream">{req.id}</span>
          },
          {
            header: "Issue",
            render: (req) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <Wrench className="h-4 w-4 text-ink/40" /> {req.title}
              </div>
            )
          },
          {
            header: "Property & Tenant",
            render: (req) => (
              <div>
                <div className="font-medium text-cream">{req.propertyId}</div>
                <div className="text-xs text-ink/60">{req.tenantId}</div>
              </div>
            )
          },
          {
            header: "Date Logged",
            render: (req) => <span className="text-ink/60">{req.createdAt}</span>
          },
          {
            header: "Priority",
            render: (req) => <EnterpriseStatusBadge status={req.priority} />
          },
          {
            header: "Status",
            render: (req) => <EnterpriseStatusBadge status={req.status} />
          }
        ]}
        onRowClick={(req) => setSelectedRequest(req)}
      />

      <EnterpriseDetailDrawer
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="Maintenance Details"
      >
        {selectedRequest && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-navy-800/50 border border-white/10 space-y-4">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-cream">{selectedRequest.title}</h3>
                    <div className="text-xs text-ink/60">{selectedRequest.id}</div>
                  </div>
                </div>
                <EnterpriseStatusBadge status={selectedRequest.status} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-ink/60 mb-1">Property & Unit</div>
                  <div className="font-medium text-cream">{selectedRequest.propertyId}</div>
                  <div className="text-xs text-ink/40">{selectedRequest.unit}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60 mb-1">Tenant</div>
                  <div className="font-medium text-cream">{selectedRequest.tenantId}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60 mb-1">Priority</div>
                  <EnterpriseStatusBadge status={selectedRequest.priority} />
                </div>
                <div>
                  <div className="text-xs text-ink/60 mb-1">Logged Date</div>
                  <div className="font-medium text-cream">{selectedRequest.createdAt}</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-cream mb-2">Description</h4>
              <p className="text-sm text-ink/80 leading-relaxed">
                Mock description for maintenance ticket {selectedRequest.id}. 
                During backend integration, this will display the full issue description, photos, and tenant notes.
              </p>
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <GoldButton className="flex-1" onClick={() => { setModalState('vendor'); }}>
                Assign Vendor
              </GoldButton>
              <GhostButton onClick={() => { setModalState('status'); }}>
                Update Status
              </GhostButton>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <MaintenanceRequestModal 
        isOpen={modalState === 'create'}
        onClose={() => setModalState(null)}
        onSubmit={(data) => handleAction(`Create Maintenance Ticket for ${data.propertyId}`)}
      />

      <VendorSelectionModal 
        isOpen={modalState === 'vendor' || modalState === 'vendorBulk'}
        onClose={() => setModalState(null)}
        onSubmit={(data) => {
          if (modalState === 'vendorBulk') handleAction(`Bulk Assign Vendor ${data.vendorId}`);
          else handleAction(`Assign Vendor ${data.vendorId} to ${selectedRequest?.id}`);
          setSelectedRequest(null);
        }}
      />

      <ConfirmationModal 
        isOpen={modalState === 'status'}
        onClose={() => setModalState(null)}
        title="Update Status"
        description={`Update the status of ticket ${selectedRequest?.id} to Resolved?`}
        onConfirm={() => { handleAction(`Update Status to Resolved`); setSelectedRequest(null); }}
      />
    </div>
  );
}
