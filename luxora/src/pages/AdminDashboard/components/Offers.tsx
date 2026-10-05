import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  FileCheck,
  XCircle,
  User,
  MessageSquare,
  TrendingUp,
  Handshake,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  GoldButton,
  GhostButton,
} from '../../../components/ui/ui';

import { EmptyState } from '../../../components/layout/EmptyState';

import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';

import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';

import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';

import { useToast } from '../../../contexts/ToastContext';

import { offerApi } from '../../../api/offer.api';

import type { OwnerOffer } from '../../../types/owner';

import ConfirmationModal from '../../OwnerDashboard/components/modals/ConfirmationModal';

import OfferResponseModal from '../../OwnerDashboard/components/modals/OfferResponseModal';

export default function Offers() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [searchProperty, setSearchProperty] =
    useState('');

  const [searchBuyer, setSearchBuyer] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('All');

  const [sortOrder, setSortOrder] =
    useState('Newest');

  // Store real Offers belonging only to the authenticated Admin's Properties.
  const [offers, setOffers] =
    useState<OwnerOffer[]>([]);

  // Track the initial loading state.
  const [isLoadingOffers, setIsLoadingOffers] =
    useState(true);

  const [selectedOffer, setSelectedOffer] =
    useState<OwnerOffer | null>(null);

  const [isCounterModalOpen, setIsCounterModalOpen] =
    useState(false);

  const [confirmModalConfig, setConfirmModalConfig] =
    useState<{
      isOpen: boolean;
      action: 'accept' | 'reject' | null;
    }>({
      isOpen: false,
      action: null,
    });

  // Format monetary values consistently with the existing Offer UI.
  const formatMoney = (amount: number) =>
    `₦${(amount / 1000000).toFixed(1)}M`;

  /*
   * Load Offers created against Properties owned by
   * the authenticated Admin as the Property creator.
   */
  useEffect(() => {
    const loadAdminOffers = async () => {
      try {
        setIsLoadingOffers(true);

        const response =
          await offerApi.getAdminOffers();

        /*
         * Backend response:
         *
         * {
         *   status: "success",
         *   results: number,
         *   data: {
         *     offers: [...]
         *   }
         * }
         */
        const backendOffers =
          response.data?.data?.offers ??
          response.data?.offers ??
          [];

        /*
         * Convert the backend Offer shape into the
         * existing OwnerOffer UI shape.
         */
        const mappedOffers: OwnerOffer[] =
          backendOffers.map(
            (offer: any) => ({
              id: offer._id,

              buyer: {
                name:
                  offer.buyer?.fullName ||
                  'Unknown Buyer',

                avatar:
                  offer.buyer?.avatar ||
                  '',

                email:
                  offer.buyer?.email ||
                  '',

                phone:
                  offer.buyer?.phone ||
                  '',
              },

              property: {
                id:
                  offer.property?._id ||
                  '',

                name:
                  offer.property?.title ||
                  'Property',

                image:
                  offer.property
                    ?.coverImage ||
                  offer.property
                    ?.images?.[0] ||
                  '',

                askingPrice:
                  Number(
                    offer.property?.price,
                  ) || 0,
              },

              amount:
                Number(
                  offer.offerAmount,
                ) || 0,

              date:
                offer.createdAt
                  ? offer.createdAt.split(
                      'T',
                    )[0]
                  : '',

              status:
                offer.status ||
                'Submitted',

              lastUpdated:
                offer.updatedAt
                  ? offer.updatedAt.split(
                      'T',
                    )[0]
                  : '',

              // These fields are not currently returned by the Offer backend.
              deposit: 0,
              financing: 'Not provided',
              mortgageStatus:
                'Not provided',

              message:
                offer.buyerNotes ||
                '',

              counterOfferAmount:
                offer.counterOfferAmount ??
                null,

              counterOfferDetails:
                offer.counterOfferDetails ||
                '',

              timeline: [
                {
                  title:
                    offer.status ===
                    'Accepted'
                      ? 'Offer accepted'
                      : offer.status ===
                          'Rejected'
                        ? 'Offer rejected'
                        : 'Offer submitted',

                  date:
                    offer.createdAt
                      ? offer.createdAt.split(
                          'T',
                        )[0]
                      : '',

                  type:
                    offer.status ===
                    'Accepted'
                      ? 'success'
                      : offer.status ===
                          'Rejected'
                        ? 'warning'
                        : 'info',
                },
              ],
            }),
          );

        setOffers(mappedOffers);
      } catch (error) {
        console.error(
          'Failed to load Admin Offers:',
          error,
        );

        showToast({
          type: 'error',
          title:
            'Offers could not be loaded',
          description:
            'We could not retrieve Offers for your Admin Properties.',
        });
      } finally {
        setIsLoadingOffers(false);
      }
    };

    void loadAdminOffers();
  }, [showToast]);

  /*
   * Filter and sort the real backend Offers.
   */
  const filteredOffers = useMemo(() => {
    return offers
      .filter((offer) => {
        const matchProperty =
          offer.property.name
            .toLowerCase()
            .includes(
              searchProperty.toLowerCase(),
            );

        const matchBuyer =
          offer.buyer.name
            .toLowerCase()
            .includes(
              searchBuyer.toLowerCase(),
            );

        const matchStatus =
          statusFilter === 'All' ||
          offer.status ===
            statusFilter;

        return (
          matchProperty &&
          matchBuyer &&
          matchStatus
        );
      })
      .sort((a, b) => {
        if (sortOrder === 'Newest') {
          return (
            new Date(
              b.date,
            ).getTime() -
            new Date(
              a.date,
            ).getTime()
          );
        }

        if (
          sortOrder ===
          'Highest Offer'
        ) {
          return (
            b.amount -
            a.amount
          );
        }

        if (
          sortOrder ===
          'Lowest Offer'
        ) {
          return (
            a.amount -
            b.amount
          );
        }

        if (
          sortOrder ===
          'Recently Updated'
        ) {
          return (
            new Date(
              b.lastUpdated,
            ).getTime() -
            new Date(
              a.lastUpdated,
            ).getTime()
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

  /*
   * Calculate real summary statistics.
   */
  const stats = {
    total: offers.length,

    pending: offers.filter(
      (offer) =>
        offer.status ===
          'Submitted' ||
        offer.status ===
          'Under Review' ||
        offer.status ===
          'Pending',
    ).length,

    accepted: offers.filter(
      (offer) =>
        offer.status ===
        'Accepted',
    ).length,

    rejected: offers.filter(
      (offer) =>
        offer.status ===
        'Rejected',
    ).length,

    countered: offers.filter(
      (offer) =>
        offer.status ===
          'Countered' ||
        offer.status ===
          'Counter Offer Received',
    ).length,
  };

  /*
   * Calculate real Offer insights.
   */
  const offerAmounts = offers
    .map(
      (offer) => offer.amount,
    )
    .filter(
      (amount) => amount > 0,
    );

  const highestOffer =
    offerAmounts.length > 0
      ? Math.max(
          ...offerAmounts,
        )
      : 0;

  const lowestOffer =
    offerAmounts.length > 0
      ? Math.min(
          ...offerAmounts,
        )
      : 0;

  const averageOffer =
    offerAmounts.length > 0
      ? offerAmounts.reduce(
          (
            sum,
            amount,
          ) =>
            sum + amount,
          0,
        ) /
        offerAmounts.length
      : 0;

  /*
   * Accept or Reject the selected Offer.
   */
  const handleConfirmAction =
    async () => {
      if (
        !selectedOffer ||
        !confirmModalConfig.action
      ) {
        return;
      }

      try {
        const response =
          confirmModalConfig.action ===
          'accept'
            ? await offerApi.acceptOffer(
                selectedOffer.id,
              )
            : await offerApi.rejectOffer(
                selectedOffer.id,
              );

        const updatedOffer =
          response.data?.offer;

        if (!updatedOffer) {
          throw new Error(
            'Updated Offer was not returned by the server.',
          );
        }

        setOffers(
          (currentOffers) =>
            currentOffers.map(
              (offer) =>
                offer.id ===
                selectedOffer.id
                  ? {
                      ...offer,
                      status:
                        updatedOffer.status ||
                        offer.status,

                      lastUpdated:
                        updatedOffer.updatedAt
                          ? updatedOffer.updatedAt.split(
                              'T',
                            )[0]
                          : offer.lastUpdated,

                      counterOfferAmount:
                        updatedOffer.counterOfferAmount ??
                        offer.counterOfferAmount,

                      counterOfferDetails:
                        updatedOffer.counterOfferDetails ||
                        offer.counterOfferDetails,
                    }
                  : offer,
            ),
        );

        showToast({
          type: 'success',
          title:
            confirmModalConfig.action ===
            'accept'
              ? 'Offer Accepted'
              : 'Offer Rejected',

          description:
            confirmModalConfig.action ===
            'accept'
              ? 'The Offer was accepted successfully and a Deal was created.'
              : 'The Offer was rejected successfully.',
        });

        setConfirmModalConfig({
          isOpen: false,
          action: null,
        });

        setSelectedOffer(null);
      } catch (error: any) {
        console.error(
          'Failed to update Admin Offer:',
          error,
        );

        showToast({
          type: 'error',
          title:
            'Offer action failed',
          description:
            error?.response?.data
              ?.message ||
            'We could not update this Offer. Please try again.',
        });
      }
    };

  /*
   * Submit a Counter Offer.
   */
  const handleOfferResponse =
    async (
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
              counterOfferAmount:
                amount,

              counterOfferDetails:
                notes,
            },
          );

        const updatedOffer =
          response.data?.offer;

        if (!updatedOffer) {
          throw new Error(
            'Updated Offer was not returned by the server.',
          );
        }

        const updatedSelectedOffer:
          OwnerOffer = {
          ...selectedOffer,

          status:
            updatedOffer.status ||
            selectedOffer.status,

          counterOfferAmount:
            updatedOffer.counterOfferAmount ??
            null,

          counterOfferDetails:
            updatedOffer.counterOfferDetails ||
            '',

          lastUpdated:
            updatedOffer.updatedAt
              ? updatedOffer.updatedAt.split(
                  'T',
                )[0]
              : selectedOffer.lastUpdated,
        };

        setOffers(
          (currentOffers) =>
            currentOffers.map(
              (offer) =>
                offer.id ===
                selectedOffer.id
                  ? updatedSelectedOffer
                  : offer,
            ),
        );

        setSelectedOffer(
          updatedSelectedOffer,
        );

        showToast({
          type: 'success',
          title:
            'Counter Offer Sent',
          description:
            'Your counter offer has been submitted to the Buyer.',
        });

        setIsCounterModalOpen(
          false,
        );
      } catch (error: any) {
        console.error(
          'Failed to submit Admin Counter Offer:',
          error,
        );

        showToast({
          type: 'error',
          title:
            'Counter offer failed',
          description:
            error?.response?.data
              ?.message ||
            'We could not submit your counter offer.',
        });
      }
    };

  return (
    <div className="relative space-y-8 overflow-hidden pb-12">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-cream">
          Offers
        </h2>

        <p className="text-sm text-ink/60">
          Manage Offers submitted for
          Properties created by your
          Admin account.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-2">
        {[
          {
            label: 'Total Offers',
            value: stats.total,
            color:
              'text-cream',
          },
          {
            label: 'Pending',
            value:
              stats.pending,
            color:
              'text-blue-400',
          },
          {
            label:
              'Counter Offers',
            value:
              stats.countered,
            color:
              'text-yellow-400',
          },
          {
            label: 'Accepted',
            value:
              stats.accepted,
            color:
              'text-emerald-400',
          },
          {
            label: 'Rejected',
            value:
              stats.rejected,
            color:
              'text-rose-400',
          },
        ].map(
          (
            stat,
            index,
          ) => (
            <div
              key={index}
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
          ),
        )}
      </div>

      {/* Filters */}
      <DataTableToolbar
        searchValue={searchProperty}
        onSearchChange={
          setSearchProperty
        }
        searchPlaceholder="Search property..."
        actions={
          <>
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

              <input
                type="text"
                placeholder="Search buyer..."
                value={searchBuyer}
                onChange={(event) =>
                  setSearchBuyer(
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2 pl-10 pr-4 text-sm text-cream focus:border-gold-400 focus:outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value,
                )
              }
              className="rounded-xl border border-white/10 bg-navy-900/50 px-4 py-2 text-sm text-cream focus:outline-none"
            >
              <option value="All">
                All
              </option>
              <option value="Submitted">
                Submitted
              </option>
              <option value="Under Review">
                Under Review
              </option>
              <option value="Counter Offer Received">
                Counter Offer Received
              </option>
              <option value="Accepted">
                Accepted
              </option>
              <option value="Rejected">
                Rejected
              </option>
              <option value="Withdrawn">
                Withdrawn
              </option>
              <option value="Expired">
                Expired
              </option>
            </select>

            <select
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(
                  event.target.value,
                )
              }
              className="rounded-xl border border-white/10 bg-navy-900/50 px-4 py-2 text-sm text-cream focus:outline-none"
            >
              <option value="Newest">
                Newest
              </option>
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
        {/* Main Offers */}
        <div className="lg:col-span-3">
          {isLoadingOffers ? (
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-8 text-center">
              <p className="text-sm text-ink/60">
                Loading offers...
              </p>
            </div>
          ) : filteredOffers.length ===
            0 ? (
            <EmptyState
              icon={
                <FileCheck className="h-8 w-8 text-gold-400" />
              }
              title="No offers available."
              description="There are currently no offers for Properties created by your Admin account."
              actionLabel="View Listings"
              onAction={() =>
                navigate(
                  '/admin-dashboard?tab=Listings',
                )
              }
            />
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden w-full md:block">
                <DataTable
                  data={
                    filteredOffers
                  }
                  keyExtractor={(
                    offer,
                  ) =>
                    offer.id
                  }
                  columns={[
                    {
                      header: 'Buyer',
                      render: (
                        offer,
                      ) => (
                        <div className="flex items-center gap-3">
                          {offer.buyer
                            .avatar ? (
                            <img
                              src={
                                offer
                                  .buyer
                                  .avatar
                              }
                              alt={
                                offer
                                  .buyer
                                  .name
                              }
                              className="h-8 w-8 shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-ink/50">
                              <User className="h-4 w-4" />
                            </div>
                          )}

                          <span className="whitespace-nowrap font-semibold text-cream">
                            {
                              offer
                                .buyer
                                .name
                            }
                          </span>
                        </div>
                      ),
                    },

                    {
                      header: 'Property',
                      render: (
                        offer,
                      ) => (
                        <span className="block max-w-[200px] truncate text-ink/70">
                          {
                            offer
                              .property
                              .name
                          }
                        </span>
                      ),
                    },

                    {
                      header: (
                        <div className="text-right">
                          Offer Amount
                        </div>
                      ),

                      className:
                        'text-right',

                      render: (
                        offer,
                      ) => {
                        const diff =
                          offer.amount -
                          offer
                            .property
                            .askingPrice;

                        return (
                          <>
                            <div className="font-bold text-gold-400">
                              {formatMoney(
                                offer.amount,
                              )}
                            </div>

                            <div
                              className={`text-[10px] ${
                                diff >= 0
                                  ? 'text-emerald-400'
                                  : 'text-rose-400'
                              }`}
                            >
                              {diff >= 0
                                ? '+'
                                : ''}
                              {formatMoney(
                                diff,
                              )}{' '}
                              vs Ask
                            </div>
                          </>
                        );
                      },
                    },

                    {
                      header: 'Date',
                      render: (
                        offer,
                      ) => (
                        <span className="whitespace-nowrap text-ink/60">
                          {
                            offer.date
                          }
                        </span>
                      ),
                    },

                    {
                      header: 'Status',
                      render: (
                        offer,
                      ) => (
                        <EnterpriseStatusBadge
                          status={
                            offer.status
                          }
                        />
                      ),
                    },

                    {
                      header: (
                        <div className="text-right">
                          Action
                        </div>
                      ),

                      className:
                        'text-right',

                      render: (
                        offer,
                      ) => (
                        <GhostButton
                          size="sm"
                          onClick={() =>
                            setSelectedOffer(
                              offer,
                            )
                          }
                        >
                          Review
                        </GhostButton>
                      ),
                    },
                  ]}
                />
              </div>

              {/* Mobile */}
              <div className="grid gap-4 md:hidden">
                {filteredOffers.map(
                  (offer) => {
                    const diff =
                      offer.amount -
                      offer
                        .property
                        .askingPrice;

                    return (
                      <div
                        key={
                          offer.id
                        }
                        className="rounded-2xl border border-white/10 bg-navy-800/50 p-4"
                      >
                        <div className="mb-4 flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {offer
                              .buyer
                              .avatar ? (
                              <img
                                src={
                                  offer
                                    .buyer
                                    .avatar
                                }
                                alt={
                                  offer
                                    .buyer
                                    .name
                                }
                                className="h-8 w-8 shrink-0 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-ink/50">
                                <User className="h-4 w-4" />
                              </div>
                            )}

                            <div>
                              <div className="font-semibold text-cream">
                                {
                                  offer
                                    .buyer
                                    .name
                                }
                              </div>

                              <div className="text-[10px] text-ink/50">
                                {
                                  offer.date
                                }
                              </div>
                            </div>
                          </div>

                          <EnterpriseStatusBadge
                            status={
                              offer.status
                            }
                          />
                        </div>

                        <div className="mb-4">
                          <div className="mb-1 text-xs text-ink/50">
                            Property
                          </div>

                          <div className="text-sm font-medium text-cream">
                            {
                              offer
                                .property
                                .name
                            }
                          </div>
                        </div>

                        <div className="flex items-end justify-between border-t border-white/5 pt-4">
                          <div>
                            <div className="mb-1 text-xs text-ink/50">
                              Offer Amount
                            </div>

                            <div className="text-lg font-bold text-gold-400">
                              {formatMoney(
                                offer.amount,
                              )}
                            </div>

                            <div
                              className={`text-[10px] ${
                                diff >= 0
                                  ? 'text-emerald-400'
                                  : 'text-rose-400'
                              }`}
                            >
                              {diff >= 0
                                ? '+'
                                : ''}
                              {formatMoney(
                                diff,
                              )}{' '}
                              vs Asking
                            </div>
                          </div>

                          <GhostButton
                            size="sm"
                            onClick={() =>
                              setSelectedOffer(
                                offer,
                              )
                            }
                          >
                            Review
                          </GhostButton>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </>
          )}
        </div>

        {/* Quick Insights */}
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
                  {formatMoney(
                    highestOffer,
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                <div className="mb-1 text-[10px] font-semibold uppercase text-ink/50">
                  Lowest Offer
                </div>

                <div className="text-lg font-bold text-rose-400">
                  {formatMoney(
                    lowestOffer,
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/5 bg-navy-900/50 p-3">
                  <div className="mb-1 text-[10px] font-semibold uppercase text-ink/50">
                    Avg Offer
                  </div>

                  <div className="font-bold text-cream">
                    {formatMoney(
                      averageOffer,
                    )}
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

      {/* Offer Detail Drawer */}
      <EnterpriseDetailDrawer
        isOpen={
          !!selectedOffer
        }
        onClose={() =>
          setSelectedOffer(null)
        }
        title="Offer Details"
        footerActions={
          selectedOffer &&
          [
            'Pending',
            'Submitted',
            'Under Review',
            'Countered',
            'Counter Offer Received',
          ].includes(
            selectedOffer.status,
          ) ? (
            <>
              <GoldButton
                className="flex-1 justify-center"
                onClick={() =>
                  setConfirmModalConfig(
                    {
                      isOpen: true,
                      action:
                        'accept',
                    },
                  )
                }
              >
                <Handshake className="mr-2 h-4 w-4" />
                Accept
              </GoldButton>

              <GhostButton
                className="flex-1 justify-center border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                onClick={() =>
                  setIsCounterModalOpen(
                    true,
                  )
                }
              >
                Counter Offer
              </GhostButton>

              <GhostButton
                className="flex-1 justify-center border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                onClick={() =>
                  setConfirmModalConfig(
                    {
                      isOpen: true,
                      action:
                        'reject',
                    },
                  )
                }
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </GhostButton>
            </>
          ) : (
            <GhostButton
              className="flex-1 justify-center"
              onClick={() =>
                setSelectedOffer(
                  null,
                )
              }
            >
              Close
            </GhostButton>
          )
        }
      >
        {selectedOffer && (
          <div className="space-y-8">
            {/* Buyer */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/5 bg-navy-900 p-4">
              <div className="flex items-center gap-3">
                {selectedOffer
                  .buyer
                  .avatar ? (
                  <img
                    src={
                      selectedOffer
                        .buyer
                        .avatar
                    }
                    alt={
                      selectedOffer
                        .buyer
                        .name
                    }
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-800 text-ink/50">
                    <User className="h-6 w-6" />
                  </div>
                )}

                <div>
                  <div className="text-lg font-semibold text-cream">
                    {
                      selectedOffer
                        .buyer
                        .name
                    }
                  </div>

                  <div className="text-xs text-ink/60">
                    {
                      selectedOffer
                        .buyer
                        .email
                    }
                  </div>
                </div>
              </div>

              <EnterpriseStatusBadge
                status={
                  selectedOffer.status
                }
              />
            </div>

            {/* Property */}
            <div className="flex gap-4">
              {selectedOffer
                .property
                .image ? (
                <img
                  src={
                    selectedOffer
                      .property
                      .image
                  }
                  alt={
                    selectedOffer
                      .property
                      .name
                  }
                  className="h-20 w-28 shrink-0 rounded-xl border border-white/10 object-cover"
                />
              ) : (
                <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-navy-900 text-ink/40">
                  <FileCheck className="h-6 w-6" />
                </div>
              )}

              <div className="min-w-0">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink/50">
                  Target Property
                </div>

                <h4 className="mb-1 truncate text-lg font-semibold text-cream">
                  {
                    selectedOffer
                      .property
                      .name
                  }
                </h4>

                <div className="mb-2 truncate text-sm text-ink/60">
                  Asking:{' '}
                  {formatMoney(
                    selectedOffer
                      .property
                      .askingPrice,
                  )}
                </div>
              </div>
            </div>

            {/* Offer financials */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/5 bg-navy-900 p-4">
                <div className="mb-1 text-[10px] font-semibold uppercase text-ink/50">
                  Offer Amount
                </div>

                <div className="mb-1 text-2xl font-bold text-gold-400">
                  {formatMoney(
                    selectedOffer.amount,
                  )}
                </div>

                <div
                  className={`text-xs ${
                    selectedOffer.amount -
                      selectedOffer
                        .property
                        .askingPrice >=
                    0
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                  }`}
                >
                  {formatMoney(
                    selectedOffer.amount -
                      selectedOffer
                        .property
                        .askingPrice,
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
                  Not provided
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-navy-900 p-4">
                <div className="mb-1 text-[10px] font-semibold uppercase text-ink/50">
                  Financing Method
                </div>

                <div className="text-sm font-semibold text-cream">
                  {
                    selectedOffer.financing
                  }
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-navy-900 p-4">
                <div className="mb-1 text-[10px] font-semibold uppercase text-ink/50">
                  Mortgage Status
                </div>

                <div className="text-sm font-semibold text-yellow-400">
                  {
                    selectedOffer
                      .mortgageStatus
                  }
                </div>
              </div>
            </div>

            {/* Buyer message */}
            {selectedOffer.message && (
              <div>
                <h4 className="mb-3 font-semibold text-cream">
                  Message from Buyer
                </h4>

                <div className="rounded-xl border border-white/5 border-l-2 border-l-gold-400 bg-navy-900/50 p-4 text-sm italic leading-relaxed text-ink/80">
                  "
                  {
                    selectedOffer.message
                  }
                  "
                </div>
              </div>
            )}

            {/* Counter Offer */}
            {selectedOffer
              .counterOfferAmount ? (
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

                  {selectedOffer
                    .counterOfferDetails && (
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
                  (
                    event,
                    index,
                  ) => (
                    <div
                      key={index}
                      className="relative pl-6"
                    >
                      <div
                        className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-navy-950 ${
                          event.type ===
                          'success'
                            ? 'border-emerald-500 bg-emerald-500/20'
                            : event.type ===
                                'warning'
                              ? 'border-yellow-400 bg-yellow-400/20'
                              : 'border-blue-400 bg-blue-400/20'
                        }`}
                      />

                      <div className="text-sm font-semibold text-cream">
                        {
                          event.title
                        }
                      </div>

                      <div className="mt-1 text-xs text-ink/50">
                        {
                          event.date
                        }
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      {/* Accept / Reject confirmation */}
      <ConfirmationModal
        isOpen={
          confirmModalConfig.isOpen
        }
        onClose={() =>
          setConfirmModalConfig(
            {
              isOpen: false,
              action: null,
            },
          )
        }
        onConfirm={
          handleConfirmAction
        }
        title={
          confirmModalConfig.action ===
          'accept'
            ? 'Accept Offer'
            : 'Reject Offer'
        }
        description={
          confirmModalConfig.action ===
          'accept'
            ? 'Are you sure you want to accept this Offer? A Deal will be created immediately.'
            : 'Are you sure you want to reject this Offer? This action cannot be undone.'
        }
        confirmText={
          confirmModalConfig.action ===
          'accept'
            ? 'Accept Offer'
            : 'Reject Offer'
        }
        isDestructive={
          confirmModalConfig.action ===
          'reject'
        }
      />

      {/* Counter Offer */}
      <OfferResponseModal
        isOpen={
          isCounterModalOpen
        }
        onClose={() =>
          setIsCounterModalOpen(
            false,
          )
        }
        onSubmit={
          handleOfferResponse
        }
        offer={selectedOffer}
      />
    </div>
  );
}