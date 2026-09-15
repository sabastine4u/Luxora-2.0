import { useState, useMemo, useEffect } from 'react';
import { Search, FileCheck, XCircle, User, Calendar, MessageSquare, TrendingUp, Handshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout/EmptyState';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { useToast } from '../../../contexts/ToastContext';
// Import the Offer API used to retrieve the Owner's incoming Offers.
import { offerApi } from '../../../api/offer.api';
import type { OwnerOffer } from '../../../types/owner';
import ConfirmationModal from './modals/ConfirmationModal';
import OfferResponseModal from './modals/OfferResponseModal';

export default function Offers() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchProperty, setSearchProperty] = useState('');
  const [searchBuyer, setSearchBuyer] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');

  // Store the real Offers returned by the Owner Offers API.
  const [offers, setOffers] = useState<OwnerOffer[]>([]);

  // Track the loading state while Owner Offers are being retrieved.
  const [isLoadingOffers, setIsLoadingOffers] = useState(true);

  const [selectedOffer, setSelectedOffer] = useState<OwnerOffer | null>(null);

  // Modals state
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState<{ isOpen: boolean, action: 'accept' | 'reject' | null }>({ isOpen: false, action: null });

  // Format currency
  const formatMoney = (amount: number) => `₦${(amount / 1000000).toFixed(1)}M`;

  // Retrieve Offers submitted against the authenticated Owner's properties.
  useEffect(() => {
    const loadOwnerOffers = async () => {
      try {
        // Request the Owner's incoming Offers from the backend.
        const response = await offerApi.getOwnerOffers();
        // Read the nested Offers collection returned by the backend API.
        const backendOffers = response.data?.data?.offers ?? response.data?.offers ?? [];
        // Convert the backend Offer shape into the existing Owner dashboard shape.
        // Convert backend Offers into the existing Owner dashboard data structure.
        const mappedOffers: OwnerOffer[] = backendOffers.map((offer: any) => ({
          id: offer._id,

          buyer: {
            name: offer.buyer?.fullName || 'Unknown Buyer',
            avatar: '',
            email: offer.buyer?.email || '',
            phone: offer.buyer?.phone || '',
          },

          property: {
            id: offer.property?._id || '',
            name: offer.property?.title || 'Property',
            image: offer.property?.coverImage || offer.property?.images?.[0] || '',
            askingPrice: offer.property?.price || 0,
          },

          amount: offer.offerAmount || 0,
          date: offer.createdAt ? offer.createdAt.split('T')[0] : '',
          status: offer.status || 'Pending',
          lastUpdated: offer.updatedAt ? offer.updatedAt.split('T')[0] : '',

          // Deposit, financing, and mortgage information are not currently returned by the Offer backend.
          deposit: 0,
          financing: 'Not provided',
          mortgageStatus: 'Not provided',

          message: offer.buyerNotes || '',

          // Preserve counter-offer details returned by the backend.
          counterOfferAmount: offer.counterOfferAmount ?? null,
          counterOfferDetails: offer.counterOfferDetails || '',

          timeline: [
            {
              title: offer.status === 'Withdrawn' ? 'Offer withdrawn' : 'Offer submitted',
              date: offer.createdAt ? offer.createdAt.split('T')[0] : '',
              type: offer.status === 'Withdrawn' ? 'warning' : 'success',
            },
          ],
        }));

        // Store the real Offers for the existing Owner UI.
        setOffers(mappedOffers);
      } catch (error) {
        // Keep the dashboard usable if the Offers request fails.
        console.error('Failed to load Owner Offers:', error);

        showToast({
          type: 'error',
          title: 'Offers could not be loaded',
          description: 'We could not retrieve your incoming offers.',
        });
      } finally {
        // Stop displaying the loading state after the request completes.
        setIsLoadingOffers(false);
      }
    };

    loadOwnerOffers();
  }, [showToast]);

  // Filter & Sort
  const filteredOffers = useMemo(() => {
    return offers.filter(off => {
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
  }, [offers, searchProperty, searchBuyer, statusFilter, sortOrder]);

  const stats = {
    total: offers.length,

    // Submitted and Under Review represent Offers awaiting Owner action.
    pending: offers.filter(
      o =>
        o.status === 'Pending' ||
        o.status === 'Submitted' ||
        o.status === 'Under Review'
    ).length,

    // Count Offers that the Owner has accepted.
    accepted: offers.filter(o => o.status === 'Accepted').length,

    // Count Offers that the Owner has rejected.
    rejected: offers.filter(o => o.status === 'Rejected').length,

    // Count real counter offers returned by the backend.
    countered: offers.filter(
      o =>
        o.status === 'Counter Offer Received' ||
        o.status === 'Countered'
    ).length,
  };

  // Calculate real offer insights from the Offers loaded from the backend.
  const offerAmounts = offers
    .map(offer => offer.amount)
    .filter(amount => amount > 0);

  const highestOffer = offerAmounts.length > 0
    ? Math.max(...offerAmounts)
    : 0;

  const lowestOffer = offerAmounts.length > 0
    ? Math.min(...offerAmounts)
    : 0;

  const averageOffer = offerAmounts.length > 0
    ? offerAmounts.reduce((sum, amount) => sum + amount, 0) / offerAmounts.length
    : 0;

  // Handle Accept and Reject using the real Owner Offer API.
  const handleConfirmAction = async () => {
    // Make sure an Offer and an action are selected before calling the API.
    if (!selectedOffer || !confirmModalConfig.action) return;

    try {
      // Call the matching backend endpoint for the selected action.
      const response =
        confirmModalConfig.action === 'accept'
          ? await offerApi.acceptOffer(selectedOffer.id)
          : await offerApi.rejectOffer(selectedOffer.id);

      // Read the updated Offer returned by the backend.
      const updatedOffer = response.data?.data?.offer;

      if (!updatedOffer) {
        throw new Error('Updated Offer was not returned by the server.');
      }

      // Update the existing Offer in the dashboard without refreshing the page.
      setOffers(currentOffers =>
        currentOffers.map(offer =>
          offer.id === selectedOffer.id
            ? {
              ...offer,
              status: updatedOffer.status,
              lastUpdated: updatedOffer.updatedAt
                ? updatedOffer.updatedAt.split('T')[0]
                : offer.lastUpdated,
            }
            : offer
        )
      );

      // Only show success after the backend confirms the action.
      showToast({
        type: 'success',
        title:
          confirmModalConfig.action === 'accept'
            ? 'Offer Accepted'
            : 'Offer Rejected',
        description:
          confirmModalConfig.action === 'accept'
            ? 'The offer has been accepted successfully.'
            : 'The offer has been rejected successfully.',
      });

      // Close the confirmation modal and selected Offer.
      setConfirmModalConfig({ isOpen: false, action: null });
      setSelectedOffer(null);
    } catch (error) {
      // Keep the current UI state if the backend request fails.
      console.error('Failed to update Offer:', error);

      showToast({
        type: 'error',
        title: 'Offer action failed',
        description: 'We could not update this offer. Please try again.',
      });
    }
  };

  // Submit a Counter Offer using the real Owner Offer API.
  const handleOfferResponse = async (amount: number, notes: string) => {
    // Make sure an Offer is selected before submitting the counter.
    if (!selectedOffer) return;

    try {
      // Send the Owner's counter amount and message to the backend.
      const response = await offerApi.counterOffer(selectedOffer.id, {
        counterOfferAmount: amount,
        counterOfferDetails: notes,
      });

      // Read the updated Offer returned by the backend.
      const updatedOffer = response.data?.data?.offer;

      if (!updatedOffer) {
        throw new Error('Updated Offer was not returned by the server.');
      }

      // Update the Offer in the dashboard with the real backend values.
      setOffers(currentOffers =>
        currentOffers.map(offer =>
          offer.id === selectedOffer.id
            ? {
              ...offer,
              status: updatedOffer.status,
              counterOfferAmount: updatedOffer.counterOfferAmount ?? null,
              counterOfferDetails: updatedOffer.counterOfferDetails || '',
              lastUpdated: updatedOffer.updatedAt
                ? updatedOffer.updatedAt.split('T')[0]
                : offer.lastUpdated,
            }
            : offer
        )
      );

      // Show success only after the backend confirms the counter.
      showToast({
        type: 'success',
        title: 'Counter Offer Sent',
        description: 'Your counter offer has been submitted to the buyer.',
      });

      // Close the counter modal.
      setIsCounterModalOpen(false);
    } catch (error) {
      // Keep the existing Offer state if the request fails.
      console.error('Failed to submit Counter Offer:', error);

      showToast({
        type: 'error',
        title: 'Counter offer failed',
        description: 'We could not submit your counter offer. Please try again.',
      });
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
              {/* Allow the Owner to view all incoming Offers. */}
              <option value="All">All</option>

              {/* Match the real Offer statuses returned by the backend. */}
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Counter Offer Received">Counter Offer Received</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
              <option value="Withdrawn">Withdrawn</option>
              <option value="Expired">Expired</option>
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
          {isLoadingOffers ? (
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-8 text-center">
              <p className="text-sm text-ink/60">Loading offers...</p>
            </div>
          ) : filteredOffers.length === 0 ? (
            <EmptyState
              icon={<FileCheck className="h-8 w-8 text-gold-400" />}
              title="No offers available."
              description="There are currently no offers matching your filters."
              actionLabel="View Listings"
              onAction={() => navigate('/owner-dashboard?tab=Listing+Journey')}
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
                      render: (offer) => <EnterpriseStatusBadge status={offer.status} />
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
                        <EnterpriseStatusBadge status={offer.status} />
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
            <h3 className="font-heading text-lg font-bold text-cream mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-gold-400" /> Quick Insights</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-navy-900/50 border border-white/5">
                <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">Highest Offer</div>
                <div className="font-bold text-emerald-400 text-lg">
                  {formatMoney(highestOffer)}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-navy-900/50 border border-white/5">
                <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">Lowest Offer</div>
                <div className="font-bold text-rose-400 text-lg">
                  {formatMoney(lowestOffer)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-navy-900/50 border border-white/5">
                  <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">Avg Offer</div>
                  <div className="font-bold text-cream">
                    {formatMoney(averageOffer)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-navy-900/50 border border-white/5">
                  <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">Avg Response</div>
                  <div className="font-bold text-cream">—</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      <EnterpriseDetailDrawer
        isOpen={!!selectedOffer}
        onClose={() => setSelectedOffer(null)}
        title="Offer Details"
        footerActions={
          selectedOffer &&
            ['Pending', 'Submitted', 'Under Review', 'Countered', 'Counter Offer Received'].includes(
              selectedOffer.status
            ) ? (
            <>
              <GoldButton className="flex-1 justify-center" onClick={() => setConfirmModalConfig({ isOpen: true, action: 'accept' })}>
                <Handshake className="h-4 w-4 mr-2" /> Accept
              </GoldButton>
              <GhostButton className="flex-1 justify-center bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20" onClick={() => setIsCounterModalOpen(true)}>
                Counter Offer
              </GhostButton>
              <GhostButton className="flex-1 justify-center" onClick={() => navigate('/owner-dashboard?tab=Messages')}>
                <MessageSquare className="h-4 w-4 mr-2" /> Message Buyer
              </GhostButton>
              <GhostButton className="flex-1 justify-center border-rose-500/20 text-rose-400 hover:bg-rose-500/10" onClick={() => setConfirmModalConfig({ isOpen: true, action: 'reject' })}>
                <XCircle className="h-4 w-4 mr-2" /> Reject
              </GhostButton>
            </>
          ) : (
            <>
              <GhostButton className="flex-1 justify-center" onClick={() => navigate('/owner-dashboard?tab=Listing+Journey')}>
                <Calendar className="h-4 w-4 mr-2" /> Schedule Meeting
              </GhostButton>
              <GhostButton className="flex-1 justify-center" onClick={() => navigate('/owner-dashboard?tab=Messages')}>
                <MessageSquare className="h-4 w-4 mr-2" /> Message Buyer
              </GhostButton>
            </>
          )
        }
      >
        {selectedOffer && (
          <div className="space-y-8">
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
              <EnterpriseStatusBadge status={selectedOffer.status} />
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

            {/* Counter Offer */}
            {selectedOffer.counterOfferAmount ? (
              <div>
                <h4 className="font-semibold text-cream mb-3">Counter Offer</h4>

                <div className="p-4 rounded-xl bg-navy-900/50 border border-white/5 space-y-3">
                  <div>
                    <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">
                      Counter Amount
                    </div>

                    <div className="font-bold text-yellow-400 text-xl">
                      {formatMoney(selectedOffer.counterOfferAmount)}
                    </div>
                  </div>

                  {selectedOffer.counterOfferDetails && (
                    <div>
                      <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">
                        Message to Buyer
                      </div>

                      <div className="text-sm text-ink/80 leading-relaxed">
                        "{selectedOffer.counterOfferDetails}"
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Timeline */}
            <div>
              <h4 className="font-semibold text-cream mb-4">Negotiation Timeline</h4>
              <div className="relative border-l-2 border-white/5 ml-3 space-y-6">
                {selectedOffer.timeline.map((event, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-navy-950 ${event.type === 'success' ? 'border-emerald-500 bg-emerald-500/20' :
                      event.type === 'warning' ? 'border-yellow-400 bg-yellow-400/20' : 'border-blue-400 bg-blue-400/20'
                      }`} />
                    <div className="text-sm font-semibold text-cream">{event.title}</div>
                    <div className="text-xs text-ink/50 mt-1">{event.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      {/* Modals */}
      <ConfirmationModal
        isOpen={confirmModalConfig.isOpen}
        onClose={() => setConfirmModalConfig({ isOpen: false, action: null })}
        onConfirm={handleConfirmAction}
        title={confirmModalConfig.action === 'accept' ? "Accept Offer" : "Reject Offer"}
        description={confirmModalConfig.action === 'accept' ? "Are you sure you want to accept this offer? Contract proceedings will be initiated." : "Are you sure you want to reject this offer? This action cannot be undone."}
        confirmText={confirmModalConfig.action === 'accept' ? "Accept Offer" : "Reject Offer"}
        isDestructive={confirmModalConfig.action === 'reject'}
      />

      <OfferResponseModal
        isOpen={isCounterModalOpen}
        onClose={() => setIsCounterModalOpen(false)}
        // Pass the counter amount and message to the real backend handler.
        onSubmit={(amount, notes) => handleOfferResponse(amount, notes)}
        offer={selectedOffer}
      />
    </div>
  );
}
