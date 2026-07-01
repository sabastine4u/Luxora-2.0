import { Wallet, ArrowUpRight, Clock, Receipt } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';

export default function RentalIncome() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Rental Income</h2>
          <p className="text-sm text-ink/60">Overview of your earnings and upcoming payments.</p>
        </div>
        <GoldButton>Withdraw Funds</GoldButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
            <Wallet className="h-6 w-6" />
          </div>
          <div className="text-sm text-ink/60 mb-1">Available Balance</div>
          <div className="font-heading text-3xl font-bold text-cream">₦12,450,000</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
            <ArrowUpRight className="h-6 w-6" />
          </div>
          <div className="text-sm text-ink/60 mb-1">Total Earned (YTD)</div>
          <div className="font-heading text-3xl font-bold text-cream">₦48,200,000</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
            <Clock className="h-6 w-6" />
          </div>
          <div className="text-sm text-ink/60 mb-1">Next Expected Payout</div>
          <div className="font-heading text-3xl font-bold text-cream">₦4,700,000</div>
          <div className="text-xs text-ink/40 mt-1">Due: Nov 1, 2025</div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-cream">Recent Transactions</h3>
          <GhostButton size="sm">View All</GhostButton>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50">
            <tr>
              <th className="px-6 py-4 font-semibold">Property</th>
              <th className="px-6 py-4 font-semibold">Tenant</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[
              { property: 'Garden Court Villa', tenant: 'Chidi Okafor', amount: '₦4,700,000', date: 'Oct 1, 2025' },
              { property: 'Marina View Apartment', tenant: 'Bisi Williams', amount: '₦1,300,000', date: 'Sep 28, 2025' },
              { property: 'Garden Court Villa', tenant: 'Chidi Okafor', amount: '₦4,700,000', date: 'Sep 1, 2025' },
            ].map((tx, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream">{tx.property}</td>
                <td className="px-6 py-4 text-ink/60">{tx.tenant}</td>
                <td className="px-6 py-4 font-bold text-emerald-400">+{tx.amount}</td>
                <td className="px-6 py-4 text-ink/60">{tx.date}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-ink/40 hover:text-gold-400 transition-colors">
                    <Receipt className="h-5 w-5 ml-auto" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
