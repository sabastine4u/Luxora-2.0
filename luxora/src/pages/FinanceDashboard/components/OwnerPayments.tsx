import { Download, Banknote, CheckCircle } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

export default function OwnerPayments() {
  const payments = [
    { id: 'PAY-OW-102', owner: 'Chief Adebayo', property: 'Lekki Phase 1 Apt', amount: '₦120,000,000', period: 'Sep 2025', status: 'Cleared', date: 'Oct 05, 2025' },
    { id: 'PAY-OW-103', owner: 'Ngozi Okafor', property: 'Abuja Central Plaza', amount: '₦45,000,000', period: 'Sep 2025', status: 'Processing', date: 'Oct 06, 2025' },
    { id: 'PAY-OW-104', owner: 'David Smith', property: 'Victoria Island Villa', amount: '₦210,000,000', period: 'Sep 2025', status: 'Cleared', date: 'Oct 05, 2025' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Owner Payouts</h2>
          <p className="text-sm text-ink/60">Manage disbursements to property owners after platform fee deductions.</p>
        </div>
        <GoldButton>Process Batch Payout</GoldButton>
      </div>

      <DataTableToolbar
        searchValue=""
        onSearchChange={() => {}}
        searchPlaceholder="Search by owner or property..."
        actions={
          <GhostButton className="px-4"><Download className="h-4 w-4 mr-2" /> Export</GhostButton>
        }
      />

      <DataTable
        data={payments}
        keyExtractor={(pay) => pay.id}
        columns={[
          {
            header: "Payment ID",
            render: (pay) => <span className="font-medium text-cream">{pay.id}</span>
          },
          {
            header: "Owner Name",
            render: (pay) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <Banknote className="h-4 w-4 text-ink/40" /> {pay.owner}
              </div>
            )
          },
          {
            header: "Property",
            render: (pay) => <span className="text-ink/60">{pay.property}</span>
          },
          {
            header: "Period",
            render: (pay) => <span className="text-ink/60">{pay.period}</span>
          },
          {
            header: "Status",
            render: (pay) => (
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${pay.status === 'Cleared' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                {pay.status === 'Cleared' && <CheckCircle className="h-3 w-3" />} {pay.status}
              </span>
            )
          },
          {
            header: <div className="text-right">Amount</div>,
            className: "text-right font-bold text-gold-400",
            render: (pay) => pay.amount
          }
        ]}
      />
    </div>
  );
}
