import { useEffect, useMemo, useState } from 'react';
import {
  Users,
  Building2,
  Calendar as CalendarIcon,
  FileCheck,
  Landmark,
  DollarSign,
  Sparkles,
  Activity,
  Award,
  Target,
  AlertCircle,
  Mail,
  TrendingUp,
  Zap,
  Heart,
  Clock,
  Phone,
  MessageSquare,
} from 'lucide-react';

import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { useToast } from '../../../contexts/ToastContext';
import { useSession } from '../../../contexts/SessionContext';
import { agentApi } from '../../../api/agent.api';
import { getGreetingText } from '../../../utils/greeting';
import { WaveEmoji } from '../../../components/ui/WaveEmoji';

interface AgentLead {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  source: string;
  createdAt: string;

  property?: {
    _id?: string;
    title?: string;
    propertyType?: string;
    transactionType?: string;
    state?: string;
    city?: string;
    area?: string;
    price?: number;
  } | null;
}

interface AgentProperty {
  _id: string;
  title?: string;
  propertyType?: string;
  transactionType?: string;
  price?: number | null;
  currency?: string;

  images?: string[];
  coverImage?: string | null;

  videoUrl?: string | null;
  virtualTourUrl?: string | null;
  brochureUrl?: string | null;

  floorPlans?: string[];

  documents?: Array<{
    title?: string;
    name?: string;
    type?: string;
    url?: string;
    verified?: boolean;
  }>;

  description?: string;

  status?: string;

  agency?: {
    _id?: string;
    name?: string;
    status?: string;
  } | null;

  createdAt?: string;
}

interface AgentAppointment {
  id: string;

  clientName?: string;
  clientEmail?: string;

  title?: string;
  location?: string;

  scheduledDate?: string;
  scheduledTime?: string;

  date?: string;
  time?: string;

  appointmentStatus?:
    | 'Scheduled'
    | 'Completed'
    | 'Cancelled';
}

interface AgentOffer {
  _id: string;

  offerAmount: number;
  counterOfferAmount?: number | null;

  status:
    | 'Draft'
    | 'Submitted'
    | 'Under Review'
    | 'Counter Offer Received'
    | 'Accepted'
    | 'Rejected'
    | 'Withdrawn'
    | 'Expired';

  createdAt: string;

  property?: {
    _id?: string;
    title?: string;
    price?: number;
    transactionType?: string;
  } | null;

  buyer?: {
    _id?: string;
    fullName?: string;
    email?: string;
  } | null;
}

interface CommissionSummary {
  paid?: {
    amount: number;
    count: number;
  };

  pending?: {
    amount: number;
    count: number;
  };

  processing?: {
    amount: number;
    count: number;
  };

  overdue?: {
    amount: number;
    count: number;
  };

  totalEarned?: number;
  totalDeals?: number;
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

const getStartOfWeek = () => {
  const date = new Date();

  const day = date.getDay();

  const difference =
    day === 0
      ? -6
      : 1 - day;

  const monday = new Date(date);

  monday.setDate(
    date.getDate() + difference,
  );

  monday.setHours(
    0,
    0,
    0,
    0,
  );

  return monday;
};

const formatTimeAgo = (
  value: string,
) => {
  const timestamp =
    new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return 'Recently';
  }

  const difference =
    Date.now() - timestamp;

  const minutes = Math.floor(
    difference / (1000 * 60),
  );

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(
    minutes / 60,
  );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(
    hours / 24,
  );

  return `${days}d ago`;
};

