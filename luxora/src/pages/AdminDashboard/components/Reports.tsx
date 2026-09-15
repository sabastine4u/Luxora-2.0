import {
  FileText,
  Download,
  Calendar,
  RefreshCw,
  BarChart3,
  Users,
  ShieldAlert,
  Building2,
  Wallet,
  Archive,
  Eye,
  ArrowLeft,
} from 'lucide-react';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  GhostButton,
  GoldButton,
} from '../../../components/ui/ui';

import { adminApi } from '../../../api/admin.api';
import http from '../../../api/http';

type ReportCategory =
  | 'financial'
  | 'user-growth'
  | 'system-audit'
  | 'listing-performance';

type FinancialMetrics = {
  totalGMV: number;
  totalCommission: number;
  paidCommission: number;
  transactionCount: number;
};

type UserGrowthMetrics = {
  totalUsers: number;
  owners: number;
  buyers: number;
  agents: number;
  agencies: number;
  administrators: number;
};

type ListingMetrics = {
  total: number;
  draft: number;
  pendingReview: number;
  approved: number;
  published: number;
  underOffer: number;
  sold: number;
  rented: number;
  leased: number;
  archived: number;
};

type ReportData = {
  category: ReportCategory | string;
  startDate: string | null;
  endDate: string | null;
  metrics?:
    | FinancialMetrics
    | UserGrowthMetrics
    | ListingMetrics;
  available?: boolean;
  message?: string;
};

type AuditLog = {
  id: string;
  action: string;
  category: string;
  description: string;
  actor?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  target?: {
    type?: string | null;
    id?: string | null;
    name?: string | null;
  };
  metadata?: Record<
    string,
    unknown
  > | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
};

type AuditPagination = {
  total: number;
  pages: number;
  page: number;
  limit: number;
};

type ArchivedAuditMetrics = {
  logs: AuditLog[];
  pagination?: AuditPagination | null;
};

type ArchivedReport = {
  id: string;
  name: string;
  category: ReportCategory;
  startDate: string | null;
  endDate: string | null;
  metrics:
    | FinancialMetrics
    | UserGrowthMetrics
    | ListingMetrics
    | ArchivedAuditMetrics;
  format: 'snapshot' | 'csv' | 'pdf';
  fileSize: number | null;
  generatedBy?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  createdAt: string;
};

const categoryOptions: {
  value: ReportCategory;
  label: string;
}[] = [
  {
    value: 'financial',
    label: 'Financial (GMV & Revenue)',
  },
  {
    value: 'user-growth',
    label: 'User Growth',
  },
  {
    value: 'system-audit',
    label: 'System Audit Logs',
  },
  {
    value: 'listing-performance',
    label: 'Listing Performance',
  },
];

const formatCurrency = (
  value: number,
) => {
  return new Intl.NumberFormat(
    'en-NG',
    {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    },
  ).format(value);
};

const formatNumber = (
  value: number,
) => {
  return value.toLocaleString(
    'en-NG',
  );
};

const formatDate = (
  value?: string | null,
) => {
  if (!value) {
    return 'All available dates';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    'en-NG',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  );
};

