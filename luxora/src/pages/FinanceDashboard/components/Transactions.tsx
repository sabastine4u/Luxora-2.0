import { Search, Filter, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function Transactions() {
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

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search by TXN ID or Property..." 
            className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
          />
        </div>
        <GhostButton className="px-4"><Filter className="h-4 w-4 mr-2" /> Filter</GhostButton>
        <GhostButton className="px-4"><Download className="h-4 w-4 mr-2" /> Export</GhostButton>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Txn ID</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Reference</th>
              <th className="px-6 py-4 font-semibold">Date & Time</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream">{txn.id}</td>
                <td className="px-6 py-4 text-ink/60">{txn.type}</td>
                <td className="px-6 py-4 text-ink/60">{txn.property}</td>
                <td className="px-6 py-4 text-ink/60">{txn.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${txn.status === 'Completed' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                    {txn.status}
                  </span>
                </td>
                <td className={`px-6 py-4 text-right font-bold flex items-center justify-end gap-1 ${txn.inflow ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {txn.inflow ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {txn.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
