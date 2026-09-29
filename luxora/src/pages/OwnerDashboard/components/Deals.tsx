import { useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  Clock3,
  FileText,
  RefreshCw,
} from 'lucide-react';

import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { GhostButton } from '../../../components/ui/ui';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { useToast } from '../../../contexts/ToastContext';
import { dealApi } from '../../../api/deal.api';

interface BackendDeal {
  _id: string;
  dealId: string;

  property?: {
    _id: string;
    title: string;
    address?: string;
    city?: string;
    state?: string;
    propertyType?: string;
    transactionType?: string;
    price?: number;
    coverImage?: string;
    status?: string;
    availabilityStatus?: string;
  } | null;

  buyer?: {
    _id: string;
    fullName: string;
    email?: string;
    phone?: string;
  } | null;

  owner?: {
    _id: string;
    fullName: string;
    email?: string;
    phone?: string;
  } | null;

  agency?: {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
  } | null;

  agent?: {
    _id: string;
    fullName: string;
    email?: string;
    phone?: string;
  } | null;

  transactionType: string;
  agreedAmount: number;

  status:
    | 'Agreement Pending'
    | 'Agreement Completed'
    | 'Payment Pending'
    | 'Payment Verified'
    | 'Completed'
    | 'Cancelled';

  agreementStatus: 'Pending' | 'Completed';
  paymentStatus: 'Pending' | 'Verified';

  agreementCompletedAt?: string | null;
  paymentVerifiedAt?: string | null;
  completedAt?: string | null;

  createdAt: string;
  updatedAt: string;
}

interface OwnerDealRow
  extends Record<string, unknown> {
  id: string;
  dealId: string;
  property: string;
  transactionType: string;
  agreedAmount: number;
  value: string;
  status: string;
  agreementStatus: 'Pending' | 'Completed';
  paymentStatus: 'Pending' | 'Verified';
  buyer: string;
  agency: string;
  agent: string;
  createdAt: string;
  rawDeal: BackendDeal;
}

