import { useState } from 'react';
import { Sparkles, ArrowRight, Download } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseDetailDrawer, EnterpriseExportMenu, EnterpriseStatusBadge } from '../../../components/enterprise';
import { useToast } from '../../../contexts/ToastContext';
import type { InvestmentScore } from '../types';

export default function InvestmentScoring() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedScore, setSelectedScore] = useState<InvestmentScore | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const scores: InvestmentScore[] = [
    { id: 'IS-01', propertyId: 'P-100', address: '14 Admiralty Way, Lekki', score: 94, recommendation: 'Buy', capRate: '8.2%', cashOnCash: '10.5%', riskLevel: 'Low', appreciation: '12% YoY' },
    { id: 'IS-02', propertyId: 'P-101', address: '8 Fola Osibo St, Lekki', score: 76, recommendation: 'Hold', capRate: '6.1%', cashOnCash: '7.0%', riskLevel: 'Medium', appreciation: '8% YoY' },
    { id: 'IS-03', propertyId: 'P-102', address: '22 Freedom Way, Lekki', score: 45, recommendation: 'Sell', capRate: '3.5%', cashOnCash: '2.1%', riskLevel: 'High', appreciation: '-2% YoY' },
  ];

  const filteredScores = scores.filter(s => s.address.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Investment Scoring</h2>
          <p className="text-sm text-ink/60">Algorithmic evaluation of property investment opportunities.</p>
        </div>
        <div className="flex gap-3">
          <EnterpriseExportMenu onExport={(f) => handleAction(`Export Scores as ${f.toUpperCase()}`)} />
          <GoldButton onClick={() => handleAction('Run Batch Analysis')}>
            <Sparkles className="h-4 w-4 mr-2" /> Run Analysis
          </GoldButton>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
        <DataTableToolbar 
          searchPlaceholder="Search properties..."
          searchValue={search}
          onSearchChange={setSearch}
          showFilter={true}
          onFilter={() => handleAction('Open Filters')}
        />
        
        <DataTable
          data={filteredScores}
          keyExtractor={(s) => s.id}
          onRowClick={(s) => { setSelectedScore(s); setIsDrawerOpen(true); }}
          columns={[
            {
              header: "Property",
              render: (s) => <div className="font-medium text-cream">{s.address}</div>
            },
            {
              header: "Score",
              render: (s) => (
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    s.score >= 90 ? 'bg-emerald-400/20 text-emerald-400' :
                    s.score >= 70 ? 'bg-amber-400/20 text-amber-400' : 'bg-rose-400/20 text-rose-400'
                  }`}>
                    {s.score}
                  </div>
                </div>
              )
            },
            {
              header: "Recommendation",
              render: (s) => (
                <EnterpriseStatusBadge 
                  status={s.recommendation} 
                />
              )
            },
            {
              header: "Cap Rate",
              render: (s) => <span className="text-ink/60">{s.capRate}</span>
            },
            {
              header: "Risk",
              render: (s) => <span className="text-ink/60">{s.riskLevel}</span>
            }
          ]}
        />
      </div>

      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Investment Analysis"
        subtitle={selectedScore?.address}
      >
        {selectedScore && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-navy-900/50">
              <div>
                 <div className="text-sm text-ink/60 uppercase tracking-wider mb-1">Overall Score</div>
                 <div className={`font-heading text-4xl font-bold ${
                    selectedScore.score >= 90 ? 'text-emerald-400' :
                    selectedScore.score >= 70 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {selectedScore.score}/100
                 </div>
              </div>
              <EnterpriseStatusBadge 
                  status={selectedScore.recommendation} 
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                  <div className="text-xs text-ink/60 mb-1">Cap Rate</div>
                  <div className="font-semibold text-cream">{selectedScore.capRate}</div>
               </div>
               <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                  <div className="text-xs text-ink/60 mb-1">Cash on Cash</div>
                  <div className="font-semibold text-cream">{selectedScore.cashOnCash}</div>
               </div>
               <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                  <div className="text-xs text-ink/60 mb-1">Appreciation</div>
                  <div className="font-semibold text-cream">{selectedScore.appreciation}</div>
               </div>
               <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                  <div className="text-xs text-ink/60 mb-1">Risk Level</div>
                  <div className="font-semibold text-cream">{selectedScore.riskLevel}</div>
               </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
               <GoldButton className="w-full" onClick={() => { handleAction('Export Full Analysis'); setIsDrawerOpen(false); }}>
                 <Download className="h-4 w-4 mr-2" /> Export Full Analysis
               </GoldButton>
               <GhostButton className="w-full" onClick={() => handleAction('View Comparable Properties')}>
                 View Comparables <ArrowRight className="h-4 w-4 ml-2" />
               </GhostButton>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>
    </div>
  );
}
