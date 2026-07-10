import { Wrench, AlertCircle, Plus } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

export default function Maintenance() {
  const requests = [
    { id: 'MNT-102', issue: 'Leaking AC Unit', property: 'Lekki Phase 1 Apt', tenant: 'Sarah Jenkins', priority: 'High', status: 'In Progress', date: 'Oct 05, 2025' },
    { id: 'MNT-103', issue: 'Broken Door Hinge', property: 'Victoria Island Villa', tenant: 'Dr. Ayo Balogun', priority: 'Low', status: 'Pending', date: 'Oct 06, 2025' },
    { id: 'MNT-104', issue: 'Water Heater Malfunction', property: 'Abuja Central Office', tenant: 'TechFlow Ltd', priority: 'Urgent', status: 'Resolved', date: 'Oct 02, 2025' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Maintenance Requests</h2>
          <p className="text-sm text-ink/60">Manage tenant repair requests and assign vendors.</p>
        </div>
        <GoldButton className="flex items-center gap-2"><Plus className="h-4 w-4" /> Create Ticket</GoldButton>
      </div>

      <DataTableToolbar
        searchPlaceholder="Search tickets..."
        actions={
          <GhostButton className="px-4">Assign Vendor</GhostButton>
        }
      />

      <DataTable
        data={requests}
        keyExtractor={(req) => req.id}
        columns={[
          {
            header: "Ticket ID",
            render: (req) => <span className="font-medium text-cream">{req.id}</span>
          },
          {
            header: "Issue",
            render: (req) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <Wrench className="h-4 w-4 text-ink/40" /> {req.issue}
              </div>
            )
          },
          {
            header: "Property & Tenant",
            render: (req) => (
              <div>
                <div className="font-medium text-cream">{req.property}</div>
                <div className="text-xs text-ink/60">{req.tenant}</div>
              </div>
            )
          },
          {
            header: "Date Logged",
            render: (req) => <span className="text-ink/60">{req.date}</span>
          },
          {
            header: "Priority",
            render: (req) => (
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${req.priority === 'Urgent' ? 'text-rose-400 bg-rose-400/10 border-rose-400/20' : req.priority === 'High' ? 'text-orange-400 bg-orange-400/10 border-orange-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                {req.priority === 'Urgent' && <AlertCircle className="h-3 w-3 mr-1" />} {req.priority}
              </span>
            )
          },
          {
            header: "Status",
            render: (req) => (
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${req.status === 'Resolved' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : req.status === 'In Progress' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                {req.status}
              </span>
            )
          }
        ]}
      />
    </div>
  );
}
