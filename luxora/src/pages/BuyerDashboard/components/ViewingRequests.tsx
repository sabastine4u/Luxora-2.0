import { useState, useMemo } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Clock3, ChevronDown, ChevronUp, Home, Phone } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

const mockViewings = [
  { 
    id: 1, 
    propertyTitle: 'Skyline Penthouse', 
    location: 'Eko Atlantic, Lagos', 
    propertyType: 'Penthouse',
    date: '2025-10-25', 
    time: '10:00 AM', 
    status: 'Confirmed', 
    agent: 'Adaeze Okonkwo', 
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=200',
    instructions: 'Please arrive 10 minutes early. ID required.',
    meetingPoint: 'Lobby Reception',
    agentNotes: 'Client interested in top floor units with sea view.',
    specialRequests: 'None',
    summary: 'A luxurious penthouse offering panoramic views of the Atlantic.'
  },
  { 
    id: 2, 
    propertyTitle: 'Garden Court Villa', 
    location: 'Banana Island, Lagos', 
    propertyType: 'Villa',
    date: '2025-10-28', 
    time: '02:00 PM', 
    status: 'Pending', 
    agent: 'Tunde Bakare', 
    image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=200',
    instructions: 'Call upon arrival at the estate gate.',
    meetingPoint: 'Estate Main Gate',
    agentNotes: '',
    specialRequests: 'Wheelchair access required',
    summary: 'Spacious 5-bedroom villa with private garden and pool.'
  },
  { 
    id: 3, 
    propertyTitle: 'Aurora Smart Studio', 
    location: 'Yaba, Lagos', 
    propertyType: 'Apartment',
    date: '2025-10-20', 
    time: '11:00 AM', 
    status: 'Completed', 
    agent: 'Kunle Sanusi', 
    image: 'https://images.pexels.com/photos/1572889/pexels-photo-1572889.jpeg?auto=compress&cs=tinysrgb&w=200',
    instructions: 'Self-guided tour available via smart lock.',
    meetingPoint: 'Front Door',
    agentNotes: 'Followed up with pricing details.',
    specialRequests: '',
    summary: 'Modern smart studio ideal for young professionals.'
  },
  { 
    id: 4, 
    propertyTitle: 'Lekki Beachfront Condo', 
    location: 'Lekki Phase 1, Lagos', 
    propertyType: 'Condo',
    date: '2025-10-15', 
    time: '04:00 PM', 
    status: 'Cancelled', 
    agent: 'Adaeze Okonkwo', 
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=200',
    instructions: 'N/A',
    meetingPoint: 'N/A',
    agentNotes: 'Client cancelled due to schedule conflict.',
    specialRequests: 'None',
    summary: 'Luxury beachfront condo with exclusive amenities.'
  },
  { 
    id: 5, 
    propertyTitle: 'Ikoyi Heritage Home', 
    location: 'Ikoyi, Lagos', 
    propertyType: 'House',
    date: '2025-11-02', 
    time: '01:00 PM', 
    status: 'Rescheduled', 
    agent: 'Tunde Bakare', 
    image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=200',
    instructions: 'Meet at the property management office first.',
    meetingPoint: 'Office 4B',
    agentNotes: 'Rescheduled from original Oct 30 date.',
    specialRequests: 'Bring building layout plans.',
    summary: 'Classic heritage home beautifully restored in Old Ikoyi.'
  }
];

