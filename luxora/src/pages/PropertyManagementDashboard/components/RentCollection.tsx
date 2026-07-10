import { Download, Banknote } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

export default function RentCollection() {
  const rents = [
    { id: 'RC-001', tenant: 'Dr. Ayo Balogun', property: 'Victoria Island Villa', amount: '₦12,500,000', due: 'Oct 01, 2025', status: 'Paid', date: 'Sep 28, 2025' },
    { id: 'RC-002', tenant: 'Sarah Jenkins', property: 'Lekki Studio Apt', amount: '₦3,500,000', due: 'Oct 01, 2025', status: 'Overdue', date: '-' },
    { id: 'RC-003', tenant: 'TechFlow Ltd', property: 'Abuja Central Office', amount: '₦45,000,000', due: 'Nov 01, 2025', status: 'Pending', date: '-' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Rent Collection</h2>
          <p className="text-sm text-ink/60">Track payments, overdue rent, and upcoming dues.</p>
        </div>
        <GoldButton>Send Reminders</GoldButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Total Collected (This Month)</div>
           <div className="font-heading text-3xl font-bold text-emerald-400">₦62.4M</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Outstanding / Overdue</div>
           <div className="font-heading text-3xl font-bold text-rose-400">₦8.5M</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
           <div className="text-sm text-ink/60 mb-1">Upcoming (Next 30 Days)</div>
           <div className="font-heading text-3xl font-bold text-cream">₦145.0M</div>
        </div>
      </div>

      <DataTableToolbar
        searchPlaceholder="Search by tenant or property..."
        actions={
          <GhostButton className="px-4"><Download className="h-4 w-4 mr-2" /> Export Report</GhostButton>
        }
      />

      <DataTable
        data={rents}
        keyExtractor={(rent) => rent.id}
        columns={[
          {
            header: "Tenant Name",
            render: (rent) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <Banknote className="h-4 w-4 text-ink/40" /> {rent.tenant}
              </div>
            )
          },
          {
            header: "Property",
            render: (rent) => <span className="text-ink/60">{rent.property}</span>
          },
          {
            header: "Amount Due",
            render: (rent) => <span className="font-bold text-gold-400">{rent.amount}</span>
          },
          {
            header: "Due Date",
            render: (rent) => <span className="text-ink/60">{rent.due}</span>
          },
          {
            header: "Status",
            render: (rent) => (
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${rent.status === 'Paid' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : rent.status === 'Overdue' ? 'text-rose-400 bg-rose-400/10 border-rose-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                {rent.status}
              </span>
            )
          }
        ]}
      />
    </div>
  );
}
