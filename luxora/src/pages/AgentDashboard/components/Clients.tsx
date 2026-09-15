import { useEffect, useMemo, useState } from 'react';
import {
  Users,
  UserPlus,
  Heart,
  Download,
  Star,
  MessageSquare,
  TrendingUp,
  Gift,
  Zap,
  CheckCircle2,
  Clock,
  Award,
} from 'lucide-react';

import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import {
  GhostButton,
  GoldButton,
} from '../../../components/ui/ui';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { ClientDetailModal } from './modals/ClientDetailModal';
import { useToast } from '../../../contexts/ToastContext';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';

import { agentApi } from '../../../api/agent.api';

// Define the real Client record returned by the Agent Clients endpoint.
interface AgentClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  inquiryCount: number;
  propertyCount: number;
  lastContactAt: string;
  firstInteractionAt: string;
  status: string;

  latestProperty?: {
    _id?: string;
    title?: string;
    propertyType?: string;
    transactionType?: string;
    state?: string;
    city?: string;
    area?: string;
    price?: number;
    currency?: string;
    status?: string;
  } | null;

  isRegisteredUser: boolean;
  latestSource?: string | null;
  hasActiveInquiry: boolean;
  relationshipStatus: string;
  totalValue?: number | null;
  engagementScore?: number | null;
}

// Define the display shape used by the existing Clients table and modal.
interface DisplayClient extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  totalValue: number | null;
  lastContact: string;
  lastContactAt: string;
  engagementScore: number | null;
  status: string;
  inquiryCount: number;
  propertyCount: number;
  firstInteractionAt: string;
  latestProperty: AgentClient['latestProperty'];
  latestSource: string;
  isRegisteredUser: boolean;
  hasActiveInquiry: boolean;
  relationshipStatus: string;
}

