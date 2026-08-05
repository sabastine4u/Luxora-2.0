import { useState } from 'react';
import { Building2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { RejectionReasonModal, type ReviewActionType } from './RejectionReasonModal';
import { ListingDetailModal } from './ListingDetailModal';
import { AgencyAssignmentModal } from './modals/AgencyAssignmentModal';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';

import { ROUTES } from '../../../constants/routes';
import { useNavigate } from 'react-router-dom';

import { adminListings } from '../../../data/adminData';
import type { AdminListing } from '../../../types/admin';
import { ListingTable } from '../../../components/dashboard/shared/tables/ListingTable';

export interface ListingsProps {
  pageTitle?: string;
  pageSubtitle?: string;
  mode?: 'operational' | 'oversight';
}

export default function Listings({
  pageTitle = "Verification Queue",
  pageSubtitle = "Review, verify, and approve property submissions before Agency Assignment.",
  mode = "operational"
}: ListingsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [actionType, setActionType] = useState<ReviewActionType>('reject');
  const [actionTarget, setActionTarget] = useState<string | null>(null);
  const [previewListing, setPreviewListing] = useState<AdminListing | null>(null);
  const [assignmentListing, setAssignmentListing] = useState<AdminListing | null>(null);
  const navigate = useNavigate();

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAll = () => {
    if (selectedRows.size === filteredListings.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredListings.map(l => l.id)));
    }
  };

  const handleReviewAction = (type: 'approve' | 'return' | 'hold' | 'reject') => {
    if (type === 'approve') {
      setApprovalModalOpen(true);
    } else {
      setActionType(type);
      setReasonModalOpen(true);
    }
  };

  const filteredListings = adminListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          listing.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const vStatus = listing.verification?.status || listing.status;
    const matchesStatus = statusFilter === 'All' || vStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <DashboardHeader 
        name={pageTitle}
        subtitle={pageSubtitle}
        actions={
          <GoldButton onClick={() => navigate(ROUTES.CREATE_LISTING)} className="flex items-center gap-2">
            Create Platform Listing
          </GoldButton>
        }
      />

      <div className="mb-2">
        <h2 className="text-sm font-semibold text-ink/50 uppercase tracking-wider">Verification Analytics</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Submissions" value="8,234" icon={Building2} trend="+42 this week" trendColor="text-emerald-400" />
        <KPICard title="Under Review" value="142" icon={Clock} trend="Needs Action" trendColor="text-yellow-400" iconColor="text-yellow-400" backgroundColor="bg-yellow-400/10" />
        <KPICard title="Approved Today" value="56" icon={CheckCircle} trend="Ready for Assignment" trendColor="text-emerald-400" iconColor="text-emerald-400" />
        <KPICard title="Returned / On Hold" value="12" icon={AlertTriangle} trend="Awaiting Owner" trendColor="text-rose-400" iconColor="text-rose-400" backgroundColor="bg-rose-400/10" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-heading text-lg font-bold text-cream">Review Progress & Distribution</h3>
          </div>
          <SegmentedProgressBar
            segments={[
              { label: 'Approved', value: 85, color: 'bg-emerald-400' },
              { label: 'Returned', value: 15, color: 'bg-rose-400' },
              { label: 'Under Review', value: 42, color: 'bg-yellow-400' },
            ]}
          />
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <ActivityTimeline 
            title="Recently Verified" 
            items={[
              { title: 'Lekki Phase 1 Duplex', desc: 'Ready for Assignment', time: '10 mins ago', color: 'text-emerald-400', icon: CheckCircle },
              { title: 'Skyline Penthouse', desc: 'Returned (Title Document)', time: '1 hour ago', color: 'text-yellow-400', icon: AlertTriangle },
            ]} 
          />
        </div>
      </div>
      
      {selectedRows.size > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl bg-gold-400/10 border border-gold-400/20 px-4 py-3 gap-4">
          <div className="flex items-center gap-4">
            <div className="text-sm font-semibold text-gold-400">
              {selectedRows.size} item{selectedRows.size !== 1 ? 's' : ''} selected
            </div>
            <div className="h-4 w-px bg-gold-400/30" />
            <button onClick={toggleAll} className="text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors">Select All</button>
            <button onClick={() => setSelectedRows(new Set())} className="text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors">Clear Selection</button>
          </div>
          <div className="flex items-center gap-2">
            <GhostButton 
              size="sm" 
              className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10"
              onClick={() => {
                setActionTarget('bulk');
                handleReviewAction('reject');
              }}
            >
              Reject Selected
            </GhostButton>
            <GoldButton 
              size="sm"
              onClick={() => {
                setActionTarget('bulk');
                handleReviewAction('approve');
              }}
            >
              Approve Selected
            </GoldButton>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search verification queue..."
        />
        <select 
          className="rounded-xl border border-white/10 bg-navy-900/50 py-2.5 px-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none min-w-[200px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Verification Statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="Under Review">Under Review</option>
          <option value="Returned for Correction">Returned for Correction</option>
          <option value="On Hold">On Hold</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <ListingTable
        data={filteredListings}
        mode={mode}
        selectedRows={selectedRows}
        onToggleSelection={toggleSelection}
        onToggleAll={toggleAll}
        onReview={(item) => setPreviewListing(item)}
        onApprove={(item) => {
          setActionTarget(item.id);
          handleReviewAction('approve');
        }}
        onReject={(item) => {
          setActionTarget(item.id);
          handleReviewAction('reject');
        }}
        onAssignAgency={(item) => setAssignmentListing(item)}
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
        title={actionTarget === 'bulk' ? `Approve ${selectedRows.size} Properties` : 'Approve Property'}
        message={actionTarget === 'bulk' 
          ? `Are you sure you want to approve these ${selectedRows.size} properties? They will be marked as 'Ready for Agency Assignment'.` 
          : "Are you sure you want to approve this property? It will be marked as 'Ready for Agency Assignment'."
        }
        confirmText="Approve for Assignment"
      />

      <RejectionReasonModal
        isOpen={reasonModalOpen}
        actionType={actionType}
        onClose={() => {
          setReasonModalOpen(false);
          setActionTarget(null);
        }}
        onConfirm={(reason, type) => {
          console.log(`${type} with reason:`, reason);
          setReasonModalOpen(false);
          if (actionTarget === 'bulk') setSelectedRows(new Set());
          setActionTarget(null);
        }}
      />

      <ListingDetailModal 
        key={previewListing?.id || 'modal'}
        isOpen={!!previewListing} 
        onClose={() => setPreviewListing(null)} 
        listing={previewListing} 
        onAction={(type) => {
          setPreviewListing(null);
          setTimeout(() => handleReviewAction(type), 150);
        }}
      />

      <AgencyAssignmentModal
        isOpen={!!assignmentListing}
        onClose={() => setAssignmentListing(null)}
        listing={assignmentListing}
        onAssign={(agencyId, notes) => {
          console.log(`Assigned to ${agencyId} with notes: ${notes}`);
          setAssignmentListing(null);
        }}
      />
    </div>
  );
}
