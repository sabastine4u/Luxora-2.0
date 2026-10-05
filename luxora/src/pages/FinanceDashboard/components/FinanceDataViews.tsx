import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  RefreshCw,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { dealApi } from '../../../api/deal.api';
import { financeApi } from '../../../api/finance.api';

import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EmptyState } from '../../../components/layout/EmptyState';
import { GhostButton } from '../../../components/ui/ui';

import { useToast } from '../../../contexts/ToastContext';

const currency = (
  value: number,
  code = 'NGN',
) =>
  new Intl.NumberFormat(
    'en-NG',
    {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 0,
    },
  ).format(value || 0);

const config: Record<
  string,
  any
> = {
  Revenue: {
    call: 'getRevenue',
    key: 'revenue',
    title: 'Revenue',
    empty:
      'No completed Home Services revenue has been recorded.',
    columns: [
      ['Reference', 'id'],
      ['Source', 'source'],
      ['Amount', 'amount'],
      ['Status', 'status'],
      ['Date', 'date'],
    ],
  },

  /*
   * Transactions are handled separately below.
   *
   * The Finance Dashboard must use the real Deal domain
   * here rather than the older finance transaction source.
   */

 Transactions: {
  call: 'getTransactions',
  key: 'transactions',
  title: 'Transactions',
  empty:
    'No financial transaction records are available.',
  columns: [
    ['Reference', 'reference'],
    ['Type', 'type'],
    ['Amount', 'amount'],
    ['Direction', 'direction'],
    ['Status', 'status'],
    ['Source', 'sourceDomain'],
    ['Date', 'date'],
    ['Description', 'description'],
  ],
},

  'Owner Payments': {
    call: 'getOwnerPayments',
    key: 'payments',
    title: 'Owner Payments',
    empty:
      'No owner payment records are available.',
    columns: [
      ['Owner', 'owner'],
      ['Property', 'property'],
      ['Period', 'period'],
      ['Amount', 'amount'],
      ['Status', 'status'],
      ['Date', 'date'],
    ],
  },

  'Agency Earnings': {
    call: 'getAgencyEarnings',
    key: 'records',
    title: 'Agency Earnings',
    empty:
      'No agency commission records are available.',
    columns: [
      ['Reference', 'id'],
      ['Agency', 'recipient'],
      ['Property', 'property'],
      ['Amount', 'amount'],
      ['Status', 'status'],
      ['Due date', 'dueDate'],
    ],
  },

  'Agent Commissions': {
    call: 'getAgentCommissions',
    key: 'records',
    title: 'Agent Commissions',
    empty:
      'No agent commission records are available.',
    columns: [
      ['Reference', 'id'],
      ['Agent', 'recipient'],
      ['Property', 'property'],
      ['Amount', 'amount'],
      ['Status', 'status'],
      ['Due date', 'dueDate'],
    ],
  },

  'Mortgage Statistics': {
    call: 'getMortgageStatistics',
    key: 'applications',
    title: 'Mortgage Statistics',
    empty:
      'No mortgage applications are available.',
    columns: [
      ['Applicant', 'applicant'],
      ['Lender', 'lender'],
      ['Requested', 'requestedLoanAmount'],
      ['Approved', 'approvedLoanAmount'],
      ['Status', 'status'],
      ['Date', 'createdAt'],
    ],
  },

  Budget: {
    call: 'getProcurementBudget',
    key: 'budgets',
    title: 'Procurement Budget',
    empty:
      'No procurement budget records are available.',
    columns: [
      ['Reference', 'id'],
      ['Budget', 'name'],
      ['Department', 'department'],
      ['Amount', 'amount'],
      ['Status', 'status'],
      ['Date', 'createdAt'],
    ],
  },

  'Audit Logs': {
    call: 'getAuditLogs',
    key: 'logs',
    title: 'Finance Audit Logs',
    empty:
      'No Finance-relevant audit events are available.',
    columns: [
      ['Action', 'action'],
      ['Category', 'category'],
      ['Actor', 'actor'],
      ['Description', 'description'],
      ['Date', 'createdAt'],
    ],
  },
};

