import { useEffect, useMemo, useState } from 'react';
import {
  Download,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  PieChart,
  TrendingUp,
  RefreshCcw,
} from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { propertyApi } from '../../../api/property.api';
import type { AgencyCommission } from '../../../types/agency';

type CommissionRecord = AgencyCommission & {
  pool: string;
  agentSharePercent: number | null;
  agencySharePercent: number | null;
  agentAmount: string;
  agencyAmount: string;
  dueDate: string;
  paidAt: string;
};

type CommissionSummary = {
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
};

const emptySummary: CommissionSummary = {
  paid: {
    amount: 0,
    count: 0,
  },
  pending: {
    amount: 0,
    count: 0,
  },
  processing: {
    amount: 0,
    count: 0,
  },
  overdue: {
    amount: 0,
    count: 0,
  },
  cancelled: {
    amount: 0,
    count: 0,
  },
};

// Format a backend numeric amount as Nigerian Naira.
const formatCurrency = (value: number) =>
  `₦${new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 0,
  }).format(Number(value || 0))}`;

// Convert a backend Commission document into the existing UI structure.
const mapCommission = (commission: any): CommissionRecord => ({
  id: String(commission.commissionId || commission._id || '—'),

  agent:
    commission.agent?.fullName ||
    commission.agent?.name ||
    'Unassigned',

  property:
    commission.property?.title ||
    '—',

  date: commission.createdAt
    ? new Date(commission.createdAt).toLocaleDateString('en-NG', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    : '—',

  // Agency earnings are the amount shown in the Agency commission ledger.
  amount: formatCurrency(commission.agencyAmount),

  status: String(commission.status || 'Pending'),

  dealValue: formatCurrency(commission.dealValue),

  pool: formatCurrency(commission.commissionPool),

  agentSharePercent:
    commission.agentSharePercent == null
      ? null
      : Number(commission.agentSharePercent),

  agencySharePercent:
    commission.agencySharePercent == null
      ? null
      : Number(commission.agencySharePercent),

  agentAmount: formatCurrency(commission.agentAmount),

  agencyAmount: formatCurrency(commission.agencyAmount),

  dueDate: commission.dueDate
    ? new Date(commission.dueDate).toLocaleDateString('en-NG')
    : '—',

  paidAt: commission.paidAt
    ? new Date(commission.paidAt).toLocaleDateString('en-NG')
    : '—',
});

export default function Commissions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [summary, setSummary] =
    useState<CommissionSummary>(emptySummary);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [selectedCommission, setSelectedCommission] =
    useState<CommissionRecord | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Displays the result of payroll or payout operations.
  const [payrollMessage, setPayrollMessage] = useState('');

  // Prevent duplicate status/payroll requests while an action is running.
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Load the Agency's real Commission ledger and summary.
  const loadCommissionData = async () => {
    try {
      setIsLoading(true);
      setLoadError('');

      // Fetch the ledger independently from the summary.
      // This prevents one request from hiding the other request's result.
      const commissionResponse =
        await propertyApi.getAgencyCommissions();

      const commissionList =
        commissionResponse?.data?.commissions ?? [];

      if (!Array.isArray(commissionList)) {
        throw new Error(
          'Commission endpoint returned an unexpected response.'
        );
      }

      setCommissions(
        commissionList.map(mapCommission)
      );

      // Fetch the real Agency commission summary.
      const summaryResponse =
        await propertyApi.getAgencyCommissionSummary();

      const backendSummary =
        summaryResponse?.data?.summary;

      if (!backendSummary) {
        throw new Error(
          'Commission summary endpoint returned an unexpected response.'
        );
      }

      setSummary({
        paid:
          backendSummary.paid ?? emptySummary.paid,

        pending:
          backendSummary.pending ??
          emptySummary.pending,

        processing:
          backendSummary.processing ??
          emptySummary.processing,

        overdue:
          backendSummary.overdue ??
          emptySummary.overdue,

        cancelled:
          backendSummary.cancelled ??
          emptySummary.cancelled,
      });
    } catch (error: any) {
      console.error(
        'Failed to load Agency commission data:',
        error
      );

      setCommissions([]);
      setSummary(emptySummary);

      setLoadError(
        error?.message ||
        'Unable to load commission data.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Load commissions when the page first mounts.
  useEffect(() => {
    loadCommissionData();
  }, []);

  // Filter the real Commission ledger.
  const filteredCommissions = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return commissions.filter((commission) => {
      const matchesSearch =
        commission.agent.toLowerCase().includes(query) ||
        commission.property.toLowerCase().includes(query) ||
        commission.id.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'All' ||
        commission.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [commissions, searchQuery, statusFilter]);

  // Open the detail drawer for a real commission.
  const handleViewCommission = (
    commission: CommissionRecord
  ) => {
    setSelectedCommission(commission);
    setIsDrawerOpen(true);
  };

  // Export the currently filtered Commission ledger.
  const handleExport = () => {
    const headers = [
      'Commission ID',
      'Date',
      'Agent',
      'Property',
      'Deal Value',
      'Commission Pool',
      'Agency Earnings',
      'Agent Share %',
      'Agency Share %',
      'Status',
      'Due Date',
      'Paid Date',
    ];

    const rows = filteredCommissions.map((commission) => [
      commission.id,
      commission.date,
      commission.agent,
      commission.property,
      commission.dealValue,
      commission.pool,
      commission.agencyAmount,
      commission.agentSharePercent ?? '—',
      commission.agencySharePercent ?? '—',
      commission.status,
      commission.dueDate,
      commission.paidAt,
    ]);

    // Escape CSV values containing commas, quotes, or line breaks.
    const escapeCsv = (value: unknown) => {
      const stringValue = String(value ?? '');

      if (
        stringValue.includes(',') ||
        stringValue.includes('"') ||
        stringValue.includes('\n')
      ) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }

      return stringValue;
    };

    const csv = [
      headers.map(escapeCsv).join(','),
      ...rows.map((row) =>
        row.map(escapeCsv).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `luxora-commission-report-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  // Approve a Pending commission and move it to Processing.
  const handleApprovePayout = async (
    commission: CommissionRecord
  ) => {
    try {
      setIsActionLoading(true);
      setPayrollMessage('');

      // Ask the backend to move the commission into Processing.
      await propertyApi.updateAgencyCommissionStatus(
        commission.id,
        'Processing'
      );

      setPayrollMessage(
        `Commission ${commission.id} moved to Processing.`
      );

      // Refresh the ledger and KPI totals after the status change.
      await loadCommissionData();

      // Close the drawer after the operation succeeds.
      setSelectedCommission(null);
      setIsDrawerOpen(false);
    } catch (error: any) {
      console.error(
        'Failed to approve commission payout:',
        error
      );

      setPayrollMessage(
        error?.message ||
        'Unable to approve the commission payout.'
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  // Run payroll and mark all Processing commissions as Paid.
  const handleRunPayroll = async () => {
    try {
      setIsActionLoading(true);
      setPayrollMessage('');

      // Ask the backend to process all Processing commissions.
      const response =
        await propertyApi.runAgencyCommissionPayroll();

      // Read the response after the shared HTTP client unwraps the envelope.
      const payroll =
        response?.data?.payroll;

      const processedCount =
        Number(payroll?.processedCount || 0);

      const totalPaid =
        Number(payroll?.totalPaid || 0);

      if (processedCount === 0) {
        setPayrollMessage(
          'No commissions were ready for payroll.'
        );
      } else {
        setPayrollMessage(
          `${processedCount} commission${processedCount === 1 ? '' : 's'
          } marked as paid in the Luxora ledger — ${formatCurrency(
            totalPaid
          )}.`
        );
      }

      // Refresh the ledger and KPI totals after payroll completes.
      await loadCommissionData();
    } catch (error: any) {
      console.error(
        'Failed to run Agency payroll:',
        error
      );

      setPayrollMessage(
        error?.message ||
        'Unable to run Agency payroll.'
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  // Calculate the total Commission Pool represented by the current backend summary.
  const poolTotal =
    summary.paid.amount +
    summary.pending.amount +
    summary.processing.amount +
    summary.overdue.amount;

  // Calculate each status's real percentage of the Commission Pool.
  const getPoolPercentage = (amount: number) => {
    if (poolTotal <= 0) return 0;

    return Math.round(
      (amount / poolTotal) * 100
    );
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Finance & Commissions"
        subtitle="Manage agent payouts, revenue distribution, and financial operations."
        actions={
          <div className="flex gap-3">
            <GhostButton
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Report
            </GhostButton>

            <GoldButton
              onClick={handleRunPayroll}
              disabled={isActionLoading}
              className="flex items-center gap-2"
            >
              {isActionLoading ? (
                <>
                  <RefreshCcw className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <RefreshCcw className="h-4 w-4" />
                  Run Payroll
                </>
              )}
            </GoldButton>
          </div>
        }
      />

      {/* Show the result of the most recent finance action. */}
      {payrollMessage && (
        <div className="rounded-xl border border-gold-400/20 bg-gold-400/5 px-4 py-3 text-sm text-gold-300">
          {payrollMessage}
        </div>
      )}

      {/* Show backend loading state while real commission data is fetched. */}
      {isLoading && (
        <div className="rounded-xl border border-white/10 bg-navy-800/50 px-4 py-3 text-sm text-ink/60">
          Loading commission data...
        </div>
      )}

      {/* Show the actual API error when the Commission service fails. */}
      {loadError && !isLoading && (
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 px-4 py-3 text-sm text-rose-300">
          {loadError}
        </div>
      )}

      {/* Real Agency commission summary KPIs. */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Paid (YTD)"
          value={
            summary.paid.count > 0
              ? formatCurrency(summary.paid.amount)
              : '—'
          }
          trend={
            summary.paid.count > 0
              ? `${summary.paid.count} paid commission${summary.paid.count === 1 ? '' : 's'
              }`
              : 'No paid commissions'
          }
          trendColor="text-emerald-400"
          icon={CheckCircle2}
        />

        <KPICard
          title="Pending Payments"
          value={
            summary.pending.count > 0
              ? formatCurrency(summary.pending.amount)
              : '—'
          }
          trend={
            summary.pending.count > 0
              ? `${summary.pending.count} awaiting processing`
              : 'No pending commissions'
          }
          trendColor="text-yellow-400"
          icon={Clock}
        />

        <KPICard
          title="Processing"
          value={
            summary.processing.count > 0
              ? formatCurrency(summary.processing.amount)
              : '—'
          }
          trend={
            summary.processing.count > 0
              ? `${summary.processing.count} processing`
              : 'No processing commissions'
          }
          trendColor="text-blue-400"
          icon={RefreshCcw}
        />

        <KPICard
          title="Overdue"
          value={
            summary.overdue.count > 0
              ? formatCurrency(summary.overdue.amount)
              : '—'
          }
          trend={
            summary.overdue.count > 0
              ? `${summary.overdue.count} require attention`
              : 'No overdue commissions'
          }
          trendColor="text-rose-400"
          icon={AlertTriangle}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Commission Ledger */}
        <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by ID, Agent, or Property..."
            actions={
              <div className="flex gap-2">
                <select
                  className="bg-navy-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold-400"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <GhostButton className="px-3 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter Status
                </GhostButton>
              </div>
            }
          />

          <div className="flex-1 mt-6">
            <DataTable
              data={filteredCommissions}
              keyExtractor={(commission) =>
                String(commission.id)
              }
              columns={[
                {
                  header: 'ID & Date',
                  render: (commission) => (
                    <div>
                      <div
                        className="font-mono font-semibold text-gold-400 cursor-pointer hover:underline"
                        onClick={() =>
                          handleViewCommission(commission)
                        }
                      >
                        {String(commission.id)}
                      </div>

                      <div className="text-xs text-ink/60">
                        {String(commission.date)}
                      </div>
                    </div>
                  ),
                },

                {
                  header: 'Agent',
                  render: (commission) => (
                    <span className="font-medium text-cream">
                      {String(commission.agent)}
                    </span>
                  ),
                },

                {
                  header: 'Property & Deal Value',
                  render: (commission) => (
                    <div>
                      <div className="text-sm text-cream">
                        {String(commission.property)}
                      </div>

                      <div className="text-xs text-ink/60 mt-0.5">
                        Deal: {String(commission.dealValue)}
                      </div>
                    </div>
                  ),
                },

                {
                  header: 'Commission',
                  render: (commission) => (
                    <span className="font-bold text-emerald-400">
                      {String(commission.agencyAmount)}
                    </span>
                  ),
                },

                {
                  header: 'Status',
                  render: (commission) => (
                    <EnterpriseStatusBadge
                      status={String(commission.status)}
                    />
                  ),
                },

                {
                  header: (
                    <div className="text-right">
                      Actions
                    </div>
                  ),
                  className: 'text-right',
                  render: (commission) => (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          handleViewCommission(commission)
                        }
                        className="p-1.5 text-ink/60 hover:text-gold-400 rounded hover:bg-gold-400/10 transition-colors"
                        title="View Details"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  ),
                },
              ]}
            />

            {/* Show the number of real backend records currently displayed. */}
            {commissions.length > 0 && (
              <div className="mt-4 text-xs text-ink/50">
                {filteredCommissions.length} of{' '}
                {commissions.length} commission
                {commissions.length === 1 ? '' : 's'} shown.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Financial Insights */}
        <div className="space-y-6">
          {/* Commission Pool */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-6 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-gold-400" />
              Commission Pool
            </h3>

            {poolTotal > 0 ? (
              <>
                <div className="h-3 w-full rounded-full overflow-hidden bg-navy-950 border border-white/5 flex">
                  {summary.paid.amount > 0 && (
                    <div
                      className="bg-emerald-400 h-full"
                      style={{
                        width: `${getPoolPercentage(
                          summary.paid.amount
                        )}%`,
                      }}
                    />
                  )}

                  {summary.pending.amount > 0 && (
                    <div
                      className="bg-yellow-400 h-full"
                      style={{
                        width: `${getPoolPercentage(
                          summary.pending.amount
                        )}%`,
                      }}
                    />
                  )}

                  {summary.processing.amount > 0 && (
                    <div
                      className="bg-blue-400 h-full"
                      style={{
                        width: `${getPoolPercentage(
                          summary.processing.amount
                        )}%`,
                      }}
                    />
                  )}

                  {summary.overdue.amount > 0 && (
                    <div
                      className="bg-rose-400 h-full"
                      style={{
                        width: `${getPoolPercentage(
                          summary.overdue.amount
                        )}%`,
                      }}
                    />
                  )}
                </div>

                <div className="mt-6 space-y-2 text-xs text-ink/80">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      Paid
                    </span>

                    <span className="font-bold text-emerald-400">
                      {formatCurrency(summary.paid.amount)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-400" />
                      Pending
                    </span>

                    <span className="font-bold text-yellow-400">
                      {formatCurrency(summary.pending.amount)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      Processing
                    </span>

                    <span className="font-bold text-blue-400">
                      {formatCurrency(summary.processing.amount)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-rose-400" />
                      Overdue
                    </span>

                    <span className="font-bold text-rose-400">
                      {formatCurrency(summary.overdue.amount)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-white/5 bg-navy-900/40 px-4 py-4 text-sm text-ink/50">
                No commission pool data available.
              </div>
            )}
          </div>

          {/* Earnings Trend */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Earnings Trend
            </h3>

            {/* Monthly earnings are not yet provided by the backend. */}
            <div className="h-32 flex items-center justify-center rounded-lg border border-white/5 bg-navy-900/40">
              <span className="text-sm text-ink/50">
                No monthly earnings data available
              </span>
            </div>
          </div>

          {/* Approval Queue */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4">
              Approval Queue
            </h3>

            {summary.pending.count > 0 ? (
              <div className="space-y-3">
                {commissions
                  .filter(
                    (commission) =>
                      commission.status === 'Pending'
                  )
                  .slice(0, 3)
                  .map((commission) => (
                    <div
                      key={commission.id}
                      className="p-3 bg-navy-900/50 rounded-xl border border-white/5"
                    >
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className="font-bold text-cream">
                          {commission.id}
                        </span>

                        <span className="text-yellow-400 text-xs">
                          Pending
                        </span>
                      </div>

                      <div className="text-xs text-ink/60">
                        {commission.agencyAmount} •{' '}
                        {commission.agent}
                      </div>

                      <GhostButton
                        onClick={() =>
                          handleViewCommission(commission)
                        }
                        className="w-full mt-2 text-xs h-7"
                      >
                        Review
                      </GhostButton>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="rounded-lg border border-white/5 bg-navy-900/40 px-4 py-4 text-sm text-ink/50">
                No commissions awaiting approval.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Commission detail drawer */}
      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={
          selectedCommission
            ? `Commission: ${selectedCommission.id}`
            : 'Commission Details'
        }
        footerActions={
          <div className="flex gap-3 w-full">
            <GhostButton
              className="flex-1"
              onClick={() => setIsDrawerOpen(false)}
            >
              Close
            </GhostButton>

            <GoldButton
              className="flex-1"
              disabled={
                isActionLoading ||
                selectedCommission?.status !== 'Pending'
              }
              onClick={() => {
                if (!selectedCommission) return;

                handleApprovePayout(selectedCommission);
              }}
            >
              {isActionLoading
                ? 'Processing...'
                : 'Approve Payout'}
            </GoldButton>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-white/10 bg-navy-900/50">
            <h4 className="text-sm font-semibold text-cream mb-4">
              Commission Details
            </h4>

            <div className="space-y-3 text-sm text-ink/80">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Commission ID</span>

                <span className="font-medium text-cream">
                  {selectedCommission?.id || '—'}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Assigned Agent</span>

                <span className="font-medium text-cream">
                  {selectedCommission?.agent || '—'}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Property</span>

                <span className="font-medium text-cream">
                  {selectedCommission?.property || '—'}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Deal Value</span>

                <span className="font-medium text-cream">
                  {selectedCommission?.dealValue || '—'}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Commission Pool</span>

                <span className="font-medium text-cream">
                  {selectedCommission?.pool || '—'}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Agency Earnings</span>

                <span className="font-medium text-emerald-400">
                  {selectedCommission?.agencyAmount || '—'}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Agent Earnings</span>

                <span className="font-medium text-cream">
                  {selectedCommission?.agentAmount || '—'}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Agent Share</span>

                <span className="font-medium text-cream">
                  {selectedCommission?.agentSharePercent != null
                    ? `${selectedCommission.agentSharePercent}%`
                    : '—'}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Agency Share</span>

                <span className="font-medium text-cream">
                  {selectedCommission?.agencySharePercent != null
                    ? `${selectedCommission.agencySharePercent}%`
                    : '—'}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Status</span>

                <span className="font-medium text-cream">
                  {selectedCommission?.status || '—'}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Date</span>

                <span className="font-medium text-cream">
                  {selectedCommission?.date || '—'}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Due Date</span>

                <span className="font-medium text-cream">
                  {selectedCommission?.dueDate || '—'}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Paid Date</span>

                <span className="font-medium text-cream">
                  {selectedCommission?.paidAt || '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </EnterpriseDetailDrawer>
    </div>
  );
}