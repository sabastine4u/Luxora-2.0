import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, FileText, CheckCircle2, Clock3, XCircle, AlertCircle, RefreshCw, Archive, Home, FileEdit, Phone, X, History } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { formatCurrency } from '../../../utils';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { useToast } from '../../../contexts/ToastContext';

const mockOffers = [
  { 
    id: 'OFF-105', 
    propertyTitle: 'Marina View Apartment', 
    location: 'Victoria Island, Lagos', 
    propertyType: 'Apartment',
    askingPrice: 185000000, 
    offerAmount: 180000000, 
    status: 'Accepted', 
    date: '2025-10-24', 
    agent: 'Adaeze Okonkwo', 
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=200',
    summary: 'A beautiful marina view apartment in the heart of VI.',
    timeline: [
      { date: '2025-10-20', event: 'Offer Submitted (₦175M)' },
      { date: '2025-10-22', event: 'Counter Offer Received (₦182M)' },
      { date: '2025-10-23', event: 'Offer Revised (₦180M)' },
      { date: '2025-10-24', event: 'Offer Accepted' },
    ],
    counterOfferDetails: null,
    agentNotes: 'Seller is pleased with the revised offer. Preparing contracts.',
    buyerNotes: 'Final offer, will not go higher.',
    estimatedClosing: 'Nov 15, 2025'
  },
  { 
    id: 'OFF-104', 
    propertyTitle: 'Garden Court Villa', 
    location: 'Banana Island, Lagos', 
    propertyType: 'Villa',
    askingPrice: 680000000, 
    offerAmount: 640000000, 
    status: 'Counter Offer Received', 
    date: '2025-10-22', 
    agent: 'Tunde Bakare', 
    image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=200',
    summary: 'Spacious 5-bedroom villa with private garden.',
    timeline: [
      { date: '2025-10-20', event: 'Offer Submitted (₦620M)' },
      { date: '2025-10-22', event: 'Counter Offer Received (₦660M)' },
    ],
    counterOfferDetails: 'Seller counters at ₦660M and requests 30-day closing.',
    agentNotes: 'Seller is firm on price but flexible on closing date.',
    buyerNotes: 'Reviewing budget to see if we can meet the counter.',
    estimatedClosing: 'TBD'
  },
  { 
    id: 'OFF-103', 
    propertyTitle: 'Aurora Smart Studio', 
    location: 'Yaba, Lagos', 
    propertyType: 'Apartment',
    askingPrice: 620000000, 
    offerAmount: 550000000, 
    status: 'Under Review', 
    date: '2025-10-26', 
    agent: 'Kunle Sanusi', 
    image: 'https://images.pexels.com/photos/1572889/pexels-photo-1572889.jpeg?auto=compress&cs=tinysrgb&w=200',
    summary: 'Modern smart studio ideal for young professionals.',
    timeline: [
      { date: '2025-10-26', event: 'Offer Submitted (₦550M)' },
    ],
    counterOfferDetails: null,
    agentNotes: 'Forwarded offer to seller, expecting response by tomorrow.',
    buyerNotes: 'Need this urgently for investment portfolio.',
    estimatedClosing: 'Dec 01, 2025'
  },
  { 
    id: 'OFF-102', 
    propertyTitle: 'Lekki Beachfront Condo', 
    location: 'Lekki Phase 1, Lagos', 
    propertyType: 'Condo',
    askingPrice: 210000000, 
    offerAmount: 195000000, 
    status: 'Rejected', 
    date: '2025-10-15', 
    agent: 'Adaeze Okonkwo', 
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=200',
    summary: 'Luxury beachfront condo with exclusive amenities.',
    timeline: [
      { date: '2025-10-12', event: 'Offer Submitted (₦195M)' },
      { date: '2025-10-15', event: 'Offer Rejected' },
    ],
    counterOfferDetails: null,
    agentNotes: 'Seller accepted another offer.',
    buyerNotes: 'Too bad, really liked the view.',
    estimatedClosing: 'N/A'
  },
  { 
    id: 'OFF-101', 
    propertyTitle: 'Ikoyi Heritage Home', 
    location: 'Ikoyi, Lagos', 
    propertyType: 'House',
    askingPrice: 450000000, 
    offerAmount: 430000000, 
    status: 'Withdrawn', 
    date: '2025-09-10', 
    agent: 'Tunde Bakare', 
    image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=200',
    summary: 'Classic heritage home beautifully restored.',
    timeline: [
      { date: '2025-09-05', event: 'Offer Submitted (₦430M)' },
      { date: '2025-09-10', event: 'Offer Withdrawn by Buyer' },
    ],
    counterOfferDetails: null,
    agentNotes: 'Client found a better property.',
    buyerNotes: 'Found the Banana Island property instead.',
    estimatedClosing: 'N/A'
  }
];

