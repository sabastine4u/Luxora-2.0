import { useState } from 'react';
import { CheckCircle, XCircle, MessageSquare, SearchX, FileText, AlertTriangle, Clock } from 'lucide-react';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { ReportDetailModal } from './ReportDetailModal';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { adminComplaints } from '../../../data/adminData';
import type { AdminComplaint } from '../../../types/admin';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';

export default function Complaints() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<AdminComplaint | null>(null);

  return (
    <div className="space-y-6">
      <DashboardHeader 
        name="Reported Listings & Tickets"
        subtitle="Resolve user disputes, reported listings, and platform issues."
      />

      <div className="mb-2">
        <h2 className="text-sm font-semibold text-ink/50 uppercase tracking-wider">Moderator Workload</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPICard title="My Open Tickets" value="12" icon={FileText} trend="Action Required" trendColor="text-yellow-400" iconColor="text-blue-400" />
        <KPICard title="Escalated to Me" value="3" icon={AlertTriangle} trend="High Priority" trendColor="text-rose-400" iconColor="text-rose-400" backgroundColor="bg-rose-400/10" />
        <KPICard title="Avg Resolution Time" value="4.2h" icon={Clock} trend="-1.5h vs last week" trendColor="text-emerald-400" iconColor="text-emerald-400" />
        <KPICard title="Tickets Resolved Today" value="28" icon={CheckCircle} trend="+5 vs yesterday" trendColor="text-emerald-400" iconColor="text-purple-400" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            <h3 className="font-heading text-lg font-bold text-cream">Report Severity Distribution</h3>
          </div>
          <SegmentedProgressBar
            segments={[
              { label: 'High Severity', value: 15, color: 'bg-rose-400' },
              { label: 'Medium Severity', value: 45, color: 'bg-yellow-400' },
              { label: 'Low Severity', value: 40, color: 'bg-blue-400' },
            ]}
          />
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <h3 className="font-heading text-lg font-bold text-cream">Resolution & Status Overview</h3>
          </div>
          <SegmentedProgressBar
            segments={[
              { label: 'Resolved (Closed)', value: 428, color: 'bg-emerald-400' },
              { label: 'Open (In Progress)', value: 57, color: 'bg-yellow-400' },
              { label: 'Escalated', value: 12, color: 'bg-rose-400' },
            ]}
          />
        </div>
      </div>

      <DataTableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search tickets..."
        showFilter
      />

      <DataTable
        data={adminComplaints}
        keyExtractor={(ticket) => ticket.id}
        columns={[
          {
            header: "Ticket ID",
            render: (ticket: AdminComplaint) => <span className="font-medium text-cream">{ticket.id}</span>
          },
          {
            header: "Type / Priority",
            render: (ticket: AdminComplaint) => (
              <>
                <div className="font-semibold text-cream">{ticket.type}</div>
                <div className={`text-xs mt-0.5 ${ticket.priority === 'High' ? 'text-rose-400' : ticket.priority === 'Medium' ? 'text-yellow-400' : 'text-blue-400'}`}>
                  {ticket.priority} Priority
                </div>
              </>
            )
          },
          {
            header: "Reported By",
            render: (ticket: AdminComplaint) => <span className="text-ink/60">{ticket.user}</span>
          },
          {
            header: "Target",
            render: (ticket: AdminComplaint) => (
              <div className="flex flex-col gap-1">
                <div className="w-fit">
                  <EnterpriseStatusBadge status={ticket.status} />
                </div>
                {ticket.priority === 'High' && (
                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase w-fit text-rose-400 bg-rose-400/10 border-rose-400/20">
                    High Priority
                  </span>
                )}
              </div>
            )
          },
          {
            header: <div className="text-right">Actions</div>,
            className: "text-right",
            render: (ticket: AdminComplaint) => (
              <div className="flex items-center justify-end gap-2">
                {ticket.status !== 'Resolved' && (
                  <button className="rounded-lg p-2 text-ink/40 hover:bg-emerald-400/10 hover:text-emerald-400 transition-colors" title="Mark Resolved">
                    <CheckCircle className="h-5 w-5" />
                  </button>
                )}
                <button className="rounded-lg p-2 text-ink/40 hover:bg-rose-400/10 hover:text-rose-400 transition-colors" title="Close Ticket">
                  <XCircle className="h-5 w-5" />
                </button>
                <GoldButton 
                  size="sm" 
                  className="ml-2 flex items-center gap-2"
                  onClick={() => setSelectedReport(ticket)}
                >
                  <MessageSquare className="h-4 w-4" /> View Thread
                </GoldButton>
              </div>
            )
          }
        ]}
        emptyState={
          <div className="flex flex-col items-center justify-center py-12 text-center bg-navy-900/50 rounded-xl border border-white/5 border-dashed">
            <SearchX className="h-12 w-12 text-ink/20 mb-4" />
            <h3 className="text-lg font-bold text-cream">No reports found</h3>
            <p className="text-sm text-ink/50 mt-1">All tickets have been processed or none match your criteria.</p>
          </div>
        }
      />

      <ReportDetailModal 
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        report={selectedReport as Record<string, unknown> | null}
      />
    </div>
  );
}
