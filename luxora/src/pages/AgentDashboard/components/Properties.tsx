import React, { useState } from 'react';
import { 
  Building2, Calendar as CalendarIcon, FileCheck, CheckCircle2,
  Filter, SlidersHorizontal, ArrowRight, MapPin, 
  Briefcase, FileText, X, ArrowUpRight, Plus, Eye, Heart, Key, Activity, Send
} from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout/EmptyState';
import { PropertyCard } from '../../../components/property/PropertyCard';
import { properties } from '../../../data/luxoraData';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { useToast } from '../../../contexts/ToastContext';

// --- MOCK DATA ---
const KPI_DATA = [
  { label: 'Active Listings', value: '28', icon: Building2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { label: 'Pending Approval', value: '4', icon: ClockIcon, color: 'text-gold-400', bg: 'bg-gold-400/10' },
  { label: 'Sold Properties', value: '142', icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Rented Properties', value: '86', icon: FileCheck, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  { label: 'Draft Listings', value: '3', icon: FileText, color: 'text-ink/60', bg: 'bg-white/5' },
];

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// Extend the property mock data with some agent-specific metrics
const EXTENDED_PROPERTIES = properties.map((prop, i) => ({
  ...prop,
  status: ['Available', 'Pending', 'Sold', 'Rented', 'Draft', 'Archived'][i % 6] as import('../../../types/property').Property['status'],
  views: Math.floor(Math.random() * 5000) + 100,
  saves: Math.floor(Math.random() * 500) + 10,
  offers: Math.floor(Math.random() * 5),
  viewingRequests: Math.floor(Math.random() * 12),
  owner: { name: `Owner ${i}`, email: `owner${i}@example.com`, phone: '+234 800 000 0000' }
}));

// --- COMPONENT ---
export default function Properties() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<typeof EXTENDED_PROPERTIES[0] | null>(null);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Available': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Pending': return 'text-gold-400 bg-gold-400/10 border-gold-400/20';
      case 'Sold': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Rented': return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
      case 'Draft': return 'text-ink/60 bg-white/5 border-white/10';
      case 'Archived': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-ink/60 bg-white/5 border-white/10';
    }
  };

  const filteredProperties = EXTENDED_PROPERTIES.filter(prop => 
    prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prop.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 relative h-full flex flex-col pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">My Properties</h2>
          <p className="text-sm text-ink/60">Manage listings assigned to you.</p>
        </div>
        <div className="flex gap-3">
          <GhostButton size="sm"><ArrowUpRight className="h-4 w-4 mr-2"/> Export CSV</GhostButton>
          <GoldButton size="sm"><Plus className="h-4 w-4 mr-2"/> Add Listing</GoldButton>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {KPI_DATA.map((kpi, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-navy-800/50 p-4 transition-all hover:bg-navy-800/80 flex items-center gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${kpi.bg} ${kpi.color}`}>
              <kpi.icon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-cream leading-none">{kpi.value}</div>
              <div className="text-xs font-medium text-ink/60 mt-1">{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* SEARCH & FILTER */}
      <DataTableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by title or location..."
        actions={
          <>
            <GhostButton size="sm" className="bg-navy-900/80"><Filter className="h-4 w-4 mr-2"/> Status</GhostButton>
            <GhostButton size="sm" className="bg-navy-900/80"><Briefcase className="h-4 w-4 mr-2"/> Property Type</GhostButton>
            <GhostButton size="sm" className="bg-navy-900/80"><MapPin className="h-4 w-4 mr-2"/> Location</GhostButton>
            <GhostButton size="sm" className="bg-navy-900/80"><SlidersHorizontal className="h-4 w-4 mr-2"/> Sort: Newest</GhostButton>
          </>
        }
      />

      {/* PROPERTY GRID */}
      {filteredProperties.length === 0 ? (
        <div className="py-12">
          <EmptyState 
            icon={<Building2 className="h-12 w-12 text-gold-400" />}
            title="No properties assigned."
            description="You don't have any listings matching your search."
            actionLabel="Refresh Listings"
            onAction={() => setSearchQuery('')}
          />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProperties.map(property => (
            <div 
              key={property.id} 
              className="relative cursor-pointer group"
              onClick={() => setSelectedProperty(property)}
            >
              {/* Badge Overlay on top of PropertyCard */}
              <div className="absolute top-4 left-4 z-10">
                 <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase shadow-lg backdrop-blur-md ${getStatusColor(property.status)}`}>
                   {property.status}
                 </span>
              </div>
              
              <div className="transform scale-100 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-gold-400/10 pointer-events-none">
                <PropertyCard property={property} />
              </div>

              {/* Quick Metrics Overlay Bottom */}
              <div className="absolute bottom-[88px] left-0 right-0 bg-navy-950/80 backdrop-blur-sm p-3 border-t border-white/10 grid grid-cols-3 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-none">
                 <div className="text-center">
                    <div className="text-xs text-ink/50 mb-0.5 flex items-center justify-center gap-1"><Eye className="h-3 w-3"/> Views</div>
                    <div className="text-sm font-bold text-cream">{property.views}</div>
                 </div>
                 <div className="text-center border-l border-white/10">
                    <div className="text-xs text-ink/50 mb-0.5 flex items-center justify-center gap-1"><Heart className="h-3 w-3"/> Saves</div>
                    <div className="text-sm font-bold text-cream">{property.saves}</div>
                 </div>
                 <div className="text-center border-l border-white/10">
                    <div className="text-xs text-ink/50 mb-0.5 flex items-center justify-center gap-1"><FileCheck className="h-3 w-3"/> Offers</div>
                    <div className="text-sm font-bold text-cream">{property.offers}</div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PROPERTY DETAILS SIDE PANEL */}
      {selectedProperty && (
        <>
          <div className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm" onClick={() => setSelectedProperty(null)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-navy-900 border-l border-white/10 shadow-2xl flex flex-col transform transition-transform duration-300">
            {/* Panel Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <img src={selectedProperty.image} alt={selectedProperty.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/90 to-transparent"></div>
              </div>
              <div className="relative z-10 w-full flex justify-between items-start">
                <div>
                  <h3 className="font-heading text-xl font-bold text-cream mb-1">{selectedProperty.title}</h3>
                  <div className="text-sm text-ink/60">{selectedProperty.location}</div>
                </div>
                <button onClick={() => setSelectedProperty(null)} className="p-2 text-ink/50 hover:text-cream rounded-lg hover:bg-white/5 transition-colors bg-navy-900/50 backdrop-blur-md border border-white/10">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar relative z-10">
              
              {/* Status and Price */}
              <div className="flex items-center justify-between">
                <div className="font-heading text-3xl font-bold text-gold-400">{selectedProperty.price}</div>
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase ${getStatusColor(selectedProperty.status)}`}>
                  {selectedProperty.status}
                </span>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <GoldButton size="sm" onClick={() => showToast({ type: 'info', title: 'Edit Listing', description: 'Opening listing editor...' })}><FileText className="h-4 w-4 mr-2" /> Edit Listing</GoldButton>
                <GhostButton size="sm" onClick={() => showToast({ type: 'success', title: 'Listing Shared', description: 'Listing link copied to clipboard.' })}><Send className="h-4 w-4 mr-2" /> Share</GhostButton>
                <GhostButton size="sm" onClick={() => showToast({ type: 'info', title: 'Schedule Viewing', description: 'Opening scheduling interface...' })}><CalendarIcon className="h-4 w-4 mr-2" /> Schedule</GhostButton>
                <GhostButton size="sm" onClick={() => showToast({ type: 'info', title: 'View Offers', description: 'Opening offers dashboard...' })}><FileCheck className="h-4 w-4 mr-2" /> View Offers ({selectedProperty.offers})</GhostButton>
              </div>

              {/* Property Information */}
              <div className="space-y-4">
                <h4 className="font-heading text-sm font-bold text-cream uppercase tracking-wider text-ink/60 border-b border-white/5 pb-2">Property Info</h4>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink/50">Property Type</span>
                    <span className="text-cream font-medium">{selectedProperty.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/50">Beds / Baths</span>
                    <span className="text-cream font-medium">{selectedProperty.beds} Bed / {selectedProperty.baths} Bath</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/50">Floor Area</span>
                    <span className="text-cream font-medium">{selectedProperty.area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/50">Listing ID</span>
                    <span className="text-cream font-medium">{selectedProperty.id}</span>
                  </div>
                </div>
              </div>

              {/* Listing Performance */}
              <div className="space-y-4">
                <h4 className="font-heading text-sm font-bold text-cream uppercase tracking-wider text-ink/60 border-b border-white/5 pb-2">Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-navy-800/50 border border-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-ink/50 text-xs mb-1"><Eye className="h-3.5 w-3.5"/> Views</div>
                    <div className="text-lg font-bold text-cream">{selectedProperty.views.toLocaleString()}</div>
                  </div>
                  <div className="bg-navy-800/50 border border-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-ink/50 text-xs mb-1"><Heart className="h-3.5 w-3.5"/> Favorites</div>
                    <div className="text-lg font-bold text-cream">{selectedProperty.saves}</div>
                  </div>
                  <div className="bg-navy-800/50 border border-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-ink/50 text-xs mb-1"><Key className="h-3.5 w-3.5"/> Viewings</div>
                    <div className="text-lg font-bold text-cream">{selectedProperty.viewingRequests}</div>
                  </div>
                  <div className="bg-navy-800/50 border border-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-ink/50 text-xs mb-1"><Activity className="h-3.5 w-3.5"/> Conversion</div>
                    <div className="text-lg font-bold text-emerald-400">
                      {((selectedProperty.viewingRequests / selectedProperty.views) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div className="space-y-4">
                <h4 className="font-heading text-sm font-bold text-cream uppercase tracking-wider text-ink/60 border-b border-white/5 pb-2">Owner Info</h4>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink/50">Name</span>
                    <span className="text-cream font-medium">{selectedProperty.owner.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/50">Phone</span>
                    <span className="text-cream font-medium">{selectedProperty.owner.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/50">Email</span>
                    <span className="text-cream font-medium">{selectedProperty.owner.email}</span>
                  </div>
                </div>
              </div>

              {/* View Full Details Link */}
              <GhostButton className="w-full text-gold-400 hover:text-gold-300">View Full Details <ArrowRight className="h-4 w-4 ml-2" /></GhostButton>

            </div>
          </div>
        </>
      )}

    </div>
  );
}