function StatusBadge({ status }: { status: string }) {
  let cfg = { color: 'text-ink/60', bg: 'bg-white/5 border-white/10', icon: FileText };
  switch(status) {
    case 'Accepted': cfg = { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle2 }; break;
    case 'Draft': cfg = { color: 'text-ink/50', bg: 'bg-white/5 border-white/10', icon: FileEdit }; break;
    case 'Submitted': cfg = { color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', icon: FileText }; break;
    case 'Under Review': cfg = { color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', icon: Clock3 }; break;
    case 'Counter Offer Received': cfg = { color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20', icon: RefreshCw }; break;
    case 'Rejected': cfg = { color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20', icon: XCircle }; break;
    case 'Withdrawn': cfg = { color: 'text-ink/40', bg: 'bg-white/5 border-white/10', icon: Archive }; break;
    case 'Expired': cfg = { color: 'text-rose-400/60', bg: 'bg-rose-400/5 border-rose-400/10', icon: AlertCircle }; break;
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
      <cfg.icon className="h-3 w-3" /> {status}
    </span>
  );
}

export default function Offers() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterDate, setFilterDate] = useState('All');
  const [filterPrice, setFilterPrice] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredAndSortedOffers = useMemo(() => {
    let result = [...mockOffers];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => 
        o.propertyTitle.toLowerCase().includes(q) || 
        o.agent.toLowerCase().includes(q) || 
        o.location.toLowerCase().includes(q)
      );
    }

    if (filterStatus !== 'All') {
      result = result.filter(o => o.status === filterStatus);
    }

    if (filterType !== 'All') {
      result = result.filter(o => o.propertyType === filterType);
    }
    
    if (filterDate !== 'All') {
      if (filterDate === 'Past Month') {
         // rough mock filter for demonstration
         result = result.filter(o => o.date >= '2025-09-01');
      } else if (filterDate === 'Past 6 Months') {
         result = result.filter(o => o.date >= '2025-04-01');
      }
    }

    if (filterPrice !== 'All') {
      result = result.filter(o => {
        if (filterPrice === 'Under 100M') return o.offerAmount < 100000000;
        if (filterPrice === '100M - 500M') return o.offerAmount >= 100000000 && o.offerAmount <= 500000000;
        if (filterPrice === 'Over 500M') return o.offerAmount > 500000000;
        return true;
      });
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') return b.date.localeCompare(a.date);
      if (sortBy === 'oldest') return a.date.localeCompare(b.date);
      if (sortBy === 'highest') return b.offerAmount - a.offerAmount;
      if (sortBy === 'lowest') return a.offerAmount - b.offerAmount;
      return 0;
    });

    return result;
  }, [searchQuery, filterStatus, filterType, filterDate, filterPrice, sortBy]);

  const uniqueStatuses = ['All', 'Draft', 'Submitted', 'Under Review', 'Counter Offer Received', 'Accepted', 'Rejected', 'Withdrawn', 'Expired'];
  const uniqueTypes = ['All', ...new Set(mockOffers.map(o => o.propertyType))];
  const uniqueDates = ['All', 'Past Month', 'Past 6 Months', 'This Year'];
  const uniquePrices = ['All', 'Under 100M', '100M - 500M', 'Over 500M'];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const totalOffers = mockOffers.length;
  const activeOffers = mockOffers.filter(o => ['Submitted', 'Under Review', 'Counter Offer Received'].includes(o.status)).length;
  const acceptedOffers = mockOffers.filter(o => o.status === 'Accepted').length;
  const rejectedOffers = mockOffers.filter(o => o.status === 'Rejected').length;

  const renderDetails = (offer: typeof mockOffers[0]) => (
    <div className="p-5 bg-navy-900/40 border-t border-white/5 text-sm space-y-4">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
           <div>
             <h4 className="font-semibold text-gold-400 mb-1">Property Summary</h4>
             <p className="text-cream/80">{offer.summary}</p>
           </div>
           {offer.counterOfferDetails && (
             <div className="rounded-xl border border-purple-400/20 bg-purple-400/5 p-4">
               <h4 className="font-semibold text-purple-300 mb-1">Counter Offer Details</h4>
               <p className="text-purple-200/80">{offer.counterOfferDetails}</p>
             </div>
           )}
           <div className="grid grid-cols-2 gap-4">
             <div>
               <h4 className="font-semibold text-gold-400 mb-1">Agent Notes</h4>
               <p className="text-cream/80">{offer.agentNotes || 'N/A'}</p>
             </div>
             <div>
               <h4 className="font-semibold text-gold-400 mb-1">Buyer Notes</h4>
               <p className="text-cream/80">{offer.buyerNotes || 'N/A'}</p>
             </div>
           </div>
           <div>
             <h4 className="font-semibold text-gold-400 mb-1">Estimated Closing Timeline</h4>
             <p className="text-cream/80">{offer.estimatedClosing}</p>
           </div>
        </div>
        
        <div>
           <h4 className="font-semibold text-gold-400 mb-2 flex items-center gap-2"><History className="h-4 w-4" /> Negotiation History</h4>
           <div className="space-y-3 pl-3 border-l-2 border-white/10">
             {offer.timeline.map((event, i) => (
               <div key={i} className="relative">
                 <div className="absolute -left-[17px] top-1 h-2 w-2 rounded-full bg-gold-400"></div>
                 <div className="text-xs text-ink/50">{event.date}</div>
                 <div className="text-cream">{event.event}</div>
               </div>
             ))}
           </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5 mt-4">
        <GoldButton size="sm" onClick={() => navigate(ROUTES.PROPERTIES)}><Home className="h-4 w-4 mr-2"/> View Property</GoldButton>
        <GhostButton size="sm" onClick={() => showToast({ type: 'info', title: 'Offer Details', description: 'Offer details will be available during backend integration.' })}><FileText className="h-4 w-4 mr-2"/> View Offer Details</GhostButton>
        {offer.status === 'Counter Offer Received' && (
           <GoldButton size="sm" onClick={() => showToast({ type: 'info', title: 'Respond to Counter', description: 'Counter responses will be available during backend integration.' })}><RefreshCw className="h-4 w-4 mr-2"/> Respond to Counter</GoldButton>
        )}
        <GhostButton size="sm" onClick={() => showToast({ type: 'info', title: 'Contact Agent', description: 'Agent messaging will be available during backend integration.' })}><Phone className="h-4 w-4 mr-2"/> Contact Agent</GhostButton>
        {['Draft', 'Submitted', 'Under Review', 'Counter Offer Received'].includes(offer.status) && (
           <GhostButton size="sm" className="text-rose-400 hover:text-rose-300 border-rose-400/30" onClick={() => showToast({ type: 'info', title: 'Withdraw Offer', description: 'Offer withdrawal will be available during backend integration.' })}><X className="h-4 w-4 mr-2"/> Withdraw Offer</GhostButton>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-2xl font-bold text-cream">Offers Management</h2>
        <p className="text-sm text-ink/60">Track and manage your property offers and negotiations.</p>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="text-sm text-ink/60">Total Offers</div>
          <div className="mt-2 text-2xl font-bold font-heading text-cream">{totalOffers}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="text-sm text-ink/60">Active Offers</div>
          <div className="mt-2 text-2xl font-bold font-heading text-blue-400">{activeOffers}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="text-sm text-ink/60">Accepted</div>
          <div className="mt-2 text-2xl font-bold font-heading text-emerald-400">{acceptedOffers}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="text-sm text-ink/60">Rejected</div>
          <div className="mt-2 text-2xl font-bold font-heading text-rose-400">{rejectedOffers}</div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md space-y-4">
        {/* Search */}
        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by property title, location, or agent..."
          actions={
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 pt-2">
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
                <label className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold pl-1">Price Range</label>
                <select value={filterPrice} onChange={(e) => setFilterPrice(e.target.value)} className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:outline-none">
                  {uniquePrices.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold pl-1">Date</label>
                <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:outline-none">
                  {uniqueDates.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5 col-span-2 lg:col-span-1">
                <label className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold pl-1">Sort By</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:outline-none">
                  <option value="newest">Date (Newest First)</option>
                  <option value="oldest">Date (Oldest First)</option>
                  <option value="highest">Highest Offer</option>
                  <option value="lowest">Lowest Offer</option>
                </select>
              </div>
            </div>
          }
        />
      </div>

      {filteredAndSortedOffers.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-12">
          <EmptyState
            icon={<FileText className="h-12 w-12 text-gold-400" />}
            title="You haven't submitted any offers yet."
            description="When you make an offer on a property, it will appear here."
            actionLabel="Browse Properties"
            onAction={() => navigate(ROUTES.PROPERTIES)}
          />
        </div>
      ) : (
        <>
          {/* Desktop Responsive Table (hidden on mobile/tablet) */}
          <div className="hidden lg:block w-full">
            <DataTable
              data={filteredAndSortedOffers}
              keyExtractor={(offer) => offer.id}
              expandedRowIds={expandedId ? [expandedId] : []}
              renderExpandedRow={(offer) => renderDetails(offer)}
              columns={[
                {
                  header: "Property",
                  render: (offer) => (
                    <div className="flex items-center gap-3">
                      <img src={offer.image} alt={offer.propertyTitle} className="h-10 w-10 rounded-lg object-cover" />
                      <div>
                        <div className="font-semibold">{offer.propertyTitle}</div>
                        <div className="text-xs text-ink/60">{offer.agent}</div>
                      </div>
                    </div>
                  )
                },
                {
                  header: "Asking Price",
                  render: (offer) => <span className="text-ink/80">{formatCurrency(offer.askingPrice)}</span>
                },
                {
                  header: <div className="text-gold-400">Offer Amount</div>,
                  render: (offer) => <span className="font-bold text-gold-400">{formatCurrency(offer.offerAmount)}</span>
                },
                {
                  header: "Date",
                  render: (offer) => <span className="text-ink/80">{offer.date}</span>
                },
                {
                  header: "Status",
                  render: (offer) => <StatusBadge status={offer.status} />
                },
                {
                  header: <div className="text-right">Actions</div>,
                  className: "text-right",
                  render: (offer) => (
                    <button onClick={() => toggleExpand(offer.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 hover:bg-white/5 hover:text-gold-400 transition-colors">
                      {expandedId === offer.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  )
                }
              ]}
            />
          </div>

          {/* Tablet & Mobile Stacked Cards (hidden on desktop) */}
          <div className="grid gap-4 md:grid-cols-2 lg:hidden">
            {filteredAndSortedOffers.map((offer) => (
              <div key={offer.id} className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-navy-800/50">
                <div className="p-5">
                  <div className="flex gap-4">
                    <img src={offer.image} alt={offer.propertyTitle} className="h-20 w-20 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-heading text-lg font-semibold text-cream truncate">{offer.propertyTitle}</h3>
                      </div>
                      <div className="text-xs text-ink/60 mb-2 truncate">{offer.agent}</div>
                      <StatusBadge status={offer.status} />
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="flex flex-col bg-navy-900/50 rounded-lg p-2 border border-white/5 text-center">
                      <span className="text-[10px] text-ink/50 uppercase tracking-wider font-semibold">Asking Price</span>
                      <span className="text-cream mt-0.5">{formatCurrency(offer.askingPrice)}</span>
                    </div>
                    <div className="flex flex-col bg-gold-400/10 rounded-lg p-2 border border-gold-400/20 text-center">
                      <span className="text-[10px] text-gold-400/70 uppercase tracking-wider font-semibold">Offer Amount</span>
                      <span className="text-gold-400 font-bold mt-0.5">{formatCurrency(offer.offerAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 bg-navy-900/30">
                  <button onClick={() => toggleExpand(offer.id)} className="flex w-full items-center justify-center gap-2 p-3 text-xs font-semibold text-gold-400 hover:text-gold-300 hover:bg-white/5 transition-colors">
                    {expandedId === offer.id ? 'Hide Details' : 'View Details'} 
                    {expandedId === offer.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {expandedId === offer.id && renderDetails(offer)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
