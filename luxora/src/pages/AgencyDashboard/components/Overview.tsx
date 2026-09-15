import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  RefreshCw,
  ShieldCheck,
  Target,
  TrendingUp,
  UserCircle,
  Users,
  Zap,
} from 'lucide-react';

import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { GhostButton } from '../../../components/ui/ui';
import { useSession } from '../../../contexts/SessionContext';
import { propertyApi } from '../../../api/property.api';
import { bookingApi } from '../../../api/booking.api';
import { AgentOnboardingModal } from './modals/AgentOnboardingModal';

interface OverviewProps {
  // Keep the existing dashboard navigation contract.
  onNavigate?: (tab: string) => void;
}

interface AgencyProperty {
  _id?: string;
  id?: string;
  title?: string;
  status?: string;
  availabilityStatus?: string;
  agent?: {
    _id?: string;
    id?: string;
    fullName?: string;
    name?: string;
  } | null;
  updatedAt?: string;
  createdAt?: string;
}

interface AgencyInquiry {
  _id?: string;
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  status?: string;
  property?: {
    title?: string;
  } | null;
  propertyTitle?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AgencyBooking {
  _id: string;
  viewingDate: string;
  viewingTime: string;
  message?: string;
  status: string;

  // Buyer information returned by the Agency booking endpoint.
  buyer?: {
    _id?: string;
    fullName?: string;
    email?: string;
    phone?: string;
  } | null;

  // Property information returned by the Agency booking endpoint.
  property?: {
    _id?: string;
    title?: string;
    address?: string;
    city?: string;
    state?: string;
    agent?: {
      _id?: string;
      fullName?: string;
      email?: string;
      phone?: string;
    } | null;
  } | null;
}

interface CommissionSummary {
  pending?: {
    amount?: number;
    count?: number;
  };
  processing?: {
    amount?: number;
    count?: number;
  };
  paid?: {
    amount?: number;
    count?: number;
  };
  overdue?: {
    amount?: number;
    count?: number;
  };
}

interface PerformanceAgent {
  id?: string;
  name?: string;
  closedDeals?: number;
  dealValue?: number;
  status?: string;
}

interface PerformanceResponse {
  summary?: {
    closedDealValue?: number;
    closedDeals?: number;
    listingConversion?: number | null;
  };
  funnel?: {
    inquiries?: number;
    viewings?: number;
    offers?: number;
    closedDeals?: number;
    conversionRate?: number | null;
  };
  agentLeaderboard?: PerformanceAgent[];
  recentConversions?: Array<{
    id?: string;
    date?: string;
    amount?: number;
    status?: string;
    agent?: string;
    property?: string;
    dealValue?: number;
  }>;
}

interface OverviewData {
  properties: AgencyProperty[];
  inquiries: AgencyInquiry[];
  bookings: AgencyBooking[];
  commissionSummary: CommissionSummary;
  performance: PerformanceResponse;
}

const formatCurrency = (
  value: number | null | undefined,
) => {
  // Keep currency formatting consistent with the financial modules.
  if (
    typeof value !== 'number' ||
    Number.isNaN(value)
  ) {
    return '—';
  }

  return `₦${new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 0,
  }).format(value)}`;
};

const formatRelativeTime = (
  dateValue?: string,
) => {
  // Convert real backend timestamps into readable dashboard activity text.
  if (!dateValue) {
    return 'Recently';
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }

  const diffMs =
    Date.now() - date.getTime();

  const diffMinutes =
    Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return 'Just now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours =
    Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }

