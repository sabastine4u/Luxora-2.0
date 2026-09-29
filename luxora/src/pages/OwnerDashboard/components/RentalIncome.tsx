import { useState, useEffect } from 'react';
import {
  Wallet,
  ArrowUpRight,
  FileText,
  Download,
  Eye,
  MessageSquare,
  TrendingUp,
  Home,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { EmptyState } from '../../../components/layout/EmptyState';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { useToast } from '../../../contexts/ToastContext';
import { paymentApi } from '../../../api/payment.api';
import ExportModal from './modals/ExportModal';

interface RentalPayment {
  _id: string;
  amount: number;
  paymentPeriod?: string;
  status: 'Pending' | 'Paid' | 'Overdue' | 'Failed' | string;
  paidAt?: string | null;
  createdAt?: string;
  reference?: string;
  notes?: string;
  tenant?: {
    _id?: string;
    fullName?: string;
    email?: string;
    phone?: string;
  } | null;
  property?: {
    _id?: string;
    title?: string;
    price?: number;
    transactionType?: string;
    priceFrequency?: string;
  } | null;
}

const formatFullMoney = (value: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatMoneyCompact = (value: number) => {
  if (!value) return '₦0';

  if (Math.abs(value) >= 1_000_000) {
    return `₦${(value / 1_000_000).toFixed(1)}M`;
  }

  if (Math.abs(value) >= 1_000) {
    return `₦${(value / 1_000).toFixed(0)}K`;
  }

  return `₦${value.toLocaleString('en-NG')}`;
};

const formatDate = (value?: string | null) => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatDateTime = (value?: string | null) => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const escapeCsvValue = (value: unknown) => {
  const stringValue = String(value ?? '');

  return `"${stringValue.replace(/"/g, '""')}"`;
};

const escapeHtml = (value: unknown) => {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const downloadBlob = (
  blob: Blob,
  fileName: string,
) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
};

const openPrintWindow = (
  title: string,
  html: string,
) => {
  const printWindow = window.open(
    '',
    '_blank',
    'width=1000,height=800',
  );

  if (!printWindow) {
    return false;
  }

  printWindow.document.open();
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>${escapeHtml(title)}</title>
        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 40px;
            font-family:
              Inter,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;
            color: #111827;
            background: #ffffff;
          }

          .header {
            display: flex;
            justify-content: space-between;
            gap: 24px;
            align-items: flex-start;
            margin-bottom: 32px;
          }

          .brand {
            font-size: 26px;
            font-weight: 800;
            letter-spacing: -0.02em;
          }

          .subtle {
            color: #6b7280;
            font-size: 13px;
          }

          .title {
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 6px;
          }

          .meta {
            text-align: right;
          }

          .summary {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 28px;
          }

          .summary-card {
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 16px;
          }

          .summary-label {
            color: #6b7280;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 6px;
          }

          .summary-value {
            font-size: 18px;
            font-weight: 700;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
          }

          th,
          td {
            padding: 11px 10px;
            border-bottom: 1px solid #e5e7eb;
            text-align: left;
            vertical-align: top;
            font-size: 12px;
          }

          th {
            background: #f9fafb;
            font-weight: 700;
          }

          .amount {
            font-weight: 700;
          }

          .status {
            font-weight: 700;
          }

          .status.paid {
            color: #047857;
          }

          .status.pending {
            color: #b45309;
          }

          .status.overdue,
          .status.failed {
            color: #b91c1c;
          }

          .footer {
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 11px;
          }

          .receipt {
            max-width: 720px;
            margin: 0 auto;
          }

          .receipt-header {
            padding-bottom: 20px;
            margin-bottom: 24px;
            border-bottom: 2px solid #111827;
          }

          .receipt-number {
            font-size: 12px;
            color: #6b7280;
            margin-top: 5px;
          }

          .receipt-total {
            margin-top: 24px;
            padding: 20px;
            border-radius: 12px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
          }

          .receipt-total-label {
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }

          .receipt-total-value {
            margin-top: 6px;
            font-size: 30px;
            font-weight: 800;
          }

          .detail-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-top: 24px;
          }

          .detail {
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 14px;
          }

          .detail-label {
            color: #6b7280;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 5px;
          }

          .detail-value {
            font-size: 13px;
            font-weight: 600;
          }

          .note {
            margin-top: 20px;
            padding: 14px;
            border-left: 3px solid #9ca3af;
            background: #f9fafb;
            font-size: 12px;
            color: #4b5563;
          }

          @media print {
            body {
              padding: 20px;
            }

            @page {
              margin: 12mm;
            }
          }

          @media (max-width: 720px) {
            body {
              padding: 20px;
            }

            .header {
              flex-direction: column;
            }

            .meta {
              text-align: left;
            }

            .summary {
              grid-template-columns: 1fr;
            }

            .detail-grid {
              grid-template-columns: 1fr;
            }

            th,
            td {
              font-size: 10px;
              padding: 8px 6px;
            }
          }
        </style>
      </head>
      <body>
        ${html}
        <script>
          window.onload = function () {
            setTimeout(function () {
              window.focus();
              window.print();
            }, 250);
          };

          window.onafterprint = function () {
            setTimeout(function () {
              window.close();
            }, 250);
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();

  return true;
};

export default function RentalIncome() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [payments, setPayments] = useState<RentalPayment[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [selectedPayment, setSelectedPayment] =
    useState<RentalPayment | null>(null);

  useEffect(() => {
    const loadOwnerPayments = async () => {
      try {
        const response = await paymentApi.getOwnerPayments();

        const backendPayments =
          response.data?.data?.payments ??
          response.data?.payments ??
          [];

        setPayments(backendPayments);
      } catch (error) {
        console.error(
          'Failed to load Owner rental payments:',
          error,
        );

        showToast({
          type: 'error',
          title: 'Rental income could not be loaded',
          description:
            'We could not retrieve your rental payment records.',
        });
      } finally {
        setIsLoadingPayments(false);
      }
    };

    void loadOwnerPayments();
  }, [showToast]);

  const currentYear = new Date().getFullYear();

  const paidPayments = payments.filter(
    payment => payment.status === 'Paid',
  );

  const ytdIncome = paidPayments
    .filter(
      payment =>
        new Date(
          payment.paidAt || payment.createdAt || '',
        ).getFullYear() === currentYear,
    )
    .reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0,
    );

  const monthlyIncome = paidPayments
    .filter(payment => {
      const paymentDate = new Date(
        payment.paidAt || payment.createdAt || '',
      );

      return (
        paymentDate.getFullYear() === currentYear &&
        paymentDate.getMonth() === new Date().getMonth()
      );
    })
    .reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0,
    );

  const outstandingRent = payments
    .filter(
      payment =>
        payment.status === 'Pending' ||
        payment.status === 'Overdue',
    )
    .reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0,
    );

  const monthlyChartData = Array.from(
    { length: 12 },
    (_, index) => {
      const date = new Date(
        currentYear,
        new Date().getMonth() - (11 - index),
        1,
      );

      const income = paidPayments
        .filter(payment => {
          const paymentDate = new Date(
            payment.paidAt || payment.createdAt || '',
          );

          return (
            paymentDate.getFullYear() ===
              date.getFullYear() &&
            paymentDate.getMonth() === date.getMonth()
          );
        })
        .reduce(
          (total, payment) =>
            total + Number(payment.amount || 0),
          0,
        );

      return {
        month: date.toLocaleDateString('en-US', {
          month: 'short',
        }),
        income,
      };
    },
  );

  const highestMonthlyIncome = Math.max(
    ...monthlyChartData.map(item => item.income),
    1,
  );

  const totalPaidIncome = paidPayments.reduce(
    (total, payment) =>
      total + Number(payment.amount || 0),
    0,
  );

  const buildStatementRows = () => {
    return payments.map(payment => ({
      date: formatDate(payment.paidAt || payment.createdAt),
      tenant:
        payment.tenant?.fullName ||
        'Not assigned',
      property:
        payment.property?.title ||
        'Property',
      amount: formatFullMoney(
        Number(payment.amount || 0),
      ),
      period: payment.paymentPeriod || '—',
      status: payment.status || '—',
      reference: payment.reference || '—',
    }));
  };

  const handleExport = (format: string) => {
    try {
      const rows = buildStatementRows();

      if (rows.length === 0) {
        showToast({
          type: 'error',
          title: 'Nothing to export',
          description:
            'There are no rental payment records available.',
        });
        return;
      }

      const normalizedFormat = format.toLowerCase();

      if (normalizedFormat === 'csv') {
        const headers = [
          'Date',
          'Tenant',
          'Property',
          'Amount',
          'Payment Period',
          'Status',
          'Reference',
        ];

        const csvContent = [
          headers.map(escapeCsvValue).join(','),
          ...rows.map(row =>
            [
              row.date,
              row.tenant,
              row.property,
              row.amount,
              row.period,
              row.status,
              row.reference,
            ]
              .map(escapeCsvValue)
              .join(','),
          ),
        ].join('\n');

        const blob = new Blob(
          [csvContent],
          {
            type: 'text/csv;charset=utf-8;',
          },
        );

        downloadBlob(
          blob,
          `luxora-rental-income-${currentYear}.csv`,
        );

        showToast({
          type: 'success',
          title: 'Statement exported',
          description:
            'Your rental income CSV has been downloaded.',
        });

        setIsExportModalOpen(false);
        return;
      }

      if (normalizedFormat === 'excel') {
        const tableRows = rows
          .map(
            row => `
              <tr>
                <td>${escapeHtml(row.date)}</td>
                <td>${escapeHtml(row.tenant)}</td>
                <td>${escapeHtml(row.property)}</td>
                <td>${escapeHtml(row.amount)}</td>
                <td>${escapeHtml(row.period)}</td>
                <td>${escapeHtml(row.status)}</td>
                <td>${escapeHtml(row.reference)}</td>
              </tr>
            `,
          )
          .join('');

        const excelHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <style>
                table {
                  border-collapse: collapse;
                  width: 100%;
                  font-family: Arial, sans-serif;
                }
                th, td {
                  border: 1px solid #d1d5db;
                  padding: 8px;
                  text-align: left;
                }
                th {
                  background: #f3f4f6;
                  font-weight: 700;
                }
              </style>
            </head>
            <body>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Tenant</th>
                    <th>Property</th>
                    <th>Amount</th>
                    <th>Payment Period</th>
                    <th>Status</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows}
                </tbody>
              </table>
            </body>
          </html>
        `;

        const blob = new Blob(
          [excelHtml],
          {
            type: 'application/vnd.ms-excel',
          },
        );

        downloadBlob(
          blob,
          `luxora-rental-income-${currentYear}.xls`,
        );

        showToast({
          type: 'success',
          title: 'Statement exported',
          description:
            'Your rental income spreadsheet has been downloaded.',
        });

        setIsExportModalOpen(false);
        return;
      }

      const paidCount = paidPayments.length;
      const pendingCount = payments.filter(
        payment => payment.status === 'Pending',
      ).length;
      const overdueCount = payments.filter(
        payment => payment.status === 'Overdue',
      ).length;

      const printRows = rows
        .map(
          row => `
            <tr>
              <td>${escapeHtml(row.date)}</td>
              <td>${escapeHtml(row.tenant)}</td>
              <td>${escapeHtml(row.property)}</td>
              <td class="amount">${escapeHtml(row.amount)}</td>
              <td>${escapeHtml(row.period)}</td>
              <td class="status ${String(row.status).toLowerCase()}">
                ${escapeHtml(row.status)}
              </td>
              <td>${escapeHtml(row.reference)}</td>
            </tr>
          `,
        )
        .join('');

      const statementHtml = `
        <div class="header">
          <div>
            <div class="brand">LUXORA</div>
            <div class="subtle">
              Owner Rental Income Statement
            </div>
          </div>

          <div class="meta">
            <div class="title">
              Rental Income Statement
            </div>
            <div class="subtle">
              Generated ${escapeHtml(
                formatDateTime(new Date().toISOString()),
              )}
            </div>
          </div>
        </div>

        <div class="summary">
          <div class="summary-card">
            <div class="summary-label">
              Paid Income
            </div>
            <div class="summary-value">
              ${escapeHtml(formatFullMoney(totalPaidIncome))}
            </div>
          </div>

          <div class="summary-card">
            <div class="summary-label">
              Outstanding
            </div>
            <div class="summary-value">
              ${escapeHtml(formatFullMoney(outstandingRent))}
            </div>
          </div>

          <div class="summary-card">
            <div class="summary-label">
              Payment Records
            </div>
            <div class="summary-value">
              ${payments.length}
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Tenant</th>
              <th>Property</th>
              <th>Amount</th>
              <th>Period</th>
              <th>Status</th>
              <th>Reference</th>
            </tr>
          </thead>

          <tbody>
            ${printRows}
          </tbody>
        </table>

        <div class="footer">
          Paid records: ${paidCount} |
          Pending records: ${pendingCount} |
          Overdue records: ${overdueCount}.
          This statement is generated from the rental payment
          records currently available in Luxora.
        </div>
      `;

      const didOpen = openPrintWindow(
        'Luxora Rental Income Statement',
        statementHtml,
      );

      if (!didOpen) {
        showToast({
          type: 'error',
          title: 'Export could not start',
          description:
            'Your browser blocked the print window. Please allow pop-ups for Luxora and try again.',
        });
        return;
      }

      showToast({
        type: 'success',
        title: 'Statement ready',
        description:
          'The statement has opened for printing or saving as PDF.',
      });

      setIsExportModalOpen(false);
    } catch (error) {
      console.error(
        'Failed to export rental income statement:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Export failed',
        description:
          'We could not generate the rental income statement.',
      });
    }
  };

  const handleDownloadReceipt = (
    payment: RentalPayment,
  ) => {
    try {
      const tenantName =
        payment.tenant?.fullName ||
        'Tenant not assigned';

      const propertyName =
        payment.property?.title ||
        'Property';

      const paymentAmount = formatFullMoney(
        Number(payment.amount || 0),
      );

      const receiptReference =
        payment.reference ||
        payment._id;

      const receiptHtml = `
        <div class="receipt">
          <div class="receipt-header">
            <div class="brand">LUXORA</div>
            <div class="subtle">
              Rental Payment Receipt
            </div>

            <div class="receipt-number">
              Receipt reference:
              ${escapeHtml(receiptReference)}
            </div>
          </div>

          <div>
            <div class="title">
              Payment Receipt
            </div>

            <div class="subtle">
              Issued ${escapeHtml(
                formatDateTime(
                  new Date().toISOString(),
                ),
              )}
            </div>
          </div>

          <div class="receipt-total">
            <div class="receipt-total-label">
              Payment Amount
            </div>

            <div class="receipt-total-value">
              ${escapeHtml(paymentAmount)}
            </div>
          </div>

          <div class="detail-grid">
            <div class="detail">
              <div class="detail-label">
                Tenant
              </div>
              <div class="detail-value">
                ${escapeHtml(tenantName)}
              </div>
            </div>

            <div class="detail">
              <div class="detail-label">
                Property
              </div>
              <div class="detail-value">
                ${escapeHtml(propertyName)}
              </div>
            </div>

            <div class="detail">
              <div class="detail-label">
                Payment Date
              </div>
              <div class="detail-value">
                ${escapeHtml(
                  formatDate(
                    payment.paidAt ||
                      payment.createdAt,
                  ),
                )}
              </div>
            </div>

            <div class="detail">
              <div class="detail-label">
                Payment Period
              </div>
              <div class="detail-value">
                ${escapeHtml(
                  payment.paymentPeriod ||
                    '—',
                )}
              </div>
            </div>

            <div class="detail">
              <div class="detail-label">
                Status
              </div>
              <div class="detail-value">
                ${escapeHtml(
                  payment.status ||
                    '—',
                )}
              </div>
            </div>

            <div class="detail">
              <div class="detail-label">
                Reference
              </div>
              <div class="detail-value">
                ${escapeHtml(
                  payment.reference ||
                    '—',
                )}
              </div>
            </div>
          </div>

          ${
            payment.notes
              ? `
                <div class="note">
                  <strong>Notes:</strong>
                  ${escapeHtml(payment.notes)}
                </div>
              `
              : ''
          }

          <div class="footer">
            This receipt was generated from the Luxora
            rental payment record for the transaction above.
          </div>
        </div>
      `;

      const didOpen = openPrintWindow(
        `Luxora Payment Receipt - ${receiptReference}`,
        receiptHtml,
      );

      if (!didOpen) {
        showToast({
          type: 'error',
          title: 'Receipt could not open',
          description:
            'Your browser blocked the receipt window. Please allow pop-ups for Luxora and try again.',
        });

        return;
      }

      showToast({
        type: 'success',
        title: 'Receipt ready',
        description:
          'The receipt has opened for printing or saving as PDF.',
      });
    } catch (error) {
      console.error(
        'Failed to generate payment receipt:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Receipt generation failed',
        description:
          'We could not generate the payment receipt.',
      });
    }
  };

  if (!isLoadingPayments && payments.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={
            <Wallet className="h-8 w-8 text-gold-400" />
          }
          title="No rental income available."
          description="You do not have any rented properties generating income yet."
          actionLabel="View Listings"
          onAction={() =>
            navigate(
              '/owner-dashboard?tab=Listing+Journey',
            )
          }
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
            Rental Income
          </h2>

          <p className="text-sm text-ink/60">
            Monitor rental performance, income, occupancy,
            and payment history.
          </p>
        </div>

        <div className="flex gap-3">
          <GhostButton
            onClick={() =>
              setIsExportModalOpen(true)
            }
          >
            <FileText className="h-4 w-4 mr-2" />
            Export Statement
          </GhostButton>

          <GoldButton
            onClick={() =>
              setIsExportModalOpen(true)
            }
          >
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </GoldButton>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: 'Monthly Income',
            value: formatMoneyCompact(monthlyIncome),
            icon: Wallet,
            color: 'text-cream',
            bg: 'bg-white/5',
          },
          {
            label: 'Total Rental (YTD)',
            value: formatMoneyCompact(ytdIncome),
            icon: ArrowUpRight,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
          },
          {
            label: 'Occupancy Rate',
            value: '—',
            icon: Home,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
          },
          {
            label: 'Outstanding Rent',
            value: formatMoneyCompact(
              outstandingRent,
            ),
            icon: TrendingUp,
            color: 'text-rose-400',
            bg: 'bg-rose-400/10',
          },
          {
            label: 'Net Income',
            value: '—',
            icon: TrendingUp,
            color: 'text-gold-400',
            bg: 'bg-gold-400/10',
          },
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
            <h3 className="font-heading text-lg font-bold text-cream mb-6">
              Monthly Rental Income (Last 12 Months)
            </h3>

            <div className="h-[250px] flex items-end gap-2 border-b border-white/10 pb-2">
              {monthlyChartData.map((d, i) => {
                const heightPercent =
                  (d.income /
                    highestMonthlyIncome) *
                  100;

                return (
                  <div
                    key={i}
                    className="group relative flex w-full flex-col justify-end items-center h-full"
                  >
                    <div
                      className="w-full bg-gold-400 rounded-t-sm transition-all duration-300 group-hover:bg-gold-300"
                      style={{
                        height: `${heightPercent}%`,
                        minHeight:
                          d.income > 0
                            ? '4px'
                            : '0',
                      }}
                    />

                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-navy-900 border border-white/10 rounded px-2 py-1 text-xs text-cream whitespace-nowrap z-10 pointer-events-none">
                      {formatMoneyCompact(
                        d.income,
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between mt-3 text-xs text-ink/50">
              {monthlyChartData.map(
                (d, i) => (
                  <div
                    key={i}
                    className="w-full text-center"
                  >
                    {d.month}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Property Performance Table */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="font-heading text-lg font-bold text-cream">
                Property Performance
              </h3>
            </div>

            <div className="hidden md:block w-full">
              <DataTable
                data={payments}
                keyExtractor={payment =>
                  payment._id
                }
                columns={[
                  {
                    header: 'Property',
                    render: payment => (
                      <span className="font-medium text-cream truncate max-w-[150px]">
                        {payment.property?.title ||
                          'Property'}
                      </span>
                    ),
                  },
                  {
                    header: 'Tenant',
                    render: payment => (
                      <span className="text-ink/60">
                        {payment.tenant?.fullName ||
                          'Not assigned'}
                      </span>
                    ),
                  },
                  {
                    header: 'Payment Amount',
                    render: payment => (
                      <span className="font-bold text-gold-400">
                        {formatMoneyCompact(
                          Number(
                            payment.amount ||
                              0,
                          ),
                        )}
                      </span>
                    ),
                  },
                  {
                    header: 'Occupancy',
                    render: () => (
                      <span className="text-ink/60">
                        —
                      </span>
                    ),
                  },
                  {
                    header: 'Period',
                    render: payment => (
                      <span className="text-ink/60">
                        {payment.paymentPeriod ||
                          '—'}
                      </span>
                    ),
                  },
                  {
                    header: (
                      <div className="text-right">
                        Status
                      </div>
                    ),
                    className: 'text-right',
                    render: payment => (
                      <EnterpriseStatusBadge
                        status={payment.status}
                      />
                    ),
                  },
                ]}
              />
            </div>

            <div className="md:hidden divide-y divide-white/5">
              {payments.map(payment => (
                <div
                  key={payment._id}
                  className="p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-cream">
                        {payment.property?.title ||
                          'Property'}
                      </div>

                      <div className="text-xs text-ink/50 mt-1">
                        Tenant:{' '}
                        {payment.tenant?.fullName ||
                          'Not assigned'}
                      </div>
                    </div>

                    <EnterpriseStatusBadge
                      status={payment.status}
                    />
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs text-ink/50 mb-1">
                        Payment Amount
                      </div>

                      <div className="font-bold text-gold-400">
                        {formatMoneyCompact(
                          Number(
                            payment.amount ||
                              0,
                          ),
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-ink/50 mb-1">
                        Period
                      </div>

                      <div className="text-sm text-cream">
                        {payment.paymentPeriod ||
                          '—'}
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
              <h3 className="font-heading text-lg font-bold text-cream">
                Payment History
              </h3>
            </div>

            <div className="hidden md:block w-full">
              <DataTable
                data={payments}
                keyExtractor={payment =>
                  payment._id
                }
                columns={[
                  {
                    header: 'Date',
                    render: payment => (
                      <span className="text-ink/60 whitespace-nowrap">
                        {formatDate(
                          payment.paidAt ||
                            payment.createdAt,
                        )}
                      </span>
                    ),
                  },
                  {
                    header: 'Tenant',
                    render: payment => (
                      <span className="text-cream font-medium">
                        {payment.tenant?.fullName ||
                          'Not assigned'}
                      </span>
                    ),
                  },
                  {
                    header: 'Property',
                    render: payment => (
                      <span className="text-ink/60 truncate max-w-[150px]">
                        {payment.property?.title ||
                          'Property'}
                      </span>
                    ),
                  },
                  {
                    header: 'Reference',
                    render: payment => (
                      <span className="text-ink/60">
                        {payment.reference ||
                          '—'}
                      </span>
                    ),
                  },
                  {
                    header: 'Amount',
                    render: payment => (
                      <span className="font-bold text-emerald-400">
                        +
                        {formatMoneyCompact(
                          Number(
                            payment.amount ||
                              0,
                          ),
                        )}
                      </span>
                    ),
                  },
                  {
                    header: (
                      <div className="text-right">
                        Status
                      </div>
                    ),
                    className: 'text-right',
                    render: payment => (
                      <EnterpriseStatusBadge
                        status={payment.status}
                      />
                    ),
                  },
                  {
                    header: (
                      <div className="text-right">
                        Action
                      </div>
                    ),
                    className: 'text-right',
                    render: payment => (
                      <GhostButton
                        size="sm"
                        onClick={() =>
                          setSelectedPayment(
                            payment,
                          )
                        }
                      >
                        View
                      </GhostButton>
                    ),
                  },
                ]}
              />
            </div>

            <div className="md:hidden divide-y divide-white/5">
              {payments.map(payment => (
                <div
                  key={payment._id}
                  className="p-4 space-y-3 cursor-pointer"
                  onClick={() =>
                    setSelectedPayment(
                      payment,
                    )
                  }
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-cream">
                        {payment.tenant?.fullName ||
                          'Not assigned'}
                      </div>

                      <div className="text-xs text-ink/50 mt-1">
                        {formatDate(
                          payment.paidAt ||
                            payment.createdAt,
                        )}
                        {' • '}
                        {payment.reference ||
                          'No reference'}
                      </div>
                    </div>

                    <EnterpriseStatusBadge
                      status={payment.status}
                    />
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="text-xs text-ink/50 truncate max-w-[150px]">
                      {payment.property?.title ||
                        'Property'}
                    </div>

                    <div className="font-bold text-emerald-400 text-lg">
                      +
                      {formatMoneyCompact(
                        Number(
                          payment.amount ||
                            0,
                        ),
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Financial Summary & Upcoming */}
        <div className="space-y-8">
          {/* Financial Summary */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-6">
              Financial Summary (YTD)
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-sm font-semibold text-emerald-400">
                  Total Income
                </span>

                <span className="font-bold text-emerald-400">
                  {formatMoneyCompact(
                    ytdIncome,
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-sm font-semibold text-rose-400">
                  Total Expenses
                </span>

                <span className="font-bold text-rose-400">
                  —
                </span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-xl bg-navy-900 border border-gold-400/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                <div>
                  <span className="text-xs text-ink/50 uppercase font-semibold block mb-1">
                    Net Profit
                  </span>

                  <span className="font-bold text-gold-400 text-2xl">
                    —
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs text-ink/50 uppercase font-semibold block mb-1">
                    Margin
                  </span>

                  <span className="font-bold text-emerald-400 text-xl">
                    —
                  </span>
                </div>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-ink/60 uppercase tracking-wider mb-4">
              Expense Breakdown
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-cream">
                  Expense tracking
                </span>

                <span className="text-rose-400 font-medium">
                  Not available
                </span>
              </div>
            </div>
          </div>

          {/* Upcoming Payments */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-6">
              Upcoming Payments
            </h3>

            <div className="space-y-4">
              {payments
                .filter(
                  payment =>
                    payment.status ===
                      'Pending' ||
                    payment.status ===
                      'Overdue',
                )
                .map(payment => (
                  <div
                    key={payment._id}
                    className="p-4 rounded-xl bg-navy-900/50 border border-white/5 relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />

                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-cream">
                        {payment.tenant
                          ?.fullName ||
                          'Tenant not assigned'}
                      </div>

                      <div className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                        {payment.status ===
                        'Overdue'
                          ? 'Overdue'
                          : 'Pending'}
                      </div>
                    </div>

                    <div className="text-xs text-ink/50 mb-3 truncate">
                      {payment.property
                        ?.title ||
                        'Property'}
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                      <div className="font-bold text-cream">
                        {formatMoneyCompact(
                          Number(
                            payment.amount ||
                              0,
                          ),
                        )}
                      </div>

                      <div className="flex gap-2">
                        <GhostButton
                          size="sm"
                          className="px-2"
                          onClick={() =>
                            setSelectedPayment(
                              payment,
                            )
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </GhostButton>

                        <GhostButton
                          size="sm"
                          className="px-2"
                          onClick={() =>
                            navigate(
                              '/owner-dashboard?tab=Messages',
                            )
                          }
                        >
                          <MessageSquare className="h-4 w-4" />
                        </GhostButton>
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
        onClose={() =>
          setIsExportModalOpen(false)
        }
        onExport={handleExport}
        title="Export Statement"
      />

      <EnterpriseDetailDrawer
        isOpen={!!selectedPayment}
        onClose={() =>
          setSelectedPayment(null)
        }
        title="Payment Details"
        footerActions={
          <>
            <GhostButton
              className="flex-1 justify-center"
              onClick={() =>
                navigate(
                  '/owner-dashboard?tab=Messages',
                )
              }
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Tenant
            </GhostButton>

            <GoldButton
              className="flex-1 justify-center"
              onClick={() => {
                if (selectedPayment) {
                  handleDownloadReceipt(
                    selectedPayment,
                  );
                }
              }}
            >
              <Download className="h-4 w-4 mr-2" />
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
                  {selectedPayment.tenant
                    ?.fullName ||
                    'Tenant not assigned'}
                </div>

                <div className="text-xs text-ink/60">
                  {selectedPayment.property
                    ?.title ||
                    'Property'}
                </div>
              </div>

              <EnterpriseStatusBadge
                status={
                  selectedPayment.status
                }
              />
            </div>

            <div className="p-4 rounded-xl bg-navy-900 border border-white/5">
              <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">
                Amount
              </div>

              <div className="font-bold text-gold-400 text-2xl mb-1">
                {formatFullMoney(
                  Number(
                    selectedPayment.amount ||
                      0,
                  ),
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">
                    Payment Date
                  </div>

                  <div className="text-sm text-cream font-medium">
                    {selectedPayment.paidAt
                      ? formatDate(
                          selectedPayment.paidAt,
                        )
                      : 'Not paid yet'}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">
                    Reference
                  </div>

                  <div className="text-sm text-cream font-medium">
                    {selectedPayment.reference ||
                      'No reference'}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">
                    Payment Period
                  </div>

                  <div className="text-sm text-cream font-medium">
                    {selectedPayment.paymentPeriod ||
                      '—'}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">
                    Created
                  </div>

                  <div className="text-sm text-cream font-medium">
                    {formatDate(
                      selectedPayment.createdAt,
                    )}
                  </div>
                </div>
              </div>

              {selectedPayment.notes && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="text-[10px] text-ink/50 uppercase font-semibold mb-1">
                    Notes
                  </div>

                  <div className="text-sm text-cream/80 leading-6">
                    {selectedPayment.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>
    </div>
  );
}