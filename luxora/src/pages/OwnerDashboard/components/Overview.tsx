// Import hooks needed to load and manage real Owner Overview data.
import { useEffect, useState } from 'react';
import { getGreetingText } from '../../../utils/greeting';
import { WaveEmoji } from '../../../components/ui/WaveEmoji';
import {
  Home,
  ShieldCheck,
  FileCheck,
  Wallet,
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Plus,
  CheckCircle2,
  ChevronRight,
  Calendar,
  Zap,
  FileText,
} from 'lucide-react';
import { useSession } from '../../../contexts/SessionContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../contexts/ToastContext';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import {
  GoldButton,
  GhostButton,
  VerifyBadge,
} from '../../../components/ui/ui';
import PropertySubmissionModal from './modals/PropertySubmissionModal';

// Import the real Owner analytics API used by the dashboard.
import { analyticsApi } from '../../../api/analytics.api';

// Import the real Owner property API used by the Owner sidebar pages.
import { propertyApi } from '../../../api/property.api';

// Import the real rental payment API used by the Owner Rental Income section.
import { paymentApi } from '../../../api/payment.api';

// Reuse the exact Property Request mapper used by My Property Requests.
import { mapOwnerPropertyToRequest } from './MyPropertyRequests';

// Reuse the exact Listing Journey mapper used by Listing Journey.
import { mapPropertyToJourney } from './ListingJourney';