const display = (
  key: string,
  value: any,
  row: any,
) => {
  if (
    key
      .toLowerCase()
      .includes('amount')
  ) {
    return currency(
      value,
      row.currency,
    );
  }

  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  if (
    typeof value === 'string' &&
    /date|at$/i.test(key)
  ) {
    const date =
      new Date(value);

    return Number.isNaN(
      date.getTime(),
    )
      ? value
      : date.toLocaleDateString();
  }

  return value || '—';
};

/*
 * --------------------------------------------------------------------------
 * REAL FINANCE DEAL TRANSACTIONS
 * --------------------------------------------------------------------------
 *
 * This view is backed by:
 *
 * GET  /api/v1/deals/my
 * PATCH /api/v1/deals/:dealId/payment-verify
 * PATCH /api/v1/deals/:dealId/complete
 *
 * Finance sees the same persistent Deal records created from accepted Offers.
 */

function FinanceDealTransactionsView() {
  const {
    showToast,
  } = useToast();

  const [
    deals,
    setDeals,
  ] = useState<any[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    processingId,
    setProcessingId,
  ] = useState<
    string | null
  >(null);

  const loadDeals =
    useCallback(
      async () => {
        setLoading(true);
        setError('');

        try {
          const response: any =
            await dealApi.getMyDeals();

          /*
           * Axios-style response:
           *
           * response.data
           *   -> backend JSON
           *      -> data.deals
           *
           * Also tolerate an already-unwrapped response.
           */
          const payload =
            response?.data ??
            response;

          const rows =
            Array.isArray(
              payload?.data
                ?.deals,
            )
              ? payload.data
                  .deals
              : Array.isArray(
                payload?.deals,
              )
                ? payload.deals
                : [];

          setDeals(rows);
        } catch (err: any) {
          console.error(
            'Failed to load Finance Deals:',
            err,
          );

          setError(
            err?.message ||
              'Unable to load Deal transactions.',
          );
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    void loadDeals();
  }, [loadDeals]);

  const handleVerifyPayment =
    async (
      dealId: string,
    ) => {
      try {
        setProcessingId(
          dealId,
        );

        await dealApi.verifyPayment(
          dealId,
        );

        showToast({
          type: 'success',
          title:
            'Payment verified',
          description:
            'The Deal payment has been verified successfully.',
        });

        await loadDeals();
      } catch (err: any) {
        console.error(
          'Failed to verify Deal payment:',
          err,
        );

        showToast({
          type: 'error',
          title:
            'Payment verification failed',
          description:
            err?.message ||
            'Unable to verify this Deal payment.',
        });
      } finally {
        setProcessingId(
          null,
        );
      }
    };

  const handleCompleteDeal =
    async (
      dealId: string,
    ) => {
      try {
        setProcessingId(
          dealId,
        );

        await dealApi.completeDeal(
          dealId,
        );

        showToast({
          type: 'success',
          title:
            'Deal completed',
          description:
            'The transaction has been completed successfully.',
        });

        await loadDeals();
      } catch (err: any) {
        console.error(
          'Failed to complete Deal:',
          err,
        );

        showToast({
          type: 'error',
          title:
            'Deal completion failed',
          description:
            err?.message ||
            'Unable to complete this Deal.',
        });
      } finally {
        setProcessingId(
          null,
        );
      }
    };

  const rows =
    deals.filter(
      (deal) =>
        JSON.stringify(
          deal,
        )
          .toLowerCase()
          .includes(
            search
              .toLowerCase(),
          ),
    );

  const completedDeals =
    deals.filter(
      (deal) =>
        deal.status ===
        'Completed',
    );

  const paymentPendingDeals =
    deals.filter(
      (deal) =>
        deal.agreementStatus ===
          'Completed' &&
        deal.paymentStatus ===
          'Pending',
    );

  const verifiedPayments =
    deals.filter(
      (deal) =>
        deal.paymentStatus ===
        'Verified',
    );

  const totalDealValue =
    deals.reduce(
      (
        total,
        deal,
      ) =>
        total +
        Number(
          deal.agreedAmount ||
            0,
        ),
      0,
    );

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">
            Deal Transactions
          </h2>

          <p className="text-sm text-ink/60">
            Financial transaction records derived from Luxora Deals.
          </p>
        </div>

        <GhostButton
          onClick={() =>
            void loadDeals()
          }
          disabled={loading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </GhostButton>
      </div>

      {/* Finance Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <p className="text-xs uppercase text-ink/50">
            Total Deal Value
          </p>

          <p className="mt-2 text-2xl font-bold text-gold-400">
            {currency(
              totalDealValue,
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <p className="text-xs uppercase text-ink/50">
            Payment Pending
          </p>

          <p className="mt-2 text-2xl font-bold text-orange-400">
            {
              paymentPendingDeals.length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <p className="text-xs uppercase text-ink/50">
            Payment Verified
          </p>

          <p className="mt-2 text-2xl font-bold text-blue-400">
            {
              verifiedPayments.length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <p className="text-xs uppercase text-ink/50">
            Completed
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {
              completedDeals.length
            }
          </p>
        </div>
      </div>

      {/* Search */}
      <DataTableToolbar
        searchValue={search}
        onSearchChange={
          setSearch
        }
        searchPlaceholder="Search Deal, property, buyer..."
        showRefresh
        onRefresh={() =>
          void loadDeals()
        }
      />

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-400/25 bg-rose-400/10 p-4 text-rose-200">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />

          <span>
            {error}
          </span>

          <button
            onClick={() =>
              void loadDeals()
            }
            className="ml-auto underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Deals Table */}
      <DataTable
        isLoading={loading}
        data={rows}
        keyExtractor={(
          row: any,
          index: number,
        ) =>
          row?._id ||
          row?.dealId ||
          String(index)
        }
        emptyState={
          <EmptyState
            title="No Deal transactions"
            description="Accepted Deals will appear here for Finance to monitor payment and completion."
          />
        }
        columns={[
          {
            header:
              'Deal',

            render: (
              row: any,
            ) => (
              <div>
                <div className="font-semibold text-cream">
                  {
                    row.dealId ||
                    'Deal unavailable'
                  }
                </div>

                <div className="text-xs text-ink/50">
                  {
                    row.property
                      ?.title ||
                    'Property unavailable'
                  }
                </div>
              </div>
            ),
          },

          {
            header:
              'Buyer',

            render: (
              row: any,
            ) =>
              row.buyer
                ?.fullName ||
              'Buyer unavailable',
          },

          {
            header:
              'Owner',

            render: (
              row: any,
            ) =>
              row.owner
                ?.fullName ||
              'Owner unavailable',
          },

          {
            header:
              'Agreed Amount',

            render: (
              row: any,
            ) => (
              <span className="font-bold text-cream">
                {currency(
                  Number(
                    row.agreedAmount ||
                      0,
                  ),
                  row.property
                    ?.currency ||
                    'NGN',
                )}
              </span>
            ),
          },

          {
            header:
              'Agreement',

            render: (
              row: any,
            ) => (
              <span
                className={
                  row.agreementStatus ===
                  'Completed'
                    ? 'text-emerald-400 text-xs font-semibold'
                    : 'text-orange-400 text-xs font-semibold'
                }
              >
                {
                  row.agreementStatus ||
                  'Pending'
                }
              </span>
            ),
          },

          {
            header:
              'Payment',

            render: (
              row: any,
            ) => (
              <span
                className={
                  row.paymentStatus ===
                  'Verified'
                    ? 'text-emerald-400 text-xs font-semibold'
                    : 'text-orange-400 text-xs font-semibold'
                }
              >
                {
                  row.paymentStatus ||
                  'Pending'
                }
              </span>
            ),
          },

          {
            header:
              'Deal Status',

            render: (
              row: any,
            ) => (
              <EnterpriseStatusBadge
                status={
                  row.status ||
                  'Unknown'
                }
              />
            ),
          },

          {
            header:
              'Date',

            render: (
              row: any,
            ) =>
              row.createdAt
                ? new Date(
                    row.createdAt,
                  ).toLocaleDateString()
                : '—',
          },

          {
            header:
              'Actions',

            render: (
              row: any,
            ) => {
              const isProcessing =
                processingId ===
                row._id;

              const canVerifyPayment =
                row.agreementStatus ===
                  'Completed' &&
                row.paymentStatus ===
                  'Pending';

              const canCompleteDeal =
                row.paymentStatus ===
                  'Verified' &&
                row.status !==
                  'Completed';

              if (
                canVerifyPayment
              ) {
                return (
                  <GhostButton
                    disabled={
                      isProcessing
                    }
                    onClick={() =>
                      void handleVerifyPayment(
                        row._id,
                      )
                    }
                    className="h-8 px-3 text-xs text-blue-400"
                  >
                    <CreditCard className="mr-1.5 h-3.5 w-3.5" />

                    {isProcessing
                      ? 'Verifying...'
                      : 'Verify Payment'}
                  </GhostButton>
                );
              }

              if (
                canCompleteDeal
              ) {
                return (
                  <GhostButton
                    disabled={
                      isProcessing
                    }
                    onClick={() =>
                      void handleCompleteDeal(
                        row._id,
                      )
                    }
                    className="h-8 px-3 text-xs text-emerald-400"
                  >
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />

                    {isProcessing
                      ? 'Completing...'
                      : 'Complete Deal'}
                  </GhostButton>
                );
              }

              return (
                <span className="text-xs text-ink/40">
                  No action
                </span>
              );
            },
          },
        ]}
      />
    </div>
  );
}

/*
 * --------------------------------------------------------------------------
 * GENERIC FINANCE DATA VIEW
 * --------------------------------------------------------------------------
 *
 * Transactions are intercepted above and use FinanceDealTransactionsView.
 * All other Finance tabs continue using their existing finance API sources.
 */

export function FinanceDataView({
  tab,
}: {
  tab: string;
}) {


  const item =
    config[tab];

  const [
    data,
    setData,
  ] = useState<any[]>(
    [],
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  const [
    search,
    setSearch,
  ] = useState('');

  const load =
    useCallback(
      async () => {
        if (
          !item
        ) {
          setLoading(
            false,
          );
          return;
        }

        setLoading(true);
        setError('');

        try {
          const response: any =
            await (
              financeApi as any
            )[item.call]();

          setData(
            response?.data?.[
              item.key
            ] || [],
          );
        } catch (err: any) {
          setError(
            err?.message ||
              'Unable to load finance data.',
          );
        } finally {
          setLoading(false);
        }
      },
      [item],
    );

  useEffect(() => {
    void load();
  }, [load]);

  if (!item) {
    return (
      <div className="max-w-3xl">
        <EmptyState
          title={`${tab} is not available`}
          description="No Finance data source has been configured for this section."
        />
      </div>
    );
  }

  const rows =
    data.filter(
      (row) =>
        JSON.stringify(
          row,
        )
          .toLowerCase()
          .includes(
            search.toLowerCase(),
          ),
    );

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">
            {item.title}
          </h2>

          <p className="text-sm text-ink/60">
            Live records from Luxora’s existing financial domains.
          </p>
        </div>

        <GhostButton
          onClick={() =>
            void load()
          }
          disabled={loading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </GhostButton>
      </div>

      <DataTableToolbar
        searchValue={search}
        onSearchChange={
          setSearch
        }
        searchPlaceholder="Search records..."
        showRefresh
        onRefresh={() =>
          void load()
        }
      />

      {error && (
        <div className="flex gap-2 rounded-xl border border-rose-400/25 bg-rose-400/10 p-4 text-rose-200">
          <AlertCircle className="h-4 w-4" />

          <span>
            {error}
          </span>

          <button
            onClick={() =>
              void load()
            }
            className="ml-auto underline"
          >
            Retry
          </button>
        </div>
      )}

      <DataTable
        isLoading={loading}
        data={rows}
        keyExtractor={(
          row: any,
          index: number,
        ) =>
          row?.id ||
          row?._id ||
          String(index)
        }
        emptyState={
          <EmptyState
            title="No records yet"
            description={
              item.empty
            }
          />
        }
        columns={
          item.columns.map(
            (
              [
                header,
                key,
              ]: string[],
            ) => ({
              header,

              render: (
                row: any,
              ) =>
                display(
                  key,
                  row[key],
                  row,
                ),
            }),
          )
        }
      />
    </div>
  );
}

/*
 * --------------------------------------------------------------------------
 * FINANCE OVERVIEW
 * --------------------------------------------------------------------------
 */

export function FinanceOverview() {
  const [
    result,
    setResult,
  ] = useState<any>(
    null,
  );

  const [
    error,
    setError,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(true);

  const load =
    useCallback(
      async () => {
        setLoading(true);
        setError('');

        try {
          setResult(
            await financeApi.getOverview(),
          );
        } catch (err: any) {
          setError(
            err?.message ||
              'Unable to load finance overview.',
          );
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    void load();
  }, [load]);

  const summary =
    result?.overview
      ?.summary;

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">
            Finance Overview
          </h2>

          <p className="text-sm text-ink/60">
            Actual amounts are limited to their source domains.
          </p>
        </div>

        <GhostButton
          onClick={() =>
            void load()
          }
          disabled={loading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </GhostButton>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-400/25 bg-rose-400/10 p-4 text-rose-200">
          {error}

          <button
            className="ml-2 underline"
            onClick={() =>
              void load()
            }
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-ink/50">
          Loading finance overview…
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [
                'Completed service revenue',
                summary?.realizedServiceRevenue,
              ],

              [
                'Owner payments collected',
                summary?.ownerPaymentsCollected,
              ],

              [
                'Pending owner payments',
                summary?.pendingOwnerPayments,
              ],

              [
                'Paid commission obligations',
                summary?.paidCommissionObligations,
              ],

              [
                'Pending commission obligations',
                summary?.pendingCommissionObligations,
              ],

              [
                'Active mortgage applications',
                summary?.activeMortgageApplications,
              ],
            ].map(
              ([
                label,
                value,
              ]) => (
                <div
                  key={String(
                    label,
                  )}
                  className="rounded-2xl border border-white/10 bg-navy-800/50 p-5"
                >
                  <p className="text-xs uppercase text-ink/50">
                    {
                      label
                    }
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gold-400">
                    {String(
                      label,
                    ).includes(
                      'applications',
                    )
                      ? value ||
                        0
                      : currency(
                          Number(
                            value ||
                              0,
                          ),
                        )}
                  </p>
                </div>
              ),
            )}
          </div>

          <DataTable
            data={
              result?.overview
                ?.recentActivity ||
              []
            }
            keyExtractor={(
              row: any,
              index: number,
            ) =>
              row?.id ||
              String(index)
            }
            emptyState={
              <EmptyState
                title="No Finance activity"
                description="Finance-relevant audit activity will appear here."
              />
            }
            columns={[
              {
                header:
                  'Action',
                render: (
                  row: any,
                ) =>
                  row.action,
              },

              {
                header:
                  'Category',
                render: (
                  row: any,
                ) =>
                  row.category,
              },

              {
                header:
                  'Description',
                render: (
                  row: any,
                ) =>
                  row.description,
              },
            ]}
          />
        </>
      )}
    </div>
  );
}

