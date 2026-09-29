import { useEffect, useState } from 'react';
import {
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Download,
  AlertTriangle,
  CheckSquare,
  FileText,
  BrainCircuit,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton } from '../../../components/ui/ui';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { DealDetailModal } from './modals/DealDetailModal';
import { useToast } from '../../../contexts/ToastContext';
import { dealApi } from '../../../api/deal.api';

interface BackendDeal {
  _id: string;

  dealId: string;

  offer: {
    _id: string;
    offerAmount: number;
    buyerNotes?: string;
    agentNotes?: string;
    status: string;
    counterOfferAmount?: number | null;
    counterOfferDetails?: string;
    estimatedClosing?: string;
    expiresAt?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;

  property: {
    _id: string;
    title: string;
    address?: string;
    area?: string;
    city?: string;
    state?: string;
    propertyType?: string;
    transactionType: string;
    price: number;
    currency?: string;
    coverImage?: string;
    status: string;
    availabilityStatus: string;
    owner?: string | null;
    agent?: string | null;
    agency?: string | null;
  } | null;

  buyer: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
    avatar?: string;
  } | null;

  owner: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
    avatar?: string;
  } | null;

  agency: {
    _id: string;
    name: string;
    status: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
  } | null;

  agent: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
    status: string;
    user?: {
      _id: string;
      fullName: string;
      email: string;
      role: string;
    };
  } | null;

  transactionType: string;

  agreedAmount: number;

  status:
    | 'Agreement Pending'
    | 'Agreement Completed'
    | 'Payment Pending'
    | 'Completed'
    | 'Cancelled';

  agreementStatus:
    | 'Pending'
    | 'Completed';

  paymentStatus:
    | 'Pending'
    | 'Verified';

  agreementCompletedAt: string | null;
  agreementCompletedBy?: string | null;

  paymentVerifiedAt: string | null;
  paymentVerifiedBy?: string | null;

  completedAt: string | null;
  completedBy?: string | null;

  cancelledAt: string | null;
  cancelledBy?: string | null;

  cancellationReason?: string;

  createdAt: string;
  updatedAt: string;
}

interface DealRecord
  extends Record<string, unknown> {
  id: string;
  dealId: string;

  offerId: string;

  property: string;
  client: string;

  value: string;

  agreedAmount: number;
  offerAmount: number;
  counterOfferAmount: number | null;

  readiness: number;

  stage: string;
  status: string;

  agreementStatus:
    | 'Pending'
    | 'Completed';

  paymentStatus:
    | 'Pending'
    | 'Verified';

  closingDate: string;

  commission: string;

  buyerEmail: string;
  buyerPhone: string;

  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;

  propertyId: string | null;
  propertyPrice: number;

  transactionType: string;

  agency: string;

  buyerNotes: string;
  agentNotes: string;
  counterOfferDetails: string;

  expiresAt: string | null;

  createdAt: string;
  updatedAt: string;
}

const formatCurrency = (
  amount:
    | number
    | null
    | undefined,
) => {
  if (
    typeof amount !==
      'number' ||
    Number.isNaN(amount)
  ) {
    return '₦0';
  }

  return new Intl.NumberFormat(
    'en-NG',
    {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    },
  ).format(amount);
};

const getDealProgress = (
  status: BackendDeal['status'],
) => {
  switch (status) {
    case 'Agreement Pending':
      return 25;

    case 'Agreement Completed':
      return 50;

    case 'Payment Pending':
      return 75;

    case 'Completed':
      return 100;

    case 'Cancelled':
      return 0;

    default:
      return 0;
  }
};

