import { useEffect, useMemo, useState } from 'react';
import {
  TrendingUp,
  Target,
  Building2,
  Activity,
  Star,
  DollarSign,
  ArrowUpRight,
  PieChart,
} from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { GhostButton } from '../../../components/ui/ui';
import { propertyApi } from '../../../api/property.api';

type PerformanceData = {
  summary: {
    closedDealValue: number;
    closedDeals: number;
    listingConversion: number | null;
    growthRate: number | null;
    marketShare: number | null;
  };

  funnel: {
    inquiries: number;
    viewings: number;
    offers: number;
    closedDeals: number;
    conversionRate: number | null;
  };

  revenueDistribution: Array<{
    label: string;
    value: number;
    percentage: number;
  }>;

  monthlyTrend: Array<{
    month: string;
    year: number;
    value: number;
  }>;

  agentLeaderboard: Array<{
    id: string;
    name: string;
    department: string | null;
    level: string | null;
    status: string;
    closedDeals: number;
    dealValue: number;
    performanceScore: number | null;
    trend: string | null;
  }>;

  recentConversions: Array<{
    id: string;
    date: string;
    amount: number;
    status: string;
    agent: string;
    property: string;
    dealValue: number;
  }>;

  departmentRoi: Array<{
    department: string;
    roi: number;
    value: number;
  }>;
};

// Format a numeric value as Nigerian Naira.
const formatCurrency = (value: number) =>
  `₦${new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 0,
  }).format(Number(value || 0))}`;

// Safely unwrap the response returned by the shared HTTP client.
const unwrapPerformanceResponse = (
  response: any,
): PerformanceData | null => {
  return (
    response?.data?.performance ||
    response?.performance ||
    null
  );
};

