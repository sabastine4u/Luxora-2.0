import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState('');

  const transactions = [
    { id: 'TXN-001', type: 'Platform Fee', property: 'Victoria Island Villa', amount: '+₦4,500,000', status: 'Completed', date: 'Oct 05, 2025 14:30', inflow: true },
    { id: 'TXN-002', type: 'Owner Payout', property: 'Lekki Phase 1 Apt', amount: '-₦120,000,000', status: 'Completed', date: 'Oct 05, 2025 09:15', inflow: false },
    { id: 'TXN-003', type: 'Refund', property: 'Abuja Central Office', amount: '-₦5,000,000', status: 'Pending', date: 'Oct 04, 2025 16:45', inflow: false },
    { id: 'TXN-004', type: 'Subscription', property: 'Premium Agency Tier', amount: '+₦150,000', status: 'Completed', date: 'Oct 04, 2025 11:20', inflow: true },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Transaction Ledger</h2>
          <p className="text-sm text-ink/60">Comprehensive log of all financial movements on the platform.</p>
        </div>
      </div>

      <DataTableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by TXN ID or Property..."
        showFilter
        showExport
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
            render: (txn) => (
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${txn.status === 'Completed' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                {txn.status}
              </span>
            )
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
  );
}
