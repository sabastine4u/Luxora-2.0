import { Users, Filter } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

export default function AgentPerformance() {
  const agents = [
    { id: 'AGT-101', name: 'Chidi Okafor', agency: 'Meridian Luxury', sales: 42, rating: 4.9 },
    { id: 'AGT-102', name: 'Sarah Jacobs', agency: 'Eko Estates', sales: 38, rating: 4.8 },
    { id: 'AGT-103', name: 'Musa Bello', agency: 'Abuja Premier Properties', sales: 25, rating: 4.7 },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Agent Performance</h2>
          <p className="text-sm text-ink/60">Metrics and performance analysis for individual agents.</p>
        </div>
        <DataTableToolbar
          searchValue=""
          onSearchChange={() => {}}
          searchPlaceholder="Search agents..."
          actions={
            <GhostButton className="px-3"><Filter className="h-4 w-4" /></GhostButton>
          }
        />
      </div>

      <DataTable
        data={agents}
        keyExtractor={(agent) => agent.id}
        columns={[
          {
            header: "ID",
            render: (agent) => <span className="font-medium text-cream">{agent.id}</span>
          },
          {
            header: "Agent Name",
            render: (agent) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <Users className="h-4 w-4 text-ink/40" /> {agent.name}
              </div>
            )
          },
          {
            header: "Agency",
            render: (agent) => <span className="text-ink/60">{agent.agency}</span>
          },
          {
            header: "Properties Sold",
            render: (agent) => <span className="font-bold text-gold-400">{agent.sales}</span>
          },
          {
            header: "Avg Rating",
            render: (agent) => <span className="text-emerald-400 font-bold">{agent.rating} ★</span>
          }
        ]}
      />
    </div>
  );
}
