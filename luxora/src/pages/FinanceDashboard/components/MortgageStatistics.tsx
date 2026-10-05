import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Banknote,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  RefreshCw,
  Search,
  ShieldCheck,
  WalletCards,
  XCircle,
} from 'lucide-react';
import { mortgageApi } from '../../../api/mortgage.api';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EmptyState } from '../../../components/layout/EmptyState';
import {
  EnterpriseDetailDrawer,
  EnterpriseStatusBadge,
} from '../../../components/enterprise';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../contexts/ToastContext';

interface MortgageStage {
  label: string;
  date: string | null;
  completed: boolean;
  completedBy?: {
    _id: string;
    fullName?: string;
    role?: string;
  } | string | null;
}

interface MortgageBuyer {
  _id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
}

interface MortgageProperty {
  _id: string;
  title?: string;
  price?: number;
  transactionType?: string;
  status?: string;
  availabilityStatus?: string;
}

interface MortgageApplication {
  _id: string;
  buyer?: MortgageBuyer | string | null;
  property?: MortgageProperty | null;
  lender?: string;
  requestedLoanAmount: number;
  approvedLoanAmount: number | null;
  interestRate: number | null;
  loanTermYears: number | null;
  monthlyPayment: number | null;
  status: string;
  stages: MortgageStage[];
  approvedAt?: string | null;
  disbursedAt?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface MortgageOperationsResponse {
  applications?: MortgageApplication[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

type WorkflowAction =
  | 'start_verification'
  | 'complete_verification'
  | 'approve'
  | 'reject'
  | 'disburse';

const ACTIVE_STATUSES = [
  'Submitted',
  'Document Verification',
  'Credit Assessment',
  'Approved',
];

const formatCurrency = (
  value: number | null | undefined,
) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (value?: string | null) => {
  if (!value) {
    return 'Not available';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not available';
  }

  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getBuyerName = (
  buyer?: MortgageBuyer | string | null,
) => {
  if (!buyer) {
    return 'Unknown buyer';
  }

  if (typeof buyer === 'string') {
    return buyer;
  }

  return buyer.fullName || buyer.email || buyer._id;
};

const getStageActor = (
  completedBy?: MortgageStage['completedBy'],
) => {
  if (!completedBy) {
    return null;
  }

  if (typeof completedBy === 'string') {
    return completedBy;
  }

  return (
    completedBy.fullName ||
    completedBy.role ||
    completedBy._id
  );
};

const getActionLabel = (
  action: WorkflowAction,
) => {
  switch (action) {
    case 'start_verification':
      return 'Start Verification';

    case 'complete_verification':
      return 'Complete Verification';

    case 'approve':
      return 'Approve Application';

    case 'reject':
      return 'Reject Application';

    case 'disburse':
      return 'Mark as Disbursed';

    default:
      return 'Update Application';
  }
};

export default function MortgageStatistics() {
  const { showToast } = useToast();

  const [applications, setApplications] = useState<
    MortgageApplication[]
  >([]);

  const [selectedApplication, setSelectedApplication] =
    useState<MortgageApplication | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] =
    useState('all');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [workflowLoading, setWorkflowLoading] =
    useState(false);

  const [actionModal, setActionModal] = useState<{
    action: WorkflowAction;
    application: MortgageApplication;
  } | null>(null);

  const [approvedLoanAmount, setApprovedLoanAmount] =
    useState('');

  const [interestRate, setInterestRate] = useState('');
  const [loanTermYears, setLoanTermYears] =
    useState('');
  const [monthlyPayment, setMonthlyPayment] =
    useState('');
  const [rejectionReason, setRejectionReason] =
    useState('');

  const loadApplications = useCallback(
    async () => {
      try {
        setLoading(true);
        setError('');

        const response =
          (await mortgageApi.getFinanceMortgageApplications({
            status: 'all',
          })) as MortgageOperationsResponse;

        setApplications(
          response.applications || [],
        );
      } catch (err: any) {
        console.error(
          'Failed to load Finance mortgage applications:',
          err,
        );

        setError(
          err?.message ||
          'Unable to load mortgage applications.',
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  const filteredApplications = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return applications.filter(
      (application) => {
        const buyerName = getBuyerName(
          application.buyer,
        ).toLowerCase();

        const buyerEmail =
          typeof application.buyer ===
            'object' &&
            application.buyer
            ? application.buyer.email?.toLowerCase() ||
            ''
            : '';

        const propertyTitle =
          application.property?.title?.toLowerCase() ||
          '';

        const lender =
          application.lender?.toLowerCase() ||
          '';

        const id =
          application._id.toLowerCase();

        const matchesSearch =
          !normalizedSearch ||
          buyerName.includes(normalizedSearch) ||
          buyerEmail.includes(normalizedSearch) ||
          propertyTitle.includes(normalizedSearch) ||
          lender.includes(normalizedSearch) ||
          id.includes(normalizedSearch);

        const matchesStatus =
          statusFilter === 'all' ||
          application.status === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      },
    );
  }, [
    applications,
    search,
    statusFilter,
  ]);

  const metrics = useMemo(() => {
    const totalRequested =
      applications.reduce(
        (sum, application) =>
          sum +
          Number(
            application.requestedLoanAmount || 0,
          ),
        0,
      );

    const totalApproved =
      applications.reduce(
        (sum, application) =>
          sum +
          Number(
            application.approvedLoanAmount || 0,
          ),
        0,
      );

    const totalDisbursed =
      applications
        .filter(
          (application) =>
            application.status ===
            'Disbursed',
        )
        .reduce(
          (sum, application) =>
            sum +
            Number(
              application.approvedLoanAmount ||
              0,
            ),
          0,
        );

    return {
      total: applications.length,

      active: applications.filter(
        (application) =>
          ACTIVE_STATUSES.includes(
            application.status,
          ),
      ).length,

      submitted: applications.filter(
        (application) =>
          application.status ===
          'Submitted',
      ).length,

      creditAssessment:
        applications.filter(
          (application) =>
            application.status ===
            'Credit Assessment',
        ).length,

      approved: applications.filter(
        (application) =>
          application.status ===
          'Approved',
      ).length,

      disbursed: applications.filter(
        (application) =>
          application.status ===
          'Disbursed',
      ).length,

      rejected: applications.filter(
        (application) =>
          application.status ===
          'Rejected',
      ).length,

      totalRequested,
      totalApproved,
      totalDisbursed,
    };
  }, [applications]);

  const openApplication = (
    application: MortgageApplication,
  ) => {
    setSelectedApplication(application);
    setDrawerOpen(true);
  };

  const openWorkflowModal = (
    action: WorkflowAction,
    application: MortgageApplication,
  ) => {
    setSelectedApplication(application);

    if (action === 'approve') {
      setApprovedLoanAmount(
        String(
          application.approvedLoanAmount ??
          application.requestedLoanAmount,
        ),
      );

      setInterestRate(
        application.interestRate != null
          ? String(
            application.interestRate,
          )
          : '',
      );

      setLoanTermYears(
        application.loanTermYears != null
          ? String(
            application.loanTermYears,
          )
          : '',
      );

      setMonthlyPayment(
        application.monthlyPayment != null
          ? String(
            application.monthlyPayment,
          )
          : '',
      );
    }

    if (action === 'reject') {
      setRejectionReason('');
    }

    setActionModal({
      action,
      application,
    });
  };

  const closeWorkflowModal = () => {
    if (workflowLoading) {
      return;
    }

    setActionModal(null);
    setRejectionReason('');
  };

  const updateApplicationInState = (
    updatedApplication: MortgageApplication,
  ) => {
    setApplications((current) =>
      current.map(
        (application) =>
          application._id ===
            updatedApplication._id
            ? updatedApplication
            : application,
      ),
    );

    setSelectedApplication(
      updatedApplication,
    );
  };

  const executeWorkflow = async (
    action: WorkflowAction,
    application: MortgageApplication,
    payload: Record<string, unknown> = {},
  ) => {
    try {
      setWorkflowLoading(true);

      const response =
        (await mortgageApi.processMortgageApplication(
          application._id,
          {
            action,
            ...payload,
          },
        )) as {
          application?: MortgageApplication;
        };

      if (!response.application) {
        throw new Error(
          'The server did not return the updated mortgage application.',
        );
      }

      updateApplicationInState(
        response.application,
      );

      setActionModal(null);

      showToast({
        type: 'success',
        title: getActionLabel(action),
        description:
          'The mortgage application workflow has been updated.',
      });
    } catch (err: any) {
      console.error(
        'Failed to process mortgage application:',
        err,
      );

      showToast({
        type: 'error',
        title:
          'Workflow update failed',
        description:
          err?.message ||
          'Unable to update the mortgage application.',
      });
    } finally {
      setWorkflowLoading(false);
    }
  };

  const handleWorkflowSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !actionModal ||
      workflowLoading
    ) {
      return;
    }

    const {
      action,
      application,
    } = actionModal;

    if (action === 'approve') {
      const approvedAmount = Number(
        approvedLoanAmount,
      );

      const rate = Number(
        interestRate,
      );

      const term = Number(
        loanTermYears,
      );

      const payment = Number(
        monthlyPayment,
      );

      const propertyPrice = Number(
        application.property?.price || 0,
      );

      if (
        !Number.isFinite(
          approvedAmount,
        ) ||
        approvedAmount <= 0
      ) {
        showToast({
          type: 'error',
          title:
            'Approval details required',
          description:
            'Enter a valid approved loan amount.',
        });

        return;
      }

      if (
        propertyPrice > 0 &&
        approvedAmount >
        propertyPrice
      ) {
        showToast({
          type: 'error',
          title:
            'Invalid loan amount',
          description:
            'The approved loan amount cannot exceed the current property price.',
        });

        return;
      }

      if (
        !Number.isFinite(rate) ||
        rate < 0
      ) {
        showToast({
          type: 'error',
          title:
            'Interest rate required',
          description:
            'Enter a valid interest rate.',
        });

        return;
      }

      if (
        !Number.isInteger(term) ||
        term < 1
      ) {
        showToast({
          type: 'error',
          title:
            'Loan term required',
          description:
            'Enter a valid loan term in years.',
        });

        return;
      }

      if (
        !Number.isFinite(payment) ||
        payment <= 0
      ) {
        showToast({
          type: 'error',
          title:
            'Monthly payment required',
          description:
            'Enter a valid monthly payment amount.',
        });

        return;
      }

      await executeWorkflow(
        'approve',
        application,
        {
          approvedLoanAmount:
            approvedAmount,

          interestRate: rate,

          loanTermYears: term,

          monthlyPayment: payment,
        },
      );

      return;
    }

    if (action === 'reject') {
      const reason =
        rejectionReason.trim();

      if (!reason) {
        showToast({
          type: 'error',
          title:
            'Rejection reason required',
          description:
            'Provide a reason before rejecting the application.',
        });

        return;
      }

      await executeWorkflow(
        'reject',
        application,
        {
          rejectionReason:
            reason,
        },
      );

      return;
    }

    await executeWorkflow(
      action,
      application,
    );
  };

  const renderWorkflowActions = (
    application: MortgageApplication,
  ) => {
    switch (
    application.status
    ) {
      case 'Submitted':
        return (
          <GoldButton
            size="sm"
            onClick={() =>
              openWorkflowModal(
                'start_verification',
                application,
              )
            }
          >
            <FileCheck2 className="h-4 w-4" />
            Start Verification
          </GoldButton>
        );

      case 'Document Verification':
        return (
          <GoldButton
            size="sm"
            onClick={() =>
              openWorkflowModal(
                'complete_verification',
                application,
              )
            }
          >
            <ClipboardCheck className="h-4 w-4" />
            Complete Verification
          </GoldButton>
        );

      case 'Credit Assessment':
        return (
          <div className="flex flex-wrap gap-2">
            <GoldButton
              size="sm"
              onClick={() =>
                openWorkflowModal(
                  'approve',
                  application,
                )
              }
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </GoldButton>

            <GhostButton
              size="sm"
              onClick={() =>
                openWorkflowModal(
                  'reject',
                  application,
                )
              }
            >
              <XCircle className="h-4 w-4" />
              Reject
            </GhostButton>
          </div>
        );

      case 'Approved':
        return (
          <GoldButton
            size="sm"
            onClick={() =>
              openWorkflowModal(
                'disburse',
                application,
              )
            }
          >
            <WalletCards className="h-4 w-4" />
            Mark Disbursed
          </GoldButton>
        );

      default:
        return null;
    }
  };

  const renderActionModal = () => {
    if (!actionModal) {
      return null;
    }

    const {
      action,
      application,
    } = actionModal;

    const isFormAction =
      action === 'approve' ||
      action === 'reject';

    if (!isFormAction) {
      return (
        <Modal
          isOpen
          onClose={closeWorkflowModal}
          title={getActionLabel(action)}
          size="md"
          actionButton={
            <GoldButton
              size="sm"
              onClick={() => {
                void executeWorkflow(
                  action,
                  application,
                );
              }}
              disabled={
                workflowLoading
              }
            >
              {workflowLoading
                ? 'Updating...'
                : getActionLabel(
                  action,
                )}
            </GoldButton>
          }
        >
          <div className="space-y-4">
            <p className="text-sm leading-6 text-ink/60">
              Confirm that you want to move
              this mortgage application from{' '}
              <span className="font-semibold text-cream">
                {application.status}
              </span>{' '}
              to its next workflow stage.
            </p>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-wider text-ink/50">
                Application
              </p>

              <p className="mt-1 font-semibold text-cream">
                {getBuyerName(
                  application.buyer,
                )}
              </p>

              <p className="mt-1 text-sm text-ink/60">
                {application.property?.title ||
                  'Property financing application'}
              </p>
            </div>
          </div>
        </Modal>
      );
    }

    return (
      <Modal
        isOpen
        onClose={closeWorkflowModal}
        title={getActionLabel(action)}
        size="lg"
        actionButton={
          <GoldButton
            size="sm"
            disabled={workflowLoading}
            onClick={() => {
              const form = document.getElementById(
                'mortgage-workflow-form',
              ) as HTMLFormElement | null;

              form?.requestSubmit();
            }}
          >
            {workflowLoading
              ? 'Processing...'
              : getActionLabel(action)}
          </GoldButton>
        }
      >
        <form
          id="mortgage-workflow-form"
          onSubmit={
            handleWorkflowSubmit
          }
          className="space-y-5"
        >
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-ink/50">
              Application
            </p>

            <p className="mt-1 font-semibold text-cream">
              {getBuyerName(
                application.buyer,
              )}
            </p>

            <p className="mt-1 text-sm text-ink/60">
              {application.property?.title ||
                'Property financing application'}
            </p>
          </div>

          {action === 'approve' ? (
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-cream">
                    Approved Loan Amount
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={
                      approvedLoanAmount
                    }
                    onChange={(event) =>
                      setApprovedLoanAmount(
                        event.target.value,
                      )
                    }
                    disabled={
                      workflowLoading
                    }
                    className="w-full rounded-xl border border-white/10 bg-navy-900/60 px-4 py-3 text-sm text-cream outline-none focus:border-gold-400/50"
                  />

                  <p className="mt-2 text-xs text-ink/50">
                    Property price:{' '}
                    {formatCurrency(
                      application.property
                        ?.price,
                    )}
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-cream">
                    Interest Rate (%)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      interestRate
                    }
                    onChange={(event) =>
                      setInterestRate(
                        event.target.value,
                      )
                    }
                    disabled={
                      workflowLoading
                    }
                    className="w-full rounded-xl border border-white/10 bg-navy-900/60 px-4 py-3 text-sm text-cream outline-none focus:border-gold-400/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-cream">
                    Loan Term (Years)
                  </label>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={
                      loanTermYears
                    }
                    onChange={(event) =>
                      setLoanTermYears(
                        event.target.value,
                      )
                    }
                    disabled={
                      workflowLoading
                    }
                    className="w-full rounded-xl border border-white/10 bg-navy-900/60 px-4 py-3 text-sm text-cream outline-none focus:border-gold-400/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-cream">
                    Monthly Payment
                  </label>

                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={
                      monthlyPayment
                    }
                    onChange={(event) =>
                      setMonthlyPayment(
                        event.target.value,
                      )
                    }
                    disabled={
                      workflowLoading
                    }
                    className="w-full rounded-xl border border-white/10 bg-navy-900/60 px-4 py-3 text-sm text-cream outline-none focus:border-gold-400/50"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-400" />

                  <p className="text-sm leading-6 text-ink/70">
                    Approval records the Finance Manager's
                    decision, approved loan amount, interest
                    rate, term, and monthly payment. The
                    application will move to{' '}
                    <span className="font-semibold text-cream">
                      Approved
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="mb-2 block text-sm font-medium text-cream">
                Rejection Reason
              </label>

              <textarea
                rows={6}
                value={rejectionReason}
                onChange={(event) =>
                  setRejectionReason(
                    event.target.value,
                  )
                }
                disabled={
                  workflowLoading
                }
                placeholder="Provide the reason for rejecting this mortgage application."
                className="w-full resize-none rounded-xl border border-white/10 bg-navy-900/60 px-4 py-3 text-sm text-cream outline-none placeholder:text-ink/40 focus:border-gold-400/50"
              />
            </div>
          )}
        </form>
      </Modal>
    );
  };

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Banknote className="h-6 w-6 text-gold-400" />

            <h2 className="font-heading text-2xl font-bold text-cream">
              Mortgage Statistics
            </h2>
          </div>

          <p className="mt-1 max-w-3xl text-sm text-ink/60">
            Review real mortgage applications and move
            them through Luxora's Finance workflow from
            verification to disbursement.
          </p>
        </div>

        <GhostButton
          size="sm"
          onClick={() =>
            void loadApplications()
          }
          disabled={loading}
        >
          <RefreshCw
            className={`h-4 w-4 ${loading
              ? 'animate-spin'
              : ''
              }`}
          />
          Refresh
        </GhostButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          {
            label: 'Applications',
            value: metrics.total,
            icon: ClipboardCheck,
            accent:
              'text-gold-400',
          },
          {
            label: 'Active',
            value: metrics.active,
            icon: Clock3,
            accent:
              'text-yellow-400',
          },
          {
            label: 'Approved',
            value: metrics.approved,
            icon: CheckCircle2,
            accent:
              'text-emerald-400',
          },
          {
            label: 'Rejected',
            value: metrics.rejected,
            icon: XCircle,
            accent:
              'text-rose-400',
          },
          {
            label: 'Disbursed',
            value: metrics.disbursed,
            icon: WalletCards,
            accent:
              'text-blue-400',
          },
        ].map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="rounded-2xl border border-white/10 bg-navy-800/50 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-wider text-ink/50">
                  {metric.label}
                </p>

                <Icon
                  className={`h-4 w-4 ${metric.accent}`}
                />
              </div>

              <p className="mt-2 text-2xl font-bold text-cream">
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <p className="text-xs uppercase tracking-wider text-ink/50">
            Requested Loan Volume
          </p>

          <p className="mt-2 text-xl font-bold text-gold-400">
            {formatCurrency(
              metrics.totalRequested,
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <p className="text-xs uppercase tracking-wider text-ink/50">
            Approved Loan Volume
          </p>

          <p className="mt-2 text-xl font-bold text-emerald-400">
            {formatCurrency(
              metrics.totalApproved,
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5">
          <p className="text-xs uppercase tracking-wider text-ink/50">
            Disbursed Loan Volume
          </p>

          <p className="mt-2 text-xl font-bold text-blue-400">
            {formatCurrency(
              metrics.totalDisbursed,
            )}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <DataTableToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search buyer, property, lender, or application..."
            showRefresh
            onRefresh={() =>
              void loadApplications()
            }
          />

          <div className="relative min-w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value,
                )
              }
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2.5 pl-9 pr-4 text-sm text-cream outline-none focus:border-gold-400/50"
            >
              <option value="all">
                All statuses
              </option>

              <option value="Submitted">
                Submitted
              </option>

              <option value="Document Verification">
                Document Verification
              </option>

              <option value="Credit Assessment">
                Credit Assessment
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Rejected">
                Rejected
              </option>

              <option value="Disbursed">
                Disbursed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-300">
            <div className="flex items-center justify-between gap-4">
              <span>{error}</span>

              <button
                type="button"
                onClick={() =>
                  void loadApplications()
                }
                className="shrink-0 underline underline-offset-2"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <DataTable
          isLoading={loading}
          data={filteredApplications}
          keyExtractor={(application) =>
            application._id
          }
          onRowClick={
            openApplication
          }
          emptyState={
            <EmptyState
              title="No mortgage applications"
              description={
                search ||
                  statusFilter !== 'all'
                  ? 'No applications match the current search or status filter.'
                  : 'No mortgage applications have been submitted yet.'
              }
            />
          }
          columns={[
            {
              header: 'Applicant',
              render: (application) => (
                <div>
                  <p className="font-semibold text-cream">
                    {getBuyerName(
                      application.buyer,
                    )}
                  </p>

                  <p className="mt-1 text-xs text-ink/50">
                    {typeof application.buyer ===
                      'object' &&
                      application.buyer
                      ? application.buyer.email ||
                      'No email'
                      : 'Buyer account'}
                  </p>
                </div>
              ),
            },

            {
              header: 'Property',
              render: (application) => (
                <div className="max-w-xs">
                  <p className="truncate text-cream">
                    {application.property
                      ?.title ||
                      'Property unavailable'}
                  </p>

                  <p className="mt-1 text-xs text-ink/50">
                    {formatCurrency(
                      application.property
                        ?.price,
                    )}
                  </p>
                </div>
              ),
            },

            {
              header: 'Requested',
              className:
                'font-semibold text-gold-400',
              render: (application) =>
                formatCurrency(
                  application.requestedLoanAmount,
                ),
            },

            {
              header: 'Status',
              render: (application) => (
                <EnterpriseStatusBadge
                  status={
                    application.status
                  }
                />
              ),
            },

            {
              header: 'Submitted',
              render: (application) =>
                formatDate(
                  application.createdAt,
                ),
            },

            {
              header: (
                <div className="text-right">
                  Action
                </div>
              ),
              className:
                'text-right',
              render: (
                application,
              ) => (
                <div
                  className="flex justify-end"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >
                  {renderWorkflowActions(
                    application,
                  ) || (
                      <span className="text-xs text-ink/40">
                        No action
                      </span>
                    )}
                </div>
              ),
            },
          ]}
        />
      </div>

      <EnterpriseDetailDrawer
        isOpen={drawerOpen}
        onClose={() =>
          setDrawerOpen(false)
        }
        title="Mortgage Application"
        subtitle={
          selectedApplication?._id
        }
        footerActions={
          selectedApplication
            ? renderWorkflowActions(
              selectedApplication,
            )
            : null
        }
      >
        {selectedApplication && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-ink/50">
                  Buyer
                </p>

                <p className="mt-1 text-lg font-semibold text-cream">
                  {getBuyerName(
                    selectedApplication.buyer,
                  )}
                </p>

                {typeof selectedApplication.buyer ===
                  'object' &&
                  selectedApplication.buyer
                    ?.email && (
                    <p className="mt-1 text-sm text-ink/60">
                      {
                        selectedApplication
                          .buyer.email
                      }
                    </p>
                  )}
              </div>

              <EnterpriseStatusBadge
                status={
                  selectedApplication.status
                }
              />
            </div>

            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="font-heading text-base font-semibold text-cream">
                Property &amp; Loan
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink/40">
                    Property
                  </p>

                  <p className="mt-1 text-sm text-cream">
                    {selectedApplication
                      .property?.title ||
                      'Property unavailable'}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-ink/40">
                    Property Price
                  </p>

                  <p className="mt-1 text-sm font-semibold text-cream">
                    {formatCurrency(
                      selectedApplication
                        .property?.price,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-ink/40">
                    Requested Loan
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gold-400">
                    {formatCurrency(
                      selectedApplication.requestedLoanAmount,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-ink/40">
                    Approved Loan
                  </p>

                  <p className="mt-1 text-sm font-semibold text-emerald-400">
                    {selectedApplication
                      .approvedLoanAmount != null
                      ? formatCurrency(
                        selectedApplication
                          .approvedLoanAmount,
                      )
                      : 'Pending'}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-ink/40">
                    Interest Rate
                  </p>

                  <p className="mt-1 text-sm text-cream">
                    {selectedApplication
                      .interestRate != null
                      ? `${selectedApplication.interestRate}%`
                      : 'Pending'}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-ink/40">
                    Loan Term
                  </p>

                  <p className="mt-1 text-sm text-cream">
                    {selectedApplication
                      .loanTermYears != null
                      ? `${selectedApplication.loanTermYears} years`
                      : 'Pending'}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-ink/40">
                    Monthly Payment
                  </p>

                  <p className="mt-1 text-sm text-cream">
                    {selectedApplication
                      .monthlyPayment != null
                      ? formatCurrency(
                        selectedApplication
                          .monthlyPayment,
                      )
                      : 'Pending'}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-ink/40">
                    Lender
                  </p>

                  <p className="mt-1 text-sm text-cream">
                    {selectedApplication
                      .lender ||
                      'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-gold-400" />

                <h3 className="font-heading text-base font-semibold text-cream">
                  Workflow Timeline
                </h3>
              </div>

              <div className="relative space-y-5 pl-2">
                <div className="absolute bottom-2 left-[15px] top-2 w-px bg-white/10" />

                {selectedApplication.stages.map(
                  (stage, index) => (
                    <div
                      key={`${stage.label}-${index}`}
                      className="relative flex gap-4"
                    >
                      <div
                        className={`relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-4 border-navy-900 ${stage.completed
                          ? 'bg-gold-400'
                          : 'bg-white/10'
                          }`}
                      >
                        {stage.completed && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-navy-900" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 pb-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p
                            className={`text-sm font-semibold ${stage.completed
                              ? 'text-cream'
                              : 'text-ink/40'
                              }`}
                          >
                            {stage.label}
                          </p>

                          <span className="text-xs text-ink/40">
                            {formatDate(
                              stage.date,
                            )}
                          </span>
                        </div>

                        {stage.completed &&
                          getStageActor(
                            stage.completedBy,
                          ) && (
                            <p className="mt-1 text-xs text-ink/50">
                              Completed by{' '}
                              {getStageActor(
                                stage.completedBy,
                              )}
                            </p>
                          )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {selectedApplication.rejectionReason && (
              <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-300">
                  Rejection reason
                </p>

                <p className="mt-2 text-sm leading-6 text-rose-100/80">
                  {
                    selectedApplication.rejectionReason
                  }
                </p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs uppercase tracking-wider text-ink/40">
                  Submitted
                </p>

                <p className="mt-1 text-sm text-cream">
                  {formatDate(
                    selectedApplication.createdAt,
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs uppercase tracking-wider text-ink/40">
                  Last Updated
                </p>

                <p className="mt-1 text-sm text-cream">
                  {formatDate(
                    selectedApplication.updatedAt,
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      {renderActionModal()}
    </div>
  );
}