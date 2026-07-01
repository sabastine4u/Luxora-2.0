import { Wallet, Search, Filter, ArrowUpRight } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';

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

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
          />
        </div>
        <button className="flex items-center justify-center rounded-xl border border-white/10 bg-navy-900/80 px-4 text-sm text-cream hover:bg-white/5 transition-colors">
          <Filter className="h-4 w-4 mr-2" /> Filter
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Txn ID</th>
              <th className="px-6 py-4 font-semibold">Vendor</th>
              <th className="px-6 py-4 font-semibold">Payment Method</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream">{txn.id}</td>
                <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-ink/40" /> {txn.vendor}
                </td>
                <td className="px-6 py-4 text-ink/60">{txn.method}</td>
                <td className="px-6 py-4 font-bold text-gold-400 flex items-center gap-1"><ArrowUpRight className="h-3 w-3 text-rose-400" /> {txn.amount}</td>
                <td className="px-6 py-4 text-ink/60">{txn.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${txn.status === 'Completed' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-rose-400 bg-rose-400/10 border-rose-400/20'}`}>
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
