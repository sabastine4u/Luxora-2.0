import { TrendingUp, Download, ArrowUpRight } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export default function Income() {
  const incomeSources = [
    { id: 'INC-1', source: 'Rent Payments', amount: '₦45,500,000', percentage: '85%' },
    { id: 'INC-2', source: 'Late Fees', amount: '₦1,200,000', percentage: '2%' },
    { id: 'INC-3', source: 'Parking Fees', amount: '₦3,500,000', percentage: '6%' },
    { id: 'INC-4', source: 'Pet Rent', amount: '₦800,000', percentage: '1%' },
    { id: 'INC-5', source: 'Other Admin Fees', amount: '₦2,500,000', percentage: '6%' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Income Breakdown</h2>
          <p className="text-sm text-ink/60">Analyze revenue streams beyond base rent.</p>
        </div>
        <GhostButton className="px-4"><Download className="h-4 w-4 mr-2" /> Export CSV</GhostButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Total Operating Income (MTD)</div>
           <div className="font-heading text-3xl font-bold text-emerald-400">₦53.5M</div>
           <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> +12% vs Last Month</div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900/50 text-xs uppercase text-ink/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Income Stream</th>
              <th className="px-6 py-4 font-semibold">Amount (MTD)</th>
              <th className="px-6 py-4 font-semibold">% of Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {incomeSources.map((inc) => (
              <tr key={inc.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-ink/40" /> {inc.source}
                </td>
                <td className="px-6 py-4 font-bold text-cream">{inc.amount}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                     <span className="text-ink/60 w-8">{inc.percentage}</span>
                     <div className="h-2 w-24 bg-navy-900 rounded-full overflow-hidden">
                       <div className="h-full bg-gold-400" style={{ width: inc.percentage }}></div>
                     </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
