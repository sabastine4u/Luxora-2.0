import {
    Briefcase,
    CheckCircle2,
    Clock3,
    FileText,
    RefreshCw,
} from 'lucide-react';
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

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
        transactionType?: string;
        price?: number;
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
    } | null;

    agent?: {
        _id: string;
        fullName: string;
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

    agreementStatus:
    | 'Pending'
    | 'Completed';

    paymentStatus:
    | 'Pending'
    | 'Verified';

    agreementCompletedAt?: string | null;
    paymentVerifiedAt?: string | null;
    completedAt?: string | null;

    createdAt: string;
    updatedAt: string;
}

interface AdminDealRow
    extends Record<string, unknown> {
    id: string;
    dealId: string;

    property: string;
    buyer: string;
    owner: string;
    agency: string;
    agent: string;

    transactionType: string;
    agreedAmount: number;
    formattedAmount: string;

    status: string;
    agreementStatus:
    | 'Pending'
    | 'Completed';

    paymentStatus:
    | 'Pending'
    | 'Verified';

    createdAt: string;
    rawDeal: BackendDeal;
}

const formatCurrency = (
    amount: number,
) => {
    if (
        typeof amount !== 'number' ||
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

const formatDate = (
    value: string,
) => {
    if (!value) {
        return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '—';
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

        case 'Payment Verified':
            return 90;

        case 'Completed':
            return 100;

        case 'Cancelled':
            return 0;

        default:
            return 0;
    }
};

const mapBackendDeal = (
    deal: BackendDeal,
): AdminDealRow => ({
    id: deal._id,

    dealId:
        deal.dealId,

    property:
        deal.property?.title ||
        'Property unavailable',

    buyer:
        deal.buyer?.fullName ||
        'Buyer unavailable',

    owner:
        deal.owner?.fullName ||
        'Owner unavailable',

    agency:
        deal.agency?.name ||
        'Agency unavailable',

    agent:
        deal.agent?.fullName ||
        'Agent unavailable',

    transactionType:
        deal.transactionType ||
        deal.property?.transactionType ||
        'buy',

    agreedAmount:
        typeof deal.agreedAmount ===
            'number'
            ? deal.agreedAmount
            : 0,

    formattedAmount:
        formatCurrency(
            typeof deal.agreedAmount ===
                'number'
                ? deal.agreedAmount
                : 0,
        ),

    status:
        deal.status,

    agreementStatus:
        deal.agreementStatus,

    paymentStatus:
        deal.paymentStatus,

    createdAt:
        deal.createdAt,

    rawDeal:
        deal,
});

export default function Deals() {
    const {
        showToast,
    } = useToast();

    const [
        deals,
        setDeals,
    ] = useState<AdminDealRow[]>(
        [],
    );

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        searchQuery,
        setSearchQuery,
    ] = useState('');

    const [
        actionLoading,
        setActionLoading,
    ] = useState<string | null>(
        null,
    );

    const [
        cancellingDeal,
        setCancellingDeal,
    ] = useState<AdminDealRow | null>(
        null,
    );

    const [
        cancellationReason,
        setCancellationReason,
    ] =
        useState('');

    const loadDeals =
        useCallback(
            async () => {
                try {
                    setLoading(true);

                    const response =
                        await dealApi.getMyDeals();

                    const rawResponse =
                        response as any;

                    /*
                     * Support the two response shapes used
                     * across the Luxora HTTP layer:
                     *
                     * response.data.deals
                     * response.deals
                     */
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
                        backendDeals.map(
                            mapBackendDeal,
                        ),
                    );
                } catch (error) {
                    console.error(
                        'Failed to load Admin deals:',
                        error,
                    );

                    showToast({
                        type: 'error',
                        title:
                            'Unable to load Deals',
                        description:
                            'We could not retrieve the platform Deal records.',
                    });
                } finally {
                    setLoading(false);
                }
            },
            [showToast],
        );

    useEffect(() => {
        void loadDeals();
    }, [loadDeals]);

    const filteredDeals =
        useMemo(() => {
            const query =
                searchQuery
                    .trim()
                    .toLowerCase();

            if (!query) {
                return deals;
            }

            return deals.filter(
                (deal) =>
                    [
                        deal.dealId,
                        deal.property,
                        deal.buyer,
                        deal.owner,
                        deal.agency,
                        deal.agent,
                        deal.transactionType,
                        deal.status,
                    ]
                        .filter(Boolean)
                        .some(
                            (value) =>
                                String(value)
                                    .toLowerCase()
                                    .includes(
                                        query,
                                    ),
                        ),
            );
        }, [
            deals,
            searchQuery,
        ]);

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

    const agreementPending =
        deals.filter(
            (deal) =>
                deal.status ===
                'Agreement Pending',
        ).length;

    const paymentPending =
        deals.filter(
            (deal) =>
                deal.status ===
                'Agreement Completed' &&
                deal.paymentStatus ===
                'Pending',
        ).length;

    const paymentVerified =
        deals.filter(
            (deal) =>
                deal.status ===
                'Payment Verified',
        ).length;

    const completedDeals =
        deals.filter(
            (deal) =>
                deal.status ===
                'Completed',
        ).length;

    const runAction =
        async (
            deal: AdminDealRow,
            action:
                | 'agreement'
                | 'payment'
                | 'complete',
        ) => {
            const actionKey =
                `${deal.id}:${action}`;

            try {
                setActionLoading(
                    actionKey,
                );

                if (
                    action ===
                    'agreement'
                ) {
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
                }

                if (
                    action ===
                    'payment'
                ) {
                    await dealApi.verifyPayment(
                        deal.id,
                    );

                    showToast({
                        type: 'success',
                        title:
                            'Payment verified',
                        description:
                            `Payment for ${deal.property} has been verified.`,
                    });
                }

                if (
                    action ===
                    'complete'
                ) {
                    await dealApi.completeDeal(
                        deal.id,
                    );

                    showToast({
                        type: 'success',
                        title:
                            'Deal completed',
                        description:
                            `${deal.property} has been finalized.`,
                    });
                }

                await loadDeals();
            } catch (error: any) {
                console.error(
                    `Failed to execute ${action} action:`,
                    error,
                );

                showToast({
                    type: 'error',
                    title:
                        'Unable to update Deal',
                    description:
                        error?.response?.data
                            ?.message ||
                        'The requested Deal action could not be completed.',
                });
            } finally {
                setActionLoading(
                    null,
                );
            }
        };

    const handleCancelDeal = async () => {
        if (!cancellingDeal) {
            return;
        }

        const reason =
            cancellationReason.trim();

        if (!reason) {
            showToast({
                type: 'error',
                title:
                    'Cancellation Reason Required',
                description:
                    'Please provide a reason before cancelling the Deal.',
            });

            return;
        }

        try {
            setActionLoading(
                `${cancellingDeal.id}:cancel`,
            );

            await dealApi.cancelDeal(
                cancellingDeal.id,
                reason,
            );

            showToast({
                type: 'success',
                title:
                    'Deal Cancelled',
                description:
                    `${cancellingDeal.dealId} was cancelled successfully.`,
            });

            setCancellingDeal(null);
            setCancellationReason('');

            await loadDeals();
        } catch (error: any) {
            console.error(
                'Failed to cancel Deal:',
                error,
            );

            showToast({
                type: 'error',
                title:
                    'Cancellation Failed',
                description:
                    error?.response?.data?.message ||
                    'The Deal could not be cancelled.',
            });
        } finally {
            setActionLoading(null);
        }
    };

    const openCancellationModal = (
        deal: AdminDealRow,
    ) => {
        setCancellationReason('');
        setCancellingDeal(deal);
    };

    const renderAction = (
        deal: AdminDealRow,
    ) => {
        /*
         * AGREEMENT PENDING
         * Admin can either complete the agreement
         * or cancel the Deal.
         */
        if (
            deal.status ===
            'Agreement Pending'
        ) {
            const agreementBusy =
                actionLoading ===
                `${deal.id}:agreement`;

            const cancelBusy =
                actionLoading ===
                `${deal.id}:cancel`;

            return (
                <div className="flex items-center gap-2">
                    <GhostButton
                        size="sm"
                        disabled={
                            agreementBusy ||
                            cancelBusy
                        }
                        onClick={() =>
                            void runAction(
                                deal,
                                'agreement',
                            )
                        }
                        className="px-3 py-2 text-xs"
                    >
                        {agreementBusy
                            ? 'Updating...'
                            : 'Complete Agreement'}
                    </GhostButton>

                    <GhostButton
                        size="sm"
                        disabled={
                            agreementBusy ||
                            cancelBusy
                        }
                        onClick={() =>
                            openCancellationModal(
                                deal,
                            )
                        }
                        className="px-3 py-2 text-xs text-rose-400 hover:text-rose-300"
                    >
                        {cancelBusy
                            ? 'Cancelling...'
                            : 'Cancel'}
                    </GhostButton>
                </div>
            );
        }

        /*
         * AGREEMENT COMPLETED / PAYMENT PENDING
         * Admin can either verify payment
         * or cancel the Deal.
         */
        if (
            deal.status ===
            'Agreement Completed' &&
            deal.paymentStatus ===
            'Pending'
        ) {
            const paymentBusy =
                actionLoading ===
                `${deal.id}:payment`;

            const cancelBusy =
                actionLoading ===
                `${deal.id}:cancel`;

            return (
                <div className="flex items-center gap-2">
                    <GhostButton
                        size="sm"
                        disabled={
                            paymentBusy ||
                            cancelBusy
                        }
                        onClick={() =>
                            void runAction(
                                deal,
                                'payment',
                            )
                        }
                        className="px-3 py-2 text-xs"
                    >
                        {paymentBusy
                            ? 'Verifying...'
                            : 'Verify Payment'}
                    </GhostButton>

                    <GhostButton
                        size="sm"
                        disabled={
                            paymentBusy ||
                            cancelBusy
                        }
                        onClick={() =>
                            openCancellationModal(
                                deal,
                            )
                        }
                        className="px-3 py-2 text-xs text-rose-400 hover:text-rose-300"
                    >
                        {cancelBusy
                            ? 'Cancelling...'
                            : 'Cancel'}
                    </GhostButton>
                </div>
            );
        }

        /*
         * PAYMENT PENDING
         * Keep this branch for any legacy/repair
         * Deal records that still carry this status.
         */
        if (
            deal.status ===
            'Payment Pending' &&
            deal.paymentStatus ===
            'Pending'
        ) {
            const cancelBusy =
                actionLoading ===
                `${deal.id}:cancel`;

            return (
                <GhostButton
                    size="sm"
                    disabled={cancelBusy}
                    onClick={() =>
                        openCancellationModal(
                            deal,
                        )
                    }
                    className="px-3 py-2 text-xs text-rose-400 hover:text-rose-300"
                >
                    {cancelBusy
                        ? 'Cancelling...'
                        : 'Cancel Deal'}
                </GhostButton>
            );
        }

        /*
         * PAYMENT VERIFIED
         * Cancellation is no longer allowed.
         */
        if (
            deal.status ===
            'Payment Verified' &&
            deal.paymentStatus ===
            'Verified'
        ) {
            const busy =
                actionLoading ===
                `${deal.id}:complete`;

            return (
                <GhostButton
                    size="sm"
                    disabled={busy}
                    onClick={() =>
                        void runAction(
                            deal,
                            'complete',
                        )
                    }
                    className="px-3 py-2 text-xs"
                >
                    {busy
                        ? 'Completing...'
                        : 'Complete Deal'}
                </GhostButton>
            );
        }

        /*
         * COMPLETED / CANCELLED
         */
        return (
            <span className="text-xs text-ink/40">
                No action
            </span>
        );
    };

    return (
        <div className="space-y-8">
            <DashboardHeader
                name="Deals"
                subtitle="Platform-wide oversight of accepted Offers and transaction progress."
            />

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <KPICard
                    title="Total Deal Value"
                    value={formatCurrency(
                        totalDealValue,
                    )}
                    trend={`${deals.length} Deal${deals.length ===
                        1
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
                    title="Payment Pending"
                    value={String(
                        paymentPending,
                    )}
                    trend={`${paymentVerified} payment verified`}
                    trendColor="text-blue-400"
                    icon={Clock3}
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
                        searchValue={
                            searchQuery
                        }
                        onSearchChange={
                            setSearchQuery
                        }
                        searchPlaceholder="Search Deals, properties, buyers, owners..."
                    />

                    <GhostButton
                        size="sm"
                        disabled={loading}
                        onClick={() =>
                            void loadDeals()
                        }
                        className="h-10 px-4"
                    >
                        <RefreshCw
                            className={`mr-2 h-4 w-4 ${loading
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
                            Loading platform Deals...
                        </div>
                    </div>
                ) : filteredDeals.length ===
                    0 ? (
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
                        data={
                            filteredDeals
                        }
                        keyExtractor={(
                            deal,
                        ) =>
                            deal.id
                        }
                        columns={[
                            {
                                header: 'Deal',
                                render: (
                                    deal,
                                ) => (
                                    <div>
                                        <div className="font-semibold text-cream">
                                            {
                                                deal.dealId
                                            }
                                        </div>

                                        <div className="mt-1 text-xs text-ink/50">
                                            {
                                                deal.property
                                            }
                                        </div>
                                    </div>
                                ),
                            },

                            {
                                header: 'Buyer',
                                render: (
                                    deal,
                                ) => (
                                    <span className="text-sm text-cream">
                                        {
                                            deal.buyer
                                        }
                                    </span>
                                ),
                            },

                            {
                                header: 'Owner',
                                render: (
                                    deal,
                                ) => (
                                    <span className="text-sm text-cream">
                                        {
                                            deal.owner
                                        }
                                    </span>
                                ),
                            },

                            {
                                header:
                                    'Agreed Amount',
                                render: (
                                    deal,
                                ) => (
                                    <div>
                                        <div className="font-bold text-cream">
                                            {
                                                deal.formattedAmount
                                            }
                                        </div>

                                        <div className="mt-1 text-[11px] capitalize text-ink/50">
                                            {
                                                deal.transactionType
                                            }
                                        </div>
                                    </div>
                                ),
                            },

                            {
                                header: 'Agency',
                                render: (
                                    deal,
                                ) => (
                                    <div>
                                        <div className="text-sm text-cream">
                                            {
                                                deal.agency
                                            }
                                        </div>

                                        <div className="mt-1 text-xs text-ink/50">
                                            Agent:{' '}
                                            {
                                                deal.agent
                                            }
                                        </div>
                                    </div>
                                ),
                            },

                            {
                                header:
                                    'Agreement',
                                render: (
                                    deal,
                                ) => (
                                    <span
                                        className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${deal.agreementStatus ===
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
                                    deal,
                                ) => (
                                    <span
                                        className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${deal.paymentStatus ===
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
                                header: 'Status',
                                render: (
                                    deal,
                                ) => (
                                    <EnterpriseStatusBadge
                                        status={
                                            deal.status
                                        }
                                    />
                                ),
                            },

                            {
                                header: 'Progress',
                                render: (
                                    deal,
                                ) => {
                                    const progress =
                                        getDealProgress(
                                            deal.status as BackendDeal['status'],
                                        );

                                    return (
                                        <div className="w-28">
                                            <div className="mb-1 flex items-center justify-between text-[10px] text-ink/50">
                                                <span>
                                                    Lifecycle
                                                </span>

                                                <span>
                                                    {
                                                        progress
                                                    }%
                                                </span>
                                            </div>

                                            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                                                <div
                                                    className="h-full rounded-full bg-gold-400 transition-all"
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                },
                            },

                            {
                                header: 'Date',
                                render: (
                                    deal,
                                ) => (
                                    <span className="text-sm text-ink/60">
                                        {formatDate(
                                            deal.createdAt,
                                        )}
                                    </span>
                                ),
                            },

                            {
                                header: 'Action',
                                render: (
                                    deal,
                                ) =>
                                    renderAction(
                                        deal,
                                    ),
                            },
                        ]}
                    />
                )}
            </div>

            {cancellingDeal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
                    <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-navy-900 p-6 shadow-2xl">
                        <div className="mb-5">
                            <h3 className="text-lg font-semibold text-cream">
                                Cancel Deal
                            </h3>

                            <p className="mt-1 text-sm text-ink/60">
                                Cancel {cancellingDeal.dealId} for{' '}
                                {cancellingDeal.property}.
                            </p>
                        </div>

                        <textarea
                            value={cancellationReason}
                            onChange={(event) =>
                                setCancellationReason(
                                    event.target.value,
                                )
                            }
                            rows={5}
                            placeholder="Enter the reason for cancelling this Deal..."
                            className="w-full resize-none rounded-xl border border-white/10 bg-navy-800 p-4 text-sm text-cream outline-none placeholder:text-ink/40 focus:border-rose-400/40"
                        />

                        <div className="mt-5 flex justify-end gap-3">
                            <GhostButton
                                onClick={() => {
                                    setCancellingDeal(null);
                                    setCancellationReason('');
                                }}
                                disabled={
                                    actionLoading ===
                                    `${cancellingDeal.id}:cancel`
                                }
                            >
                                Keep Deal
                            </GhostButton>

                            <GhostButton
                                onClick={() =>
                                    void handleCancelDeal()
                                }
                                disabled={
                                    actionLoading ===
                                    `${cancellingDeal.id}:cancel`
                                }
                                className="border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                            >
                                {actionLoading ===
                                    `${cancellingDeal.id}:cancel`
                                    ? 'Cancelling...'
                                    : 'Confirm Cancellation'}
                            </GhostButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}