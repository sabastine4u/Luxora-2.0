import { useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { RejectionReasonModal } from './RejectionReasonModal';
import { VerificationDetailModal } from './VerificationDetailModal';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { adminVerifications } from '../../../data/adminData';
import type { AdminVerification } from '../../../types/admin';
import { VerificationTable } from '../../../components/dashboard/shared/tables/VerificationTable';

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

      <VerificationTable 
        data={adminVerifications}
        mode="operational"
        selectedRows={selectedRows}
        onToggleSelection={(id) => {
          const newSelected = new Set(selectedRows);
          if (newSelected.has(id)) newSelected.delete(id);
          else newSelected.add(id);
          setSelectedRows(newSelected);
        }}
        onToggleAll={() => {
          if (selectedRows.size === adminVerifications.length) setSelectedRows(new Set());
          else setSelectedRows(new Set(adminVerifications.map(v => v.id)));
        }}
        onReview={setPreviewItem}
        onApprove={() => setApprovalModalOpen(true)}
        onReject={() => setRejectionModalOpen(true)}
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
