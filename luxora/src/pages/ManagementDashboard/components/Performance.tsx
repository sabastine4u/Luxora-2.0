import { useEffect, useMemo, useState } from 'react';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Activity,
  Building2,
  CircleDollarSign,
  HandCoins,
  Users,
  MessageSquareWarning,
  Eye,
  FileText,
  CheckCircle2,
} from 'lucide-react';

import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { managementApi } from '../../../api/management.api';

interface PerformanceSummary {
  totalProperties: number;
  liveProperties: number;
  finalizedProperties: number;

  totalOffers: number;
  acceptedOffers: number;

  totalInquiries: number;
  totalViewings: number;

  closedDealValue: number;

  commissionPool: number;
  agencyCommission: number;
  recordedCommissionDeals: number;

  activeTeamMembers: number;
  inactiveTeamMembers: number;

  complaintResolutionRate: number | null;
}

interface PerformanceFunnel {
  inquiries: number;
  viewings: number;
  offers: number;
  closedDeals: number;
  acceptedOffers: number;

  offerAcceptanceRate: number | null;
  closingRate: number | null;
}

interface PropertyDistributionItem {
  _id: string;
  count: number;
}

interface MonthlyTrendItem {
  month: string;
  year: number;

  dealValue: number;
  commissionPool: number;
  agencyAmount: number;
  deals: number;
}

interface ServiceHealth {
  totalComplaints: number;
  resolvedComplaints: number;
  complaintResolutionRate: number | null;
}

interface ManagementPerformanceData {
  summary: PerformanceSummary;
  funnel: PerformanceFunnel;
  propertyDistribution: PropertyDistributionItem[];
  monthlyTrend: MonthlyTrendItem[];
  serviceHealth: ServiceHealth;
}

const formatCurrency = (
  value: number,
  maximumFractionDigits = 0,
) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-NG').format(value);
};

