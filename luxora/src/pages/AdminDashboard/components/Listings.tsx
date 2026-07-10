import { useState } from 'react';
import { Building2, MoreHorizontal, CheckCircle, XCircle, Eye, Clock, AlertTriangle } from 'lucide-react';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { ApprovalConfirmationModal } from './ApprovalConfirmationModal';
import { RejectionReasonModal } from './RejectionReasonModal';
import { ListingDetailModal } from './ListingDetailModal';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';

const mockListings = [
  { id: 'LST-801', title: 'Skyline Penthouse', owner: 'Aliko Dangote', location: 'Ikoyi, Lagos', price: '₦450M', status: 'Pending Review', priority: 'High' },
  { id: 'LST-802', title: 'Banana Island Mansion', owner: 'Tony Elumelu', location: 'Banana Island', price: '₦1.2B', status: 'Approved', priority: 'Normal' },
  { id: 'LST-803', title: 'Lekki Phase 1 Duplex', owner: 'Femi Otedola', location: 'Lekki, Lagos', price: '₦200M', status: 'Rejected', priority: 'Normal' },
];

export default function Listings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [actionTarget, setActionTarget] = useState<string | null>(null);
  const [previewListing, setPreviewListing] = useState<Record<string, unknown> | null>(null);

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
    if (selectedRows.size === mockListings.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(mockListings.map(l => l.id)));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Rejected': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      case 'Pending Review': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-ink/60 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        name="Listing Moderation"
        subtitle="Review and moderate property listings before they go live."
      />

      <div className="mb-2">
        <h2 className="text-sm font-semibold text-ink/50 uppercase tracking-wider">Moderation Analytics</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Listings" value="8,234" icon={Building2} trend="+42 this week" trendColor="text-emerald-400" />
        <KPICard title="Pending Review" value="142" icon={Clock} trend="Needs Review" trendColor="text-yellow-400" iconColor="text-yellow-400" backgroundColor="bg-yellow-400/10" />
        <KPICard title="Approved Today" value="56" icon={CheckCircle} trend="+12% vs yesterday" trendColor="text-emerald-400" iconColor="text-emerald-400" />
        <KPICard title="Flagged Listings" value="12" icon={AlertTriangle} trend="Action Required" trendColor="text-rose-400" iconColor="text-rose-400" backgroundColor="bg-rose-400/10" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-heading text-lg font-bold text-cream">Review Progress & Distribution</h3>
          </div>
          <SegmentedProgressBar
            segments={[
              { label: 'Approved', value: 85, color: 'bg-emerald-400' },
              { label: 'Rejected', value: 15, color: 'bg-rose-400' },
              { label: 'Pending Review', value: 42, color: 'bg-yellow-400' },
            ]}
          />
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <ActivityTimeline 
            title="Recently Moderated" 
            items={[
              { title: 'Lekki Phase 1 Duplex', desc: 'Approved by Chidi', time: '10 mins ago', color: 'text-emerald-400', icon: CheckCircle },
              { title: 'Skyline Penthouse', desc: 'Rejected (Photo Quality)', time: '1 hour ago', color: 'text-rose-400', icon: XCircle },
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
                setRejectionModalOpen(true);
              }}
            >
              Reject Selected
            </GhostButton>
            <GoldButton 
              size="sm"
              onClick={() => {
                setActionTarget('bulk');
                setApprovalModalOpen(true);
              }}
            >
              Approve Selected
            </GoldButton>
          </div>
        </div>
      )}

      <DataTableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search listings..."
        showFilter
      />

      <DataTable
        data={mockListings}
        keyExtractor={(item) => item.id}
        columns={[
          {
            header: (
              <input 
                type="checkbox" 
                className="rounded border-white/20 bg-navy-900/50 text-gold-400 focus:ring-gold-400/50"
                checked={selectedRows.size === mockListings.length && mockListings.length > 0}
                onChange={toggleAll}
              />
            ),
            className: "w-10 text-center",
            render: (item) => (
              <input 
                type="checkbox" 
                className="rounded border-white/20 bg-navy-900/50 text-gold-400 focus:ring-gold-400/50"
                checked={selectedRows.has(item.id)}
                onChange={() => toggleSelection(item.id)}
              />
            )
          },
          {
            header: "Listing ID",
            render: (item) => <span className="font-medium text-cream">{item.id}</span>
          },
          {
            header: "Property / Owner",
            render: (item) => (
              <>
                <div className="font-semibold text-cream flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gold-400" />
                  {item.title}
                </div>
                <div className="text-xs text-ink/50 mt-1">{item.owner}</div>
              </>
            )
          },
          {
            header: "Location",
            render: (item) => <span className="text-ink/60">{item.location}</span>
          },
          {
            header: "Price",
            render: (item) => <span className="font-semibold text-cream">{item.price}</span>
          },
          {
            header: "Status",
            render: (item) => (
              <div className="flex flex-col gap-1">
                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase w-fit ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
                {item.priority === 'High' && (
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
            render: (item) => (
              <div className="flex items-center justify-end gap-2">
                <button 
                  className="rounded-lg p-2 text-ink/40 hover:bg-emerald-400/10 hover:text-emerald-400 transition-colors" 
                  title="Approve"
                  onClick={() => {
                    setActionTarget(item.id);
                    setApprovalModalOpen(true);
                  }}
                >
                  <CheckCircle className="h-4 w-4" />
                </button>
                <button 
                  className="rounded-lg p-2 text-ink/40 hover:bg-rose-400/10 hover:text-rose-400 transition-colors" 
                  title="Reject"
                  onClick={() => {
                    setActionTarget(item.id);
                    setRejectionModalOpen(true);
                  }}
                >
                  <XCircle className="h-4 w-4" />
                </button>
                <button 
                  className="rounded-lg p-2 text-ink/40 hover:bg-white/10 hover:text-cream transition-colors" 
                  title="Review"
                  onClick={() => setPreviewListing(item)}
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button className="rounded-lg p-2 text-ink/40 hover:bg-white/10 hover:text-cream transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            )
          }
        ]}
      />

      <ApprovalConfirmationModal
        isOpen={approvalModalOpen}
        onClose={() => {
          setApprovalModalOpen(false);
          setActionTarget(null);
        }}
        onConfirm={() => {
          // Mock approve
          setApprovalModalOpen(false);
          if (actionTarget === 'bulk') setSelectedRows(new Set());
          setActionTarget(null);
        }}
        title={actionTarget === 'bulk' ? `Approve ${selectedRows.size} Listings` : 'Approve Listing'}
        message={actionTarget === 'bulk' ? `Are you sure you want to approve these ${selectedRows.size} listings?` : undefined}
      />

      <RejectionReasonModal
        isOpen={rejectionModalOpen}
        onClose={() => {
          setRejectionModalOpen(false);
          setActionTarget(null);
        }}
        onConfirm={(reason) => {
          // Mock reject with reason
          console.log('Rejected with reason:', reason);
          setRejectionModalOpen(false);
          if (actionTarget === 'bulk') setSelectedRows(new Set());
          setActionTarget(null);
        }}
        title={actionTarget === 'bulk' ? `Reject ${selectedRows.size} Listings` : 'Reject Listing'}
      />

      <ListingDetailModal 
        isOpen={!!previewListing} 
        onClose={() => setPreviewListing(null)} 
        listing={previewListing} 
      />
    </div>
  );
}
