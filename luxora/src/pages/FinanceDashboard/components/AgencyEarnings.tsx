import { Download, Building2 } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

export default function AgencyEarnings() {
  const earnings = [
    { id: 'AG-EARN-01', agency: 'Prime Real Estate', deals: 14, commission: '₦4,200,000', period: 'Sep 2025', status: 'Paid' },
    { id: 'AG-EARN-02', agency: 'Lagos Homes Ltd', deals: 8, commission: '₦1,850,000', period: 'Sep 2025', status: 'Paid' },
    { id: 'AG-EARN-03', agency: 'Abuja Elite Properties', deals: 5, commission: '₦950,000', period: 'Sep 2025', status: 'Pending' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Agency Earnings</h2>
          <p className="text-sm text-ink/60">Track and disburse agency-level commissions and platform earnings.</p>
        </div>
      </div>

      <DataTableToolbar
        searchValue=""
        onSearchChange={() => {}}
        searchPlaceholder="Search by agency..."
        actions={
          <GhostButton className="px-4"><Download className="h-4 w-4 mr-2" /> Export CSV</GhostButton>
        }
      />

      <DataTable
        data={earnings}
        keyExtractor={(earn) => earn.id}
        columns={[
          {
            header: "Ref ID",
            render: (earn) => <span className="font-medium text-cream">{earn.id}</span>
          },
          {
            header: "Agency Name",
            render: (earn) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <Building2 className="h-4 w-4 text-ink/40" /> {earn.agency}
              </div>
            )
          },
          {
            header: "Deals Closed",
            render: (earn) => <span className="text-ink/60">{earn.deals}</span>
          },
          {
            header: "Period",
            render: (earn) => <span className="text-ink/60">{earn.period}</span>
          },
          {
            header: "Status",
            render: (earn) => (
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${earn.status === 'Paid' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                {earn.status}
              </span>
            )
          },
          {
            header: <div className="text-right">Total Commission</div>,
            className: "text-right font-bold text-gold-400",
            render: (earn) => earn.commission
          }
        ]}
      />
    </div>
  );
}
