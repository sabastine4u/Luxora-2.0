import { useEffect, useState } from 'react';
import {
  TrendingUp,
  Activity,
  Banknote,
  Building2,
  Users,
  Wallet,
  ShieldAlert,
} from 'lucide-react';

import { financeApi } from '../../../api/finance.api';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';

type FinanceSummary = {
  realizedServiceRevenue: number;
  ownerPaymentsCollected: number;
  pendingOwnerPayments: number;
  paidCommissionObligations: number;
  pendingCommissionObligations: number;
  activeMortgageApplications: number;
};

type FinanceActivity = {
  title: string;
  desc: string;
  time: string;
  icon: typeof Banknote;
  color: string;
};

const EMPTY_SUMMARY: FinanceSummary = {
  realizedServiceRevenue: 0,
  ownerPaymentsCollected: 0,
  pendingOwnerPayments: 0,
  paidCommissionObligations: 0,
  pendingCommissionObligations: 0,
  activeMortgageApplications: 0,
};

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [summary, setSummary] = useState<FinanceSummary>(EMPTY_SUMMARY);

  const [recentActivity, setRecentActivity] = useState<FinanceActivity[]>(
    [],
  );

  useEffect(() => {
    const loadOverview = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await financeApi.getOverview();

        const overview = response?.data?.overview;
        const backendSummary = overview?.summary;

        setSummary({
          realizedServiceRevenue:
            Number(backendSummary?.realizedServiceRevenue) || 0,

          ownerPaymentsCollected:
            Number(backendSummary?.ownerPaymentsCollected) || 0,

          pendingOwnerPayments:
            Number(backendSummary?.pendingOwnerPayments) || 0,

          paidCommissionObligations:
            Number(backendSummary?.paidCommissionObligations) || 0,

          pendingCommissionObligations:
            Number(backendSummary?.pendingCommissionObligations) || 0,

          activeMortgageApplications:
            Number(backendSummary?.activeMortgageApplications) || 0,
        });

        const activity = Array.isArray(overview?.recentActivity)
          ? overview.recentActivity
          : [];

        setRecentActivity(
          activity.map((item: any) => {
            const action = String(item?.action || '');

            const title = action
              ? action
                  .split('.')
                  .map((part) =>
                    part
                      ? part.charAt(0).toUpperCase() + part.slice(1)
                      : '',
                  )
                  .join(' ')
              : 'Finance Activity';

            let icon = Activity;
            let color = 'text-gold-400';

            if (action.includes('mortgage')) {
              icon = Building2;
              color = 'text-blue-400';
            } else if (action.includes('commission')) {
              icon = Users;
              color = 'text-emerald-400';
            } else if (action.includes('payment')) {
              icon = Banknote;
              color = 'text-emerald-400';
            } else if (action.includes('budget')) {
              icon = Wallet;
              color = 'text-yellow-400';
            } else if (action.includes('invoice')) {
              icon = ShieldAlert;
              color = 'text-rose-400';
            }

            return {
              title,
              desc: item?.description || 'Finance activity recorded.',
              time: item?.createdAt
                ? new Date(item.createdAt).toLocaleString('en-NG', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })
                : 'Unknown time',
              icon,
              color,
            };
          }),
        );
      } catch (err) {
        console.error('Failed to load Finance Overview:', err);
        setError('Unable to load finance overview.');
        setSummary(EMPTY_SUMMARY);
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(value);

  const kpis = [
    {
      title: 'Service Revenue',
      value: loading
        ? '—'
        : formatCurrency(summary.realizedServiceRevenue),
      icon: TrendingUp,
      trend: 'Live',
      up: true,
    },
    {
      title: 'Owner Payments Collected',
      value: loading
        ? '—'
        : formatCurrency(summary.ownerPaymentsCollected),
      icon: Wallet,
      trend: 'Live',
      up: true,
    },
    {
      title: 'Pending Owner Payments',
      value: loading
        ? '—'
        : formatCurrency(summary.pendingOwnerPayments),
      icon: ShieldAlert,
      trend: 'Live',
      up: true,
      trendColor: 'text-yellow-400',
      iconColor: 'text-yellow-400',
      backgroundColor: 'bg-yellow-400/10',
    },
    {
      title: 'Paid Commission Obligations',
      value: loading
        ? '—'
        : formatCurrency(summary.paidCommissionObligations),
      icon: Users,
      trend: 'Live',
      up: true,
    },
    {
      title: 'Pending Commission Obligations',
      value: loading
        ? '—'
        : formatCurrency(summary.pendingCommissionObligations),
      icon: Activity,
      trend: 'Live',
      up: true,
      trendColor: 'text-yellow-400',
      iconColor: 'text-yellow-400',
      backgroundColor: 'bg-yellow-400/10',
    },
    {
      title: 'Active Mortgage Applications',
      value: loading
        ? '—'
        : String(summary.activeMortgageApplications),
      icon: Building2,
      trend: 'Live',
      up: true,
    },
  ];

  const snapshotItems = [
    {
      label: 'Service Revenue',
      value: summary.realizedServiceRevenue,
      display: formatCurrency(summary.realizedServiceRevenue),
      barClass: 'bg-emerald-400',
    },
    {
      label: 'Owner Payments Collected',
      value: summary.ownerPaymentsCollected,
      display: formatCurrency(summary.ownerPaymentsCollected),
      barClass: 'bg-blue-400',
    },
    {
      label: 'Paid Commission Obligations',
      value: summary.paidCommissionObligations,
      display: formatCurrency(summary.paidCommissionObligations),
      barClass: 'bg-gold-400',
    },
    {
      label: 'Pending Commission Obligations',
      value: summary.pendingCommissionObligations,
      display: formatCurrency(summary.pendingCommissionObligations),
      barClass: 'bg-yellow-400',
    },
  ];

  const snapshotMax = Math.max(
    ...snapshotItems.map((item) => item.value),
    1,
  );

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">
            Finance Overview
          </h2>

          <p className="text-sm text-ink/60">
            Live summary of available enterprise financial data.
          </p>
        </div>

        {loading && (
          <span className="text-sm text-ink/50">
            Loading finance data...
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            trend={kpi.trend}
            trendColor={
              kpi.trendColor ||
              (kpi.up ? 'text-emerald-400' : 'text-rose-400')
            }
            iconColor={kpi.iconColor || 'text-gold-400'}
            backgroundColor={kpi.backgroundColor || 'bg-gold-400/10'}
            trendPosition="bottom-right"
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Finance Snapshot */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading text-lg font-bold text-cream">
                Current Finance Snapshot
              </h3>

              <p className="text-sm text-ink/50 mt-1">
                Current values returned by the Finance service.
              </p>
            </div>

            {!loading && (
              <span className="text-xs font-medium text-emerald-400">
                Live Data
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="space-y-2">
                  <div className="h-4 w-40 rounded bg-white/5 animate-pulse" />
                  <div className="h-3 w-full rounded bg-white/5 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {snapshotItems.map((item) => {
                const width =
                  item.value > 0
                    ? Math.max((item.value / snapshotMax) * 100, 4)
                    : 0;

                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className="text-sm text-ink/70">
                        {item.label}
                      </span>

                      <span className="text-sm font-semibold text-cream">
                        {item.display}
                      </span>
                    </div>

                    <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${item.barClass}`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-navy-900/40 p-4">
              <p className="text-xs uppercase tracking-wide text-ink/40">
                Pending Owner Payments
              </p>

              <p className="mt-2 text-xl font-bold text-cream">
                {loading
                  ? '—'
                  : formatCurrency(summary.pendingOwnerPayments)}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-navy-900/40 p-4">
              <p className="text-xs uppercase tracking-wide text-ink/40">
                Active Mortgage Applications
              </p>

              <p className="mt-2 text-xl font-bold text-cream">
                {loading
                  ? '—'
                  : summary.activeMortgageApplications}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <div className="h-6 w-40 rounded bg-white/5 animate-pulse mb-6" />

              <div className="space-y-5">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-white/5 animate-pulse" />

                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-white/5 animate-pulse" />
                      <div className="h-3 w-full rounded bg-white/5 animate-pulse" />
                      <div className="h-3 w-1/2 rounded bg-white/5 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ActivityTimeline
              title="Recent Activity"
              items={recentActivity}
              showViewAll={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}