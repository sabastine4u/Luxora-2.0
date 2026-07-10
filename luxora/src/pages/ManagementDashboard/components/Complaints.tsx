import { Mail, MessageSquare, Filter } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

export default function Complaints() {
  const complaints = [
    { id: 'CMP-201', subject: 'Agent Unresponsive', reporter: 'Buyer (BU-142)', status: 'Open', priority: 'High', date: '1 hour ago' },
    { id: 'CMP-202', subject: 'Listing Information Incorrect', reporter: 'Guest', status: 'In Progress', priority: 'Medium', date: '3 hours ago' },
    { id: 'CMP-203', subject: 'Platform Glitch on Checkout', reporter: 'Owner (OW-451)', status: 'Open', priority: 'Low', date: '1 day ago' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">User Complaints</h2>
          <p className="text-sm text-ink/60">Manage reports and dispute resolution.</p>
        </div>
        <DataTableToolbar
          searchValue=""
          onSearchChange={() => {}}
          searchPlaceholder="Search tickets..."
          actions={
            <GhostButton className="px-3"><Filter className="h-4 w-4" /></GhostButton>
          }
        />
      </div>

      <DataTable
        data={complaints}
        keyExtractor={(comp) => comp.id}
        columns={[
          {
            header: "Ticket ID",
            render: (comp) => <span className="font-medium text-cream">{comp.id}</span>
          },
          {
            header: "Subject",
            render: (comp) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-ink/40" /> {comp.subject}
              </div>
            )
          },
          {
            header: "Reporter",
            render: (comp) => <span className="text-ink/60">{comp.reporter}</span>
          },
          {
            header: "Priority",
            render: (comp) => (
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${comp.priority === 'High' ? 'text-rose-400 bg-rose-400/10 border-rose-400/20' : comp.priority === 'Medium' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                {comp.priority}
              </span>
            )
          },
          {
            header: "Status",
            render: (comp) => <span className="text-ink/60">{comp.status}</span>
          },
          {
            header: <div className="text-right">Actions</div>,
            className: "text-right",
            render: () => (
              <button className="text-gold-400 hover:bg-gold-400/10 p-2 rounded-lg transition-colors"><Mail className="h-4 w-4" /></button>
            )
          }
        ]}
      />
    </div>
  );
}
