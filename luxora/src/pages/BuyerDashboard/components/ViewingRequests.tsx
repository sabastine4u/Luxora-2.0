import { useState, useMemo } from 'react';
import { Calendar, Clock, MapPin, Home, Phone } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { useToast } from '../../../contexts/ToastContext';
import { mockViewings } from '../../../data/buyerData';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { RescheduleViewingModal } from './modals/RescheduleViewingModal';
import type { ViewingRequest } from '../../../types';

export default function ViewingRequests() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterDate, setFilterDate] = useState('All');
  const [sortBy, setSortBy] = useState('upcoming');

  const [selectedViewing, setSelectedViewing] = useState<ViewingRequest | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const filteredAndSortedViewings = useMemo(() => {
    let result = [...mockViewings];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(v => 
        v.propertyTitle.toLowerCase().includes(q) || 
        v.agent.toLowerCase().includes(q) || 
        v.location.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'All') result = result.filter(v => v.status === filterStatus);
    if (filterType !== 'All') result = result.filter(v => v.propertyType === filterType);
    if (filterDate !== 'All') {
      const today = new Date().toISOString().split('T')[0];
      if (filterDate === 'Past') result = result.filter(v => v.date < today);
      else if (filterDate === 'Upcoming') result = result.filter(v => v.date >= today);
    }
    result.sort((a, b) => {
      if (sortBy === 'newest') return b.date.localeCompare(a.date);
      if (sortBy === 'oldest') return a.date.localeCompare(b.date);
      if (sortBy === 'upcoming') {
        const today = new Date().toISOString().split('T')[0];
        const aUp = a.date >= today;
        const bUp = b.date >= today;
        if (aUp && !bUp) return -1;
        if (!aUp && bUp) return 1;
        return a.date.localeCompare(b.date);
      }
      if (sortBy === 'completed') {
         if (a.status === 'Completed' && b.status !== 'Completed') return -1;
         if (a.status !== 'Completed' && b.status === 'Completed') return 1;
         return 0;
      }
      return 0;
    });
    return result;
  }, [searchQuery, filterStatus, filterType, filterDate, sortBy]);

  const uniqueStatuses = ['All', 'Pending', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled'];
  const uniqueTypes = ['All', ...new Set(mockViewings.map(v => v.propertyType))];
  const uniqueDates = ['All', 'Upcoming', 'Past'];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRescheduleSubmit = (_date: string, _time: string, _notes: string) => {
    showToast({ type: 'success', title: 'Request Rescheduled', description: 'Your viewing reschedule request has been sent to the agent.' });
    setIsDrawerOpen(false);
  };

  const handleCancelConfirm = () => {
    showToast({ type: 'success', title: 'Viewing Cancelled', description: 'Your viewing has been cancelled.' });
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-2xl font-bold text-cream">Viewing Requests</h2>
        <p className="text-sm text-ink/60">Manage your upcoming and past property tours.</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md space-y-4">
        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by property, location, or agent..."
          actions={
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold pl-1">Status</label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:outline-none">
                  {uniqueStatuses.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold pl-1">Property Type</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:outline-none">
                  {uniqueTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold pl-1">Date</label>
                <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:outline-none">
                  {uniqueDates.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold pl-1">Sort By</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:outline-none">
                  <option value="upcoming">Upcoming First</option>
                  <option value="newest">Date (Newest First)</option>
                  <option value="oldest">Date (Oldest First)</option>
                  <option value="completed">Completed First</option>
                </select>
              </div>
            </div>
          }
        />
      </div>

      {filteredAndSortedViewings.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-12">
          <EmptyState
            icon={<Calendar className="h-12 w-12 text-gold-400" />}
            title="No viewing requests yet."
            description="When you request to view properties, they will appear here."
            actionLabel="Browse Properties"
            onAction={() => navigate(ROUTES.PROPERTIES)}
          />
        </div>
      ) : (
        <div className="w-full">
          <DataTable
            data={filteredAndSortedViewings}
            keyExtractor={(viewing) => viewing.id}
            columns={[
              {
                header: "Property",
                render: (viewing) => (
                  <div className="flex items-center gap-3">
                    <img src={viewing.image} alt={viewing.propertyTitle} className="h-10 w-10 rounded-lg object-cover hidden sm:block" />
                    <div className="font-semibold">{viewing.propertyTitle}</div>
                  </div>
                )
              },
              {
                header: "Location",
                render: (viewing) => <span className="text-ink/80">{viewing.location}</span>
              },
              {
                header: "Agent",
                render: (viewing) => <span className="text-ink/80">{viewing.agent}</span>
              },
              {
                header: "Schedule",
                render: (viewing) => (
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="flex items-center gap-1 text-cream"><Calendar className="h-3 w-3 text-gold-400"/> {viewing.date}</span>
                    <span className="flex items-center gap-1 text-cream"><Clock className="h-3 w-3 text-gold-400"/> {viewing.time}</span>
                  </div>
                )
              },
              {
                header: "Status",
                render: (viewing) => <EnterpriseStatusBadge status={viewing.status} />
              },
              {
                header: <div className="text-right">Actions</div>,
                className: "text-right",
                render: (viewing) => (
                  <button 
                    onClick={() => { setSelectedViewing(viewing); setIsDrawerOpen(true); }} 
                    className="inline-flex h-8 items-center justify-center rounded-lg border border-white/10 px-3 text-xs font-semibold hover:bg-white/5 hover:text-gold-400 transition-colors"
                  >
                    View Details
                  </button>
                )
              }
            ]}
          />
        </div>
      )}

      {selectedViewing && (
        <EnterpriseDetailDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title="Viewing Details"
          subtitle={`Property: ${selectedViewing.propertyTitle}`}
          footerActions={
            <>
              <GoldButton size="sm" onClick={() => navigate(ROUTES.PROPERTIES)}><Home className="h-4 w-4 mr-2"/> View Property</GoldButton>
              <GhostButton size="sm" onClick={() => { setIsDrawerOpen(false); navigate(ROUTES.BUYER_DASHBOARD); }}><Phone className="h-4 w-4 mr-2"/> Contact Agent</GhostButton>
              {selectedViewing.status !== 'Completed' && selectedViewing.status !== 'Cancelled' && (
                 <>
                   <GhostButton size="sm" className="text-purple-400 hover:text-purple-300 border-purple-400/30" onClick={() => setIsRescheduleOpen(true)}>Reschedule</GhostButton>
                   <GhostButton size="sm" className="text-rose-400 hover:text-rose-300 border-rose-400/30" onClick={() => setIsCancelOpen(true)}>Cancel</GhostButton>
                 </>
              )}
            </>
          }
        >
          <div className="space-y-6">
            <div className="rounded-xl overflow-hidden">
               <img src={selectedViewing.image} alt={selectedViewing.propertyTitle} className="w-full h-48 object-cover" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-navy-900/50 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gold-400" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold">Date</span>
                  <div className="text-sm text-cream mt-0.5 font-medium">{selectedViewing.date}</div>
                </div>
              </div>
              <div className="bg-navy-900/50 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                <Clock className="h-5 w-5 text-gold-400" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold">Time</span>
                  <div className="text-sm text-cream mt-0.5 font-medium">{selectedViewing.time}</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gold-400 mb-1 flex items-center gap-2"><MapPin className="h-4 w-4"/> Meeting Point</h4>
              <p className="text-sm text-cream/80">{selectedViewing.meetingPoint}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gold-400 mb-1">Viewing Instructions</h4>
              <p className="text-sm text-cream/80">{selectedViewing.instructions}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gold-400 mb-1">Agent Notes</h4>
              <p className="text-sm text-cream/80">{selectedViewing.agentNotes || 'No agent notes provided.'}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gold-400 mb-1">Special Requests</h4>
              <p className="text-sm text-cream/80">{selectedViewing.specialRequests || 'No special requests.'}</p>
            </div>

            <div className="pt-4 border-t border-white/5">
              <h4 className="font-semibold text-gold-400 mb-1">Property Summary</h4>
              <p className="text-sm text-cream/80">{selectedViewing.summary}</p>
            </div>
          </div>
        </EnterpriseDetailDrawer>
      )}

      <RescheduleViewingModal 
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        onSubmit={handleRescheduleSubmit}
        viewing={selectedViewing}
      />

      <ConfirmationModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleCancelConfirm}
        title="Cancel Viewing"
        message={`Are you sure you want to cancel your viewing for ${selectedViewing?.propertyTitle} on ${selectedViewing?.date}?`}
        confirmText="Cancel Viewing"
        type="danger"
      />
    </div>
  );
}
