import { useState } from 'react';
import { Building2, CheckCircle, Clock, Archive, ShieldOff, Star } from 'lucide-react';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton } from '../../../components/ui/ui';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { ListingTable, type ListingManagementAction } from '../../../components/dashboard/shared/tables/ListingTable';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { ListingDetailsModal } from '../../../components/dashboard/shared/modals/ListingDetailsModal';
import { ListingEditModal } from '../../../components/dashboard/shared/modals/ListingEditModal';
import { AssignAgentModal } from '../../../components/dashboard/shared/modals/AssignAgentModal';
import { ListingHistoryModal } from '../../../components/dashboard/shared/modals/ListingHistoryModal';
import { AuditLogModal } from '../../../components/dashboard/shared/modals/AuditLogModal';
import { useToast } from '../../../contexts/ToastContext';

import { adminListings } from '../../../data/adminData';
import type { AdminListing } from '../../../types/admin';

export default function SuperAdminListings() {
  const { showToast } = useToast();
  const [listings, setListings] = useState<AdminListing[]>(adminListings);
  const [previousStatuses, setPreviousStatuses] = useState<Record<string, string>>({});

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  
  const [previewListing, setPreviewListing] = useState<AdminListing | null>(null);
  const [targetListing, setTargetListing] = useState<AdminListing | null>(null);
  const [modalType, setModalType] = useState<'edit' | 'assign' | 'history' | 'audit' | 'suspend' | 'archive' | 'delete' | null>(null);

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

  const updateListing = (id: string, updates: Partial<AdminListing>) => {
    setListings(prev => prev.map(l => {
      if (l.id === id) {
        if (updates.status && l.status !== updates.status) {
          setPreviousStatuses(ps => ({ ...ps, [id]: l.status }));
        }
        return { ...l, ...updates };
      }
      return l;
    }));
  };

  const handleMenuAction = (action: ListingManagementAction, item: AdminListing) => {
    switch(action) {
      case 'view_listing':
        setPreviewListing(item);
        break;
      case 'edit':
        setTargetListing(item);
        setModalType('edit');
        break;
      case 'publish':
        updateListing(item.id, { status: 'Published' });
        showToast({ type: 'success', title: 'Listing Published', description: `Listing ${item.id} has been published.` });
        break;
      case 'unpublish':
        updateListing(item.id, { status: 'Draft' });
        showToast({ type: 'info', title: 'Listing Unpublished', description: `Listing ${item.id} is now a draft.` });
        break;
      case 'suspend':
        setTargetListing(item);
        setModalType('suspend');
        break;
      case 'restore': {
        const prevStatus = previousStatuses[item.id] || 'Published';
        updateListing(item.id, { status: prevStatus });
        showToast({ type: 'success', title: 'Listing Restored', description: `Listing ${item.id} restored to ${prevStatus}.` });
        break;
      }
      case 'archive':
        setTargetListing(item);
        setModalType('archive');
        break;
      case 'delete':
        setTargetListing(item);
        setModalType('delete');
        break;
      case 'feature':
        updateListing(item.id, { priority: 'High' });
        showToast({ type: 'success', title: 'Listing Featured', description: `Listing ${item.id} is now featured.` });
        break;
      case 'unfeature':
        updateListing(item.id, { priority: 'Normal' });
        showToast({ type: 'info', title: 'Feature Removed', description: `Listing ${item.id} is no longer featured.` });
        break;
      case 'agent_assignment':
        setTargetListing(item);
        setModalType('assign');
        break;
      case 'view_history':
        setTargetListing(item);
        setModalType('history');
        break;
      case 'audit_log':
        setTargetListing(item);
        setModalType('audit');
        break;
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          listing.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const status = listing.status;
    const matchesStatus = statusFilter === 'All' || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const closeModal = () => {
    setTargetListing(null);
    setModalType(null);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        name="All Listings"
        subtitle="Manage every property listing across the Luxora platform."
      />

      <div className="mb-2">
        <h2 className="text-sm font-semibold text-ink/50 uppercase tracking-wider">Platform Listing Analytics</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KPICard title="Total Listings" value="21,500" icon={Building2} trend="+120 this week" trendColor="text-emerald-400" />
        <KPICard title="Published" value="18,400" icon={CheckCircle} trend="85% of total" trendColor="text-emerald-400" iconColor="text-emerald-400" />
        <KPICard title="Draft" value="2,100" icon={Clock} trend="Awaiting details" trendColor="text-yellow-400" iconColor="text-yellow-400" backgroundColor="bg-yellow-400/10" />
        <KPICard title="Suspended" value="342" icon={ShieldOff} trend="Needs review" trendColor="text-rose-400" iconColor="text-rose-400" backgroundColor="bg-rose-400/10" />
        <KPICard title="Archived" value="510" icon={Archive} trend="Inactive" trendColor="text-ink/60" iconColor="text-ink/60" backgroundColor="bg-white/5" />
        <KPICard title="Featured" value="148" icon={Star} trend="Premium listings" trendColor="text-gold-400" iconColor="text-gold-400" backgroundColor="bg-gold-400/10" />
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
            <GhostButton size="sm" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10">
              Bulk Publish
            </GhostButton>
            <GhostButton size="sm" className="text-gold-400 hover:text-gold-300 hover:bg-gold-400/10">
              Bulk Feature
            </GhostButton>
            <GhostButton size="sm" className="text-ink/60 hover:text-ink hover:bg-white/5">
              Bulk Archive
            </GhostButton>
            <GhostButton size="sm" className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10">
              Bulk Suspend
            </GhostButton>
            <GhostButton size="sm" className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10">
              Bulk Delete
            </GhostButton>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 flex flex-col h-[600px]">
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-4 justify-between">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by ID, title, address, agent, or owner..."
          />
          <select 
            className="rounded-xl border border-white/10 bg-navy-900/50 py-2.5 px-4 text-sm text-cream focus:border-gold-400/50 focus:outline-none appearance-none min-w-[200px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Pending">Pending</option>
            <option value="Archived">Archived</option>
            <option value="Suspended">Suspended</option>
            <option value="Featured">Featured</option>
            <option value="Hidden">Hidden</option>
            <option value="Sold">Sold</option>
            <option value="Rented">Rented</option>
          </select>
        </div>
        <div className="flex-1 overflow-hidden">
          <ListingTable 
            data={filteredListings} 
            mode="management"
            selectedRows={selectedRows}
            onToggleSelection={toggleSelection}
            onToggleAll={toggleAll}
            onMenuAction={handleMenuAction}
          />
        </div>
      </div>

      <ListingDetailsModal 
        isOpen={!!previewListing}
        onClose={() => setPreviewListing(null)}
        listing={previewListing}
      />
      <ListingEditModal 
        isOpen={modalType === 'edit'}
        onClose={closeModal}
        listing={targetListing}
        onSave={(updated) => {
          updateListing(updated.id, updated);
          closeModal();
          showToast({ type: 'success', title: 'Listing Updated', description: 'Changes saved locally.' });
        }}
      />
      <AssignAgentModal 
        isOpen={modalType === 'assign'}
        onClose={closeModal}
        listing={targetListing}
        onSave={(listingId, agencyName, notes) => {
          updateListing(listingId, { 
            assignment: { 
              id: 'ASG-100', 
              status: 'Assigned to Agency', 
              agencyName, 
              notes 
            } 
          });
          closeModal();
          showToast({ type: 'success', title: 'Agent Assigned', description: `Assigned to ${agencyName}.` });
        }}
      />
      <ListingHistoryModal 
        isOpen={modalType === 'history'}
        onClose={closeModal}
        listing={targetListing}
      />
      <AuditLogModal 
        isOpen={modalType === 'audit'}
        onClose={closeModal}
        listing={targetListing}
      />
      
      <ConfirmationModal
        isOpen={modalType === 'delete' || modalType === 'archive' || modalType === 'suspend'}
        onClose={closeModal}
        title={modalType === 'delete' ? 'Delete Listing' : modalType === 'archive' ? 'Archive Listing' : 'Suspend Listing'}
        message={
          modalType === 'delete' 
            ? "Are you sure you want to permanently delete this listing? This action cannot be undone."
            : modalType === 'archive' 
              ? "Are you sure you want to archive this listing? It will be removed from active views."
              : "Suspend this listing? It will no longer be visible to users."
        }
        confirmText={
          modalType === 'delete' ? 'Delete Permanently' : modalType === 'archive' ? 'Archive Listing' : 'Suspend Listing'
        }
        onConfirm={() => {
          if (!targetListing) return;
          if (modalType === 'delete') {
            setListings(prev => prev.filter(l => l.id !== targetListing.id));
            showToast({ type: 'success', title: 'Listing Deleted', description: `Listing ${targetListing.id} has been deleted.` });
          } else if (modalType === 'archive') {
            updateListing(targetListing.id, { status: 'Archived' });
            showToast({ type: 'info', title: 'Listing Archived', description: `Listing ${targetListing.id} archived.` });
          } else if (modalType === 'suspend') {
            updateListing(targetListing.id, { status: 'Suspended' });
            showToast({ type: 'warning', title: 'Listing Suspended', description: `Listing ${targetListing.id} suspended.` });
          }
          closeModal();
        }}
      />
    </div>
  );
}
