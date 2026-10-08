import { useState, useMemo, useEffect } from 'react';
import { offerApi } from '../../../api/offer.api';
import {
  FileText,
  History,
  Home,
  Phone,
} from 'lucide-react';
import {
  GhostButton,
  GoldButton,
} from '../../../components/ui/ui';
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

type BuyerOffer = Offer & {
  propertyId: string;
  counterOfferAmount?: number | null;
};

export default function Offers() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterDate, setFilterDate] = useState('All');
  const [filterPrice, setFilterPrice] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const [selectedOffer, setSelectedOffer] =
    useState<BuyerOffer | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] =
    useState(false);

  const [isActionModalOpen, setIsActionModalOpen] =
    useState(false);

  const [isConfirmationOpen, setIsConfirmationOpen] =
    useState(false);

  // Store the Buyer's Offers retrieved from the backend.
  const [offers, setOffers] = useState<BuyerOffer[]>([]);

  // Track whether the Buyer's Offers are currently being loaded.
  const [isLoading, setIsLoading] = useState(true);

  // Load the authenticated Buyer's Offers from the backend.
  useEffect(() => {
    const loadOffers = async () => {
      try {
        const response = await offerApi.getMyOffers();

        const backendOffers =
          response.data?.offers ?? [];

        const mappedOffers: BuyerOffer[] =
          backendOffers.map((offer: any) => ({
            id: offer._id,

            propertyId:
              offer.property?._id || '',

            propertyTitle:
              offer.property?.title || 'Property',

            location:
              [
                offer.property?.area,
                offer.property?.city,
                offer.property?.state,
              ]
                .filter(Boolean)
                .join(', ') ||
              offer.property?.address ||
              'Location unavailable',

            propertyType:
              offer.property?.propertyType ||
              'Unknown',

            askingPrice:
              offer.property?.price || 0,

            offerAmount:
              offer.offerAmount || 0,

            status:
              offer.status || 'Submitted',

            date: offer.createdAt
              ? offer.createdAt.split('T')[0]
              : '',

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

            counterOfferAmount:
              offer.counterOfferAmount ?? null,

            counterOfferDetails:
              offer.counterOfferDetails || null,

            agentNotes:
              offer.agentNotes || '',

            buyerNotes:
              offer.buyerNotes || '',

            estimatedClosing:
              offer.estimatedClosing || '',
          }));

        setOffers(mappedOffers);
      } catch (error) {
        console.error(
          'Failed to load offers:',
          error,
        );

        setOffers([]);

        showToast({
          type: 'error',
          title: 'Offers could not be loaded',
          description:
            'We could not retrieve your offers.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadOffers();
  }, [showToast]);

  const filteredAndSortedOffers = useMemo(() => {
    let result = [...offers];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();

      result = result.filter(
        (offer) =>
          offer.propertyTitle
            .toLowerCase()
            .includes(q) ||
          offer.agent
            .toLowerCase()
            .includes(q) ||
          offer.location
            .toLowerCase()
            .includes(q),
      );
    }

    if (filterStatus !== 'All') {
      result = result.filter(
        (offer) =>
          offer.status === filterStatus,
      );
    }

    if (filterType !== 'All') {
      result = result.filter(
        (offer) =>
          offer.propertyType === filterType,
      );
    }

    if (filterDate !== 'All') {
      if (filterDate === 'Past Month') {
        result = result.filter(
          (offer) =>
            offer.date >= '2025-09-01',
        );
      } else if (
        filterDate === 'Past 6 Months'
      ) {
        result = result.filter(
          (offer) =>
            offer.date >= '2025-04-01',
        );
      }
    }

    if (filterPrice !== 'All') {
      result = result.filter((offer) => {
        if (filterPrice === 'Under 100M') {
          return offer.offerAmount < 100000000;
        }

        if (filterPrice === '100M - 500M') {
          return (
            offer.offerAmount >= 100000000 &&
            offer.offerAmount <= 500000000
          );
        }

        if (filterPrice === 'Over 500M') {
          return offer.offerAmount > 500000000;
        }

        return true;
      });
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return b.date.localeCompare(a.date);
      }

      if (sortBy === 'oldest') {
        return a.date.localeCompare(b.date);
      }

      if (sortBy === 'highest') {
        return b.offerAmount - a.offerAmount;
      }

      if (sortBy === 'lowest') {
        return a.offerAmount - b.offerAmount;
      }

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
    sortBy,
  ]);

  const uniqueStatuses = [
    'All',
    'Draft',
    'Submitted',
    'Under Review',
    'Counter Offer Received',
    'Accepted',
    'Rejected',
    'Withdrawn',
    'Expired',
  ];

  const uniqueTypes = [
    'All',
    ...new Set(
      offers.map(
        (offer) => offer.propertyType,
      ),
    ),
  ];

  const uniqueDates = [
    'All',
    'Past Month',
    'Past 6 Months',
    'This Year',
  ];

  const uniquePrices = [
    'All',
    'Under 100M',
    '100M - 500M',
    'Over 500M',
  ];

  const totalOffers = offers.length;

  const activeOffers = offers.filter((offer) =>
    [
      'Submitted',
      'Under Review',
      'Counter Offer Received',
    ].includes(offer.status),
  ).length;

  const acceptedOffers = offers.filter(
    (offer) => offer.status === 'Accepted',
  ).length;

  const rejectedOffers = offers.filter(
    (offer) => offer.status === 'Rejected',
  ).length;

  /*
   * Handles the result of Buyer actions from OfferActionModal.
   *
   * Accept Counter:
   *   Counter Offer Received → Accepted
   *
   * Reject Counter:
   *   Counter Offer Received → Rejected
   *
   * Buyer Counter:
   *   Counter Offer Received → Submitted
   *   Existing offerAmount → new counter amount
   */
  const handleActionSubmit = (
    amount: number,
    notes: string,
  ) => {
    if (!selectedOffer) return;

   let newStatus: Offer['status'];
    let successTitle: string;
    let successDescription: string;

    // Buyer accepted the Owner's counter.
    if (
      notes === 'Counter offer accepted.'
    ) {
      newStatus = 'Accepted';
      successTitle =
        'Counter Offer Accepted';
      successDescription =
        'You accepted the owner’s counter offer.';
    }

    // Buyer rejected the Owner's counter.
    else if (
      notes === 'Counter offer rejected.'
    ) {
      newStatus = 'Rejected';
      successTitle =
        'Counter Offer Rejected';
      successDescription =
        'You rejected the owner’s counter offer.';
    }

    // Buyer submitted a new counter offer.
    else if (
      notes === 'Counter offer submitted.'
    ) {
      newStatus = 'Submitted';
      successTitle =
        'Counter Offer Sent';
      successDescription =
        'Your counter offer has been sent back to the owner.';
    }

    // Preserve existing revise-offer behavior.
    else {
      newStatus = 'Submitted';
      successTitle = 'Offer Updated';
      successDescription =
        'Your revised offer has been submitted.';
    }

    setOffers((currentOffers) =>
      currentOffers.map((offer) =>
        offer.id === selectedOffer.id
          ? {
              ...offer,

              // The Buyer Counter flow changes the
              // actual offer amount.
              offerAmount:
                newStatus === 'Submitted'
                  ? amount
                  : offer.offerAmount,

              status: newStatus,

              // Once the Buyer responds with a new
              // counter, the Owner's previous counter
              // no longer remains active.
              counterOfferAmount:
                newStatus === 'Submitted'
                  ? null
                  : offer.counterOfferAmount,

              counterOfferDetails:
                newStatus === 'Submitted'
                  ? null
                  : offer.counterOfferDetails,
            }
          : offer,
      ),
    );

    setSelectedOffer((currentOffer) =>
      currentOffer
        ? {
            ...currentOffer,

            offerAmount:
              newStatus === 'Submitted'
                ? amount
                : currentOffer.offerAmount,

            status: newStatus,

            counterOfferAmount:
              newStatus === 'Submitted'
                ? null
                : currentOffer.counterOfferAmount,

            counterOfferDetails:
              newStatus === 'Submitted'
                ? null
                : currentOffer.counterOfferDetails,
          }
        : currentOffer,
    );

    setIsActionModalOpen(false);
    setIsDrawerOpen(false);

    showToast({
      type: 'success',
      title: successTitle,
      description: successDescription,
    });
  };

  const handleWithdrawConfirm =
    async () => {
      if (!selectedOffer) return;

      try {
        await offerApi.withdrawOffer(
          selectedOffer.id,
        );

        setOffers((currentOffers) =>
          currentOffers.map((offer) =>
            offer.id === selectedOffer.id
              ? {
                  ...offer,
                  status: 'Withdrawn',
                }
              : offer,
          ),
        );

        setSelectedOffer(
          (currentOffer) =>
            currentOffer
              ? {
                  ...currentOffer,
                  status: 'Withdrawn',
                }
              : currentOffer,
        );

        setIsConfirmationOpen(false);
        setIsDrawerOpen(false);

        showToast({
          type: 'success',
          title: 'Offer Withdrawn',
          description:
            'Your offer has been withdrawn successfully.',
        });
      } catch (error) {
        console.error(
          'Failed to withdraw offer:',
          error,
        );

        showToast({
          type: 'error',
          title: 'Withdrawal Failed',
          description:
            'We could not withdraw this offer. Please try again.',
        });
      }
    };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-2xl font-bold text-cream">
          Offers Management
        </h2>

        <p className="text-sm text-ink/60">
          Track and manage your property offers and
          negotiations.
        </p>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="text-sm text-ink/60">
            Total Offers
          </div>

          <div className="mt-2 font-heading text-2xl font-bold text-cream">
            {totalOffers}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="text-sm text-ink/60">
            Active Offers
          </div>

          <div className="mt-2 font-heading text-2xl font-bold text-blue-400">
            {activeOffers}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="text-sm text-ink/60">
            Accepted
          </div>

          <div className="mt-2 font-heading text-2xl font-bold text-emerald-400">
            {acceptedOffers}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="text-sm text-ink/60">
            Rejected
          </div>

          <div className="mt-2 font-heading text-2xl font-bold text-rose-400">
            {rejectedOffers}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4 rounded-3xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md">
        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by property title, location, or agent..."
          actions={
            <div className="grid grid-cols-2 gap-4 pt-2 lg:grid-cols-5">
              <div className="flex flex-col gap-1.5">
                <label className="pl-1 text-[10px] font-semibold uppercase tracking-wider text-ink/50">
                  Status
                </label>

                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:outline-none"
                >
                  {uniqueStatuses.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="pl-1 text-[10px] font-semibold uppercase tracking-wider text-ink/50">
                  Property Type
                </label>

                <select
                  value={filterType}
                  onChange={(e) =>
                    setFilterType(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:outline-none"
                >
                  {uniqueTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="pl-1 text-[10px] font-semibold uppercase tracking-wider text-ink/50">
                  Price Range
                </label>

                <select
                  value={filterPrice}
                  onChange={(e) =>
                    setFilterPrice(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:outline-none"
                >
                  {uniquePrices.map((price) => (
                    <option
                      key={price}
                      value={price}
                    >
                      {price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="pl-1 text-[10px] font-semibold uppercase tracking-wider text-ink/50">
                  Date
                </label>

                <select
                  value={filterDate}
                  onChange={(e) =>
                    setFilterDate(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:outline-none"
                >
                  {uniqueDates.map((date) => (
                    <option
                      key={date}
                      value={date}
                    >
                      {date}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 flex flex-col gap-1.5 lg:col-span-1">
                <label className="pl-1 text-[10px] font-semibold uppercase tracking-wider text-ink/50">
                  Sort By
                </label>

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:outline-none"
                >
                  <option value="newest">
                    Date (Newest First)
                  </option>
                  <option value="oldest">
                    Date (Oldest First)
                  </option>
                  <option value="highest">
                    Highest Offer
                  </option>
                  <option value="lowest">
                    Lowest Offer
                  </option>
                </select>
              </div>
            </div>
          }
        />
      </div>

      {/* Loading / Empty / Table */}
      {isLoading ? (
        <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-12">
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="text-sm text-ink/60">
              Loading your offers...
            </div>
          </div>
        </div>
      ) : filteredAndSortedOffers.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-12">
          <EmptyState
            icon={
              <FileText className="h-12 w-12 text-gold-400" />
            }
            title="You haven't submitted any offers yet."
            description="When you make an offer on a property, it will appear here."
            actionLabel="Browse Properties"
            onAction={() =>
              navigate(ROUTES.PROPERTIES)
            }
          />
        </div>
      ) : (
        <div className="w-full">
          <DataTable
            data={filteredAndSortedOffers}
            keyExtractor={(offer) => offer.id}
            columns={[
              {
                header: 'Property',
                render: (offer) => (
                  <div className="flex items-center gap-3">
                    <img
                      src={offer.image}
                      alt={offer.propertyTitle}
                      className="hidden h-10 w-10 rounded-lg object-cover sm:block"
                    />

                    <div>
                      <div className="font-semibold">
                        {offer.propertyTitle}
                      </div>

                      <div className="text-xs text-ink/60">
                        {offer.agent}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                header: 'Asking Price',
                render: (offer) => (
                  <span className="text-ink/80">
                    {formatCurrency(
                      offer.askingPrice,
                    )}
                  </span>
                ),
              },
              {
                header: (
                  <div className="text-gold-400">
                    Offer Amount
                  </div>
                ),
                render: (offer) => (
                  <span className="font-bold text-gold-400">
                    {formatCurrency(
                      offer.offerAmount,
                    )}
                  </span>
                ),
              },
              {
                header: 'Date',
                render: (offer) => (
                  <span className="text-ink/80">
                    {offer.date}
                  </span>
                ),
              },
              {
                header: 'Status',
                render: (offer) => (
                  <EnterpriseStatusBadge
                    status={offer.status}
                  />
                ),
              },
              {
                header: (
                  <div className="text-right">
                    Actions
                  </div>
                ),
                className: 'text-right',
                render: (offer) => (
                  <button
                    onClick={() => {
                      setSelectedOffer(offer);
                      setIsDrawerOpen(true);
                    }}
                    className="inline-flex h-8 items-center justify-center rounded-lg border border-white/10 px-3 text-xs font-semibold transition-colors hover:bg-white/5 hover:text-gold-400"
                  >
                    View Details
                  </button>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* Offer Details Drawer */}
      {selectedOffer && (
        <EnterpriseDetailDrawer
          isOpen={isDrawerOpen}
          onClose={() =>
            setIsDrawerOpen(false)
          }
          title="Offer Details"
          subtitle={`Property: ${selectedOffer.propertyTitle}`}
          footerActions={
            <>
              <GoldButton
                size="sm"
                onClick={() => {
                  if (!selectedOffer.propertyId) {
                    showToast({
                      type: 'error',
                      title:
                        'Property Unavailable',
                      description:
                        'This offer is not linked to a property record.',
                    });

                    return;
                  }

                  const propertyRoute =
                    ROUTES.PROPERTY_DETAILS.replace(
                      ':id',
                      selectedOffer.propertyId,
                    );

                  setIsDrawerOpen(false);
                  navigate(propertyRoute);
                }}
              >
                <Home className="mr-2 h-4 w-4" />
                View Property
              </GoldButton>

              {selectedOffer.status ===
                'Counter Offer Received' && (
                <GoldButton
                  size="sm"
                  onClick={() =>
                    setIsActionModalOpen(true)
                  }
                >
                  Respond to Counter
                </GoldButton>
              )}

              <GhostButton
                size="sm"
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate(
                    ROUTES.BUYER_DASHBOARD,
                  );
                }}
              >
                <Phone className="mr-2 h-4 w-4" />
                Contact Agent
              </GhostButton>

              {[
                'Draft',
                'Submitted',
                'Under Review',
                'Counter Offer Received',
              ].includes(selectedOffer.status) && (
                <GhostButton
                  size="sm"
                  className="border-rose-400/30 text-rose-400 hover:text-rose-300"
                  onClick={() =>
                    setIsConfirmationOpen(true)
                  }
                >
                  Withdraw Offer
                </GhostButton>
              )}
            </>
          }
        >
          <div className="space-y-6">
            {/* Property Image */}
            <div className="overflow-hidden rounded-xl">
              <img
                src={selectedOffer.image}
                alt={selectedOffer.propertyTitle}
                className="h-48 w-full object-cover"
              />
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-ink/50">
                  Asking Price
                </span>

                <div className="mt-1 font-medium text-cream">
                  {formatCurrency(
                    selectedOffer.askingPrice,
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-gold-400/20 bg-gold-400/10 p-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-400/70">
                  Offer Amount
                </span>

                <div className="mt-1 font-bold text-gold-400">
                  {formatCurrency(
                    selectedOffer.offerAmount,
                  )}
                </div>
              </div>
            </div>

            {/* Property Summary */}
            <div>
              <h4 className="mb-1 font-semibold text-gold-400">
                Property Summary
              </h4>

              <p className="text-sm text-cream/80">
                {selectedOffer.summary}
              </p>
            </div>

            {/* Counter Offer */}
            {selectedOffer.counterOfferAmount &&
              selectedOffer.counterOfferDetails && (
                <div className="rounded-xl border border-purple-400/20 bg-purple-400/5 p-4">
                  <h4 className="mb-1 font-semibold text-purple-300">
                    Counter Offer
                  </h4>

                  <div className="mb-2 text-lg font-bold text-purple-300">
                    {formatCurrency(
                      selectedOffer.counterOfferAmount,
                    )}
                  </div>

                  <p className="text-sm text-purple-200/80">
                    {selectedOffer.counterOfferDetails}
                  </p>
                </div>
              )}

            {/* Agent / Buyer Notes */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="mb-1 font-semibold text-gold-400">
                  Agent Notes
                </h4>

                <p className="text-sm text-cream/80">
                  {selectedOffer.agentNotes ||
                    'N/A'}
                </p>
              </div>

              <div>
                <h4 className="mb-1 font-semibold text-gold-400">
                  Buyer Notes
                </h4>

                <p className="text-sm text-cream/80">
                  {selectedOffer.buyerNotes ||
                    'N/A'}
                </p>
              </div>
            </div>

            {/* Estimated Closing */}
            <div>
              <h4 className="mb-1 font-semibold text-gold-400">
                Estimated Closing Timeline
              </h4>

              <p className="text-sm text-cream/80">
                {selectedOffer.estimatedClosing ||
                  'N/A'}
              </p>
            </div>

            {/* Negotiation History */}
            <div className="border-t border-white/5 pt-4">
              <h4 className="mb-3 flex items-center gap-2 font-semibold text-gold-400">
                <History className="h-4 w-4" />
                Negotiation History
              </h4>

              <div className="space-y-3 border-l-2 border-white/10 pl-3">
                {selectedOffer.timeline.map(
                  (event, i) => (
                    <div
                      key={i}
                      className="relative"
                    >
                      <div className="absolute -left-[17px] top-1 h-2 w-2 rounded-full bg-gold-400" />

                      <div className="text-xs text-ink/50">
                        {event.date}
                      </div>

                      <div className="mt-0.5 text-sm text-cream">
                        {event.event}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </EnterpriseDetailDrawer>
      )}

      {/* Buyer Counter / Response Modal */}
      <OfferActionModal
        isOpen={isActionModalOpen}
        onClose={() =>
          setIsActionModalOpen(false)
        }
        onSubmit={handleActionSubmit}
        offer={selectedOffer}
        actionType="counter"
      />

      {/* Withdraw Confirmation */}
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() =>
          setIsConfirmationOpen(false)
        }
        onConfirm={handleWithdrawConfirm}
        title="Withdraw Offer"
        message={`Are you sure you want to withdraw your offer of ${
          selectedOffer
            ? formatCurrency(
                selectedOffer.offerAmount,
              )
            : ''
        } for ${
          selectedOffer?.propertyTitle || ''
        }? This action cannot be undone.`}
        confirmText="Withdraw Offer"
        type="danger"
      />
    </div>
  );
}