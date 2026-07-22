import { useState } from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseExportMenu, EnterpriseStatusBadge } from '../../../components/enterprise';
import { useToast } from '../../../contexts/ToastContext';
import type { RiskAnalysisItem } from '../types';

export default function RiskAnalysis() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const risks: RiskAnalysisItem[] = [
    { id: 'R-01', factor: 'Interest Rate Hike', severity: 'Critical', probability: 85, mitigation: 'Lock in long-term fixed rates', impact: 'Severe cash flow reduction' },
    { id: 'R-02', factor: 'Local Zoning Changes', severity: 'Medium', probability: 40, mitigation: 'Diversify into commercial zones', impact: 'Restricted development options' },
    { id: 'R-03', factor: 'Material Cost Inflation', severity: 'High', probability: 70, mitigation: 'Pre-purchase building materials', impact: 'Decreased development ROI' },
    { id: 'R-04', factor: 'Currency Devaluation', severity: 'High', probability: 65, mitigation: 'Peg rental agreements to USD', impact: 'Asset value erosion' },
  ];

  const filteredRisks = risks.filter(r => r.factor.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Risk Analysis</h2>
          <p className="text-sm text-ink/60">Identify, evaluate, and mitigate potential market risks.</p>
        </div>
        <div className="flex gap-3">
          <EnterpriseExportMenu onExport={(f) => handleAction(`Export Risk Matrix as ${f.toUpperCase()}`)} />
          <GoldButton onClick={() => handleAction('Run Risk Simulation')}>
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
          onFilter={() => handleAction('Open Filters')}
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
                <GhostButton size="sm" onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleAction('View Mitigation Plan'); }}>View Plan</GhostButton>
              )
            }
          ]}
        />
      </div>
    </div>
  );
}
