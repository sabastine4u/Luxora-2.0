import { useState, useMemo } from 'react';
import { Search, FileCheck, CheckCircle2, Clock3, XCircle, User, Calendar, MessageSquare, X, TrendingUp, Handshake, AlertCircle } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { Modal } from '../../../components/ui/Modal';
import { EmptyState } from '../../../components/layout/EmptyState';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { properties } from '../../../data/luxoraData';

// Types
type OfferStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Countered' | 'Expired' | 'Withdrawn';

interface OfferData {
  id: string;
  property: { id: string; name: string; image: string; askingPrice: number };
  buyer: { name: string; avatar: string; email: string; phone: string };
  amount: number;
  date: string;
  status: OfferStatus;
  lastUpdated: string;
  deposit: number;
  financing: string;
  mortgageStatus: string;
  message: string;
  timeline: { title: string; date: string; type: 'success' | 'info' | 'warning' }[];
}

// Mock Data
const mockOffers: OfferData[] = [
  {
    id: 'OFF-105',
    property: { id: 'p1', name: 'Skyline Penthouse Residence', image: properties[0].image, askingPrice: 420000000 },
    buyer: { name: 'Bisi Williams', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop', email: 'bisi@example.com', phone: '+234 800 000 0000' },
    amount: 410000000,
    date: '2025-10-15',
    lastUpdated: '2025-10-15',
    status: 'Pending',
    deposit: 41000000,
    financing: 'Mortgage',
    mortgageStatus: 'Pre-approved',
    message: 'I love the penthouse! I have my mortgage pre-approved and I am ready to close quickly if we can agree on 410M.',
    timeline: [
      { title: 'Offer Submitted', date: 'Oct 15, 2025', type: 'info' }
    ]
  },
  {
    id: 'OFF-104',
    property: { id: 'p2', name: 'Garden Court Villa', image: properties[1].image, askingPrice: 680000000 },
    buyer: { name: 'Chidi Okafor', avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop', email: 'chidi@example.com', phone: '+234 800 111 1111' },
    amount: 680000000,
    date: '2025-10-10',
    lastUpdated: '2025-10-14',
    status: 'Accepted',
    deposit: 136000000,
    financing: 'Cash',
    mortgageStatus: 'N/A',
    message: 'Full asking price in cash. Let us proceed to contract signing.',
    timeline: [
      { title: 'Accepted', date: 'Oct 14, 2025', type: 'success' },
      { title: 'Viewed by Owner', date: 'Oct 11, 2025', type: 'info' },
      { title: 'Offer Submitted', date: 'Oct 10, 2025', type: 'info' }
    ]
  },
  {
    id: 'OFF-102',
    property: { id: 'p3', name: 'Banana Island Plot', image: properties[2].image, askingPrice: 250000000 },
    buyer: { name: 'Anonymous Buyer', avatar: '', email: 'agent@example.com', phone: 'Contact Agent' },
    amount: 200000000,
    date: '2025-10-05',
    lastUpdated: '2025-10-06',
    status: 'Countered',
    deposit: 20000000,
    financing: 'Mortgage',
    mortgageStatus: 'Pending',
    message: 'Looking for a quick deal at 200M.',
    timeline: [
      { title: 'Counter Sent', date: 'Oct 06, 2025', type: 'warning' },
      { title: 'Offer Submitted', date: 'Oct 05, 2025', type: 'info' }
    ]
  }
];

export default function Offers() {
  const [searchProperty, setSearchProperty] = useState('');
  const [searchBuyer, setSearchBuyer] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');
  
  const [selectedOffer, setSelectedOffer] = useState<OfferData | null>(null);
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);

  // Format currency
  const formatMoney = (amount: number) => `₦${(amount / 1000000).toFixed(1)}M`;

  // Filter & Sort
  const filteredOffers = useMemo(() => {
    return mockOffers.filter(off => {
      const matchProp = off.property.name.toLowerCase().includes(searchProperty.toLowerCase());
      const matchBuyer = off.buyer.name.toLowerCase().includes(searchBuyer.toLowerCase());
      const matchStatus = statusFilter === 'All' || off.status === statusFilter;
      return matchProp && matchBuyer && matchStatus;
    }).sort((a, b) => {
      if (sortOrder === 'Newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortOrder === 'Highest Offer') return b.amount - a.amount;
      if (sortOrder === 'Lowest Offer') return a.amount - b.amount;
      if (sortOrder === 'Recently Updated') return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      return 0;
    });
  }, [searchProperty, searchBuyer, statusFilter, sortOrder]);

  const stats = {
    total: mockOffers.length,
    pending: mockOffers.filter(o => o.status === 'Pending').length,
    accepted: mockOffers.filter(o => o.status === 'Accepted').length,
    rejected: mockOffers.filter(o => o.status === 'Rejected').length,
    countered: mockOffers.filter(o => o.status === 'Countered').length
  };

  const getStatusConfig = (status: OfferStatus) => {
    switch (status) {
      case 'Accepted': return { bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', icon: CheckCircle2 };
      case 'Pending': return { bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400', icon: Clock3 };
      case 'Countered': return { bg: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400', icon: AlertCircle };
      case 'Rejected': return { bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400', icon: XCircle };
      case 'Expired': return { bg: 'bg-white/5 border-white/10 text-ink/50', icon: Clock3 };
      case 'Withdrawn': return { bg: 'bg-white/5 border-white/10 text-ink/50', icon: XCircle };
      default: return { bg: 'bg-white/5 border-white/10 text-ink/50', icon: FileCheck };
    }
  };

  return (
    <div className="space-y-8 pb-12 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Offers</h2>
          <p className="text-sm text-ink/60">Manage and respond to offers submitted for your properties.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
        {[
          { label: 'Total Offers', value: stats.total, color: 'text-cream' },
          { label: 'Pending', value: stats.pending, color: 'text-blue-400' },
          { label: 'Counter Offers', value: stats.countered, color: 'text-yellow-400' },
          { label: 'Accepted', value: stats.accepted, color: 'text-emerald-400' },
          { label: 'Rejected', value: stats.rejected, color: 'text-rose-400' }
        ].map((stat, idx) => (
          <div key={idx} className="rounded-xl border border-white/10 bg-navy-800/50 p-4 min-w-[140px] shrink-0">
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-[10px] text-ink/50 uppercase font-semibold">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <DataTableToolbar
        searchValue={searchProperty}
        onSearchChange={setSearchProperty}
        searchPlaceholder="Search property..."
        actions={
          <>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/50" />
              <input 
                type="text"
                placeholder="Search buyer..."
                className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2 pl-10 pr-4 text-sm text-cream focus:border-gold-400 focus:outline-none"
                value={searchBuyer}
                onChange={e => setSearchBuyer(e.target.value)}
              />
            </div>
            <select 
              className="rounded-xl border border-white/10 bg-navy-900/50 py-2 px-4 text-sm text-cream focus:outline-none"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Countered">Countered</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select 
              className="rounded-xl border border-white/10 bg-navy-900/50 py-2 px-4 text-sm text-cream focus:outline-none"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
            >
              <option value="Newest">Newest</option>
              <option value="Highest Offer">Highest Offer</option>
              <option value="Lowest Offer">Lowest Offer</option>
              <option value="Recently Updated">Recently Updated</option>
            </select>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          {filteredOffers.length === 0 ? (
            <EmptyState
              icon={<FileCheck className="h-8 w-8 text-gold-400" />}
              title="No offers available."
              description="There are currently no offers matching your filters."
              actionLabel="View Listings"
              onAction={() => alert('Mock: View Listings')}
            />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block w-full">
                <DataTable
                  data={filteredOffers}
                  keyExtractor={(offer) => offer.id}
                  columns={[
                    {
                      header: "Buyer",
                      render: (offer) => (
                        <div className="flex items-center gap-3">
                          {offer.buyer.avatar ? (
                            <img src={offer.buyer.avatar} alt={offer.buyer.name} className="h-8 w-8 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-navy-900 flex items-center justify-center text-ink/50 shrink-0"><User className="h-4 w-4" /></div>
                          )}
                          <span className="font-semibold text-cream whitespace-nowrap">{offer.buyer.name}</span>
                        </div>
                      )
                    },
                    {
                      header: "Property",
                      render: (offer) => <span className="text-ink/70 truncate max-w-[200px] block">{offer.property.name}</span>
                    },
                    {
                      header: <div className="text-right">Offer Amount</div>,
                      className: "text-right",
                      render: (offer) => {
                        const diff = offer.amount - offer.property.askingPrice;
                        return (
                          <>
                            <div className="font-bold text-gold-400">{formatMoney(offer.amount)}</div>
                            <div className={`text-[10px] ${diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {diff >= 0 ? '+' : ''}{formatMoney(diff)} vs Ask
                            </div>
                          </>
                        );
                      }
                    },
                    {
                      header: "Date",
                      render: (offer) => <span className="text-ink/60 whitespace-nowrap">{offer.date}</span>
                    },
                    {
                      header: "Status",
                      render: (offer) => {
                        const cfg = getStatusConfig(offer.status);
                        return (
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${cfg.bg}`}>
                            <cfg.icon className="h-3 w-3" /> {offer.status}
                          </span>
                        );
                      }
                    },
                    {
                      header: <div className="text-right">Action</div>,
                      className: "text-right",
                      render: (offer) => (
                        <GhostButton size="sm" onClick={() => setSelectedOffer(offer)}>Review</GhostButton>
                      )
                    }
                  ]}
                />
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden grid gap-4">
                {filteredOffers.map(offer => {
                  const cfg = getStatusConfig(offer.status);
                  const diff = offer.amount - offer.property.askingPrice;
                  return (
                    <div key={offer.id} className="rounded-2xl border border-white/10 bg-navy-800/50 p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          {offer.buyer.avatar ? (
                            <img src={offer.buyer.avatar} alt={offer.buyer.name} className="h-8 w-8 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-navy-900 flex items-center justify-center text-ink/50 shrink-0"><User className="h-4 w-4" /></div>
                          )}
                          <div>
                            <div className="font-semibold text-cream">{offer.buyer.name}</div>
                            <div className="text-[10px] text-ink/50">{offer.date}</div>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${cfg.bg}`}>
                          {offer.status}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-xs text-ink/50 mb-1">Property</div>
                        <div className="text-sm font-medium text-cream">{offer.property.name}</div>
                      </div>

                      <div className="flex justify-between items-end border-t border-white/5 pt-4">
                        <div>
                          <div className="text-xs text-ink/50 mb-1">Offer Amount</div>
                          <div className="font-bold text-gold-400 text-lg">{formatMoney(offer.amount)}</div>
                          <div className={`text-[10px] ${diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {diff >= 0 ? '+' : ''}{formatMoney(diff)} vs Asking
                          </div>
                        </div>
                        <GhostButton size="sm" onClick={() => setSelectedOffer(offer)}>Review</GhostButton>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Quick Insights Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-gold-400"/> Quick Insights</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-navy-900/50 border border-white/5">
                <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">Highest Offer</div>
                <div className="font-bold text-emerald-400 text-lg">₦680.0M</div>
              </div>
              <div className="p-4 rounded-xl bg-navy-900/50 border border-white/5">
                <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">Lowest Offer</div>
                <div className="font-bold text-rose-400 text-lg">₦200.0M</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-navy-900/50 border border-white/5">
                  <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">Avg Offer</div>
                  <div className="font-bold text-cream">₦430.0M</div>
                </div>
                <div className="p-3 rounded-xl bg-navy-900/50 border border-white/5">
                  <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">Avg Response</div>
                  <div className="font-bold text-cream">1.2 Days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedOffer && (
        <>
          <div className="fixed inset-0 bg-navy-900/80 backdrop-blur-sm z-[100] transition-opacity" onClick={() => setSelectedOffer(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-full md:w-[600px] bg-navy-950 border-l border-white/10 z-[110] p-6 overflow-y-auto flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-heading text-xl font-bold text-cream">Offer Details</h3>
              <button onClick={() => setSelectedOffer(null)} className="p-2 text-ink/50 hover:text-cream rounded-full hover:bg-white/5 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-8 flex-1">
              
              {/* Buyer & Status */}
              <div className="flex flex-wrap gap-4 items-center justify-between p-4 rounded-xl bg-navy-900 border border-white/5">
                <div className="flex items-center gap-3">
                  {selectedOffer.buyer.avatar ? (
                    <img src={selectedOffer.buyer.avatar} alt={selectedOffer.buyer.name} className="h-12 w-12 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-navy-800 flex items-center justify-center text-ink/50 shrink-0"><User className="h-6 w-6" /></div>
                  )}
                  <div>
                    <div className="font-semibold text-cream text-lg">{selectedOffer.buyer.name}</div>
                    <div className="text-xs text-ink/60">{selectedOffer.buyer.email}</div>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${getStatusConfig(selectedOffer.status).bg}`}>
                  {selectedOffer.status}
                </span>
              </div>

              {/* Property Summary */}
              <div className="flex gap-4">
                <img src={selectedOffer.property.image} alt={selectedOffer.property.name} className="h-20 w-28 rounded-xl object-cover border border-white/10 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-ink/50 uppercase font-semibold tracking-wider mb-1">Target Property</div>
                  <h4 className="font-semibold text-cream text-lg mb-1 truncate">{selectedOffer.property.name}</h4>
                  <div className="text-sm text-ink/60 mb-2 truncate">Asking: {formatMoney(selectedOffer.property.askingPrice)}</div>
                </div>
              </div>

              {/* Offer Financials */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-navy-900 border border-white/5">
                  <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">Offer Amount</div>
                  <div className="font-bold text-gold-400 text-2xl mb-1">{formatMoney(selectedOffer.amount)}</div>
                  <div className={`text-xs ${selectedOffer.amount - selectedOffer.property.askingPrice >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatMoney(selectedOffer.amount - selectedOffer.property.askingPrice)} vs Asking
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-navy-900 border border-white/5 flex flex-col justify-center">
                  <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">Proposed Deposit</div>
                  <div className="font-bold text-cream text-xl mb-1">{formatMoney(selectedOffer.deposit)}</div>
                  <div className="text-xs text-ink/50">{((selectedOffer.deposit / selectedOffer.amount) * 100).toFixed(0)}% of offer</div>
                </div>
                <div className="p-4 rounded-xl bg-navy-900 border border-white/5">
                  <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">Financing Method</div>
                  <div className="font-semibold text-cream text-sm">{selectedOffer.financing}</div>
                </div>
                <div className="p-4 rounded-xl bg-navy-900 border border-white/5">
                  <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">Mortgage Status</div>
                  <div className={`font-semibold text-sm ${selectedOffer.mortgageStatus === 'Pre-approved' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                    {selectedOffer.mortgageStatus}
                  </div>
                </div>
              </div>

              {/* Message */}
              {selectedOffer.message && (
                <div>
                  <h4 className="font-semibold text-cream mb-3">Message from Buyer</h4>
                  <div className="p-4 rounded-xl bg-navy-900/50 border border-white/5 border-l-2 border-l-gold-400 text-sm text-ink/80 italic leading-relaxed">
                    "{selectedOffer.message}"
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h4 className="font-semibold text-cream mb-4">Negotiation Timeline</h4>
                <div className="relative border-l-2 border-white/5 ml-3 space-y-6">
                  {selectedOffer.timeline.map((event, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-navy-950 ${
                        event.type === 'success' ? 'border-emerald-500 bg-emerald-500/20' : 
                        event.type === 'warning' ? 'border-yellow-400 bg-yellow-400/20' : 'border-blue-400 bg-blue-400/20'
                      }`} />
                      <div className="text-sm font-semibold text-cream">{event.title}</div>
                      <div className="text-xs text-ink/50 mt-1">{event.date}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-white/5 space-y-3 shrink-0">
              {selectedOffer.status === 'Pending' || selectedOffer.status === 'Countered' ? (
                <>
                  <div className="flex gap-3">
                    <GoldButton className="flex-1 justify-center" onClick={() => alert('Mock: Accept Offer')}><Handshake className="h-4 w-4 mr-2" /> Accept</GoldButton>
                    <GhostButton className="flex-1 justify-center bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20" onClick={() => setIsCounterModalOpen(true)}>Counter Offer</GhostButton>
                  </div>
                  <div className="flex gap-3">
                    <GhostButton className="flex-1 justify-center" onClick={() => alert('Mock: Message')}><MessageSquare className="h-4 w-4 mr-2" /> Message Buyer</GhostButton>
                    <GhostButton className="flex-1 justify-center border-rose-500/20 text-rose-400 hover:bg-rose-500/10" onClick={() => alert('Mock: Reject Offer')}><XCircle className="h-4 w-4 mr-2" /> Reject</GhostButton>
                  </div>
                </>
              ) : (
                <div className="flex gap-3">
                  <GhostButton className="flex-1 justify-center" onClick={() => alert('Mock: Schedule Meeting')}><Calendar className="h-4 w-4 mr-2" /> Schedule Meeting</GhostButton>
                  <GhostButton className="flex-1 justify-center" onClick={() => alert('Mock: Message')}><MessageSquare className="h-4 w-4 mr-2" /> Message Buyer</GhostButton>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Counter Offer Modal */}
      <Modal isOpen={isCounterModalOpen} onClose={() => setIsCounterModalOpen(false)} title="Submit Counter Offer">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink/50 uppercase mb-2">Counter Amount (₦)</label>
            <input 
              type="text" 
              className="w-full rounded-xl border border-white/10 bg-navy-900 py-3 px-4 text-cream focus:border-gold-400 focus:outline-none" 
              placeholder="e.g. 415000000"
              defaultValue={selectedOffer?.amount}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink/50 uppercase mb-2">Message to Buyer</label>
            <textarea 
              className="w-full rounded-xl border border-white/10 bg-navy-900 py-3 px-4 text-cream focus:border-gold-400 focus:outline-none h-24 resize-none" 
              placeholder="Provide a reason or terms for your counter offer..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink/50 uppercase mb-2">Expected Response Date</label>
            <input 
              type="date" 
              className="w-full rounded-xl border border-white/10 bg-navy-900 py-3 px-4 text-cream focus:border-gold-400 focus:outline-none" 
            />
          </div>
          <div className="pt-4 flex gap-3">
            <GoldButton className="flex-1 justify-center" onClick={() => { alert('Mock: Counter Sent'); setIsCounterModalOpen(false); }}>Send Counter Offer</GoldButton>
            <GhostButton className="flex-1 justify-center" onClick={() => setIsCounterModalOpen(false)}>Cancel</GhostButton>
          </div>
        </div>
      </Modal>

    </div>
  );
}