const mapBackendDealToDealRecord = (
  deal: BackendDeal,
): DealRecord => {
  const offer =
    deal.offer;

  const property =
    deal.property;

  const buyer =
    deal.buyer;

  const owner =
    deal.owner;

  const agreedAmount =
    typeof deal.agreedAmount ===
    'number'
      ? deal.agreedAmount
      : 0;

  const offerAmount =
    typeof offer?.offerAmount ===
    'number'
      ? offer.offerAmount
      : agreedAmount;

  const counterOfferAmount =
    typeof offer?.counterOfferAmount ===
    'number'
      ? offer.counterOfferAmount
      : null;

  return {
    id: deal._id,

    dealId:
      deal.dealId,

    offerId:
      offer?._id ||
      '',

    property:
      property?.title ||
      'Property unavailable',

    client:
      buyer?.fullName ||
      'Buyer unavailable',

    value:
      formatCurrency(
        agreedAmount,
      ),

    agreedAmount,

    offerAmount,

    counterOfferAmount,

    readiness:
      getDealProgress(
        deal.status,
      ),

    stage:
      deal.status,

    status:
      deal.status,

    agreementStatus:
      deal.agreementStatus,

    paymentStatus:
      deal.paymentStatus,

    closingDate:
      offer?.estimatedClosing ||
      'Not provided',

    commission:
      'Not calculated',

    buyerEmail:
      buyer?.email ||
      '',

    buyerPhone:
      buyer?.phone ||
      '',

    ownerName:
      owner?.fullName ||
      'Owner unavailable',

    ownerEmail:
      owner?.email ||
      '',

    ownerPhone:
      owner?.phone ||
      '',

    propertyId:
      property?._id ||
      null,

    propertyPrice:
      property?.price ||
      0,

    transactionType:
      deal.transactionType ||
      property?.transactionType ||
      'buy',

    agency:
      deal.agency?.name ||
      'Agency unavailable',

    buyerNotes:
      offer?.buyerNotes ||
      '',

    agentNotes:
      offer?.agentNotes ||
      '',

    counterOfferDetails:
      offer?.counterOfferDetails ||
      '',

    expiresAt:
      offer?.expiresAt ||
      null,

    createdAt:
      deal.createdAt,

    updatedAt:
      deal.updatedAt,
  };
};

const escapeCsvValue = (
  value: unknown,
) => {
  const stringValue =
    String(value ?? '');

  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n')
  ) {
    return `"${stringValue.replace(
      /"/g,
      '""',
    )}"`;
  }

  return stringValue;
};

