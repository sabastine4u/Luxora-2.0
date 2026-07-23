import { useState } from 'react';
import { Banknote, Plus } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import type { Payment } from '../../../types/propertyManager';
import { PaymentModal } from './modals/PaymentModal';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { useToast } from '../../../contexts/ToastContext';
export default function RentCollection() {
  const rents: Payment[] = [
    { id: 'INV-2025-001', tenantId: 'Dr. Ayo Balogun', propertyId: 'Victoria Island Villa', amount: 1500000, date: 'Oct 01, 2025', status: 'Paid', method: 'Bank Transfer' },
    { id: 'INV-2025-002', tenantId: 'Sarah Jenkins', propertyId: 'Lekki Studio Apt', amount: 350000, date: 'Oct 05, 2025', status: 'Pending', method: 'Card' },
    { id: 'INV-2025-003', tenantId: 'TechFlow Ltd', propertyId: 'Abuja Central Office', amount: 4500000, date: 'Sep 28, 2025', status: 'Overdue', method: 'Bank Transfer' },
  ];

  const { showToast } = useToast();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [modalState, setModalState] = useState<'log' | 'remind' | 'receipt' | 'status' | null>(null);

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
          <h2 className="font-heading text-2xl font-bold text-cream">Rent Collection</h2>
          <p className="text-sm text-ink/60">Track payments, overdue rent, and upcoming dues.</p>
        </div>
        <div className="flex gap-3">
          <GhostButton onClick={() => setModalState('remind')}>Send Reminders</GhostButton>
          <GoldButton className="flex items-center gap-2" onClick={() => setModalState('log')}><Plus className="h-4 w-4" /> Log Payment</GoldButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Total Collected (This Month)</div>
           <div className="font-heading text-3xl font-bold text-emerald-400">₦62.4M</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Outstanding / Overdue</div>
           <div className="font-heading text-3xl font-bold text-rose-400">₦8.5M</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Upcoming (Next 30 Days)</div>
           <div className="font-heading text-3xl font-bold text-cream">₦145.0M</div>
        </div>
      </div>

      <DataTableToolbar
        searchPlaceholder="Search by tenant or property..."
        showExport
        onExport={() => handleAction('Export Rent Data')}
      />

      <DataTable
        data={rents}
        keyExtractor={(rent) => rent.id}
        columns={[
          {
            header: "Tenant Name",
            render: (rent) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <Banknote className="h-4 w-4 text-ink/40" /> {rent.tenantId}
              </div>
            )
          },
          {
            header: "Property",
            render: (rent) => <span className="text-ink/60">{rent.propertyId}</span>
          },
          {
            header: "Amount Due",
            render: (rent) => <span className="font-bold text-gold-400">₦{rent.amount.toLocaleString()}</span>
          },
          {
            header: "Due Date",
            render: (rent) => <span className="text-ink/60">{rent.date}</span>
          },
          {
            header: "Status",
            render: (rent) => <EnterpriseStatusBadge status={rent.status} />
          }
        ]}
        onRowClick={(payment) => setSelectedPayment(payment)}
      />

      <EnterpriseDetailDrawer
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        title="Payment Details"
      >
        {selectedPayment && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-navy-800/50 border border-white/10 space-y-4">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400">
                    <Banknote className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-cream">₦{selectedPayment.amount.toLocaleString()}</h3>
                    <div className="text-xs text-ink/60">Payment ID: {selectedPayment.id}</div>
                  </div>
                </div>
                <EnterpriseStatusBadge status={selectedPayment.status} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-ink/60 mb-1">Tenant ID</div>
                  <div className="font-medium text-cream">{selectedPayment.tenantId}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60 mb-1">Property</div>
                  <div className="font-medium text-cream">{selectedPayment.propertyId}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60 mb-1">Due Date</div>
                  <div className="font-medium text-cream">{selectedPayment.date}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60 mb-1">Payment Date</div>
                  <div className="font-medium text-cream">{selectedPayment.date}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60 mb-1">Payment Method</div>
                  <div className="font-medium text-cream">{selectedPayment.method}</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <GoldButton className="flex-1" onClick={() => { setModalState('receipt'); }}>
                Resend Receipt
              </GoldButton>
              <GhostButton onClick={() => { setModalState('status'); }}>
                Update Status
              </GhostButton>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <PaymentModal 
        isOpen={modalState === 'log'}
        onClose={() => setModalState(null)}
        onSubmit={(data) => {
          handleAction(`Log Payment of ${data.amount} for ${data.tenantId}`);
        }}
      />

      <ConfirmationModal 
        isOpen={modalState === 'remind'}
        onClose={() => setModalState(null)}
        title="Send Payment Reminders"
        description="This will send automated email and SMS reminders to all tenants with overdue payments. Do you want to proceed?"
        onConfirm={() => handleAction('Send Reminders to Overdue Tenants')}
      />

      <ConfirmationModal 
        isOpen={modalState === 'receipt'}
        onClose={() => setModalState(null)}
        title="Resend Receipt"
        description={`Are you sure you want to resend the payment receipt to ${selectedPayment?.tenantId}?`}
        onConfirm={() => { handleAction(`Resend Receipt for ${selectedPayment?.id}`); setSelectedPayment(null); }}
      />

      <ConfirmationModal 
        isOpen={modalState === 'status'}
        onClose={() => setModalState(null)}
        title="Update Payment Status"
        description={`Mark payment ${selectedPayment?.id} as cleared?`}
        onConfirm={() => { handleAction(`Update Payment Status to Cleared`); setSelectedPayment(null); }}
      />
    </div>
  );
}
