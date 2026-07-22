import { useState } from 'react';
import { Banknote } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge, EnterpriseExportMenu, EnterpriseDetailDrawer } from '../../../components/enterprise';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../contexts/ToastContext';

interface OwnerPaymentItem {
  id: string;
  owner: string;
  property: string;
  amount: string;
  period: string;
  status: string;
  date: string;
}

export default function OwnerPayments() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedPay, setSelectedPay] = useState<OwnerPaymentItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const handleRowClick = (pay: OwnerPaymentItem) => {
    setSelectedPay(pay);
    setIsDrawerOpen(true);
  };

  const payments = [
    { id: 'PAY-OW-102', owner: 'Chief Adebayo', property: 'Lekki Phase 1 Apt', amount: '₦120,000,000', period: 'Sep 2026', status: 'Cleared', date: 'Oct 05, 2026' },
    { id: 'PAY-OW-103', owner: 'Ngozi Okafor', property: 'Abuja Central Plaza', amount: '₦45,000,000', period: 'Sep 2026', status: 'Processing', date: 'Oct 06, 2026' },
    { id: 'PAY-OW-104', owner: 'David Smith', property: 'Victoria Island Villa', amount: '₦210,000,000', period: 'Sep 2026', status: 'Cleared', date: 'Oct 05, 2026' },
    { id: 'PAY-OW-105', owner: 'Amina Bello', property: 'Maitama Estate', amount: '₦85,000,000', period: 'Oct 2026', status: 'Pending', date: 'Nov 01, 2026' },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Owner Payouts</h2>
          <p className="text-sm text-ink/60">Manage disbursements to property owners after platform fee deductions.</p>
        </div>
        <div className="flex gap-3">
          <EnterpriseExportMenu onExport={(f) => handleAction(`Export as ${f.toUpperCase()}`)} />
          <GoldButton onClick={() => setIsBatchModalOpen(true)}>Process Batch Payout</GoldButton>
        </div>
      </div>

      <div className="space-y-4">
        <DataTableToolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by owner or property..."
          showFilter
          onFilter={() => handleAction('Filter Payouts')}
        />

        <DataTable
          data={payments.filter(p => p.owner.toLowerCase().includes(search.toLowerCase()) || p.property.toLowerCase().includes(search.toLowerCase()))}
          keyExtractor={(pay) => pay.id}
          onRowClick={handleRowClick}
          columns={[
            {
              header: "Payment ID",
              render: (pay) => <span className="font-medium text-cream">{pay.id}</span>
            },
            {
              header: "Owner Name",
              render: (pay) => (
                <div className="font-semibold text-cream flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-ink/40" /> {pay.owner}
                </div>
              )
            },
            {
              header: "Property",
              render: (pay) => <span className="text-ink/60">{pay.property}</span>
            },
            {
              header: "Period",
              render: (pay) => <span className="text-ink/60">{pay.period}</span>
            },
            {
              header: "Status",
              render: (pay) => <EnterpriseStatusBadge status={pay.status} />
            },
            {
              header: <div className="text-right">Amount</div>,
              className: "text-right font-bold text-gold-400",
              render: (pay) => pay.amount
            }
          ]}
        />
      </div>

      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Payout Details"
        subtitle={selectedPay?.id}
        footerActions={
          <>
            <GhostButton onClick={() => handleAction('Download Statement')}>Download Statement</GhostButton>
            {selectedPay?.status === 'Pending' && (
              <GoldButton onClick={() => handleAction('Approve Payout')}>Approve Payout</GoldButton>
            )}
          </>
        }
      >
        {selectedPay && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Status</span>
              <EnterpriseStatusBadge status={selectedPay.status} />
            </div>
            
            <div className="space-y-4 rounded-xl border border-white/10 bg-navy-900/50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Date Scheduled</span>
                <span className="text-sm font-medium text-cream">{selectedPay.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Period</span>
                <span className="text-sm font-medium text-cream">{selectedPay.period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Owner</span>
                <span className="text-sm font-medium text-cream">{selectedPay.owner}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Property</span>
                <span className="text-sm font-medium text-cream">{selectedPay.property}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-4 mt-4">
                <span className="text-sm font-bold text-cream">Net Payout Amount</span>
                <span className="text-lg font-bold text-gold-400">{selectedPay.amount}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-cream">Breakdown</h4>
              <div className="rounded-xl border border-white/5 bg-white/5 p-4 space-y-3">
                 <div className="flex justify-between text-sm">
                   <span className="text-ink/60">Gross Rent Collected</span>
                   <span className="text-cream font-medium">₦133,333,333</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-ink/60">Platform Fee (10%)</span>
                   <span className="text-rose-400 font-medium">-₦13,333,333</span>
                 </div>
              </div>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <Modal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        title="Process Batch Payouts"
        actionButton={
          <GoldButton onClick={() => { handleAction('Process Batch'); setIsBatchModalOpen(false); }}>
            Process All
          </GoldButton>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-ink/60">
            You are about to process all pending owner payouts for the current period.
          </p>
          <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-ink/60">Total Pending Payouts</span>
              <span className="font-semibold text-cream">12</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t border-white/10 pt-2">
              <span className="text-cream">Total Amount</span>
              <span className="text-gold-400">₦450,000,000</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