const formatDateTime = (
  value?: string | null,
) => {
  if (!value) {
    return 'Unknown time';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return date.toLocaleString(
    'en-NG',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  );
};

const getCategoryIcon = (
  category: ReportCategory,
) => {
  switch (category) {
    case 'financial':
      return Wallet;

    case 'user-growth':
      return Users;

    case 'system-audit':
      return ShieldAlert;

    case 'listing-performance':
      return Building2;

    default:
      return BarChart3;
  }
};

const getCategoryLabel = (
  category: ReportCategory,
) => {
  return (
    categoryOptions.find(
      (option) =>
        option.value === category,
    )?.label ||
    category
  );
};

const escapeCsvValue = (
  value: unknown,
) => {
  const stringValue =
    value === null ||
    value === undefined
      ? ''
      : String(value);

  return `"${stringValue.replace(
    /"/g,
    '""',
  )}"`;
};

export default function Reports() {
  const [
    selectedCategory,
    setSelectedCategory,
  ] =
    useState<ReportCategory>(
      'financial',
    );

  const [startDate, setStartDate] =
    useState('');

  const [endDate, setEndDate] =
    useState('');

  const [reportData, setReportData] =
    useState<ReportData | null>(
      null,
    );

  const [auditLogs, setAuditLogs] =
    useState<AuditLog[]>([]);

  const [
    auditPagination,
    setAuditPagination,
  ] = useState<AuditPagination | null>(
    null,
  );

  const [
    archivedReports,
    setArchivedReports,
  ] = useState<
    ArchivedReport[]
  >([]);

  const [
    viewingArchivedReport,
    setViewingArchivedReport,
  ] =
    useState<ArchivedReport | null>(
      null,
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isRefreshing,
    setIsRefreshing,
  ] = useState(false);

  const [
    isArchiving,
    setIsArchiving,
  ] = useState(false);

  const [
    isLoadingArchives,
    setIsLoadingArchives,
  ] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [
    archiveError,
    setArchiveError,
  ] = useState<string | null>(null);

  const reportApi =
    adminApi as any;

  /*
   * Load the current live report.
   *
   * This function is only responsible for
   * retrieving live data from the reporting
   * endpoints. It does not archive anything.
   */
  const loadReport =
    async () => {
      try {
        setError(null);

        if (
          selectedCategory ===
          'system-audit'
        ) {
          const response =
            await reportApi.getAuditLogs({
              startDate:
                startDate ||
                undefined,

              endDate:
                endDate ||
                undefined,

              page: 1,

              limit: 25,
            });

          const rawResponse =
            response as any;

          const logs =
            Array.isArray(
              rawResponse?.logs,
            )
              ? rawResponse.logs
              : Array.isArray(
                  rawResponse?.data?.logs,
                )
                ? rawResponse.data
                    .logs
                : [];

          const pagination =
            rawResponse?.pagination ||
            rawResponse?.data
              ?.pagination ||
            null;

          setAuditLogs(
            logs,
          );

          setAuditPagination(
            pagination,
          );

          setReportData(
            null,
          );

          return {
            category:
              'system-audit' as ReportCategory,

            startDate:
              startDate ||
              null,

            endDate:
              endDate ||
              null,

            metrics: {
              logs,
              pagination,
            },
          };
        }

        const response =
          await reportApi.getReport(
            selectedCategory,
            startDate ||
              undefined,
            endDate ||
              undefined,
          );

        const rawResponse =
          response as any;

        const report =
          rawResponse?.report ||
          rawResponse?.data?.report ||
          null;

        if (!report) {
          throw new Error(
            'The report data was not returned by the server.',
          );
        }

        setReportData(
          report,
        );

        setAuditLogs(
          [],
        );

        setAuditPagination(
          null,
        );

        return report;
      } catch (requestError: any) {
        console.error(
          'Failed to load Admin report:',
          requestError,
        );

        setReportData(
          null,
        );

        setAuditLogs(
          [],
        );

        setAuditPagination(
          null,
        );

        setError(
          requestError?.message ||
            'Unable to load the selected report.',
        );

        return null;
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

  /*
   * Load archived snapshots from MongoDB.
   *
   * This is completely separate from the
   * live report state.
   */
  const loadArchivedReports =
    async () => {
      try {
        setIsLoadingArchives(
          true,
        );

        setArchiveError(
          null,
        );

        const response =
          await http.get(
            '/admin/reports/archive',
            {
              params: {
                page: 1,
                limit: 50,
              },
            },
          );

        const rawResponse =
          response as any;

        const reports =
          Array.isArray(
            rawResponse?.reports,
          )
            ? rawResponse.reports
            : Array.isArray(
                rawResponse
                  ?.data?.reports,
              )
              ? rawResponse.data
                  .reports
              : [];

        setArchivedReports(
          reports,
        );
      } catch (requestError: any) {
        console.error(
          'Failed to load archived reports:',
          requestError,
        );

        setArchivedReports(
          [],
        );

        setArchiveError(
          requestError?.message ||
            'Unable to load archived reports.',
        );
      } finally {
        setIsLoadingArchives(
          false,
        );
      }
    };

  /*
   * Load live report when category
   * or date range changes.
   *
   * IMPORTANT:
   * Never run this while viewing an
   * archived snapshot.
   */
  useEffect(() => {
    if (
      viewingArchivedReport
    ) {
      return;
    }

    setIsLoading(true);

    loadReport();
  }, [
    selectedCategory,
    startDate,
    endDate,
    viewingArchivedReport,
  ]);

  /*
   * Archives are loaded independently
   * from the live report.
   */
  useEffect(() => {
    loadArchivedReports();
  }, []);

  /*
   * Run Report:
   * loads live data only.
   */
  const handleRunReport =
    async () => {
      setViewingArchivedReport(
        null,
      );

      setIsLoading(true);
      setIsRefreshing(true);

      await loadReport();
    };

  /*
   * Generate New Report:
   *
   * 1. Generate the live report.
   * 2. Save that exact result to MongoDB.
   * 3. Refresh the archive list.
   */
  const handleGenerateAndArchive =
    async () => {
      setViewingArchivedReport(
        null,
      );

      setIsLoading(true);
      setIsRefreshing(true);
      setIsArchiving(true);
      setArchiveError(null);

      try {
        const generatedReport =
          await loadReport();

        if (!generatedReport) {
          return;
        }

        let archiveMetrics =
          generatedReport.metrics;

        if (
          selectedCategory ===
          'system-audit'
        ) {
          archiveMetrics = {
            logs: auditLogs,
            pagination:
              auditPagination,
          };
        }

        await http.post(
          '/admin/reports/archive',
          {
            category:
              selectedCategory,

            startDate:
              generatedReport.startDate ||
              null,

            endDate:
              generatedReport.endDate ||
              null,

            metrics:
              archiveMetrics,

            format:
              'snapshot',
          },
        );

        await loadArchivedReports();
      } catch (requestError: any) {
        console.error(
          'Failed to archive report:',
          requestError,
        );

        setArchiveError(
          requestError?.message ||
            'Unable to archive the generated report.',
        );
      } finally {
        setIsArchiving(
          false,
        );

        setIsRefreshing(
          false,
        );
      }
    };

  /*
   * Read live backend metrics.
   */
  const financialMetrics =
    selectedCategory ===
      'financial' &&
    reportData?.metrics
      ? (
          reportData.metrics as
            FinancialMetrics
        )
      : null;

  const userGrowthMetrics =
    selectedCategory ===
      'user-growth' &&
    reportData?.metrics
      ? (
          reportData.metrics as
            UserGrowthMetrics
        )
      : null;

  const listingMetrics =
    selectedCategory ===
      'listing-performance' &&
    reportData?.metrics
      ? (
          reportData.metrics as
            ListingMetrics
        )
      : null;

  /*
   * View an archived snapshot.
   *
   * IMPORTANT:
   * We do NOT change selectedCategory.
   * We do NOT change dates.
   * We do NOT call the live report API.
   *
   * The snapshot becomes its own display state.
   */
  const handleViewArchivedReport =
    (
      archivedReport: ArchivedReport,
    ) => {
      setViewingArchivedReport(
        archivedReport,
      );

      setError(
        null,
      );
    };

  /*
   * Close archived snapshot view.
   */
  const handleCloseArchivedReport =
    () => {
      setViewingArchivedReport(
        null,
      );
    };

  /*
   * Export the currently displayed
   * live report as CSV.
   */
  const handleExportCsv =
    () => {
      let rows: string[][] = [];

      if (
        selectedCategory ===
        'financial'
      ) {
        rows = [
          [
            'Metric',
            'Value',
          ],
          [
            'Total GMV',
            String(
              financialMetrics?.totalGMV ??
                0,
            ),
          ],
          [
            'Total Commission',
            String(
              financialMetrics?.totalCommission ??
                0,
            ),
          ],
          [
            'Paid Commission',
            String(
              financialMetrics?.paidCommission ??
                0,
            ),
          ],
          [
            'Transaction Count',
            String(
              financialMetrics?.transactionCount ??
                0,
            ),
          ],
        ];
      }

      if (
        selectedCategory ===
        'user-growth'
      ) {
        rows = [
          [
            'Metric',
            'Value',
          ],
          [
            'Total Users',
            String(
              userGrowthMetrics?.totalUsers ??
                0,
            ),
          ],
          [
            'Owners',
            String(
              userGrowthMetrics?.owners ??
                0,
            ),
          ],
          [
            'Buyers',
            String(
              userGrowthMetrics?.buyers ??
                0,
            ),
          ],
          [
            'Agents',
            String(
              userGrowthMetrics?.agents ??
                0,
            ),
          ],
          [
            'Agencies',
            String(
              userGrowthMetrics?.agencies ??
                0,
            ),
          ],
          [
            'Administrators',
            String(
              userGrowthMetrics?.administrators ??
                0,
            ),
          ],
        ];
      }

      if (
        selectedCategory ===
        'listing-performance'
      ) {
        rows = [
          [
            'Metric',
            'Value',
          ],
          [
            'Total',
            String(
              listingMetrics?.total ??
                0,
            ),
          ],
          [
            'Draft',
            String(
              listingMetrics?.draft ??
                0,
            ),
          ],
          [
            'Pending Review',
            String(
              listingMetrics?.pendingReview ??
                0,
            ),
          ],
          [
            'Approved',
            String(
              listingMetrics?.approved ??
                0,
            ),
          ],
          [
            'Published',
            String(
              listingMetrics?.published ??
                0,
            ),
          ],
          [
            'Under Offer',
            String(
              listingMetrics?.underOffer ??
                0,
            ),
          ],
          [
            'Sold',
            String(
              listingMetrics?.sold ??
                0,
            ),
          ],
          [
            'Rented',
            String(
              listingMetrics?.rented ??
                0,
            ),
          ],
          [
            'Leased',
            String(
              listingMetrics?.leased ??
                0,
            ),
          ],
          [
            'Archived',
            String(
              listingMetrics?.archived ??
                0,
            ),
          ],
        ];
      }

      if (
        selectedCategory ===
        'system-audit'
      ) {
        rows = [
          [
            'Date',
            'Action',
            'Category',
            'Actor',
            'Role',
            'Description',
            'Target',
          ],
          ...auditLogs.map(
            (log) => [
              formatDateTime(
                log.createdAt,
              ),
              log.action,
              log.category,
              log.actor?.name ||
                'Unknown',
              log.actor?.role ||
                'Unknown',
              log.description,
              log.target?.name ||
                '',
            ],
          ),
        ];
      }

      if (
        rows.length ===
        0
      ) {
        return;
      }

      const csv =
        rows
          .map(
            (row) =>
              row
                .map(
                  escapeCsvValue,
                )
                .join(','),
          )
          .join('\n');

      const blob =
        new Blob(
          [csv],
          {
            type:
              'text/csv;charset=utf-8;',
          },
        );

      const url =
        URL.createObjectURL(
          blob,
        );

      const link =
        document.createElement(
          'a',
        );

      link.href =
        url;

      link.download =
        `luxora-${selectedCategory}-report.csv`;

      document.body.appendChild(
        link,
      );

      link.click();

      document.body.removeChild(
        link,
      );

      URL.revokeObjectURL(
        url,
      );
    };

  const CategoryIcon =
    getCategoryIcon(
      selectedCategory,
    );

  /*
   * Live report summary cards.
   */
  const reportSummary =
    useMemo(() => {
      if (
        selectedCategory ===
        'financial'
      ) {
        return [
          {
            label:
              'Total GMV',
            value:
              formatCurrency(
                financialMetrics?.totalGMV ??
                  0,
              ),
          },
          {
            label:
              'Commission',
            value:
              formatCurrency(
                financialMetrics?.totalCommission ??
                  0,
              ),
          },
          {
            label:
              'Paid Commission',
            value:
              formatCurrency(
                financialMetrics?.paidCommission ??
                  0,
              ),
          },
          {
            label:
              'Transactions',
            value:
              formatNumber(
                financialMetrics?.transactionCount ??
                  0,
              ),
          },
        ];
      }

      if (
        selectedCategory ===
        'user-growth'
      ) {
        return [
          {
            label:
              'Total Users',
            value:
              formatNumber(
                userGrowthMetrics?.totalUsers ??
                  0,
              ),
          },
          {
            label:
              'Owners',
            value:
              formatNumber(
                userGrowthMetrics?.owners ??
                  0,
              ),
          },
          {
            label:
              'Buyers',
            value:
              formatNumber(
                userGrowthMetrics?.buyers ??
                  0,
              ),
          },
          {
            label:
              'Agents',
            value:
              formatNumber(
                userGrowthMetrics?.agents ??
                  0,
              ),
          },
        ];
      }

      if (
        selectedCategory ===
        'listing-performance'
      ) {
        return [
          {
            label:
              'Total Listings',
            value:
              formatNumber(
                listingMetrics?.total ??
                  0,
              ),
          },
          {
            label:
              'Published',
            value:
              formatNumber(
                listingMetrics?.published ??
                  0,
              ),
          },
          {
            label:
              'Sold',
            value:
              formatNumber(
                listingMetrics?.sold ??
                  0,
              ),
          },
          {
            label:
              'Pending Review',
            value:
              formatNumber(
                listingMetrics?.pendingReview ??
                  0,
              ),
          },
        ];
      }

      return [
        {
          label:
            'Audit Records',
          value:
            formatNumber(
              auditPagination?.total ??
                auditLogs.length,
            ),
        },
        {
          label:
            'Current Page',
          value:
            String(
              auditPagination?.page ??
                1,
            ),
        },
        {
          label:
            'Actions',
          value:
            formatNumber(
              new Set(
                auditLogs.map(
                  (log) =>
                    log.action,
                ),
              ).size,
            ),
        },
        {
          label:
            'Categories',
          value:
            formatNumber(
              new Set(
                auditLogs.map(
                  (log) =>
                    log.category,
                ),
              ).size,
            ),
        },
      ];
    }, [
      selectedCategory,
      financialMetrics,
      userGrowthMetrics,
      listingMetrics,
      auditLogs,
      auditPagination,
    ]);

  /*
   * Archived snapshot summary.
   */
  const archivedSummary =
    useMemo(() => {
      if (
        !viewingArchivedReport
      ) {
        return [];
      }

      if (
        viewingArchivedReport.category ===
        'financial'
      ) {
        const metrics =
          viewingArchivedReport.metrics as FinancialMetrics;

        return [
          {
            label:
              'Total GMV',
            value:
              formatCurrency(
                metrics.totalGMV,
              ),
          },
          {
            label:
              'Commission',
            value:
              formatCurrency(
                metrics.totalCommission,
              ),
          },
          {
            label:
              'Paid Commission',
            value:
              formatCurrency(
                metrics.paidCommission,
              ),
          },
          {
            label:
              'Transactions',
            value:
              formatNumber(
                metrics.transactionCount,
              ),
          },
        ];
      }

      if (
        viewingArchivedReport.category ===
        'user-growth'
      ) {
        const metrics =
          viewingArchivedReport.metrics as UserGrowthMetrics;

        return [
          {
            label:
              'Total Users',
            value:
              formatNumber(
                metrics.totalUsers,
              ),
          },
          {
            label:
              'Owners',
            value:
              formatNumber(
                metrics.owners,
              ),
          },
          {
            label:
              'Buyers',
            value:
              formatNumber(
                metrics.buyers,
              ),
          },
          {
            label:
              'Agents',
            value:
              formatNumber(
                metrics.agents,
              ),
          },
          {
            label:
              'Agencies',
            value:
              formatNumber(
                metrics.agencies,
              ),
          },
          {
            label:
              'Administrators',
            value:
              formatNumber(
                metrics.administrators,
              ),
          },
        ];
      }

      if (
        viewingArchivedReport.category ===
        'listing-performance'
      ) {
        const metrics =
          viewingArchivedReport.metrics as ListingMetrics;

        return [
          {
            label:
              'Total Listings',
            value:
              formatNumber(
                metrics.total,
              ),
          },
          {
            label:
              'Published',
            value:
              formatNumber(
                metrics.published,
              ),
          },
          {
            label:
              'Approved',
            value:
              formatNumber(
                metrics.approved,
              ),
          },
          {
            label:
              'Pending Review',
            value:
              formatNumber(
                metrics.pendingReview,
              ),
          },
          {
            label:
              'Sold',
            value:
              formatNumber(
                metrics.sold,
              ),
          },
          {
            label:
              'Rented',
            value:
              formatNumber(
                metrics.rented,
              ),
          },
          {
            label:
              'Leased',
            value:
              formatNumber(
                metrics.leased,
              ),
          },
          {
            label:
              'Archived',
            value:
              formatNumber(
                metrics.archived,
              ),
          },
        ];
      }

      const metrics =
        viewingArchivedReport.metrics as ArchivedAuditMetrics;

      return [
        {
          label:
            'Audit Records',
          value:
            formatNumber(
              metrics.logs
                ?.length ||
                0,
            ),
        },
        {
          label:
            'Total Records',
          value:
            formatNumber(
              metrics.pagination
                ?.total ||
                0,
            ),
        },
        {
          label:
            'Page',
          value:
            String(
              metrics.pagination
                ?.page ||
                1,
            ),
        },
        {
          label:
            'Actions',
          value:
            formatNumber(
              new Set(
                (
                  metrics.logs ||
                  []
                ).map(
                  (log) =>
                    log.action,
                ),
              ).size,
            ),
        },
      ];
    }, [
      viewingArchivedReport,
    ]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">
            System Reports
          </h2>

          <p className="text-sm text-ink/60">
            Generate and export platform-wide analytics and audit logs.
          </p>
        </div>

        <GoldButton
          onClick={
            handleGenerateAndArchive
          }
          disabled={
            isArchiving
          }
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              isArchiving
                ? 'animate-spin'
                : ''
            }`}
          />

          {isArchiving
            ? 'Generating...'
            : 'Generate New Report'}
        </GoldButton>
      </div>

      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 space-y-6">
        {/*
         * Archived snapshot viewer.
         *
         * This is intentionally separate from
         * the live report category selector.
         */}
        {viewingArchivedReport && (
          <div className="rounded-2xl border border-gold-400/20 bg-gold-400/5 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Archive className="h-5 w-5 text-gold-400" />

                  <h3 className="font-heading text-xl font-semibold text-cream">
                    {
                      viewingArchivedReport.name
                    }
                  </h3>

                  <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
                    Archived Snapshot
                  </span>
                </div>

                <p className="mt-2 text-sm text-ink/60">
                  This is the exact report snapshot stored when the report was generated.
                </p>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/45">
                  <span>
                    Generated{' '}
                    {formatDateTime(
                      viewingArchivedReport.createdAt,
                    )}
                  </span>

                  <span>
                    By{' '}
                    {viewingArchivedReport
                      .generatedBy
                      ?.name ||
                      'Unknown user'}
                  </span>

                  <span>
                    Period:{' '}
                    {formatDate(
                      viewingArchivedReport.startDate,
                    )}
                    {' → '}
                    {formatDate(
                      viewingArchivedReport.endDate,
                    )}
                  </span>
                </div>
              </div>

              <GhostButton
                onClick={
                  handleCloseArchivedReport
                }
              >
                <ArrowLeft className="mr-2 h-4 w-4" />

                Back to Live Report
              </GhostButton>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {archivedSummary.map(
                (
                  item,
                ) => (
                  <div
                    key={
                      item.label
                    }
                    className="rounded-xl border border-white/5 bg-navy-900/30 p-4"
                  >
                    <div className="text-[10px] uppercase tracking-wider text-ink/40">
                      {
                        item.label
                      }
                    </div>

                    <div className="mt-2 text-xl font-bold text-cream">
                      {
                        item.value
                      }
                    </div>
                  </div>
                ),
              )}
            </div>

            {viewingArchivedReport.category ===
              'system-audit' && (
              <div className="mt-5 space-y-3">
                {(
                  (
                    viewingArchivedReport.metrics as ArchivedAuditMetrics
                  ).logs ||
                  []
                ).length ===
                0 ? (
                  <div className="rounded-xl border border-white/5 bg-navy-900/30 p-5 text-sm text-ink/50">
                    No audit records were stored in this snapshot.
                  </div>
                ) : (
                  (
                    viewingArchivedReport.metrics as ArchivedAuditMetrics
                  ).logs.map(
                    (log) => (
                      <div
                        key={
                          log.id
                        }
                        className="rounded-xl border border-white/5 bg-navy-900/30 p-4"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-semibold text-cream">
                                {
                                  log.action
                                }
                              </span>

                              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-ink/60">
                                {
                                  log.category
                                }
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-ink/65">
                              {
                                log.description
                              }
                            </p>
                          </div>

                          <div className="text-xs text-ink/40">
                            {formatDateTime(
                              log.createdAt,
                            )}
                          </div>
                        </div>
                      </div>
                    ),
                  )
                )}
              </div>
            )}
          </div>
        )}

        {!viewingArchivedReport && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-ink/70">
                  Report Category
                </label>

                <select
                  value={
                    selectedCategory
                  }
                  onChange={(
                    event,
                  ) => {
                    setSelectedCategory(
                      event.target.value as ReportCategory,
                    );

                    setReportData(
                      null,
                    );

                    setAuditLogs(
                      [],
                    );

                    setAuditPagination(
                      null,
                    );
                  }}
                  className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 px-4 text-cream focus:border-gold-400/50 focus:outline-none appearance-none"
                >
                  {categoryOptions.map(
                    (
                      option,
                    ) => (
                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {
                          option.label
                        }
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-ink/70">
                  Start Date
                </label>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                  <input
                    type="date"
                    value={
                      startDate
                    }
                    onChange={(
                      event,
                    ) =>
                      setStartDate(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-4 text-cream focus:border-gold-400/50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-ink/70">
                  End Date
                </label>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />

                  <input
                    type="date"
                    value={
                      endDate
                    }
                    onChange={(
                      event,
                    ) =>
                      setEndDate(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-2.5 pl-10 pr-4 text-cream focus:border-gold-400/50 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <GhostButton
                className="w-full sm:w-auto"
                onClick={
                  handleRunReport
                }
                disabled={
                  isRefreshing
                }
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${
                    isRefreshing
                      ? 'animate-spin'
                      : ''
                  }`}
                />

                {isRefreshing
                  ? 'Loading...'
                  : 'Run Report'}
              </GhostButton>

              <GhostButton
                className="w-full sm:w-auto"
                disabled={
                  isLoading ||
                  (
                    selectedCategory !==
                      'system-audit' &&
                    !reportData
                  ) ||
                  (
                    selectedCategory ===
                      'system-audit' &&
                    auditLogs.length ===
                      0
                  )
                }
                onClick={
                  handleExportCsv
                }
              >
                <Download className="mr-2 h-4 w-4" />

                Export CSV
              </GhostButton>

              <GoldButton
                className="w-full sm:w-auto"
                disabled
                title="PDF generation has not been implemented yet."
              >
                <FileText className="mr-2 h-4 w-4" />

                Export PDF
              </GoldButton>
            </div>

            {archiveError && (
              <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
                <p className="text-sm font-medium text-amber-300">
                  Report archive warning
                </p>

                <p className="mt-1 text-xs text-ink/60">
                  {
                    archiveError
                  }
                </p>
              </div>
            )}

            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
                  <CategoryIcon className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-heading text-lg font-semibold text-cream">
                    {
                      categoryOptions.find(
                        (
                          option,
                        ) =>
                          option.value ===
                          selectedCategory,
                      )?.label
                    }
                  </h3>

                  <p className="text-xs text-ink/50">
                    {selectedCategory ===
                    'system-audit'
                      ? 'Real audit events recorded by the Luxora backend.'
                      : 'Real data returned from the Luxora reporting backend.'}
                  </p>
                </div>
              </div>

              {isLoading ? (
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                  <div className="flex items-center gap-3 text-sm text-ink/50">
                    <RefreshCw className="h-4 w-4 animate-spin" />

                    Loading report data...
                  </div>
                </div>
              ) : error ? (
                <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-6">
                  <div className="text-sm font-semibold text-rose-300">
                    Unable to load report
                  </div>

                  <p className="mt-1 text-xs text-ink/60">
                    {
                      error
                    }
                  </p>
                </div>
              ) : selectedCategory ===
                'system-audit' ? (
                <div className="space-y-3">
                  {auditLogs.length ===
                  0 ? (
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 text-sm text-ink/50">
                      No audit records were found for the selected date range.
                    </div>
                  ) : (
                    auditLogs.map(
                      (
                        log,
                      ) => (
                        <div
                          key={
                            log.id
                          }
                          className="rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/5 transition-colors"
                        >
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900/50 text-gold-400">
                                <ShieldAlert className="h-5 w-5" />
                              </div>

                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="font-semibold text-cream text-sm">
                                    {
                                      log.action
                                    }
                                  </h4>

                                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-ink/60">
                                    {
                                      log.category
                                    }
                                  </span>
                                </div>

                                <p className="mt-1 text-sm text-ink/70">
                                  {
                                    log.description
                                  }
                                </p>

                                <div className="mt-2 text-xs text-ink/50">
                                  {log.actor?.name ||
                                    'Unknown user'}
                                  {' • '}
                                  {log.actor?.role ||
                                    'Unknown role'}
                                  {' • '}
                                  {formatDateTime(
                                    log.createdAt,
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="text-xs text-ink/40 lg:text-right">
                              {log.target
                                ?.name ||
                                'No target'}
                            </div>
                          </div>
                        </div>
                      ),
                    )
                  )}
                </div>
              ) : (
                <>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {reportSummary.map(
                      (
                        item,
                      ) => (
                        <div
                          key={
                            item.label
                          }
                          className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                        >
                          <div className="text-[10px] uppercase tracking-wider text-ink/40">
                            {
                              item.label
                            }
                          </div>

                          <div className="mt-2 text-xl font-bold text-cream">
                            {
                              item.value
                            }
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  {selectedCategory ===
                    'financial' &&
                    financialMetrics && (
                      <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <div className="text-xs text-ink/50">
                              Report Period
                            </div>

                            <div className="mt-1 text-sm font-semibold text-cream">
                              {formatDate(
                                reportData?.startDate,
                              )}
                              {' → '}
                              {formatDate(
                                reportData?.endDate,
                              )}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs text-ink/50">
                              Financial Coverage
                            </div>

                            <div className="mt-1 text-sm font-semibold text-cream">
                              {
                                financialMetrics.transactionCount
                              }{' '}
                              transaction
                              {financialMetrics.transactionCount ===
                              1
                                ? ''
                                : 's'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {selectedCategory ===
                    'user-growth' &&
                    userGrowthMetrics && (
                      <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <div>
                            <div className="text-xs text-ink/50">
                              Agencies
                            </div>

                            <div className="mt-1 text-lg font-bold text-cream">
                              {
                                userGrowthMetrics.agencies
                              }
                            </div>
                          </div>

                          <div>
                            <div className="text-xs text-ink/50">
                              Administrators
                            </div>

                            <div className="mt-1 text-lg font-bold text-cream">
                              {
                                userGrowthMetrics.administrators
                              }
                            </div>
                          </div>

                          <div>
                            <div className="text-xs text-ink/50">
                              Reporting Period
                            </div>

                            <div className="mt-1 text-sm font-semibold text-cream">
                              {formatDate(
                                reportData?.startDate,
                              )}
                              {' → '}
                              {formatDate(
                                reportData?.endDate,
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {selectedCategory ===
                    'listing-performance' &&
                    listingMetrics && (
                      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                          <div className="text-xs text-ink/50">
                            Draft
                          </div>

                          <div className="mt-1 text-lg font-bold text-cream">
                            {
                              listingMetrics.draft
                            }
                          </div>
                        </div>

                        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                          <div className="text-xs text-ink/50">
                            Approved
                          </div>

                          <div className="mt-1 text-lg font-bold text-cream">
                            {
                              listingMetrics.approved
                            }
                          </div>
                        </div>

                        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                          <div className="text-xs text-ink/50">
                            Sold
                          </div>

                          <div className="mt-1 text-lg font-bold text-cream">
                            {
                              listingMetrics.sold
                            }
                          </div>
                        </div>

                        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                          <div className="text-xs text-ink/50">
                            Archived
                          </div>

                          <div className="mt-1 text-lg font-bold text-cream">
                            {
                              listingMetrics.archived
                            }
                          </div>
                        </div>
                      </div>
                    )}
                </>
              )}
            </div>
          </>
        )}

        <div className="pt-6 border-t border-white/10">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="font-heading text-lg font-semibold text-cream">
                Past Reports
              </h3>

              <p className="mt-1 text-xs text-ink/50">
                Archived report snapshots stored by Luxora.
              </p>
            </div>

            <button
              type="button"
              onClick={
                loadArchivedReports
              }
              disabled={
                isLoadingArchives
              }
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-ink/60 transition hover:border-gold-400/30 hover:text-cream disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  isLoadingArchives
                    ? 'animate-spin'
                    : ''
                }`}
              />

              Refresh
            </button>
          </div>

          {isLoadingArchives ? (
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
              <div className="flex items-center gap-3 text-sm text-ink/50">
                <RefreshCw className="h-4 w-4 animate-spin" />

                Loading archived reports...
              </div>
            </div>
          ) : archiveError ? (
            <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-6">
              <div className="text-sm font-semibold text-rose-300">
                Unable to load archived reports
              </div>

              <p className="mt-1 text-xs text-ink/60">
                {
                  archiveError
                }
              </p>
            </div>
          ) : archivedReports.length ===
            0 ? (
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 text-center">
              <Archive className="mx-auto h-8 w-8 text-ink/30" />

              <p className="mt-3 text-sm text-ink/50">
                No reports have been archived yet.
              </p>

              <p className="mt-1 text-xs text-ink/40">
                Use "Generate New Report" to create the first archived snapshot.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {archivedReports.map(
                (
                  archivedReport,
                ) => {
                  const isSelected =
                    viewingArchivedReport?.id ===
                    archivedReport.id;

                  const ArchivedIcon =
                    getCategoryIcon(
                      archivedReport.category,
                    );

                  return (
                    <div
                      key={
                        archivedReport.id
                      }
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-4 transition-colors ${
                        isSelected
                          ? 'border-gold-400/30 bg-gold-400/5'
                          : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900/50 text-gold-400">
                          <ArchivedIcon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-semibold text-cream text-sm">
                              {
                                archivedReport.name
                              }
                            </h4>

                            <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                              Archived
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-ink/50">
                            {
                              getCategoryLabel(
                                archivedReport.category,
                              )
                            }
                            {' • '}
                            Generated{' '}
                            {formatDateTime(
                              archivedReport.createdAt,
                            )}
                          </p>

                          <p className="mt-1 text-xs text-ink/40">
                            By{' '}
                            {archivedReport
                              .generatedBy
                              ?.name ||
                              'Unknown user'}
                            {' • '}
                            Period:{' '}
                            {formatDate(
                              archivedReport.startDate,
                            )}
                            {' → '}
                            {formatDate(
                              archivedReport.endDate,
                            )}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleViewArchivedReport(
                            archivedReport,
                          )
                        }
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-ink/60 transition hover:border-gold-400/30 hover:text-cream"
                      >
                        <Eye className="h-4 w-4" />

                        View Snapshot
                      </button>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}