/*
 * --------------------------------------------------------------------------
 * FINANCE REPORTS
 * --------------------------------------------------------------------------
 */

export function FinanceReports() {
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadReport = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response: any = await financeApi.getReports();

      /*
       * Support both:
       * - an already-unwrapped Axios response
       * - a normal AxiosResponse shape
       */
      const payload = response?.data ?? response;

      const reports =
        payload?.reports ??
        payload?.data?.reports ??
        null;

      setReport(reports);
    } catch (err: any) {
      console.error(
        'Failed to load Finance report:',
        err,
      );

      setError(
        err?.message ||
          'Unable to load Finance report.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  const data = report?.report ?? {};

  const counts = data?.counts ?? {};

  const formatCurrency = (value: number) =>
    currency(Number(value) || 0);

  const formatDateTime = (value?: string) => {
    if (!value) {
      return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString('en-NG', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const financialMetrics = [
    {
      label: 'Realized Service Revenue',
      value: formatCurrency(
        data.realizedServiceRevenue,
      ),
      description:
        'Completed Home Services revenue',
      icon: CreditCard,
      iconColor: 'text-emerald-400',
      backgroundColor:
        'bg-emerald-400/10',
    },
    {
      label: 'Owner Payments Collected',
      value: formatCurrency(
        data.ownerPaymentsCollected,
      ),
      description:
        'Owner payments recorded as collected',
      icon: CheckCircle2,
      iconColor: 'text-blue-400',
      backgroundColor:
        'bg-blue-400/10',
    },
    {
      label: 'Paid Commission Obligations',
      value: formatCurrency(
        data.paidCommissionObligations,
      ),
      description:
        'Commission obligations already paid',
      icon: CheckCircle2,
      iconColor: 'text-gold-400',
      backgroundColor:
        'bg-gold-400/10',
    },
    {
      label: 'Pending Commission Obligations',
      value: formatCurrency(
        data.pendingCommissionObligations,
      ),
      description:
        'Commission obligations still pending',
      icon: RefreshCw,
      iconColor: 'text-yellow-400',
      backgroundColor:
        'bg-yellow-400/10',
    },
    {
      label: 'Pending Owner Payments',
      value: formatCurrency(
        data.pendingOwnerPayments,
      ),
      description:
        'Owner payments not yet collected',
      icon: AlertCircle,
      iconColor: 'text-orange-400',
      backgroundColor:
        'bg-orange-400/10',
    },
    {
      label: 'Active Mortgage Applications',
      value: String(
        Number(
          data.activeMortgageApplications,
        ) || 0,
      ),
      description:
        'Applications currently active',
      icon: CreditCard,
      iconColor: 'text-purple-400',
      backgroundColor:
        'bg-purple-400/10',
    },
  ];

  const reportCounts = [
    {
      label: 'Owner Payments',
      value:
        Number(counts.ownerPayments) || 0,
    },
    {
      label: 'Agency Earnings',
      value:
        Number(counts.agencyEarnings) || 0,
    },
    {
      label: 'Agent Commissions',
      value:
        Number(counts.agentCommissions) || 0,
    },
    {
      label: 'Mortgage Applications',
      value:
        Number(counts.mortgageApplications) || 0,
    },
    {
      label: 'Procurement Budgets',
      value:
        Number(counts.procurementBudget) || 0,
    },
    {
      label: 'Audit Logs',
      value:
        Number(counts.auditLogs) || 0,
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">
            Finance Reports
          </h2>

          <p className="mt-1 text-sm text-ink/60">
            Consolidated financial reporting from the Finance data service.
          </p>
        </div>

        <GhostButton
          className="flex items-center gap-2"
          onClick={() => void loadReport()}
          disabled={loading}
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading ? 'animate-spin' : ''
            }`}
          />

          {loading
            ? 'Refreshing...'
            : 'Refresh Report'}
        </GhostButton>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-rose-400" />

            <div>
              <p className="font-medium text-rose-300">
                Unable to load Finance report
              </p>

              <p className="mt-1 text-sm text-rose-300/70">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && !report ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-navy-800/50 p-6"
                >
                  <div className="h-11 w-11 animate-pulse rounded-xl bg-white/5" />

                  <div className="mt-5 h-4 w-36 animate-pulse rounded bg-white/5" />

                  <div className="mt-3 h-8 w-44 animate-pulse rounded bg-white/5" />

                  <div className="mt-3 h-3 w-52 animate-pulse rounded bg-white/5" />
                </div>
              ),
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <div className="h-6 w-48 animate-pulse rounded bg-white/5" />

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-white/10 bg-navy-900/40 p-4"
                    >
                      <div className="h-3 w-24 animate-pulse rounded bg-white/5" />
                      <div className="mt-3 h-7 w-12 animate-pulse rounded bg-white/5" />
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <div className="h-6 w-40 animate-pulse rounded bg-white/5" />
              <div className="mt-4 h-20 w-full animate-pulse rounded bg-white/5" />
            </div>
          </div>
        </>
      ) : report ? (
        <>
          {/* Financial Summary */}
          <div>
            <div className="mb-4">
              <h3 className="font-heading text-lg font-bold text-cream">
                Financial Summary
              </h3>

              <p className="mt-1 text-sm text-ink/50">
                Current values available from the Finance reporting service.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {financialMetrics.map(
                (metric) => {
                  const Icon =
                    metric.icon;

                  return (
                    <div
                      key={metric.label}
                      className="rounded-2xl border border-white/10 bg-navy-800/50 p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${metric.backgroundColor}`}
                        >
                          <Icon
                            className={`h-5 w-5 ${metric.iconColor}`}
                          />
                        </div>
                      </div>

                      <p className="mt-5 text-sm text-ink/60">
                        {metric.label}
                      </p>

                      <p className="mt-2 text-2xl font-bold text-cream">
                        {metric.value}
                      </p>

                      <p className="mt-2 text-xs text-ink/40">
                        {metric.description}
                      </p>
                    </div>
                  );
                },
              )}
            </div>
          </div>

          {/* Report Coverage + Reporting Notes */}
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <div>
                <h3 className="font-heading text-lg font-bold text-cream">
                  Report Coverage
                </h3>

                <p className="mt-1 text-sm text-ink/50">
                  Records currently represented by the Finance reporting layer.
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {reportCounts.map(
                  (item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-white/10 bg-navy-900/40 p-4"
                    >
                      <p className="text-xs uppercase tracking-wide text-ink/40">
                        {item.label}
                      </p>

                      <p className="mt-2 text-2xl font-bold text-cream">
                        {item.value}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                </div>

                <div>
                  <h3 className="font-heading text-lg font-bold text-cream">
                    Reporting Scope
                  </h3>

                  <p className="text-xs text-ink/40">
                    Current Finance rules
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-ink/60">
                {data.note ||
                  'Finance reporting currently includes only data supported by completed financial domains.'}
              </p>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs uppercase tracking-wide text-ink/40">
                  Generated
                </p>

                <p className="mt-2 text-sm font-medium text-cream">
                  {formatDateTime(
                    report.generatedAt,
                  )}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-8 text-center">
          <p className="text-sm text-ink/50">
            No Finance report data is currently available.
          </p>
        </div>
      )}
    </div>
  );
}

