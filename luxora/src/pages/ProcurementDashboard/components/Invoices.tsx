import { Download, FileBarChart, Filter, Eye, User, CreditCard } from 'lucide-react';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { useWorkflowToast } from '../utils/workflowUtils';

export default function Invoices() {
  const { showWorkflowToast } = useWorkflowToast();
  const invoices = [
    { id: 'INV-2025-099', vendor: 'Amazon Web Services', amount: '₦14,500,000', date: 'Oct 05, 2025', due: 'Oct 15, 2025', status: 'Unpaid' },
    { id: 'INV-2025-098', vendor: 'Global Tech Supplies', amount: '₦8,500,000', date: 'Sep 28, 2025', due: 'Oct 12, 2025', status: 'Processing' },
    { id: 'INV-2025-097', vendor: 'Office World', amount: '₦450,000', date: 'Sep 15, 2025', due: 'Sep 30, 2025', status: 'Paid' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Vendor Invoices</h2>
          <p className="text-sm text-ink/60">Manage accounts payable and invoice approvals.</p>
        </div>
      </div>

      <DataTableToolbar
        searchValue=""
        onSearchChange={() => {}}
        searchPlaceholder="Search invoices..."
        actions={
          <button className="flex items-center justify-center rounded-xl border border-white/10 bg-navy-900/80 px-4 text-sm text-cream hover:bg-white/5 transition-colors" onClick={() => showWorkflowToast('Filter Status')}>
            <Filter className="h-4 w-4 mr-2" /> Status
          </button>
        }
      />

      <DataTable
        data={invoices}
        keyExtractor={(inv) => inv.id}
        columns={[
          {
            header: "Invoice ID",
            render: (inv) => (
              <div className="font-medium text-cream flex items-center gap-2">
                <FileBarChart className="h-4 w-4 text-ink/40" /> {inv.id}
              </div>
            )
          },
          {
            header: "Vendor",
            render: (inv) => <span className="text-ink/60">{inv.vendor}</span>
          },
          {
            header: "Amount",
            render: (inv) => <span className="font-bold text-gold-400">{inv.amount}</span>
          },
          {
            header: "Date Issued",
            render: (inv) => <span className="text-ink/60">{inv.date}</span>
          },
          {
            header: "Due Date",
            render: (inv) => <span className={inv.status === 'Unpaid' ? 'text-rose-400 font-medium' : 'text-ink/60'}>{inv.due}</span>
          },
          {
            header: "Status",
            render: (inv) => (
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${inv.status === 'Paid' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : inv.status === 'Processing' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'text-rose-400 bg-rose-400/10 border-rose-400/20'}`}>
                {inv.status}
              </span>
            )
          },
          {
            header: <div className="text-right">Actions</div>,
            className: "text-right",
            render: () => (
              <div className="flex justify-end gap-2">
                <button 
                  className="text-blue-400 hover:bg-blue-400/10 p-2 rounded-lg transition-colors" 
                  onClick={() => showWorkflowToast('Invoice Details')}
                ><Eye className="h-4 w-4" /></button>
                <button 
                  className="text-emerald-400 hover:bg-emerald-400/10 p-2 rounded-lg transition-colors" 
                  onClick={() => showWorkflowToast('Vendor Info')}
                ><User className="h-4 w-4" /></button>
                <button 
                  className="text-emerald-400 hover:bg-emerald-400/10 p-2 rounded-lg transition-colors" 
                  onClick={() => showWorkflowToast('Payment Status')}
                ><CreditCard className="h-4 w-4" /></button>
                <button 
                  className="text-gold-400 hover:bg-gold-400/10 p-2 rounded-lg transition-colors" 
                  onClick={() => showWorkflowToast('Download Invoice')}
                ><Download className="h-4 w-4" /></button>
              </div>
            )
          }
        ]}
      />
    </div>
  );
}
