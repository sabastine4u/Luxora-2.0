import { Building2, Filter } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

export default function AgencyPerformance() {
  const rankings = [
    { rank: 1, name: 'Meridian Luxury', gmv: '₦8.4B', agents: 42, rating: 4.9 },
    { rank: 2, name: 'Eko Estates', gmv: '₦6.1B', agents: 28, rating: 4.8 },
    { rank: 3, name: 'Abuja Premier Properties', gmv: '₦4.2B', agents: 15, rating: 4.6 },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Agency Performance</h2>
          <p className="text-sm text-ink/60">Metrics and performance analysis for registered agencies.</p>
        </div>
        <DataTableToolbar
          searchValue=""
          onSearchChange={() => {}}
          searchPlaceholder="Search agencies..."
          actions={
            <GhostButton className="px-3"><Filter className="h-4 w-4" /></GhostButton>
          }
        />
      </div>

      <DataTable
        data={rankings}
        keyExtractor={(agency) => agency.rank.toString()}
        columns={[
          {
            header: "Rank",
            render: (agency) => (
              <div className="font-medium text-cream flex items-center gap-2">
                <Building2 className="h-4 w-4 text-ink/40" /> #{agency.rank}
              </div>
            )
          },
          {
            header: "Agency",
            render: (agency) => <span className="font-semibold text-cream">{agency.name}</span>
          },
          {
            header: "Total GMV (YTD)",
            render: (agency) => <span className="font-bold text-gold-400">{agency.gmv}</span>
          },
          {
            header: "Active Agents",
            render: (agency) => <span className="text-ink/60">{agency.agents}</span>
          },
          {
            header: "Avg Rating",
            render: (agency) => <span className="text-emerald-400 font-bold">{agency.rating} ★</span>
          }
        ]}
      />
    </div>
  );
}
