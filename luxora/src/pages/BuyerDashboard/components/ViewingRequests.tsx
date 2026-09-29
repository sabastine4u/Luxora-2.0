import {
  useState,
  useMemo,
  useEffect,
} from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Home,
  Phone,
} from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { useToast } from '../../../contexts/ToastContext';
import { bookingApi } from '../../../api/booking.api';
import { conversationApi } from '../../../api/conversation.api';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { RescheduleViewingModal } from './modals/RescheduleViewingModal';
import type { ViewingRequest } from '../../../types';

interface BackendBooking {
  _id: string;
  viewingDate: string;
  viewingTime: string;
  message: string;
  status: string;

  property: {
    _id: string;
    title: string;
    propertyType?: string;
    transactionType?: string;
    city?: string;
    state?: string;
    area?: string;
    address?: string;
    coverImage?: string | null;
    images?: string[];

    agent?: {
      user?: {
        _id: string;
        fullName?: string;
        avatar?: string | null;
        role?: string;
      };
      status?: string;
    };
  };
}

/*
 * Preserve the real MongoDB property ID while
 * keeping the existing shared Buyer ViewingRequest shape.
 */
type BuyerViewingRequest =
  ViewingRequest & {
    propertyId: string;
    agentUserId: string;
  };

export default function ViewingRequests() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [viewings, setViewings] = useState<
    BuyerViewingRequest[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [searchQuery, setSearchQuery] =
    useState('');

  const [filterStatus, setFilterStatus] =
    useState('All');

  const [filterType, setFilterType] =
    useState('All');

  const [filterDate, setFilterDate] =
    useState('All');

  const [sortBy, setSortBy] =
    useState('upcoming');

  const [selectedViewing, setSelectedViewing] =
    useState<BuyerViewingRequest | null>(
      null,
    );

  const [isDrawerOpen, setIsDrawerOpen] =
    useState(false);

  const [isRescheduleOpen, setIsRescheduleOpen] =
    useState(false);

  const [isCancelOpen, setIsCancelOpen] =
    useState(false);

  /*
   * Load the authenticated Buyer's real
   * viewing requests from the Booking API.
   */
  useEffect(() => {
    const loadViewingRequests = async () => {
      try {
        setIsLoading(true);

        const response =
          await bookingApi.getMyBookings();

        console.log(
          'MY BOOKINGS RESPONSE:',
          response,
        );

        const bookings: BackendBooking[] =
          (response as any)?.data?.bookings ??
          [];

        const mappedViewings: BuyerViewingRequest[] =
          bookings.map((booking) => ({
            /*
             * Real Booking ID.
             */
            id: booking._id,

            /*
             * Real property MongoDB ID.
             *
             * This is what powers the exact
             * View Property navigation.
             */
            propertyId:
              booking.property?._id || '',

            propertyTitle:
              booking.property?.title ||
              'Property',

            propertyType:
              booking.property?.propertyType ||
              'Unknown',

            location:
              [
                booking.property?.area,
                booking.property?.city,
                booking.property?.state,
              ]
                .filter(Boolean)
                .join(', ') ||
              booking.property?.address ||
              'Location unavailable',

            agent:
              booking.property?.agent?.user?.fullName ||
              'Assigned Agent',

            agentUserId:
              booking.property?.agent?.user?._id ||
              '',

            date:
              booking.viewingDate?.split(
                'T',
              )[0] || '',

            time:
              booking.viewingTime ||
              'Time unavailable',

            status:
              booking.status as ViewingRequest['status'],

            image:
              booking.property?.coverImage ||
              booking.property?.images?.[0] ||
              '',

            meetingPoint:
              booking.property?.address ||
              'Property address',

            instructions:
              'Please arrive at the scheduled viewing time.',

            agentNotes:
              '',

            specialRequests:
              booking.message || '',

            summary:
              booking.property?.title ||
              'Property viewing request',
          }));

        setViewings(mappedViewings);
      } catch (error) {
        console.error(
          'Failed to load viewing requests:',
          error,
        );

        setViewings([]);

        showToast({
          type: 'error',
          title:
            'Unable to load viewing requests',
          description:
            'We could not retrieve your viewing requests.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadViewingRequests();
  }, [showToast]);

  /*
   * Filter and sort the real Booking records.
   */
  const filteredAndSortedViewings =
    useMemo(() => {
      let result = [...viewings];

      if (searchQuery) {
        const q =
          searchQuery.toLowerCase();

        result =
          result.filter(
            (viewing) =>
              viewing.propertyTitle
                .toLowerCase()
                .includes(q) ||
              viewing.agent
                .toLowerCase()
                .includes(q) ||
              viewing.location
                .toLowerCase()
                .includes(q),
          );
      }

      if (
        filterStatus !== 'All'
      ) {
        result =
          result.filter(
            (viewing) =>
              viewing.status ===
              filterStatus,
          );
      }

      if (
        filterType !== 'All'
      ) {
        result =
          result.filter(
            (viewing) =>
              viewing.propertyType ===
              filterType,
          );
      }

      if (
        filterDate !== 'All'
      ) {
        const today =
          new Date()
            .toISOString()
            .split('T')[0];

        if (
          filterDate === 'Past'
        ) {
          result =
            result.filter(
              (viewing) =>
                viewing.date < today,
            );
        } else if (
          filterDate === 'Upcoming'
        ) {
          result =
            result.filter(
              (viewing) =>
                viewing.date >= today,
            );
        }
      }

      result.sort((a, b) => {
        if (
          sortBy === 'newest'
        ) {
          return b.date.localeCompare(
            a.date,
          );
        }

        if (
          sortBy === 'oldest'
        ) {
          return a.date.localeCompare(
            b.date,
          );
        }

        if (
          sortBy === 'upcoming'
        ) {
          const today =
            new Date()
              .toISOString()
              .split('T')[0];

          const aUp =
            a.date >= today;

          const bUp =
            b.date >= today;

          if (
            aUp &&
            !bUp
          ) {
            return -1;
          }

          if (
            !aUp &&
            bUp
          ) {
            return 1;
          }

          return a.date.localeCompare(
            b.date,
          );
        }

        if (
          sortBy === 'completed'
        ) {
          if (
            a.status ===
            'Completed' &&
            b.status !==
            'Completed'
          ) {
            return -1;
          }

          if (
            a.status !==
            'Completed' &&
            b.status ===
            'Completed'
          ) {
            return 1;
          }

          return 0;
        }

        return 0;
      });

      return result;
    }, [
      viewings,
      searchQuery,
      filterStatus,
      filterType,
      filterDate,
      sortBy,
    ]);

  const uniqueStatuses = [
    'All',
    'Pending',
    'Confirmed',
    'Rescheduled',
    'Completed',
    'Cancelled',
  ];

  const uniqueTypes = [
    'All',
    ...new Set(
      viewings.map(
        (viewing) =>
          viewing.propertyType,
      ),
    ),
  ];

  const uniqueDates = [
    'All',
    'Upcoming',
    'Past',
  ];

  /*
   * Buyer reschedule action.
   */
  const handleRescheduleSubmit = async (
    date: string,
    time: string,
    notes: string,
  ) => {
    if (!selectedViewing) {
      return;
    }

    try {
      /*
       * Use the real Booking API.
       */
      await bookingApi.rescheduleBooking(
        selectedViewing.id,
        {
          viewingDate: date,
          viewingTime: time,
          message: notes.trim(),
        },
      );

      /*
       * Update the local table immediately.
       */
      setViewings((current) =>
        current.map((viewing) =>
          viewing.id ===
            selectedViewing.id
            ? {
              ...viewing,
              date,
              time,
              status:
                'Rescheduled',
              specialRequests:
                notes ||
                viewing.specialRequests,
            }
            : viewing,
        ),
      );

      setSelectedViewing(
        (current) =>
          current
            ? {
              ...current,
              date,
              time,
              status:
                'Rescheduled',
              specialRequests:
                notes ||
                current.specialRequests,
            }
            : current,
      );

      setIsRescheduleOpen(
        false,
      );

      setIsDrawerOpen(
        false,
      );

      showToast({
        type: 'success',
        title:
          'Viewing Rescheduled',
        description:
          'Your viewing has been rescheduled successfully.',
      });
    } catch (error) {
      console.error(
        'Failed to reschedule viewing:',
        error,
      );

      showToast({
        type: 'error',
        title:
          'Reschedule Failed',
        description:
          'We could not reschedule this viewing. Please try again.',
      });
    }
  };

  /*
   * Buyer cancellation action.
   */
  const handleCancelConfirm =
    async () => {
      if (!selectedViewing) {
        return;
      }

      try {
        await bookingApi.cancelBooking(
          selectedViewing.id,
        );

        setViewings((current) =>
          current.map((viewing) =>
            viewing.id ===
              selectedViewing.id
              ? {
                ...viewing,
                status:
                  'Cancelled',
              }
              : viewing,
          ),
        );

        setSelectedViewing(
          (current) =>
            current
              ? {
                ...current,
                status:
                  'Cancelled',
              }
              : current,
        );

        setIsCancelOpen(false);
        setIsDrawerOpen(false);

        showToast({
          type: 'success',
          title:
            'Viewing Cancelled',
          description:
            'Your viewing has been cancelled.',
        });
      } catch (error) {
        console.error(
          'Failed to cancel viewing:',
          error,
        );

        showToast({
          type: 'error',
          title:
            'Cancellation Failed',
          description:
            'We could not cancel this viewing. Please try again.',
        });
      }
    };

  /*
   * Navigate to the exact public property page
   * associated with the Booking.
   */
  const handleViewProperty = () => {
    if (
      !selectedViewing?.propertyId
    ) {
      showToast({
        type: 'error',
        title:
          'Property Unavailable',
        description:
          'This viewing request is not linked to a property record.',
      });

      return;
    }

    const propertyRoute =
      ROUTES.PROPERTY_DETAILS.replace(
        ':id',
        selectedViewing.propertyId,
      );

    setIsDrawerOpen(false);

    navigate(propertyRoute);
  };

  /*
   * Contact Agent currently takes the Buyer
   * to the dashboard until the dedicated
   * communication workflow is connected.
   */
  const handleContactAgent =
    async () => {
      if (!selectedViewing) {
        return;
      }

      if (!selectedViewing.agentUserId) {
        showToast({
          type: 'error',
          title: 'Agent Unavailable',
          description:
            'There is no assigned agent available to contact for this viewing.',
        });

        return;
      }

      try {
        const conversationResponse =
          await conversationApi.createConversation({
            type: 'direct',
            targetUserId:
              selectedViewing.agentUserId,
          });

        const conversationId =
          conversationResponse?.conversation?._id ??
          conversationResponse?.conversation?.id ??
          conversationResponse?.data?.conversation?._id ??
          conversationResponse?.data?.conversation?.id;

        if (!conversationId) {
          throw new Error(
            'The server did not return a conversation.',
          );
        }

        setIsDrawerOpen(false);

        showToast({
          type: 'success',
          title: 'Conversation Ready',
          description:
            `You can now message ${selectedViewing.agent}.`,
        });

        navigate(
          `${ROUTES.BUYER_DASHBOARD}?tab=Messages`,
        );
      } catch (error) {
        console.error(
          'Failed to contact agent:',
          error,
        );

        showToast({
          type: 'error',
          title: 'Unable to Contact Agent',
          description:
            error instanceof Error
              ? error.message
              : 'We could not open a conversation with this agent.',
        });
      }
    };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-2xl font-bold text-cream">
          Viewing Requests
        </h2>

        <p className="text-sm text-ink/60">
          Manage your upcoming and past
          property tours.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md space-y-4">
        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by property, location, or agent..."
          actions={
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold pl-1">
                  Status
                </label>

                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(
                      e.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:outline-none"
                >
                  {uniqueStatuses.map(
                    (status) => (
                      <option
                        key={status}
                        value={
                          status
                        }
                      >
                        {status}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold pl-1">
                  Property Type
                </label>

                <select
                  value={filterType}
                  onChange={(e) =>
                    setFilterType(
                      e.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:outline-none"
                >
                  {uniqueTypes.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold pl-1">
                  Date
                </label>

                <select
                  value={filterDate}
                  onChange={(e) =>
                    setFilterDate(
                      e.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:outline-none"
                >
                  {uniqueDates.map(
                    (date) => (
                      <option
                        key={date}
                        value={
                          date
                        }
                      >
                        {date}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold pl-1">
                  Sort By
                </label>

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:outline-none"
                >
                  <option value="upcoming">
                    Upcoming First
                  </option>

                  <option value="newest">
                    Date (Newest First)
                  </option>

                  <option value="oldest">
                    Date (Oldest First)
                  </option>

                  <option value="completed">
                    Completed First
                  </option>
                </select>
              </div>
            </div>
          }
        />
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-12">
          <div className="flex items-center justify-center py-12 text-sm text-ink/60">
            Loading viewing requests...
          </div>
        </div>
      ) : filteredAndSortedViewings.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-12">
          <EmptyState
            icon={
              <Calendar className="h-12 w-12 text-gold-400" />
            }
            title="No viewing requests yet."
            description="When you request to view properties, they will appear here."
            actionLabel="Browse Properties"
            onAction={() =>
              navigate(
                ROUTES.PROPERTIES,
              )
            }
          />
        </div>
      ) : (
        <div className="w-full">
          <DataTable
            data={
              filteredAndSortedViewings
            }
            keyExtractor={(
              viewing,
            ) => viewing.id}
            columns={[
              {
                header: 'Property',
                render: (
                  viewing,
                ) => (
                  <div className="flex items-center gap-3">
                    {viewing.image ? (
                      <img
                        src={
                          viewing.image
                        }
                        alt={
                          viewing.propertyTitle
                        }
                        className="h-10 w-10 rounded-lg object-cover hidden sm:block"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-navy-900 border border-white/10 hidden sm:flex items-center justify-center">
                        <Home className="h-4 w-4 text-gold-400" />
                      </div>
                    )}

                    <div className="font-semibold text-cream">
                      {
                        viewing.propertyTitle
                      }
                    </div>
                  </div>
                ),
              },

              {
                header: 'Location',
                render: (
                  viewing,
                ) => (
                  <span className="text-ink/80">
                    {
                      viewing.location
                    }
                  </span>
                ),
              },

              {
                header: 'Agent',
                render: (
                  viewing,
                ) => (
                  <span className="text-ink/80">
                    {viewing.agent}
                  </span>
                ),
              },

              {
                header: 'Schedule',
                render: (
                  viewing,
                ) => (
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="flex items-center gap-1 text-cream">
                      <Calendar className="h-3 w-3 text-gold-400" />
                      {
                        viewing.date
                      }
                    </span>

                    <span className="flex items-center gap-1 text-cream">
                      <Clock className="h-3 w-3 text-gold-400" />
                      {
                        viewing.time
                      }
                    </span>
                  </div>
                ),
              },

              {
                header: 'Status',
                render: (
                  viewing,
                ) => (
                  <EnterpriseStatusBadge
                    status={
                      viewing.status
                    }
                  />
                ),
              },

              {
                header: (
                  <div className="text-right">
                    Actions
                  </div>
                ),

                className:
                  'text-right',

                render: (
                  viewing,
                ) => (
                  <button
                    onClick={() => {
                      setSelectedViewing(
                        viewing,
                      );

                      setIsDrawerOpen(
                        true,
                      );
                    }}
                    className="inline-flex h-8 items-center justify-center rounded-lg border border-white/10 px-3 text-xs font-semibold hover:bg-white/5 hover:text-gold-400 transition-colors"
                  >
                    View Details
                  </button>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* Viewing Details */}
      {selectedViewing && (
        <EnterpriseDetailDrawer
          isOpen={isDrawerOpen}
          onClose={() =>
            setIsDrawerOpen(
              false,
            )
          }
          title="Viewing Details"
          subtitle={`Property: ${selectedViewing.propertyTitle}`}
          footerActions={
            <>
              <GoldButton
                size="sm"
                onClick={
                  handleViewProperty
                }
              >
                <Home className="h-4 w-4 mr-2" />
                View Property
              </GoldButton>

              <GhostButton
                size="sm"
                onClick={
                  handleContactAgent
                }
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact Agent
              </GhostButton>

              {selectedViewing.status !==
                'Completed' &&
                selectedViewing.status !==
                'Cancelled' && (
                  <>
                    <GhostButton
                      size="sm"
                      className="text-purple-400 hover:text-purple-300 border-purple-400/30"
                      onClick={() => {
                        setIsDrawerOpen(
                          false,
                        );

                        setIsRescheduleOpen(
                          true,
                        );
                      }}
                    >
                      Reschedule
                    </GhostButton>

                    <GhostButton
                      size="sm"
                      className="text-rose-400 hover:text-rose-300 border-rose-400/30"
                      onClick={() =>
                        setIsCancelOpen(
                          true,
                        )
                      }
                    >
                      Cancel
                    </GhostButton>
                  </>
                )}
            </>
          }
        >
          <div className="space-y-6">
            {/* Property Image */}
            <div className="rounded-xl overflow-hidden bg-navy-900 border border-white/5">
              {selectedViewing.image ? (
                <img
                  src={
                    selectedViewing.image
                  }
                  alt={
                    selectedViewing.propertyTitle
                  }
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center">
                  <Home className="h-12 w-12 text-gold-400" />
                </div>
              )}
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-navy-900/50 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gold-400" />

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold">
                    Date
                  </span>

                  <div className="text-sm text-cream mt-0.5 font-medium">
                    {
                      selectedViewing.date
                    }
                  </div>
                </div>
              </div>

              <div className="bg-navy-900/50 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                <Clock className="h-5 w-5 text-gold-400" />

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold">
                    Time
                  </span>

                  <div className="text-sm text-cream mt-0.5 font-medium">
                    {
                      selectedViewing.time
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-navy-900/50 rounded-xl p-3 border border-white/5 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-ink/50 font-semibold">
                Status
              </span>

              <EnterpriseStatusBadge
                status={
                  selectedViewing.status
                }
              />
            </div>

            {/* Meeting Point */}
            <div>
              <h4 className="font-semibold text-gold-400 mb-1 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Meeting Point
              </h4>

              <p className="text-sm text-cream/80">
                {
                  selectedViewing.meetingPoint
                }
              </p>
            </div>

            {/* Instructions */}
            <div>
              <h4 className="font-semibold text-gold-400 mb-1">
                Viewing Instructions
              </h4>

              <p className="text-sm text-cream/80">
                {
                  selectedViewing.instructions
                }
              </p>
            </div>

            {/* Agent Notes */}
            <div>
              <h4 className="font-semibold text-gold-400 mb-1">
                Agent Notes
              </h4>

              <p className="text-sm text-cream/80">
                {selectedViewing.agentNotes ||
                  'No agent notes provided.'}
              </p>
            </div>

            {/* Special Requests */}
            <div>
              <h4 className="font-semibold text-gold-400 mb-1">
                Special Requests
              </h4>

              <p className="text-sm text-cream/80">
                {
                  selectedViewing.specialRequests ||
                  'No special requests.'
                }
              </p>
            </div>

            {/* Property Summary */}
            <div className="pt-4 border-t border-white/5">
              <h4 className="font-semibold text-gold-400 mb-1">
                Property Summary
              </h4>

              <p className="text-sm text-cream/80">
                {
                  selectedViewing.summary
                }
              </p>
            </div>

            {/* Exact Property ID */}
            <div className="pt-4 border-t border-white/5">
              <h4 className="font-semibold text-gold-400 mb-1">
                Property Reference
              </h4>

              <p className="text-xs text-ink/50 break-all">
                {
                  selectedViewing.propertyId
                }
              </p>
            </div>
          </div>
        </EnterpriseDetailDrawer>
      )}

      <RescheduleViewingModal
        isOpen={
          isRescheduleOpen
        }
        onClose={() =>
          setIsRescheduleOpen(
            false,
          )
        }
        onSubmit={
          handleRescheduleSubmit
        }
        viewing={
          selectedViewing
        }
      />

      <ConfirmationModal
        isOpen={
          isCancelOpen
        }
        onClose={() =>
          setIsCancelOpen(
            false,
          )
        }
        onConfirm={
          handleCancelConfirm
        }
        title="Cancel Viewing"
        message={`Are you sure you want to cancel your viewing for ${selectedViewing?.propertyTitle} on ${selectedViewing?.date}?`}
        confirmText="Cancel Viewing"
        type="danger"
      />
    </div>
  );
}