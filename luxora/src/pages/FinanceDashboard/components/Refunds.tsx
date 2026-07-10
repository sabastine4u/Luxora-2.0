import { Filter, AlertTriangle, MessageSquare } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

export default function Refunds() {
  const refunds = [
    { id: 'REF-0881', buyer: 'Musa Ibrahim', property: 'Abuja Central Office', amount: '₦5,000,000', reason: 'Failed Inspection', status: 'Pending Review', date: 'Oct 04, 2025' },
    { id: 'REF-0882', buyer: 'Sarah Jenkins', property: 'Lekki Studio Apt', amount: '₦150,000', reason: 'Booking Cancelled (Within 24h)', status: 'Processed', date: 'Oct 01, 2025' },
    { id: 'REF-0883', buyer: 'John Doe', property: 'Victoria Island Villa', amount: '₦10,000,000', reason: 'Mortgage Declined', status: 'Rejected', date: 'Sep 25, 2025' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Disputes & Refunds</h2>
          <p className="text-sm text-ink/60">Review, approve, or reject buyer refund requests.</p>
        </div>
      </div>

      <DataTableToolbar
        searchValue=""
        onSearchChange={() => {}}
        searchPlaceholder="Search by buyer or property..."
        actions={
          <GhostButton className="px-4"><Filter className="h-4 w-4 mr-2" /> Filter</GhostButton>
        }
      />

      <DataTable
        data={refunds}
        keyExtractor={(ref) => ref.id}
        columns={[
          {
            header: "Ref ID",
            render: (ref) => <span className="font-medium text-cream">{ref.id}</span>
          },
          {
            header: "Buyer Name",
            render: (ref) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-ink/40" /> {ref.buyer}
              </div>
            )
          },
          {
            header: "Property",
            render: (ref) => <span className="text-ink/60">{ref.property}</span>
          },
          {
            header: "Reason",
            render: (ref) => <span className="text-ink/60">{ref.reason}</span>
          },
          {
            header: "Status",
            render: (ref) => (
              ref.status === 'Pending Review' ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase text-yellow-400">
                  <AlertTriangle className="h-3 w-3" /> {ref.status}
                </span>
              ) : (
                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${ref.status === 'Processed' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-rose-400 bg-rose-400/10 border-rose-400/20'}`}>
                  {ref.status}
                </span>
              )
            )
          },
          {
            header: <div className="text-right">Amount</div>,
            className: "text-right font-bold text-rose-400",
            render: (ref) => ref.amount
          }
        ]}
      />
    </div>
  );
}