export default function Performance() {
  const [performance, setPerformance] =
    useState<PerformanceData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Load the Agency's real Performance analytics.
  const loadPerformance = async () => {
    try {
      setIsLoading(true);
      setLoadError('');

      // Request the real Agency Performance dataset from the backend.
      const response =
        await propertyApi.getAgencyPerformance();

      console.log(
        'Agency performance response:',
        response,
      );

      // Extract the Performance payload after the shared HTTP
      // client has removed the outer success envelope.
      const data =
        unwrapPerformanceResponse(response);

      if (!data) {
        throw new Error(
          'Performance endpoint returned an unexpected response.',
        );
      }

      setPerformance(data);
    } catch (error: any) {
      console.error(
        'Failed to load Agency Performance data:',
        error,
      );

      setPerformance(null);

      setLoadError(
        error?.message ||
          'Unable to load Agency Performance data.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Load real Performance information when the page opens.
  useEffect(() => {
    loadPerformance();
  }, []);

  // Find the largest monthly value for proportional chart heights.
  const maxMonthlyValue = useMemo(() => {
    if (!performance?.monthlyTrend?.length) {
      return 0;
    }

    return Math.max(
      ...performance.monthlyTrend.map(
        (item) => Number(item.value || 0),
      ),
    );
  }, [performance]);

  // Convert real recent conversions into ActivityTimeline records.
  const recentConversionTimeline = useMemo(() => {
    if (!performance?.recentConversions?.length) {
      return [];
    }

    return performance.recentConversions.map(
      (conversion) => ({
        title: conversion.property,
        time: new Date(
          conversion.date,
        ).toLocaleDateString('en-NG', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        desc: `${formatCurrency(
          Number(conversion.dealValue || 0),
        )} • ${conversion.agent}`,
        icon: Building2,
        color: 'text-emerald-400',
      }),
    );
  }, [performance]);

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Agency Performance"
        subtitle="Executive intelligence, market analysis, and agency productivity."
        actions={
          <GhostButton
            onClick={loadPerformance}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Refresh Performance
          </GhostButton>
        }
      />

      {/* Show the real API loading state. */}
      {isLoading && (
        <div className="rounded-xl border border-white/10 bg-navy-800/50 px-4 py-3 text-sm text-ink/60">
          Loading Agency Performance...
        </div>
      )}

      {/* Show the actual API error without inventing fallback metrics. */}
      {loadError && !isLoading && (
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 px-4 py-3 text-sm text-rose-300">
          {loadError}
        </div>
      )}

      {performance && (
        <>
          {/* Executive KPI Dashboard */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <KPICard
              title="Closed Deal Value"
              value={
                performance.summary.closedDealValue > 0
                  ? formatCurrency(
                      performance.summary.closedDealValue,
                    )
                  : '—'
              }
              trend={
                performance.summary.closedDeals > 0
                  ? `${performance.summary.closedDeals} closed deal${
                      performance.summary.closedDeals ===
                      1
                        ? ''
                        : 's'
                    }`
                  : 'No closed deals'
              }
              trendColor="text-emerald-400"
              icon={DollarSign}
            />

            <KPICard
              title="Sales Volume"
              value={
                performance.summary.closedDeals > 0
                  ? String(
                      performance.summary.closedDeals,
                    )
                  : '—'
              }
              trend="Finalized transactions"
              trendColor="text-blue-400"
              icon={TrendingUp}
            />

            <KPICard
              title="Listing Conversion"
              value={
                performance.summary.listingConversion != null
                  ? `${performance.summary.listingConversion}%`
                  : '—'
              }
              trend="Finalized deals ÷ Agency listings"
              trendColor="text-emerald-400"
              icon={Target}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Analytics */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Revenue Distribution */}
                <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-cream mb-6 flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-gold-400" />
                      Revenue Distribution
                    </h3>

                    {performance.revenueDistribution.length > 0 ? (
                      <>
                        <div className="h-3 w-full bg-navy-950 rounded-full overflow-hidden border border-white/5 flex">
                          {performance.revenueDistribution.map(
                            (item, index) => (
                              <div
                                key={`${item.label}-${index}`}
                                className="bg-blue-400 h-full"
                                style={{
                                  width: `${Math.max(
                                    item.percentage,
                                    0,
                                  )}%`,
                                  opacity:
                                    Math.max(
                                      0.35,
                                      1 -
                                        index *
                                          0.15,
                                    ),
                                }}
                                title={`${item.label}: ${item.percentage.toFixed(
                                  1,
                                )}%`}
                              />
                            ),
                          )}
                        </div>

                        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink/80">
                          {performance.revenueDistribution.map(
                            (item, index) => (
                              <div
                                key={`${item.label}-legend-${index}`}
                                className="flex items-center gap-2"
                              >
                                <div className="w-2 h-2 rounded-full bg-blue-400" />

                                <span>
                                  {item.label}:{' '}
                                  <span className="text-cream font-medium">
                                    {formatCurrency(
                                      item.value,
                                    )}
                                  </span>
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="rounded-lg border border-white/5 bg-navy-900/40 px-4 py-4 text-sm text-ink/50">
                        No finalized revenue distribution data available.
                      </div>
                    )}
                  </div>
                </div>

                {/* Sales Funnel */}
                <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
                  <h3 className="font-heading text-lg font-semibold text-cream mb-6 flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-400" />
                    Lead to Deal Funnel
                  </h3>

                  <div className="space-y-4">
                    {/* Real Agency inquiry count. */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-ink/80">
                          Total Inquiries
                        </span>

                        <span className="font-bold text-cream">
                          {performance.funnel.inquiries}
                        </span>
                      </div>

                      <div className="h-3 w-full bg-slate-500 rounded" />
                    </div>

                    {/* Real Agency viewing count. */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-ink/80">
                          Viewings
                        </span>

                        <span className="font-bold text-cream">
                          {performance.funnel.viewings}
                        </span>
                      </div>

                      <div className="h-3 w-full bg-blue-400 rounded opacity-80" />
                    </div>

                    {/* Real Agency offer count. */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-ink/80">
                          Offers Made
                        </span>

                        <span className="font-bold text-cream">
                          {performance.funnel.offers}
                        </span>
                      </div>

                      <div className="h-3 w-full bg-yellow-400 rounded opacity-80" />
                    </div>

                    {/* Real finalized transaction count. */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-ink/80">
                          Closed Deals
                        </span>

                        <span className="font-bold text-cream">
                          {performance.funnel.closedDeals}
                        </span>
                      </div>

                      <div className="h-3 w-full bg-emerald-400 rounded opacity-80" />
                    </div>
                  </div>

                  {/* Use the corrected Offer -> Deal conversion. */}
                  <div className="mt-6 text-center text-xs text-ink/60">
                    Offer-to-deal conversion:{' '}
                    <span className="font-bold text-emerald-400">
                      {performance.funnel.conversionRate != null
                        ? `${performance.funnel.conversionRate}%`
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Monthly Revenue Trends */}
              <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
                <h3 className="font-heading text-lg font-semibold text-cream mb-6 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-400" />
                  Revenue & Productivity Trends
                </h3>

                {performance.monthlyTrend.length > 0 &&
                maxMonthlyValue > 0 ? (
                  <>
                    <div className="h-64 flex items-end gap-3 mt-4">
                      {performance.monthlyTrend.map(
                        (item, index) => {
                          const height =
                            maxMonthlyValue > 0
                              ? (Number(item.value || 0) /
                                  maxMonthlyValue) *
                                100
                              : 0;

                          return (
                            <div
                              key={`${item.month}-${item.year}-${index}`}
                              className="flex-1 flex flex-col justify-end h-full group"
                              title={`${item.month} ${item.year}: ${formatCurrency(
                                item.value,
                              )}`}
                            >
                              <div
                                className="w-full bg-emerald-400/60 rounded-t-sm transition-all group-hover:bg-emerald-400"
                                style={{
                                  height: `${Math.max(
                                    height,
                                    item.value > 0
                                      ? 4
                                      : 0,
                                  )}%`,
                                }}
                              />
                            </div>
                          );
                        },
                      )}
                    </div>

                    <div className="grid grid-cols-12 gap-3 text-[10px] text-ink/60 mt-4">
                      {performance.monthlyTrend.map(
                        (item, index) => (
                          <span
                            key={`${item.month}-label-${index}`}
                            className="text-center"
                          >
                            {item.month}
                          </span>
                        ),
                      )}
                    </div>

                    <div className="flex justify-center mt-4">
                      <div className="flex items-center gap-2 text-xs text-ink/60">
                        <div className="w-3 h-3 rounded-sm bg-emerald-400/60" />
                        Finalized Deal Value
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-64 flex items-center justify-center rounded-lg border border-white/5 bg-navy-900/40">
                    <span className="text-sm text-ink/50">
                      No monthly finalized-deal data available.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Agent Leaderboard */}
              <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-semibold text-cream flex items-center gap-2">
                    <Star className="h-5 w-5 text-gold-400" />
                    Agent Leaderboard
                  </h3>
                </div>

                {performance.agentLeaderboard.length > 0 ? (
                  <div className="space-y-4">
                    {performance.agentLeaderboard.map(
                      (agent, index) => (
                        <div
                          key={agent.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-navy-900/50"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                index === 0
                                  ? 'bg-gold-400 text-navy-950'
                                  : index === 1
                                    ? 'bg-zinc-300 text-navy-950'
                                    : index === 2
                                      ? 'bg-amber-600 text-white'
                                      : 'bg-navy-800 text-ink/60'
                              }`}
                            >
                              {index + 1}
                            </div>

                            <div>
                              <div className="font-bold text-sm text-cream">
                                {agent.name}
                              </div>

                              <div className="text-[10px] text-ink/60">
                                {agent.closedDeals}{' '}
                                Deal
                                {agent.closedDeals ===
                                1
                                  ? ''
                                  : 's'}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-bold text-sm text-emerald-400">
                              {formatCurrency(
                                agent.dealValue,
                              )}
                            </div>

                            {agent.level && (
                              <div className="text-[10px] text-ink/60">
                                {agent.level}
                              </div>
                            )}

                            {agent.status && (
                              <div className="text-[10px] text-ink/50">
                                {agent.status}
                              </div>
                            )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border border-white/5 bg-navy-900/40 px-4 py-4 text-sm text-ink/50">
                    No Agent performance data available.
                  </div>
                )}

                {/* Keep this UI action available for future expansion. */}
                <GhostButton className="w-full mt-4 text-xs">
                  View Full Rankings
                </GhostButton>
              </div>

              {/* Recent Deals */}
              <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
                <ActivityTimeline
                  title="Recent Conversions"
                  items={recentConversionTimeline}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}