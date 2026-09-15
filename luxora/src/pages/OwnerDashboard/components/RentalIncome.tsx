// Import React hooks needed for loading real rental payment data.
import { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, FileText, Download, Eye, MessageSquare, TrendingUp, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout/EmptyState';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { useToast } from '../../../contexts/ToastContext';
// Import the real Owner rental payment API.
import { paymentApi } from '../../../api/payment.api';
import ExportModal from './modals/ExportModal';

export default function RentalIncome() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const formatMoney = (val: number) => `₦${(val / 1000000).toFixed(1)}M`;

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  // Store the real rental payments returned by the backend.
  const [payments, setPayments] = useState<any[]>([]);

  // Track whether the Owner's rental payments are currently loading.
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  // Store the real Payment record selected from the backend data.
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);

  // Load the authenticated Owner's real rental payments from MongoDB.
  useEffect(() => {
    const loadOwnerPayments = async () => {
      try {
        // Request the Owner's rental payment records.
        const response = await paymentApi.getOwnerPayments();

        // Read the payments from the backend response envelope.
        const backendPayments =
          response.data?.data?.payments ??
          response.data?.payments ??
          [];

        // Store the real payments for the Rental Income dashboard.
        setPayments(backendPayments);
      } catch (error) {
        // Keep the dashboard usable when the payment request fails.
        console.error('Failed to load Owner rental payments:', error);

        showToast({
          type: 'error',
          title: 'Rental income could not be loaded',
          description: 'We could not retrieve your rental payment records.',
        });
      } finally {
        // Stop the loading state once the request completes.
        setIsLoadingPayments(false);
      }
    };

    void loadOwnerPayments();
  }, [showToast]);

  // Calculate the current calendar year's rental income from real paid payments.
  const currentYear = new Date().getFullYear();

  const paidPayments = payments.filter(
    payment => payment.status === 'Paid'
  );

  const ytdIncome = paidPayments
    .filter(payment => new Date(payment.paidAt || payment.createdAt).getFullYear() === currentYear)
    .reduce((total, payment) => total + payment.amount, 0);

  // Calculate rental income received during the current month.
  const monthlyIncome = paidPayments
    .filter(payment => {
      const paymentDate = new Date(payment.paidAt || payment.createdAt);

      return (
        paymentDate.getFullYear() === currentYear &&
        paymentDate.getMonth() === new Date().getMonth()
      );
    })
    .reduce((total, payment) => total + payment.amount, 0);

  // Calculate outstanding rent from pending and overdue payments.
  const outstandingRent = payments
    .filter(
      payment =>
        payment.status === 'Pending' ||
        payment.status === 'Overdue'
    )
    .reduce((total, payment) => total + payment.amount, 0);

  // Build the last 12 months of rental income from real paid payments.
  const monthlyChartData = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(currentYear, new Date().getMonth() - (11 - index), 1);

    const income = paidPayments
      .filter(payment => {
        const paymentDate = new Date(payment.paidAt || payment.createdAt);

        return (
          paymentDate.getFullYear() === date.getFullYear() &&
          paymentDate.getMonth() === date.getMonth()
        );
      })
      .reduce((total, payment) => total + payment.amount, 0);

    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      income,
    };
  });
  // Use the highest real monthly income as the chart's 100% reference point.
  const highestMonthlyIncome = Math.max(
    ...monthlyChartData.map(item => item.income),
    1
  );
  const handleExport = (format: string) => {
    showToast({ type: 'success', title: 'Export Started', description: `Your rental statement is being exported as ${format.toUpperCase()}.` });
    setIsExportModalOpen(false);
  };

  // Show the empty state only after the real payment request has finished loading.
  if (!isLoadingPayments && payments.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={<Wallet className="h-8 w-8 text-gold-400" />}
          title="No rental income available."
          description="You do not have any rented properties generating income yet."
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
          <h2 className="font-heading text-2xl font-bold text-cream">Rental Income</h2>
          <p className="text-sm text-ink/60">Monitor rental performance, income, occupancy, and payment history.</p>
        </div>
        <div className="flex gap-3">
          <GhostButton onClick={() => setIsExportModalOpen(true)}>
            <FileText className="h-4 w-4 mr-2" /> Export Statement
          </GhostButton>
          <GoldButton onClick={() => setIsExportModalOpen(true)}>
            <Download className="h-4 w-4 mr-2" /> Download Report
          </GoldButton>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Monthly Income', value: formatMoney(monthlyIncome), icon: Wallet, color: 'text-cream', bg: 'bg-white/5' },
          { label: 'Total Rental (YTD)', value: formatMoney(ytdIncome), icon: ArrowUpRight, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Occupancy Rate', value: '—', icon: Home, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Outstanding Rent', value: formatMoney(outstandingRent), icon: TrendingUp, color: 'text-rose-400', bg: 'bg-rose-400/10' },
          { label: 'Net Income', value: '—', icon: TrendingUp, color: 'text-gold-400', bg: 'bg-gold-400/10' },
        ].map((kpi, idx) => (
          <KPICard
            key={idx}
            title={kpi.label}
            value={kpi.value}
            icon={kpi.icon}
            iconColor={kpi.color}
            backgroundColor={kpi.bg}
            hoverEffect="none"
            iconBorder={false}
            valueTypography="heading"
            labelTypography="uppercase-small"
            trendPosition="inline-label-top"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Col: Chart & Property Perf */}
        <div className="xl:col-span-2 space-y-8">

          {/* Chart */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-6">Monthly Rental Income (Last 12 Months)</h3>
            <div className="h-[250px] flex items-end gap-2 border-b border-white/10 pb-2">
              {monthlyChartData.map((d, i) => {

                const heightPercent = (d.income / highestMonthlyIncome) * 100;
                return (
                  <div key={i} className="group relative flex w-full flex-col justify-end items-center h-full">
                    <div
                      className="w-full bg-gold-400 rounded-t-sm transition-all duration-300 group-hover:bg-gold-300"
                      style={{ height: `${heightPercent}%`, minHeight: d.income > 0 ? '4px' : '0' }}
                    />
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-navy-900 border border-white/10 rounded px-2 py-1 text-xs text-cream whitespace-nowrap z-10 pointer-events-none">
                      {formatMoney(d.income)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-3 text-xs text-ink/50">
              {monthlyChartData.map((d, i) => (
                <div key={i} className="w-full text-center">
                  {d.month}
                </div>
              ))}
            </div>
          </div>

          {/* Property Performance Table */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="font-heading text-lg font-bold text-cream">Property Performance</h3>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block w-full">
              <DataTable
                // Display property performance derived from real rental payments.
                data={payments}
                // Use the MongoDB payment ID as the table row key.
                keyExtractor={(payment) => payment._id}
                columns={[
                  {
                    header: "Property",
                    render: (payment) => (
                      <span className="font-medium text-cream truncate max-w-[150px]">
                        {payment.property?.title || 'Property'}
                      </span>
                    )
                  },
                  {
                    header: "Tenant",
                    render: (payment) => (
                      <span className="text-ink/60">
                        {payment.tenant?.fullName || 'Not assigned'}
                      </span>
                    )
                  },
                  {
                    header: "Payment Amount",
                    render: (payment) => (
                      <span className="font-bold text-gold-400">
                        {formatMoney(payment.amount)}
                      </span>
                    )
                  }, {
                    header: "Occupancy",
                    render: () => (
                      <span className="text-ink/60">—</span>
                    )
                  },
                  {
                    header: "Period",
                    render: (payment) => (
                      <span className="text-ink/60">
                        {payment.paymentPeriod || '—'}
                      </span>
                    )
                  },
                  {
                    header: <div className="text-right">Status</div>,
                    className: "text-right",

                    render: (payment) => (
                      <EnterpriseStatusBadge status={payment.status} />
                    )
                  }
                ]}
              />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-white/5">
              {/* Render the real rental payment records on mobile. */}
              {payments.map(payment => (
                <div key={payment._id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-cream">
                        {payment.property?.title || 'Property'}
                      </div>

                      <div className="text-xs text-ink/50 mt-1">
                        Tenant: {payment.tenant?.fullName || 'Not assigned'}
                      </div>
                    </div>
                    <EnterpriseStatusBadge status={payment.status} />
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs text-ink/50 mb-1">Payment Amount</div>
                      <div className="font-bold text-gold-400">
                        {formatMoney(payment.amount)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-ink/50 mb-1">Period</div>
                      <div className="text-sm text-cream">
                        {payment.paymentPeriod || '—'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment History */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="font-heading text-lg font-bold text-cream">Payment History</h3>
            </div>

            <div className="hidden md:block w-full">
              <DataTable
                // Display the real rental payments returned by the backend.
                data={payments}
                // Use the MongoDB payment ID for the real payment record.
                keyExtractor={(payment) => payment._id}
                columns={[
                  {
                    header: "Date",
                    render: (payment) => (
                      <span className="text-ink/60 whitespace-nowrap">
                        {payment.paidAt
                          ? new Date(payment.paidAt).toLocaleDateString()
                          : '—'}
                      </span>
                    )
                  },
                  {
                    header: "Tenant",
                    render: (payment) => (
                      <span className="text-cream font-medium">
                        {payment.tenant?.fullName || 'Not assigned'}
                      </span>
                    )
                  },
                  {
                    header: "Property",
                    render: (payment) => (
                      <span className="text-ink/60 truncate max-w-[150px]">
                        {payment.property?.title || 'Property'}
                      </span>
                    )
                  }, {
                    header: "Reference",
                    render: (payment) => (
                      <span className="text-ink/60">
                        {payment.reference || '—'}
                      </span>
                    )
                  },
                  {
                    header: "Amount",
                    render: (payment) => (
                      <span className="font-bold text-emerald-400">
                        +{formatMoney(payment.amount)}
                      </span>
                    )
                  },
                  {
                    header: <div className="text-right">Status</div>,
                    className: "text-right",
                    render: (payment) => (
                      <EnterpriseStatusBadge status={payment.status} />
                    )
                  },
                  {
                    header: <div className="text-right">Action</div>,
                    className: "text-right",
                    render: (payment) => (
                      <GhostButton
                        size="sm"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        View
                      </GhostButton>
                    )
                  }
                ]}
              />
            </div>

            <div className="md:hidden divide-y divide-white/5">
              {/* Render the real payment records on mobile. */}
              {payments.map(payment => (
                <div
                  key={payment._id}
                  className="p-4 space-y-3 cursor-pointer"
                  onClick={() => setSelectedPayment(payment)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-cream">
                        {payment.tenant?.fullName || 'Not assigned'}
                      </div>

                      <div className="text-xs text-ink/50 mt-1">
                        {payment.paidAt
                          ? new Date(payment.paidAt).toLocaleDateString()
                          : 'Date unavailable'}
                        {' • '}
                        {payment.reference || 'No reference'}
                      </div>
                    </div>
                    <EnterpriseStatusBadge status={payment.status} />
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-xs text-ink/50 truncate max-w-[150px]">
                      {payment.property?.title || 'Property'}
                    </div>

                    <div className="font-bold text-emerald-400 text-lg">
                      +{formatMoney(payment.amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Profit & Upcoming */}
        <div className="space-y-8">

          {/* Net Profit & Expenses */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-6">Financial Summary (YTD)</h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-sm font-semibold text-emerald-400">Total Income</span>
                <span className="font-bold text-emerald-400">
                  {formatMoney(ytdIncome)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-sm font-semibold text-rose-400">Total Expenses</span>
                <span className="font-bold text-rose-400">—</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-xl bg-navy-900 border border-gold-400/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                <div>
                  <span className="text-xs text-ink/50 uppercase font-semibold block mb-1">Net Profit</span>
                  <span className="font-bold text-gold-400 text-2xl">—</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-ink/50 uppercase font-semibold block mb-1">Margin</span>
                  <span className="font-bold text-emerald-400 text-xl">—</span>
                </div>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-ink/60 uppercase tracking-wider mb-4">Expense Breakdown</h4>
            <div className="space-y-3">
              {[
                {
                  label: 'Expense tracking',
                  amount: 'Not available',
                },
              ].map((exp, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-cream">{exp.label}</span>
                  <span className="text-rose-400 font-medium">{exp.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Payments */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-6">Upcoming Payments</h3>
            <div className="space-y-4">
              {/* Show real pending and overdue rental payments. */}
              {payments
                .filter(
                  payment =>
                    payment.status === 'Pending' ||
                    payment.status === 'Overdue'
                )
                .map(payment => (
                  <div
                    key={payment._id}
                    className="p-4 rounded-xl bg-navy-900/50 border border-white/5 relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-cream">
                        {payment.tenant?.fullName || 'Tenant not assigned'}
                      </div>
                      <div className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                        {payment.status === 'Overdue' ? 'Overdue' : 'Pending'}
                      </div>
                    </div>
                    <div className="text-xs text-ink/50 mb-3 truncate">
                      {payment.property?.title || 'Property'}
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                      <div className="font-bold text-cream">
                        {formatMoney(payment.amount)}
                      </div>
                      <div className="flex gap-2">
                        <GhostButton size="sm" className="px-2" onClick={() => setSelectedPayment(payment)}><Eye className="h-4 w-4" /></GhostButton>
                        <GhostButton size="sm" className="px-2" onClick={() => navigate('/owner-dashboard?tab=Messages')}><MessageSquare className="h-4 w-4" /></GhostButton>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        title="Export Statement"
      />

      <EnterpriseDetailDrawer
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        title="Payment Details"
        footerActions={
          <>
            <GhostButton className="flex-1 justify-center" onClick={() => navigate('/owner-dashboard?tab=Messages')}>
              <MessageSquare className="h-4 w-4 mr-2" /> Contact Tenant
            </GhostButton>
            <GoldButton className="flex-1 justify-center" onClick={() => showToast({ type: 'success', title: 'Payment Receipt', description: 'Receipt has been generated and sent.' })}>
              Download Receipt
            </GoldButton>
          </>
        }
      >
        {selectedPayment && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 items-center justify-between p-4 rounded-xl bg-navy-900 border border-white/5">
              <div>
                <div className="font-semibold text-cream text-lg">
                  {selectedPayment.tenant?.fullName || 'Tenant not assigned'}
                </div>
                <div className="text-xs text-ink/60">
                  {selectedPayment.property?.title || 'Property'}
                </div>
              </div>
              {/* Display the real payment status returned by the backend. */}
              <EnterpriseStatusBadge status={selectedPayment.status} />
            </div>

            <div className="p-4 rounded-xl bg-navy-900 border border-white/5">
              <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">Amount</div>
              <div className="font-bold text-gold-400 text-2xl mb-1">{formatMoney(selectedPayment.amount)}</div>

              <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">
                    Payment Date
                  </div>

                  <div className="text-sm text-cream font-medium">
                    {selectedPayment.paidAt
                      ? new Date(selectedPayment.paidAt).toLocaleDateString()
                      : 'Not paid yet'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">
                    Reference
                  </div>

                  <div className="text-sm text-cream font-medium">
                    {selectedPayment.reference || 'No reference'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>
    </div>
  );
}
