import { Download, Users } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

export default function AgentCommissions() {
  const commissions = [
    { id: 'AGT-COM-01', agent: 'Samuel Ojo', property: 'Lekki Phase 1 Apt', amount: '₦240,000', status: 'Paid', date: 'Oct 05, 2025' },
    { id: 'AGT-COM-02', agent: 'Chioma Eze', property: 'Victoria Island Villa', amount: '₦450,000', status: 'Pending', date: 'Oct 06, 2025' },
    { id: 'AGT-COM-03', agent: 'Tunde Bakare', property: 'Maitama Duplex', amount: '₦180,000', status: 'Paid', date: 'Oct 02, 2025' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Independent Agent Commissions</h2>
          <p className="text-sm text-ink/60">Disburse commissions to individual verified agents on the platform.</p>
        </div>
      </div>

      <DataTableToolbar
        searchValue=""
        onSearchChange={() => {}}
        searchPlaceholder="Search by agent or property..."
        actions={
          <GhostButton className="px-4"><Download className="h-4 w-4 mr-2" /> Export</GhostButton>
        }
      />

      <DataTable
        data={commissions}
        keyExtractor={(com) => com.id}
        columns={[
          {
            header: "Ref ID",
            render: (com) => <span className="font-medium text-cream">{com.id}</span>
          },
          {
            header: "Agent Name",
            render: (com) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <Users className="h-4 w-4 text-ink/40" /> {com.agent}
              </div>
            )
          },
          {
            header: "Property Sold/Rented",
            render: (com) => <span className="text-ink/60">{com.property}</span>
          },
          {
            header: "Date",
            render: (com) => <span className="text-ink/60">{com.date}</span>
          },
          {
            header: "Status",
            render: (com) => (
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${com.status === 'Paid' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                {com.status}
              </span>
            )
          },
          {
            header: <div className="text-right">Commission</div>,
            className: "text-right font-bold text-gold-400",
            render: (com) => com.amount
          }
        ]}
      />
    </div>
  );
}
