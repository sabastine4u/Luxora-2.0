import { Clock, FileText, AlertTriangle } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

export default function LeaseTracking() {
  const leases = [
    { id: 'LSE-001', tenant: 'Dr. Ayo Balogun', property: 'Victoria Island Villa', start: 'Jan 01, 2025', end: 'Dec 31, 2026', status: 'Active' },
    { id: 'LSE-002', tenant: 'Sarah Jenkins', property: 'Lekki Studio Apt', start: 'Dec 01, 2024', end: 'Nov 30, 2025', status: 'Expiring Soon' },
    { id: 'LSE-003', tenant: 'TechFlow Ltd', property: 'Abuja Central Office', start: 'Feb 01, 2023', end: 'Jan 31, 2028', status: 'Active' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Lease Renewals & Tracking</h2>
          <p className="text-sm text-ink/60">Monitor upcoming lease expirations to minimize vacancy periods.</p>
        </div>
      </div>

      <DataTableToolbar
        searchPlaceholder="Search leases..."
        actions={
          <GhostButton className="px-4"><Clock className="h-4 w-4 mr-2" /> Send Renewal Offer</GhostButton>
        }
      />

      <DataTable
        data={leases}
        keyExtractor={(lease) => lease.id}
        columns={[
          {
            header: "Lease ID",
            render: (lease) => <span className="font-medium text-cream">{lease.id}</span>
          },
          {
            header: "Tenant Name",
            render: (lease) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <FileText className="h-4 w-4 text-ink/40" /> {lease.tenant}
              </div>
            )
          },
          {
            header: "Property",
            render: (lease) => <span className="text-ink/60">{lease.property}</span>
          },
          {
            header: "Start Date",
            render: (lease) => <span className="text-ink/60">{lease.start}</span>
          },
          {
            header: "End Date",
            render: (lease) => <span className="text-ink/60 font-medium">{lease.end}</span>
          },
          {
            header: "Status",
            render: (lease) => (
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${lease.status === 'Active' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                {lease.status === 'Expiring Soon' && <AlertTriangle className="h-3 w-3 mr-1" />}
                {lease.status}
              </span>
            )
          }
        ]}
      />
    </div>
  );
}
