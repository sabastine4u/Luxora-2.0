import { useState } from 'react';
import { Clock, FileText } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { LeaseActionModal } from './modals/LeaseActionModal';
import { ConfirmationModal } from './modals/ConfirmationModal';
import { useToast } from '../../../contexts/ToastContext';
import type { Lease } from '../../../types';
export default function LeaseTracking() {
  const leases: Lease[] = [
    { id: 'LSE-001', tenantId: 'Dr. Ayo Balogun', propertyId: 'Victoria Island Villa', startDate: 'Jan 01, 2025', endDate: 'Dec 31, 2026', status: 'Active', unit: 'Entire House', monthlyRent: 1500000, deposit: 3000000 },
    { id: 'LSE-002', tenantId: 'Sarah Jenkins', propertyId: 'Lekki Studio Apt', startDate: 'Dec 01, 2024', endDate: 'Nov 30, 2025', status: 'Expiring Soon', unit: 'Apt 4B', monthlyRent: 350000, deposit: 700000 },
    { id: 'LSE-003', tenantId: 'TechFlow Ltd', propertyId: 'Abuja Central Office', startDate: 'Feb 01, 2023', endDate: 'Jan 31, 2028', status: 'Active', unit: 'Floor 3', monthlyRent: 4500000, deposit: 9000000 },
  ];

  const { showToast } = useToast();
  const [selectedLease, setSelectedLease] = useState<Lease | null>(null);
  const [modalState, setModalState] = useState<'renew' | 'terminate' | 'renewBulk' | null>(null);

  const handleAction = (action: string) => {
    showToast({
      title: 'Backend Integration',
      description: `Action "${action}" is ready for backend integration.`,
      type: 'info'
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Lease Renewals & Tracking</h2>
          <p className="text-sm text-ink/60">Monitor upcoming lease expirations to minimize vacancy periods.</p>
        </div>
      </div>

      <DataTableToolbar
        searchPlaceholder="Search leases..."
        actions={
          <div className="flex gap-2">
            <GhostButton className="px-4" onClick={() => setModalState('renewBulk')}><Clock className="h-4 w-4 mr-2" /> Send Renewal Offer</GhostButton>
          </div>
        }
      />

      <DataTable
        data={leases}
        keyExtractor={(lease) => lease.id}
        columns={[
          {
            header: "Lease ID",
            render: (lease) => <span className="font-medium text-cream">{lease.id}</span>
          },
          {
            header: "Tenant Name",
            render: (lease) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <FileText className="h-4 w-4 text-ink/40" /> {lease.tenantId}
              </div>
            )
          },
          {
            header: "Property",
            render: (lease) => <span className="text-ink/60">{lease.propertyId}</span>
          },
          {
            header: "Start Date",
            render: (lease) => <span className="text-ink/60">{lease.startDate}</span>
          },
          {
            header: "End Date",
            render: (lease) => <span className="text-ink/60 font-medium">{lease.endDate}</span>
          },
          {
            header: "Status",
            render: (lease) => <EnterpriseStatusBadge status={lease.status} />
          }
        ]}
        onRowClick={(lease) => setSelectedLease(lease)}
      />

      <EnterpriseDetailDrawer
        isOpen={!!selectedLease}
        onClose={() => setSelectedLease(null)}
        title="Lease Details"
      >
        {selectedLease && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-navy-800/50 border border-white/10 space-y-4">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-cream">{selectedLease.tenantId}</h3>
                    <div className="text-xs text-ink/60">{selectedLease.id}</div>
                  </div>
                </div>
                <EnterpriseStatusBadge status={selectedLease.status} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-ink/60 mb-1">Property & Unit</div>
                  <div className="font-medium text-cream">{selectedLease.propertyId}</div>
                  <div className="text-xs text-ink/40">{selectedLease.unit}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60 mb-1">Monthly Rent</div>
                  <div className="font-medium text-cream">₦{selectedLease.monthlyRent.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60 mb-1">Start Date</div>
                  <div className="font-medium text-cream">{selectedLease.startDate}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60 mb-1">End Date</div>
                  <div className="font-medium text-cream">{selectedLease.endDate}</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <GoldButton className="flex-1" onClick={() => { setModalState('renew'); }}>
                Renew Lease
              </GoldButton>
              <GhostButton onClick={() => { setModalState('terminate'); }}>
                Terminate Lease
              </GhostButton>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <LeaseActionModal 
        isOpen={modalState === 'renew' || modalState === 'terminate'}
        onClose={() => setModalState(null)}
        action={modalState === 'renew' ? 'Renew' : 'Terminate'}
        tenantName={selectedLease?.tenantId}
        onSubmit={(data) => {
          handleAction(`${data.action} Lease for ${selectedLease?.tenantId}`);
          setSelectedLease(null);
        }}
      />

      <ConfirmationModal 
        isOpen={modalState === 'renewBulk'}
        onClose={() => setModalState(null)}
        title="Send Renewal Offers"
        description="Are you sure you want to send renewal offers to all tenants with expiring leases?"
        onConfirm={() => handleAction('Send Renewal Offers in Bulk')}
      />
    </div>
  );
}
