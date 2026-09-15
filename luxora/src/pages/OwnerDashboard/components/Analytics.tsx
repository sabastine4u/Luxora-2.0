// Import hooks needed to load and manage real Owner analytics data.
import { useEffect, useState } from 'react';
import {
  Download,
  TrendingUp,
  Eye,
  Heart,
  Calendar,
  FileText,
  Clock,
  DollarSign,
  ArrowDown,
  Search,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { EmptyState } from '../../../components/layout/EmptyState';
import { useToast } from '../../../contexts/ToastContext';
import ExportModal from './modals/ExportModal';
// Import the real Owner analytics API.
import { analyticsApi } from '../../../api/analytics.api';

export default function Analytics() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Control the analytics export modal.
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Store the real analytics response returned by the backend.
  const [analytics, setAnalytics] = useState<any | null>(null);

  // Track whether Owner analytics are still loading.
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);

  // Load the authenticated Owner's real analytics from the backend.
  useEffect(() => {
    const loadOwnerAnalytics = async () => {
      try {
        // Request aggregated analytics for the authenticated Owner.
        const response = await analyticsApi.getOwnerAnalytics();

        // Read the analytics object from the backend response envelope.
        const backendAnalytics =
          response.data?.data?.analytics ??
          response.data?.analytics ??
          null;

        // Store the real analytics payload for the dashboard.
        setAnalytics(backendAnalytics);
      } catch (error) {
        // Keep the dashboard usable when the analytics request fails.
        console.error('Failed to load Owner analytics:', error);

        showToast({
          type: 'error',
          title: 'Analytics could not be loaded',
          description: 'We could not retrieve your property analytics.',
        });
      } finally {
        // Stop the loading state after the request finishes.
        setIsLoadingAnalytics(false);
      }
    };

    void loadOwnerAnalytics();
  }, [showToast]);

  // Read the real Owner analytics metrics with safe fallbacks.
  const metrics = analytics?.metrics ?? {};

  // Read the real property performance records returned by the backend.
  const topProperties = analytics?.topProperties ?? [];

 // Read the real daily Property view history returned by the backend.
