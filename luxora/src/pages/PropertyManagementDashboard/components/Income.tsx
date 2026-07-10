import { TrendingUp, Download, ArrowUpRight } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';

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

      <DataTable
        data={incomeSources}
        keyExtractor={(inc) => inc.id}
        columns={[
          {
            header: "Income Stream",
            render: (inc) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-ink/40" /> {inc.source}
              </div>
            )
          },
          {
            header: "Amount (MTD)",
            render: (inc) => <span className="font-bold text-cream">{inc.amount}</span>
          },
          {
            header: "% of Total",
            render: (inc) => (
              <div className="flex items-center gap-2">
                <span className="text-ink/60 w-8">{inc.percentage}</span>
                <div className="h-2 w-24 bg-navy-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-400" style={{ width: inc.percentage }}></div>
                </div>
              </div>
            )
          }
        ]}
      />
    </div>
  );
}