export default function Deals() {
  const {
    showToast,
  } = useToast();

  const [
    searchQuery,
    setSearchQuery,
  ] = useState('');

  const [
    deals,
    setDeals,
  ] = useState<DealRecord[]>(
    [],
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    selectedDeal,
    setSelectedDeal,
  ] =
    useState<DealRecord | null>(
      null,
    );

  useEffect(() => {
    const loadDeals =
      async () => {
        try {
          setLoading(true);

          const response =
            await dealApi.getMyDeals();

          const rawResponse =
            response as any;

          /*
           * Support both:
           *
           * response.data.deals
           *
           * and
           *
           * response.deals
           *
           * depending on the HTTP wrapper response shape.
           */
          const payload =
            rawResponse?.data ??
            rawResponse;

          const backendDeals: BackendDeal[] =
            Array.isArray(
              payload?.data?.deals,
            )
              ? payload.data.deals
              : Array.isArray(
                payload?.deals,
              )
                ? payload.deals
                : [];

          const mappedDeals =
            backendDeals.map(
              mapBackendDealToDealRecord,
            );

          setDeals(
            mappedDeals,
          );
        } catch (error) {
          console.error(
            'Failed to load Agent deals:',
            error,
          );

          showToast({
            type: 'error',
            title:
              'Unable to load deals',
            description:
              'We could not retrieve your Deal pipeline.',
          });
        } finally {
          setLoading(false);
        }
      };

    loadDeals();
  }, [showToast]);

  const filteredDeals =
    deals.filter(
      (deal) => {
        const query =
          searchQuery
            .trim()
            .toLowerCase();

        if (!query) {
          return true;
        }

        return (
          deal.property
            .toLowerCase()
            .includes(query) ||
          deal.client
            .toLowerCase()
            .includes(query) ||
          deal.dealId
            .toLowerCase()
            .includes(query) ||
          deal.agency
            .toLowerCase()
            .includes(query)
        );
      },
    );

  const handleViewDeal = (
    deal: DealRecord,
  ) => {
    setSelectedDeal(
      deal,
    );
  };

  /*
   * Real Deal lifecycle metrics.
   *
   * Unlike the old page, these are based on the
   * actual Deal lifecycle returned by the backend.
   */
  const activeDeals =
    deals.filter(
      (deal) =>
        ![
          'Completed',
          'Cancelled',
        ].includes(
          deal.status,
        ),
    );

  const agreementPendingDeals =
    deals.filter(
      (deal) =>
        deal.status ===
        'Agreement Pending',
    );

  const agreementCompletedDeals =
    deals.filter(
      (deal) =>
        deal.status ===
        'Agreement Completed',
    );

  const paymentPendingDeals =
    deals.filter(
      (deal) =>
        deal.status ===
        'Payment Pending',
    );

  const completedDeals =
    deals.filter(
      (deal) =>
        deal.status ===
        'Completed',
    );

  const cancelledDeals =
    deals.filter(
      (deal) =>
        deal.status ===
        'Cancelled',
    );

  const activeDealValue =
    activeDeals.reduce(
      (
        total,
        deal,
      ) =>
        total +
        deal.agreedAmount,
      0,
    );

  const totalDealValue =
    deals.reduce(
      (
        total,
        deal,
      ) =>
        total +
        deal.agreedAmount,
      0,
    );

  const counterDeals =
    deals.filter(
      (deal) =>
        deal.counterOfferAmount !==
        null,
    );

  const verifiedPayments =
    deals.filter(
      (deal) =>
        deal.paymentStatus ===
        'Verified',
    ).length;

  const agreementsCompleted =
    deals.filter(
      (deal) =>
        deal.agreementStatus ===
        'Completed',
    ).length;

  const portfolioReadiness =
    activeDeals.length >
    0
      ? Math.round(
        activeDeals.reduce(
          (
            total,
            deal,
          ) =>
            total +
            deal.readiness,
          0,
        ) /
        activeDeals.length,
      )
      : 0;

  const actionCenter = [
    {
      title:
        'Agreement Pending',
      desc:
        agreementPendingDeals.length ===
        1
          ? '1 Deal is waiting for the agreement stage to be completed.'
          : `${agreementPendingDeals.length} Deals are waiting for the agreement stage to be completed.`,
      icon:
        AlertTriangle,
      color:
        'text-orange-400',
      urgency:
        agreementPendingDeals.length >
        0
          ? 'High'
          : 'Low',
    },

    {
      title:
        'Payment Pending',
      desc:
        paymentPendingDeals.length ===
        1
          ? '1 Deal is waiting for payment verification.'
          : `${paymentPendingDeals.length} Deals are waiting for payment verification.`,
      icon:
        CheckSquare,
      color:
        'text-blue-400',
      urgency:
        paymentPendingDeals.length >
        0
          ? 'Medium'
          : 'Low',
    },
  ];

  const dealInsights = [
    {
      title:
        'Agreement Progress',
      desc:
        `${agreementsCompleted} of ${deals.length} Deal${deals.length === 1 ? '' : 's'} have a completed agreement.`,
      icon:
        FileText,
      color:
        'text-gold-400',
    },

    {
      title:
        'Payment Verification',
      desc:
        `${verifiedPayments} of ${deals.length} Deal${deals.length === 1 ? '' : 's'} have verified payment.`,
      icon:
        CheckCircle2,
      color:
        'text-emerald-400',
    },

    {
      title:
        'Transaction Value',
      desc:
        `${formatCurrency(totalDealValue)} across all Deals returned for your account.`,
      icon:
        BrainCircuit,
      color:
        'text-blue-400',
    },
  ];

  const closingChecklist = [
    {
      task:
        'Agreement Progress',
      completed:
        deals.length > 0 &&
        agreementPendingDeals.length ===
          0,
      detail:
        `${agreementsCompleted} / ${deals.length} completed`,
    },

    {
      task:
        'Payment Progress',
      completed:
        deals.length > 0 &&
        paymentPendingDeals.length ===
          0,
      detail:
        `${verifiedPayments} / ${deals.length} verified`,
    },

    {
      task:
        'Deal Completion',
      completed:
        deals.length > 0 &&
        completedDeals.length ===
          deals.length,
      detail:
        `${completedDeals.length} / ${deals.length} completed`,
    },
  ];

  const latestDeal =
    deals.length > 0
      ? [...deals].sort(
        (
          a,
          b,
        ) =>
          new Date(
            b.createdAt,
          ).getTime() -
          new Date(
            a.createdAt,
          ).getTime(),
      )[0]
      : null;

  const latestCompletedDeal =
    deals
      .filter(
        (deal) =>
          deal.status ===
          'Completed',
      )
      .sort(
        (
          a,
          b,
        ) =>
          new Date(
            b.updatedAt,
          ).getTime() -
          new Date(
            a.updatedAt,
          ).getTime(),
      )[0] ||
    null;

  const closingTimeline = [
    {
      title:
        'Active Deal Pipeline',
      desc:
        `${activeDeals.length} active Deal${activeDeals.length === 1 ? '' : 's'} currently assigned to you.`,
      time:
        'Current',
      icon:
        Briefcase,
      color:
        'text-emerald-400',
    },

    {
      title:
        'Latest Deal',
      desc:
        latestDeal
          ? `${latestDeal.property} — ${latestDeal.value}`
          : 'No Deals available.',
      time:
        latestDeal
          ? new Date(
            latestDeal.createdAt,
          ).toLocaleDateString()
          : 'Current',
      icon:
        FileText,
      color:
        'text-blue-400',
    },

    {
      title:
        'Latest Completed Deal',
      desc:
        latestCompletedDeal
          ? `${latestCompletedDeal.property} — ${latestCompletedDeal.value}`
          : 'No completed Deal yet.',
      time:
        latestCompletedDeal
          ? new Date(
            latestCompletedDeal.updatedAt,
          ).toLocaleDateString()
          : 'Pending',
      icon:
        CheckCircle2,
      color:
        'text-gold-400',
    },
  ];

  /*
   * This board now represents the actual Deal lifecycle,
   * not the old Offer lifecycle.
   */
  const negotiationBoard = [
    {
      label:
        'Agreement Pending',
      value:
        agreementPendingDeals.length,
      color:
        'bg-orange-400',
    },

    {
      label:
        'Agreement Completed',
      value:
        agreementCompletedDeals.length,
      color:
        'bg-blue-400',
    },

    {
      label:
        'Payment Pending',
      value:
        paymentPendingDeals.length,
      color:
        'bg-gold-400',
    },

    {
      label:
        'Completed',
      value:
        completedDeals.length,
      color:
        'bg-emerald-400',
    },
  ];

  const handleExportPipeline =
    () => {
      if (
        deals.length ===
        0
      ) {
        showToast({
          type: 'info',
          title:
            'Nothing to export',
          description:
            'There are no Deals available to export.',
        });

        return;
      }

      const headers = [
        'Deal ID',
        'Property',
        'Buyer',
        'Agency',
        'Agreed Amount',
        'Transaction Type',
        'Status',
        'Agreement Status',
        'Payment Status',
        'Created',
        'Updated',
      ];

      const rows =
        deals.map(
          (deal) =>
            [
              deal.dealId,
              deal.property,
              deal.client,
              deal.agency,
              formatCurrency(
                deal.agreedAmount,
              ),
              deal.transactionType,
              deal.status,
              deal.agreementStatus,
              deal.paymentStatus,
              deal.createdAt,
              deal.updatedAt,
            ],
        );

      const csv = [
        headers,
        ...rows,
      ]
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

      link.setAttribute(
        'download',
        `luxora-deals-${new Date()
          .toISOString()
          .slice(
            0,
            10,
          )}.csv`,
      );

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

      showToast({
        type: 'success',
        title:
          'Pipeline exported',
        description:
          `${deals.length} Deal${deals.length === 1 ? '' : 's'} exported successfully.`,
      });
    };

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        name="Deal Operations & Workflow"
        subtitle="Manage deal progress, monitor agreement and payment status, and track transaction completion."
        actions={
          <div className="flex gap-3">
            <GhostButton
              className="flex items-center gap-2"
              onClick={
                handleExportPipeline
              }
            >
              <Download className="h-4 w-4" />
              Export Pipeline
            </GhostButton>
          </div>
        }
      />

      {/* Deal Action Center */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-center h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-400/20 rounded-xl">
              <CheckSquare className="h-6 w-6 text-orange-400" />
            </div>

            <h4 className="font-bold text-cream text-lg">
              Deal Action Center
            </h4>
          </div>

          <p className="text-sm text-ink/80 leading-relaxed mb-4">
            You have{' '}
            <strong className="text-orange-400">
              {agreementPendingDeals.length}{' '}
              agreement-pending
              {agreementPendingDeals.length ===
              1
                ? ''
                : ' Deals'}
            </strong>
            {agreementPendingDeals.length ===
              1 && (
              <span>
                {' '}
                Deal
              </span>
            )}
            .{' '}

            {paymentPendingDeals.length >
              0 && (
              <>
                There{' '}
                {paymentPendingDeals.length ===
                1
                  ? 'is'
                  : 'are'}{' '}
                <strong className="text-blue-400">
                  {
                    paymentPendingDeals.length
                  }{' '}
                  payment-pending
                  {paymentPendingDeals.length ===
                  1
                    ? ''
                    : ' Deals'}
                </strong>{' '}
                requiring verification.
              </>
            )}

            {completedDeals.length >
              0 && (
              <>
                {' '}
                <strong className="text-emerald-400">
                  {
                    completedDeals.length
                  }{' '}
                  completed
                  {completedDeals.length ===
                  1
                    ? ' Deal'
                    : ' Deals'}
                </strong>{' '}
                are already closed.
              </>
            )}
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div>
              <div className="text-xs text-ink/60 mb-1">
                Action Required
              </div>

              <div className="text-lg font-bold text-orange-400">
                {agreementPendingDeals.length +
                  paymentPendingDeals.length}
              </div>
            </div>

            <div>
              <div className="text-xs text-ink/60 mb-1">
                Active Deals
              </div>

              <div className="text-lg font-bold text-blue-400">
                {activeDeals.length}
              </div>
            </div>

            <div>
              <div className="text-xs text-ink/60 mb-1">
                Completed
              </div>

              <div className="text-lg font-bold text-emerald-400">
                {completedDeals.length}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
          <h3 className="text-sm font-semibold text-ink/60 mb-4 flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-blue-400" />
            Deal Insights
          </h3>

          <div className="space-y-4">
            {dealInsights.map(
              (
                insight,
                idx,
              ) => (
                <div
                  key={idx}
                  className="flex gap-3"
                >
                  <insight.icon
                    className={`h-4 w-4 shrink-0 ${insight.color}`}
                  />

                  <div>
                    <div className="text-xs font-bold text-cream mb-0.5">
                      {
                        insight.title
                      }
                    </div>

                    <div className="text-[10px] text-ink/60 leading-tight">
                      {
                        insight.desc
                      }
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
          <h3 className="text-sm font-semibold text-ink/60 mb-4 text-center">
            Deal Progress
          </h3>

          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="relative h-24 w-24 mb-2">
              <svg
                className="h-full w-full -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  className="text-navy-950"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />

                <path
                  className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                  strokeDasharray={`${portfolioReadiness}, 100`}
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-cream">
                  {portfolioReadiness}%
                </span>
              </div>
            </div>

            <p className="text-xs text-ink/60 text-center">
              Portfolio Avg Progress
            </p>
          </div>
        </div>
      </div>

      {/* Deal Pipeline KPIs */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Deals"
          value={String(
            activeDeals.length,
          )}
          trend={`${formatCurrency(
            activeDealValue,
          )} Pipeline`}
          trendColor="text-blue-400"
          icon={Briefcase}
        />

        <KPICard
          title="Total Deals"
          value={String(
            deals.length,
          )}
          trend={`${formatCurrency(
            totalDealValue,
          )} Total Value`}
          trendColor="text-emerald-400"
          icon={TrendingUp}
        />

        <KPICard
          title="Agreement Pending"
          value={String(
            agreementPendingDeals.length,
          )}
          trend="Agreement workflow"
          trendColor="text-orange-400"
          icon={FileText}
        />

        <KPICard
          title="Payment Pending"
          value={String(
            paymentPendingDeals.length,
          )}
          trend={`${verifiedPayments} Verified`}
          trendColor="text-gold-400"
          icon={CheckCircle2}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Deals Table */}
        <div className="lg:col-span-3 space-y-6">
          <DataTableToolbar
            searchValue={
              searchQuery
            }
            onSearchChange={
              setSearchQuery
            }
            searchPlaceholder="Search deals..."
          />

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-8 text-center">
              <div className="text-sm text-ink/60">
                Loading deals...
              </div>
            </div>
          ) : filteredDeals.length >
            0 ? (
            <DataTable
              keyExtractor={(
                item: DealRecord,
                index: number,
              ) =>
                item.id ||
                String(index)
              }
              columns={[
                {
                  header:
                    'Property / Client',

                  render: (
                    deal: DealRecord,
                  ) => (
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-cream">
                        <Briefcase className="h-5 w-5 text-gold-400" />
                      </div>

                      <div>
                        <div className="font-semibold text-cream">
                          {
                            deal.property
                          }
                        </div>

                        <div className="text-xs text-ink/60">
                          {
                            deal.client
                          }
                        </div>

                        <div className="text-[10px] text-ink/40 mt-0.5">
                          {
                            deal.dealId
                          }
                        </div>
                      </div>
                    </div>
                  ),
                },

                {
                  header:
                    'Value',

                  render: (
                    deal: DealRecord,
                  ) => (
                    <div>
                      <div className="font-bold text-cream">
                        {
                          deal.value
                        }
                      </div>

                      <div className="text-[10px] text-ink/40 capitalize">
                        {
                          deal.transactionType
                        }
                      </div>
                    </div>
                  ),
                },

                {
                  header:
                    'Readiness Score',

                  render: (
                    deal: DealRecord,
                  ) => (
                    <div className="w-24">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-ink/60">
                          Ready
                        </span>

                        <span className="text-cream">
                          {
                            deal.readiness
                          }%
                        </span>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full ${
                            deal.readiness >=
                            90
                              ? 'bg-emerald-400'
                              : deal.readiness >=
                                50
                                ? 'bg-gold-400'
                                : deal.readiness > 0
                                  ? 'bg-orange-400'
                                  : 'bg-rose-400'
                          }`}
                          style={{
                            width: `${deal.readiness}%`,
                          }}
                        />
                      </div>
                    </div>
                  ),
                },

                {
                  header:
                    'Stage',

                  render: (
                    deal: DealRecord,
                  ) => (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/5 text-ink/80 border border-white/10">
                      {
                        deal.stage
                      }
                    </span>
                  ),
                },

                {
                  header:
                    'Status',

                  render: (
                    deal: DealRecord,
                  ) => (
                    <EnterpriseStatusBadge
                      status={
                        deal.status
                      }
                    />
                  ),
                },

                {
                  header:
                    'Actions',

                  render: (
                    deal: DealRecord,
                  ) => (
                    <GhostButton
                      onClick={() =>
                        handleViewDeal(
                          deal,
                        )
                      }
                      className="h-8 px-3 text-xs"
                    >
                      Workflow Details
                    </GhostButton>
                  ),
                },
              ]}
              data={
                filteredDeals
              }
              onRowClick={(
                deal: DealRecord,
              ) =>
                handleViewDeal(
                  deal,
                )
              }
            />
          ) : (
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-8 text-center">
              <div className="flex justify-center mb-3">
                <Briefcase className="h-8 w-8 text-gold-400" />
              </div>

              <div className="text-sm font-semibold text-cream">
                No deals found
              </div>

              <div className="text-xs text-ink/60 mt-1">
                Accepted offers become
                Deals here once the
                backend creates the
                transaction record.
              </div>
            </div>
          )}

          <SegmentedProgressBar
            title="Deal Lifecycle Progress"
            segments={
              negotiationBoard
            }
          />
        </div>

        {/* Analytics & Workflow Panel */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold-400" />
              Deal Priority Queue
            </h3>

            <div className="space-y-3">
              {actionCenter.map(
                (
                  action,
                  idx,
                ) => (
                  <div
                    key={idx}
                    className={`bg-navy-900/50 p-3 rounded-xl border ${
                      action.urgency ===
                      'High'
                        ? 'border-orange-500/30'
                        : action.urgency ===
                          'Medium'
                          ? 'border-blue-500/20'
                          : 'border-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-sm font-bold text-cream flex items-center gap-1.5">
                        <action.icon
                          className={`h-3 w-3 ${action.color}`}
                        />

                        {
                          action.title
                        }
                      </div>
                    </div>

                    <div className="text-[10px] text-ink/80">
                      {
                        action.desc
                      }
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Deal Lifecycle Checklist
            </h3>

            <div className="space-y-3">
              {closingChecklist.map(
                (
                  item,
                  idx,
                ) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2"
                  >
                    <div
                      className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center ${
                        item.completed
                          ? 'border-emerald-400/50 bg-emerald-400/10'
                          : 'border-white/10 bg-white/5'
                      }`}
                    >
                      {item.completed && (
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div
                        className={`text-xs ${
                          item.completed
                            ? 'text-ink/40 line-through'
                            : 'text-cream'
                        }`}
                      >
                        {
                          item.task
                        }
                      </div>

                      <div className="text-[10px] text-ink/50 mt-0.5">
                        {
                          item.detail
                        }
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <ActivityTimeline
            title="Deal Timeline"
            items={
              closingTimeline
            }
          />
        </div>
      </div>

      <DealDetailModal
        isOpen={
          !!selectedDeal
        }
        onClose={() =>
          setSelectedDeal(
            null,
          )
        }
        deal={
          selectedDeal
        }
      />
    </div>
  );
}