export default function Performance() {
  const [performance, setPerformance] =
    useState<ManagementPerformanceData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPerformance = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response =
          await managementApi.getPerformance();

        /*
         * The Manager Performance controller returns:
         *
         * {
         *   success: true,
         *   message: "...",
         *   data: {...}
         * }
         *
         * Depending on the current http helper's unwrap behavior,
         * support both shapes safely.
         */
        const payload =
          response?.data ?? response;

        setPerformance(payload);
      } catch (err) {
        console.error(
          'Failed to load management performance:',
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load management performance.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadPerformance();
  }, []);

  const summary = performance?.summary;
  const funnel = performance?.funnel;
  const serviceHealth = performance?.serviceHealth;

  const propertyDistribution =
    performance?.propertyDistribution ?? [];

  const monthlyTrend =
    performance?.monthlyTrend ?? [];

  const maxMonthlyDealValue = useMemo(() => {
    if (!monthlyTrend.length) return 0;

    return Math.max(
      ...monthlyTrend.map(
        (item) => item.dealValue,
      ),
    );
  }, [monthlyTrend]);

  const maxPropertyCount = useMemo(() => {
    if (!propertyDistribution.length) {
      return 1;
    }

    return Math.max(
      ...propertyDistribution.map(
        (item) => item.count,
      ),
      1,
    );
  }, [propertyDistribution]);

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Enterprise Performance"
        subtitle="Monitor real enterprise transactions, portfolio activity, service health, and workforce capacity."
        actions={<div className="flex gap-3" />}
      />

      {error && (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-rose-400" />

            <div>
              <p className="text-sm font-semibold text-cream">
                Unable to load performance data
              </p>

              <p className="mt-1 text-xs text-ink/60">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Executive KPIs */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Closed Deal Value"
          value={
            isLoading
              ? '—'
              : formatCurrency(
                  summary?.closedDealValue ?? 0,
                )
          }
          trend={
            isLoading
              ? 'Loading...'
              : `${summary?.finalizedProperties ?? 0} finalized deal${
                  (summary?.finalizedProperties ?? 0) === 1
                    ? ''
                    : 's'
                }`
          }
          trendColor="text-emerald-400"
          icon={CircleDollarSign}
          footer={
            <div className="text-xs text-ink/60">
              Finalized transaction value
            </div>
          }
        />

        <KPICard
          title="Agency Commission"
          value={
            isLoading
              ? '—'
              : formatCurrency(
                  summary?.agencyCommission ?? 0,
                )
          }
          trend={
            isLoading
              ? 'Loading...'
              : `${summary?.recordedCommissionDeals ?? 0} recorded deal${
                  (summary?.recordedCommissionDeals ?? 0) === 1
                    ? ''
                    : 's'
                }`
          }
          trendColor="text-gold-400"
          icon={HandCoins}
          footer={
            <div className="text-xs text-ink/60">
              Commission attributed to Luxora
            </div>
          }
        />

        <KPICard
          title="Live Properties"
          value={
            isLoading
              ? '—'
              : String(
                  summary?.liveProperties ?? 0,
                )
          }
          trend={
            isLoading
              ? 'Loading...'
              : `${summary?.totalProperties ?? 0} total properties`
          }
          trendColor="text-blue-400"
          icon={Building2}
          footer={
            <div className="text-xs text-ink/60">
              Published and under-offer inventory
            </div>
          }
        />

        <KPICard
          title="Team Capacity"
          value={
            isLoading
              ? '—'
              : String(
                  summary?.activeTeamMembers ?? 0,
                )
          }
          trend={
            isLoading
              ? 'Loading...'
              : `${summary?.inactiveTeamMembers ?? 0} inactive`
          }
          trendColor={
            (summary?.inactiveTeamMembers ?? 0) > 0
              ? 'text-yellow-400'
              : 'text-emerald-400'
          }
          icon={Users}
          footer={
            <div className="text-xs text-ink/60">
              Active operational staff
            </div>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left side */}
        <div className="space-y-6 lg:col-span-2">
          {/* Performance Snapshot */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-gold-400/20 bg-gold-400/10 text-gold-400">
                <TrendingUp className="h-10 w-10" />
              </div>

              <div className="flex-1">
                <h3 className="mb-2 font-heading text-lg font-bold text-cream">
                  Enterprise Performance Snapshot
                </h3>

                <p className="text-sm leading-relaxed text-ink/70">
                  The current enterprise pipeline contains{' '}
                  <span className="font-semibold text-cream">
                    {isLoading
                      ? '—'
                      : formatNumber(
                          summary?.totalOffers ?? 0,
                        )}
                  </span>{' '}
                  offers and{' '}
                  <span className="font-semibold text-cream">
                    {isLoading
                      ? '—'
                      : formatNumber(
                          summary?.finalizedProperties ?? 0,
                        )}
                  </span>{' '}
                  finalized transaction
                  {(
                    summary?.finalizedProperties ?? 0
                  ) === 1
                    ? ''
                    : 's'}
                  . The current recorded closed value is{' '}
                  <span className="font-semibold text-gold-400">
                    {isLoading
                      ? '—'
                      : formatCurrency(
                          summary?.closedDealValue ?? 0,
                        )}
                  </span>
                  .
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                    {isLoading
                      ? '—'
                      : `${summary?.acceptedOffers ?? 0} accepted offer${
                          (summary?.acceptedOffers ?? 0) === 1
                            ? ''
                            : 's'
                        }`}
                  </span>

                  <span className="rounded-full bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-400">
                    {isLoading
                      ? '—'
                      : `${summary?.totalViewings ?? 0} viewing${
                          (summary?.totalViewings ?? 0) === 1
                            ? ''
                            : 's'
                        }`}
                  </span>

                  <span className="rounded-full bg-gold-400/10 px-3 py-1 text-xs font-semibold text-gold-400">
                    {isLoading
                      ? '—'
                      : `${summary?.totalInquiries ?? 0} inquir${
                          (summary?.totalInquiries ?? 0) === 1
                            ? 'y'
                            : 'ies'
                        }`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise Funnel */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-semibold text-cream">
                  Enterprise Transaction Funnel
                </h3>

                <p className="mt-1 text-xs text-ink/50">
                  Real activity recorded across the platform.
                </p>
              </div>

              <Activity className="h-5 w-5 text-gold-400" />
            </div>

            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-5">
                {Array.from({ length: 5 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="h-24 animate-pulse rounded-xl bg-navy-900/50"
                    />
                  ),
                )}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-5">
                {[
                  {
                    label: 'Inquiries',
                    value: funnel?.inquiries ?? 0,
                    icon: MessageSquareWarning,
                    valueClass: 'text-blue-400',
                  },
                  {
                    label: 'Viewings',
                    value: funnel?.viewings ?? 0,
                    icon: Eye,
                    valueClass: 'text-purple-400',
                  },
                  {
                    label: 'Offers',
                    value: funnel?.offers ?? 0,
                    icon: FileText,
                    valueClass: 'text-gold-400',
                  },
                  {
                    label: 'Accepted',
                    value:
                      funnel?.acceptedOffers ?? 0,
                    icon: CheckCircle2,
                    valueClass: 'text-emerald-400',
                  },
                  {
                    label: 'Closed Deals',
                    value:
                      funnel?.closedDeals ?? 0,
                    icon: Award,
                    valueClass: 'text-cream',
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-xl border border-white/5 bg-navy-900/50 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs text-ink/50">
                          {item.label}
                        </span>

                        <Icon
                          className={`h-4 w-4 ${item.valueClass}`}
                        />
                      </div>

                      <div
                        className={`text-2xl font-bold ${item.valueClass}`}
                      >
                        {formatNumber(item.value)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!isLoading && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ink/60">
                      Offer Acceptance Rate
                    </span>

                    <span className="text-sm font-bold text-emerald-400">
                      {funnel?.offerAcceptanceRate ===
                      null
                        ? '—'
                        : `${funnel?.offerAcceptanceRate}%`}
                    </span>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-navy-950">
                    <div
                      className="h-full bg-emerald-400"
                      style={{
                        width: `${Math.min(
                          funnel?.offerAcceptanceRate ??
                            0,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ink/60">
                      Offer → Closed Rate
                    </span>

                    <span className="text-sm font-bold text-gold-400">
                      {funnel?.closingRate ===
                      null
                        ? '—'
                        : `${funnel?.closingRate}%`}
                    </span>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-navy-950">
                    <div
                      className="h-full bg-gold-400"
                      style={{
                        width: `${Math.min(
                          funnel?.closingRate ??
                            0,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Six Month Trend */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-semibold text-cream">
                  Six-Month Transaction Trend
                </h3>

                <p className="mt-1 text-xs text-ink/50">
                  Recorded deal value and completed transaction count.
                </p>
              </div>

              <CircleDollarSign className="h-5 w-5 text-gold-400" />
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="h-10 animate-pulse rounded-lg bg-navy-900/50"
                    />
                  ),
                )}
              </div>
            ) : monthlyTrend.length === 0 ? (
              <div className="py-10 text-center text-sm text-ink/50">
                No transaction trend data available.
              </div>
            ) : (
              <div className="space-y-4">
                {monthlyTrend.map((month) => {
                  const width =
                    maxMonthlyDealValue > 0
                      ? (month.dealValue /
                          maxMonthlyDealValue) *
                        100
                      : 0;

                  return (
                    <div
                      key={`${month.month}-${month.year}`}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="w-16 shrink-0">
                          <span className="text-xs font-medium text-cream">
                            {month.month}
                          </span>

                          <span className="ml-1 text-[10px] text-ink/40">
                            {month.year}
                          </span>
                        </div>

                        <div className="flex-1">
                          <div className="h-2 overflow-hidden rounded-full bg-navy-950">
                            <div
                              className="h-full rounded-full bg-gold-400 transition-all"
                              style={{
                                width: `${width}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="w-32 text-right">
                          <div className="text-xs font-semibold text-cream">
                            {formatCurrency(
                              month.dealValue,
                            )}
                          </div>

                          <div className="text-[10px] text-ink/40">
                            {month.deals}{' '}
                            {month.deals === 1
                              ? 'deal'
                              : 'deals'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Portfolio Distribution */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-semibold text-cream">
                  Portfolio Distribution
                </h3>

                <p className="mt-1 text-xs text-ink/50">
                  Current property statuses.
                </p>
              </div>

              <Building2 className="h-5 w-5 text-gold-400" />
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="space-y-2 animate-pulse"
                    >
                      <div className="h-3 w-1/2 rounded bg-navy-700" />
                      <div className="h-1.5 rounded bg-navy-700" />
                    </div>
                  ),
                )}
              </div>
            ) : propertyDistribution.length === 0 ? (
              <div className="py-8 text-center text-sm text-ink/50">
                No property distribution data available.
              </div>
            ) : (
              <div className="space-y-4">
                {propertyDistribution.map(
                  (item) => {
                    const percentage =
                      summary &&
                      summary.totalProperties > 0
                        ? Math.round(
                            (item.count /
                              summary.totalProperties) *
                              100,
                          )
                        : 0;

                    return (
                      <div
                        key={item._id}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="capitalize text-ink/60">
                            {item._id}
                          </span>

                          <span className="font-semibold text-cream">
                            {item.count}
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-navy-950">
                          <div
                            className="h-full bg-blue-400"
                            style={{
                              width: `${Math.min(
                                percentage,
                                100,
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </div>

          {/* Service Health */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <MessageSquareWarning className="h-5 w-5 text-gold-400" />

              <h3 className="font-heading text-lg font-semibold text-cream">
                Service Health
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg p-2 hover:bg-white/5">
                <span className="text-sm text-ink/70">
                  Total Complaints
                </span>

                <span className="text-sm font-semibold text-cream">
                  {isLoading
                    ? '—'
                    : formatNumber(
                        serviceHealth?.totalComplaints ??
                          0,
                      )}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg p-2 hover:bg-white/5">
                <span className="text-sm text-ink/70">
                  Resolved
                </span>

                <span className="text-sm font-semibold text-emerald-400">
                  {isLoading
                    ? '—'
                    : formatNumber(
                        serviceHealth?.resolvedComplaints ??
                          0,
                      )}
                </span>
              </div>

              <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink/60">
                    Resolution Rate
                  </span>

                  <span className="text-lg font-bold text-emerald-400">
                    {isLoading
                      ? '—'
                      : serviceHealth?.complaintResolutionRate ===
                        null
                      ? '—'
                      : `${serviceHealth?.complaintResolutionRate}%`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Workforce Status */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />

              <h3 className="font-heading text-lg font-semibold text-cream">
                Workforce Status
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-navy-900/50 p-3">
                <span className="text-xs text-ink/60">
                  Active Staff
                </span>

                <span className="text-sm font-bold text-emerald-400">
                  {isLoading
                    ? '—'
                    : summary?.activeTeamMembers ??
                      0}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-navy-900/50 p-3">
                <span className="text-xs text-ink/60">
                  Inactive Staff
                </span>

                <span className="text-sm font-bold text-rose-400">
                  {isLoading
                    ? '—'
                    : summary?.inactiveTeamMembers ??
                      0}
                </span>
              </div>
            </div>
          </div>

          {/* Commission Snapshot */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <HandCoins className="h-5 w-5 text-gold-400" />

              <h3 className="font-heading text-lg font-semibold text-cream">
                Commission Snapshot
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <p className="mb-1 text-xs text-ink/40">
                  Commission Pool
                </p>

                <p className="text-lg font-bold text-cream">
                  {isLoading
                    ? '—'
                    : formatCurrency(
                        summary?.commissionPool ??
                          0,
                      )}
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs text-ink/40">
                  Agency Commission
                </p>

                <p className="text-lg font-bold text-gold-400">
                  {isLoading
                    ? '—'
                    : formatCurrency(
                        summary?.agencyCommission ??
                          0,
                      )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}