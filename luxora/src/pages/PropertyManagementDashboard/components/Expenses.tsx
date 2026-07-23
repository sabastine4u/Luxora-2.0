import { useState } from 'react';
import { Plus, TrendingDown, Wallet } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { useToast } from '../../../contexts/ToastContext';
import type { Expense } from '../../../types';
// import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { ExpenseFormModal } from './modals/ExpenseFormModal';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';



export default function Expenses() {
  const expenses: Expense[] = [
    { id: 'EXP-801', category: 'Maintenance', vendor: 'FixIt Pros', propertyId: 'Victoria Island Villa', amount: 450000, date: 'Oct 12, 2025' },
    { id: 'EXP-802', category: 'Utilities', vendor: 'EKEDC', propertyId: 'Lekki Studio Apt', amount: 25000, date: 'Oct 10, 2025' },
    { id: 'EXP-803', category: 'Insurance', vendor: 'Leadway Assurance', propertyId: 'Abuja Central Office', amount: 1200000, date: 'Oct 01, 2025' },
  ];


  const [modalState, setModalState] = useState<'log' | 'approve' | null>(null);

  const { showToast } = useToast();

  const handleAction = (action: string) => {
    showToast({
      title: 'Backend Integration',
      description: `Action "${action}" is ready for backend integration.`,
      type: 'info'
    });
    setModalState(null);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Operating Expenses</h2>
          <p className="text-sm text-ink/60">Log and track property-related outgoings.</p>
        </div>
        <div className="flex gap-3">
           <GhostButton onClick={() => setModalState('approve')}>Approve Pending</GhostButton>
           <GoldButton className="flex items-center gap-2" onClick={() => setModalState('log')}><Plus className="h-4 w-4" /> Log Expense</GoldButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Total Expenses (MTD)</div>
           <div className="font-heading text-3xl font-bold text-rose-400">₦2.4M</div>
           <div className="text-xs text-rose-400 mt-2 flex items-center gap-1"><TrendingDown className="h-3 w-3" /> +5% vs Last Month</div>
        </div>
      </div>

      <DataTable
        data={expenses}
        keyExtractor={(exp) => exp.id}
        columns={[
          {
            header: "Category",
            render: (exp) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <Wallet className="h-4 w-4 text-ink/40" /> {exp.category}
              </div>
            )
          },
          {
            header: "Vendor",
            render: (exp) => <span className="text-ink/60">{exp.vendor}</span>
          },
          {
            header: "Property",
            render: (exp) => <span className="text-ink/60">{exp.propertyId}</span>
          },
          {
            header: "Amount",
            render: (exp) => <span className="font-bold text-cream">₦{exp.amount.toLocaleString()}</span>
          },
          {
            header: "Date",
            render: (exp) => <span className="text-ink/60">{exp.date}</span>
          },
          {
            header: "Status",
            render: () => <EnterpriseStatusBadge status={'Paid'} />
          }
        ]}
      />
      <ExpenseFormModal 
        isOpen={modalState === 'log'}
        onClose={() => setModalState(null)}
        onSubmit={(data) => handleAction(`Log Expense for ${data.propertyId}: ₦${data.amount}`)}
      />

      <ConfirmationModal 
        isOpen={modalState === 'approve'}
        onClose={() => setModalState(null)}
        title="Approve Pending Expenses"
        description="Are you sure you want to approve all pending expenses? This action will mark them as ready for payment processing."
        onConfirm={() => handleAction('Approve All Pending Expenses')}
      />
    </div>
  );
}
