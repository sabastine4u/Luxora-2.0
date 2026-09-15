import { useEffect, useMemo, useState } from 'react';
import {
  DollarSign,
  Download,
  TrendingUp,
  CheckCircle2,
  Calculator,
  ArrowUpRight,
  Activity,
  Target,
  AlertCircle,
  ShieldCheck,
  Wallet,
  Lightbulb,
  Clock3,
} from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { CommissionDetailModal } from './modals/CommissionDetailModal';
import { useToast } from '../../../contexts/ToastContext';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { agentApi } from '../../../api/agent.api';

interface CommissionRecord {
  _id: string;
  commissionId: string;
  agency:
    | {
        _id: string;
        name: string;
        status: string;
      }
    | null;
  agent:
    | {
        _id: string;
        fullName: string;
        email: string;
        agentShare: number;
        agencyShare: number;
        commissionModel?: string;
      }
    | null;
  property:
    | {
        _id: string;
        title: string;
        status: string;
        transactionType: string;
        price: number;
        agencyFee?: number | null;
      }
    | null;
  offer:
    | {
        _id: string;
        offerAmount: number;
        counterOfferAmount?: number | null;
        status: string;
        buyer?:
          | {
              _id: string;
              fullName: string;
              email: string;
              phone?: string;
            }
          | null;
        createdAt: string;
        updatedAt: string;
      }
    | null;

  dealValue: number;
  commissionPool: number;
  agentSharePercent: number;
  agencySharePercent: number;
  agentAmount: number;
  agencyAmount: number;

  status:
    | 'Pending'
    | 'Processing'
    | 'Paid'
    | 'Overdue'
    | 'Cancelled';