/*
 * --------------------------------------------------------------------------
 * FINANCE FORECASTING
 * --------------------------------------------------------------------------
 */

export function FinanceForecasting() {
  const [
    data,
    setData,
  ] = useState<any>();

  const [
    error,
    setError,
  ] = useState('');

  useEffect(() => {
    financeApi
      .getForecasting()
      .then(
        (response: any) =>
          setData(
            response.forecasting,
          ),
      )
      .catch(
        (err: any) =>
          setError(
            err.message,
          ),
      );
  }, []);

  return (
    <div className="space-y-6 max-w-5xl">
      <h2 className="font-heading text-2xl font-bold text-cream">
        Forecasting
      </h2>

      {error ? (
        <p className="text-rose-300">
          {error}
        </p>
      ) : !data ? (
        <p className="text-ink/50">
          Loading historical revenue…
        </p>
      ) : !data.sufficientData ? (
        <EmptyState
          title="Insufficient historical data"
          description="At least three months of completed Home Services revenue are required for a calculated estimate."
        />
      ) : (
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <p className="text-ink/60">
            Method: {data.method}.
            {' '}
            Estimates are calculations,
            not actual revenue.
          </p>

          <DataTable
            data={
              data.estimates
            }
            keyExtractor={(
              row: any,
            ) =>
              String(
                row.monthsAhead,
              )
            }
            columns={[
              {
                header:
                  'Months ahead',
                render: (
                  row: any,
                ) =>
                  row.monthsAhead,
              },

              {
                header:
                  'Calculated estimate',
                render: (
                  row: any,
                ) =>
                  currency(
                    row.estimatedRevenue,
                  ),
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}

/*
 * --------------------------------------------------------------------------
 * UNSUPPORTED FINANCE FEATURE
 * --------------------------------------------------------------------------
 */

export function UnsupportedFinanceFeature({
  title,
}: {
  title: string;
}) {
  return (
    <div className="max-w-3xl">
      <EmptyState
        title={`${title} is not available yet`}
        description="Luxora does not yet have an approved source-of-truth for this Finance feature, so no records or figures are shown."
      />
    </div>
  );
}