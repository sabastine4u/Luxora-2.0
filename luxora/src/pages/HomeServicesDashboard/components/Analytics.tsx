import { useEffect, useMemo, useState } from 'react';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { EnterpriseExportMenu } from '../../../components/enterprise/EnterpriseExportMenu';
import { useToast } from '../../../contexts/ToastContext';
import {
  Sparkles,
  Star,
  CheckCircle2,
  Smile,
} from 'lucide-react';
import { homeServicesApi } from '../../../api/home-services.api';

interface AnalyticsData {
  summary: {
    mostRequested: {
      category: string;
      requests: number;
      percentage: number;
    } | null;
    averageProviderRating: number | null;
    requestCompletionRate: number | null;
    customerSatisfaction: number | null;
  };

  categoryDistribution: Array<{
    category: string;
    requests: number;
    percentage: number;
  }>;

  revenueTrends: Array<{
    period: string;
    revenue: number;
  }>;
}

export default function Analytics() {
  const { showToast } = useToast();

  const [analytics, setAnalytics] =
    useState<AnalyticsData | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);

      const response =
        await homeServicesApi.getAnalytics();

      setAnalytics(response.analytics);
    } catch (error) {
      console.error(
        'Failed to load Home Services analytics:',
        error,
      );

      showToast({
        title: 'Error',
        description:
          'Failed to load analytics data.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleExport = (format: string) => {
    showToast({
      title: 'Success',
      description: `Analytics report exported as ${format}`,
      type: 'success',
    });
  };

  const summary = analytics?.summary;

  const mostRequested =
    summary?.mostRequested;

  const averageProviderRating =
    summary?.averageProviderRating;

  const requestCompletionRate =
    summary?.requestCompletionRate;

  const customerSatisfaction =
    summary?.customerSatisfaction;

  /*
   * Highest request count is used to scale
   * the category bars.
   */
  const maxCategoryRequests =
    useMemo(() => {
      if (
        !analytics?.categoryDistribution?.length
      ) {
        return 0;
      }

      return Math.max(
        ...analytics.categoryDistribution.map(
          (item) => item.requests,
        ),
      );
    }, [analytics]);

  /*
   * Highest revenue is used to scale the
   * revenue chart.
   */
  const maxRevenue =
    useMemo(() => {
      if (
        !analytics?.revenueTrends?.length
      ) {
        return 0;
      }

      return Math.max(
        ...analytics.revenueTrends.map(
          (item) => item.revenue,
        ),
      );
    }, [analytics]);

  const formatCurrency = (value: number) =>
    `₦${value.toLocaleString('en-NG')}`;

  const formatPeriod = (period: string) => {
    const [year, month] =
      period.split('-');

    if (!year || !month) {
      return period;
    }

    const date = new Date(
      Number(year),
      Number(month) - 1,
      1,
    );

    return date.toLocaleDateString(
      'en-US',
      {
        month: 'short',
        year: 'numeric',
      },
    );
  };

  /*
   * Build points for the revenue SVG line.
   */
  const revenuePoints =
    useMemo(() => {
      const trends =
        analytics?.revenueTrends || [];

      if (!trends.length) {
        return [];
      }

      const chartWidth = 720;
      const chartHeight = 220;
      const leftPadding = 40;
      const rightPadding = 20;
      const topPadding = 20;
      const bottomPadding = 35;

      const usableWidth =
        chartWidth -
        leftPadding -
        rightPadding;

      const usableHeight =
        chartHeight -
        topPadding -
        bottomPadding;

      return trends.map(
        (item, index) => {
          const x =
            trends.length === 1
              ? leftPadding +
                usableWidth / 2
              : leftPadding +
                (index /
                  (trends.length - 1)) *
                  usableWidth;

          const normalized =
            maxRevenue > 0
              ? item.revenue /
                maxRevenue
              : 0;

          const y =
            topPadding +
            (1 - normalized) *
              usableHeight;

          return {
            x,
            y,
            value: item.revenue,
            period: item.period,
          };
        },
      );
    }, [analytics, maxRevenue]);

  const revenuePath =
    revenuePoints.length > 1
      ? revenuePoints
          .map(
            (point, index) =>
              `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`,
          )
          .join(' ')
      : '';

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">
            Service Intelligence
          </h2>

          <p className="text-sm text-ink/60">
            Performance metrics and service analytics.
          </p>
        </div>

        <EnterpriseExportMenu
          onExport={handleExport}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Most Requested"
          value={
            isLoading
              ? 'Loading...'
              : mostRequested?.category ||
                '—'
          }
          trend={
            isLoading
              ? ''
              : mostRequested
                ? `${mostRequested.percentage}% share`
                : ''
          }
          icon={Sparkles}
        />

        <KPICard
          title="Avg Provider Rating"
          value={
            isLoading
              ? 'Loading...'
              : averageProviderRating !==
                    null &&
                  averageProviderRating !==
                    undefined
                ? `${averageProviderRating.toFixed(1)}/5.0`
                : '—'
          }
          trend=""
          icon={Star}
        />

        <KPICard
          title="Request Completion Rate"
          value={
            isLoading
              ? 'Loading...'
              : requestCompletionRate !==
                    null &&
                  requestCompletionRate !==
                    undefined
                ? `${requestCompletionRate}%`
                : '—'
          }
          trend=""
          icon={CheckCircle2}
        />

        <KPICard
          title="Customer Satisfaction"
          value={
            isLoading
              ? 'Loading...'
              : customerSatisfaction !==
                    null &&
                  customerSatisfaction !==
                    undefined
                ? `${customerSatisfaction}%`
                : '—'
          }
          trend=""
          icon={Smile}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-navy-800/50 rounded-2xl border border-white/10 p-6 min-h-[300px]">
          <div className="mb-6">
            <h3 className="font-heading text-lg font-bold text-cream">
              Category Distribution
            </h3>

            <p className="text-sm text-ink/50 mt-1">
              Service requests by category.
            </p>
          </div>

          {isLoading ? (
            <div className="h-[210px] flex items-center justify-center">
              <p className="text-ink/60">
                Loading category analytics...
              </p>
            </div>
          ) : analytics?.categoryDistribution
              ?.length ? (
            <div className="space-y-5">
              {analytics.categoryDistribution.map(
                (item) => {
                  const width =
                    maxCategoryRequests > 0
                      ? Math.max(
                          (item.requests /
                            maxCategoryRequests) *
                            100,
                          6,
                        )
                      : 0;

                  return (
                    <div
                      key={item.category}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-cream">
                          {item.category}
                        </span>

                        <span className="text-sm text-ink/60">
                          {item.requests} request
                          {item.requests ===
                          1
                            ? ''
                            : 's'}{' '}
                          · {item.percentage}%
                        </span>
                      </div>

                      <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gold-400 transition-all duration-500"
                          style={{
                            width: `${width}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          ) : (
            <div className="h-[210px] flex items-center justify-center">
              <p className="text-ink/60">
                No category analytics available
              </p>
            </div>
          )}
        </div>

        {/* Revenue Trends */}
        <div className="bg-navy-800/50 rounded-2xl border border-white/10 p-6 min-h-[300px]">
          <div className="mb-6">
            <h3 className="font-heading text-lg font-bold text-cream">
              Revenue Trends
            </h3>

            <p className="text-sm text-ink/50 mt-1">
              Completed Home Services revenue by month.
            </p>
          </div>

          {isLoading ? (
            <div className="h-[220px] flex items-center justify-center">
              <p className="text-ink/60">
                Loading revenue analytics...
              </p>
            </div>
          ) : analytics?.revenueTrends
              ?.length ? (
            <div className="w-full">
              <div className="w-full overflow-x-auto">
                <svg
                  viewBox="0 0 720 220"
                  className="w-full min-w-[500px] h-[220px]"
                  role="img"
                  aria-label="Revenue trends chart"
                >
                  {/* Horizontal guides */}
                  <line
                    x1="40"
                    y1="20"
                    x2="700"
                    y2="20"
                    stroke="currentColor"
                    strokeOpacity="0.08"
                  />

                  <line
                    x1="40"
                    y1="102"
                    x2="700"
                    y2="102"
                    stroke="currentColor"
                    strokeOpacity="0.08"
                  />

                  <line
                    x1="40"
                    y1="185"
                    x2="700"
                    y2="185"
                    stroke="currentColor"
                    strokeOpacity="0.08"
                  />

                  {/* Baseline */}
                  <line
                    x1="40"
                    y1="185"
                    x2="700"
                    y2="185"
                    stroke="currentColor"
                    strokeOpacity="0.15"
                  />

                  {revenuePoints.length > 1 && (
                    <>
                      <path
                        d={revenuePath}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-gold-400"
                      />

                      {revenuePoints.map(
                        (point) => (
                          <circle
                            key={`${point.period}-${point.value}`}
                            cx={point.x}
                            cy={point.y}
                            r="5"
                            className="fill-gold-400"
                          />
                        ),
                      )}
                    </>
                  )}

                  {revenuePoints.length === 1 && (
                    <circle
                      cx={revenuePoints[0].x}
                      cy={revenuePoints[0].y}
                      r="7"
                      className="fill-gold-400"
                    />
                  )}

                  {revenuePoints.map(
                    (point) => (
                      <text
                        key={`label-${point.period}`}
                        x={point.x}
                        y="210"
                        textAnchor="middle"
                        className="fill-current text-[12px] text-ink/50"
                      >
                        {formatPeriod(
                          point.period,
                        )}
                      </text>
                    ),
                  )}
                </svg>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-ink/50">
                  Revenue
                </span>

                <span className="text-sm font-semibold text-cream">
                  {formatCurrency(
                    analytics.revenueTrends[
                      analytics.revenueTrends
                        .length - 1
                    ].revenue,
                  )}
                </span>
              </div>
            </div>
          ) : (
            <div className="h-[220px] flex items-center justify-center">
              <p className="text-ink/60">
                No revenue analytics available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}