function StatusBadge({ status }: { status: string }) {
  let cfg = { color: 'text-ink/60', bg: 'bg-white/5 border-white/10', icon: XCircle };
  switch(status) {
    case 'Confirmed': cfg = { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle }; break;
    case 'Pending': cfg = { color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', icon: Clock3 }; break;
    case 'Completed': cfg = { color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', icon: CheckCircle }; break;
    case 'Rescheduled': cfg = { color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20', icon: Calendar }; break;
    case 'Cancelled': cfg = { color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20', icon: XCircle }; break;
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
      <cfg.icon className="h-3 w-3" /> {status}
    </span>
  );
}

export default function ViewingRequests() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterDate, setFilterDate] = useState('All');
  const [sortBy, setSortBy] = useState('upcoming');
  const [expandedId, setExpandedId] = useState<number | null>(null);

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

    if (filterStatus !== 'All') {
      result = result.filter(v => v.status === filterStatus);
    }

    if (filterType !== 'All') {
      result = result.filter(v => v.propertyType === filterType);
    }
    
    if (filterDate !== 'All') {
      // Simplistic mock date filtering
      const today = new Date().toISOString().split('T')[0];
      if (filterDate === 'Past') {
        result = result.filter(v => v.date < today);
      } else if (filterDate === 'Upcoming') {
        result = result.filter(v => v.date >= today);
      }
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') return b.date.localeCompare(a.date);
      if (sortBy === 'oldest') return a.date.localeCompare(b.date);
      if (sortBy === 'upcoming') {
        // upcoming first, then past
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

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderDetails = (viewing: typeof mockViewings[0]) => (
    <div className="p-5 bg-navy-900/40 border-t border-white/5 text-sm space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-gold-400 mb-1">Viewing Instructions</h4>
          <p className="text-cream/80">{viewing.instructions}</p>
        </div>
        <div>
          <h4 className="font-semibold text-gold-400 mb-1">Meeting Point</h4>
          <p className="text-cream/80">{viewing.meetingPoint}</p>
        </div>
        <div>
          <h4 className="font-semibold text-gold-400 mb-1">Agent Notes</h4>
          <p className="text-cream/80">{viewing.agentNotes || 'No agent notes provided.'}</p>
        </div>
        <div>
          <h4 className="font-semibold text-gold-400 mb-1">Special Requests</h4>
          <p className="text-cream/80">{viewing.specialRequests || 'No special requests.'}</p>
        </div>
        <div className="sm:col-span-2">
          <h4 className="font-semibold text-gold-400 mb-1">Property Summary</h4>
          <p className="text-cream/80">{viewing.summary}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
        <GoldButton size="sm" onClick={() => navigate(ROUTES.PROPERTIES)}><Home className="h-4 w-4 mr-2"/> View Property</GoldButton>
        <GhostButton size="sm"><Phone className="h-4 w-4 mr-2"/> Contact Agent</GhostButton>
        {viewing.status !== 'Completed' && viewing.status !== 'Cancelled' && (
           <>
             <GhostButton size="sm" className="text-purple-400 hover:text-purple-300 border-purple-400/30">Reschedule Request</GhostButton>
             <GhostButton size="sm" className="text-rose-400 hover:text-rose-300 border-rose-400/30">Cancel Request</GhostButton>
           </>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-2xl font-bold text-cream">Viewing Requests</h2>
        <p className="text-sm text-ink/60">Manage your upcoming and past property tours.</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md space-y-4">
        {/* Search */}
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
        <>
          {/* Desktop Responsive Table (hidden on mobile/tablet) */}
          <div className="hidden lg:block w-full">
            <DataTable
              data={filteredAndSortedViewings}
              keyExtractor={(viewing) => viewing.id}
              expandedRowIds={expandedId ? [expandedId] : []}
              renderExpandedRow={(viewing) => renderDetails(viewing)}
              columns={[
                {
                  header: "Property",
                  render: (viewing) => (
                    <div className="flex items-center gap-3">
                      <img src={viewing.image} alt={viewing.propertyTitle} className="h-10 w-10 rounded-lg object-cover" />
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
                  render: (viewing) => <StatusBadge status={viewing.status} />
                },
                {
                  header: <div className="text-right">Actions</div>,
                  className: "text-right",
                  render: (viewing) => (
                    <button onClick={() => toggleExpand(viewing.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 hover:bg-white/5 hover:text-gold-400 transition-colors">
                      {expandedId === viewing.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  )
                }
              ]}
            />
          </div>

          {/* Tablet & Mobile Stacked Cards (hidden on desktop) */}
          <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {filteredAndSortedViewings.map((viewing) => (
              <div key={viewing.id} className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-navy-800/50">
                <div className="p-5">
                  <div className="flex gap-4">
                    <img src={viewing.image} alt={viewing.propertyTitle} className="h-20 w-20 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-heading text-lg font-semibold text-cream truncate">{viewing.propertyTitle}</h3>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-ink/60 mb-2 truncate">
                        <MapPin className="h-3 w-3 shrink-0" /> <span className="truncate">{viewing.location}</span>
                      </div>
                      <StatusBadge status={viewing.status} />
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 bg-navy-900/50 rounded-lg px-3 py-2 border border-white/5 text-cream">
                      <Calendar className="h-4 w-4 text-gold-400 shrink-0" /> <span className="truncate">{viewing.date}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-navy-900/50 rounded-lg px-3 py-2 border border-white/5 text-cream">
                      <Clock className="h-4 w-4 text-gold-400 shrink-0" /> <span className="truncate">{viewing.time}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-ink/60">
                    Agent: <span className="text-cream">{viewing.agent}</span>
                  </div>
                </div>

                <div className="border-t border-white/5 bg-navy-900/30">
                  <button onClick={() => toggleExpand(viewing.id)} className="flex w-full items-center justify-center gap-2 p-3 text-xs font-semibold text-gold-400 hover:text-gold-300 hover:bg-white/5 transition-colors">
                    {expandedId === viewing.id ? 'Hide Details' : 'View Details'} 
                    {expandedId === viewing.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {expandedId === viewing.id && renderDetails(viewing)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
