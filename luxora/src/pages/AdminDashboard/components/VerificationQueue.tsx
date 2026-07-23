import { useState } from 'react';
import { CheckCircle, XCircle, Eye, Clock, SearchX, AlertTriangle, ShieldAlert } from 'lucide-react';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { GoldButton } from '../../../components/ui/ui';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { RejectionReasonModal } from './RejectionReasonModal';
import { VerificationDetailModal } from './VerificationDetailModal';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { adminVerifications } from '../../../data/adminData';
import type { AdminVerification } from '../../../types/admin';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';

export default function VerificationQueue() {
  const [searchQuery, setSearchQuery] = useState('');
  const [previewItem, setPreviewItem] = useState<AdminVerification | null>(null);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [actionTarget, setActionTarget] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <DashboardHeader 
        name="Verification Center"
        subtitle="Review and process KYC documents for users and properties."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Pending Review" value="45" icon={Clock} trend="Action Required" trendColor="text-yellow-400" iconColor="text-yellow-400" backgroundColor="bg-yellow-400/10" />
        <KPICard title="Approved Today" value="128" icon={CheckCircle} trend="+15% vs yesterday" trendColor="text-emerald-400" iconColor="text-emerald-400" />
        <KPICard title="Rejected Today" value="12" icon={XCircle} trend="Normal Range" trendColor="text-emerald-400" iconColor="text-rose-400" backgroundColor="bg-rose-400/10" />
        <KPICard title="Queue Aging (>24h)" value="8" icon={AlertTriangle} trend="Critical Priority" trendColor="text-rose-400" iconColor="text-rose-400" backgroundColor="bg-rose-400/10" />
      </div>

      <DataTableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search queue..."
        showFilter
      />

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <h3 className="font-heading text-lg font-bold text-cream">Verification Completion Progress</h3>
          </div>
          <SegmentedProgressBar
            segments={[
              { label: 'Completed', value: 850, color: 'bg-emerald-400' },
              { label: 'In Progress', value: 120, color: 'bg-blue-400' },
              { label: 'Pending', value: 45, color: 'bg-yellow-400' },
            ]}
          />
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="h-5 w-5 text-rose-400" />
            <h3 className="font-heading text-lg font-bold text-cream">Risk Distribution</h3>
          </div>
          <SegmentedProgressBar
            segments={[
              { label: 'Low Risk', value: 75, color: 'bg-emerald-400' },
              { label: 'Medium Risk', value: 15, color: 'bg-yellow-400' },
              { label: 'High Risk', value: 10, color: 'bg-rose-400' },
            ]}
          />
        </div>
      </div>

      <DataTable
        data={adminVerifications}
        keyExtractor={(item) => item.id}
        columns={[
          {
            header: "ID",
            render: (item) => <span className="font-medium text-cream">{item.id}</span>
          },
          {
            header: "Type",
            render: (item) => (
              <div className="w-fit">
                <EnterpriseStatusBadge status={item.status} />
              </div>
            )
          },
          {
            header: "Submission",
            render: (item) => (
              <>
                <div className="font-semibold text-cream">{item.title}</div>
                <div className="text-xs text-ink/50">{item.date}</div>
              </>
            )
          },
          {
            header: "Submitted By",
            render: (item) => <span className="text-ink/60">{item.submitter}</span>
          },
          {
            header: <div className="text-right">Actions</div>,
            className: "text-right",
            render: (item) => (
              <div className="flex items-center justify-end gap-2">
                <button className="rounded-lg p-2 text-ink/40 hover:bg-emerald-400/10 hover:text-emerald-400 transition-colors" title="Approve">
                  <CheckCircle className="h-5 w-5" />
                </button>
                <button className="rounded-lg p-2 text-ink/40 hover:bg-rose-400/10 hover:text-rose-400 transition-colors" title="Reject">
                  <XCircle className="h-5 w-5" />
                </button>
                <GoldButton size="sm" className="ml-2 flex items-center gap-2" onClick={() => setPreviewItem(item)}>
                  <Eye className="h-4 w-4" /> Review
                </GoldButton>
              </div>
            )
          }
        ]}
        emptyState={
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <SearchX className="h-12 w-12 text-ink/20 mb-4" />
            <h3 className="text-lg font-bold text-cream">Queue is empty</h3>
            <p className="text-sm text-ink/50 mt-1">All verification documents have been processed.</p>
          </div>
        }
      />

      <VerificationDetailModal 
        isOpen={!!previewItem} 
        onClose={() => setPreviewItem(null)} 
        item={previewItem as Record<string, unknown> | null}
        onApprove={() => setApprovalModalOpen(true)}
        onReject={() => setRejectionModalOpen(true)}
      />

      <ConfirmationModal
        isOpen={approvalModalOpen}
        onClose={() => {
          setApprovalModalOpen(false);
          setActionTarget(null);
        }}
        onConfirm={() => {
          setApprovalModalOpen(false);
          if (actionTarget === 'bulk') setSelectedRows(new Set());
          setActionTarget(null);
        }}
        title={actionTarget === 'bulk' ? `Approve ${selectedRows.size} Verifications` : 'Approve Verification'}
        message={actionTarget === 'bulk' ? `Are you sure you want to approve these ${selectedRows.size} verification requests?` : "Are you sure you want to approve this verification document? The user will be notified of their new verified status."}
      />

      <RejectionReasonModal
        isOpen={rejectionModalOpen}
        onClose={() => setRejectionModalOpen(false)}
        onConfirm={(reason) => {
          console.log('Rejected document:', reason);
          setRejectionModalOpen(false);
          setPreviewItem(null);
        }}
        title="Reject Document"
      />
    </div>
  );
}
