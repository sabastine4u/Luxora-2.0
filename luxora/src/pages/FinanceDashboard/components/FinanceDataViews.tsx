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
    title: 'Transactions',
    empty:
      'No Deal transactions are available.',
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
  if (
    tab ===
    'Transactions'
  ) {
    return (
      <FinanceDealTransactionsView />
    );
  }

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
  const [
    report,
    setReport,
  ] = useState<any>(
    null,
  );

  const [
    error,
    setError,
  ] = useState('');

  useEffect(() => {
    financeApi
      .getReports()
      .then(setReport)
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
        Finance Reports
      </h2>

      {error ? (
        <p className="text-rose-300">
          {error}
        </p>
      ) : !report ? (
        <p className="text-ink/50">
          Loading report…
        </p>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <p className="text-ink/60">
            {
              report
                ?.reports
                ?.report
                ?.note
            }
          </p>

          <pre className="mt-4 overflow-auto text-sm text-cream">
            {JSON.stringify(
              report
                ?.reports
                ?.report,
              null,
              2,
            )}
          </pre>
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