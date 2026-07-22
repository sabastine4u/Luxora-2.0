import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, RefreshCcw } from 'lucide-react';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge, EnterpriseExportMenu, EnterpriseDetailDrawer } from '../../../components/enterprise';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { useToast } from '../../../contexts/ToastContext';
import { Modal } from '../../../components/ui/Modal';

interface TransactionItem {
  id: string;
  type: string;
  property: string;
  amount: string;
  status: string;
  date: string;
  inflow: boolean;
  ref: string;
}

export default function Transactions() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxn, setSelectedTxn] = useState<TransactionItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isReverseModalOpen, setIsReverseModalOpen] = useState(false);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const handleRowClick = (txn: TransactionItem) => {
    setSelectedTxn(txn);
    setIsDrawerOpen(true);
  };

  const handleReverseConfirm = () => {
    handleAction('Reverse Transaction');
    setIsReverseModalOpen(false);
    setIsDrawerOpen(false);
  };

  const transactions = [
    { id: 'TXN-001', type: 'Platform Fee', property: 'Victoria Island Villa', amount: '+₦4,500,000', status: 'Completed', date: 'Oct 05, 2026 14:30', inflow: true, ref: 'REF-89234' },
    { id: 'TXN-002', type: 'Owner Payout', property: 'Lekki Phase 1 Apt', amount: '-₦120,000,000', status: 'Completed', date: 'Oct 05, 2026 09:15', inflow: false, ref: 'REF-89235' },
    { id: 'TXN-003', type: 'Refund', property: 'Abuja Central Office', amount: '-₦5,000,000', status: 'Pending', date: 'Oct 04, 2026 16:45', inflow: false, ref: 'REF-89236' },
    { id: 'TXN-004', type: 'Subscription', property: 'Premium Agency Tier', amount: '+₦150,000', status: 'Completed', date: 'Oct 04, 2026 11:20', inflow: true, ref: 'REF-89237' },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Transaction Ledger</h2>
          <p className="text-sm text-ink/60">Comprehensive log of all financial movements on the platform.</p>
        </div>
        <div className="flex gap-3">
          <EnterpriseExportMenu onExport={(format) => handleAction(`Export Ledger as ${format.toUpperCase()}`)} />
        </div>
      </div>

      <div className="space-y-4">
        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by TXN ID or Property..."
          showFilter
          onFilter={() => handleAction('Filter Transactions')}
        />

        <DataTable
          data={transactions.filter(t => t.id.toLowerCase().includes(searchQuery.toLowerCase()) || t.property.toLowerCase().includes(searchQuery.toLowerCase()))}
          keyExtractor={(txn) => txn.id}
          onRowClick={handleRowClick}
          columns={[
            {
              header: "Txn ID",
              render: (txn) => <span className="font-medium text-cream">{txn.id}</span>
            },
            {
              header: "Type",
              render: (txn) => <span className="text-ink/60">{txn.type}</span>
            },
            {
              header: "Reference",
              render: (txn) => <span className="text-ink/60">{txn.property}</span>
            },
            {
              header: "Date & Time",
              render: (txn) => <span className="text-ink/60">{txn.date}</span>
            },
            {
              header: "Status",
              render: (txn) => <EnterpriseStatusBadge status={txn.status} />
            },
            {
              header: <div className="text-right">Amount</div>,
              className: "text-right font-bold",
              render: (txn) => (
                <div className={`flex items-center justify-end gap-1 ${txn.inflow ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {txn.inflow ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {txn.amount}
                </div>
              )
            }
          ]}
        />
      </div>

      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Transaction Details"
        subtitle={selectedTxn?.id}
        footerActions={
          <>
            <GhostButton onClick={() => handleAction('Download Receipt')}>Download Receipt</GhostButton>
            {selectedTxn?.status === 'Completed' && (
              <GhostButton 
                onClick={() => setIsReverseModalOpen(true)}
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 border-rose-400/20"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Reverse Transaction
              </GhostButton>
            )}
          </>
        }
      >
        {selectedTxn && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Status</span>
              <EnterpriseStatusBadge status={selectedTxn.status} />
            </div>
            
            <div className="space-y-4 rounded-xl border border-white/10 bg-navy-900/50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Date & Time</span>
                <span className="text-sm font-medium text-cream">{selectedTxn.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Type</span>
                <span className="text-sm font-medium text-cream">{selectedTxn.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Property/Reference</span>
                <span className="text-sm font-medium text-cream text-right ml-4">{selectedTxn.property}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Payment Ref</span>
                <span className="text-sm font-medium text-cream">{selectedTxn.ref}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-4 mt-4">
                <span className="text-sm font-bold text-cream">Amount</span>
                <div className={`text-lg font-bold flex items-center gap-1 ${selectedTxn.inflow ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedTxn.inflow ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {selectedTxn.amount}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-cream">Audit Trail</h4>
              <p className="text-xs text-ink/60">
                Processed by System automatically at {selectedTxn.date}. Ledger successfully updated.
              </p>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <Modal
        isOpen={isReverseModalOpen}
        onClose={() => setIsReverseModalOpen(false)}
        title="Reverse Transaction"
        actionButton={
          <GoldButton onClick={handleReverseConfirm}>Confirm Reversal</GoldButton>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-ink/60">
            Are you sure you want to reverse transaction <strong>{selectedTxn?.id}</strong>? 
            This action will create a new offsetting transaction and notify the affected parties.
          </p>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Reason for Reversal</label>
            <textarea 
              placeholder="Provide a reason..."
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 px-4 py-3 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50 min-h-[100px] resize-none"
            ></textarea>
          </div>
        </div>
      </Modal>
    </div>
  );
}
