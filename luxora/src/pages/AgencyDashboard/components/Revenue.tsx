import { Wallet, ArrowUpRight, ArrowDownRight, Receipt } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';

export default function Revenue() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Agency Revenue</h2>
          <p className="text-sm text-ink/60">Track gross commissions and net payouts.</p>
        </div>
        <GoldButton>Withdraw Funds</GoldButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
            <Wallet className="h-6 w-6" />
          </div>
          <div className="text-sm text-ink/60 mb-1">Gross Commission (YTD)</div>
          <div className="font-heading text-3xl font-bold text-cream">₦1.2B</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
            <ArrowUpRight className="h-6 w-6" />
          </div>
          <div className="text-sm text-ink/60 mb-1">Net Earnings (Agency)</div>
          <div className="font-heading text-3xl font-bold text-cream">₦480M</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
            <ArrowDownRight className="h-6 w-6" />
          </div>
          <div className="text-sm text-ink/60 mb-1">Agent Payouts</div>
          <div className="font-heading text-3xl font-bold text-cream">₦720M</div>
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
              <th className="px-6 py-4 font-semibold">Deal ID</th>
              <th className="px-6 py-4 font-semibold">Agent</th>
              <th className="px-6 py-4 font-semibold">Gross Comm.</th>
              <th className="px-6 py-4 font-semibold">Agency Cut (40%)</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold text-right">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[
              { id: 'D-2041', agent: 'Adaeze Okonkwo', gross: '₦12,600,000', net: '₦5,040,000', date: 'Today' },
              { id: 'D-2040', agent: 'Chioma Obi', gross: '₦8,400,000', net: '₦3,360,000', date: 'Yesterday' },
              { id: 'D-2039', agent: 'Adaeze Okonkwo', gross: '₦18,000,000', net: '₦7,200,000', date: 'Oct 24, 2025' },
            ].map((tx, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-cream">{tx.id}</td>
                <td className="px-6 py-4 text-ink/60">{tx.agent}</td>
                <td className="px-6 py-4 font-bold text-gold-400">{tx.gross}</td>
                <td className="px-6 py-4 font-bold text-emerald-400">+{tx.net}</td>
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
