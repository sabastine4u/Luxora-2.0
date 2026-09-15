import { useEffect, useState } from 'react';
import {
  Briefcase,
  Plus,
  TrendingUp,
  CheckCircle2,
  Download,
  AlertTriangle,
  Target,
  CheckSquare,
  FileText,
  FileCheck,
  BrainCircuit,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { DealDetailModal } from './modals/DealDetailModal';
import { useToast } from '../../../contexts/ToastContext';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { agentApi } from '../../../api/agent.api';

interface AgentOffer {
  _id: string;
  buyer:
  | {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
  }
  | null;

  property:
  | {
    _id: string;
    title: string;
    transactionType: string;
    price: number;
    agencyFee?: number | null;
    owner?: {
      _id: string;
      fullName: string;
      email: string;
    } | null;
    agent?: string | null;
    agency?:
    | string
    | {
      _id: string;
      name: string;
      status: string;
    }
    | null;
    status: string;
    availabilityStatus: string;
  }
  | null;

  agent?: string | null;

  agency?:
  | {
    _id: string;
    name: string;
    status: string;
  }
  | null;

  offerAmount: number;
  buyerNotes?: string;
  agentNotes?: string;

  status:
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Counter Offer Received'
  | 'Accepted'
  | 'Rejected'
  | 'Withdrawn'
  | 'Expired';

  counterOfferAmount?: number | null;
  counterOfferDetails?: string;
  estimatedClosing?: string;
  expiresAt?: string | null;

  createdAt: string;
  updatedAt: string;
}

interface DealRecord extends Record<string, unknown> {
  id: string;
  offerId: string;
  property: string;
  client: string;
  value: string;
  offerAmount: number;
  counterOfferAmount: number | null;
  readiness: number;
  stage: string;
  status: string;
  closingDate: string;
  commission: string;
  buyerEmail: string;
  buyerPhone: string;
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

/*
 * Convert the Offer status into a simple Deal stage
 * for the existing Deals UI.
 */
const getDealStage = (
  status: AgentOffer['status'],
) => {
  switch (status) {
    case 'Draft':
      return 'Draft';

    case 'Submitted':
      return 'Offer Submitted';

    case 'Under Review':
      return 'Under Review';

    case 'Counter Offer Received':
      return 'Negotiation';

    case 'Accepted':
      return 'Accepted / Closing';

    case 'Rejected':
      return 'Rejected';

    case 'Withdrawn':
      return 'Withdrawn';

    case 'Expired':
      return 'Expired';

    default:
      return status;
  }
};

/*
 * Derive a workflow readiness value from the actual
 * Offer lifecycle state.
 *
 * This is a UI progress indicator, not a backend
 * closing-readiness calculation.
 */
const getReadiness = (
  status: AgentOffer['status'],
) => {
  switch (status) {
    case 'Draft':
      return 10;

    case 'Submitted':
      return 35;

    case 'Under Review':
      return 50;

    case 'Counter Offer Received':
      return 70;

    case 'Accepted':
      return 100;

    case 'Rejected':
    case 'Withdrawn':
    case 'Expired':
      return 0;

    default:
      return 0;
  }
};

const mapOfferToDeal = (
  offer: AgentOffer,
): DealRecord => {
  const offerAmount =
    offer.offerAmount || 0;

  const counterOfferAmount =
    typeof offer.counterOfferAmount === 'number'
      ? offer.counterOfferAmount
      : null;

  /*
   * The current Offer model does not store an actual
   * commission amount, so do not fabricate one here.
   */
  const commission = 'Not calculated';

  return {
    id: offer._id,
    offerId: offer._id,

    property:
      offer.property?.title ||
      'Property unavailable',

    client:
      offer.buyer?.fullName ||
      'Buyer unavailable',

    value: formatCurrency(
      counterOfferAmount ?? offerAmount,
    ),

    offerAmount,

    counterOfferAmount,

    readiness: getReadiness(
      offer.status,
    ),

    stage: getDealStage(
      offer.status,
    ),

    status: offer.status,

    closingDate:
      offer.estimatedClosing ||
      'Not provided',

    commission,

    buyerEmail:
      offer.buyer?.email || '',

    buyerPhone:
      offer.buyer?.phone || '',

    propertyId:
      offer.property?._id || null,

    propertyPrice:
      offer.property?.price || 0,

    transactionType:
      offer.property?.transactionType ||
      'buy',

    agency:
      offer.agency?.name ||
      'Agency unavailable',

    buyerNotes:
      offer.buyerNotes || '',

    agentNotes:
      offer.agentNotes || '',

    counterOfferDetails:
      offer.counterOfferDetails ||
      '',

    expiresAt:
      offer.expiresAt || null,

    createdAt:
      offer.createdAt,

    updatedAt:
      offer.updatedAt,
  };
};

export default function Deals() {
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] =
    useState('');

  const [deals, setDeals] = useState<
    DealRecord[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedDeal, setSelectedDeal] =
    useState<DealRecord | null>(null);

  const [activeWorkflow, setActiveWorkflow] =
    useState<{
      title: string;
      type: string;
      data?: Record<string, unknown>;
    } | null>(null);

  /*
   * Load real Offers assigned to the logged-in Agent.
   */
  useEffect(() => {
    const loadDeals = async () => {
      try {
        setLoading(true);

        const response =
          await agentApi.getMyDeals();

        const rawResponse =
          response as any;

        const offers: AgentOffer[] =
          Array.isArray(
            rawResponse?.offers,
          )
            ? rawResponse.offers
            : Array.isArray(
              rawResponse?.data?.offers,
            )
              ? rawResponse.data.offers
              : [];

        const mappedDeals =
          offers.map(
            mapOfferToDeal,
          );

        setDeals(mappedDeals);
      } catch (error) {
        console.error(
          'Failed to load Agent deals:',
          error,
        );

        showToast({
          type: 'error',
          title: 'Unable to load deals',
          description:
            'We could not retrieve your active deal pipeline.',
        });
      } finally {
        setLoading(false);
      }
    };

    loadDeals();
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

  /*
   * Search the real backend-driven Deals collection.
   */
  const filteredDeals =
    deals.filter(
      (deal) =>
        deal.property
          .toLowerCase()
          .includes(
            searchQuery.toLowerCase(),
          ) ||
        deal.client
          .toLowerCase()
          .includes(
            searchQuery.toLowerCase(),
          ),
    );

  const handleViewDeal = (
    deal: DealRecord,
  ) => {
    setSelectedDeal(deal);
  };

  /*
   * Calculate real pipeline totals from the Offers
   * currently assigned to this Agent.
   */
  const activeDeals =
    deals.filter(
      (deal) =>
        ![
          'Rejected',
          'Withdrawn',
          'Expired',
        ].includes(deal.status),
    );

  const activeDealValue =
    activeDeals.reduce(
      (total, deal) =>
        total +
        (deal.counterOfferAmount ??
          deal.offerAmount ??
          0),
      0,
    );

  const acceptedDeals =
    deals.filter(
      (deal) =>
        deal.status === 'Accepted',
    ).length;

  const submittedDeals =
    deals.filter(
      (deal) =>
        deal.status ===
          'Submitted' ||
        deal.status ===
          'Under Review',
    ).length;

  const counterDeals =
    deals.filter(
      (deal) =>
        deal.status ===
        'Counter Offer Received',
    ).length;

  /*
   * These are actual offer COUNTS.
   *
   * SegmentedProgressBar calculates the visual
   * percentage from the total, so we should pass
   * counts here rather than pre-calculated 20/40
   * percentages.
   */
  const initialOfferCount =
    deals.filter(
      (deal) =>
        deal.status === 'Submitted' ||
        deal.status === 'Under Review',
    ).length;

  const closedOrOtherCount =
    deals.filter((deal) =>
      [
        'Rejected',
        'Withdrawn',
        'Expired',
      ].includes(deal.status),
    ).length;

  const actionCenter = [
    {
      title: 'Counter-Offer Needed',
      desc: 'Offers currently have a buyer/owner counter negotiation requiring attention.',
      icon: AlertTriangle,
      color: 'text-orange-400',
      urgency: 'High',
    },
    {
      title: 'Accepted Offers',
      desc: 'Accepted offers are ready to move into the closing workflow.',
      icon: FileCheck,
      color: 'text-emerald-400',
      urgency: 'Medium',
    },
  ];

  const aiInsights = [
    {
      title: 'Negotiation Risk',
      desc: 'Review counter-offer records before advancing negotiations.',
      icon: ShieldAlert,
      color: 'text-rose-400',
    },
    {
      title: 'Pipeline Review',
      desc: 'Monitor submitted and under-review offers for the next action.',
      icon: BrainCircuit,
      color: 'text-blue-400',
    },
  ];

  const closingChecklist = [
    {
      task: 'Title Search Cleared (VI Office)',
      completed: true,
    },
    {
      task: 'Final Walkthrough (Skyline Penthouse)',
      completed: false,
    },
    {
      task: 'Wire Transfer Confirmation',
      completed: false,
    },
  ];

  const requiredDocuments = [
    {
      doc: 'Proof of Funds',
      deal: 'Skyline Penthouse',
      status: 'Missing',
    },
    {
      doc: 'Purchase Agreement',
      deal: 'VI Office',
      status: 'Approved',
    },
  ];

  const closingTimeline = [
    {
      title: 'Active Offer Pipeline',
      desc: `${activeDeals.length} active offer(s) currently assigned to you.`,
      time: 'Current',
      icon: CheckCircle2,
      color: 'text-emerald-400',
    },
    {
      title: 'Latest Offer',
      desc:
        deals[0]
          ? `${deals[0].property} - ${deals[0].value}`
          : 'No offers available.',
      time: deals[0]
        ? new Date(
          deals[0].createdAt,
        ).toLocaleDateString()
        : 'Current',
      icon: FileText,
      color: 'text-blue-400',
    },
  ];

  /*
   * IMPORTANT:
   * Pass actual COUNTS to SegmentedProgressBar.
   *
   * With 5 real offers:
   * Initial Offer = 1
   * Counter Offer = 1
   * Accepted = 1
   * Closed / Other = 2
   *
   * The SegmentedProgressBar itself converts those
   * counts into 20% / 20% / 20% / 40% widths.
   */
  const negotiationBoard = [
    {
      label: 'Initial Offer',
      value: initialOfferCount,
      color: 'bg-blue-400',
    },
    {
      label: 'Counter Offer',
      value: counterDeals,
      color: 'bg-orange-400',
    },
    {
      label: 'Accepted',
      value: acceptedDeals,
      color: 'bg-emerald-400',
    },
    {
      label: 'Closed / Other',
      value: closedOrOtherCount,
      color: 'bg-rose-400',
    },
  ];

  const portfolioReadiness =
    activeDeals.length > 0
      ? Math.round(
        activeDeals.reduce(
          (total, deal) =>
            total + deal.readiness,
          0,
        ) / activeDeals.length,
      )
      : 0;

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        name="Deal Operations & Workflow"
        subtitle="Manage deal progress, monitor risks, and streamline closing procedures."
        actions={
          <div className="flex gap-3">
            <GhostButton
              className="flex items-center gap-2"
              onClick={() =>
                handleAction(
                  'Export Pipeline',
                  'export_pipeline',
                )
              }
            >
              <Download className="h-4 w-4" />
              Export Pipeline
            </GhostButton>

            <GoldButton
              className="flex items-center gap-2"
              onClick={() =>
                handleAction(
                  'New Deal',
                  'new_deal',
                )
              }
            >
              <Plus className="h-4 w-4" />
              New Deal
            </GoldButton>
          </div>
        }
      />

      {/* INTELLIGENCE HEADER: DEAL ACTION CENTER */}
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
              {counterDeals} counter-offer
              {counterDeals === 1
                ? ''
                : 's'}
            </strong>{' '}
            currently in negotiation.
            {acceptedDeals > 0 && (
              <>
                {' '}
                You also have{' '}
                <strong className="text-emerald-400">
                  {acceptedDeals} accepted
                  offer
                  {acceptedDeals === 1
                    ? ''
                    : 's'}
                </strong>{' '}
                ready for the closing workflow.
              </>
            )}
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div>
              <div className="text-xs text-ink/60 mb-1">
                Actions Required
              </div>

              <div className="text-lg font-bold text-orange-400">
                {counterDeals +
                  submittedDeals}
              </div>
            </div>

            <div>
              <div className="text-xs text-ink/60 mb-1">
                Offers
              </div>

              <div className="text-lg font-bold text-blue-400">
                {deals.length}
              </div>
            </div>

            <div>
              <div className="text-xs text-ink/60 mb-1">
                Accepted
              </div>

              <div className="text-lg font-bold text-emerald-400">
                {acceptedDeals}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink/60 mb-4 flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-blue-400" />
              AI Deal Insights
            </h3>

            <div className="space-y-4">
              {aiInsights.map(
                (insight, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3"
                  >
                    <insight.icon
                      className={`h-4 w-4 shrink-0 ${insight.color}`}
                    />

                    <div>
                      <div className="text-xs font-bold text-cream mb-0.5">
                        {insight.title}
                      </div>

                      <div className="text-[10px] text-ink/60 leading-tight">
                        {insight.desc}
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
          <h3 className="text-sm font-semibold text-ink/60 mb-4 text-center">
            Closing Readiness Score
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

      {/* Sales Pipeline KPIs */}
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
          title="Total Offers"
          value={String(deals.length)}
          trend={`${acceptedDeals} Accepted`}
          trendColor="text-emerald-400"
          icon={TrendingUp}
        />

        <KPICard
          title="Counter Offers"
          value={String(counterDeals)}
          trend="Negotiation queue"
          trendColor="text-rose-400"
          icon={FileText}
        />

        <KPICard
          title="Accepted Deals"
          value={String(acceptedDeals)}
          trend={
            deals.length > 0
              ? `${Math.round(
                (acceptedDeals /
                  deals.length) *
                100,
              )}% of offers`
              : '0% of offers'
          }
          trendColor="text-gold-400"
          icon={Target}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Deals Table */}
        <div className="lg:col-span-3 space-y-6">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search deals..."
          />

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-8 text-center">
              <div className="text-sm text-ink/60">
                Loading deals...
              </div>
            </div>
          ) : filteredDeals.length > 0 ? (
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
                          {deal.property}
                        </div>

                        <div className="text-xs text-ink/60">
                          {deal.client}
                        </div>
                      </div>
                    </div>
                  ),
                },

                {
                  header: 'Value',
                  render: (
                    deal: DealRecord,
                  ) => (
                    <div className="font-bold text-cream">
                      {deal.value}
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
                          {deal.readiness}%
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
                  header: 'Stage',
                  render: (
                    deal: DealRecord,
                  ) => (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/5 text-ink/80 border border-white/10">
                      {deal.stage}
                    </span>
                  ),
                },

                {
                  header: 'Status',
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
                  header: 'Actions',
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
              data={filteredDeals}
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
                Offers assigned to you will appear here as deals.
              </div>
            </div>
          )}

          <SegmentedProgressBar
            title="Negotiation Progress Board"
            segments={negotiationBoard}
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
                (action, idx) => (
                  <div
                    key={idx}
                    className={`bg-navy-900/50 p-3 rounded-xl border ${
                      action.urgency ===
                      'High'
                        ? 'border-orange-500/30'
                        : 'border-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-sm font-bold text-cream flex items-center gap-1.5">
                        <action.icon
                          className={`h-3 w-3 ${action.color}`}
                        />

                        {action.title}
                      </div>
                    </div>

                    <div className="text-[10px] text-ink/80">
                      {action.desc}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Closing Checklist
            </h3>

            <div className="space-y-3">
              {closingChecklist.map(
                (item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={
                        item.completed
                      }
                      readOnly
                      className="mt-0.5 accent-gold-400 bg-white/5 border-white/10"
                    />

                    <span
                      className={`text-xs ${
                        item.completed
                          ? 'text-ink/40 line-through'
                          : 'text-cream'
                      }`}
                    >
                      {item.task}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-400" />
              Document Tracker
            </h3>

            <div className="space-y-3">
              {requiredDocuments.map(
                (doc, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-navy-900/50 p-3 rounded-xl border border-white/5"
                  >
                    <div>
                      <div className="text-xs font-bold text-cream mb-0.5">
                        {doc.doc}
                      </div>

                      <div className="text-[10px] text-ink/60">
                        {doc.deal}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded ${
                        doc.status ===
                        'Approved'
                          ? 'bg-emerald-400/10 text-emerald-400'
                          : 'bg-rose-400/10 text-rose-400'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          <ActivityTimeline
            title="Closing Timeline"
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
          setSelectedDeal(null)
        }
        deal={selectedDeal}
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
                  ([key, value]) => {
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
                            {key}
                          </span>

                          <span className="font-medium text-cream">
                            {value}
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