const formatCurrency = (amount: number) => {
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

const formatDate = (value: string) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const mapDeal = (
  deal: BackendDeal,
): OwnerDealRow => ({
  id: deal._id,
  dealId: deal.dealId,

  property:
    deal.property?.title ||
    'Property unavailable',

  transactionType:
    deal.transactionType ||
    'buy',

  agreedAmount:
    deal.agreedAmount || 0,

  value: formatCurrency(
    deal.agreedAmount || 0,
  ),

  status: deal.status,

  agreementStatus:
    deal.agreementStatus,

  paymentStatus:
    deal.paymentStatus,

  buyer:
    deal.buyer?.fullName ||
    '—',

  agency:
    deal.agency?.name ||
    '—',

  agent:
    deal.agent?.fullName ||
    '—',

  createdAt:
    deal.createdAt,

  rawDeal: deal,
});

export default function Deals() {
  const { showToast } = useToast();

  const [deals, setDeals] = useState<
    OwnerDealRow[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [
    actionLoadingId,
    setActionLoadingId,
  ] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] =
    useState('');

  const loadDeals = async () => {
    try {
      setLoading(true);

      const response =
        await dealApi.getMyDeals();

      const rawResponse =
        response as any;

      const payload =
        rawResponse?.data ??
        rawResponse;

      const backendDeals:
        BackendDeal[] =
        Array.isArray(
          payload?.data?.deals,
        )
          ? payload.data.deals
          : Array.isArray(
              payload?.deals,
            )
            ? payload.deals
            : [];

      setDeals(
        backendDeals.map(mapDeal),
      );
    } catch (error) {
      console.error(
        'Failed to load Owner deals:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Unable to load deals',
        description:
          'We could not retrieve your current Deals.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDeals();
  }, []);

  const filteredDeals =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      if (!query) {
        return deals;
      }

      return deals.filter((deal) =>
        [
          deal.dealId,
          deal.property,
          deal.transactionType,
          deal.status,
          deal.buyer,
          deal.agency,
          deal.agent,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(query),
          ),
      );
    }, [
      deals,
      searchQuery,
    ]);

  const agreementPending =
    deals.filter(
      (deal) =>
        deal.status ===
        'Agreement Pending',
    ).length;

  const agreementCompleted =
    deals.filter(
      (deal) =>
        deal.agreementStatus ===
        'Completed',
    ).length;

  const completedDeals =
    deals.filter(
      (deal) =>
        deal.status ===
        'Completed',
    ).length;

  const totalDealValue =
    deals.reduce(
      (sum, deal) =>
        sum + deal.agreedAmount,
      0,
    );

  const handleCompleteAgreement =
    async (
      deal: OwnerDealRow,
    ) => {
      try {
        setActionLoadingId(
          deal.id,
        );

        await dealApi.completeAgreement(
          deal.id,
        );

        showToast({
          type: 'success',
          title:
            'Agreement completed',
          description:
            `Agreement for ${deal.property} has been marked as completed.`,
        });

        await loadDeals();
      } catch (error: any) {
        console.error(
          'Failed to complete agreement:',
          error,
        );

        showToast({
          type: 'error',
          title:
            'Unable to complete agreement',
          description:
            error?.response?.data
              ?.message ||
            'The agreement could not be completed.',
        });
      } finally {
        setActionLoadingId(
          null,
        );
      }
    };

  return (
    <div className="space-y-8">
      <DashboardHeader
        name="My Deals"
        subtitle="Track the progress of accepted Offers across your properties."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KPICard
          title="Total Deal Value"
          value={formatCurrency(
            totalDealValue,
          )}
          trend={`${deals.length} Deal${
            deals.length === 1
              ? ''
              : 's'
          }`}
          trendColor="text-gold-400"
          icon={Briefcase}
        />

        <KPICard
          title="Agreement Pending"
          value={String(
            agreementPending,
          )}
          trend="Action required"
          trendColor="text-orange-400"
          icon={FileText}
        />

        <KPICard
          title="Agreement Completed"
          value={String(
            agreementCompleted,
          )}
          trend="Agreement stage"
          trendColor="text-gold-400"
          icon={CheckCircle2}
        />

        <KPICard
          title="Completed Deals"
          value={String(
            completedDeals,
          )}
          trend="Finalized"
          trendColor="text-emerald-400"
          icon={CheckCircle2}
        />
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={
              setSearchQuery
            }
            searchPlaceholder="Search deals..."
          />

          <GhostButton
            onClick={() => {
              void loadDeals();
            }}
            disabled={loading}
            className="h-10 px-4"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                loading
                  ? 'animate-spin'
                  : ''
              }`}
            />
            Refresh
          </GhostButton>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-10 text-center">
            <Clock3 className="mx-auto mb-3 h-8 w-8 text-gold-400" />

            <div className="text-sm text-ink/60">
              Loading your Deals...
            </div>
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-10 text-center">
            <Briefcase className="mx-auto mb-3 h-9 w-9 text-gold-400" />

            <div className="text-sm font-semibold text-cream">
              No Deals found
            </div>

            <div className="mt-1 text-sm text-ink/60">
              Accepted Offers will appear here as persistent Deals.
            </div>
          </div>
        ) : (
          <DataTable
            keyExtractor={(
              item: OwnerDealRow,
            ) => item.id}
            columns={[
              {
                header:
                  'Property',
                render: (
                  deal: OwnerDealRow,
                ) => (
                  <div>
                    <div className="font-semibold text-cream">
                      {
                        deal.property
                      }
                    </div>

                    <div className="mt-0.5 text-xs text-ink/50">
                      {
                        deal.dealId
                      }
                    </div>
                  </div>
                ),
              },

              {
                header:
                  'Agreed Amount',
                render: (
                  deal: OwnerDealRow,
                ) => (
                  <div>
                    <div className="font-bold text-cream">
                      {
                        deal.value
                      }
                    </div>

                    <div className="text-[11px] capitalize text-ink/50">
                      {
                        deal.transactionType
                      }
                    </div>
                  </div>
                ),
              },

              {
                header:
                  'Buyer',
                render: (
                  deal: OwnerDealRow,
                ) => (
                  <div>
                    <div className="text-sm font-semibold text-cream">
                      {
                        deal.buyer
                      }
                    </div>

                    <div className="mt-0.5 text-xs text-ink/50">
                      Agent: {
                        deal.agent
                      }
                    </div>

                    <div className="mt-0.5 text-xs text-ink/40">
                      Agency: {
                        deal.agency
                      }
                    </div>
                  </div>
                ),
              },

              {
                header:
                  'Agreement',
                render: (
                  deal: OwnerDealRow,
                ) => (
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${
                      deal.agreementStatus ===
                      'Completed'
                        ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                        : 'border-orange-400/20 bg-orange-400/10 text-orange-300'
                    }`}
                  >
                    {
                      deal.agreementStatus
                    }
                  </span>
                ),
              },

              {
                header:
                  'Payment',
                render: (
                  deal: OwnerDealRow,
                ) => (
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${
                      deal.paymentStatus ===
                      'Verified'
                        ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                        : 'border-white/10 bg-white/5 text-ink/70'
                    }`}
                  >
                    {
                      deal.paymentStatus
                    }
                  </span>
                ),
              },

              {
                header:
                  'Status',
                render: (
                  deal: OwnerDealRow,
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
                  'Date',
                render: (
                  deal: OwnerDealRow,
                ) => (
                  <span className="text-sm text-ink/60">
                    {formatDate(
                      deal.createdAt,
                    )}
                  </span>
                ),
              },

              {
                header:
                  'Action',
                render: (
                  deal: OwnerDealRow,
                ) => {
                  if (
                    deal.status ===
                      'Agreement Pending'
                  ) {
                    const isBusy =
                      actionLoadingId ===
                      deal.id;

                    return (
                      <GhostButton
                        onClick={() =>
                          handleCompleteAgreement(
                            deal,
                          )
                        }
                        disabled={
                          isBusy
                        }
                        className="h-8 px-3 text-xs"
                      >
                        {isBusy
                          ? 'Completing...'
                          : 'Complete Agreement'}
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
            data={
              filteredDeals
            }
          />
        )}
      </div>
    </div>
  );
}