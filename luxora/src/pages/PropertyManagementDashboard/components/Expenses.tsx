import { Plus, TrendingDown, Wallet } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';

export default function Expenses() {
  const expenses = [
    { id: 'EXP-801', category: 'Maintenance', vendor: 'FixIt Pros', property: 'Victoria Island Villa', amount: '₦450,000', date: 'Oct 12, 2025', status: 'Paid' },
    { id: 'EXP-802', category: 'Utilities', vendor: 'EKEDC', property: 'Lekki Studio Apt', amount: '₦25,000', date: 'Oct 10, 2025', status: 'Pending' },
    { id: 'EXP-803', category: 'Insurance', vendor: 'Leadway Assurance', property: 'Abuja Central Office', amount: '₦1,200,000', date: 'Oct 01, 2025', status: 'Paid' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Operating Expenses</h2>
          <p className="text-sm text-ink/60">Log and track property-related outgoings.</p>
        </div>
        <div className="flex gap-2">
           <GhostButton>Approve Pending</GhostButton>
           <GoldButton className="flex items-center gap-2"><Plus className="h-4 w-4" /> Log Expense</GoldButton>
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
            render: (exp) => <span className="text-ink/60">{exp.property}</span>
          },
          {
            header: "Amount",
            render: (exp) => <span className="font-bold text-cream">{exp.amount}</span>
          },
          {
            header: "Date",
            render: (exp) => <span className="text-ink/60">{exp.date}</span>
          },
          {
            header: "Status",
            render: (exp) => (
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${exp.status === 'Paid' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                {exp.status}
              </span>
            )
          }
        ]}
      />
    </div>
  );
}
