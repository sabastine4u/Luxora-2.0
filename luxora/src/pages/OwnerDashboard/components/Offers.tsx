import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  FileCheck,
  XCircle,
  User,
  Calendar,
  MessageSquare,
  TrendingUp,
  Handshake,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout/EmptyState';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { useToast } from '../../../contexts/ToastContext';
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

  const [selectedOffer, setSelectedOffer] = useState<OwnerOffer | null>(
    null,
  );

  // Modals state
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);

  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    action: 'accept' | 'reject' | null;
  }>({
    isOpen: false,
    action: null,
  });

  // Format currency
  const formatMoney = (amount: number) =>
    `₦${(amount / 1000000).toFixed(1)}M`;

  // Retrieve Offers submitted against the authenticated Owner's properties.
  useEffect(() => {
    const loadOwnerOffers = async () => {
      try {
        // Request the Owner's incoming Offers from the backend.
        const response = await offerApi.getOwnerOffers();

        // Read the nested Offers collection returned by the backend API.
        const backendOffers =
          response.data?.data?.offers ??
          response.data?.offers ??
          [];

        // Convert the backend Offer shape into the existing Owner dashboard shape.
        const mappedOffers: OwnerOffer[] = backendOffers.map(
          (offer: any) => ({
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
              image:
                offer.property?.coverImage ||
                offer.property?.images?.[0] ||
                '',
              askingPrice: offer.property?.price || 0,
            },

            amount: offer.offerAmount || 0,
            date: offer.createdAt
              ? offer.createdAt.split('T')[0]
              : '',
            status: offer.status || 'Pending',
            lastUpdated: offer.updatedAt
              ? offer.updatedAt.split('T')[0]
              : '',

            // Deposit, financing, and mortgage information are not
            // currently returned by the Offer backend.
            deposit: 0,
            financing: 'Not provided',
            mortgageStatus: 'Not provided',

            message: offer.buyerNotes || '',

            // Preserve counter-offer details returned by the backend.
            counterOfferAmount:
              offer.counterOfferAmount ?? null,
            counterOfferDetails:
              offer.counterOfferDetails || '',

            timeline: [
              {
                title:
                  offer.status === 'Withdrawn'
                    ? 'Offer withdrawn'
                    : 'Offer submitted',
                date: offer.createdAt
                  ? offer.createdAt.split('T')[0]
                  : '',
                type:
                  offer.status === 'Withdrawn'
                    ? 'warning'
                    : 'success',
              },
            ],
          }),
        );

        // Store the real Offers for the existing Owner UI.
        setOffers(mappedOffers);
      } catch (error) {
        console.error(
          'Failed to load Owner Offers:',
          error,
        );

        showToast({
          type: 'error',
          title: 'Offers could not be loaded',
          description:
            'We could not retrieve your incoming offers.',
        });
      } finally {
        setIsLoadingOffers(false);
      }
    };

    loadOwnerOffers();
  }, [showToast]);

  // Filter & Sort
  const filteredOffers = useMemo(() => {
    return offers
      .filter((off) => {
        const matchProp = off.property.name
          .toLowerCase()
          .includes(searchProperty.toLowerCase());

        const matchBuyer = off.buyer.name
          .toLowerCase()
          .includes(searchBuyer.toLowerCase());

        const matchStatus =
          statusFilter === 'All' ||
          off.status === statusFilter;

        return matchProp && matchBuyer && matchStatus;
      })
      .sort((a, b) => {
        if (sortOrder === 'Newest') {
          return (
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
          );
        }

        if (sortOrder === 'Highest Offer') {
          return b.amount - a.amount;
        }

        if (sortOrder === 'Lowest Offer') {
          return a.amount - b.amount;
        }

        if (sortOrder === 'Recently Updated') {
          return (
            new Date(b.lastUpdated).getTime() -
            new Date(a.lastUpdated).getTime()
          );
        }

        return 0;
      });
  }, [
    offers,
    searchProperty,
    searchBuyer,
    statusFilter,
    sortOrder,
  ]);

  const stats = {
    total: offers.length,

    pending: offers.filter(
      (o) =>
        o.status === 'Pending' ||
        o.status === 'Submitted' ||
        o.status === 'Under Review',
    ).length,

    accepted: offers.filter(
      (o) => o.status === 'Accepted',
    ).length,

    rejected: offers.filter(
      (o) => o.status === 'Rejected',
    ).length,

    countered: offers.filter(
      (o) =>
        o.status === 'Counter Offer Received' ||
        o.status === 'Countered',
    ).length,
  };

  // Calculate real offer insights from the Offers loaded from the backend.
  const offerAmounts = offers
    .map((offer) => offer.amount)
    .filter((amount) => amount > 0);

  const highestOffer =
    offerAmounts.length > 0
      ? Math.max(...offerAmounts)
      : 0;

  const lowestOffer =
    offerAmounts.length > 0
      ? Math.min(...offerAmounts)
      : 0;

  const averageOffer =
    offerAmounts.length > 0
      ? offerAmounts.reduce(
        (sum, amount) => sum + amount,
        0,
      ) / offerAmounts.length
      : 0;

  // Handle Accept and Reject using the real Owner Offer API.
  const handleConfirmAction = async () => {
    if (
      !selectedOffer ||
      !confirmModalConfig.action
    ) {
      return;
    }

    try {
      const response =
        confirmModalConfig.action === 'accept'
          ? await offerApi.acceptOffer(
            selectedOffer.id,
          )
          : await offerApi.rejectOffer(
            selectedOffer.id,
          );

      // IMPORTANT:
      // offerApi/http returns the payload under response.data.
      const updatedOffer = response.data?.offer;

      if (!updatedOffer) {
        throw new Error(
          'Updated Offer was not returned by the server.',
        );
      }

      setOffers((currentOffers) =>
        currentOffers.map((offer) =>
          offer.id === selectedOffer.id
            ? {
              ...offer,
              status: updatedOffer.status,
              lastUpdated: updatedOffer.updatedAt
                ? updatedOffer.updatedAt.split('T')[0]
                : offer.lastUpdated,
            }
            : offer,
        ),
      );

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

      setConfirmModalConfig({
        isOpen: false,
        action: null,
      });

      setSelectedOffer(null);
    } catch (error) {
      console.error(
        'Failed to update Offer:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Offer action failed',
        description:
          'We could not update this offer. Please try again.',
      });
    }
  };

  // Submit a Counter Offer using the real Owner Offer API.
  const handleOfferResponse = async (
    amount: number,
    notes: string,
  ) => {
    if (!selectedOffer) {
      return;
    }

    try {
      const response =
        await offerApi.counterOffer(
          selectedOffer.id,
          {
            counterOfferAmount: amount,
            counterOfferDetails: notes,
          },
        );

      // IMPORTANT:
      // offerApi/http returns the payload under response.data.
      const updatedOffer = response.data?.offer;

      if (!updatedOffer) {
        throw new Error(
          'Updated Offer was not returned by the server.',
        );
      }

      const updatedLastDate =
        updatedOffer.updatedAt
          ? updatedOffer.updatedAt.split('T')[0]
          : selectedOffer.lastUpdated;

      const updatedSelectedOffer: OwnerOffer = {
        ...selectedOffer,
        status: updatedOffer.status,
        counterOfferAmount:
          updatedOffer.counterOfferAmount ?? null,
        counterOfferDetails:
          updatedOffer.counterOfferDetails || '',
        lastUpdated: updatedLastDate,
      };

      // Update the Offer list immediately.
      setOffers((currentOffers) =>
        currentOffers.map((offer) =>
          offer.id === selectedOffer.id
            ? updatedSelectedOffer
            : offer,
        ),
      );

      // Also update the currently open drawer immediately.
      setSelectedOffer(updatedSelectedOffer);

      showToast({
        type: 'success',
        title: 'Counter Offer Sent',
        description:
          'Your counter offer has been submitted to the buyer.',
      });

      // Close the counter modal and return to the Offers page.
      setIsCounterModalOpen(false);
      setSelectedOffer(null);
    } catch (error) {
      console.error(
        'Failed to submit Counter Offer:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Counter offer failed',
        description:
          'We could not submit your counter offer. Please try again.',
      });
    }
  };

  return (
    <div className="relative space-y-8 overflow-hidden pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">
            Offers
          </h2>

          <p className="text-sm text-ink/60">
            Manage and respond to offers submitted for your
            properties.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-2">
        {[
          {
            label: 'Total Offers',
            value: stats.total,
            color: 'text-cream',
          },
          {
            label: 'Pending',
            value: stats.pending,
            color: 'text-blue-400',
          },
          {
            label: 'Counter Offers',
            value: stats.countered,
            color: 'text-yellow-400',
          },
          {
            label: 'Accepted',
            value: stats.accepted,
            color: 'text-emerald-400',
          },
          {
            label: 'Rejected',
            value: stats.rejected,
            color: 'text-rose-400',
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="min-w-[140px] shrink-0 rounded-xl border border-white/10 bg-navy-800/50 p-4"
          >
            <div
              className={`mb-1 text-2xl font-bold ${stat.color}`}
            >
              {stat.value}
            </div>

            <div className="text-[10px] font-semibold uppercase text-ink/50">
              {stat.label}
            </div>
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
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

              <input
                type="text"
                placeholder="Search buyer..."
                className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2 pl-10 pr-4 text-sm text-cream focus:border-gold-400 focus:outline-none"
                value={searchBuyer}
                onChange={(e) =>
                  setSearchBuyer(e.target.value)
                }
              />
            </div>

            <select
              className="rounded-xl border border-white/10 bg-navy-900/50 px-4 py-2 text-sm text-cream focus:outline-none"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="All">All</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">
                Under Review
              </option>
              <option value="Counter Offer Received">
                Counter Offer Received
              </option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
              <option value="Withdrawn">Withdrawn</option>
              <option value="Expired">Expired</option>
            </select>

            <select
              className="rounded-xl border border-white/10 bg-navy-900/50 px-4 py-2 text-sm text-cream focus:outline-none"
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value)
              }
            >
              <option value="Newest">Newest</option>
              <option value="Highest Offer">
                Highest Offer
              </option>
              <option value="Lowest Offer">
                Lowest Offer
              </option>
              <option value="Recently Updated">
                Recently Updated
              </option>
            </select>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {isLoadingOffers ? (
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-8 text-center">
              <p className="text-sm text-ink/60">
                Loading offers...
              </p>
            </div>
          ) : filteredOffers.length === 0 ? (
            <EmptyState
              icon={
                <FileCheck className="h-8 w-8 text-gold-400" />
              }
              title="No offers available."
              description="There are currently no offers matching your filters."
              actionLabel="View Listings"
              onAction={() =>
                navigate(
                  '/owner-dashboard?tab=Listing+Journey',
                )
              }
            />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden w-full md:block">
                <DataTable
                  data={filteredOffers}
                  keyExtractor={(offer) => offer.id}
                  columns={[
                    {
                      header: 'Buyer',
                      render: (offer) => (
                        <div className="flex items-center gap-3">
                          {offer.buyer.avatar ? (
                            <img
                              src={offer.buyer.avatar}
                              alt={offer.buyer.name}
                              className="h-8 w-8 shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-ink/50">
                              <User className="h-4 w-4" />
                            </div>
                          )}

                          <span className="whitespace-nowrap font-semibold text-cream">
                            {offer.buyer.name}
                          </span>
                        </div>
                      ),
                    },
                    {
                      header: 'Property',
                      render: (offer) => (
                        <span className="block max-w-[200px] truncate text-ink/70">
                          {offer.property.name}
                        </span>
                      ),
                    },
                    {
                      header: (
                        <div className="text-right">
                          Offer Amount
                        </div>
                      ),
                      className: 'text-right',
                      render: (offer) => {
                        const diff =
                          offer.amount -
                          offer.property.askingPrice;

                        return (
                          <>
                            <div className="font-bold text-gold-400">
                              {formatMoney(offer.amount)}
                            </div>

                            <div
                              className={`text-[10px] ${diff >= 0
                                  ? 'text-emerald-400'
                                  : 'text-rose-400'
                                }`}
                            >
                              {diff >= 0 ? '+' : ''}
                              {formatMoney(diff)} vs Ask
                            </div>
                          </>
                        );
                      },
                    },
                    {
                      header: 'Date',
                      render: (offer) => (
                        <span className="whitespace-nowrap text-ink/60">
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
                          Action
                        </div>
                      ),
                      className: 'text-right',
                      render: (offer) => (
                        <GhostButton
                          size="sm"
                          onClick={() =>
                            setSelectedOffer(offer)
                          }
                        >
                          Review
                        </GhostButton>
                      ),
                    },
                  ]}
                />
              </div>

              {/* Mobile Cards */}
              <div className="grid gap-4 md:hidden">
                {filteredOffers.map((offer) => {
                  const diff =
                    offer.amount -
                    offer.property.askingPrice;

                  return (
                    <div
                      key={offer.id}
                      className="rounded-2xl border border-white/10 bg-navy-800/50 p-4"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {offer.buyer.avatar ? (
                            <img
                              src={offer.buyer.avatar}
                              alt={offer.buyer.name}
                              className="h-8 w-8 shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-ink/50">
                              <User className="h-4 w-4" />
                            </div>
                          )}

                          <div>
                            <div className="font-semibold text-cream">
                              {offer.buyer.name}
                            </div>

                            <div className="text-[10px] text-ink/50">
                              {offer.date}
                            </div>
                          </div>
                        </div>

                        <EnterpriseStatusBadge
                          status={offer.status}
                        />
                      </div>

                      <div className="mb-4">
                        <div className="mb-1 text-xs text-ink/50">
                          Property
                        </div>

                        <div className="text-sm font-medium text-cream">
                          {offer.property.name}
                        </div>
                      </div>

                      <div className="flex items-end justify-between border-t border-white/5 pt-4">
                        <div>
                          <div className="mb-1 text-xs text-ink/50">
                            Offer Amount
                          </div>

                          <div className="text-lg font-bold text-gold-400">
                            {formatMoney(offer.amount)}
                          </div>

                          <div
                            className={`text-[10px] ${diff >= 0
                                ? 'text-emerald-400'
                                : 'text-rose-400'
                              }`}
                          >
                            {diff >= 0 ? '+' : ''}
                            {formatMoney(diff)} vs Asking
                          </div>
                        </div>

                        <GhostButton
                          size="sm"
                          onClick={() =>
                            setSelectedOffer(offer)
                          }
                        >
                          Review
                        </GhostButton>
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
            <h3 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold text-cream">
              <TrendingUp className="h-5 w-5 text-gold-400" />
              Quick Insights
            </h3>

            <div className="space-y-4">
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <div className="mb-1 text-[10px] font-semibold uppercase text-ink/50">
                  Highest Offer
                </div>

                <div className="text-lg font-bold text-emerald-400">
                  {formatMoney(highestOffer)}
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <div className="mb-1 text-[10px] font-semibold uppercase text-ink/50">
                  Lowest Offer
                </div>

                <div className="text-lg font-bold text-rose-400">
                  {formatMoney(lowestOffer)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/5 bg-navy-900/50 p-3">
                  <div className="mb-1 text-[10px] font-semibold uppercase text-ink/50">
                    Avg Offer
                  </div>

                  <div className="font-bold text-cream">
                    {formatMoney(averageOffer)}
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-navy-900/50 p-3">
                  <div className="mb-1 text-[10px] font-semibold uppercase text-ink/50">
                    Avg Response
                  </div>

                  <div className="font-bold text-cream">
                    —
                  </div>
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
            [
              'Pending',
              'Submitted',
              'Under Review',
              'Countered',
              'Counter Offer Received',
            ].includes(selectedOffer.status) ? (
            <>
              <GoldButton
                className="flex-1 justify-center"
                onClick={() =>
                  setConfirmModalConfig({
                    isOpen: true,
                    action: 'accept',
                  })
                }
              >
                <Handshake className="mr-2 h-4 w-4" />
                Accept
              </GoldButton>

              <GhostButton
                className="flex-1 justify-center border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                onClick={() =>
                  setIsCounterModalOpen(true)
                }
              >
                Counter Offer
              </GhostButton>

              <GhostButton
                className="flex-1 justify-center"
                onClick={() =>
                  navigate(
                    '/owner-dashboard?tab=Messages',
                  )
                }
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Message Buyer
              </GhostButton>

              <GhostButton
                className="flex-1 justify-center border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                onClick={() =>
                  setConfirmModalConfig({
                    isOpen: true,
                    action: 'reject',
                  })
                }
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </GhostButton>
            </>
          ) : (
            <>
              <GhostButton
                className="flex-1 justify-center"
                onClick={() =>
                  navigate(
                    '/owner-dashboard?tab=Listing+Journey',
                  )
                }
              >
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Meeting
              </GhostButton>

              <GhostButton
                className="flex-1 justify-center"
                onClick={() =>
                  navigate(
                    '/owner-dashboard?tab=Messages',
                  )
                }
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Message Buyer
              </GhostButton>
            </>
          )
        }
      >
        {selectedOffer && (
          <div className="space-y-8">
            {/* Buyer & Status */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/5 bg-navy-900 p-4">
              <div className="flex items-center gap-3">
                {selectedOffer.buyer.avatar ? (
                  <img
                    src={selectedOffer.buyer.avatar}
                    alt={selectedOffer.buyer.name}
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-800 text-ink/50">
                    <User className="h-6 w-6" />
                  </div>
                )}

                <div>
                  <div className="text-lg font-semibold text-cream">
                    {selectedOffer.buyer.name}
                  </div>

                  <div className="text-xs text-ink/60">
                    {selectedOffer.buyer.email}
                  </div>
                </div>
              </div>

              <EnterpriseStatusBadge
                status={selectedOffer.status}
              />
            </div>

            {/* Property Summary */}
            <div className="flex gap-4">
              <img
                src={selectedOffer.property.image}
                alt={selectedOffer.property.name}
                className="h-20 w-28 shrink-0 rounded-xl border border-white/10 object-cover"
              />

              <div className="min-w-0">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink/50">
                  Target Property
                </div>

                <h4 className="mb-1 truncate text-lg font-semibold text-cream">
                  {selectedOffer.property.name}
                </h4>

                <div className="mb-2 truncate text-sm text-ink/60">
                  Asking:{' '}
                  {formatMoney(
                    selectedOffer.property.askingPrice,
                  )}
                </div>
              </div>
            </div>

            {/* Offer Financials */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/5 bg-navy-900 p-4">
                <div className="mb-1 text-[10px] font-semibold uppercase text-ink/50">
                  Offer Amount
                </div>

                <div className="mb-1 text-2xl font-bold text-gold-400">
                  {formatMoney(selectedOffer.amount)}
                </div>

                <div
                  className={`text-xs ${selectedOffer.amount -
                      selectedOffer.property.askingPrice >=
                      0
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                    }`}
                >
                  {formatMoney(
                    selectedOffer.amount -
                    selectedOffer.property.askingPrice,
                  )}{' '}
                  vs Asking
                </div>
              </div>

              <div className="flex flex-col justify-center rounded-xl border border-white/5 bg-navy-900 p-4">
                <div className="mb-1 text-[10px] font-semibold uppercase text-ink/50">
                  Proposed Deposit
                </div>

                <div className="mb-1 text-xl font-bold text-cream">
                  {formatMoney(
                    selectedOffer.deposit,
                  )}
                </div>

                <div className="text-xs text-ink/50">
                  {(
                    (selectedOffer.deposit /
                      selectedOffer.amount) *
                    100
                  ).toFixed(0)}
                  % of offer
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-navy-900 p-4">
                <div className="mb-1 text-[10px] font-semibold uppercase text-ink/50">
                  Financing Method
                </div>

                <div className="text-sm font-semibold text-cream">
                  {selectedOffer.financing}
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-navy-900 p-4">
                <div className="mb-1 text-[10px] font-semibold uppercase text-ink/50">
                  Mortgage Status
                </div>

                <div
                  className={`text-sm font-semibold ${selectedOffer.mortgageStatus ===
                      'Pre-approved'
                      ? 'text-emerald-400'
                      : 'text-yellow-400'
                    }`}
                >
                  {selectedOffer.mortgageStatus}
                </div>
              </div>
            </div>

            {/* Message */}
            {selectedOffer.message && (
              <div>
                <h4 className="mb-3 font-semibold text-cream">
                  Message from Buyer
                </h4>

                <div className="rounded-xl border border-white/5 border-l-2 border-l-gold-400 bg-navy-900/50 p-4 text-sm italic leading-relaxed text-ink/80">
                  "{selectedOffer.message}"
                </div>
              </div>
            )}

            {/* Counter Offer */}
            {selectedOffer.counterOfferAmount ? (
              <div>
                <h4 className="mb-3 font-semibold text-cream">
                  Counter Offer
                </h4>

                <div className="space-y-3 rounded-xl border border-white/5 bg-navy-900/50 p-4">
                  <div>
                    <div className="mb-1 text-[10px] font-semibold uppercase text-ink/50">
                      Counter Amount
                    </div>

                    <div className="text-xl font-bold text-yellow-400">
                      {formatMoney(
                        selectedOffer.counterOfferAmount,
                      )}
                    </div>
                  </div>

                  {selectedOffer.counterOfferDetails && (
                    <div>
                      <div className="mb-1 text-[10px] font-semibold uppercase text-ink/50">
                        Message to Buyer
                      </div>

                      <div className="text-sm leading-relaxed text-ink/80">
                        "
                        {
                          selectedOffer.counterOfferDetails
                        }
                        "
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Timeline */}
            <div>
              <h4 className="mb-4 font-semibold text-cream">
                Negotiation Timeline
              </h4>

              <div className="relative ml-3 space-y-6 border-l-2 border-white/5">
                {selectedOffer.timeline.map(
                  (event, idx) => (
                    <div
                      key={idx}
                      className="relative pl-6"
                    >
                      <div
                        className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-navy-950 ${event.type === 'success'
                            ? 'border-emerald-500 bg-emerald-500/20'
                            : event.type === 'warning'
                              ? 'border-yellow-400 bg-yellow-400/20'
                              : 'border-blue-400 bg-blue-400/20'
                          }`}
                      />

                      <div className="text-sm font-semibold text-cream">
                        {event.title}
                      </div>

                      <div className="mt-1 text-xs text-ink/50">
                        {event.date}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      {/* Modals */}
      <ConfirmationModal
        isOpen={confirmModalConfig.isOpen}
        onClose={() =>
          setConfirmModalConfig({
            isOpen: false,
            action: null,
          })
        }
        onConfirm={handleConfirmAction}
        title={
          confirmModalConfig.action === 'accept'
            ? 'Accept Offer'
            : 'Reject Offer'
        }
        description={
          confirmModalConfig.action === 'accept'
            ? 'Are you sure you want to accept this offer? Contract proceedings will be initiated.'
            : 'Are you sure you want to reject this offer? This action cannot be undone.'
        }
        confirmText={
          confirmModalConfig.action === 'accept'
            ? 'Accept Offer'
            : 'Reject Offer'
        }
        isDestructive={
          confirmModalConfig.action === 'reject'
        }
      />

      <OfferResponseModal
        isOpen={isCounterModalOpen}
        onClose={() =>
          setIsCounterModalOpen(false)
        }
        onSubmit={(amount, notes) =>
          handleOfferResponse(amount, notes)
        }
        offer={selectedOffer}
      />
    </div>
  );
}