import { ShieldCheck, CheckCircle, XCircle, Filter } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

export default function Compliance() {
  const kycRequests = [
    { id: 'KYC-501', user: 'James O.', type: 'Owner KYC', status: 'Pending Review', submitted: '2 hours ago' },
    { id: 'KYC-502', user: 'Atlas Realty', type: 'Agency Reg', status: 'Requires Info', submitted: '5 hours ago' },
    { id: 'KYC-503', user: 'Bisi W.', type: 'Agent KYC', status: 'Pending Review', submitted: '1 day ago' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Compliance & KYC</h2>
          <p className="text-sm text-ink/60">Review identity verification and regulatory compliance documents.</p>
        </div>
        <DataTableToolbar
          searchValue=""
          onSearchChange={() => {}}
          searchPlaceholder="Search ID..."
          actions={
            <GhostButton className="px-3"><Filter className="h-4 w-4" /></GhostButton>
          }
        />
      </div>

      <DataTable
        data={kycRequests}
        keyExtractor={(req) => req.id}
        columns={[
          {
            header: "ID",
            render: (req) => <span className="font-medium text-cream">{req.id}</span>
          },
          {
            header: "User/Entity",
            render: (req) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-ink/40" /> {req.user}
              </div>
            )
          },
          {
            header: "Type",
            render: (req) => <span className="text-ink/60">{req.type}</span>
          },
          {
            header: "Submitted",
            render: (req) => <span className="text-ink/60">{req.submitted}</span>
          },
          {
            header: "Status",
            render: (req) => (
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${req.status === 'Pending Review' ? 'text-gold-400 bg-gold-400/10 border-gold-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                {req.status}
              </span>
            )
          },
          {
            header: <div className="text-right">Actions</div>,
            className: "text-right",
            render: () => (
              <div className="flex justify-end gap-2">
                <button className="text-emerald-400 hover:bg-emerald-400/10 p-2 rounded-lg transition-colors"><CheckCircle className="h-4 w-4" /></button>
                <button className="text-rose-400 hover:bg-rose-400/10 p-2 rounded-lg transition-colors"><XCircle className="h-4 w-4" /></button>
              </div>
            )
          }
        ]}
      />
    </div>
  );
}
