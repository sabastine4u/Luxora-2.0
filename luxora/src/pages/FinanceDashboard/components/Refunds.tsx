import { useState } from 'react';
import { AlertTriangle, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge, EnterpriseDetailDrawer } from '../../../components/enterprise';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../contexts/ToastContext';

interface RefundItem {
  id: string;
  buyer: string;
  property: string;
  amount: string;
  reason: string;
  status: string;
  date: string;
}

export default function Refunds() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedRef, setSelectedRef] = useState<RefundItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | null>(null);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const handleConfirmAction = () => {
    if (actionType) {
      handleAction(`${actionType} Refund`);
    }
    setIsConfirmModalOpen(false);
    setIsDrawerOpen(false);
  };

  const refunds = [
    { id: 'REF-0881', buyer: 'Musa Ibrahim', property: 'Abuja Central Office', amount: '₦5,000,000', reason: 'Failed Inspection', status: 'Pending Review', date: 'Oct 04, 2026' },
    { id: 'REF-0882', buyer: 'Sarah Jenkins', property: 'Lekki Studio Apt', amount: '₦150,000', reason: 'Booking Cancelled (Within 24h)', status: 'Processed', date: 'Oct 01, 2026' },
    { id: 'REF-0883', buyer: 'John Doe', property: 'Victoria Island Villa', amount: '₦10,000,000', reason: 'Mortgage Declined', status: 'Rejected', date: 'Sep 25, 2026' },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Disputes & Refunds</h2>
          <p className="text-sm text-ink/60">Review, approve, or reject buyer refund requests.</p>
        </div>
      </div>

      <div className="space-y-4">
        <DataTableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by buyer or property..."
          showFilter
          onFilter={() => handleAction('Filter Refunds')}
        />

        <DataTable
          data={refunds.filter(r => r.buyer.toLowerCase().includes(search.toLowerCase()) || r.property.toLowerCase().includes(search.toLowerCase()))}
          keyExtractor={(ref) => ref.id}
          onRowClick={(ref: RefundItem) => { setSelectedRef(ref); setIsDrawerOpen(true); }}
          columns={[
            {
              header: "Ref ID",
              render: (ref) => <span className="font-medium text-cream">{ref.id}</span>
            },
            {
              header: "Buyer Name",
              render: (ref) => (
                <div className="font-semibold text-cream flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-ink/40" /> {ref.buyer}
                </div>
              )
            },
            {
              header: "Property",
              render: (ref) => <span className="text-ink/60">{ref.property}</span>
            },
            {
              header: "Reason",
              render: (ref) => <span className="text-ink/60">{ref.reason}</span>
            },
            {
              header: "Status",
              render: (ref) => (
                ref.status === 'Pending Review' ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase text-yellow-400">
                    <AlertTriangle className="h-3 w-3" /> {ref.status}
                  </span>
                ) : (
                  <EnterpriseStatusBadge status={ref.status} />
                )
              )
            },
            {
              header: <div className="text-right">Amount</div>,
              className: "text-right font-bold text-rose-400",
              render: (ref) => ref.amount
            }
          ]}
        />
      </div>

      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Refund Request Details"
        subtitle={selectedRef?.id}
        footerActions={
          selectedRef?.status === 'Pending Review' ? (
            <>
              <GhostButton 
                onClick={() => { setActionType('Reject'); setIsConfirmModalOpen(true); }}
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 border-rose-400/20"
              >
                <XCircle className="h-4 w-4 mr-2" /> Reject
              </GhostButton>
              <GoldButton 
                onClick={() => { setActionType('Approve'); setIsConfirmModalOpen(true); }}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" /> Approve Refund
              </GoldButton>
            </>
          ) : (
            <GhostButton onClick={() => handleAction('Download Audit Trail')}>Download Audit Trail</GhostButton>
          )
        }
      >
        {selectedRef && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Status</span>
              <EnterpriseStatusBadge status={selectedRef.status} />
            </div>
            
            <div className="space-y-4 rounded-xl border border-white/10 bg-navy-900/50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Requested Date</span>
                <span className="text-sm font-medium text-cream">{selectedRef.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Buyer Name</span>
                <span className="text-sm font-medium text-cream">{selectedRef.buyer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Property</span>
                <span className="text-sm font-medium text-cream">{selectedRef.property}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Reason</span>
                <span className="text-sm font-medium text-cream">{selectedRef.reason}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-4 mt-4">
                <span className="text-sm font-bold text-cream">Refund Amount</span>
                <span className="text-lg font-bold text-rose-400">{selectedRef.amount}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-cream">Supporting Documents</h4>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-navy-900/50 p-3 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => handleAction('View Document')}>
                 <MessageSquare className="h-4 w-4 text-ink/40" />
                 <span className="text-sm text-cream flex-1">inspection_report_failed.pdf</span>
                 <span className="text-xs text-ink/40">1.2 MB</span>
              </div>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title={`${actionType} Refund`}
        actionButton={
          <GoldButton onClick={handleConfirmAction}>
            Confirm {actionType}
          </GoldButton>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-ink/60">
            You are about to {actionType?.toLowerCase()} the refund request for <strong>{selectedRef?.amount}</strong>.
            This action will notify the buyer and update the ledger.
          </p>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Internal Notes (Optional)</label>
            <textarea 
              placeholder="Add internal notes for the audit log..."
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-3 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50 min-h-[100px] resize-none"
            ></textarea>
          </div>
        </div>
      </Modal>
    </div>
  );
}
