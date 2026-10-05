import { useEffect, useMemo, useState } from 'react';
import {
  FileCheck,
  Handshake,
  MessageSquare,
  Search,
  User,
  XCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { GhostButton, GoldButton } from '../../../components/ui/ui';
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

  const [offers, setOffers] = useState<OwnerOffer[]>([]);
  const [selectedOffer, setSelectedOffer] =
    useState<OwnerOffer | null>(null);

  const [isLoadingOffers, setIsLoadingOffers] =
    useState(true);

  const [searchProperty, setSearchProperty] =
    useState('');

  const [searchBuyer, setSearchBuyer] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('All');

  const [sortOrder, setSortOrder] =
    useState('Newest');

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

  const [isSubmittingAction, setIsSubmittingAction] =
    useState(false);

  const formatMoney = (amount: number) =>
    `₦${amount.toLocaleString('en-NG')}`;

  useEffect(() => {
    const loadAgentOffers = async () => {
      try {
        setIsLoadingOffers(true);

        const response =
          await offerApi.getAgentOffers();

        const backendOffers =
          response.data?.data?.offers ??
          response.data?.offers ??
          [];

        const mappedOffers: OwnerOffer[] =
          backendOffers.map((offer: any) => ({
            id: offer._id,

            buyer: {
              name:
                offer.buyer?.fullName ||
                'Unknown Buyer',
              avatar:
                offer.buyer?.avatar || '',
              email:
                offer.buyer?.email || '',
              phone:
                offer.buyer?.phone || '',
            },

            property: {
              id:
                offer.property?._id || '',
              name:
                offer.property?.title ||
                'Property',
              image:
                offer.property?.coverImage ||
                offer.property?.images?.[0] ||
                '',
              askingPrice:
                offer.property?.price || 0,
            },

            amount:
              offer.offerAmount || 0,

            date:
              offer.createdAt
                ? offer.createdAt.split('T')[0]
                : '',

            status:
              offer.status || 'Submitted',

            lastUpdated:
              offer.updatedAt
                ? offer.updatedAt.split('T')[0]
                : '',

            deposit: 0,
            financing: 'Not provided',
            mortgageStatus: 'Not provided',

            message:
              offer.buyerNotes || '',

            counterOfferAmount:
              offer.counterOfferAmount ?? null,

            counterOfferDetails:
              offer.counterOfferDetails || '',

            timeline: [
              {
                title:
                  offer.status === 'Accepted'
                    ? 'Offer accepted'
                    : offer.status === 'Rejected'
                      ? 'Offer rejected'
                      : 'Offer submitted',

                date:
                  offer.updatedAt
                    ? offer.updatedAt.split('T')[0]
                    : offer.createdAt
                      ? offer.createdAt.split('T')[0]
                      : '',

                type:
                  offer.status === 'Rejected'
                    ? 'warning'
                    : offer.status === 'Accepted'
                      ? 'success'
                      : 'info',
              },
            ],
          }));

        setOffers(mappedOffers);
      } catch (error) {
        console.error(
          'Failed to load Agent Offers:',
          error,
        );

        showToast({
          type: 'error',
          title: 'Offers could not be loaded',
          description:
            'We could not retrieve offers assigned to you.',
        });
      } finally {
        setIsLoadingOffers(false);
      }
    };

    loadAgentOffers();
  }, [showToast]);

  const filteredOffers = useMemo(() => {
    return [...offers]
      .filter((offer) => {
        const propertyMatch =
          offer.property.name
            .toLowerCase()
            .includes(
              searchProperty.toLowerCase(),
            );

        const buyerMatch =
          offer.buyer.name
            .toLowerCase()
            .includes(
              searchBuyer.toLowerCase(),
            );

        const statusMatch =
          statusFilter === 'All' ||
          offer.status === statusFilter;

        return (
          propertyMatch &&
          buyerMatch &&
          statusMatch
        );
      })
      .sort((a, b) => {
        if (sortOrder === 'Highest Offer') {
          return b.amount - a.amount;
        }

        if (sortOrder === 'Lowest Offer') {
          return a.amount - b.amount;
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

        return (
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
        );
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
      (offer) =>
        offer.status === 'Submitted' ||
        offer.status === 'Under Review' ||
        offer.status ===
          'Counter Offer Received',
    ).length,

    accepted: offers.filter(
      (offer) =>
        offer.status === 'Accepted',
    ).length,

    rejected: offers.filter(
      (offer) =>
        offer.status === 'Rejected',
    ).length,

    countered: offers.filter(
      (offer) =>
        offer.status ===
        'Counter Offer Received',
    ).length,
  };

  const canRespondToOffer =
    selectedOffer &&
    [
      'Submitted',
      'Under Review',
      'Counter Offer Received',
    ].includes(selectedOffer.status);

  const handleConfirmAction =
    async () => {
      if (
        !selectedOffer ||
        !confirmModalConfig.action
      ) {
        return;
      }

      try {
        setIsSubmittingAction(true);

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

        setOffers((current) =>
          current.map((offer) =>
            offer.id ===
            selectedOffer.id
              ? {
                  ...offer,
                  status:
                    updatedOffer.status,
                  lastUpdated:
                    updatedOffer.updatedAt
                      ? updatedOffer.updatedAt.split(
                          'T',
                        )[0]
                      : offer.lastUpdated,
                }
              : offer,
          ),
        );

        setSelectedOffer(
          (current) =>
            current
              ? {
                  ...current,
                  status:
                    updatedOffer.status,
                  lastUpdated:
                    updatedOffer.updatedAt
                      ? updatedOffer.updatedAt.split(
                          'T',
                        )[0]
                      : current.lastUpdated,
                }
              : null,
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
              ? 'The offer was accepted and the Deal workflow has started.'
              : 'The offer was rejected successfully.',
        });

        setConfirmModalConfig({
          isOpen: false,
          action: null,
        });
      } catch (error) {
        console.error(
          'Failed to update Agent Offer:',
          error,
        );

        showToast({
          type: 'error',
          title: 'Offer action failed',
          description:
            'We could not update this offer. Please try again.',
        });
      } finally {
        setIsSubmittingAction(false);
      }
    };

  const handleCounterOffer = async (
    amount: number,
    notes: string,
  ) => {
    if (!selectedOffer) {
      return;
    }

    try {
      setIsSubmittingAction(true);

      const response =
        await offerApi.counterOffer(
          selectedOffer.id,
          {
            counterOfferAmount: amount,
            counterOfferDetails: notes,
          },
        );

      const updatedOffer =
        response.data?.offer;

      if (!updatedOffer) {
        throw new Error(
          'Updated Offer was not returned by the server.',
        );
      }

      const updatedLocalOffer: OwnerOffer =
        {
          ...selectedOffer,
          status:
            updatedOffer.status,
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

      setOffers((current) =>
        current.map((offer) =>
          offer.id === selectedOffer.id
            ? updatedLocalOffer
            : offer,
        ),
      );

      setSelectedOffer(
        updatedLocalOffer,
      );

      setIsCounterModalOpen(false);

      showToast({
        type: 'success',
        title: 'Counter Offer Sent',
        description:
          'Your counter offer has been sent to the buyer.',
      });
    } catch (error) {
      console.error(
        'Failed to submit Agent Counter Offer:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Counter offer failed',
        description:
          'We could not submit the counter offer.',
      });
    } finally {
      setIsSubmittingAction(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="font-heading text-2xl font-bold text-cream">
          Offers
        </h2>

        <p className="mt-1 text-sm text-ink/60">
          Review and respond to offers submitted for
          properties you manage.
        </p>
      </div>

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
        ].map((stat) => (
          <div
            key={stat.label}
            className="min-w-[150px] rounded-xl border border-white/10 bg-navy-800/50 p-4"
          >
            <div
              className={`text-2xl font-bold ${stat.color}`}
            >
              {stat.value}
            </div>

            <div className="mt-1 text-[10px] font-semibold uppercase text-ink/50">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

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

      {isLoadingOffers ? (
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-10 text-center text-sm text-ink/60">
          Loading offers...
        </div>
      ) : filteredOffers.length === 0 ? (
        <EmptyState
          icon={
            <FileCheck className="h-8 w-8 text-gold-400" />
          }
          title="No offers available"
          description="There are currently no offers matching your filters."
          actionLabel="View My Listings"
          onAction={() =>
            navigate(
              '/agent-dashboard?tab=My+Listings',
            )
          }
        />
      ) : (
        <>
          <div className="hidden md:block">
            <DataTable
              data={filteredOffers}
              keyExtractor={(offer) =>
                offer.id
              }
              columns={[
                {
                  header: 'Buyer',
                  render: (offer) => (
                    <div className="flex items-center gap-3">
                      {offer.buyer.avatar ? (
                        <img
                          src={offer.buyer.avatar}
                          alt={offer.buyer.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-ink/50">
                          <User className="h-4 w-4" />
                        </div>
                      )}

                      <span className="font-semibold text-cream">
                        {offer.buyer.name}
                      </span>
                    </div>
                  ),
                },
                {
                  header: 'Property',
                  render: (offer) => (
                    <span className="block max-w-[240px] truncate text-ink/70">
                      {offer.property.name}
                    </span>
                  ),
                },
                {
                  header: 'Offer Amount',
                  className: 'text-right',
                  render: (offer) => (
                    <div className="text-right">
                      <div className="font-bold text-gold-400">
                        {formatMoney(
                          offer.amount,
                        )}
                      </div>

                      {offer.counterOfferAmount ? (
                        <div className="text-[10px] text-yellow-400">
                          Counter:{' '}
                          {formatMoney(
                            offer.counterOfferAmount,
                          )}
                        </div>
                      ) : null}
                    </div>
                  ),
                },
                {
                  header: 'Date',
                  render: (offer) => (
                    <span className="text-ink/60">
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
                  header: 'Action',
                  className: 'text-right',
                  render: (offer) => (
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

          <div className="grid gap-4 md:hidden">
            {filteredOffers.map(
              (offer) => (
                <div
                  key={offer.id}
                  className="rounded-2xl border border-white/10 bg-navy-800/50 p-4"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-cream">
                        {offer.buyer.name}
                      </div>
                      <div className="text-xs text-ink/50">
                        {offer.date}
                      </div>
                    </div>

                    <EnterpriseStatusBadge
                      status={
                        offer.status
                      }
                    />
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-ink/50">
                      Property
                    </div>

                    <div className="mt-1 text-sm font-medium text-cream">
                      {offer.property.name}
                    </div>
                  </div>

                  <div className="flex items-end justify-between border-t border-white/5 pt-4">
                    <div>
                      <div className="text-xs text-ink/50">
                        Offer
                      </div>

                      <div className="text-lg font-bold text-gold-400">
                        {formatMoney(
                          offer.amount,
                        )}
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
              ),
            )}
          </div>
        </>
      )}

      <EnterpriseDetailDrawer
        isOpen={!!selectedOffer}
        onClose={() =>
          setSelectedOffer(null)
        }
        title="Offer Details"
        footerActions={
          selectedOffer ? (
            <>
              {canRespondToOffer ? (
                <>
                  <GoldButton
                    className="flex-1 justify-center"
                    disabled={
                      isSubmittingAction
                    }
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
                    disabled={
                      isSubmittingAction
                    }
                    onClick={() =>
                      setIsCounterModalOpen(
                        true,
                      )
                    }
                  >
                    Counter Offer
                  </GhostButton>

                  <GhostButton
                    className="flex-1 justify-center"
                    onClick={() =>
                      navigate(
                        '/agent-dashboard?tab=Messages',
                      )
                    }
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message Buyer
                  </GhostButton>

                  <GhostButton
                    className="flex-1 justify-center text-rose-400 hover:text-rose-300"
                    disabled={
                      isSubmittingAction
                    }
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
                <GhostButton
                  className="flex-1 justify-center"
                  onClick={() =>
                    navigate(
                      '/agent-dashboard?tab=Messages',
                    )
                  }
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message Buyer
                </GhostButton>
              )}
            </>
          ) : null
        }
      >
        {selectedOffer ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-navy-900 p-4">
              <div>
                <div className="text-lg font-semibold text-cream">
                  {selectedOffer.buyer.name}
                </div>

                <div className="text-xs text-ink/60">
                  {selectedOffer.buyer.email}
                </div>

                {selectedOffer.buyer.phone ? (
                  <div className="mt-1 text-xs text-ink/50">
                    {selectedOffer.buyer.phone}
                  </div>
                ) : null}
              </div>

              <EnterpriseStatusBadge
                status={
                  selectedOffer.status
                }
              />
            </div>

            <div className="flex gap-4">
              {selectedOffer.property.image ? (
                <img
                  src={
                    selectedOffer.property
                      .image
                  }
                  alt={
                    selectedOffer.property
                      .name
                  }
                  className="h-20 w-28 rounded-xl border border-white/10 object-cover"
                />
              ) : null}

              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                  Property
                </div>

                <div className="mt-1 text-lg font-semibold text-cream">
                  {
                    selectedOffer
                      .property.name
                  }
                </div>

                <div className="mt-1 text-sm text-ink/60">
                  Asking price:{' '}
                  {formatMoney(
                    selectedOffer
                      .property
                      .askingPrice,
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/5 bg-navy-900 p-4">
                <div className="text-[10px] font-semibold uppercase text-ink/50">
                  Offer Amount
                </div>

                <div className="mt-1 text-2xl font-bold text-gold-400">
                  {formatMoney(
                    selectedOffer.amount,
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-navy-900 p-4">
                <div className="text-[10px] font-semibold uppercase text-ink/50">
                  Difference vs Asking
                </div>

                <div
                  className={`mt-1 text-lg font-bold ${
                    selectedOffer.amount >=
                    selectedOffer
                      .property
                      .askingPrice
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                  }`}
                >
                  {formatMoney(
                    selectedOffer.amount -
                      selectedOffer
                        .property
                        .askingPrice,
                  )}
                </div>
              </div>
            </div>

            {selectedOffer.message ? (
              <div>
                <div className="mb-2 font-semibold text-cream">
                  Buyer Message
                </div>

                <div className="rounded-xl border border-white/5 border-l-2 border-l-gold-400 bg-navy-900/50 p-4 text-sm leading-relaxed text-ink/80">
                  "{selectedOffer.message}"
                </div>
              </div>
            ) : null}

            {selectedOffer.counterOfferAmount ? (
              <div>
                <div className="mb-2 font-semibold text-cream">
                  Counter Offer
                </div>

                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                  <div className="text-xl font-bold text-yellow-400">
                    {formatMoney(
                      selectedOffer.counterOfferAmount,
                    )}
                  </div>

                  {selectedOffer.counterOfferDetails ? (
                    <div className="mt-2 text-sm text-ink/70">
                      {
                        selectedOffer.counterOfferDetails
                      }
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </EnterpriseDetailDrawer>

      <ConfirmationModal
        isOpen={
          confirmModalConfig.isOpen
        }
        onClose={() =>
          setConfirmModalConfig({
            isOpen: false,
            action: null,
          })
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
            ? 'Are you sure you want to accept this offer? A Deal will be created and the property will move to Under Offer.'
            : 'Are you sure you want to reject this offer? This action cannot be undone.'
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
          handleCounterOffer
        }
        offer={
          selectedOffer
        }
      />
    </div>
  );
}