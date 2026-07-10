import { Landmark, ArrowUpRight, ArrowDownRight, Receipt } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';

export default function Finance() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Platform Finance</h2>
          <p className="text-sm text-ink/60">Macroeconomic view of Luxora's GMV, revenue, and payouts.</p>
        </div>
        <GhostButton>Download Financials</GhostButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
            <Landmark className="h-6 w-6" />
          </div>
          <div className="text-sm text-ink/60 mb-1">Total GMV (YTD)</div>
          <div className="font-heading text-3xl font-bold text-cream">₦124.5B</div>
          <div className="text-xs text-emerald-400 mt-2">+18.2% vs Last Year</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
            <ArrowUpRight className="h-6 w-6" />
          </div>
          <div className="text-sm text-ink/60 mb-1">Luxora Revenue (Fees)</div>
          <div className="font-heading text-3xl font-bold text-cream">₦6.2B</div>
          <div className="text-xs text-emerald-400 mt-2">+22.4% vs Last Year</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-400/10 text-rose-400">
            <ArrowDownRight className="h-6 w-6" />
          </div>
          <div className="text-sm text-ink/60 mb-1">Pending Agency Payouts</div>
          <div className="font-heading text-3xl font-bold text-cream">₦840M</div>
          <GoldButton size="sm" className="mt-2">Process Payouts</GoldButton>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-cream">Recent Large Transactions (GMV)</h3>
          <GhostButton size="sm">View Ledger</GhostButton>
        </div>
        <DataTable
          data={[
            { id: 'D-9982', property: 'Skyline Penthouse', agency: 'Meridian Luxury', value: '₦450,000,000', fee: '₦22,500,000' },
            { id: 'D-9981', property: 'Banana Island Plot', agency: 'Independent (Oluwaseun)', value: '₦800,000,000', fee: '₦40,000,000' },
            { id: 'D-9980', property: 'Marina View Apartment', agency: 'Eko Estates', value: '₦120,000,000', fee: '₦6,000,000' },
          ]}
          keyExtractor={(tx) => tx.id}
          columns={[
            {
              header: "Deal ID",
              render: (tx) => <span className="font-medium text-cream">{tx.id}</span>
            },
            {
              header: "Property",
              render: (tx) => <span className="text-ink/60">{tx.property}</span>
            },
            {
              header: "Agency",
              render: (tx) => <span className="text-ink/60">{tx.agency}</span>
            },
            {
              header: "Total Value (GMV)",
              render: (tx) => <span className="font-bold text-cream">{tx.value}</span>
            },
            {
              header: "Luxora Fee (5%)",
              render: (tx) => <span className="font-bold text-gold-400">+{tx.fee}</span>
            },
            {
              header: <div className="text-right">Invoice</div>,
              className: "text-right",
              render: () => (
                <button className="text-ink/40 hover:text-gold-400 transition-colors">
                  <Receipt className="h-5 w-5 ml-auto" />
                </button>
              )
            }
          ]}
        />
      </div>
    </div>
  );
}
