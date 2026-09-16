import { useState } from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseExportMenu, EnterpriseStatusBadge } from '../../../components/enterprise';
import type { RiskAnalysisItem } from '../types';
import { intelligenceApi } from '../../../api/intelligence.api';
import { useIntelligenceQuery } from '../useIntelligenceQuery';

export default function RiskAnalysis() {
  const [search, setSearch] = useState('');
  const { data, loading, error, retry } = useIntelligenceQuery(() => intelligenceApi.getRiskAnalysis(), []);
  const risks: RiskAnalysisItem[] = (data?.items || []).map((item: any) => ({ id:String(item.propertyId),factor:item.title,severity:item.riskLevel,probability:item.flags.length?100:0,mitigation:item.flags.join(', ') || 'No rule triggered',impact:item.riskLevel }));

  const filteredRisks = risks.filter(r => r.factor.toLowerCase().includes(search.toLowerCase()));
  if (loading) return <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-10 text-center text-ink/60">Loading deterministic risk flags…</div>;
  if (error) return <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-10 text-center text-ink/60">{error}<button onClick={retry} className="block mx-auto mt-4 text-gold-400">Retry</button></div>;
  if (!risks.length) return <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-10 text-center text-ink/60">No properties are available for deterministic risk checks.<button onClick={retry} className="block mx-auto mt-4 text-gold-400">Retry</button></div>;

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Risk Analysis</h2>
          <p className="text-sm text-ink/60">Identify, evaluate, and mitigate potential market risks.</p>
        </div>
        <div className="flex gap-3">
          <EnterpriseExportMenu onExport={() => {}} />
          <GoldButton disabled>
            <AlertTriangle className="h-4 w-4 mr-2" /> Run Simulation
          </GoldButton>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
        <DataTableToolbar 
          searchPlaceholder="Search risk factors..."
          searchValue={search}
          onSearchChange={setSearch}
          showFilter={true}
          onFilter={() => {}}
        />
        
        <DataTable
          data={filteredRisks}
          keyExtractor={(r) => r.id}
          columns={[
            {
              header: "Risk Factor",
              render: (r) => (
                <div className="font-medium text-cream flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-ink/40" /> {r.factor}
                </div>
              )
            },
            {
              header: "Severity",
              render: (r) => (
                <EnterpriseStatusBadge 
                  status={r.severity} 
                />
              )
            },
            {
              header: "Probability",
              render: (r) => (
                <div className="w-24 h-2 bg-navy-900 rounded-full overflow-hidden relative">
                   <div className={`absolute top-0 left-0 h-full ${r.probability > 75 ? 'bg-rose-400' : r.probability > 40 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${r.probability}%` }}></div>
                </div>
              )
            },
            {
              header: "Potential Impact",
              render: (r) => <span className="text-ink/60 text-sm">{r.impact}</span>
            },
            {
              header: "Recommended Mitigation",
              render: (r) => <span className="text-ink/80 text-sm">{r.mitigation}</span>
            },
            {
              header: "Action",
              className: "text-right",
              render: () => (
                <GhostButton size="sm" disabled>Read-only</GhostButton>
              )
            }
          ]}
        />
      </div>
    </div>
  );
}
