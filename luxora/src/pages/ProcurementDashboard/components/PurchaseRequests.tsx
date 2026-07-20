import { FileCheck, CheckCircle, XCircle, Filter } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

import { useToast } from '../../../contexts/ToastContext';

export default function PurchaseRequests() {
  const { showToast } = useToast();
  const requests = [
    { id: 'PR-1023', department: 'IT Operations', item: 'MacBook Pro M3 (x3)', amount: '₦5,400,000', status: 'Pending Approval', date: 'Oct 02, 2025' },
    { id: 'PR-1024', department: 'Marketing', item: 'Event Booth Setup', amount: '₦1,200,000', status: 'Approved', date: 'Oct 01, 2025' },
    { id: 'PR-1025', department: 'HR', item: 'Ergonomic Chairs (x10)', amount: '₦850,000', status: 'Rejected', date: 'Sep 28, 2025' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Purchase Requests (PR)</h2>
          <p className="text-sm text-ink/60">Review and approve internal departmental requests.</p>
        </div>
        <DataTableToolbar
          searchValue=""
          onSearchChange={() => {}}
          searchPlaceholder="Search PRs..."
          actions={
            <GhostButton className="px-3"><Filter className="h-4 w-4" /></GhostButton>
          }
        />
      </div>

      <DataTable
        data={requests}
        keyExtractor={(pr) => pr.id}
        columns={[
          {
            header: "PR ID",
            render: (pr) => <span className="font-medium text-cream">{pr.id}</span>
          },
          {
            header: "Department",
            render: (pr) => <span className="text-ink/60">{pr.department}</span>
          },
          {
            header: "Requested Item",
            render: (pr) => (
              <div className="font-semibold text-cream flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-ink/40" /> {pr.item}
              </div>
            )
          },
          {
            header: "Est. Amount",
            render: (pr) => <span className="font-bold text-gold-400">{pr.amount}</span>
          },
          {
            header: "Status",
            render: (pr) => (
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${pr.status === 'Approved' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : pr.status === 'Pending Approval' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' : 'text-rose-400 bg-rose-400/10 border-rose-400/20'}`}>
                {pr.status}
              </span>
            )
          },
          {
            header: <div className="text-right">Actions</div>,
            className: "text-right",
            render: (pr) => (
              pr.status === 'Pending Approval' ? (
                <div className="flex justify-end gap-2">
                  <button 
                    className="text-emerald-400 hover:bg-emerald-400/10 p-2 rounded-lg transition-colors"
                    onClick={() => showToast({ type: 'info', title: 'Approve PR', description: 'PR approval will be available during backend integration.' })}
                  ><CheckCircle className="h-4 w-4" /></button>
                  <button 
                    className="text-rose-400 hover:bg-rose-400/10 p-2 rounded-lg transition-colors"
                    onClick={() => showToast({ type: 'info', title: 'Reject PR', description: 'PR rejection will be available during backend integration.' })}
                  ><XCircle className="h-4 w-4" /></button>
                </div>
              ) : (
                <button className="text-gold-400 hover:text-gold-300 font-medium text-xs transition-colors" onClick={() => showToast({ type: 'info', title: 'View PR Details', description: 'PR detail view will be available during backend integration.' })}>View</button>
              )
            )
          }
        ]}
      />
    </div>
  );
}