export default function Overview({
  onNavigate,
}: {
  onNavigate?: (tab: string) => void;
}) {
  const { user } = useSession();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

  // Store the real Owner analytics snapshot.
  const [analytics, setAnalytics] = useState<any | null>(null);

  // Store the Owner's real backend properties.
  const [ownerProperties, setOwnerProperties] = useState<any[]>([]);

  // Track whether the Overview snapshot is still loading.
  const [isLoadingOverview, setIsLoadingOverview] = useState(true);

  // Store the Owner's real rental payment records.
  const [ownerPayments, setOwnerPayments] = useState<any[]>([]);

  // Build the same Property Request records used by the Owner sidebar.
  const recentRequests = ownerProperties
    .map(mapOwnerPropertyToRequest)
    .sort(
      (a, b) =>
        new Date(b.submissionDate).getTime() -
        new Date(a.submissionDate).getTime(),
    )
    .slice(0, 4);

  // Build the same Listing Journey records used by the Owner sidebar.
  const journeys = ownerProperties.map(mapPropertyToJourney);

  // Use the first real journey for the Overview snapshot.
  const overviewJourney = journeys[0];

  // Reuse the real Listing Journey activity feed.
  const recentActivities =
    overviewJourney?.activityFeed?.slice(-5).reverse() ?? [];

  // Read the real analytics metrics with safe fallbacks.
  const metrics = analytics?.metrics ?? {};

  // Count the Owner's currently published properties.
  const activeListings = ownerProperties.filter(
    (property) => property.status === 'Published',
  ).length;

  // Read the current calendar month.
  const currentMonth = new Date().toLocaleDateString('en-US', {
    month: 'short',
  });

  // Read the real current-month rental income from Owner Analytics.
  const monthlyRentalIncome =
    analytics?.monthlyRentalIncome?.find(
      (item: any) => item.month === currentMonth,
    )?.income ?? 0;

  // Calculate all unpaid rental amounts from the real payment records.
  const outstandingRent = ownerPayments
    .filter(
      (payment: any) =>
        payment.status === 'Pending' || payment.status === 'Overdue',
    )
    .reduce(
      (total: number, payment: any) =>
        total + (Number(payment.amount) || 0),
      0,
    );

  // Calculate real paid rental income for the current calendar year.
  const rentalIncomeYTD = ownerPayments
    .filter((payment: any) => {
      // Only completed payments belong in rental income.
      if (payment.status !== 'Paid') {
        return false;
      }

      // Read the payment date from the available backend fields.
      const paymentDate = new Date(
        payment.paidAt || payment.createdAt,
      );

      // Keep only payments from the current year.
      return paymentDate.getFullYear() === new Date().getFullYear();
    })
    .reduce(
      (total: number, payment: any) =>
        total + (Number(payment.amount) || 0),
      0,
    );

  // Read real Owner property analytics used by the Analytics sidebar.
  const topProperties = analytics?.topProperties ?? [];

  // Total the offers represented across the Owner's property analytics.
  const totalOffers = topProperties.reduce(
    (total: number, property: any) =>
      total + (Number(property.offers) || 0),
    0,
  );

  // Count Owner properties that have not yet reached Published status.
  const pendingVerification = ownerProperties.filter(
    (property) => property.status !== 'Published',
  ).length;

  // Format monetary values consistently with the dashboard.
  const formatNairaCompact = (value: number) => {
    if (!Number.isFinite(value) || value <= 0) {
      return '₦0';
    }

    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  // Format backend activity dates for the Overview.
  const formatActivityDate = (date?: string) => {
    if (!date) {
      return '—';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('en-NG', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Load the real data used across the Owner Overview.
  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        // Load the same analytics used by the Owner Analytics section.
        const analyticsResponse = await analyticsApi.getOwnerAnalytics();

        // Read analytics from the standard API response envelope.
        const backendAnalytics =
          analyticsResponse.data?.data?.analytics ??
          analyticsResponse.data?.analytics ??
          null;

        // Store the real Owner analytics.
        setAnalytics(backendAnalytics);

        // Load the same Owner property collection used by the sidebar pages.
        const propertyResponse = await propertyApi.getOwnerProperties();

        // Read the Owner properties from the available response shapes.
        const properties =
          (propertyResponse as any)?.properties ??
          propertyResponse.data?.data?.properties ??
          propertyResponse.data?.properties ??
          [];

        // Store the real Owner properties.
        setOwnerProperties(properties);

        // Load the Owner's real rental payments.
        const paymentResponse = await paymentApi.getOwnerPayments();

        // Read payments from the standard API response envelope.
        const payments =
          paymentResponse.data?.data?.payments ??
          paymentResponse.data?.payments ??
          [];

        // Store the real Owner payments.
        setOwnerPayments(payments);
      } catch (error) {
        // Keep Overview usable when snapshot requests fail.
        console.error('Failed to load Owner Overview data:', error);

        showToast({
          type: 'error',
          title: 'Overview data could not be loaded',
          description:
            'We could not retrieve your latest dashboard snapshot.',
        });
      } finally {
        // Stop the Overview loading state after requests finish.
        setIsLoadingOverview(false);
      }
    };

    // Start loading the Owner Overview snapshot.
    void loadOverviewData();
  }, [showToast]);

  // 1. Welcome Header
  const greeting = getGreetingText(user?.name || 'Owner');

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8 backdrop-blur-md">
        <div className="flex items-center gap-6">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-16 w-16 rounded-full border-2 border-gold-400/30 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-400/30 bg-navy-900 text-2xl font-bold text-gold-400">
              {user?.name?.charAt(0) || 'O'}
            </div>
          )}

          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-heading text-2xl font-bold text-cream sm:text-3xl">
                {greeting} <WaveEmoji />
              </h2>

              <VerifyBadge
                icon={<ShieldCheck className="h-3 w-3" />}
                label="Verified Owner"
              />
            </div>

            <p className="mt-1 text-ink/70">
              Here's a snapshot of your property portfolio and current listing
              requests.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 flex-wrap">
          <GoldButton
            size="sm"
            onClick={() => setIsSubmissionModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Submit Property
          </GoldButton>

          <GhostButton
            size="sm"
            onClick={() => onNavigate?.('Messages')}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </GhostButton>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Active Listings',
            value: isLoadingOverview ? '—' : String(activeListings),
            icon: Home,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
          },
          {
            label: 'Pending Verification',
            value: isLoadingOverview ? '—' : String(pendingVerification),
            icon: ShieldCheck,
            color: 'text-rose-400',
            bg: 'bg-rose-400/10',
          },
          {
            label: 'Active Offers',
            value: isLoadingOverview
              ? '—'
              : String(metrics.activeOffers ?? 0),
            icon: FileCheck,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
          },
          {
            label: 'Monthly Rental Income',
            value: isLoadingOverview
              ? '—'
              : formatNairaCompact(monthlyRentalIncome),
            icon: Wallet,
            color: 'text-gold-400',
            bg: 'bg-gold-400/10',
          },
        ].map((stat, i) => (
          <KPICard
            key={i}
            title={stat.label}
            value={stat.value}
            icon={stat.icon}
            iconColor={stat.color}
            backgroundColor={stat.bg}
            hoverEffect="lift"
            iconBorder={true}
            valueTypography="heading"
            labelTypography="small"
          />
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* 3. Property Performance */}
          <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8 backdrop-blur-md">
            <h3 className="font-heading text-xl font-bold text-cream mb-6">
              Property Performance
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[
                {
                  label: 'Total Views',
                  value: isLoadingOverview
                    ? '—'
                    : String(metrics.totalPropertyViews ?? 0),
                  icon: Eye,
                },
                {
                  label: 'Saves',
                  value: isLoadingOverview
                    ? '—'
                    : String(metrics.totalFavorites ?? 0),
                  icon: Heart,
                },
                {
                  label: 'Viewing Req.',
                  value: isLoadingOverview
                    ? '—'
                    : String(metrics.totalViewings ?? 0),
                  icon: Calendar,
                },
                {
                  label: 'Offers',
                  value: isLoadingOverview
                    ? '—'
                    : String(totalOffers),
                  icon: FileText,
                },
                {
                  label: 'Conversion',
                  value: isLoadingOverview
                    ? '—'
                    : `${metrics.offerConversionRate ?? 0}%`,
                  icon: TrendingUp,
                },
              ].map((perf, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-navy-900 border border-white/5 text-center flex flex-col items-center justify-center"
                >
                  <perf.icon className="h-5 w-5 text-gold-400 mb-2" />

                  <div className="font-heading font-bold text-lg text-cream">
                    {perf.value}
                  </div>

                  <div className="text-[10px] uppercase tracking-wider text-ink/50 mt-1">
                    {perf.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Recent Property Requests */}
          <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading text-xl font-bold text-cream">
                Recent Property Requests
              </h3>

              <GhostButton
                size="sm"
                onClick={() => onNavigate?.('My Property Requests')}
              >
                View All
              </GhostButton>
            </div>

            {isLoadingOverview ? (
              <div className="py-8 text-center text-sm text-ink/50">
                Loading property requests...
              </div>
            ) : recentRequests.length === 0 ? (
              <div className="py-8 text-center text-sm text-ink/50">
                No property requests yet.
              </div>
            ) : (
              <div className="w-full">
                <DataTable
                  data={recentRequests}
                  keyExtractor={(request) => request.id}
                  columns={[
                    {
                      header: 'Property Name',
                      render: (request) => (
                        <span className="font-medium text-cream">
                          {request.name}
                        </span>
                      ),
                    },
                    {
                      header: 'Status',
                      render: (request) => {
                        const statusBg =
                          request.status === 'Published'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : request.status === 'Documents Verified'
                              ? 'bg-gold-500/10 text-gold-400 border-gold-500/20'
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/20';

                        return (
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold border ${statusBg}`}
                          >
                            {request.status}
                          </span>
                        );
                      },
                    },
                    {
                      header: 'Date Submitted',
                      render: (request) => (
                        <span className="text-ink/70">
                          {request.submissionDate
                            ? new Date(
                              request.submissionDate,
                            ).toLocaleDateString('en-NG', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                            : '—'}
                        </span>
                      ),
                    },
                    {
                      header: 'Assigned Agent',
                      render: (request) => (
                        <div className="flex items-center gap-2">
                          {request.agent?.avatar ? (
                            <img
                              src={request.agent.avatar}
                              alt="Agent"
                              className="h-6 w-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-navy-900 border border-white/10" />
                          )}

                          <span className="text-ink/80">
                            {request.agent?.name || 'Unassigned'}
                          </span>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            )}
          </div>

          {/* 5. Listing Journey Snapshot */}
          <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h3 className="font-heading text-xl font-bold text-cream">
                {overviewJourney?.name
                  ? `Listing Journey Snapshot (${overviewJourney.name})`
                  : 'Listing Journey Snapshot'}
              </h3>

              <GhostButton
                size="sm"
                onClick={() => onNavigate?.('Listing Journey')}
              >
                View Journey
              </GhostButton>
            </div>

            {isLoadingOverview ? (
              <div className="py-8 text-center text-sm text-ink/50">
                Loading listing journey...
              </div>
            ) : !overviewJourney ? (
              <div className="py-8 text-center text-sm text-ink/50">
                No listing journey available yet.
              </div>
            ) : (
              <>
                <div className="mb-6 flex flex-wrap gap-3 text-xs">
                  <span className="rounded-full border border-white/10 bg-navy-900 px-3 py-1 text-ink/70">
                    {overviewJourney.status}
                  </span>

                  <span className="rounded-full border border-white/10 bg-navy-900 px-3 py-1 text-ink/70">
                    Agent: {overviewJourney.agent?.name || 'Unassigned'}
                  </span>

                  <span className="rounded-full border border-white/10 bg-navy-900 px-3 py-1 text-ink/70">
                    {overviewJourney.progressPercent ?? 0}% complete
                  </span>
                </div>

                <div className="relative">
                  <div className="absolute left-[15px] top-6 bottom-6 w-[2px] bg-white/5" />

                  <div className="space-y-6">
                    {overviewJourney.stages?.map(
                      (stage: any, index: number) => (
                        <div
                          key={`${stage.name}-${index}`}
                          className="relative flex items-center gap-4"
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 z-10 ${stage.status === 'Completed'
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : stage.status === 'Current'
                                  ? 'bg-navy-800 border-gold-400 text-gold-400'
                                  : stage.status === 'Rejected' ||
                                    stage.status === 'Delayed'
                                    ? 'bg-rose-500/10 border-rose-400 text-rose-400'
                                    : 'bg-navy-800 border-white/20 text-ink/30'
                              }`}
                          >
                            {stage.status === 'Completed' ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : stage.status === 'Rejected' ? (
                              <span className="text-xs font-bold">×</span>
                            ) : (
                              <div
                                className={`h-2 w-2 rounded-full ${stage.status === 'Current'
                                    ? 'bg-gold-400'
                                    : stage.status === 'Delayed'
                                      ? 'bg-rose-400'
                                      : 'bg-ink/30'
                                  }`}
                              />
                            )}
                          </div>

                          <div>
                            <div
                              className={`font-semibold ${stage.status === 'Completed' ||
                                  stage.status === 'Current'
                                  ? 'text-cream'
                                  : stage.status === 'Rejected' ||
                                    stage.status === 'Delayed'
                                    ? 'text-rose-400'
                                    : 'text-ink/50'
                                }`}
                            >
                              {stage.name}
                            </div>

                            <div className="text-xs text-ink/50">
                              {stage.date
                                ? formatActivityDate(stage.date)
                                : 'Pending'}
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-4 border-t border-white/5 pt-6">
                  <div className="flex-1 h-2 bg-navy-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold-400 rounded-full transition-all duration-500"
                      style={{
                        width: `${overviewJourney.progressPercent ?? 0}%`,
                      }}
                    />
                  </div>

                  <span className="text-sm font-bold text-gold-400">
                    {overviewJourney.progressPercent ?? 0}% Complete
                  </span>
                </div>

                {overviewJourney.currentStage && (
                  <div className="mt-5 rounded-2xl border border-gold-400/10 bg-gold-400/5 p-4">
                    <div className="text-[10px] uppercase tracking-wider text-gold-400/70">
                      Current Stage
                    </div>

                    <div className="mt-1 font-semibold text-cream">
                      {overviewJourney.currentStage.name}
                    </div>

                    <div className="mt-1 text-xs text-ink/60">
                      {overviewJourney.currentStage.description}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* 6. Rental Income Snapshot */}
          <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md">
            <h3 className="font-heading text-xl font-bold text-cream mb-6">
              Rental Income Snapshot
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-navy-900 border border-white/5">
                <div className="text-xs text-ink/50 mb-1">
                  Monthly Earnings ({currentMonth})
                </div>

                <div className="font-heading text-2xl font-bold text-emerald-400">
                  {isLoadingOverview
                    ? '—'
                    : formatNairaCompact(monthlyRentalIncome)}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-navy-900 border border-white/5">
                <div className="text-xs text-ink/50 mb-1">
                  Outstanding Rent
                </div>

                <div className="font-heading text-xl font-bold text-rose-400">
                  {isLoadingOverview
                    ? '—'
                    : formatNairaCompact(outstandingRent)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-navy-900 border border-white/5">
                  <div className="text-xs text-ink/50 mb-1">
                    Rental Income YTD
                  </div>

                  <div className="font-heading text-lg font-bold text-cream">
                    {isLoadingOverview
                      ? '—'
                      : formatNairaCompact(rentalIncomeYTD)}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-navy-900 border border-white/5">
                  <div className="text-xs text-ink/50 mb-1">
                    Paid Payments
                  </div>

                  <div className="font-heading text-lg font-bold text-cream">
                    {isLoadingOverview
                      ? '—'
                      : String(
                        ownerPayments.filter(
                          (payment: any) =>
                            payment.status === 'Paid',
                        ).length,
                      )}
                  </div>
                </div>
              </div>

              <GhostButton
                size="sm"
                className="w-full mt-2"
                onClick={() => onNavigate?.('Rental Income')}
              >
                View Full Analytics
              </GhostButton>
            </div>
          </div>

          {/* 7. Recent Activity Timeline */}
          <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md">
            <h3 className="font-heading text-xl font-bold text-cream mb-6">
              Recent Activity
            </h3>

            {isLoadingOverview ? (
              <div className="py-6 text-center text-sm text-ink/50">
                Loading recent activity...
              </div>
            ) : recentActivities.length === 0 ? (
              <div className="py-6 text-center text-sm text-ink/50">
                No recent activity yet.
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map(
                  (
                    activity: any,
                    index: number,
                  ) => {
                    // Select the Lucide icon component for the real activity event.
                    const ActivityIcon =
                      activity.type === 'success'
                        ? Zap
                        : activity.type === 'warning'
                          ? ShieldCheck
                          : FileCheck;

                    const activityColor =
                      activity.type === 'success'
                        ? 'text-emerald-400'
                        : activity.type === 'warning'
                          ? 'text-yellow-400'
                          : 'text-blue-400';

                    const activityBg =
                      activity.type === 'success'
                        ? 'bg-emerald-400/10'
                        : activity.type === 'warning'
                          ? 'bg-yellow-400/10'
                          : 'bg-blue-400/10';

                    return (
                      <div
                        key={`${activity.title}-${activity.date}-${index}`}
                        className="flex gap-4 items-start"
                      >
                        <div
                          className={`p-2 rounded-full border border-white/5 shrink-0 ${activityBg}`}
                        >
                        <ActivityIcon
  className={`h-4 w-4 ${activityColor}`}
/>
                        </div>

                        <div>
                          <div className="text-sm font-semibold text-cream">
                            {activity.title}
                          </div>

                          <div className="text-xs text-ink/60">
                            {overviewJourney?.name || 'Property'}
                          </div>
                        </div>

                        <div className="ml-auto text-[10px] text-ink/40 whitespace-nowrap">
                          {formatActivityDate(activity.date)}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </div>

          {/* 8. Quick Links Sidebar */}
          <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md">
            <h3 className="font-heading text-xl font-bold text-cream mb-4">
              Quick Links
            </h3>

            <div className="space-y-2">
              <GhostButton
                className="w-full justify-between"
                onClick={() =>
                  onNavigate?.('My Property Requests')
                }
              >
                View Listings
                <ChevronRight className="h-4 w-4" />
              </GhostButton>

              <GhostButton
                className="w-full justify-between"
                onClick={() =>
                  onNavigate?.('Verification Progress')
                }
              >
                Track Verification
                <ChevronRight className="h-4 w-4" />
              </GhostButton>

              <GhostButton
                className="w-full justify-between"
                onClick={() => onNavigate?.('Offers')}
              >
                Manage Offers
                <ChevronRight className="h-4 w-4" />
              </GhostButton>
            </div>
          </div>
        </div>
      </div>

      <PropertySubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        onSubmit={() => {
          setIsSubmissionModalOpen(false);

          showToast({
            type: 'success',
            title: 'Property Submitted',
            description:
              'Your property has been submitted for review.',
          });

          navigate('/owner-dashboard?tab=Listing+Journey');
        }}
      />
    </div>
  );
}