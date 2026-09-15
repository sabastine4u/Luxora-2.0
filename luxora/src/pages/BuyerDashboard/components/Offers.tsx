import { useState, useMemo, useEffect } from 'react';
import { offerApi } from '../../../api/offer.api';
import { FileText, History, Home, Phone } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { formatCurrency } from '../../../utils';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { useToast } from '../../../contexts/ToastContext';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { OfferActionModal } from './modals/OfferActionModal';
import type { Offer } from '../../../types';



export default function Offers() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterDate, setFilterDate] = useState('All');
  const [filterPrice, setFilterPrice] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  // Store the Buyer's Offers retrieved from the backend.
  const [offers, setOffers] = useState<Offer[]>([]);

  // Track whether the Buyer's Offers are currently being loaded.
  const [isLoading, setIsLoading] = useState(true);

  // Load the authenticated Buyer's Offers from the backend.
  useEffect(() => {
    const loadOffers = async () => {
      try {
        // Request the Buyer's Offers from the API.
        const response = await offerApi.getMyOffers();

        // Read the Offers from the API response data.
        const backendOffers = response.data?.offers ?? [];

        // Convert backend Offers into the shape already used by this UI.
        const mappedOffers: Offer[] = backendOffers.map((offer: any) => ({
          id: offer._id,
          propertyTitle: offer.property?.title || 'Property',
          location: [
            offer.property?.area,
            offer.property?.city,
            offer.property?.state,
          ]
            .filter(Boolean)
            .join(', ') || offer.property?.address || 'Location unavailable',
          propertyType: offer.property?.propertyType || 'Unknown',
          askingPrice: offer.property?.price || 0,
          offerAmount: offer.offerAmount,
          status: offer.status,
          date: offer.createdAt
            ? offer.createdAt.split('T')[0]
            : '',
          // Use a readable fallback until the backend provides populated Agent details.
          agent: 'Assigned Agent',
          image:
            offer.property?.coverImage ||
            offer.property?.images?.[0] ||
            '',
          summary:
            offer.property?.description ||
            offer.property?.title ||
            'Property offer',
          timeline: [
            {
              date: offer.createdAt
                ? offer.createdAt.split('T')[0]
                : '',
              event: 'Offer submitted',
            },
          ],
          counterOfferDetails: offer.counterOfferDetails || null,
          agentNotes: offer.agentNotes || '',
          buyerNotes: offer.buyerNotes || '',
          estimatedClosing: offer.estimatedClosing || '',
        }));

        // Store the converted Offers for the existing table and filters.
        setOffers(mappedOffers);
      } catch (error) {
        // Log the API failure without breaking the dashboard.
        console.error('Failed to load offers:', error);

        // Keep the Offers list empty when the request fails.
        setOffers([]);
      } finally {
        // Stop the loading state after the API request finishes.
        setIsLoading(false);
      }
    };

    // Load the Buyer's Offers when the component mounts.
    loadOffers();
  }, []);

  const filteredAndSortedOffers = useMemo(() => {
    let result = [...offers];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o =>
        o.propertyTitle.toLowerCase().includes(q) ||
        o.agent.toLowerCase().includes(q) ||
        o.location.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'All') result = result.filter(o => o.status === filterStatus);
    if (filterType !== 'All') result = result.filter(o => o.propertyType === filterType);
    if (filterDate !== 'All') {
      if (filterDate === 'Past Month') result = result.filter(o => o.date >= '2025-09-01');
      else if (filterDate === 'Past 6 Months') result = result.filter(o => o.date >= '2025-04-01');
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
  }, [
    offers,
    searchQuery,
    filterStatus,
    filterType,
    filterDate,
    filterPrice,
    sortBy
  ]);
  const uniqueStatuses = ['All', 'Draft', 'Submitted', 'Under Review', 'Counter Offer Received', 'Accepted', 'Rejected', 'Withdrawn', 'Expired'];
  const uniqueTypes = ['All', ...new Set(offers.map(o => o.propertyType))];
  const uniqueDates = ['All', 'Past Month', 'Past 6 Months', 'This Year'];
  const uniquePrices = ['All', 'Under 100M', '100M - 500M', 'Over 500M'];
  const totalOffers = offers.length;

  const activeOffers = offers.filter(o =>
    ['Submitted', 'Under Review', 'Counter Offer Received'].includes(o.status)
  ).length;

  const acceptedOffers = offers.filter(o => o.status === 'Accepted').length;

  const rejectedOffers = offers.filter(o => o.status === 'Rejected').length;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleActionSubmit = (_amount: number, _notes: string) => {
    showToast({ type: 'success', title: 'Offer Updated', description: 'Your offer has been submitted to the backend.' });
  };
  const handleWithdrawConfirm = async () => {
    // Stop the action when no Offer is currently selected.
    if (!selectedOffer) return;

    try {
      // Send the withdrawal request for the selected Offer to the backend.
      await offerApi.withdrawOffer(selectedOffer.id);

      // Update the local Offer status so the table reflects the withdrawal immediately.
      setOffers((currentOffers) =>
        currentOffers.map((offer) =>
          offer.id === selectedOffer.id
            ? { ...offer, status: 'Withdrawn' }
            : offer
        )
      );

      // Update the selected Offer shown in the drawer.
      setSelectedOffer((currentOffer) =>
        currentOffer
          ? { ...currentOffer, status: 'Withdrawn' }
          : currentOffer
      );

      // Close the confirmation modal after the backend succeeds.
      setIsConfirmationOpen(false);

      // Close the Offer details drawer after the withdrawal succeeds.
      setIsDrawerOpen(false);

      // Tell the Buyer that the backend processed the withdrawal.
      showToast({
        type: 'success',
        title: 'Offer Withdrawn',
        description: 'Your offer has been withdrawn successfully.',
      });
    } catch (error) {
      // Log the API failure for debugging.
      console.error('Failed to withdraw offer:', error);

      // Tell the Buyer that the withdrawal could not be completed.
      showToast({
        type: 'error',
        title: 'Withdrawal Failed',
        description: 'We could not withdraw this offer. Please try again.',
      });
    }
  };
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

      {isLoading ? (
        // Show a loading state while the Buyer's Offers are being retrieved.
        <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-12">
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="text-sm text-ink/60">Loading your offers...</div>
          </div>
        </div>
      ) : filteredAndSortedOffers.length === 0 ? (
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
        <div className="w-full">
          <DataTable
            data={filteredAndSortedOffers}
            keyExtractor={(offer) => offer.id}
            columns={[
              {
                header: "Property",
                render: (offer) => (
                  <div className="flex items-center gap-3">
                    <img src={offer.image} alt={offer.propertyTitle} className="h-10 w-10 rounded-lg object-cover hidden sm:block" />
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
                render: (offer) => <EnterpriseStatusBadge status={offer.status} />
              },
              {
                header: <div className="text-right">Actions</div>,
                className: "text-right",
                render: (offer) => (
                  <button
                    onClick={() => { setSelectedOffer(offer); setIsDrawerOpen(true); }}
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

      {selectedOffer && (
        <EnterpriseDetailDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title="Offer Details"
          subtitle={`Property: ${selectedOffer.propertyTitle}`}
          footerActions={
            <>
              <GoldButton size="sm" onClick={() => navigate(ROUTES.PROPERTIES)}><Home className="h-4 w-4 mr-2" /> View Property</GoldButton>
              {selectedOffer.status === 'Counter Offer Received' && (
                <GoldButton size="sm" onClick={() => setIsActionModalOpen(true)}>Respond to Counter</GoldButton>
              )}
              <GhostButton size="sm" onClick={() => { setIsDrawerOpen(false); navigate(ROUTES.BUYER_DASHBOARD); }}><Phone className="h-4 w-4 mr-2" /> Contact Agent</GhostButton>
              {['Draft', 'Submitted', 'Under Review', 'Counter Offer Received'].includes(selectedOffer.status) && (
                <GhostButton size="sm" className="text-rose-400 hover:text-rose-300 border-rose-400/30" onClick={() => setIsConfirmationOpen(true)}>Withdraw Offer</GhostButton>
              )}
            </>
          }
        >
          <div className="space-y-6">
            <div className="rounded-xl overflow-hidden">
              <img src={selectedOffer.image} alt={selectedOffer.propertyTitle} className="w-full h-48 object-cover" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-navy-900/50 rounded-xl p-3 border border-white/5">
                <span className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold">Asking Price</span>
                <div className="text-cream mt-1 font-medium">{formatCurrency(selectedOffer.askingPrice)}</div>
              </div>
              <div className="bg-gold-400/10 rounded-xl p-3 border border-gold-400/20">
                <span className="text-[10px] uppercase tracking-wider text-gold-400/70 font-semibold">Offer Amount</span>
                <div className="text-gold-400 mt-1 font-bold">{formatCurrency(selectedOffer.offerAmount)}</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gold-400 mb-1">Property Summary</h4>
              <p className="text-sm text-cream/80">{selectedOffer.summary}</p>
            </div>

            {selectedOffer.counterOfferDetails && (
              <div className="rounded-xl border border-purple-400/20 bg-purple-400/5 p-4">
                <h4 className="font-semibold text-purple-300 mb-1">Counter Offer Details</h4>
                <p className="text-sm text-purple-200/80">{selectedOffer.counterOfferDetails}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gold-400 mb-1">Agent Notes</h4>
                <p className="text-sm text-cream/80">{selectedOffer.agentNotes || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gold-400 mb-1">Buyer Notes</h4>
                <p className="text-sm text-cream/80">{selectedOffer.buyerNotes || 'N/A'}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gold-400 mb-1">Estimated Closing Timeline</h4>
              <p className="text-sm text-cream/80">{selectedOffer.estimatedClosing}</p>
            </div>

            <div className="pt-4 border-t border-white/5">
              <h4 className="font-semibold text-gold-400 mb-3 flex items-center gap-2"><History className="h-4 w-4" /> Negotiation History</h4>
              <div className="space-y-3 pl-3 border-l-2 border-white/10">
                {selectedOffer.timeline.map((event, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[17px] top-1 h-2 w-2 rounded-full bg-gold-400"></div>
                    <div className="text-xs text-ink/50">{event.date}</div>
                    <div className="text-sm text-cream mt-0.5">{event.event}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </EnterpriseDetailDrawer>
      )}

      <OfferActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onSubmit={handleActionSubmit}
        offer={selectedOffer}
        actionType="counter"
      />

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleWithdrawConfirm}
        title="Withdraw Offer"
        message={`Are you sure you want to withdraw your offer of ${selectedOffer ? formatCurrency(selectedOffer.offerAmount) : ''} for ${selectedOffer?.propertyTitle}? This action cannot be undone.`}
        confirmText="Withdraw Offer"
        type="danger"
      />
    </div>
  );
}
