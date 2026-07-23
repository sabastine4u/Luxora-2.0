import { useState } from 'react';
import { 
  FileText, Download, Calendar as CalendarIcon, Clock, Eye, MoreVertical, Search, ChevronDown, CheckCircle2,
  Printer, FileDown, Plus, TrendingUp, Wallet, Building2, Users, BarChart3
} from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout/EmptyState';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { useToast } from '../../../contexts/ToastContext';
import { mockReports as MOCK_REPORTS } from '../../../data/agentData';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import type { PerformanceReport } from '../../../types/agent';

export default function Reports() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('All');
  const [activeWorkflow, setActiveWorkflow] = useState<{ title: string, type: string, data?: Record<string, unknown> } | null>(null);

  const handleAction = (title: string, type: string, data?: Record<string, unknown>) => {
    setActiveWorkflow({ title, type, data });
  };

  const executeWorkflow = () => {
    showToast({ type: 'success', title: 'Action Initiated', description: `Executing: ${activeWorkflow?.title}. Integration pending.` });
    setActiveWorkflow(null);
  };
  
  const reportCategories = [
    'All', 'Sales Reports', 'Listings Reports', 'Leads Reports', 
    'Viewing Reports', 'Commission Reports', 'Activity Reports'
  ];

  const mockReports = MOCK_REPORTS.filter(r => activeTab === 'All' || r.type === activeTab);

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER & QUICK ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Reports</h2>
          <p className="text-sm text-ink/60">Analyze your business performance and export professional reports.</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <GhostButton size="sm" onClick={() => handleAction('Print Report', 'print_report')}><Printer className="h-4 w-4 mr-2"/> Print Report</GhostButton>
          <GhostButton size="sm" onClick={() => handleAction('Export CSV', 'export_csv')}><FileDown className="h-4 w-4 mr-2"/> Export CSV</GhostButton>
          <GhostButton size="sm" onClick={() => handleAction('Export PDF', 'export_pdf')}><Download className="h-4 w-4 mr-2"/> Export PDF</GhostButton>
          <GoldButton size="sm" onClick={() => handleAction('Generate Report', 'generate_report')}><Plus className="h-4 w-4 mr-2"/> Generate Report</GoldButton>
        </div>
      </div>

      {/* SUMMARY KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: 'Total Reports', value: '124', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Sales This Month', value: '₦85M', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Closed Deals', value: '3', icon: CheckCircle2, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { label: 'Commission Earned', value: '₦2.4M', icon: Wallet, color: 'text-gold-400', bg: 'bg-gold-400/10' },
          { label: 'Active Listings', value: '18', icon: Building2, color: 'text-rose-400', bg: 'bg-rose-400/10' },
        ].map((stat, i) => (
          <KPICard 
            key={i}
            title={stat.label}
            value={stat.value}
            icon={stat.icon}
            iconColor={stat.color}
            backgroundColor="bg-white/5"
            hoverEffect="highlight"
            iconBorder={true}
            valueTypography="heading-xl"
            labelTypography="small"
            padding="p-4"
          />
        ))}
      </div>

      {/* ANALYTICS (Mini Charts) */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: 'Sales Trend', value: '+12%', icon: BarChart3 },
          { label: 'Commission Trend', value: '+8%', icon: TrendingUp },
          { label: 'Lead Conversion', value: '18%', icon: Users },
          { label: 'Property Performance', value: 'Top 5%', icon: Building2 },
          { label: 'Monthly Revenue', value: '₦85M', icon: Wallet },
        ].map((chart, i) => (
           <div key={i} className="rounded-xl border border-white/5 bg-navy-900/30 p-4 flex items-center gap-3">
             <div className="h-8 w-8 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 shrink-0">
               <chart.icon className="h-4 w-4" />
             </div>
             <div>
               <div className="text-[10px] text-ink/50 uppercase tracking-wider">{chart.label}</div>
               <div className="font-bold text-cream text-sm">{chart.value}</div>
             </div>
           </div>
        ))}
      </div>

      {/* FILTERS & CATEGORIES */}
      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-4 lg:p-6 space-y-6">
        
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {reportCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === cat 
                  ? 'bg-gold-400 text-navy-900 shadow-md shadow-gold-400/20' 
                  : 'bg-white/5 text-ink/60 hover:bg-white/10 hover:text-cream'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
           <div className="lg:col-span-2 relative">
             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
             <input type="text" placeholder="Search reports..." className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-9 pr-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none" />
           </div>
           
           <div className="relative">
             <select className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-3 pr-8 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
               <option value="" disabled selected>Date Range</option>
               <option>Last 7 Days</option>
               <option>Last 30 Days</option>
               <option>This Quarter</option>
               <option>This Year</option>
             </select>
             <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40 pointer-events-none" />
           </div>

           <div className="relative">
             <select className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-3 pr-8 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
               <option value="" disabled selected>Property Type</option>
               <option>Residential</option>
               <option>Commercial</option>
               <option>Land</option>
             </select>
             <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40 pointer-events-none" />
           </div>

           <div className="relative">
             <select className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-3 pr-8 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
               <option value="" disabled selected>Status / Client / Location</option>
               <option>Active</option>
               <option>Pending</option>
               <option>Lagos</option>
             </select>
             <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40 pointer-events-none" />
           </div>

           <div className="relative">
             <select className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-3 pr-8 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none">
               <option value="" disabled selected>Sort By</option>
               <option>Newest</option>
               <option>Oldest</option>
               <option>Highest Revenue</option>
               <option>Highest Commission</option>
             </select>
             <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40 pointer-events-none" />
           </div>
        </div>

        {/* REPORT TABLE */}
        {mockReports.length > 0 ? (
          <DataTable
            data={mockReports}
            keyExtractor={(report) => report.id}
            columns={[
              {
                header: "Report Name",
                render: (report: PerformanceReport) => (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-gold-400 shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-cream truncate max-w-[200px] sm:max-w-xs">{report.title}</span>
                  </div>
                )
              },
              {
                header: "Category",
                render: (report: PerformanceReport) => <span className="text-ink/80 bg-white/5 px-2 py-1 rounded-md text-[11px] whitespace-nowrap">{report.type}</span>
              },
              {
                header: "Date Generated",
                render: (report: PerformanceReport) => <span className="text-ink/80 whitespace-nowrap"><CalendarIcon className="h-3 w-3 inline mr-1 opacity-50"/> {report.date}</span>
              },
              {
                header: "Status",
                render: (report: PerformanceReport) => (
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${
                    report.status === 'Generated' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10' :
                    report.status === 'Processing' ? 'text-amber-400 border-amber-400/20 bg-amber-400/10' :
                    'text-ink/60 border-white/10 bg-white/5'
                  }`}>
                    {report.status}
                  </span>
                )
              },
              {
                header: "Last Updated",
                render: (report: PerformanceReport) => <span className="text-ink/60 text-xs whitespace-nowrap"><Clock className="h-3 w-3 inline mr-1 opacity-50"/> {report.updated}</span>
              },
              {
                header: <div className="text-right">Actions</div>,
                className: "text-right",
                render: (report: PerformanceReport) => (
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleAction('Download PDF', 'download_pdf', report)} className="p-1.5 text-ink/40 hover:text-gold-400 hover:bg-gold-400/10 rounded-md transition-colors" title="Download PDF">
                      <Download className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleAction('View Details', 'view_details', report)} className="p-1.5 text-ink/40 hover:text-gold-400 hover:bg-gold-400/10 rounded-md transition-colors" title="View Details">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleAction('More Options', 'more_options', report)} className="p-1.5 text-ink/40 hover:text-cream hover:bg-white/5 rounded-md transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                )
              }
            ]}
          />
        ) : (
          <div className="py-12">
            <EmptyState
              icon={<FileText className="h-12 w-12 text-gold-400" />}
              title="No reports available."
              description="You haven't generated any reports matching the selected filters yet."
              actionLabel="Generate Report"
              onAction={() => {}}
            />
          </div>
        )}
      </div>

      <EnterpriseDetailDrawer
        isOpen={!!activeWorkflow}
        onClose={() => setActiveWorkflow(null)}
        title={activeWorkflow?.title || 'Workflow'}
        footerActions={
          <GoldButton onClick={executeWorkflow} className="w-full justify-center">Confirm Action</GoldButton>
        }
      >
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-white/10 bg-navy-900">
            <h4 className="text-sm font-semibold text-cream mb-2">Workflow Details</h4>
            <p className="text-sm text-ink/60 leading-relaxed">
              You are about to execute the <strong>{activeWorkflow?.type}</strong> workflow. 
              Please review the action details below and confirm to integrate with the backend system.
            </p>
          </div>
          {activeWorkflow?.data && (
            <div className="p-4 rounded-xl border border-white/10 bg-navy-900/50">
              <h4 className="text-sm font-semibold text-cream mb-4">Context Data</h4>
              <div className="space-y-2 text-sm text-ink/80">
                {Object.entries(activeWorkflow.data).map(([key, value]) => {
                  if (typeof value === 'string' || typeof value === 'number') {
                    return (
                      <div key={key} className="flex justify-between border-b border-white/5 pb-2">
                        <span className="capitalize">{key}</span>
                        <span className="font-medium text-cream">{value}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      </EnterpriseDetailDrawer>
    </div>
  );
}
