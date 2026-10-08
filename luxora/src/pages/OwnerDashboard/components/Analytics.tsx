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
// Import the real Owner analytics API.
import { analyticsApi } from '../../../api/analytics.api';

const escapeCsvValue = (value: unknown) => {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
};

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');


    type OwnerAnalyticsPropertyExportRow = {
  title: string;
  status: string;
  views: number;
  favorites: number;
  viewings: number;
  offers: number;
  acceptedOffers: number;
};

type OwnerAnalyticsIncomeExportRow = {
  month: string;
  income: number;
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
};

const formatExportDate = (value?: string | null) => {
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

const formatExportDateTime = (value?: string | null) => {
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

const formatExportMoney = (value: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value || 0);

const openAnalyticsPrintWindow = (
  title: string,
  html: string,
) => {
  const printWindow = window.open(
    '',
    '_blank',
    'width=1100,height=850',
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
            padding: 32px;
            font-family: Arial, sans-serif;
            color: #111827;
            background: #ffffff;
          }

          .header {
            display: flex;
            justify-content: space-between;
            gap: 24px;
            margin-bottom: 24px;
          }

          .brand {
            font-size: 26px;
            font-weight: 800;
          }

          .title {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 4px;
          }

          .subtle {
            color: #6b7280;
            font-size: 12px;
          }

          .meta {
            text-align: right;
          }

          .summary {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 24px;
          }

          .summary-card,
          .item {
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 12px;
          }

          .label {
            font-size: 10px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: .08em;
            margin-bottom: 5px;
          }

          .value {
            font-size: 17px;
            font-weight: 700;
          }

          .section {
            margin-top: 24px;
            page-break-inside: avoid;
          }

          .section h2 {
            font-size: 15px;
            margin: 0 0 10px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            border-bottom: 1px solid #e5e7eb;
            padding: 8px;
            text-align: left;
            font-size: 11px;
          }

          th {
            background: #f9fafb;
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .item-title {
            font-size: 11px;
            font-weight: 700;
            margin-bottom: 4px;
          }

          .item-value {
            font-size: 15px;
            font-weight: 700;
          }

          .footer {
            margin-top: 24px;
            padding-top: 12px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 10px;
          }

          @media print {
            body {
              padding: 16px;
            }

            @page {
              margin: 10mm;
            }
          }

          @media (max-width: 760px) {
            .header {
              flex-direction: column;
            }

            .meta {
              text-align: left;
            }

            .summary,
            .grid {
              grid-template-columns: 1fr;
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

export default function Analytics() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Store the real analytics response returned by the backend.
  const [analytics, setAnalytics] =
    useState<any | null>(null);

  // Track whether Owner analytics are still loading.
  const [isLoadingAnalytics, setIsLoadingAnalytics] =
    useState(true);

  // Load the authenticated Owner's real analytics from the backend.
  useEffect(() => {
    const loadOwnerAnalytics = async () => {
      try {
        // Request aggregated analytics for the authenticated Owner.
        const response =
          await analyticsApi.getOwnerAnalytics();

        // Read the analytics object from the backend response envelope.
        const backendAnalytics =
          response.data?.data?.analytics ??
          response.data?.analytics ??
          null;

        // Store the real analytics payload for the dashboard.
        setAnalytics(backendAnalytics);
      } catch (error) {
        // Keep the dashboard usable when the analytics request fails.
        console.error(
          'Failed to load Owner analytics:',
          error,
        );

        showToast({
          type: 'error',
          title: 'Analytics could not be loaded',
          description:
            'We could not retrieve your property analytics.',
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
  const topProperties =
    analytics?.topProperties ?? [];

  // Read the real daily Property view history returned by the backend.
  const dailyPropertyViews: any[] =
    analytics?.dailyPropertyViews ?? [];

  // Create a lookup map so each calendar date can be read quickly.
  const dailyViewMap = new Map(
    dailyPropertyViews.map(
      (item: any) => [
        item.date,
        item.views ?? 0,
      ],
    ),
  );

  // Build a continuous 30-day series from the real backend view events.
  const viewTrendData = Array.from(
    { length: 30 },
    (_, index) => {
      const date = new Date();

      // Calculate each day starting from 29 days ago through today.
      date.setDate(
        date.getDate() - (29 - index),
      );

      // Convert the date to the same YYYY-MM-DD format returned by the backend.
      const dateKey = date
        .toISOString()
        .slice(0, 10);

      return {
        date: dateKey,
        views:
          dailyViewMap.get(dateKey) ?? 0,
      };
    },
  );

  // Find the highest daily view count for proportional chart bars.
  const maxViews = Math.max(
    ...viewTrendData.map(
      (item: any) => item.views,
    ),
    1,
  );

  // Calculate the total views represented by the 30-day chart.
  const trendTotalViews =
    viewTrendData.reduce(
      (total: number, item: any) =>
        total + item.views,
      0,
    );

  // Calculate the total number of offers from the real property analytics.
  const totalOffers =
    topProperties.reduce(
      (
        total: number,
        property: any,
      ) =>
        total +
        (property.offers ?? 0),
      0,
    );

  // Build the conversion funnel using only real analytics metrics.
  const funnelStages = [
    {
      stage: 'Views',
      value: String(
        metrics.totalPropertyViews ?? 0,
      ),
      dropoff: '—',
    },
    {
      stage: 'Saves',
      value: String(
        metrics.totalFavorites ?? 0,
      ),
      dropoff: '—',
    },
    {
      stage: 'Viewing Requests',
      value: String(
        metrics.totalViewings ?? 0,
      ),
      dropoff:
        (metrics.totalFavorites ?? 0) > 0
          ? `${(
              (metrics.totalViewings /
                metrics.totalFavorites) *
              100
            ).toFixed(1)}%`
          : '—',
    },
    {
      stage: 'Offers',
      value: String(totalOffers),
      dropoff:
        (metrics.totalViewings ?? 0) > 0
          ? `${(
              (totalOffers /
                metrics.totalViewings) *
              100
            ).toFixed(1)}%`
          : '—',
    },
    {
      stage: 'Accepted Offers',
      value: String(
        metrics.acceptedOffers ?? 0,
      ),
      dropoff:
        totalOffers > 0
          ? `${(
              ((metrics.acceptedOffers ??
                0) /
                totalOffers) *
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

  // Export the real analytics currently loaded into this page.
  const handleExport = (format: string) => {
    try {
      const normalizedFormat =
        format.toLowerCase();

      const currentYear =
        new Date().getFullYear();

      const generatedAt =
        new Date().toISOString();

      const propertyRows: OwnerAnalyticsPropertyExportRow[] =
  topProperties.map(
    (property: any) => ({
            title:
              property.title ||
              'Property',

            status:
              property.status ||
              '—',

            views: Number(
              property.views ?? 0,
            ),

            favorites: Number(
              property.favorites ?? 0,
            ),

            viewings: Number(
              property.viewings ?? 0,
            ),

            offers: Number(
              property.offers ?? 0,
            ),

            acceptedOffers:
              Number(
                property.acceptedOffers ??
                  0,
              ),
          }),
        );

      const monthlyIncomeRows: OwnerAnalyticsIncomeExportRow[] =
  (
    analytics?.monthlyRentalIncome ??
    []
  ).map(
    (item: any) => ({
            month:
              item.month ?? '—',
            income: Number(
              item.income ?? 0,
            ),
          }),
        );

      const summaryRows = [
        [
          'Total Properties',
          metrics.totalProperties ?? 0,
        ],
        [
          'Published Properties',
          metrics.publishedProperties ??
            0,
        ],
        [
          'Total Property Views',
          metrics.totalPropertyViews ??
            0,
        ],
        [
          'Total Saves',
          metrics.totalFavorites ?? 0,
        ],
        [
          'Viewing Requests',
          metrics.totalViewings ?? 0,
        ],
        [
          'Completed Viewings',
          metrics.completedViewings ??
            0,
        ],
        [
          'Active Offers',
          metrics.activeOffers ?? 0,
        ],
        [
          'Accepted Offers',
          metrics.acceptedOffers ??
            0,
        ],
        [
          'Offer Conversion Rate',
          `${
            metrics.offerConversionRate ??
            0
          }%`,
        ],
        [
          'Viewing Completion Rate',
          `${
            metrics.viewingCompletionRate ??
            0
          }%`,
        ],
        [
          'Rental Income YTD',
          metrics.rentalIncomeYTD ?? 0,
        ],
        [
          'Total Rental Income',
          metrics.totalRentalIncome ??
            0,
        ],
      ];

      // CSV export.
      if (
        normalizedFormat === 'csv'
      ) {
        const csv = [
          'LUXORA OWNER ANALYTICS REPORT',
          '',
          'SUMMARY',
          ...summaryRows.map(
            row =>
              row
                .map(
                  escapeCsvValue,
                )
                .join(','),
          ),
          '',
          'PROPERTY PERFORMANCE',
          [
            'Property',
            'Status',
            'Views',
            'Saves',
            'Viewing Requests',
            'Offers',
            'Accepted Offers',
          ]
            .map(escapeCsvValue)
            .join(','),

          ...propertyRows.map(
            row =>
              [
                row.title,
                row.status,
                row.views,
                row.favorites,
                row.viewings,
                row.offers,
                row.acceptedOffers,
              ]
                .map(
                  escapeCsvValue,
                )
                .join(','),
          ),
        ].join('\n');

        downloadBlob(
          new Blob([csv], {
            type: 'application/octet-stream',
          }),
          `luxora-owner-analytics-${currentYear}.csv`,
        );

        return;
      }

      // Excel-compatible spreadsheet export.
      if (
        normalizedFormat ===
          'excel' ||
        normalizedFormat ===
          'xlsx'
      ) {
        const propertyTable =
          propertyRows
            .map(
              row => `
                <tr>
                  <td>${escapeHtml(
                    row.title,
                  )}</td>
                  <td>${escapeHtml(
                    row.status,
                  )}</td>
                  <td>${row.views}</td>
                  <td>${row.favorites}</td>
                  <td>${row.viewings}</td>
                  <td>${row.offers}</td>
                  <td>${row.acceptedOffers}</td>
                </tr>
              `,
            )
            .join('');

        const monthlyTable =
          monthlyIncomeRows
            .map(
              row => `
                <tr>
                  <td>${escapeHtml(
                    row.month,
                  )}</td>
                  <td>${escapeHtml(
                    formatExportMoney(
                      row.income,
                    ),
                  )}</td>
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
                  margin-bottom: 18px;
                }

                th,
                td {
                  border: 1px solid #d1d5db;
                  padding: 8px;
                  text-align: left;
                }

                th {
                  background: #f3f4f6;
                }
              </style>
            </head>

            <body>
              <h2>
                Luxora Owner Analytics Report
              </h2>

              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                  </tr>
                </thead>

                <tbody>
                  ${summaryRows
                    .map(
                      row =>
                        `
                          <tr>
                            <td>${escapeHtml(
                              row[0],
                            )}</td>
                            <td>${escapeHtml(
                              row[1],
                            )}</td>
                          </tr>
                        `,
                    )
                    .join('')}
                </tbody>
              </table>

              <h2>
                Property Performance
              </h2>

              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Status</th>
                    <th>Views</th>
                    <th>Saves</th>
                    <th>
                      Viewing Requests
                    </th>
                    <th>Offers</th>
                    <th>
                      Accepted Offers
                    </th>
                  </tr>
                </thead>

                <tbody>
                  ${propertyTable}
                </tbody>
              </table>

              <h2>
                Monthly Rental Income
              </h2>

              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Income</th>
                  </tr>
                </thead>

                <tbody>
                  ${monthlyTable}
                </tbody>
              </table>
            </body>
          </html>
        `;

        downloadBlob(
          new Blob(
            [excelHtml],
            {
              type: 'application/octet-stream',
            },
          ),
          `luxora-owner-analytics-${currentYear}.xls`,
        );

        return;
      }

      // PDF export is handled through the browser print dialog.
      const summaryCards =
        summaryRows
          .slice(0, 8)
          .map(
            ([label, value]) => `
              <div class="summary-card">
                <div class="label">
                  ${escapeHtml(label)}
                </div>

                <div class="value">
                  ${escapeHtml(value)}
                </div>
              </div>
            `,
          )
          .join('');

      const propertyTable =
        propertyRows
          .map(
            row => `
              <tr>
                <td>${escapeHtml(
                  row.title,
                )}</td>
                <td>${escapeHtml(
                  row.status,
                )}</td>
                <td>${row.views}</td>
                <td>${row.favorites}</td>
                <td>${row.viewings}</td>
                <td>${row.offers}</td>
                <td>${row.acceptedOffers}</td>
              </tr>
            `,
          )
          .join('');

      const monthlyCards =
        monthlyIncomeRows
          .map(
            row => `
              <div class="item">
                <div class="item-title">
                  ${escapeHtml(row.month)}
                </div>

                <div class="item-value">
                  ${escapeHtml(
                    formatExportMoney(
                      row.income,
                    ),
                  )}
                </div>
              </div>
            `,
          )
          .join('');

      const printHtml = `
        <div class="header">
          <div>
            <div class="brand">
              LUXORA
            </div>

            <div class="subtle">
              Owner Property Analytics Report
            </div>
          </div>

          <div class="meta">
            <div class="title">
              Analytics Report
            </div>

            <div class="subtle">
              Generated
              ${escapeHtml(
                formatExportDateTime(
                  generatedAt,
                ),
              )}
            </div>
          </div>
        </div>

        <div class="summary">
          ${summaryCards}
        </div>

        <div class="section">
          <h2>
            Property Performance
          </h2>

          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Status</th>
                <th>Views</th>
                <th>Saves</th>
                <th>
                  Viewing Requests
                </th>
                <th>Offers</th>
                <th>
                  Accepted Offers
                </th>
              </tr>
            </thead>

            <tbody>
              ${propertyTable}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>
            Monthly Rental Income
          </h2>

          <div class="grid">
            ${
              monthlyCards ||
              `
                <div class="subtle">
                  No rental income records available.
                </div>
              `
            }
          </div>
        </div>

        <div class="section">
          <h2>
            Recent 30-Day Views
          </h2>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Views</th>
              </tr>
            </thead>

            <tbody>
              ${viewTrendData
                .map(
                  (item: any) =>
                    `
                      <tr>
                        <td>
                          ${escapeHtml(
                            formatExportDate(
                              item.date,
                            ),
                          )}
                        </td>

                        <td>
                          ${item.views}
                        </td>
                      </tr>
                    `,
                )
                .join('')}
            </tbody>
          </table>
        </div>

        <div class="footer">
          This report is generated from the real Owner analytics records currently available in Luxora. Unsupported metrics are not fabricated.
        </div>
      `;

      if (
        !openAnalyticsPrintWindow(
          'Luxora Owner Analytics Report',
          printHtml,
        )
      ) {
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
        title: 'Analytics report ready',
        description:
          'The report has opened for printing or saving as PDF.',
      });

    } catch (error) {
      console.error(
        'Failed to export Owner analytics:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Export failed',
        description:
          'We could not generate your analytics report.',
      });
    }
  };

  // Show the empty state only after the real analytics request finishes.
  if (
    !isLoadingAnalytics &&
    !analytics
  ) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={
            <TrendingUp className="h-8 w-8 text-gold-400" />
          }
          title="No analytics available."
          description="You do not have any active properties generating data."
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
            Property Analytics
          </h2>

          <p className="text-sm text-ink/60">
            Track the performance of your
            listings, engagement, and business
            growth.
          </p>
        </div>

        <div className="flex gap-3">
          <GhostButton
            onClick={() => handleExport('csv')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </GhostButton>

          <GoldButton
            onClick={() => handleExport('pdf')}
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </GoldButton>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          {
            label:
              'Total Property Views',
            value: String(
              metrics.totalPropertyViews ??
                0,
            ),
            delta: '',
            icon: Eye,
            color:
              'text-blue-400',
            bg: 'bg-blue-400/10',
          },
          {
            label: 'Total Saves',
            value: String(
              metrics.totalFavorites ??
                0,
            ),
            delta: '',
            icon: Heart,
            color:
              'text-rose-400',
            bg: 'bg-rose-400/10',
          },
          {
            label:
              'Viewing Requests',
            value: String(
              metrics.totalViewings ??
                0,
            ),
            delta: '',
            icon: Calendar,
            color:
              'text-emerald-400',
            bg: 'bg-emerald-400/10',
          },
          {
            label: 'Active Offers',
            value: String(
              metrics.activeOffers ??
                0,
            ),
            delta: '',
            icon: FileText,
            color:
              'text-gold-400',
            bg: 'bg-gold-400/10',
          },
          {
            label:
              'Conversion Rate',
            value: `${
              metrics.offerConversionRate ??
              0
            }%`,
            delta: '',
            icon: TrendingUp,
            color:
              'text-purple-400',
            bg: 'bg-purple-400/10',
          },
          {
            label:
              'Avg. Time on Market',
            value: '—',
            delta: '',
            icon: Clock,
            color:
              'text-orange-400',
            bg: 'bg-orange-400/10',
          },
        ].map((stat, i) => (
          <KPICard
            key={i}
            title={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={
              stat.delta ||
              undefined
            }
            trendColor={stat.color}
            iconColor={stat.color}
            backgroundColor={
              stat.bg
            }
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
                {metrics.totalPropertyViews ??
                  0}
              </div>

              <div className="text-[10px] text-ink/50 uppercase mt-1">
                Views
              </div>
            </div>

            {/* Show the real Property save count from Owner analytics. */}
            <div className="rounded-xl bg-navy-900 border border-white/5 p-4 text-center">
              <div className="text-2xl font-bold text-rose-400">
                {metrics.totalFavorites ??
                  0}
              </div>

              <div className="text-[10px] text-ink/50 uppercase mt-1">
                Saves
              </div>
            </div>

            {/* Show the real viewing request count from Owner analytics. */}
            <div className="rounded-xl bg-navy-900 border border-white/5 p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">
                {metrics.totalViewings ??
                  0}
              </div>

              <div className="text-[10px] text-ink/50 uppercase mt-1">
                Viewing Requests
              </div>
            </div>

            {/* Show the real active offer count from Owner analytics. */}
            <div className="rounded-xl bg-navy-900 border border-white/5 p-4 text-center">
              <div className="text-2xl font-bold text-gold-400">
                {metrics.activeOffers ??
                  0}
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
                  Real property view events
                  are now being recorded for
                  your listings.
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
                {metrics.totalPropertyViews ??
                  0}
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
                {metrics.totalFavorites ??
                  0}
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
                {metrics.totalViewings ??
                  0}
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
                {metrics.offerConversionRate ??
                  0}
                %
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
              Real Property detail-page
              views over the last 30 days.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-ink/50">
            <Eye className="h-4 w-4 text-blue-400" />

            <span>
              {trendTotalViews} views in 30
              days
            </span>
          </div>
        </div>

        <div className="h-56 flex items-end gap-1">
          {viewTrendData.map(
            (item) => {
              // Calculate the current bar height from the shared maximum.
              const height =
                item.views > 0
                  ? `${Math.max(
                      (item.views /
                        maxViews) *
                        100,
                      6,
                    )}%`
                  : '2%';

              return (
                <div
                  key={item.date}
                  className="flex-1 h-full flex items-end"
                  title={`${item.date}: ${
                    item.views
                  } view${
                    item.views === 1
                      ? ''
                      : 's'
                  }`}
                >
                  <div
                    className="w-full rounded-t-md bg-blue-400/70 hover:bg-blue-400 transition-colors"
                    style={{
                      height,
                    }}
                  />
                </div>
              );
            },
          )}
        </div>

        <div className="flex justify-between mt-3 text-[10px] text-ink/40">
          <span>
            {viewTrendData[0]?.date ??
              '—'}
          </span>

          <span>
            {viewTrendData[
              viewTrendData.length - 1
            ]?.date ?? '—'}
          </span>
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
                keyExtractor={(prop) =>
                  prop.propertyId
                }
                columns={[
                  {
                    header: 'Property',
                    render: (prop) => (
                      <span className="font-medium text-cream">
                        {prop.title ||
                          'Property'}
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
                        {prop.favorites ??
                          0}
                      </span>
                    ),
                  },
                  {
                    header:
                      'Viewing Reqs',
                    render: (prop) => (
                      <span className="text-ink/60">
                        {prop.viewings ??
                          0}
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
                    header: (
                      <div className="text-right">
                        Accepted
                      </div>
                    ),
                    className:
                      'text-right',
                    render: (prop) => (
                      <span className="font-bold text-gold-400">
                        {prop.acceptedOffers ??
                          0}
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
                keyExtractor={(property) =>
                  property.propertyId
                }
                columns={[
                  {
                    header: 'Property',
                    render: (
                      property,
                    ) => (
                      <span className="font-medium text-cream truncate max-w-[150px]">
                        {property.title ||
                          'Property'}
                      </span>
                    ),
                  },
                  {
                    header: 'Status',
                    render: (
                      property,
                    ) => (
                      <span className="text-ink/60">
                        {property.status ||
                          '—'}
                      </span>
                    ),
                  },
                  {
                    header: 'Activity',
                    render: (
                      property,
                    ) => (
                      <span className="text-ink/60">
                        {(property.views ??
                          0) +
                          (property.favorites ??
                            0) +
                          (property.viewings ??
                            0) +
                          (property.offers ??
                            0)}{' '}
                        interactions
                      </span>
                    ),
                  },
                  {
                    header: 'Favorites',
                    render: (
                      property,
                    ) => (
                      <span className="text-ink/60">
                        {property.favorites ??
                          0}
                      </span>
                    ),
                  },
                  {
                    header:
                      'Viewing Reqs',
                    render: (
                      property,
                    ) => (
                      <span className="text-ink/60">
                        {property.viewings ??
                          0}
                      </span>
                    ),
                  },
                  {
                    header: (
                      <div className="text-right">
                        Offers
                      </div>
                    ),
                    className:
                      'text-right',
                    render: (
                      property,
                    ) => (
                      <span className="font-bold text-gold-400">
                        {property.offers ??
                          0}
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
                  {metrics.totalProperties ??
                    0}
                </div>

                <div className="text-[10px] text-ink/50 uppercase mt-1">
                  Total Properties
                </div>
              </div>

              <div className="p-4 rounded-xl bg-navy-900 border border-white/5 flex flex-col items-center justify-center text-center">
                <Search className="h-5 w-5 text-gold-400 mb-2" />

                <div className="font-bold text-cream text-lg">
                  {metrics.publishedProperties ??
                    0}
                </div>

                <div className="text-[10px] text-ink/50 uppercase mt-1">
                  Published
                </div>
              </div>

              <div className="p-4 rounded-xl bg-navy-900 border border-white/5 flex flex-col items-center justify-center text-center">
                {/* Show the real Property view count from Owner analytics. */}
                <Eye className="h-5 w-5 text-blue-400 mb-2" />

                <div className="font-bold text-cream text-lg">
                  {metrics.totalPropertyViews ??
                    0}
                </div>

                <div className="text-[10px] text-ink/50 uppercase mt-1">
                  Property Views
                </div>
              </div>

              <div className="p-4 rounded-xl bg-navy-900 border border-white/5 flex flex-col items-center justify-center text-center">
                <FileText className="h-5 w-5 text-gold-400 mb-2" />

                <div className="font-bold text-cream text-lg">
                  {metrics.acceptedOffers ??
                    0}
                </div>

                <div className="text-[10px] text-ink/50 uppercase mt-1">
                  Accepted Offers
                </div>
              </div>

              <div className="p-4 rounded-xl bg-navy-900 border border-white/5 flex flex-col items-center justify-center text-center">
                <DollarSign className="h-5 w-5 text-gold-400 mb-2" />

                <div className="font-bold text-cream text-lg">
                  ₦
                  {(
                    (metrics.rentalIncomeYTD ??
                      0) /
                    1000000
                  ).toFixed(1)}
                  M
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
              {funnelStages.map(
                (stage, i) => (
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
                          {
                            stage.dropoff
                          }
                        </span>
                      </div>
                    </div>

                    {i <
                      funnelStages.length -
                        1 && (
                      <div className="h-6 flex items-center justify-center text-ink/20">
                        <ArrowDown className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ),
              )}
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
                  ₦
                  {(
                    (metrics.rentalIncomeYTD ??
                      0) /
                    1000000
                  ).toFixed(1)}
                  M
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-navy-900 border border-white/5">
                <span className="text-sm font-semibold text-cream">
                  Total Rental Revenue
                </span>

                <span className="font-bold text-lg text-gold-400">
                  ₦
                  {(
                    (metrics.totalRentalIncome ??
                      0) /
                    1000000
                  ).toFixed(1)}
                  M
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

    </div>
  );
}