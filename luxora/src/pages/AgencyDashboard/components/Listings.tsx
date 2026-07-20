import React, { useState } from 'react';
import { Plus, Filter, Edit, Trash2, MapPin, Building2, CheckCircle2, AlertCircle, BarChart3, Share2, Upload, Star } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { StatusBadge } from '../../ManagementDashboard/components/shared/StatusBadge';
import { properties } from '../../../data/luxoraData';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { ListingDetailModal } from './modals/ListingDetailModal';

import { useToast } from '../../../contexts/ToastContext';

export default function Listings() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Local Mock Data using properties base
  const mockListings = React.useMemo(() => properties.map((p, i) => ({
    ...p,
    status: i % 3 === 0 ? 'Pending' : i % 5 === 0 ? 'Sold' : 'Active',
    assignedAgent: i % 2 === 0 ? 'Sarah James' : 'Emeka Uzo',
    isFeatured: i % 4 === 0,
    priority: i % 3 === 0 ? 'High' : 'Normal',
    views: (i * 1234) % 5000,
    saves: (i * 42) % 200,
    enquiries: (i * 17) % 50,
    marketingStatus: i % 2 === 0 ? 'Published' : 'Draft',
  })), []);

  const filteredListings = mockListings.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setSelectedIds(newSelection);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredListings.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredListings.map(l => String(l.id))));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleViewListing = (listing: any) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Property Management"
        subtitle="Manage listings, marketing campaigns, and property visibility."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2" onClick={() => showToast({ type: 'info', title: 'Import CSV', description: 'CSV import will be available during backend integration.' })}>
              <Upload className="h-4 w-4" /> Import CSV
            </GhostButton>
            <GoldButton className="flex items-center gap-2" onClick={() => showToast({ type: 'info', title: 'New Listing', description: 'Listing creation will be available during backend integration.' })}>
              <Plus className="h-4 w-4" /> New Listing
            </GoldButton>
          </div>
        }
      />

      {/* Listing Lifecycle Summary */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Listings"
          value={mockListings.filter(l => l.status === 'Active').length.toString()}
          trend="Currently on market"
          trendColor="text-blue-400"
          icon={Building2}
        />
        <KPICard
          title="Draft / Pending"
          value={mockListings.filter(l => l.status === 'Pending').length.toString()}
          trend="Awaiting approval"
          trendColor="text-yellow-400"
          icon={AlertCircle}
        />
        <KPICard
          title="Featured Properties"
          value={mockListings.filter(l => l.isFeatured).length.toString()}
          trend="Boosted visibility"
          trendColor="text-gold-400"
          icon={Star}
        />
        <KPICard
          title="Recently Sold"
          value={mockListings.filter(l => l.status === 'Sold').length.toString()}
          trend="Last 30 days"
          trendColor="text-emerald-400"
          icon={CheckCircle2}
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-[calc(100vh-280px)] min-h-[600px]">
        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search properties by title or location..."
          actions={
            <div className="flex gap-2 items-center">
              {selectedIds.size > 0 && (
                <div className="flex items-center gap-2 mr-4 border-r border-white/10 pr-4">
                  <span className="text-sm text-ink/60">{selectedIds.size} selected</span>
                  {/* Advanced Bulk Actions */}
                  <GhostButton className="px-3 text-xs h-8" onClick={() => showToast({ type: 'info', title: 'Publish Listings', description: 'Publishing will be available during backend integration.' })}>Publish</GhostButton>
                  <GhostButton className="px-3 text-xs h-8" onClick={() => showToast({ type: 'info', title: 'Feature Listings', description: 'Featuring will be available during backend integration.' })}>Feature</GhostButton>
                  <GhostButton className="px-3 text-xs h-8" onClick={() => showToast({ type: 'info', title: 'Assign Agent', description: 'Agent assignment will be available during backend integration.' })}>Assign Agent</GhostButton>
                  <GhostButton className="px-3 text-xs h-8 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10" onClick={() => showToast({ type: 'info', title: 'Archive Listings', description: 'Archiving will be available during backend integration.' })}>Archive</GhostButton>
                </div>
              )}
              <GhostButton className="px-3 flex items-center gap-2"><Filter className="h-4 w-4" /> Filters</GhostButton>
            </div>
          }
        />

        <div className="flex-1 mt-6">
          <DataTable
            data={filteredListings}
            keyExtractor={(l) => String(l.id)}
            columns={[
              {
                header: (
                  <input 
                    type="checkbox" 
                    className="rounded border-white/20 bg-navy-900 text-gold-400 focus:ring-gold-400/20"
                    checked={selectedIds.size === filteredListings.length && filteredListings.length > 0}
                    onChange={toggleAll}
                  />
                ),
                render: (l) => (
                  <input 
                    type="checkbox" 
                    className="rounded border-white/20 bg-navy-900 text-gold-400 focus:ring-gold-400/20"
                    checked={selectedIds.has(String(l.id))}
                    onChange={() => toggleSelection(String(l.id))}
                  />
                )
              },
              {
                header: "Property Info",
                render: (l) => (
                  <div className="flex items-center gap-3">
                    <img src={l.image} alt={l.title} className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                    <div>
                      <div 
                        className="font-semibold text-cream hover:text-gold-400 cursor-pointer transition-colors flex items-center gap-2"
                        onClick={() => handleViewListing(l)}
                      >
                        {String(l.title)}
                        {l.isFeatured && <span className="text-[10px] bg-gold-400/20 text-gold-400 px-1.5 py-0.5 rounded font-bold uppercase">Featured</span>}
                      </div>
                      <div className="text-xs text-ink/60 flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {String(l.location)}
                      </div>
                    </div>
                  </div>
                )
              },
              {
                header: "Price",
                render: (l) => <span className="font-medium text-cream">{String(l.price)}</span>
              },
              {
                header: "Marketing",
                render: (l) => (
                  <div>
                    <div className="text-xs text-cream flex items-center gap-1 mb-1">
                      <Share2 className="h-3 w-3" /> {String(l.marketingStatus)}
                    </div>
                    <div className="text-[10px] text-ink/60">{l.views} views • {l.enquiries} enq.</div>
                  </div>
                )
              },
              {
                header: "Agent",
                render: (l) => <span className="text-sm text-ink/80">{String(l.assignedAgent)}</span>
              },
              {
                header: "Status",
                render: (l) => <StatusBadge status={String(l.status)} />
              },
              {
                header: <div className="text-right">Actions</div>,
                className: "text-right",
                render: (l) => (
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleViewListing(l)}
                      className="p-1.5 text-ink/60 hover:text-cream rounded hover:bg-white/5 transition-colors" 
                      title="View Details / Analytics"
                    >
                      <BarChart3 className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-ink/60 hover:text-blue-400 rounded hover:bg-blue-400/10 transition-colors" title="Edit" onClick={() => showToast({ type: 'info', title: 'Edit Listing', description: 'Listing editing will be available during backend integration.' })}>
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-ink/60 hover:text-rose-400 rounded hover:bg-rose-400/10 transition-colors" title="Archive" onClick={() => showToast({ type: 'info', title: 'Archive Listing', description: 'Archiving will be available during backend integration.' })}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )
              }
            ]}
          />
        </div>
      </div>

      <ListingDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        listing={selectedListing}
      />
    </div>
  );
}