  dueDate?: string | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CommissionSummary {
  paid: {
    amount: number;
    count: number;
  };
  pending: {
    amount: number;
    count: number;
  };
  processing: {
    amount: number;
    count: number;
  };
  overdue: {
    amount: number;
    count: number;
  };
  cancelled: {
    amount: number;
    count: number;
  };
  totalEarned: number;
  totalCommissionPool: number;
  totalDeals: number;
}

const formatCurrency = (
  amount: number | null | undefined,
) => {
  if (
    typeof amount !== 'number' ||
    Number.isNaN(amount)
  ) {
    return '₦0';
  }

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (
  value?: string | null,
) => {
  if (!value) {
    return 'Not provided';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not provided';
  }

  return date.toLocaleDateString(
    'en-NG',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
  );
};

export default function Commissions() {
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] =
    useState('');

  const [
    commissions,
    setCommissions,
  ] = useState<
    CommissionRecord[]
  >([]);

  const [summary, setSummary] =
    useState<CommissionSummary | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [selectedComm, setSelectedComm] =
    useState<
      CommissionRecord | null
    >(null);

  const [activeWorkflow, setActiveWorkflow] =
    useState<{
      title: string;
      type: string;
      data?: Record<string, unknown>;
    } | null>(null);

  /*
   * Load the Agent's real commission ledger
   * and summary from the backend.
   */
  useEffect(() => {
    const loadCommissions = async () => {
      try {
        setLoading(true);

        const [
          commissionsResponse,
          summaryResponse,
        ] = await Promise.all([
          agentApi.getMyCommissions(),
          agentApi.getMyCommissionSummary(),
        ]);

        const rawCommissions =
          commissionsResponse as any;

        const rawSummary =
          summaryResponse as any;

        const commissionList =
          Array.isArray(
            rawCommissions?.commissions,
          )
            ? rawCommissions.commissions
            : Array.isArray(
                rawCommissions
                  ?.data?.commissions,
              )
              ? rawCommissions.data
                  .commissions
              : [];

        const commissionSummary =
          rawSummary?.summary ||
          rawSummary?.data?.summary ||
          null;

        setCommissions(
          commissionList,
        );

        setSummary(
          commissionSummary,
        );
      } catch (error) {
        console.error(
          'Failed to load Agent commissions:',
          error,
        );

        showToast({
          type: 'error',
          title: 'Unable to load commissions',
          description:
            'We could not retrieve your commission ledger.',
        });
      } finally {
        setLoading(false);
      }
    };

    loadCommissions();
  }, [showToast]);

  const handleAction = (
    title: string,
    type: string,
    data?: Record<string, unknown>,
  ) => {
    setActiveWorkflow({
      title,
      type,
      data,
    });
  };

  const executeWorkflow = () => {
    showToast({
      type: 'success',
      title: 'Action Initiated',
      description: `Executing: ${activeWorkflow?.title}. Integration pending.`,
    });

    setActiveWorkflow(null);
  };

  const filteredComms =
    commissions.filter(
      (commission) => {
        const propertyName =
          commission.property?.title ||
          '';

        const clientName =
          commission.offer?.buyer
            ?.fullName || '';

        return (
          propertyName
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase(),
            ) ||
          clientName
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase(),
            )
        );
      },
    );

  const handleViewComm = (
    commission: CommissionRecord,
  ) => {
    setSelectedComm(commission);
  };

  const paidAmount =
    summary?.paid.amount || 0;

  const pendingAmount =
    (summary?.pending.amount || 0) +
    (summary?.overdue.amount || 0);

  const processingAmount =
    summary?.processing.amount || 0;

  const totalEarned =
    summary?.totalEarned || 0;

  const totalDeals =
    summary?.totalDeals || 0;

  const averageCommission =
    totalDeals > 0
      ? totalEarned / totalDeals
      : 0;

  const agentSharePercent =
    commissions.length > 0
      ? commissions[0]
          .agentSharePercent
      : 0;

  const cashFlowSummary = [
    {
      label: 'Paid',
      value: paidAmount,
      color: 'bg-emerald-400',
    },
    {
      label: 'Pending',
      value: pendingAmount,
      color: 'bg-gold-400',
    },
    {
      label: 'Processing',
      value: processingAmount,
      color: 'bg-blue-400',
    },
  ];

  const upcomingPayouts = useMemo(
    () =>
      commissions
        .filter(
          (commission) =>
            commission.status !==
              'Paid' &&
            commission.status !==
              'Cancelled',
        )
        .sort((a, b) => {
          const first =
            a.dueDate
              ? new Date(
                  a.dueDate,
                ).getTime()
              : Number.MAX_SAFE_INTEGER;

          const second =
            b.dueDate
              ? new Date(
                  b.dueDate,
                ).getTime()
              : Number.MAX_SAFE_INTEGER;

          return first - second;
        })
        .slice(0, 3)
        .map((commission) => ({
          title:
            commission.property
              ?.title ||
            'Property unavailable',
          desc:
            commission.status ===
            'Processing'
              ? 'Commission currently processing'
              : commission.dueDate
                ? `Expected ${formatDate(
                    commission.dueDate,
                  )}`
                : 'Payment date not provided',
          time:
            commission.dueDate
              ? formatDate(
                  commission.dueDate,
                )
              : 'Pending',
          icon:
            commission.status ===
            'Overdue'
              ? AlertCircle
              : commission.status ===
                  'Processing'
                ? Clock3
                : DollarSign,
          color:
            commission.status ===
            'Overdue'
              ? 'text-rose-400'
              : commission.status ===
                  'Processing'
                ? 'text-blue-400'
                : 'text-gold-400',
        })),
    [commissions],
  );

  const financialRecommendations = [
    {
      text:
        pendingAmount > 0
          ? `You have ${formatCurrency(
              pendingAmount,
            )} in pending or overdue Agent commissions.`
          : 'There are no pending Agent commission payouts currently recorded.',
      icon: Lightbulb,
      color: 'text-blue-400',
    },
    {
      text:
        agentSharePercent > 0
          ? `Your current commission split is ${agentSharePercent}% Agent share.`
          : 'Your Agent commission split is not available on the current commission records.',
      icon: TrendingUp,
      color: 'text-emerald-400',
    },
  ];

  const taxTimeline = [
    {
      title: 'Commission Ledger Review',
      desc:
        'Review paid, pending, processing and overdue commission records.',
      time: 'Current',
      icon: Calculator,
      color: 'text-gold-400',
    },
    {
      title: 'Next Recorded Payout',
      desc:
        upcomingPayouts[0]
          ? upcomingPayouts[0].title
          : 'No upcoming payout recorded',
      time:
        upcomingPayouts[0]
          ? upcomingPayouts[0].time
          : 'Not provided',
      icon: Activity,
      color: 'text-blue-400',
    },
  ];

  const paidCount =
    summary?.paid.count || 0;

  const pendingCount =
    summary?.pending.count || 0;

  const processingCount =
    summary?.processing.count || 0;

  const overdueCount =
    summary?.overdue.count || 0;

  const commissionStatusBoard = [
    {
      label: 'Paid',
      value: paidCount,
      color: 'bg-emerald-400',
    },
    {
      label: 'Pending',
      value: pendingCount,
      color: 'bg-gold-400',
    },
    {
      label: 'Processing',
      value: processingCount,
      color: 'bg-blue-400',
    },
    {
      label: 'Overdue',
      value: overdueCount,
      color: 'bg-rose-400',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        name="Financial Planning Dashboard"
        subtitle="Track earned commissions, monitor payouts, and review your transaction income."
        actions={
          <div className="flex gap-3">
            <GhostButton
              className="flex items-center gap-2"
              onClick={() =>
                handleAction(
                  'Tax Estimator',
                  'tax_estimator',
                )
              }
            >
              <Calculator className="h-4 w-4" />
              Tax Estimator
            </GhostButton>

            <GoldButton
              className="flex items-center gap-2"
              onClick={() =>
                handleAction(
                  'Export Report',
                  'export_report',
                )
              }
            >
              <Download className="h-4 w-4" />
              Export Report
            </GoldButton>
          </div>
        }
      />

      {/* FINANCIAL OVERVIEW */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-center h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-400/20 rounded-xl">
              <Wallet className="h-6 w-6 text-emerald-400" />
            </div>

            <h4 className="font-bold text-cream text-lg">
              Commission Earnings
            </h4>
          </div>

          <p className="text-sm text-ink/80 leading-relaxed mb-4">
            Your recorded Agent commission
            earnings currently total{' '}
            <strong className="text-emerald-400">
              {formatCurrency(
                totalEarned,
              )}
            </strong>
            . You have{' '}
            <strong className="text-gold-400">
              {formatCurrency(
                pendingAmount,
              )}
            </strong>{' '}
            awaiting payout or resolution.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div>
              <div className="text-xs text-ink/60 mb-1">
                Total Earned
              </div>

              <div className="text-lg font-bold text-emerald-400">
                {formatCurrency(
                  totalEarned,
                )}
              </div>
            </div>

            <div>
              <div className="text-xs text-ink/60 mb-1">
                Pending
              </div>

              <div className="text-lg font-bold text-gold-400">
                {formatCurrency(
                  pendingAmount,
                )}
              </div>
            </div>

            <div>
              <div className="text-xs text-ink/60 mb-1">
                Deals
              </div>

              <div className="text-lg font-bold text-blue-400">
                {totalDeals}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink/60 mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-gold-400" />
              Commission Split
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">
                    Agent Share
                  </span>

                  <span className="text-emerald-400">
                    {agentSharePercent}%
                  </span>
                </div>

                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{
                      width: `${Math.min(
                        Math.max(
                          agentSharePercent,
                          0,
                        ),
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">
                    Agency Share
                  </span>

                  <span className="text-gold-400">
                    {commissions.length > 0
                      ? commissions[0]
                          .agencySharePercent
                      : 0}
                    %
                  </span>
                </div>

                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-400 rounded-full"
                    style={{
                      width: `${Math.min(
                        Math.max(
                          commissions.length > 0
                            ? commissions[0]
                                .agencySharePercent
                            : 0,
                          0,
                        ),
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
          <h3 className="text-sm font-semibold text-ink/60 mb-4 text-center">
            Income Snapshot
          </h3>

          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">
                Paid
              </span>

              <span className="text-sm font-medium text-emerald-400">
                {formatCurrency(
                  paidAmount,
                )}
              </span>
            </div>

            <div className="w-full bg-white/5 rounded-full h-1.5">
              <div
                className="bg-emerald-400 h-1.5 rounded-full"
                style={{
                  width:
                    totalEarned > 0
                      ? `${Math.min(
                          (paidAmount /
                            totalEarned) *
                            100,
                          100,
                        )}%`
                      : '0%',
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">
                Pending / Overdue
              </span>

              <span className="text-sm font-medium text-gold-400">
                {formatCurrency(
                  pendingAmount,
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Earned"
          value={formatCurrency(
            totalEarned,
          )}
          trend={`${totalDeals} Commission Record${
            totalDeals === 1
              ? ''
              : 's'
          }`}
          trendColor="text-emerald-400"
          icon={CheckCircle2}
        />

        <KPICard
          title="Pending Approval"
          value={formatCurrency(
            pendingAmount,
          )}
          trend={`${pendingCount + overdueCount} Record${
            pendingCount +
              overdueCount ===
            1
              ? ''
              : 's'
          }`}
          trendColor="text-gold-400"
          icon={DollarSign}
        />

        <KPICard
          title="Processing"
          value={formatCurrency(
            processingAmount,
          )}
          trend={`${processingCount} Processing`}
          trendColor="text-blue-400"
          icon={Activity}
        />

        <KPICard
          title="Avg Commission"
          value={formatCurrency(
            averageCommission,
          )}
          trend={
            agentSharePercent > 0
              ? `${agentSharePercent}% Agent Share`
              : 'Split not recorded'
          }
          trendColor="text-emerald-400"
          icon={ArrowUpRight}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Commissions Table */}
        <div className="lg:col-span-3 space-y-6">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={
              setSearchQuery
            }
            searchPlaceholder="Search by property or client..."
          />

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-8 text-center">
              <div className="text-sm text-ink/60">
                Loading commissions...
              </div>
            </div>
          ) : filteredComms.length > 0 ? (
            <DataTable
              keyExtractor={(
                item: CommissionRecord,
                index: number,
              ) =>
                item._id ||
                String(index)
              }
              columns={[
                {
                  header:
                    'Property / Client',
                  render: (
                    comm: CommissionRecord,
                  ) => (
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gold-400/20 flex items-center justify-center text-gold-400">
                        <DollarSign className="h-5 w-5" />
                      </div>

                      <div>
                        <div className="font-semibold text-cream">
                          {comm.property
                            ?.title ||
                            'Property unavailable'}
                        </div>

                        <div className="text-xs text-ink/60">
                          {comm.offer
                            ?.buyer
                            ?.fullName ||
                            'Buyer unavailable'}
                        </div>
                      </div>
                    </div>
                  ),
                },

                {
                  header:
                    'Commission Amount',
                  render: (
                    comm: CommissionRecord,
                  ) => (
                    <div className="font-bold text-emerald-400 text-base">
                      {formatCurrency(
                        comm.agentAmount,
                      )}
                    </div>
                  ),
                },

                {
                  header:
                    'Type / Split',
                  render: (
                    comm: CommissionRecord,
                  ) => (
                    <div>
                      <div className="font-medium text-cream text-sm">
                        {comm.property
                          ?.transactionType ||
                          'Transaction'}
                      </div>

                      <div className="text-xs text-ink/60 mt-0.5">
                        Agent:{' '}
                        {
                          comm.agentSharePercent
                        }%
                      </div>
                    </div>
                  ),
                },

                {
                  header:
                    'Expected / Paid Date',
                  render: (
                    comm: CommissionRecord,
                  ) => (
                    <div className="text-sm text-cream">
                      {comm.paidAt
                        ? formatDate(
                            comm.paidAt,
                          )
                        : formatDate(
                            comm.dueDate,
                          )}
                    </div>
                  ),
                },

                {
                  header: 'Status',
                  render: (
                    comm: CommissionRecord,
                  ) => (
                    <EnterpriseStatusBadge
                      status={
                        comm.status
                      }
                    />
                  ),
                },

                {
                  header: 'Actions',
                  render: (
                    comm: CommissionRecord,
                  ) => (
                    <GhostButton
                      onClick={() =>
                        handleViewComm(
                          comm,
                        )
                      }
                      className="h-8 px-3 text-xs"
                    >
                      View Breakdown
                    </GhostButton>
                  ),
                },
              ]}
              data={
                filteredComms
              }
              onRowClick={(
                comm: CommissionRecord,
              ) =>
                handleViewComm(
                  comm,
                )
              }
            />
          ) : (
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-8 text-center">
              <div className="flex justify-center mb-3">
                <DollarSign className="h-8 w-8 text-gold-400" />
              </div>

              <div className="text-sm font-semibold text-cream">
                No commissions found
              </div>

              <div className="text-xs text-ink/60 mt-1">
                Commission records generated from completed transactions will appear here.
              </div>
            </div>
          )}

          <SegmentedProgressBar
            title="Commission Payment Status"
            segments={
              commissionStatusBoard
            }
          />
        </div>

        {/* Analytics & Side Widgets */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-gold-400" />
              Financial Recommendations
            </h3>

            <div className="space-y-3">
              {financialRecommendations.map(
                (
                  rec,
                  idx,
                ) => (
                  <div
                    key={idx}
                    className="flex gap-3 bg-navy-900/50 p-3 rounded-xl border border-white/5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="pt-0.5">
                      <rec.icon
                        className={`h-4 w-4 ${rec.color}`}
                      />
                    </div>

                    <div className="text-xs text-cream leading-relaxed">
                      {rec.text}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-purple-400" />
              Commission Overview
            </h3>

            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-ink/80">
                  Commission Pool
                </span>

                <span className="text-gold-400 font-bold">
                  {formatCurrency(
                    summary?.totalCommissionPool ||
                      0,
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-ink/80">
                  Agent Earnings
                </span>

                <span className="text-emerald-400 font-bold">
                  {formatCurrency(
                    totalEarned,
                  )}
                </span>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm">
                <span className="text-cream font-medium">
                  Recorded Deals
                </span>

                <span className="text-cream font-bold">
                  {totalDeals}
                </span>
              </div>
            </div>
          </div>

          <ActivityTimeline
            title="Upcoming Payouts"
            items={
              upcomingPayouts
            }
          />

          <ActivityTimeline
            title="Commission Timeline"
            items={taxTimeline}
          />
        </div>
      </div>

      <CommissionDetailModal
        isOpen={
          !!selectedComm
        }
        onClose={() =>
          setSelectedComm(null)
        }
        commission={
          selectedComm
        }
      />

      <EnterpriseDetailDrawer
        isOpen={
          !!activeWorkflow
        }
        onClose={() =>
          setActiveWorkflow(null)
        }
        title={
          activeWorkflow?.title ||
          'Workflow'
        }
        footerActions={
          <GoldButton
            onClick={
              executeWorkflow
            }
            className="w-full justify-center"
          >
            Confirm Action
          </GoldButton>
        }
      >
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-white/10 bg-navy-900">
            <h4 className="text-sm font-semibold text-cream mb-2">
              Workflow Details
            </h4>

            <p className="text-sm text-ink/60 leading-relaxed">
              You are about to execute the{' '}
              <strong>
                {
                  activeWorkflow?.type
                }
              </strong>{' '}
              workflow. Please review the
              action details below and confirm
              to integrate with the backend
              system.
            </p>
          </div>

          {activeWorkflow?.data && (
            <div className="p-4 rounded-xl border border-white/10 bg-navy-900/50">
              <h4 className="text-sm font-semibold text-cream mb-4">
                Context Data
              </h4>

              <div className="space-y-2 text-sm text-ink/80">
                {Object.entries(
                  activeWorkflow.data,
                ).map(
                  (
                    [
                      key,
                      value,
                    ],
                  ) => {
                    if (
                      typeof value ===
                        'string' ||
                      typeof value ===
                        'number'
                    ) {
                      return (
                        <div
                          key={key}
                          className="flex justify-between border-b border-white/5 pb-2"
                        >
                          <span className="capitalize">
                            {
                              key
                            }
                          </span>

                          <span className="font-medium text-cream">
                            {
                              value
                            }
                          </span>
                        </div>
                      );
                    }

                    return null;
                  },
                )}
              </div>
            </div>
          )}
        </div>
      </EnterpriseDetailDrawer>
    </div>
  );
}