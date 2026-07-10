import { Wallet, ArrowUpRight, Filter } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

export default function Payments() {
  const transactions = [
    { id: 'TXN-9091', vendor: 'Amazon Web Services', method: 'Bank Transfer', amount: '₦14,500,000', status: 'Completed', date: 'Oct 02, 2025' },
    { id: 'TXN-9090', vendor: 'Office World', method: 'Corporate Card', amount: '₦450,000', status: 'Completed', date: 'Sep 30, 2025' },
    { id: 'TXN-9089', vendor: 'SecureNet Solutions', method: 'Bank Transfer', amount: '₦1,050,000', status: 'Failed', date: 'Sep 29, 2025' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Payment History</h2>
          <p className="text-sm text-ink/60">Record of outgoing payments to vendors and suppliers.</p>
        </div>
        <GoldButton className="flex items-center gap-2">Initiate Payment</GoldButton>
      </div>

      <DataTableToolbar
        searchValue=""
        onSearchChange={() => {}}
        searchPlaceholder="Search transactions..."
        actions={
          <button className="flex items-center justify-center rounded-xl border border-white/10 bg-navy-900/80 px-4 text-sm text-cream hover:bg-white/5 transition-colors">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </button>
        }
      />

      <DataTable
        data={transactions}
        keyExtractor={(txn) => txn.id}
        columns={[
          {
            header: "Txn ID",
            render: (txn) => <span className="font-medium text-cream">{txn.id}</span>
          },
          {
            header: "Vendor",
            render: (txn) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <Wallet className="h-4 w-4 text-ink/40" /> {txn.vendor}
              </div>
            )
          },
          {
            header: "Payment Method",
            render: (txn) => <span className="text-ink/60">{txn.method}</span>
          },
          {
            header: "Amount",
            render: (txn) => (
              <div className="font-bold text-gold-400 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-rose-400" /> {txn.amount}
              </div>
            )
          },
          {
            header: "Date",
            render: (txn) => <span className="text-ink/60">{txn.date}</span>
          },
          {
            header: "Status",
            render: (txn) => (
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${txn.status === 'Completed' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-rose-400 bg-rose-400/10 border-rose-400/20'}`}>
                {txn.status}
              </span>
            )
          }
        ]}
      />
    </div>
  );
}
