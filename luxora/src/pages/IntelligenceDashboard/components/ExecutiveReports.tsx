import { useState } from 'react';
import { FileText, Plus, Download, Mail } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge, EnterpriseExportMenu } from '../../../components/enterprise';
import type { ExecutiveReport } from '../types';
import { intelligenceApi } from '../../../api/intelligence.api';
import { useIntelligenceQuery } from '../useIntelligenceQuery';

export default function ExecutiveReports() {
  const [search, setSearch] = useState('');
  const { data, loading, error, retry } = useIntelligenceQuery(() => intelligenceApi.getReports(), []);
  const reports: ExecutiveReport[] = data ? [{ id:'intelligence-report',title:'Current Intelligence Projection',date:new Date(data.generatedAt).toLocaleString(),author:'Luxora Intelligence',status:'Published',type:'Market Analysis' }] : [];

  const filteredReports = reports.filter(r => r.title.toLowerCase().includes(search.toLowerCase()));
  if (loading) return <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-10 text-center text-ink/60">Building current read-only report projection…</div>;
  if (error) return <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-10 text-center text-ink/60">{error}<button onClick={retry} className="block mx-auto mt-4 text-gold-400">Retry</button></div>;

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Executive Reports</h2>
          <p className="text-sm text-ink/60">Generate, schedule, and distribute market intelligence reports.</p>
        </div>
        <div className="flex gap-3">
          <EnterpriseExportMenu onExport={() => {}} />
          <GoldButton disabled>
            <Plus className="h-4 w-4 mr-2" /> Read-only
          </GoldButton>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
        <DataTableToolbar 
          searchPlaceholder="Search reports..."
          searchValue={search}
          onSearchChange={setSearch}
          showFilter={true}
          onFilter={() => {}}
        />
        
        <DataTable
          data={filteredReports}
          keyExtractor={(r) => r.id}
          columns={[
            {
              header: "Report Title",
              render: (r) => (
                <div className="font-medium text-cream flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gold-400" /> {r.title}
                </div>
              )
            },
            {
              header: "Type",
              render: (r) => <span className="text-ink/60">{r.type}</span>
            },
            {
              header: "Date",
              render: (r) => <span className="text-ink/60">{r.date}</span>
            },
            {
              header: "Author",
              render: (r) => <span className="text-ink/60">{r.author}</span>
            },
            {
              header: "Status",
              render: (r) => (
                <EnterpriseStatusBadge 
                  status={r.status} 
                />
              )
            },
            {
              header: "Actions",
              className: "text-right",
              render: () => (
                <div className="flex justify-end gap-2">
                  <GhostButton size="sm" disabled><Mail className="h-4 w-4" /></GhostButton>
                  <GhostButton size="sm" disabled><Download className="h-4 w-4" /></GhostButton>
                </div>
              )
            }
          ]}
        />
      </div>
    </div>
  );
}
