import { useState } from 'react';
import { FileText, Plus, Download, Mail } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge, EnterpriseExportMenu } from '../../../components/enterprise';
import { useToast } from '../../../contexts/ToastContext';
import type { ExecutiveReport } from '../types';

export default function ExecutiveReports() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);

  const handleAction = (action: string) => {
    showToast({ type: 'success', title: 'Backend Integration', description: `This feature (${action}) is ready and will become fully functional during backend integration.` });
  };

  const startReportBuilder = () => {
    setIsBuilding(true);
    setTimeout(() => {
      setIsBuilding(false);
      handleAction('Generate New Report');
    }, 1500);
  };

  const reports: ExecutiveReport[] = [
    { id: 'REP-101', title: 'Q3 Luxury Market Analysis', date: 'Oct 15, 2025', author: 'James Rodriguez', status: 'Published', type: 'Market Analysis' },
    { id: 'REP-102', title: 'Lekki Commercial Expansion', date: 'Oct 10, 2025', author: 'James Rodriguez', status: 'Draft', type: 'Investment Strategy' },
    { id: 'REP-103', title: 'Annual Yield Review', date: 'Sep 30, 2025', author: 'System Generated', status: 'Published', type: 'Quarterly Review' },
  ];

  const filteredReports = reports.filter(r => r.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Executive Reports</h2>
          <p className="text-sm text-ink/60">Generate, schedule, and distribute market intelligence reports.</p>
        </div>
        <div className="flex gap-3">
          <EnterpriseExportMenu onExport={(f) => handleAction(`Export Report List as ${f.toUpperCase()}`)} />
          <GoldButton onClick={startReportBuilder} disabled={isBuilding}>
            {isBuilding ? 'Building...' : <><Plus className="h-4 w-4 mr-2" /> Create Report</>}
          </GoldButton>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
        <DataTableToolbar 
          searchPlaceholder="Search reports..."
          searchValue={search}
          onSearchChange={setSearch}
          showFilter={true}
          onFilter={() => handleAction('Open Filters')}
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
                  <GhostButton size="sm" className="text-ink/60 hover:text-gold-400" onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleAction('Email Report'); }}><Mail className="h-4 w-4" /></GhostButton>
                  <GhostButton size="sm" className="text-ink/60 hover:text-emerald-400" onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleAction('Download Report PDF'); }}><Download className="h-4 w-4" /></GhostButton>
                </div>
              )
            }
          ]}
        />
      </div>
    </div>
  );
}