export default function Overview() {
  const { showToast } = useToast();

  const { user } = useSession();

  const [
    leads,
    setLeads,
  ] = useState<AgentLead[]>([]);

  const [
    properties,
    setProperties,
  ] = useState<AgentProperty[]>([]);

  const [
    appointments,
    setAppointments,
  ] = useState<AgentAppointment[]>([]);

  const [
    offers,
    setOffers,
  ] = useState<AgentOffer[]>([]);

  const [
    commissionSummary,
    setCommissionSummary,
  ] =
    useState<CommissionSummary | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const [
    activeWorkflow,
    setActiveWorkflow,
  ] =
    useState<{
      title: string;
      type: string;
      data?: Record<string, unknown>;
    } | null>(null);

  /*
   * Load the same real Agent data used
   * throughout the rest of the dashboard.
   */
  useEffect(() => {
    const loadOverview = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const [
          leadsResponse,
          listingsResponse,
          appointmentsResponse,
          offersResponse,
          commissionResponse,
        ] = await Promise.all([
          agentApi.getMyLeads(),
          agentApi.getMyListings(),
          agentApi.getMyAppointments(),
          agentApi.getMyDeals(),
          agentApi.getMyCommissionSummary(),
        ]);

        /*
         * Leads.tsx already uses response.inquiries.
         */
        setLeads(
          Array.isArray(
            leadsResponse?.inquiries,
          )
            ? leadsResponse.inquiries
            : [],
        );

        /*
         * MyListings.tsx already uses response.properties.
         */
        setProperties(
          Array.isArray(
            listingsResponse?.properties,
          )
            ? listingsResponse.properties
            : [],
        );

        /*
         * Appointments.tsx already uses response.appointments.
         */
        setAppointments(
          Array.isArray(
            appointmentsResponse?.appointments,
          )
            ? appointmentsResponse.appointments
            : [],
        );

        /*
         * Deals.tsx already uses response.offers.
         */
        setOffers(
          Array.isArray(
            offersResponse?.offers,
          )
            ? offersResponse.offers
            : [],
        );

        /*
         * Commissions.tsx already uses response.summary.
         */
        setCommissionSummary(
          commissionResponse?.summary ||
            null,
        );
      } catch (error) {
        console.error(
          'Failed to load Agent Overview:',
          error,
        );

        setErrorMessage(
          'Unable to load your Agent dashboard data right now. Please refresh and try again.',
        );

        setLeads([]);
        setProperties([]);
        setAppointments([]);
        setOffers([]);
        setCommissionSummary(null);

        showToast({
          type: 'error',
          title: 'Unable to load overview',
          description:
            'We could not retrieve your current Agent dashboard data.',
        });
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, [showToast]);

  const today = new Date();

  /*
   * Calculate today's non-cancelled appointments
   * from the real backend appointment records.
   */
  const todayAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) => {
        if (
          appointment.appointmentStatus ===
          'Cancelled'
        ) {
          return false;
        }

        if (!appointment.scheduledDate) {
          return false;
        }

        const date =
          new Date(
            appointment.scheduledDate,
          );

        return (
          date.getFullYear() ===
            today.getFullYear() &&
          date.getMonth() ===
            today.getMonth() &&
          date.getDate() ===
            today.getDate()
        );
      },
    );
  }, [appointments]);

  /*
   * Match the exact active Lead definition
   * already used on Leads.tsx.
   */
  const activeLeads = useMemo(() => {
    return leads.filter(
      (lead) =>
        ![
          'Closed',
          'Lost',
        ].includes(lead.status),
    );
  }, [leads]);

  /*
   * Leads created today.
   */
  const newLeadsToday = useMemo(() => {
    const start =
      new Date();

    start.setHours(
      0,
      0,
      0,
      0,
    );

    return leads.filter(
      (lead) =>
        new Date(
          lead.createdAt,
        ).getTime() >=
        start.getTime(),
    );
  }, [leads]);

  /*
   * Follow-up queue based on the actual Lead
   * statuses used by Leads.tsx.
   */
  const followUpLeads = useMemo(() => {
    return leads.filter(
      (lead) =>
        lead.status === 'New' ||
        lead.status === 'Contacted',
    );
  }, [leads]);

  /*
   * Active offers use the same lifecycle exclusion
   * as the existing Deals page.
   */
  const activeOffers = useMemo(() => {
    return offers.filter(
      (offer) =>
        ![
          'Rejected',
          'Withdrawn',
          'Expired',
        ].includes(
          offer.status,
        ),
    );
  }, [offers]);

  /*
   * Accepted is the actual terminal state currently
   * provided by the Agent Offers API.
   */
  const acceptedOffers = useMemo(() => {
    return offers.filter(
      (offer) =>
        offer.status === 'Accepted',
    );
  }, [offers]);

  /*
   * Offers still somewhere in the open pipeline.
   */
  const pendingOffers = useMemo(() => {
    return offers.filter(
      (offer) =>
        [
          'Draft',
          'Submitted',
          'Under Review',
          'Counter Offer Received',
        ].includes(
          offer.status,
        ),
    );
  }, [offers]);

  /*
   * Read the Agency name from an actual accepted
   * listing instead of hard-coding an agency.
   */
  const agencyName = useMemo(() => {
    return (
      properties.find(
        (property) =>
          property.agency?.name,
      )?.agency?.name ||
      'Agency information unavailable'
    );
  }, [properties]);

  /*
   * Derive the visible Agent specialties from
   * actual accepted listing property types.
   */
  const propertyCategories =
    useMemo(() => {
      const categories =
        properties
          .map(
            (property) =>
              property.propertyType,
          )
          .filter(
            (
              value,
            ): value is string =>
              Boolean(value),
          );

      return Array.from(
        new Set(categories),
      ).slice(0, 3);
    }, [properties]);

  const totalEarned =
    commissionSummary?.totalEarned ||
    0;

  const pendingCommission =
    (commissionSummary?.pending?.amount ||
      0) +
    (commissionSummary?.overdue?.amount ||
      0);

  const totalCommissionDeals =
    commissionSummary?.totalDeals ||
    0;

  /*
   * Build a small live activity feed from real
   * Lead and Offer records.
   */
  const priorityInbox = useMemo(() => {
    const result: {
      sender: string;
      subject: string;
      time: string;
      unread: boolean;
      urgent: boolean;
    }[] = [];

    const newestLead =
      [...leads].sort(
        (a, b) =>
          new Date(
            b.createdAt,
          ).getTime() -
          new Date(
            a.createdAt,
          ).getTime(),
      )[0];

    if (newestLead) {
      result.push({
        sender:
          newestLead.fullName ||
          'Lead',

        subject:
          newestLead.property?.title
            ? `New interest in ${newestLead.property.title}`
            : 'New Lead assigned',

        time:
          formatTimeAgo(
            newestLead.createdAt,
          ),

        unread:
          newestLead.status ===
          'New',

        urgent:
          newestLead.status ===
          'New',
      });
    }

    const followUpLead =
      followUpLeads.find(
        (lead) =>
          lead.status ===
          'Contacted',
      );

    if (followUpLead) {
      result.push({
        sender:
          followUpLead.fullName,

        subject:
          'Lead follow-up required',

        time:
          formatTimeAgo(
            followUpLead.createdAt,
          ),

        unread: false,
        urgent: false,
      });
    }

    const latestOffer =
      [...offers].sort(
        (a, b) =>
          new Date(
            b.createdAt,
          ).getTime() -
          new Date(
            a.createdAt,
          ).getTime(),
      )[0];

    if (latestOffer) {
      result.push({
        sender:
          latestOffer.buyer
            ?.fullName ||
          'Buyer',

        subject:
          `${latestOffer.status} offer${
            latestOffer.property
              ?.title
              ? ` - ${latestOffer.property.title}`
              : ''
          }`,

        time:
          formatTimeAgo(
            latestOffer.createdAt,
          ),

        unread:
          latestOffer.status ===
          'Submitted',

        urgent:
          latestOffer.status ===
          'Counter Offer Received',
      });
    }

    return result.slice(0, 3);
  }, [
    leads,
    offers,
    followUpLeads,
  ]);

  /*
   * Upcoming appointments from the same backend
   * appointment collection.
   */
  const upcomingAppointments =
    useMemo(() => {
      return [...appointments]
        .filter(
          (appointment) =>
            appointment.appointmentStatus !==
              'Cancelled' &&
            appointment.scheduledDate,
        )
        .sort(
          (a, b) =>
            new Date(
              a.scheduledDate || '',
            ).getTime() -
            new Date(
              b.scheduledDate || '',
            ).getTime(),
        )
        .slice(0, 5);
    }, [appointments]);

  /*
   * Build the current Monday-Friday schedule
   * from real appointment records.
   */
  const weeklySchedule =
    useMemo(() => {
      const weekStart =
        getStartOfWeek();

      return Array.from(
        { length: 5 },
        (_, index) => {
          const date =
            new Date(
              weekStart,
            );

          date.setDate(
            weekStart.getDate() +
              index,
          );

          const dayAppointments =
            appointments.filter(
              (appointment) => {
                if (
                  !appointment.scheduledDate ||
                  appointment.appointmentStatus ===
                    'Cancelled'
                ) {
                  return false;
                }

                const appointmentDate =
                  new Date(
                    appointment.scheduledDate,
                  );

                return (
                  appointmentDate.getFullYear() ===
                    date.getFullYear() &&
                  appointmentDate.getMonth() ===
                    date.getMonth() &&
                  appointmentDate.getDate() ===
                    date.getDate()
                );
              },
            );

          return {
            label:
              date.toLocaleDateString(
                'en-NG',
                {
                  weekday:
                    'long',
                },
              ),

            count:
              dayAppointments.length,

            appointments:
              dayAppointments,
          };
        },
      );
    }, [appointments]);

  /*
   * Generate honest listing opportunities from
   * actual content gaps in the current portfolio.
   */
  const listingOpportunities =
    useMemo(() => {
      const suggestions: {
        title: string;
        desc: string;
        icon: typeof Sparkles;
        color: string;
      }[] = [];

      const withoutVideo =
        properties.find(
          (property) =>
            !property.videoUrl,
        );

      if (withoutVideo) {
        suggestions.push({
          title:
            'Add a Video Tour',

          desc:
            `${withoutVideo.title || 'A listing'} does not have a video attached.`,

          icon: Sparkles,

          color:
            'text-gold-400',
        });
      }

      const withoutImages =
        properties.find(
          (property) =>
            !property.images ||
            property.images.length <
              5,
        );

      if (withoutImages) {
        suggestions.push({
          title:
            'Refresh Listing Photos',

          desc:
            `${withoutImages.title || 'A listing'} has fewer than 5 images.`,

          icon: Heart,

          color:
            'text-rose-400',
        });
      }

      const withoutDescription =
        properties.find(
          (property) =>
            !property.description ||
            property.description.trim()
              .length < 120,
        );

      if (withoutDescription) {
        suggestions.push({
          title:
            'Improve Listing Description',

          desc:
            `${withoutDescription.title || 'A listing'} needs a stronger description.`,

          icon: FileCheck,

          color:
            'text-blue-400',
        });
      }

      return suggestions.slice(
        0,
        3,
      );
    }, [properties]);

  /*
   * Build recent activity from real Leads.
   */
  const recentLeadActivity =
    useMemo(() => {
      return [...leads]
        .sort(
          (a, b) =>
            new Date(
              b.createdAt,
            ).getTime() -
            new Date(
              a.createdAt,
            ).getTime(),
        )
        .slice(0, 5)
        .map((lead) => ({
          title:
            `${lead.status} Lead`,

          desc:
            `${lead.fullName}${
              lead.property?.title
                ? ` — ${lead.property.title}`
                : ''
            }`,

          time:
            formatTimeAgo(
              lead.createdAt,
            ),

          icon:
            lead.status ===
            'New'
              ? Phone
              : MessageSquare,

          color:
            lead.status ===
            'New'
              ? 'text-blue-400'
              : 'text-emerald-400',
        }));
    }, [leads]);

  /*
   * Overview KPI cards.
   *
   * These values come directly from the same
   * backend sources as the detailed dashboard pages.
   */
  const kpiData = [
    {
      label:
        'Assigned Leads',

      value:
        loading
          ? '...'
          : String(
              leads.length,
            ),

      trend:
        loading
          ? 'Loading...'
          : `${activeLeads.length} active`,

      icon:
        Users,

      color:
        'text-blue-400',

      bg:
        'bg-blue-400/10',
    },

    {
      label:
        'Active Listings',

      value:
        loading
          ? '...'
          : String(
              properties.length,
            ),

      trend:
        loading
          ? 'Loading...'
          : 'Accepted portfolio',

      icon:
        Building2,

      color:
        'text-emerald-400',

      bg:
        'bg-emerald-400/10',
    },

    {
      label:
        'Appointments',

      value:
        loading
          ? '...'
          : `${todayAppointments.length} Today`,

      trend:
        loading
          ? 'Loading...'
          : upcomingAppointments[0]
            ? `Next: ${
                upcomingAppointments[0]
                  .time ||
                upcomingAppointments[0]
                  .scheduledTime ||
                'Scheduled'
              }`
            : 'No upcoming appointment',

      icon:
        CalendarIcon,

      color:
        'text-gold-400',

      bg:
        'bg-gold-400/10',
    },

    {
      label:
        'Pending Deals',

      value:
        loading
          ? '...'
          : String(
              pendingOffers.length,
            ),

      trend:
        loading
          ? 'Loading...'
          : `${acceptedOffers.length} accepted`,

      icon:
        FileCheck,

      color:
        'text-orange-400',

      bg:
        'bg-orange-400/10',
    },

    {
      label:
        'Accepted Deals',

      value:
        loading
          ? '...'
          : String(
              acceptedOffers.length,
            ),

      trend:
        loading
          ? 'Loading...'
          : `${offers.length} total offers`,

      icon:
        Landmark,

      color:
        'text-indigo-400',

      bg:
        'bg-indigo-400/10',
    },

    {
      label:
        'Total Earnings',

      value:
        loading
          ? '...'
          : formatCurrency(
              totalEarned,
            ),

      trend:
        loading
          ? 'Loading...'
          : `${totalCommissionDeals} commission record${
              totalCommissionDeals ===
              1
                ? ''
                : 's'
            }`,

      icon:
        DollarSign,

      color:
        'text-rose-400',

      bg:
        'bg-rose-400/10',
    },
  ];

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

  /*
   * These workflows are intentionally not presented
   * as successful backend actions until endpoints exist.
   */
  const executeWorkflow = () => {
    showToast({
      type: 'warning',
      title: 'Not Connected',
      description:
        'This workflow does not have a backend action implemented yet.',
    });

    setActiveWorkflow(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {errorMessage && (
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
          {errorMessage}
        </div>
      )}

      <DashboardHeader
        name={
          user?.name ||
          'Agent'
        }

        avatarUrl={
          user?.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.name ||
              'Agent',
          )}&background=0D8ABC&color=fff`
        }

        /*
         * Do not claim verified status until the
         * current user/session data actually provides it.
         */
        showVerifiedBadge={false}

        /*
         * Do not use fake badges such as
         * "Top Producer" or "AI Assistant Active".
         */
        badges={[]}

        subtitle={
          <span>
            {agencyName}
          </span>
        }

        tags={
          propertyCategories.map(
            (category) => ({
              label:
                category,
              icon:
                Building2,
            }),
          )
        }

        actions={
          <div className="flex gap-3 w-full">
            <GoldButton
              className="w-full text-sm"
              onClick={() =>
                handleAction(
                  'Ask AI Assistant',
                  'ai',
                )
              }
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Ask AI
            </GoldButton>

            <GhostButton
              className="w-full text-sm"
              onClick={() =>
                handleAction(
                  'Plan My Day',
                  'plan',
                )
              }
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Plan Day
            </GhostButton>
          </div>
        }
      />

      {/* DASHBOARD INTELLIGENCE */}
      <div className="grid md:grid-cols-4 gap-6">
        {/* LIVE SUMMARY */}
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-gold-500/30 shadow-[0_0_15px_rgba(212,175,55,0.1)] rounded-2xl p-6 flex flex-col justify-center h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="h-24 w-24 text-gold-400" />
          </div>

          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 bg-gold-400/20 rounded-xl">
              <Sparkles className="h-6 w-6 text-gold-400" />
            </div>

            <h4 className="font-bold text-cream text-lg">
              Agent Dashboard Summary
            </h4>
          </div>

          {loading ? (
            <p className="text-sm text-ink/60 relative z-10">
              Loading your live Agent data...
            </p>
          ) : (
            <>
              <p className="text-sm text-ink/80 leading-relaxed relative z-10">
                {getGreetingText(
                  user?.name?.split(
                    ' ',
                  )[0] ||
                    'Agent',
                )}{' '}
                <WaveEmoji />. You currently have{' '}
                <strong className="text-blue-400">
                  {activeLeads.length}{' '}
                  active leads
                </strong>
                ,{' '}
                <strong className="text-emerald-400">
                  {properties.length}{' '}
                  accepted listings
                </strong>
                , and{' '}
                <strong className="text-gold-400">
                  {todayAppointments.length}{' '}
                  appointments today
                </strong>
                .
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4 mt-4 border-t border-white/10 relative z-10">
                <div>
                  <div className="text-xs text-ink/60 mb-1">
                    Active Leads
                  </div>

                  <div className="text-lg font-bold text-blue-400">
                    {activeLeads.length}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-ink/60 mb-1">
                    Pending Offers
                  </div>

                  <div className="text-lg font-bold text-orange-400">
                    {pendingOffers.length}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-ink/60 mb-1">
                    Earnings
                  </div>

                  <div className="text-lg font-bold text-emerald-400">
                    {formatCurrency(
                      totalEarned,
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* UNSUPPORTED BUSINESS HEALTH SCORE */}
        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col items-center justify-center text-center h-full">
          <Activity className="h-10 w-10 text-ink/30 mb-3" />

          <h3 className="text-sm font-semibold text-ink/60 mb-1">
            Business Health Score
          </h3>

          <p className="text-xs text-ink/40">
            Not connected
          </p>

          <p className="text-[10px] text-ink/30 mt-2">
            Analytics endpoint required
          </p>
        </div>

        {/* LIVE OFFER PIPELINE */}
        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
          <h3 className="text-sm font-semibold text-ink/60 mb-4 text-center flex items-center justify-center gap-1">
            <Target className="h-3 w-3" />
            Pipeline Snapshot
          </h3>

          <div className="flex-1 flex flex-col justify-center gap-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-cream font-medium">
                  Active Offers
                </span>

                <span className="text-blue-400">
                  {loading
                    ? '...'
                    : activeOffers.length}
                </span>
              </div>

              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      offers.length
                        ? Math.min(
                            100,
                            (activeOffers.length /
                              offers.length) *
                              100,
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-cream font-medium">
                  Accepted
                </span>

                <span className="text-emerald-400">
                  {loading
                    ? '...'
                    : acceptedOffers.length}
                </span>
              </div>

              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      offers.length
                        ? Math.min(
                            100,
                            (acceptedOffers.length /
                              offers.length) *
                              100,
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpiData.map(
          (kpi, index) => (
            <KPICard
              key={index}
              title={
                kpi.label
              }
              value={
                kpi.value
              }
              icon={
                kpi.icon
              }
              trend={
                kpi.trend
              }
              iconColor={
                kpi.color
              }
              backgroundColor={
                kpi.bg
              }
              hoverEffect="highlight"
              iconBorder={
                false
              }
            />
          ),
        )}
      </div>

      {/* LIVE WORKFLOW ROW */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* PRIORITY ACTIVITY */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 h-[250px] flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
            <h3 className="font-heading text-base font-bold text-cream flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-400" />
              Priority Activity
            </h3>

            <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-bold">
              {loading
                ? '...'
                : priorityInbox.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="text-xs text-ink/50">
                Loading activity...
              </div>
            ) : priorityInbox.length > 0 ? (
              priorityInbox.map(
                (
                  item,
                  index,
                ) => (
                  <div
                    key={index}
                    onClick={() =>
                      handleAction(
                        item.subject,
                        'activity',
                        item,
                      )
                    }
                    className="p-3 rounded-xl border border-white/5 bg-navy-900/50 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-cream">
                        {
                          item.sender
                        }
                      </span>

                      <span className="text-[10px] text-ink/40">
                        {
                          item.time
                        }
                      </span>
                    </div>

                    <div
                      className={`text-xs ${
                        item.urgent
                          ? 'text-rose-400'
                          : item.unread
                            ? 'text-blue-300'
                            : 'text-ink/60'
                      }`}
                    >
                      {item.urgent && (
                        <AlertCircle className="inline h-3 w-3 mr-1" />
                      )}

                      {
                        item.subject
                      }
                    </div>
                  </div>
                ),
              )
            ) : (
              <div className="text-xs text-ink/50">
                No current lead or offer activity.
              </div>
            )}
          </div>
        </div>

        {/* TODAY'S APPOINTMENTS */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 h-[250px] flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
            <h3 className="font-heading text-base font-bold text-cream flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-gold-400" />
              Today's Schedule
            </h3>

            <span className="text-xs text-gold-400 font-bold">
              {loading
                ? '...'
                : todayAppointments.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="text-xs text-ink/50">
                Loading appointments...
              </div>
            ) : todayAppointments.length >
              0 ? (
              todayAppointments.map(
                (
                  appointment,
                  index,
                ) => (
                  <div
                    key={
                      appointment.id ||
                      index
                    }
                    className="p-3 rounded-xl border border-white/5 bg-navy-900/50"
                  >
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-cream">
                        {
                          appointment.time ||
                          appointment.scheduledTime ||
                          'Scheduled'
                        }
                      </span>

                      <span className="text-[10px] text-emerald-400">
                        {
                          appointment.appointmentStatus ||
                          'Scheduled'
                        }
                      </span>
                    </div>

                    <div className="text-xs text-ink/70 mt-1">
                      {
                        appointment.clientName ||
                        'Client unavailable'
                      }
                    </div>

                    <div className="text-[10px] text-ink/40 mt-1">
                      {
                        appointment.title ||
                        'Property Viewing'
                      }
                    </div>
                  </div>
                ),
              )
            ) : (
              <div className="text-xs text-ink/50">
                No appointments scheduled for today.
              </div>
            )}
          </div>
        </div>

        {/* LISTING OPPORTUNITIES */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 h-[250px] flex flex-col">
          <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2 pb-3 border-b border-white/10">
            <Zap className="h-4 w-4 text-yellow-400" />
            Listing Opportunities
          </h3>

          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="text-xs text-ink/50">
                Loading listing insights...
              </div>
            ) : listingOpportunities.length >
              0 ? (
              listingOpportunities.map(
                (
                  opportunity,
                  index,
                ) => (
                  <div
                    key={index}
                    className="flex gap-3 bg-navy-900/50 p-3 rounded-xl border border-white/5"
                  >
                    <div className="pt-0.5">
                      <opportunity.icon
                        className={`h-4 w-4 ${opportunity.color}`}
                      />
                    </div>

                    <div>
                      <div className="text-xs font-bold text-cream mb-1">
                        {
                          opportunity.title
                        }
                      </div>

                      <div className="text-[10px] text-ink/60">
                        {
                          opportunity.desc
                        }
                      </div>
                    </div>
                  </div>
                ),
              )
            ) : (
              <div className="text-xs text-ink/50">
                No immediate listing opportunities detected.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* WEEKLY PLANNING / FOCUS / RENEWALS */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* WEEKLY PLANNING */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gold-400" />
            Weekly Planning Board
          </h3>

          {loading ? (
            <div className="text-xs text-ink/50">
              Loading weekly schedule...
            </div>
          ) : (
            <div className="space-y-2">
              {weeklySchedule.map(
                (
                  day,
                ) => (
                  <div
                    key={
                      day.label
                    }
                    className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5"
                  >
                    <span className="text-xs text-cream font-medium">
                      {
                        day.label
                      }
                    </span>

                    <span className="text-xs text-ink/60">
                      {
                        day.count
                      }{' '}
                      appointment
                      {day.count ===
                      1
                        ? ''
                        : 's'}
                    </span>
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        {/* CURRENT FOCUS */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-rose-400" />
            Current Focus
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-cream">
                  Lead Follow-up
                </span>

                <span className="text-gold-400">
                  {loading
                    ? '...'
                    : `${followUpLeads.length} leads`}
                </span>
              </div>

              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      leads.length
                        ? Math.min(
                            100,
                            (followUpLeads.length /
                              leads.length) *
                              100,
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-cream">
                  Offer Pipeline
                </span>

                <span className="text-blue-400">
                  {loading
                    ? '...'
                    : `${activeOffers.length} active`}
                </span>
              </div>

              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      offers.length
                        ? Math.min(
                            100,
                            (activeOffers.length /
                              offers.length) *
                              100,
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-cream">
                  Listing Portfolio
                </span>

                <span className="text-emerald-400">
                  {loading
                    ? '...'
                    : `${properties.length} active`}
                </span>
              </div>

              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{
                    width:
                      properties.length >
                      0
                        ? '100%'
                        : '0%',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RENEWALS */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-400" />
            Renewals
          </h3>

          <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
            <div className="text-sm font-medium text-cream">
              Renewal tracking not connected
            </div>

            <div className="text-xs text-ink/50 mt-1">
              The current Agent APIs do not provide lease or management renewal records.
            </div>
          </div>
        </div>
      </div>

      {/* FINANCIAL + ACTIVITY */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* COMMISSION */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            Commission Snapshot
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-ink/60">
                Total Earned
              </span>

              <span className="text-sm font-bold text-emerald-400">
                {loading
                  ? '...'
                  : formatCurrency(
                      totalEarned,
                    )}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-ink/60">
                Pending / Overdue
              </span>

              <span className="text-sm font-bold text-gold-400">
                {loading
                  ? '...'
                  : formatCurrency(
                      pendingCommission,
                    )}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-ink/60">
                Commission Records
              </span>

              <span className="text-sm font-bold text-blue-400">
                {loading
                  ? '...'
                  : totalCommissionDeals}
              </span>
            </div>
          </div>
        </div>

        {/* RECENT LEAD ACTIVITY */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-400" />
            Recent Lead Activity
          </h3>

          {loading ? (
            <div className="text-xs text-ink/50">
              Loading recent activity...
            </div>
          ) : recentLeadActivity.length >
            0 ? (
            <div className="space-y-3">
              {recentLeadActivity.map(
                (
                  activity,
                  index,
                ) => (
                  <div
                    key={index}
                    className="flex gap-3"
                  >
                    <activity.icon
                      className={`h-4 w-4 ${activity.color} shrink-0`}
                    />

                    <div>
                      <div className="text-xs font-bold text-cream">
                        {
                          activity.title
                        }
                      </div>

                      <div className="text-[10px] text-ink/60">
                        {
                          activity.desc
                        }
                      </div>

                      <div className="text-[10px] text-ink/40 mt-1">
                        {
                          activity.time
                        }
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="text-xs text-ink/50">
              No recent Lead activity.
            </div>
          )}
        </div>

        {/* ANALYTICS */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-gold-400" />
            Agent Analytics
          </h3>

          <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
            <div className="text-sm font-medium text-cream">
              Advanced performance analytics
            </div>

            <div className="text-xs text-ink/50 mt-1">
              Detailed response-time, leaderboard, target and satisfaction metrics remain in the dedicated Performance dashboard.
            </div>
          </div>
        </div>
      </div>

      {/* WORKFLOW DRAWER */}
      <EnterpriseDetailDrawer
        isOpen={
          !!activeWorkflow
        }
        onClose={() =>
          setActiveWorkflow(
            null,
          )
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
              The{' '}
              <strong>
                {
                  activeWorkflow?.type
                }
              </strong>{' '}
              workflow is currently available in the UI, but the corresponding backend action is not connected yet.
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
                  (
                    [
                      key,
                      value,
                    ],
                  ) => {
                    if (
                      typeof value ===
                        'string' ||
                      typeof value ===
                        'number'
                    ) {
                      return (
                        <div
                          key={
                            key
                          }
                          className="flex justify-between border-b border-white/5 pb-2"
                        >
                          <span className="capitalize">
                            {
                              key
                            }
                          </span>

                          <span className="font-medium text-cream">
                            {String(
                              value,
                            )}
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