  const diffDays =
    Math.floor(diffHours / 24);

  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'
      } ago`;
  }

  return date.toLocaleDateString('en-NG');
};

const getStatusLabel = (
  status?: string,
) => {
  // Normalize backend status labels before displaying them.
  if (!status) {
    return 'Unknown';
  }

  return status;
};

const formatScheduleDate = (
  dateValue?: string,
) => {
  // Display booking dates using the user's local calendar date.
  if (!dateValue) {
    return '—';
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString(
    'en-NG',
    {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  );
};

// Reusable skeleton block for dashboard data that is still loading.
const OverviewSkeleton = ({
  className = '',
}: {
  className?: string;
}) => (
  <div
    className={`animate-pulse rounded-md bg-white/10 ${className}`}
  />
);

export default function Overview({
  onNavigate,
}: OverviewProps) {
  const { user } = useSession();

  const [overviewData, setOverviewData] =
    useState<OverviewData>({
      properties: [],
      inquiries: [],
      bookings: [],
      commissionSummary: {},
      performance: {},
    });

  // Initial page data loading state.
  const [isLoading, setIsLoading] =
    useState(true);

  // Refresh-button loading state.
  const [isRefreshing, setIsRefreshing] =
    useState(false);

  // Store a real request error when one occurs.
  const [error, setError] =
    useState('');

  const [
    isOnboardingModalOpen,
    setIsOnboardingModalOpen,
  ] = useState(false);

  const loadOverview = async (
    showRefreshingState = false,
  ) => {
    // Show the correct loading state depending on whether this
    // is the first load or a manual refresh.
    if (showRefreshingState) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    // Clear any previous request error before retrying.
    setError('');

    try {
      const [
        propertiesResponse,
        inquiriesResponse,
        commissionSummaryResponse,
        performanceResponse,
        bookingsResponse,
      ] = await Promise.all([
        propertyApi.getAgencyProperties(),
        propertyApi.getAgencyInquiries(),
        propertyApi.getAgencyCommissionSummary(),
        propertyApi.getAgencyPerformance(),

        // Load real viewing requests for Agency properties.
        bookingApi.getAgencyBookings(),
      ]);

      // The shared HTTP client unwraps the success/message envelope.
      setOverviewData({
        properties:
          propertiesResponse?.properties ||
          propertiesResponse?.data
            ?.properties ||
          [],

        inquiries:
          inquiriesResponse?.inquiries ||
          inquiriesResponse?.data
            ?.inquiries ||
          [],

        commissionSummary:
          commissionSummaryResponse?.summary ||
          commissionSummaryResponse?.data
            ?.summary ||
          {},

        performance:
          performanceResponse?.performance ||
          performanceResponse?.data
            ?.performance ||
          performanceResponse ||
          {},

        // Support both possible booking response shapes.
        bookings:
          bookingsResponse?.bookings ||
          bookingsResponse?.data
            ?.bookings ||
          [],
      });
    } catch (requestError) {
      // Keep the dashboard usable even when a refresh fails.
      console.error(
        'Failed to load Agency Overview:',
        requestError,
      );

      setError(
        'Some live dashboard information could not be loaded. Refresh to try again.',
      );
    } finally {
      // Only after all requests settle do we stop the loading UI.
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Load real Overview information when the tab opens.
    void loadOverview();
  }, []);

  const {
    properties,
    inquiries,
    bookings,
    commissionSummary,
    performance,
  } = overviewData;

  const agencyName =
    user?.agency?.name ||
    user?.agencyName ||
    user?.name ||
    'Agency Dashboard';

  const managerName =
    user?.name ||
    user?.fullName ||
    'Agency Administrator';

  const propertyMetrics = useMemo(() => {
    // Derive portfolio counts from the actual agency property roster.
    const published = properties.filter(
      (property) =>
        property.status === 'Published',
    ).length;

    const pendingReview =
      properties.filter(
        (property) =>
          property.status ===
          'Pending Review',
      ).length;

    const underOffer =
      properties.filter(
        (property) =>
          property.status === 'Under Offer',
      ).length;

    const closed = properties.filter(
      (property) =>
        [
          'Sold',
          'Rented',
          'Leased',
        ].includes(
          property.status || '',
        ),
    ).length;

    const assigned =
      properties.filter(
        (property) =>
          property.agent,
      ).length;

    const unassigned =
      properties.filter(
        (property) =>
          !property.agent,
      ).length;

    return {
      total: properties.length,
      published,
      pendingReview,
      underOffer,
      closed,
      assigned,
      unassigned,
    };
  }, [properties]);

  const inquiryMetrics = useMemo(() => {
    // Count actual inquiry statuses returned by the Agency inquiry endpoint.
    const newInquiries =
      inquiries.filter(
        (inquiry) =>
          (
            inquiry.status || ''
          ).toLowerCase() === 'new',
      ).length;

    const viewingScheduled =
      inquiries.filter(
        (inquiry) =>
          [
            'Viewing Scheduled',
            'Confirmed',
            'Scheduled',
          ].includes(
            inquiry.status || '',
          ),
      ).length;

    const activeInquiries =
      inquiries.filter(
        (inquiry) =>
          ![
            'Closed',
            'Lost',
          ].includes(
            inquiry.status || '',
          ),
      ).length;

    return {
      total: inquiries.length,
      newInquiries,
      viewingScheduled,
      activeInquiries,
    };
  }, [inquiries]);

  const closedDealValue =
    performance.summary
      ?.closedDealValue || 0;

  const closedDeals =
    performance.summary
      ?.closedDeals ||
    performance.funnel
      ?.closedDeals ||
    0;

  const listingConversion =
    typeof performance.summary
      ?.listingConversion ===
      'number'
      ? performance.summary
        .listingConversion
      : null;

  const funnelConversion =
    typeof performance.funnel
      ?.conversionRate ===
      'number'
      ? performance.funnel
        .conversionRate
      : null;

  const agencyPendingEarnings =
    commissionSummary.pending
      ?.amount || 0;

  const pendingCommissionCount =
    commissionSummary.pending
      ?.count || 0;

  const processingCommissionCount =
    commissionSummary.processing
      ?.count || 0;

  const paidAgencyEarnings =
    commissionSummary.paid
      ?.amount || 0;

  const scheduleData = useMemo(() => {
    // Use the browser's local calendar date for today's schedule.
    const now = new Date();

    const todayYear =
      now.getFullYear();

    const todayMonth =
      now.getMonth();

    const todayDate =
      now.getDate();

    // Cancelled viewing requests should not appear as active appointments.
    const activeBookings =
      bookings.filter(
        (booking) =>
          (
            booking.status || ''
          ).toLowerCase() !==
          'cancelled',
      );

    const getBookingDate = (
      booking: AgencyBooking,
    ) => {
      // Convert the booking date into a local Date for comparison.
      const date = new Date(
        booking.viewingDate,
      );

      if (
        Number.isNaN(
          date.getTime(),
        )
      ) {
        return null;
      }

      return date;
    };

    // Find all active bookings scheduled for today.
    const todayBookings =
      activeBookings
        .filter((booking) => {
          const date =
            getBookingDate(
              booking,
            );

          if (!date) {
            return false;
          }

          return (
            date.getFullYear() ===
            todayYear &&
            date.getMonth() ===
            todayMonth &&
            date.getDate() ===
            todayDate
          );
        })
        .sort((a, b) => {
          // Keep today's appointments ordered by viewing time.
          return (
            a.viewingTime || ''
          ).localeCompare(
            b.viewingTime || '',
          );
        });

    // Find the nearest future active booking.
    const upcomingBooking =
      [...activeBookings]
        .map((booking) => ({
          booking,
          date:
            getBookingDate(
              booking,
            ),
        }))
        .filter(
          (
            entry,
          ): entry is {
            booking: AgencyBooking;
            date: Date;
          } =>
            entry.date !== null &&
            entry.date.getTime() >=
            now.getTime(),
        )
        .sort(
          (a, b) =>
            a.date.getTime() -
            b.date.getTime(),
        )[0]?.booking || null;

    return {
      todayBookings,
      upcomingBooking,
    };
  }, [bookings]);

  const recentActivity = useMemo(() => {
    // Build activity only from records that actually exist in the backend.
    const activities: Array<{
      title: string;
      time: string;
      desc: string;
      icon: typeof Building2;
      color: string;
    }> = [];

    const recentInquiry =
      [...inquiries]
        .sort(
          (a, b) =>
            new Date(
              b.createdAt ||
              b.updatedAt ||
              0,
            ).getTime() -
            new Date(
              a.createdAt ||
              a.updatedAt ||
              0,
            ).getTime(),
        )
        .slice(0, 1)[0];

    if (recentInquiry) {
      activities.push({
        title: 'New Inquiry',
        time: formatRelativeTime(
          recentInquiry.createdAt ||
          recentInquiry.updatedAt,
        ),
        desc:
          `${recentInquiry.fullName ||
          recentInquiry.name ||
          'A client'
          } ` +
          `inquired about ${recentInquiry.property
            ?.title ||
          recentInquiry.propertyTitle ||
          'a property'
          }`,
        icon: Target,
        color:
          'text-blue-400',
      });
    }

    const recentConversion =
      performance
        .recentConversions?.[0];

    if (recentConversion) {
      activities.push({
        title: `Deal Commission ${getStatusLabel(
          recentConversion.status,
        )}`,
        time: formatRelativeTime(
          recentConversion.date,
        ),
        desc:
          `${recentConversion.agent ||
          'Agent'
          } — ` +
          `${recentConversion.property ||
          'Property'
          } · ` +
          `${formatCurrency(
            recentConversion.dealValue,
          )}`,
        icon: DollarSign,
        color:
          'text-gold-400',
      });
    }

    const recentProperty =
      [...properties]
        .sort(
          (a, b) =>
            new Date(
              b.updatedAt ||
              b.createdAt ||
              0,
            ).getTime() -
            new Date(
              a.updatedAt ||
              a.createdAt ||
              0,
            ).getTime(),
        )
        .slice(0, 1)[0];

    if (recentProperty) {
      activities.push({
        title: `Property ${getStatusLabel(
          recentProperty.status,
        )}`,
        time: formatRelativeTime(
          recentProperty.updatedAt ||
          recentProperty.createdAt,
        ),
        desc:
          recentProperty.title ||
          'Agency property updated',
        icon: Building2,
        color:
          'text-emerald-400',
      });
    }

    return activities.slice(0, 3);
  }, [
    inquiries,
    performance.recentConversions,
    properties,
  ]);

  const leaderboardPreview =
    useMemo(() => {
      // Reuse the real leaderboard from the Performance module.
      return (
        performance
          .agentLeaderboard || []
      ).slice(0, 3);
    }, [
      performance.agentLeaderboard,
    ]);

  const briefingItems = [
    {
      label: 'New Inquiries',
      value:
        inquiryMetrics.newInquiries,
      icon: AlertTriangle,
      color:
        inquiryMetrics.newInquiries >
          0
          ? 'text-rose-400'
          : 'text-ink/50',
    },
    {
      label:
        'Pending Property Review',
      value:
        propertyMetrics.pendingReview,
      icon: Clock,
      color:
        propertyMetrics.pendingReview >
          0
          ? 'text-yellow-400'
          : 'text-ink/50',
    },
    {
      label:
        'Pending Commission Payouts',
      value:
        pendingCommissionCount,
      icon: DollarSign,
      color:
        pendingCommissionCount >
          0
          ? 'text-gold-400'
          : 'text-ink/50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-heading text-3xl font-bold text-cream">
              {agencyName}
            </h1>

            {user?.isVerified && (
              <span className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-400/10 text-emerald-400 text-xs font-bold tracking-wider uppercase">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>

          <div className="text-sm text-ink/70 space-y-1">
            <div className="flex items-center gap-2">
              <span>
                Managed by{' '}
                <strong className="text-cream">
                  {managerName}
                </strong>
              </span>

              {user?.role && (
                <>
                  <span className="text-ink/40">
                    •
                  </span>

                  <span>
                    {user.role}
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs mt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-gold-400" />
                Agency account
              </span>

              <span className="text-ink/40">
                •
              </span>

              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3 text-blue-400" />

                {isLoading ? (
                  <OverviewSkeleton className="h-3 w-12" />
                ) : (
                  <>
                    {propertyMetrics.total}{' '}
                    Listings
                  </>
                )}
              </span>

              <span className="text-ink/40">
                •
              </span>

              <span className="flex items-center gap-1">
                <Users className="h-3 w-3 text-emerald-400" />

                {isLoading ? (
                  <OverviewSkeleton className="h-3 w-12" />
                ) : (
                  <>
                    {performance
                      .agentLeaderboard
                      ?.length || 0}{' '}
                    Agents
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <GhostButton
            className="flex items-center gap-2"
            onClick={() =>
              onNavigate?.('Agents')
            }
          >
            <Users className="h-4 w-4" />
            Manage Roster
          </GhostButton>

          <GhostButton
            className="flex items-center gap-2"
            onClick={() =>
              void loadOverview(true)
            }
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing
                  ? 'animate-spin'
                  : ''
                }`}
            />
            {isRefreshing
              ? 'Refreshing...'
              : 'Refresh'}
          </GhostButton>
        </div>
      </div>

      {/* Live loading/error message */}
      {error && (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-400" />

            <p className="text-sm text-ink/80">
              {error}
            </p>
          </div>

          <GhostButton
            onClick={() =>
              void loadOverview(true)
            }
            className="shrink-0"
            disabled={isRefreshing}
          >
            Try Again
          </GhostButton>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Listings */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-ink/50">
              Total Listings
            </span>

            <Building2 className="h-5 w-5 text-blue-400" />
          </div>

          <div className="text-2xl font-bold text-cream">
            {isLoading ? (
              <OverviewSkeleton className="h-7 w-16" />
            ) : (
              propertyMetrics.total
            )}
          </div>

          <p className="text-xs text-ink/50 mt-1">
            {isLoading ? (
              <OverviewSkeleton className="h-3 w-20" />
            ) : (
              `${propertyMetrics.published} published`
            )}
          </p>
        </div>

        {/* Leads */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-ink/50">
              Leads
            </span>

            <Target className="h-5 w-5 text-gold-400" />
          </div>

          <div className="text-2xl font-bold text-cream">
            {isLoading ? (
              <OverviewSkeleton className="h-7 w-16" />
            ) : (
              inquiryMetrics.total
            )}
          </div>

          <p className="text-xs text-ink/50 mt-1">
            {isLoading ? (
              <OverviewSkeleton className="h-3 w-12" />
            ) : (
              `${inquiryMetrics.newInquiries} new`
            )}
          </p>
        </div>

        {/* Closed Deals */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-ink/50">
              Closed Deals
            </span>

            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>

          <div className="text-2xl font-bold text-cream">
            {isLoading ? (
              <OverviewSkeleton className="h-7 w-16" />
            ) : (
              closedDeals
            )}
          </div>

          <p className="text-xs text-ink/50 mt-1">
            {isLoading ? (
              <OverviewSkeleton className="h-3 w-24" />
            ) : (
              <>
                {formatCurrency(
                  closedDealValue,
                )}{' '}
                deal value
              </>
            )}
          </p>
        </div>

        {/* Agency Earnings */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-ink/50">
              Agency Earnings
            </span>

            <DollarSign className="h-5 w-5 text-emerald-400" />
          </div>

          <div className="text-2xl font-bold text-cream">
            {isLoading ? (
              <OverviewSkeleton className="h-7 w-28" />
            ) : (
              formatCurrency(
                agencyPendingEarnings,
              )
            )}
          </div>

          <p className="text-xs text-ink/50 mt-1">
            {isLoading ? (
              <OverviewSkeleton className="h-3 w-20" />
            ) : pendingCommissionCount >
              0 ? (
              `${pendingCommissionCount} pending payout${pendingCommissionCount ===
                1
                ? ''
                : 's'
              }`
            ) : (
              `${formatCurrency(
                paidAgencyEarnings,
              )} paid`
            )}
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() =>
            onNavigate?.('Clients')
          }
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-navy-800/50 hover:bg-gold-400/10 hover:border-gold-400/30 transition-all text-ink/80 hover:text-gold-400 text-sm font-medium"
        >
          <UserCircle className="h-4 w-4" />
          Add Client
        </button>

        <button
          onClick={() =>
            onNavigate?.('Leads')
          }
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-navy-800/50 hover:bg-gold-400/10 hover:border-gold-400/30 transition-all text-ink/80 hover:text-gold-400 text-sm font-medium"
        >
          <Target className="h-4 w-4" />
          Register Lead
        </button>

        <button
          onClick={() =>
            setIsOnboardingModalOpen(
              true,
            )
          }
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-navy-800/50 hover:bg-gold-400/10 hover:border-gold-400/30 transition-all text-ink/80 hover:text-gold-400 text-sm font-medium"
        >
          <Users className="h-4 w-4" />
          Add Agent
        </button>

        <button
          onClick={() =>
            onNavigate?.('Performance')
          }
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-navy-800/50 hover:bg-gold-400/10 hover:border-gold-400/30 transition-all text-ink/80 hover:text-gold-400 text-sm font-medium"
        >
          <FileText className="h-4 w-4" />
          View Performance
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Briefing + Business Health */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Daily Briefing */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-gold-400" />
                Daily Briefing
              </h3>

              <div className="space-y-3">
                {briefingItems.map(
                  (item) => {
                    const Icon =
                      item.icon;

                    return (
                      <div
                        key={item.label}
                        className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-navy-900/50"
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`h-4 w-4 ${item.color}`}
                          />

                          <span className="text-sm text-ink/80">
                            {item.label}
                          </span>
                        </div>

                        <span
                          className={`text-sm font-bold ${item.color}`}
                        >
                          {isLoading ? (
                            <OverviewSkeleton className="h-4 w-8" />
                          ) : (
                            item.value
                          )}
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            {/* Business Health */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4">
                Business Health
              </h3>

              <div className="space-y-5">
                {/* Published Listings */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink/60">
                      Published Listings
                    </span>

                    <span className="font-bold text-emerald-400">
                      {isLoading ? (
                        <OverviewSkeleton className="h-3 w-16" />
                      ) : (
                        `${propertyMetrics.published}/${propertyMetrics.total}`
                      )}
                    </span>
                  </div>

                  <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden border border-white/5">
                    {isLoading ? (
                      <div className="h-full w-1/3 bg-white/10 animate-pulse" />
                    ) : (
                      <div
                        className="h-full bg-emerald-400"
                        style={{
                          width:
                            propertyMetrics.total >
                              0
                              ? `${Math.min(
                                100,
                                (propertyMetrics.published /
                                  propertyMetrics.total) *
                                100,
                              )}%`
                              : '0%',
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Lead to Deal Conversion */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink/60">
                      Lead to Deal Conversion
                    </span>

                    <span className="font-bold text-blue-400">
                      {isLoading ? (
                        <OverviewSkeleton className="h-3 w-14" />
                      ) : funnelConversion !==
                        null ? (
                        `${funnelConversion}%`
                      ) : (
                        '—'
                      )}
                    </span>
                  </div>

                  <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden border border-white/5">
                    {isLoading ? (
                      <div className="h-full w-1/3 bg-white/10 animate-pulse" />
                    ) : (
                      <div
                        className="h-full bg-blue-400"
                        style={{
                          width:
                            funnelConversion !==
                              null
                              ? `${Math.min(
                                100,
                                funnelConversion,
                              )}%`
                              : '0%',
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Commission Processing */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink/60">
                      Commission Processing
                    </span>

                    <span className="font-bold text-yellow-400">
                      {isLoading ? (
                        <OverviewSkeleton className="h-3 w-8" />
                      ) : (
                        processingCommissionCount
                      )}
                    </span>
                  </div>

                  <p className="text-xs text-ink/50 mt-1">
                    Real payout records currently in Processing.
                  </p>
                </div>

                {/* Listing Conversion */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink/60">
                      Listing Conversion
                    </span>

                    <span className="font-bold text-gold-400">
                      {isLoading ? (
                        <OverviewSkeleton className="h-3 w-14" />
                      ) : listingConversion !==
                        null ? (
                        `${listingConversion}%`
                      ) : (
                        '—'
                      )}
                    </span>
                  </div>

                  <p className="text-xs text-ink/50 mt-1">
                    Reported by the Agency Performance module.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio + Pipeline */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Portfolio Snapshot */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gold-400" />
                Portfolio Snapshot
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-navy-900/50 rounded-xl border border-white/5">
                  <div className="text-[10px] text-ink/60 uppercase font-bold mb-1">
                    Published
                  </div>

                  <div className="text-sm font-bold text-emerald-400">
                    {isLoading ? (
                      <OverviewSkeleton className="h-5 w-10" />
                    ) : (
                      propertyMetrics.published
                    )}
                  </div>
                </div>

                <div className="p-3 bg-navy-900/50 rounded-xl border border-white/5">
                  <div className="text-[10px] text-ink/60 uppercase font-bold mb-1">
                    Pending Review
                  </div>

                  <div className="text-sm font-bold text-yellow-400">
                    {isLoading ? (
                      <OverviewSkeleton className="h-5 w-10" />
                    ) : (
                      propertyMetrics.pendingReview
                    )}
                  </div>
                </div>

                <div className="p-3 bg-navy-900/50 rounded-xl border border-white/5">
                  <div className="text-[10px] text-ink/60 uppercase font-bold mb-1">
                    Under Offer
                  </div>

                  <div className="text-sm font-bold text-blue-400">
                    {isLoading ? (
                      <OverviewSkeleton className="h-5 w-10" />
                    ) : (
                      propertyMetrics.underOffer
                    )}
                  </div>
                </div>

                <div className="p-3 bg-navy-900/50 rounded-xl border border-white/5">
                  <div className="text-[10px] text-ink/60 uppercase font-bold mb-1">
                    Closed
                  </div>

                  <div className="text-sm font-bold text-cream">
                    {isLoading ? (
                      <OverviewSkeleton className="h-5 w-10" />
                    ) : (
                      propertyMetrics.closed
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline Snapshot */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gold-400" />
                Pipeline Snapshot
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink/80 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Inquiries
                  </span>

                  <span className="font-bold text-cream">
                    {isLoading ? (
                      <OverviewSkeleton className="h-4 w-10" />
                    ) : (
                      performance.funnel
                        ?.inquiries ??
                      inquiries.length
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink/80 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Viewings
                  </span>

                  <span className="font-bold text-cream">
                    {isLoading ? (
                      <OverviewSkeleton className="h-4 w-10" />
                    ) : (
                      performance.funnel
                        ?.viewings ??
                      '—'
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink/80 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Offers
                  </span>

                  <span className="font-bold text-cream">
                    {isLoading ? (
                      <OverviewSkeleton className="h-4 w-10" />
                    ) : (
                      performance.funnel
                        ?.offers ??
                      '—'
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink/80 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Closed Deals
                  </span>

                  <span className="font-bold text-emerald-400">
                    {isLoading ? (
                      <OverviewSkeleton className="h-4 w-10" />
                    ) : (
                      performance.funnel
                        ?.closedDeals ??
                      closedDeals
                    )}
                  </span>
                </div>

                <div className="pt-3 mt-3 border-t border-white/5 flex justify-between items-center text-sm">
                  <span className="text-ink/60">
                    Conversion
                  </span>

                  <span className="font-bold text-gold-400">
                    {isLoading ? (
                      <OverviewSkeleton className="h-4 w-14" />
                    ) : funnelConversion !==
                      null ? (
                      `${funnelConversion}%`
                    ) : (
                      '—'
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Agent leaderboard preview */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading text-lg font-semibold text-cream flex items-center gap-2">
                <Users className="h-5 w-5 text-gold-400" />
                Agent Leaderboard
              </h3>

              <GhostButton
                onClick={() =>
                  onNavigate?.(
                    'Performance',
                  )
                }
              >
                View Rankings
              </GhostButton>
            </div>

            {isLoading ? (
              // Keep the leaderboard area occupied with skeleton rows while loading.
              <div className="space-y-3">
                {[1, 2, 3].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between gap-4 p-3 rounded-xl border border-white/5 bg-navy-900/40"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <OverviewSkeleton className="h-8 w-8 rounded-full" />

                        <div className="space-y-2">
                          <OverviewSkeleton className="h-3 w-28" />
                          <OverviewSkeleton className="h-2 w-20" />
                        </div>
                      </div>

                      <div className="space-y-2 text-right">
                        <OverviewSkeleton className="h-3 w-20" />
                        <OverviewSkeleton className="h-2 w-14 ml-auto" />
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : leaderboardPreview.length >
              0 ? (
              <div className="space-y-3">
                {leaderboardPreview.map(
                  (
                    agent,
                    index,
                  ) => (
                    <div
                      key={
                        agent.id ||
                        `${agent.name}-${index}`
                      }
                      className="flex items-center justify-between gap-4 p-3 rounded-xl border border-white/5 bg-navy-900/40"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 shrink-0 rounded-full bg-gold-400/10 border border-gold-400/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-gold-400">
                            {index + 1}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="text-sm font-medium text-cream truncate">
                            {agent.name ||
                              'Agent'}
                          </div>

                          <div className="text-xs text-ink/50">
                            {agent.closedDeals ||
                              0}{' '}
                            closed deal
                            {agent.closedDeals ===
                              1
                              ? ''
                              : 's'}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-cream">
                          {formatCurrency(
                            agent.dealValue,
                          )}
                        </div>

                        <div className="text-[10px] text-ink/50 uppercase tracking-wider">
                          Deal Value
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              // This is now a genuine empty state because loading has finished.
              <div className="py-8 text-center">
                <Users className="h-8 w-8 text-ink/20 mx-auto mb-2" />

                <p className="text-sm text-ink/50">
                  No agent performance records yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Assignment status */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-gold-400" />
              Assignment Status
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-white/5 bg-navy-900/40">
                <div className="text-[10px] text-ink/60 uppercase font-bold mb-1">
                  Assigned
                </div>

                <div className="text-lg font-bold text-emerald-400">
                  {isLoading ? (
                    <OverviewSkeleton className="h-6 w-10" />
                  ) : (
                    propertyMetrics.assigned
                  )}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-white/5 bg-navy-900/40">
                <div className="text-[10px] text-ink/60 uppercase font-bold mb-1">
                  Unassigned
                </div>

                <div className="text-lg font-bold text-yellow-400">
                  {isLoading ? (
                    <OverviewSkeleton className="h-6 w-10" />
                  ) : (
                    propertyMetrics.unassigned
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                onNavigate?.(
                  'Assignment Center',
                )
              }
              className="w-full mt-4 px-4 py-2 rounded-lg border border-white/10 bg-navy-900/50 hover:bg-gold-400/10 hover:border-gold-400/30 transition-all text-ink/80 hover:text-gold-400 text-sm font-medium"
            >
              Open Assignment Center
            </button>
          </div>

          {/* Schedule */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gold-400" />
              Today's Schedule
            </h3>

            {isLoading ? (
              // Do not show the empty schedule state before bookings finish loading.
              <div className="space-y-3">
                <OverviewSkeleton className="h-4 w-32" />
                <OverviewSkeleton className="h-4 w-full" />
                <OverviewSkeleton className="h-4 w-3/4" />
                <OverviewSkeleton className="h-4 w-1/2" />
              </div>
            ) : scheduleData
              .todayBookings.length >
              0 ? (
              // Display every active booking scheduled for today.
              <div className="space-y-3">
                {scheduleData.todayBookings.map(
                  (booking) => (
                    <div
                      key={
                        booking._id
                      }
                      className="p-3 rounded-xl border border-white/5 bg-navy-900/40"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-cream truncate">
                            {booking.property
                              ?.title ||
                              'Property'}
                          </p>

                          <p className="text-xs text-ink/50 mt-1">
                            Buyer:{' '}
                            {booking.buyer
                              ?.fullName ||
                              'Buyer'}
                          </p>
                        </div>

                        <span className="shrink-0 text-sm font-bold text-gold-400">
                          {booking.viewingTime ||
                            '—'}
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-ink/60">
                          <Users className="h-3.5 w-3.5 text-blue-400" />

                          <span>
                            Agent:{' '}
                            {booking.property
                              ?.agent
                              ?.fullName ||
                              'Unassigned'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-ink/60">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />

                          <span>
                            Status:{' '}
                            {getStatusLabel(
                              booking.status,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : scheduleData.upcomingBooking ? (
              // When there is no appointment today, show the next real appointment instead.
              <div className="p-4 rounded-xl border border-gold-400/20 bg-gold-400/5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-gold-400" />

                  <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
                    Next Upcoming Viewing
                  </span>
                </div>

                <p className="text-sm font-semibold text-cream">
                  {scheduleData
                    .upcomingBooking
                    .property
                    ?.title ||
                    'Property'}
                </p>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-ink/70">
                    <Calendar className="h-3.5 w-3.5 text-blue-400" />

                    <span>
                      {formatScheduleDate(
                        scheduleData
                          .upcomingBooking
                          .viewingDate,
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-ink/70">
                    <Clock className="h-3.5 w-3.5 text-gold-400" />

                    <span>
                      {scheduleData
                        .upcomingBooking
                        .viewingTime ||
                        '—'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-ink/70">
                    <UserCircle className="h-3.5 w-3.5 text-emerald-400" />

                    <span>
                      Buyer:{' '}
                      {scheduleData
                        .upcomingBooking
                        .buyer
                        ?.fullName ||
                        'Buyer'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-ink/70">
                    <Users className="h-3.5 w-3.5 text-blue-400" />

                    <span>
                      Agent:{' '}
                      {scheduleData
                        .upcomingBooking
                        .property
                        ?.agent
                        ?.fullName ||
                        'Unassigned'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-ink/70">
                    <ShieldCheck className="h-3.5 w-3.5 text-yellow-400" />

                    <span>
                      Status:{' '}
                      {getStatusLabel(
                        scheduleData
                          .upcomingBooking
                          .status,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              // This empty state now appears only after the booking request finishes.
              <div className="py-6 text-center">
                <Calendar className="h-7 w-7 text-ink/20 mx-auto mb-2" />

                <p className="text-sm text-ink/50">
                  No active viewing requests are scheduled.
                </p>

                <button
                  onClick={() =>
                    onNavigate?.(
                      'Leads',
                    )
                  }
                  className="mt-3 text-xs font-medium text-gold-400 hover:text-gold-300 transition-colors"
                >
                  Review Leads
                </button>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-gold-400" />
              Recent Activity
            </h3>

            {isLoading ? (
              // Keep the activity panel visually populated while records are loading.
              <div className="space-y-4">
                {[1, 2, 3].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3"
                    >
                      <OverviewSkeleton className="h-8 w-8 rounded-full shrink-0" />

                      <div className="flex-1 space-y-2">
                        <OverviewSkeleton className="h-3 w-32" />
                        <OverviewSkeleton className="h-2 w-full" />
                        <OverviewSkeleton className="h-2 w-2/3" />
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : recentActivity.length >
              0 ? (
              <ActivityTimeline
                title=""
                items={recentActivity}
              />
            ) : (
              // This is now a genuine empty state.
              <div className="py-6 text-center">
                <Clock className="h-7 w-7 text-ink/20 mx-auto mb-2" />

                <p className="text-sm text-ink/50">
                  No recent activity is available.
                </p>
              </div>
            )}
          </div>

          {/* Commission summary */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gold-400" />
              Commission Summary
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-ink/60">
                  Pending
                </span>

                <span className="font-semibold text-yellow-400">
                  {isLoading ? (
                    <OverviewSkeleton className="h-4 w-20" />
                  ) : (
                    formatCurrency(
                      commissionSummary
                        .pending?.amount,
                    )
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-ink/60">
                  Processing
                </span>

                <span className="font-semibold text-blue-400">
                  {isLoading ? (
                    <OverviewSkeleton className="h-4 w-20" />
                  ) : (
                    formatCurrency(
                      commissionSummary
                        .processing?.amount,
                    )
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-ink/60">
                  Paid
                </span>

                <span className="font-semibold text-emerald-400">
                  {isLoading ? (
                    <OverviewSkeleton className="h-4 w-20" />
                  ) : (
                    formatCurrency(
                      commissionSummary
                        .paid?.amount,
                    )
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-ink/60">
                  Overdue
                </span>

                <span className="font-semibold text-rose-400">
                  {isLoading ? (
                    <OverviewSkeleton className="h-4 w-20" />
                  ) : (
                    formatCurrency(
                      commissionSummary
                        .overdue?.amount,
                    )
                  )}
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                onNavigate?.(
                  'Commissions',
                )
              }
              className="w-full mt-4 px-4 py-2 rounded-lg border border-white/10 bg-navy-900/50 hover:bg-gold-400/10 hover:border-gold-400/30 transition-all text-ink/80 hover:text-gold-400 text-sm font-medium"
            >
              Open Commissions
            </button>
          </div>
        </div>
      </div>

      <AgentOnboardingModal
        isOpen={
          isOnboardingModalOpen
        }
        onClose={() =>
          setIsOnboardingModalOpen(
            false,
          )
        }
      />
    </div>
  );
}