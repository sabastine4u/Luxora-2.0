import { useState } from 'react';
import { FileText, Download, Calendar, Filter, Clock, Star, BarChart3, Archive, Eye } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { StatusBadge } from './shared/StatusBadge';
import { ReportPreviewModal } from './modals/ReportPreviewModal';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<Record<string, unknown> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const reportsList = [
    { id: 'REP-001', name: 'Q3 Enterprise Financials', type: 'Financial', author: 'Sarah Jacobs', date: 'Oct 05, 2025', status: 'Generated' },
    { id: 'REP-002', name: 'Global Security Audit', type: 'Intelligence', author: 'Musa Bello', date: 'Oct 04, 2025', status: 'Review' },
    { id: 'REP-003', name: 'Vendor Compliance 2025', type: 'Procurement', author: 'Chidi Okafor', date: 'Oct 01, 2025', status: 'Generated' },
    { id: 'REP-004', name: 'Workforce Scaling Plan', type: 'HR', author: 'System', date: 'Sep 28, 2025', status: 'Generated' },
    { id: 'REP-005', name: 'Property Portfolio Yield', type: 'Property', author: 'Aisha Lawal', date: 'Sep 25, 2025', status: 'Generated' },
  ];

  const scheduledReports = [
    { title: 'Weekly Performance Digest', time: 'Every Monday, 08:00 AM', desc: 'Sent to Executive Board', icon: Calendar, color: 'text-blue-400' },
    { title: 'Monthly Financial Summary', time: '1st of Month, 09:00 AM', desc: 'Sent to Finance Committee', icon: DollarSign, color: 'text-emerald-400' },
    { title: 'Quarterly Audit Log', time: 'Last day of Quarter', desc: 'Sent to Compliance', icon: ShieldAlert, color: 'text-gold-400' },
  ];

  const handleRowClick = (report: Record<string, unknown>) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Enterprise Reports"
        subtitle="Executive reporting workspace, analytics exports, and scheduled automated insights."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Manage Schedule
            </GhostButton>
            <GoldButton className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Generate New Report
            </GoldButton>
          </div>
        }
      />

      {/* Reporting Analytics KPIs */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Reports Generated"
          value="1,248"
          trend="+156 this month"
          trendColor="text-emerald-400"
          icon={FileText}
          footer={<div className="text-xs text-ink/60">Across all departments</div>}
        />
        <KPICard
          title="Scheduled Tasks"
          value="42"
          trend="All systems active"
          trendColor="text-emerald-400"
          icon={Clock}
          footer={<div className="text-xs text-ink/60">Automated distributions</div>}
        />
        <KPICard
          title="Executive Downloads"
          value="315"
          trend="High engagement"
          trendColor="text-emerald-400"
          icon={Download}
          footer={<div className="text-xs text-ink/60">Past 30 days</div>}
        />
        <KPICard
          title="Export Volume"
          value="1.2 TB"
          trend="Storage optimal"
          trendColor="text-blue-400"
          icon={Archive}
          footer={<div className="text-xs text-ink/60">Data warehouse size</div>}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Reporting Activity Dashboard */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-gold-400" /> Generation Activity
              </h3>
              <div className="flex-1 flex flex-col justify-end space-y-4">
                <div className="flex items-end gap-2 h-32">
                  {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                    <div key={i} className="flex-1 bg-navy-900 rounded-t-sm relative group">
                      <div className="absolute bottom-0 w-full bg-gold-400 rounded-t-sm transition-all duration-300" style={{ height: `${h}%` }}></div>
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-navy-950 text-cream text-[10px] py-1 px-2 rounded whitespace-nowrap z-10 transition-opacity">
                        {h} Reports
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-ink/60 font-medium uppercase tracking-wider">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>
            </div>

            {/* Favorite & Frequent Reports */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" /> Frequently Generated
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Weekly Financial Consolidation', views: 145 },
                  { name: 'Enterprise Risk Assessment', views: 98 },
                  { name: 'Global Headcount & Payroll', views: 82 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-navy-900/50 hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-gold-400" />
                      <span className="text-sm font-medium text-cream">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">{item.views} Views</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="font-heading text-lg font-semibold text-cream">Report Archive</h3>
              <DataTableToolbar
                searchValue=""
                onSearchChange={() => {}}
                searchPlaceholder="Search reports by ID or name..."
                actions={
                  <div className="flex gap-2">
                    <GhostButton className="px-3 flex items-center gap-2"><Filter className="h-4 w-4" /> Filter</GhostButton>
                  </div>
                }
              />
            </div>

            <DataTable
              data={reportsList}
              keyExtractor={(report) => String(report.id)}
              columns={[
                {
                  header: "Report ID",
                  render: (report) => <span className="font-mono text-sm text-ink/60">{String(report.id)}</span>
                },
                {
                  header: "Name",
                  render: (report) => (
                    <div className="font-semibold text-cream flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gold-400" /> {String(report.name)}
                    </div>
                  )
                },
                {
                  header: "Type",
                  render: (report) => (
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-900/50 px-2.5 py-0.5 text-xs text-ink/60">
                      {String(report.type)}
                    </span>
                  )
                },
                {
                  header: "Author",
                  render: (report) => <span className="text-ink/60">{String(report.author)}</span>
                },
                {
                  header: "Status",
                  render: (report) => <StatusBadge status={String(report.status)} />
                },
                {
                  header: <div className="text-right">Actions</div>,
                  className: "text-right",
                  render: (report) => (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRowClick(report); }}
                        className="text-gold-400 hover:text-gold-300 text-sm font-medium flex items-center gap-1"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-ink/60 hover:text-cream text-sm font-medium flex items-center gap-1" title="Download">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  )
                }
              ]}
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-400" /> Recent Downloads
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Q3 Financials.pdf', time: '10 mins ago' },
                { name: 'Security_Audit.csv', time: '1 hour ago' },
                { name: 'Workforce_Data.xlsx', time: '2 hours ago' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="h-4 w-4 text-ink/40 shrink-0" />
                    <span className="text-sm text-cream truncate">{item.name}</span>
                  </div>
                  <span className="text-xs text-ink/60 whitespace-nowrap ml-2">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <ActivityTimeline
              title="Scheduled Tasks"
              items={scheduledReports}
            />
            <GhostButton className="w-full mt-4 flex items-center justify-center gap-2 text-xs">
              View Calendar <Calendar className="h-3 w-3" />
            </GhostButton>
          </div>
        </div>
      </div>

      <ReportPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        report={selectedReport}
      />
    </div>
  );
}

// Ensure icons used in scheduledReports are imported correctly or replace DollarSign/ShieldAlert. 
// Adding missing imports locally above:
import { DollarSign, ShieldAlert } from 'lucide-react';