const dailyPropertyViews: any[] = analytics?.dailyPropertyViews ?? [];

  // Create a lookup map so each calendar date can be read quickly.
  const dailyViewMap = new Map(
    dailyPropertyViews.map((item: any) => [item.date, item.views ?? 0])
  );

  // Build a continuous 30-day series from the real backend view events.
  const viewTrendData = Array.from({ length: 30 }, (_, index) => {
    const date = new Date();

    // Calculate each day starting from 29 days ago through today.
    date.setDate(date.getDate() - (29 - index));

    // Convert the date to the same YYYY-MM-DD format returned by the backend.
    const dateKey = date.toISOString().slice(0, 10);

    return {
      date: dateKey,
      views: dailyViewMap.get(dateKey) ?? 0,
    };
  });

  // Find the highest daily view count for proportional chart bars.
  const maxViews = Math.max(
    ...viewTrendData.map((item: any) => item.views),
    1
  );

  // Calculate the total views represented by the 30-day chart.
  const trendTotalViews = viewTrendData.reduce(
    (total: number, item: any) => total + item.views,
    0
  );

  // Calculate the total number of offers from the real property analytics.
  const totalOffers = topProperties.reduce(
    (total: number, property: any) => total + (property.offers ?? 0),
    0
  );

  // Build the conversion funnel using only real analytics metrics.
  const funnelStages = [
    {
      stage: 'Views',
      value: String(metrics.totalPropertyViews ?? 0),
      dropoff: '—',
    },
    {
      stage: 'Saves',
      value: String(metrics.totalFavorites ?? 0),
      dropoff: '—',
    },
    {
      stage: 'Viewing Requests',
      value: String(metrics.totalViewings ?? 0),
      dropoff:
        (metrics.totalFavorites ?? 0) > 0
          ? `${(
            (metrics.totalViewings / metrics.totalFavorites) *
            100
          ).toFixed(1)}%`
          : '—',
    },
    {
      stage: 'Offers',
      value: String(totalOffers),
      dropoff:
        (metrics.totalViewings ?? 0) > 0
          ? `${((totalOffers / metrics.totalViewings) * 100).toFixed(1)}%`
          : '—',
    },
    {
      stage: 'Accepted Offers',
      value: String(metrics.acceptedOffers ?? 0),
      dropoff:
        totalOffers > 0
          ? `${(
            ((metrics.acceptedOffers ?? 0) / totalOffers) *
            100
          ).toFixed(1)}%`
          : '—',
    },
    {
      stage: 'Completed Sales',
      value: '—',
      dropoff: '—',
    },
  ];

  // Handle analytics report export actions.
  const handleExport = (format: string) => {
    showToast({
      type: 'success',
      title: 'Export Started',
      description: `Your report is being exported as ${format.toUpperCase()}.`,
    });

    setIsExportModalOpen(false);
  };

  // Show the empty state only after the real analytics request finishes.
  if (!isLoadingAnalytics && !analytics) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={<TrendingUp className="h-8 w-8 text-gold-400" />}
          title="No analytics available."
          description="You do not have any active properties generating data."
          actionLabel="View Listings"
          onAction={() => navigate('/owner-dashboard?tab=Listing+Journey')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">
            Property Analytics
          </h2>
          <p className="text-sm text-ink/60">
            Track the performance of your listings, engagement, and business
            growth.
          </p>
        </div>

        <div className="flex gap-3">
          <GhostButton onClick={() => setIsExportModalOpen(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </GhostButton>

          <GoldButton onClick={() => setIsExportModalOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </GoldButton>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          {
            label: 'Total Property Views',
            value: String(metrics.totalPropertyViews ?? 0),
            delta: '',
            icon: Eye,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
          },
          {
            label: 'Total Saves',
            value: String(metrics.totalFavorites ?? 0),
            delta: '',
            icon: Heart,
            color: 'text-rose-400',
            bg: 'bg-rose-400/10',
          },
          {
            label: 'Viewing Requests',
            value: String(metrics.totalViewings ?? 0),
            delta: '',
            icon: Calendar,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
          },
          {
            label: 'Active Offers',
            value: String(metrics.activeOffers ?? 0),
            delta: '',
            icon: FileText,
            color: 'text-gold-400',
            bg: 'bg-gold-400/10',
          },
          {
            label: 'Conversion Rate',
            value: `${metrics.offerConversionRate ?? 0}%`,
            delta: '',
            icon: TrendingUp,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
          },
          {
            label: 'Avg. Time on Market',
            value: '—',
            delta: '',
            icon: Clock,
            color: 'text-orange-400',
            bg: 'bg-orange-400/10',
          },
        ].map((stat, i) => (
          <KPICard
            key={i}
            title={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={stat.delta || undefined}
            trendColor={stat.color}
            iconColor={stat.color}
            backgroundColor={stat.bg}
            hoverEffect="none"
            iconBorder={true}
            valueTypography="heading"
            labelTypography="uppercase-small"
            trendPosition="inline-label-top"
          />
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Property Activity */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-lg font-semibold text-cream">
              Property Activity
            </h3>

            <span className="text-xs text-ink/50 px-2 py-1 bg-navy-900 rounded-md border border-white/5">
              Real-time
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {/* Show the real Property view count from Owner analytics. */}
            <div className="rounded-xl bg-navy-900 border border-white/5 p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {metrics.totalPropertyViews ?? 0}
              </div>
              <div className="text-[10px] text-ink/50 uppercase mt-1">
                Views
              </div>
            </div>

            {/* Show the real Property save count from Owner analytics. */}
            <div className="rounded-xl bg-navy-900 border border-white/5 p-4 text-center">
              <div className="text-2xl font-bold text-rose-400">
                {metrics.totalFavorites ?? 0}
              </div>
              <div className="text-[10px] text-ink/50 uppercase mt-1">
                Saves
              </div>
            </div>

            {/* Show the real viewing request count from Owner analytics. */}
            <div className="rounded-xl bg-navy-900 border border-white/5 p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">
                {metrics.totalViewings ?? 0}
              </div>
              <div className="text-[10px] text-ink/50 uppercase mt-1">
                Viewing Requests
              </div>
            </div>

            {/* Show the real active offer count from Owner analytics. */}
            <div className="rounded-xl bg-navy-900 border border-white/5 p-4 text-center">
              <div className="text-2xl font-bold text-gold-400">
                {metrics.activeOffers ?? 0}
              </div>
              <div className="text-[10px] text-ink/50 uppercase mt-1">
                Active Offers
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-navy-900/60 border border-white/5">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-blue-400" />

              <div>
                <div className="text-sm font-semibold text-cream">
                  Property views are being tracked
                </div>

                <div className="text-xs text-ink/50 mt-1">
                  Real property view events are now being recorded for your
                  listings.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Summary */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-lg font-semibold text-cream">
              Engagement Summary
            </h3>

            <span className="text-xs text-ink/50 px-2 py-1 bg-navy-900 rounded-md border border-white/5">
              Real data
            </span>
          </div>

          <div className="space-y-4">
            {/* Show the real Property view count from Owner analytics. */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-navy-900 border border-white/5">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-blue-400" />

                <span className="text-sm font-semibold text-cream">
                  Property Views
                </span>
              </div>

              <span className="font-bold text-blue-400">
                {metrics.totalPropertyViews ?? 0}
              </span>
            </div>

            {/* Show the real Property save count from Owner analytics. */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-navy-900 border border-white/5">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-rose-400" />

                <span className="text-sm font-semibold text-cream">
                  Property Saves
                </span>
              </div>

              <span className="font-bold text-rose-400">
                {metrics.totalFavorites ?? 0}
              </span>
            </div>

            {/* Show the real viewing request count from Owner analytics. */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-navy-900 border border-white/5">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-emerald-400" />

                <span className="text-sm font-semibold text-cream">
                  Viewing Requests
                </span>
              </div>

              <span className="font-bold text-emerald-400">
                {metrics.totalViewings ?? 0}
              </span>
            </div>

            {/* Show the real total offer count from the Owner's properties. */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-navy-900 border border-white/5">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gold-400" />

                <span className="text-sm font-semibold text-cream">
                  Total Offers
                </span>
              </div>

              <span className="font-bold text-gold-400">
                {totalOffers}
              </span>
            </div>

            {/* Show the real offer conversion rate from Owner analytics. */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-navy-900 border border-white/5">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-purple-400" />

                <span className="text-sm font-semibold text-cream">
                  Offer Conversion
                </span>
              </div>

              <span className="font-bold text-purple-400">
                {metrics.offerConversionRate ?? 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Views Over Time */}
      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-heading text-lg font-bold text-cream">
              Views Over Time
            </h3>
            <p className="text-xs text-ink/50 mt-1">
              Real Property detail-page views over the last 30 days.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-ink/50">
            <Eye className="h-4 w-4 text-blue-400" />
           <span>
  {trendTotalViews} views in 30 days
</span>
          </div>
        </div>

        <div className="h-56 flex items-end gap-1">
          {viewTrendData.map((item) => {
            // Calculate the current bar height from the shared maximum.
            const height =
              item.views > 0
                ? `${Math.max((item.views / maxViews) * 100, 6)}%`
                : '2%';

            return (
              <div
                key={item.date}
                className="flex-1 h-full flex items-end"
                title={`${item.date}: ${item.views} view${item.views === 1 ? '' : 's'}`}
              >
                <div
                  className="w-full rounded-t-md bg-blue-400/70 hover:bg-blue-400 transition-colors"
                  style={{ height }}
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-between mt-3 text-[10px] text-ink/40">
          <span>{viewTrendData[0]?.date ?? '—'}</span>
          <span>{viewTrendData[viewTrendData.length - 1]?.date ?? '—'}</span>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Top Properties & Market Perf */}
        <div className="lg:col-span-2 space-y-8">

          {/* Top Performing Properties */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="font-heading text-lg font-bold text-cream">
                Top Performing Properties
              </h3>
            </div>

            <div className="w-full">
             <DataTable<any>
                // Display the real property performance records returned by the backend.
                data={topProperties}
                // Use the real MongoDB property ID as the row key.
                keyExtractor={(prop) => prop.propertyId}
                columns={[
                  {
                    header: 'Property',
                    render: (prop) => (
                      <span className="font-medium text-cream">
                        {prop.title || 'Property'}
                      </span>
                    ),
                  },
                  {
                    header: 'Views',
                    render: (prop) => (
                      <span className="text-ink/60">
                        {prop.views ?? 0}
                      </span>
                    ),
                  },
                  {
                    header: 'Saves',
                    render: (prop) => (
                      <span className="text-ink/60">
                        {prop.favorites ?? 0}
                      </span>
                    ),
                  },
                  {
                    header: 'Viewing Reqs',
                    render: (prop) => (
                      <span className="text-ink/60">
                        {prop.viewings ?? 0}
                      </span>
                    ),
                  },
                  {
                    header: 'Offers',
                    render: (prop) => (
                      <span className="text-ink/60">
                        {prop.offers ?? 0}
                      </span>
                    ),
                  },
                  {
                    header: <div className="text-right">Accepted</div>,
                    className: 'text-right',
                    render: (prop) => (
                      <span className="font-bold text-gold-400">
                        {prop.acceptedOffers ?? 0}
                      </span>
                    ),
                  },
                ]}
              />
            </div>
          </div>

          {/* Listing Health */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="font-heading text-lg font-bold text-cream">
                Listing Health
              </h3>
            </div>

            <div className="w-full">
              <DataTable<any>
                // Display the real Owner properties returned through analytics.
                data={topProperties}
                // Use the MongoDB property ID as the unique row key.
                keyExtractor={(property) => property.propertyId}
                columns={[
                  {
                    header: 'Property',
                    render: (property) => (
                      <span className="font-medium text-cream truncate max-w-[150px]">
                        {property.title || 'Property'}
                      </span>
                    ),
                  },
                  {
                    header: 'Status',
                    render: (property) => (
                      <span className="text-ink/60">
                        {property.status || '—'}
                      </span>
                    ),
                  },
                  {
                    header: "Activity",
                    render: (property) => (
                      <span className="text-ink/60">
                        {(property.views ?? 0) +
                          (property.favorites ?? 0) +
                          (property.viewings ?? 0) +
                          (property.offers ?? 0)} interactions
                      </span>
                    )
                  },
                  {
                    header: 'Favorites',
                    render: (property) => (
                      <span className="text-ink/60">
                        {property.favorites ?? 0}
                      </span>
                    ),
                  },
                  {
                    header: 'Viewing Reqs',
                    render: (property) => (
                      <span className="text-ink/60">
                        {property.viewings ?? 0}
                      </span>
                    ),
                  },
                  {
                    header: <div className="text-right">Offers</div>,
                    className: 'text-right',
                    render: (property) => (
                      <span className="font-bold text-gold-400">
                        {property.offers ?? 0}
                      </span>
                    ),
                  },
                ]}
              />
            </div>
          </div>

          {/* Portfolio Performance */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-6">
              Portfolio Performance
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-4 rounded-xl bg-navy-900 border border-white/5 flex flex-col items-center justify-center text-center">
                <TrendingUp className="h-5 w-5 text-gold-400 mb-2" />

                <div className="font-bold text-cream text-lg">
                  {metrics.totalProperties ?? 0}
                </div>

                <div className="text-[10px] text-ink/50 uppercase mt-1">
                  Total Properties
                </div>
              </div>

              <div className="p-4 rounded-xl bg-navy-900 border border-white/5 flex flex-col items-center justify-center text-center">
                <Search className="h-5 w-5 text-gold-400 mb-2" />

                <div className="font-bold text-cream text-lg">
                  {metrics.publishedProperties ?? 0}
                </div>

                <div className="text-[10px] text-ink/50 uppercase mt-1">
                  Published
                </div>
              </div>

              <div className="p-4 rounded-xl bg-navy-900 border border-white/5 flex flex-col items-center justify-center text-center">
                {/* Show the real Property view count from Owner analytics. */}
                <Eye className="h-5 w-5 text-blue-400 mb-2" />
                <div className="font-bold text-cream text-lg">
                  {metrics.totalPropertyViews ?? 0}
                </div>
                <div className="text-[10px] text-ink/50 uppercase mt-1">
                  Property Views
                </div>
              </div>

              <div className="p-4 rounded-xl bg-navy-900 border border-white/5 flex flex-col items-center justify-center text-center">
                <FileText className="h-5 w-5 text-gold-400 mb-2" />

                <div className="font-bold text-cream text-lg">
                  {metrics.acceptedOffers ?? 0}
                </div>

                <div className="text-[10px] text-ink/50 uppercase mt-1">
                  Accepted Offers
                </div>
              </div>

              <div className="p-4 rounded-xl bg-navy-900 border border-white/5 flex flex-col items-center justify-center text-center">
                <DollarSign className="h-5 w-5 text-gold-400 mb-2" />

                <div className="font-bold text-cream text-lg">
                  ₦{((metrics.rentalIncomeYTD ?? 0) / 1000000).toFixed(1)}M
                </div>

                <div className="text-[10px] text-ink/50 uppercase mt-1">
                  Rental Income YTD
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Conversion Funnel & Revenue Insights */}
        <div className="space-y-8">

          {/* Conversion Funnel */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-6">
              Conversion Funnel
            </h3>

            <div className="space-y-2 relative">
              {funnelStages.map((stage, i) => (
                <div
                  key={i}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div className="w-full flex items-center justify-between p-3 rounded-xl bg-navy-900 border border-white/5">
                    <span className="text-sm font-semibold text-cream">
                      {stage.stage}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gold-400">
                        {stage.value}
                      </span>

                      <span className="text-[10px] text-ink/50 w-10 text-right">
                        {stage.dropoff}
                      </span>
                    </div>
                  </div>

                  {i < funnelStages.length - 1 && (
                    <div className="h-6 flex items-center justify-center text-ink/20">
                      <ArrowDown className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Insights */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-6">
              Revenue Insights
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-navy-900 border border-white/5">
                <span className="text-sm font-semibold text-cream">
                  Rental Revenue (YTD)
                </span>

                <span className="font-bold text-lg text-emerald-400">
                  ₦{((metrics.rentalIncomeYTD ?? 0) / 1000000).toFixed(1)}M
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-navy-900 border border-white/5">
                <span className="text-sm font-semibold text-cream">
                  Total Rental Revenue
                </span>

                <span className="font-bold text-lg text-gold-400">
                  ₦{((metrics.totalRentalIncome ?? 0) / 1000000).toFixed(1)}M
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-navy-900 border border-white/5">
                <span className="text-sm font-semibold text-cream">
                  Sales Revenue
                </span>

                <span className="font-bold text-lg text-blue-400">
                  —
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-navy-900 border border-white/5">
                <span className="text-sm font-semibold text-cream">
                  Expected Revenue
                </span>

                <span className="font-bold text-lg text-blue-400">
                  —
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-navy-900 border border-white/5">
                <span className="text-sm font-semibold text-cream">
                  Lost Revenue
                </span>

                <span className="font-bold text-lg text-rose-400">
                  —
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        title="Export Analytics Report"
      />
    </div>
  );
}