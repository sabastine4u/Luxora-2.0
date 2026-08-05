import { useState, useMemo } from 'react';
import { CheckCircle, AlertTriangle, Clock, FileText } from 'lucide-react';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { ReportDetailModal } from './ReportDetailModal';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { adminComplaints } from '../../../data/adminData';
import type { AdminComplaint } from '../../../types/admin';
import { ComplaintTable } from '../../../components/dashboard/shared/tables/ComplaintTable';

export default function Complaints() {
  const [localComplaints, setLocalComplaints] = useState<AdminComplaint[]>(adminComplaints);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<AdminComplaint | null>(null);

  const filteredComplaints = useMemo(() => {
    if (!searchQuery) return localComplaints;
    const lowerQuery = searchQuery.toLowerCase();
    return localComplaints.filter(c => 
      c.id.toLowerCase().includes(lowerQuery) ||
      c.type.toLowerCase().includes(lowerQuery) ||
      c.user.toLowerCase().includes(lowerQuery) ||
      c.target.toLowerCase().includes(lowerQuery)
    );
  }, [localComplaints, searchQuery]);

  const handleResolve = (id: string) => {
    setLocalComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'Resolved' } : c));
  };

  const handleClose = (id: string) => {
    setLocalComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'Closed' } : c));
  };

  const handleEscalate = (id: string) => {
    setLocalComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'Escalated', priority: 'High' } : c));
  };

  const openTickets = localComplaints.filter(c => c.status === 'Open' || c.status === 'In Progress').length;
  const escalatedTickets = localComplaints.filter(c => c.status === 'Escalated').length;
  const resolvedTickets = localComplaints.filter(c => c.status === 'Resolved').length;
  
  const highSev = localComplaints.filter(c => c.priority === 'High').length;
  const medSev = localComplaints.filter(c => c.priority === 'Medium').length;
  const lowSev = localComplaints.filter(c => c.priority === 'Low').length;

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
        <KPICard title="My Open Tickets" value={openTickets} icon={FileText} trend="Action Required" trendColor="text-yellow-400" iconColor="text-blue-400" />
        <KPICard title="Escalated to Me" value={escalatedTickets} icon={AlertTriangle} trend="High Priority" trendColor="text-rose-400" iconColor="text-rose-400" backgroundColor="bg-rose-400/10" />
        <KPICard title="Avg Resolution Time" value="4.2h" icon={Clock} trend="-1.5h vs last week" trendColor="text-emerald-400" iconColor="text-emerald-400" />
        <KPICard title="Tickets Resolved Today" value={resolvedTickets} icon={CheckCircle} trend="Updated dynamically" trendColor="text-emerald-400" iconColor="text-purple-400" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            <h3 className="font-heading text-lg font-bold text-cream">Report Severity Distribution</h3>
          </div>
          <SegmentedProgressBar
            segments={[
              { label: 'High Severity', value: highSev, color: 'bg-rose-400' },
              { label: 'Medium Severity', value: medSev, color: 'bg-yellow-400' },
              { label: 'Low Severity', value: lowSev, color: 'bg-blue-400' },
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
              { label: 'Resolved (Closed)', value: resolvedTickets, color: 'bg-emerald-400' },
              { label: 'Open (In Progress)', value: openTickets, color: 'bg-yellow-400' },
              { label: 'Escalated', value: escalatedTickets, color: 'bg-rose-400' },
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

      <ComplaintTable
        data={filteredComplaints}
        mode="operational"
        onReview={setSelectedReport}
        onResolve={(ticket) => handleResolve(ticket.id)}
        onClose={(ticket) => handleClose(ticket.id)}
      />

      <ReportDetailModal 
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
        onResolve={handleResolve}
        onEscalate={handleEscalate}
        onCloseTicket={handleClose}
      />
    </div>
  );
}