export default function Clients() {
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedClient, setSelectedClient] =
    useState<DisplayClient | null>(null);

  const [activeWorkflow, setActiveWorkflow] =
    useState<{
      title: string;
      type: string;
      data?: Record<string, unknown>;
    } | null>(null);

  // Store the real Clients returned by the backend.
  const [clients, setClients] = useState<AgentClient[]>([]);

  // Track the Client API loading state.
  const [isLoading, setIsLoading] = useState(true);

  // Store a readable Client API error.
  const [errorMessage, setErrorMessage] = useState('');

  // Load the authenticated Agent's real Clients.
  useEffect(() => {
    const loadClients = async () => {
      try {
        // Start loading and clear previous errors.
        setIsLoading(true);
        setErrorMessage('');

        // The backend determines the Agent from the authenticated token.
        const response = await agentApi.getMyClients();

        // The shared HTTP client unwraps the API envelope.
        setClients(response?.clients || []);
      } catch (error) {
        // Keep the page mounted while reporting the real request failure.
        console.error(
          'Failed to load Agent Clients:',
          error,
        );

        setErrorMessage(
          'Unable to load your Clients right now. Please refresh and try again.',
        );

        setClients([]);
      } finally {
        // End the loading state after the API request finishes.
        setIsLoading(false);
      }
    };

    loadClients();
  }, []);

  // Convert the backend Client records into the shape expected by the existing UI.
  const displayClients = useMemo<DisplayClient[]>(
    () =>
      clients.map((client) => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,

        // Use the latest property's type as the current Client relationship context.
        type:
          client.latestProperty?.propertyType ||
          'Property Client',

        // Current backend does not store lifetime Client transaction value.
        totalValue: client.totalValue ?? null,

        // Keep the raw timestamp for calculations.
        lastContactAt: client.lastContactAt,

        // Format the raw timestamp only for visual display.
        lastContact: formatDateTime(
          client.lastContactAt,
        ),

        // Current backend does not store a Client engagement score.
        engagementScore:
          client.engagementScore ?? null,

        // Use the real relationship status generated by the backend.
        status:
          client.relationshipStatus ||
          'Past',

        inquiryCount: client.inquiryCount,
        propertyCount: client.propertyCount,
        firstInteractionAt:
          client.firstInteractionAt,

        latestProperty:
          client.latestProperty || null,

        latestSource:
          client.latestSource || 'Unknown',

        isRegisteredUser:
          client.isRegisteredUser,

        hasActiveInquiry:
          client.hasActiveInquiry,

        relationshipStatus:
          client.relationshipStatus ||
          'Past',
      })),
    [clients],
  );

  // Filter real Clients using the existing search field.
  const filteredClients = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    if (!query) {
      return displayClients;
    }

    return displayClients.filter(
      (client) =>
        client.name
          .toLowerCase()
          .includes(query) ||
        client.email
          .toLowerCase()
          .includes(query) ||
        client.type
          .toLowerCase()
          .includes(query) ||
        client.status
          .toLowerCase()
          .includes(query),
    );
  }, [
    displayClients,
    searchQuery,
  ]);

  // Count every unique real Client returned by the backend.
  const totalClients =
    displayClients.length;

  // VIP classification is not stored by the current backend.
  const vipClientCount = 0;

  // Count Clients with an active Lead.
  const activeClientCount =
    displayClients.filter(
      (client) =>
        client.hasActiveInquiry,
    ).length;

  // Count Clients with only closed/lost relationships.
  const pastClientCount =
    displayClients.filter(
      (client) =>
        !client.hasActiveInquiry,
    ).length;

  // Build the loyalty distribution from the real Client relationship data.
  const loyaltyDistribution = useMemo(
    () => [
      {
        label: 'VIP / Managed Client',
        value: vipClientCount,
        color: 'bg-gold-400',
      },
      {
        label: 'Active Relationship',
        value: activeClientCount,
        color: 'bg-emerald-400',
      },
      {
        label: 'Past Relationship',
        value: pastClientCount,
        color: 'bg-blue-400',
      },
    ],
    [
      activeClientCount,
      pastClientCount,
    ],
  );

  // Keep the existing workflow drawer for future CRM actions.
  const handleAction = (
    title: string,
    type: string,
    data?: Record<
      string,
      unknown
    >,
  ) => {
    setActiveWorkflow({
      title,
      type,
      data,
    });
  };

  // Keep workflow confirmation behavior until real CRM mutations are implemented.
  const executeWorkflow = () => {
    showToast({
      type: 'success',
      title: 'Action Queued',
      description:
        `${activeWorkflow?.title} is ready for the next CRM integration stage.`,
    });

    setActiveWorkflow(null);
  };

  // Open the existing Client detail modal.
  const handleViewClient = (
    client: Record<string, unknown>,
  ) => {
    setSelectedClient(
      client as DisplayClient,
    );
  };

  // Build relationship recommendations from actual Client relationships.
  const relationshipRecommendations =
    useMemo(() => {
      const recommendations: {
        text: string;
        icon: typeof Zap;
        color: string;
        type: string;
      }[] = [];

      const activeClient =
        displayClients.find(
          (client) =>
            client.hasActiveInquiry,
        );

      if (activeClient) {
        recommendations.push({
          text: `Continue the relationship with ${activeClient.name} while their Lead remains active.`,
          icon: Zap,
          color:
            'text-emerald-400',
          type: 'Action',
        });
      }

      const pastClient =
        displayClients.find(
          (client) =>
            !client.hasActiveInquiry,
        );

      if (pastClient) {
        recommendations.push({
          text: `Re-engagement opportunity for ${pastClient.name} based on their previous inquiry history.`,
          icon: MessageSquare,
          color:
            'text-blue-400',
          type: 'Nurture',
        });
      }

      if (
        recommendations.length === 0
      ) {
        recommendations.push({
          text:
            'No relationship action can be calculated from the current Client data.',
          icon: CheckCircle2,
          color:
            'text-emerald-400',
          type: 'Info',
        });
      }

      return recommendations.slice(
        0,
        2,
      );
    }, [displayClients]);

  // The current backend does not store birthdays or anniversaries.
  const milestones = [
    {
      name: 'Client Milestones',
      event:
        'Birthday and anniversary tracking',
      date: 'Backend pending',
      icon: Award,
      color:
        'text-gold-400',
    },
    {
      name: 'Relationship Events',
      event:
        'CRM milestone tracking',
      date: 'Backend pending',
      icon: Gift,
      color:
        'text-rose-400',
    },
  ];

  // Build a real Client engagement timeline from the latest interactions.
  const upcomingActivities =
    useMemo(() => {
      return [...displayClients]
        .sort(
          (a, b) =>
            new Date(
              b.lastContactAt,
            ).getTime() -
            new Date(
              a.lastContactAt,
            ).getTime(),
        )
        .slice(0, 3)
        .map((client) => ({
          title:
            client.hasActiveInquiry
              ? 'Active Client'
              : 'Past Client',

          desc:
            `${client.name} — ${client.inquiryCount} ${client.inquiryCount === 1 ? 'inquiry' : 'inquiries'}`,

          time: client.lastContact,

          icon:
            client.hasActiveInquiry
              ? MessageSquare
              : Clock,

          color:
            client.hasActiveInquiry
              ? 'text-emerald-400'
              : 'text-blue-400',
        }));
    }, [displayClients]);

  // Calculate how many Clients were contacted within the last 30 days.
  const communication30Days =
    useMemo(() => {
      if (!totalClients) {
        return 0;
      }

      const cutoff =
        Date.now() -
        30 *
          24 *
          60 *
          60 *
          1000;

      return displayClients.filter(
        (client) =>
          new Date(
            client.lastContactAt,
          ).getTime() >= cutoff,
      ).length;
    }, [
      displayClients,
      totalClients,
    ]);

  // Calculate how many Clients were last contacted 30-90 days ago.
  const communication30To90 =
    useMemo(() => {
      const now = Date.now();

      const thirtyDaysAgo =
        now -
        30 *
          24 *
          60 *
          60 *
          1000;

      const ninetyDaysAgo =
        now -
        90 *
          24 *
          60 *
          60 *
          1000;

      return displayClients.filter(
        (client) => {
          const date =
            new Date(
              client.lastContactAt,
            ).getTime();

          return (
            date <
              thirtyDaysAgo &&
            date >=
              ninetyDaysAgo
          );
        },
      ).length;
    }, [displayClients]);

  // Calculate how many Clients were last contacted more than 90 days ago.
  const communication90Plus =
    useMemo(() => {
      if (!totalClients) {
        return 0;
      }

      const cutoff =
        Date.now() -
        90 *
          24 *
          60 *
          60 *
          1000;

      return displayClients.filter(
        (client) =>
          new Date(
            client.lastContactAt,
          ).getTime() <
          cutoff,
      ).length;
    }, [
      displayClients,
      totalClients,
    ]);

  // Convert the real communication counts into percentages.
  const communication30Percentage =
    totalClients
      ? Math.round(
          (communication30Days /
            totalClients) *
            100,
        )
      : 0;

  const communication30To90Percentage =
    totalClients
      ? Math.round(
          (communication30To90 /
            totalClients) *
            100,
        )
      : 0;

  const communication90PlusPercentage =
    totalClients
      ? Math.round(
          (communication90Plus /
            totalClients) *
            100,
        )
      : 0;

  // Export the real Client records currently loaded from the backend.
  const handleExportClients = () => {
    if (!displayClients.length) {
      return;
    }

    const headers = [
      'Client ID',
      'Name',
      'Email',
      'Phone',
      'Client Type',
      'Relationship Status',
      'Inquiry Count',
      'Property Count',
      'Latest Property',
      'Latest Source',
      'Last Contact',
    ];

    const rows =
      displayClients.map(
        (client) => [
          client.id,
          client.name,
          client.email,
          client.phone,
          client.type,
          client.relationshipStatus,
          client.inquiryCount,
          client.propertyCount,
          client.latestProperty
            ?.title || '',
          client.latestSource,
          client.lastContact,
        ],
      );

    // Escape CSV values so commas and quotes inside Client data remain valid.
    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(
                value ?? '',
              ).replace(
                /"/g,
                '""',
              )}"`,
          )
          .join(','),
      )
      .join('\n');

    // Create a temporary downloadable CSV from the real Client records.
    const blob =
      new Blob([csv], {
        type: 'text/csv;charset=utf-8;',
      });

    const url =
      URL.createObjectURL(
        blob,
      );

    const link =
      document.createElement(
        'a',
      );

    link.href = url;

    link.download =
      `agent-clients-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

    document.body.appendChild(
      link,
    );

    link.click();

    document.body.removeChild(
      link,
    );

    URL.revokeObjectURL(url);
  };

  // Show a page-level skeleton while the real Client API request is pending.
  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="h-8 w-64 animate-pulse rounded-lg bg-white/10" />
            <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-white/5" />
          </div>

          <div className="flex gap-3">
            <div className="h-10 w-32 animate-pulse rounded-xl bg-white/5" />
            <div className="h-10 w-32 animate-pulse rounded-xl bg-white/5" />
          </div>
        </div>

        {/* KPI loading placeholders. */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl border border-white/10 bg-navy-800/50"
              />
            ),
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-3">
            <div className="h-12 animate-pulse rounded-xl bg-white/5" />

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy-800/50">
              <div className="space-y-4 p-6">
                {[1, 2, 3, 4, 5].map(
                  (item) => (
                    <div
                      key={item}
                      className="h-14 animate-pulse rounded-lg bg-white/5"
                    />
                  ),
                )}
              </div>
            </div>

            <div className="h-24 animate-pulse rounded-2xl bg-white/5" />
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="h-52 animate-pulse rounded-2xl border border-white/10 bg-navy-800/50"
                />
              ),
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        name="Relationship Intelligence"
        subtitle="Nurture high-value relationships, track client milestones, and automate engagement."
        actions={
          <div className="flex gap-3">
            <GhostButton
              className="flex items-center gap-2"
              onClick={
                handleExportClients
              }
              disabled={
                !displayClients.length
              }
            >
              <Download className="h-4 w-4" />
              Export CRM
            </GhostButton>

            {/* Keep New Client visible until a dedicated client-creation backend exists. */}
            <GoldButton
              className="flex items-center gap-2"
              disabled
              title="Client creation backend is not implemented yet"
            >
              <UserPlus className="h-4 w-4" />
              New Client
            </GoldButton>
          </div>
        }
      />

      {errorMessage && (
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
          {errorMessage}
        </div>
      )}

      {/* INTELLIGENCE HEADER: HEALTH & LOYALTY */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="flex h-full flex-col justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-navy-800 to-navy-900 p-6 md:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-emerald-400/20 p-2">
              <Heart className="h-6 w-6 text-emerald-400" />
            </div>

            <h4 className="text-lg font-bold text-cream">
              Relationship Health Dashboard
            </h4>
          </div>

          <p className="mb-4 text-sm leading-relaxed text-ink/80">
            Your current Agent
            portfolio contains{' '}
            <strong className="text-emerald-400">
              {activeClientCount}{' '}
              active
            </strong>{' '}
            Client
            {activeClientCount ===
            1
              ? ''
              : 's'}{' '}
            and{' '}
            <strong className="text-blue-400">
              {pastClientCount}{' '}
              past
            </strong>{' '}
            relationship
            {pastClientCount ===
            1
              ? ''
              : 's'}
            . Portfolio lifetime
            value and engagement
            scoring require dedicated
            CRM data that is not yet
            stored by the backend.
          </p>

          <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
            <div>
              <div className="mb-1 text-xs text-ink/60">
                Active Relationships
              </div>

              <div className="text-lg font-bold text-emerald-400">
                {
                  activeClientCount
                }
              </div>
            </div>

            <div>
              <div className="mb-1 text-xs text-ink/60">
                Portfolio LTV
              </div>

              <div className="text-lg font-bold text-gold-400">
                —
              </div>
            </div>

            <div>
              <div className="mb-1 text-xs text-ink/60">
                Engagement Score
              </div>

              <div className="text-lg font-bold text-blue-400">
                —
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink/60">
              <MessageSquare className="h-4 w-4 text-blue-400" />
              Communication Planner
            </h3>

            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-medium text-cream">
                    Contacted &lt; 30 Days
                  </span>

                  <span className="text-emerald-400">
                    {
                      communication30Percentage
                    }
                    %
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{
                      width: `${communication30Percentage}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-medium text-cream">
                    Contacted 30-90 Days
                  </span>

                  <span className="text-gold-400">
                    {
                      communication30To90Percentage
                    }
                    %
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gold-400"
                    style={{
                      width: `${communication30To90Percentage}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-medium text-cream">
                    Needs Attention &gt;90 Days
                  </span>

                  <span className="text-rose-400">
                    {
                      communication90PlusPercentage
                    }
                    %
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-rose-400"
                    style={{
                      width: `${communication90PlusPercentage}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <h3 className="mb-4 text-center text-sm font-semibold text-ink/60">
            Renewal Opportunity Tracker
          </h3>

          <div className="flex flex-1 flex-col justify-center gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">
                Lease Renewals
              </span>

              <span className="text-sm font-medium text-gold-400">
                —
              </span>
            </div>

            <div className="h-1.5 w-full rounded-full bg-white/5">
              <div className="h-1.5 w-0 rounded-full bg-gold-400" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">
                Management Contracts
              </span>

              <span className="text-sm font-medium text-blue-400">
                —
              </span>
            </div>

            <div className="h-1.5 w-full rounded-full bg-white/5">
              <div className="h-1.5 w-0 rounded-full bg-blue-400" />
            </div>

            <p className="text-center text-[10px] text-ink/40">
              Contract and renewal
              tracking requires a
              dedicated CRM backend.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Clients"
          value={String(
            totalClients,
          )}
          trend={`${activeClientCount} active relationship${activeClientCount === 1 ? '' : 's'}`}
          trendColor="text-emerald-400"
          icon={Users}
        />

        <KPICard
          title="VIP Clients"
          value={String(
            vipClientCount,
          )}
          trend="VIP classification backend pending"
          trendColor="text-gold-400"
          icon={Star}
        />

        <KPICard
          title="Client Tenure"
          value="—"
          trend="CRM relationship history pending"
          trendColor="text-ink/50"
          icon={Clock}
        />

        <KPICard
          title="Engagement Score"
          value="—"
          trend="Engagement scoring backend pending"
          trendColor="text-blue-400"
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Table Area */}
        <div className="space-y-6 lg:col-span-3">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={
              setSearchQuery
            }
            searchPlaceholder="Search clients by name or type..."
          />

          <DataTable
            keyExtractor={(
              item: Record<
                string,
                unknown
              >,
              index: number,
            ) =>
              (item.id as string) ||
              String(index)
            }
            columns={[
              {
                header:
                  'Client Name',

                render: (
                  client: Record<
                    string,
                    unknown
                  >,
                ) => (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-cream">
                      <Users className="h-5 w-5 text-emerald-400" />
                    </div>

                    <div>
                      <div className="flex items-center gap-1 font-semibold text-cream">
                        {
                          client.name as string
                        }

                        {client.status ===
                          'VIP' && (
                          <Star className="h-3 w-3 fill-gold-400 text-gold-400" />
                        )}
                      </div>

                      <div className="text-xs text-ink/60">
                        {
                          client.type as string
                        }
                      </div>

                      <div className="mt-1 text-[10px] text-ink/40">
                        {
                          client.email as string
                        }
                      </div>
                    </div>
                  </div>
                ),
              },

              {
                header:
                  'Total Value',

                render: (
                  client: Record<
                    string,
                    unknown
                  >,
                ) => {
                  const value =
                    client.totalValue as
                      | number
                      | null;

                  return (
                    <div className="font-bold text-gold-400">
                      {value ===
                      null
                        ? 'Not available'
                        : formatCurrency(
                            value,
                          )}
                    </div>
                  );
                },
              },

              {
                header:
                  'Last Contact',

                render: (
                  client: Record<
                    string,
                    unknown
                  >,
                ) => (
                  <div className="flex items-center gap-1.5 text-sm text-cream">
                    <Clock className="h-3.5 w-3.5 text-ink/40" />

                    {
                      client.lastContact as string
                    }
                  </div>
                ),
              },

              {
                header:
                  'Engagement Score',

                render: (
                  client: Record<
                    string,
                    unknown
                  >,
                ) => {
                  const score =
                    client.engagementScore as
                      | number
                      | null;

                  return (
                    <div className="w-24">
                      {score ===
                      null ? (
                        <div className="text-xs text-ink/50">
                          Not available
                        </div>
                      ) : (
                        <>
                          <div className="mb-1 flex justify-between text-xs">
                            <span className="text-ink/60">
                              Score
                            </span>

                            <span className="text-cream">
                              {
                                score
                              }
                            </span>
                          </div>

                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                              className={`h-full ${
                                score >=
                                90
                                  ? 'bg-emerald-400'
                                  : score >=
                                      60
                                    ? 'bg-gold-400'
                                    : 'bg-rose-400'
                              }`}
                              style={{
                                width: `${score}%`,
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  );
                },
              },

              {
                header:
                  'Status',

                render: (
                  client: Record<
                    string,
                    unknown
                  >,
                ) => (
                  <EnterpriseStatusBadge
                    status={
                      client.status as string
                    }
                  />
                ),
              },

              {
                header:
                  'Actions',

                render: (
                  client: Record<
                    string,
                    unknown
                  >,
                ) => (
                  <GhostButton
                    onClick={() =>
                      handleViewClient(
                        client,
                      )
                    }
                    className="h-8 px-3 text-xs"
                  >
                    View Details
                  </GhostButton>
                ),
              },
            ]}
            data={filteredClients}
            onRowClick={(client) =>
              handleViewClient(
                client,
              )
            }
          />

          <SegmentedProgressBar
            title="Client Loyalty Overview"
            segments={
              loyaltyDistribution
            }
          />
        </div>

        {/* Intelligence Side Panel */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="mb-4 flex items-center gap-2 font-heading text-base font-bold text-cream">
              <Gift className="h-4 w-4 text-rose-400" />
              Milestones &
              Birthdays
            </h3>

            <div className="space-y-3">
              {milestones.map(
                (
                  milestone,
                  idx,
                ) => (
                  <div
                    key={`${milestone.name}-${idx}`}
                    className="flex gap-3 rounded-xl border border-white/5 bg-navy-900/50 p-3"
                  >
                    <div className="pt-0.5">
                      <milestone.icon
                        className={`h-4 w-4 ${milestone.color}`}
                      />
                    </div>

                    <div>
                      <div className="mb-0.5 text-xs font-bold text-cream">
                        {
                          milestone.name
                        }
                      </div>

                      <div className="text-[10px] text-ink/60">
                        {
                          milestone.event
                        }
                      </div>

                      <div
                        className={`mt-1 text-[10px] font-medium ${milestone.color}`}
                      >
                        {
                          milestone.date
                        }
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="mb-4 flex items-center gap-2 font-heading text-base font-bold text-cream">
              <Zap className="h-4 w-4 text-gold-400" />
              Relationship
              Actions
            </h3>

            <div className="space-y-3">
              {relationshipRecommendations.map(
                (
                  recommendation,
                  idx,
                ) => (
                  <div
                    key={`${recommendation.type}-${idx}`}
                    className="flex gap-3 rounded-xl border border-white/5 bg-navy-900/50 p-3"
                  >
                    <div className="pt-0.5">
                      <recommendation.icon
                        className={`h-4 w-4 ${recommendation.color}`}
                      />
                    </div>

                    <div>
                      <div className="mb-1 text-xs leading-relaxed text-cream">
                        {
                          recommendation.text
                        }
                      </div>

                      <span className="rounded bg-white/5 px-2 py-0.5 text-[9px] uppercase tracking-wider text-ink/50">
                        {
                          recommendation.type
                        }
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="mb-4 flex items-center gap-2 font-heading text-base font-bold text-cream">
              <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
              VIP Follow-up
              Center
            </h3>

            <div className="mb-3 text-sm text-ink/80">
              VIP classification and
              portfolio-review tracking
              are not stored by the
              current CRM backend.
            </div>

            <GoldButton
              disabled
              className="w-full py-2 text-xs"
            >
              Schedule Reviews
            </GoldButton>
          </div>

          <ActivityTimeline
            title="Client Engagement Calendar"
            items={
              upcomingActivities
            }
          />
        </div>
      </div>

      <ClientDetailModal
        isOpen={!!selectedClient}
        onClose={() =>
          setSelectedClient(null)
        }
        client={
          selectedClient
        }
      />

      <EnterpriseDetailDrawer
        isOpen={!!activeWorkflow}
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
          <div className="rounded-xl border border-white/10 bg-navy-900 p-4">
            <h4 className="mb-2 text-sm font-semibold text-cream">
              Workflow Details
            </h4>

            <p className="text-sm leading-relaxed text-ink/60">
              You are about to
              execute the{' '}
              <strong>
                {
                  activeWorkflow?.type
                }
              </strong>{' '}
              workflow. The current
              Client backend supports
              relationship data derived
              from real Agent inquiries;
              additional CRM workflows
              will be connected as their
              backend services are
              implemented.
            </p>
          </div>

          {activeWorkflow?.data && (
            <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
              <h4 className="mb-4 text-sm font-semibold text-cream">
                Context Data
              </h4>

              <div className="space-y-2 text-sm text-ink/80">
                {Object.entries(
                  activeWorkflow.data,
                ).map(
                  ([
                    key,
                    value,
                  ]) => {
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
                            {
                              value
                            }
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

// Format backend timestamps for human-readable dashboard display.
function formatDateTime(
  dateString?: string,
) {
  if (!dateString) {
    return 'Date unavailable';
  }

  const date =
    new Date(dateString);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return 'Date unavailable';
  }

  return date.toLocaleString(
    'en-NG',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  );
}

// Format a real backend Client value as Nigerian Naira.
function formatCurrency(
  value: number,
) {
  return new Intl.NumberFormat(
    'en-NG',
    {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    },
  ).format(value);
}