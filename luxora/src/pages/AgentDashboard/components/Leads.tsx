import { useEffect, useMemo, useState } from 'react';
import {
  Users,
  UserPlus,
  Phone,
  Search,
  Download,
  Clock,
  TrendingUp,
  AlertCircle,
  Target,
  MessageSquare,
  Zap,
  Activity,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { StatusBadge } from '../../ManagementDashboard/components/shared/StatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { LeadDetailModal } from './modals/LeadDetailModal';

import { agentApi } from '../../../api/agent.api';

// Define the shape of a Lead returned by the Agent Lead API.
interface AgentLead {
  _id: string;

  property?: {
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
    images?: string[];
    coverImage?: string | null;
  } | null;

  agency?: {
    _id?: string;
    name?: string;
    status?: string;
  } | null;

  agent?: string | null;

  owner?: {
    _id?: string;
    fullName?: string;
    email?: string;
  } | null;

  inquirer?: string | null;

  fullName: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  source: string;

  preferredDate?: string | null;
  preferredTime?: string | null;

  // Preserve the real confirmed viewing information returned by the backend.
  scheduledDate?: string | null;
  scheduledTime?: string | null;

  // Preserve the real Lead activity history returned by the backend.
  activities?: Array<{
    action: string;
    description?: string | null;
    performedBy?: string | null;
    createdAt: string;
    _id?: string;
  }>;

  // Preserve the real internal notes returned by the backend.
  notes?: Array<{
    _id?: string;
    text: string;
    addedBy?: string | null;
    addedAt: string;
  }>;

  createdAt: string;
  updatedAt: string;
}

// Define the fields needed by the existing Lead table and modal.
interface DisplayLead extends Record<string, unknown> {
  id: string;
  name: string;
  property: string;
  source: string;
  status: string;
  date: string;
  score: number | null;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  preferredDate: string | null;
  preferredTime: string | null;

  // Keep confirmed viewing information available to the modal.
  scheduledDate: string | null;
  scheduledTime: string | null;

  // Keep real activity and note information available to the modal.
  activities: AgentLead['activities'];
  notes: AgentLead['notes'];

  agencyName: string;
  ownerName: string;

  // Preserve the populated backend entities for future modal/detail use.
  propertyData: AgentLead['property'];
  agencyData: AgentLead['agency'];
  ownerData: AgentLead['owner'];
}

export default function Leads() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] =
    useState<DisplayLead | null>(null);

  // Store the real Leads returned by the backend.
  const [leads, setLeads] = useState<AgentLead[]>([]);

  // Track the loading state while Leads are being retrieved.
  const [isLoading, setIsLoading] = useState(true);

  // Track a backend/API error so the page does not silently show empty data.
  const [errorMessage, setErrorMessage] =
    useState('');

  // Load the authenticated Agent's real Leads from the backend.
  useEffect(() => {
    const loadLeads = async () => {
      try {
        // Start the loading state and clear any previous error.
        setIsLoading(true);
        setErrorMessage('');

        // The authenticated user's token determines which Agent's Leads are returned.
        const response =
          await agentApi.getMyLeads();

        // The shared HTTP client unwraps the API envelope.
        setLeads(
          response?.inquiries || [],
        );
      } catch (error) {
        // Keep the existing dashboard visible while reporting the actual API failure.
        console.error(
          'Failed to load Agent Leads:',
          error,
        );

        setErrorMessage(
          'Unable to load your Leads right now. Please refresh and try again.',
        );

        setLeads([]);
      } finally {
        // Stop the loading state whether the request succeeds or fails.
        setIsLoading(false);
      }
    };

    loadLeads();
  }, []);

  // Convert backend Lead records into the shape used by the existing dashboard UI.
  const displayLeads =
    useMemo<DisplayLead[]>(() => {
      return leads.map((lead) => ({
        id: lead._id,

        name: lead.fullName,

        property:
          lead.property?.title ||
          'Property unavailable',

        source:
          lead.source ||
          'Unknown',

        status:
          lead.status ||
          'New',

        date: formatDateTime(
          lead.createdAt,
        ),

        // The current backend does not provide a Lead score.
        score: null,

        email: lead.email,

        phone: lead.phone,

        message: lead.message,

        createdAt:
          lead.createdAt,

        preferredDate:
          lead.preferredDate ||
          null,

        preferredTime:
          lead.preferredTime ||
          null,

        // Preserve the actual confirmed viewing details.
        scheduledDate:
          lead.scheduledDate ||
          null,

        scheduledTime:
          lead.scheduledTime ||
          null,

        // Preserve the actual backend activity history.
        activities:
          lead.activities ||
          [],

        // Preserve the actual backend internal notes.
        notes:
          lead.notes ||
          [],

        agencyName:
          lead.agency?.name ||
          'Agency unavailable',

        ownerName:
          lead.owner?.fullName ||
          'Owner unavailable',

        // Preserve the populated backend entities.
        propertyData:
          lead.property ||
          null,

        agencyData:
          lead.agency ||
          null,

        ownerData:
          lead.owner ||
          null,
      }));
    }, [leads]);

  // Filter the real Leads using the existing search box.
  const filteredLeads = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    if (!query) {
      return displayLeads;
    }

    return displayLeads.filter(
      (lead) =>
        lead.name
          .toLowerCase()
          .includes(query) ||
        lead.property
          .toLowerCase()
          .includes(query) ||
        lead.email
          .toLowerCase()
          .includes(query) ||
        lead.status
          .toLowerCase()
          .includes(query),
    );
  }, [
    displayLeads,
    searchQuery,
  ]);

  // Count active Leads from the actual backend status values.
  const activeLeadCount =
    useMemo(() => {
      return leads.filter(
        (lead) =>
          ![
            'Closed',
            'Lost',
          ].includes(
            lead.status,
          ),
      ).length;
    }, [leads]);

  // Count Leads created during the last 24 hours.
  const newLeads24h =
    useMemo(() => {
      const now = Date.now();

      const twentyFourHoursAgo =
        now -
        24 *
          60 *
          60 *
          1000;

      return leads.filter(
        (lead) =>
          new Date(
            lead.createdAt,
          ).getTime() >=
          twentyFourHoursAgo,
      ).length;
    }, [leads]);

  // Count Leads by their actual backend pipeline status.
  const statusCounts =
    useMemo(() => {
      return leads.reduce<
        Record<string, number>
      >((counts, lead) => {
        const status =
          lead.status ||
          'New';

        counts[status] =
          (counts[status] || 0) +
          1;

        return counts;
      }, {});
    }, [leads]);

  // Work out how many Leads currently need attention based on their real status.
  const attentionLeadCount =
    useMemo(() => {
      return leads.filter(
        (lead) =>
          lead.status ===
            'New' ||
          lead.status ===
            'Contacted',
      ).length;
    }, [leads]);

  // Keep the conversion board real by using the backend's actual pipeline statuses.
  const conversionOpportunities =
    useMemo(() => {
      return [
        {
          label: 'New',
          value:
            statusCounts.New ||
            0,
          color:
            'bg-blue-400',
        },
        {
          label: 'Contacted',
          value:
            statusCounts.Contacted ||
            0,
          color:
            'bg-gold-400',
        },
        {
          label:
            'Viewing Scheduled',
          value:
            statusCounts[
              'Viewing Scheduled'
            ] || 0,
          color:
            'bg-emerald-400',
        },
        {
          label: 'Negotiating',
          value:
            statusCounts.Negotiating ||
            0,
          color:
            'bg-purple-400',
        },
        {
          label: 'Closed',
          value:
            statusCounts.Closed ||
            0,
          color:
            'bg-green-400',
        },
        {
          label: 'Lost',
          value:
            statusCounts.Lost ||
            0,
          color:
            'bg-rose-400',
        },
      ];
    }, [statusCounts]);

  // Build a real follow-up queue from Leads that are still at the early pipeline stages.
  const followUpQueue =
    useMemo(() => {
      return displayLeads
        .filter(
          (lead) =>
            lead.status ===
              'New' ||
            lead.status ===
              'Contacted',
        )
        .slice(0, 5)
        .map((lead) => ({
          name: lead.name,

          action:
            lead.status ===
            'New'
              ? 'Make initial contact'
              : 'Continue Lead follow-up',

          priority:
            lead.status ===
            'New'
              ? 'High'
              : 'Medium',

          icon:
            lead.status ===
            'New'
              ? Phone
              : MessageSquare,
        }));
    }, [displayLeads]);

  // Build next-best actions from actual Lead pipeline records.
  const nextBestActions =
    useMemo(() => {
      const actions: {
        title: string;
        desc: string;
        icon: typeof Zap;
        color: string;
      }[] = [];

      const newLead =
        displayLeads.find(
          (lead) =>
            lead.status ===
            'New',
        );

      const contactedLead =
        displayLeads.find(
          (lead) =>
            lead.status ===
            'Contacted',
        );

      if (newLead) {
        actions.push({
          title: `Follow up ${newLead.name}`,

          desc: `This Lead is still marked New for ${newLead.property}.`,

          icon: Phone,

          color:
            'text-rose-400',
        });
      }

      if (contactedLead) {
        actions.push({
          title: `Continue ${contactedLead.name}`,

          desc: `${contactedLead.property} is currently in the Contacted stage.`,

          icon:
            MessageSquare,

          color:
            'text-emerald-400',
        });
      }

      if (
        actions.length ===
        0
      ) {
        actions.push({
          title:
            'No immediate Lead action detected',

          desc:
            'Your current Leads do not contain a New or Contacted record.',

          icon:
            CheckCircle2,

          color:
            'text-emerald-400',
        });
      }

      return actions.slice(
        0,
        2,
      );
    }, [displayLeads]);

  // Turn recent real Lead activity into the existing activity timeline.
  const leadActivityCalendar =
    useMemo(() => {
      return [
        ...displayLeads,
      ]
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
            `${lead.name} — ${lead.property}`,

          time:
            formatDateTime(
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
              : lead.status ===
                  'Contacted'
                ? 'text-emerald-400'
                : 'text-gold-400',
        }));
    }, [displayLeads]);

  // Calculate the percentage of Leads that are currently Contacted.
  const contactedPercentage =
    useMemo(() => {
      if (!leads.length) {
        return 0;
      }

      return Math.round(
        ((statusCounts.Contacted ||
          0) /
          leads.length) *
          100,
      );
    }, [
      leads.length,
      statusCounts,
    ]);

  // Calculate the percentage of Leads that have progressed beyond Contacted.
  const progressedPercentage =
    useMemo(() => {
      if (!leads.length) {
        return 0;
      }

      const progressed =
        (statusCounts[
          'Viewing Scheduled'
        ] || 0) +
        (statusCounts.Negotiating ||
          0) +
        (statusCounts.Closed ||
          0);

      return Math.round(
        (progressed /
          leads.length) *
          100,
      );
    }, [
      leads.length,
      statusCounts,
    ]);

  // Open the existing Lead detail modal.
  const handleViewLead =
    (lead: DisplayLead) => {
      setSelectedLead(
        lead,
      );
    };

  // Replace the updated Lead inside the parent state after a successful modal action.
  const handleLeadUpdated =
    (
      updatedLead: Record<
        string,
        unknown
      >,
    ) => {
      // Resolve the MongoDB Lead ID from the updated backend response.
      const updatedLeadId =
        String(
          updatedLead._id ||
            updatedLead.id ||
            '',
        );

      if (!updatedLeadId) {
        return;
      }

      // Replace only the affected Lead in the real backend state.
      setLeads(
        (
          currentLeads,
        ) =>
          currentLeads.map(
            (
              existingLead,
            ) =>
              existingLead._id ===
              updatedLeadId
                ? {
                    ...existingLead,
                    ...(updatedLead as AgentLead),
                  }
                : existingLead,
          ),
      );

      // Keep the selected modal Lead synchronized with the backend response.
      setSelectedLead(
        (
          currentSelectedLead,
        ) => {
          if (
            !currentSelectedLead
          ) {
            return currentSelectedLead;
          }

          return {
            ...currentSelectedLead,
            ...mapUpdatedLeadForDisplay(
              updatedLead as AgentLead,
            ),
          };
        },
      );
    };

  // Export the currently loaded real Leads to CSV directly from the browser.
  const handleExportCsv =
    () => {
      if (
        !displayLeads.length
      ) {
        return;
      }

      const headers = [
        'Lead ID',
        'Lead Name',
        'Email',
        'Phone',
        'Property',
        'Source',
        'Status',
        'Message',
        'Created At',
      ];

      const rows =
        displayLeads.map(
          (lead) => [
            lead.id,
            lead.name,
            lead.email,
            lead.phone,
            lead.property,
            lead.source,
            lead.status,
            lead.message,
            lead.createdAt,
          ],
        );

      // Escape CSV values so commas and quotes inside user data remain valid.
      const csv = [
        headers,
        ...rows,
      ]
        .map((row) =>
          row
            .map(
              (
                value,
              ) =>
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

      // Create a temporary downloadable CSV file from the actual loaded data.
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

      link.download = `agent-leads-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

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

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        name="Lead Workflow Intelligence"
        subtitle="Automate follow-ups, prioritize high-value prospects, and boost conversion rates."
        actions={
          <div className="flex gap-3">
            <GhostButton
              onClick={
                handleExportCsv
              }
              disabled={
                !displayLeads.length
              }
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </GhostButton>

            {/* Keep Add Lead visible until the dedicated Lead creation workflow is implemented. */}
            <GoldButton
              className="flex items-center gap-2"
              disabled
              title="Lead creation endpoint is not implemented yet"
            >
              <UserPlus className="h-4 w-4" />
              Add Lead
            </GoldButton>
          </div>
        }
      />

      {/* INTELLIGENCE HEADER: ACTION SUMMARY */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-center h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-400/20 rounded-xl">
              <Zap className="h-6 w-6 text-rose-400" />
            </div>

            <h4 className="font-bold text-cream text-lg">
              Pipeline Action Summary
            </h4>
          </div>

          {isLoading ? (
            <p className="text-sm text-ink/80 leading-relaxed">
              Loading your Lead
              pipeline...
            </p>
          ) : (
            <>
              <p className="text-sm text-ink/80 leading-relaxed mb-4">
                You currently have{' '}
                <strong className="text-rose-400">
                  {
                    attentionLeadCount
                  }{' '}
                  Lead
                  {attentionLeadCount ===
                  1
                    ? ''
                    : 's'}
                </strong>{' '}
                in the New or
                Contacted stages
                requiring active
                follow-up. Your
                pipeline currently
                contains{' '}
                <strong className="text-emerald-400">
                  {
                    activeLeadCount
                  }{' '}
                  active Lead
                  {activeLeadCount ===
                  1
                    ? ''
                    : 's'}
                </strong>
                .
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div>
                  <div className="text-xs text-ink/60 mb-1">
                    Active Leads
                  </div>

                  <div className="text-lg font-bold text-emerald-400">
                    {
                      activeLeadCount
                    }
                  </div>
                </div>

                <div>
                  <div className="text-xs text-ink/60 mb-1">
                    New Leads
                  </div>

                  <div className="text-lg font-bold text-blue-400">
                    {newLeads24h}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-ink/60 mb-1">
                    Follow-up Queue
                  </div>

                  <div className="text-lg font-bold text-rose-400">
                    {
                      attentionLeadCount
                    }
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink/60 mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-400" />
              Lead Priority Matrix
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">
                    New Leads
                  </span>

                  <span className="text-rose-400">
                    {
                      statusCounts.New ||
                      0
                    }
                  </span>
                </div>

                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-400 rounded-full"
                    style={{
                      width: `${
                        leads.length
                          ? ((statusCounts.New ||
                              0) /
                              leads.length) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">
                    Contacted Leads
                  </span>

                  <span className="text-gold-400">
                    {
                      statusCounts.Contacted ||
                      0
                    }
                  </span>
                </div>

                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-400 rounded-full"
                    style={{
                      width: `${
                        leads.length
                          ? ((statusCounts.Contacted ||
                              0) /
                              leads.length) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-cream font-medium">
                    Progressed Leads
                  </span>

                  <span className="text-blue-400">
                    {(statusCounts[
                      'Viewing Scheduled'
                    ] || 0) +
                      (statusCounts.Negotiating ||
                        0)}
                  </span>
                </div>

                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-full"
                    style={{
                      width: `${progressedPercentage}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
          <h3 className="text-sm font-semibold text-ink/60 mb-4 text-center">
            Follow-up Success
            Tracker
          </h3>

          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">
                Contacted
              </span>

              <span className="text-sm font-medium text-emerald-400">
                {
                  contactedPercentage
                }
                %
              </span>
            </div>

            <div className="w-full bg-white/5 rounded-full h-1.5">
              <div
                className="bg-emerald-400 h-1.5 rounded-full"
                style={{
                  width: `${contactedPercentage}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">
                Meeting/Deal
                Progress
              </span>

              <span className="text-sm font-medium text-blue-400">
                {
                  progressedPercentage
                }
                %
              </span>
            </div>

            <div className="w-full bg-white/5 rounded-full h-1.5">
              <div
                className="bg-blue-400 h-1.5 rounded-full"
                style={{
                  width: `${progressedPercentage}%`,
                }}
              />
            </div>

            <p className="text-[10px] text-ink/40 text-center pt-1">
              Calculated from
              current Lead
              statuses. Response
              time analytics now
              use the recorded
              first-contact
              timestamp when the
              analytics layer is
              added.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Active Leads"
          value={
            isLoading
              ? '...'
              : String(
                  activeLeadCount,
                )
          }
          trend={
            isLoading
              ? 'Loading...'
              : `${newLeads24h} new in the last 24h`
          }
          trendColor="text-emerald-400"
          icon={Users}
        />

        <KPICard
          title="New Leads (24h)"
          value={
            isLoading
              ? '...'
              : String(
                  newLeads24h,
                )
          }
          trend={`${attentionLeadCount} require active follow-up`}
          trendColor="text-rose-400"
          icon={AlertCircle}
        />

        <KPICard
          title="Avg. Lead Score"
          value="—"
          trend="Lead scoring backend pending"
          trendColor="text-ink/50"
          icon={TrendingUp}
        />

        <KPICard
          title="Avg Response Time"
          value="—"
          trend="Analytics calculation pending"
          trendColor="text-ink/50"
          icon={Clock}
        />
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Table Area */}
        <div className="lg:col-span-3 space-y-6">
          {errorMessage && (
            <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
              {errorMessage}
            </div>
          )}

          <DataTableToolbar
            searchValue={
              searchQuery
            }
            onSearchChange={
              setSearchQuery
            }
            searchPlaceholder="Search leads by name or property..."
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
                  'Lead Name',

                render: (
                  lead: Record<
                    string,
                    unknown
                  >,
                ) => (
                  <div>
                    <div className="font-semibold text-cream">
                      {
                        lead.name as string
                      }
                    </div>

                    <div className="text-[10px] text-ink/50 mt-1">
                      {
                        lead.email as string
                      }
                    </div>
                  </div>
                ),
              },

              {
                header:
                  'Interested In',

                render: (
                  lead: Record<
                    string,
                    unknown
                  >,
                ) => (
                  <div className="text-sm text-ink/80 flex items-center gap-1.5">
                    <Search className="h-3 w-3 text-gold-400" />

                    {
                      lead.property as string
                    }
                  </div>
                ),
              },

              {
                header:
                  'Source / Date',

                render: (
                  lead: Record<
                    string,
                    unknown
                  >,
                ) => (
                  <div>
                    <div className="text-sm text-cream">
                      {
                        lead.source as string
                      }
                    </div>

                    <div className="text-[10px] text-ink/50 mt-0.5">
                      {
                        lead.date as string
                      }
                    </div>
                  </div>
                ),
              },

              {
                header:
                  'Lead Score',

                render: (
                  lead: Record<
                    string,
                    unknown
                  >,
                ) => {
                  const score =
                    lead.score as
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
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-ink/60">
                              Score
                            </span>

                            <span className="text-cream">
                              {score}
                            </span>
                          </div>

                          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className={`h-full ${
                                score >=
                                80
                                  ? 'bg-emerald-400'
                                  : score >=
                                      50
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
                  lead: Record<
                    string,
                    unknown
                  >,
                ) => (
                  <StatusBadge
                    status={
                      lead.status as string
                    }
                  />
                ),
              },

              {
                header:
                  'Actions',

                render: (
                  lead: Record<
                    string,
                    unknown
                  >,
                ) => (
                  <GhostButton
                    onClick={() =>
                      handleViewLead(
                        lead as DisplayLead,
                      )
                    }
                    className="h-8 px-3 text-xs"
                  >
                    View Details
                  </GhostButton>
                ),
              },
            ]}
            data={
              filteredLeads
            }
            onRowClick={(
              lead,
            ) =>
              handleViewLead(
                lead as DisplayLead,
              )
            }
          />

          <SegmentedProgressBar
            title="Conversion Opportunity Board"
            segments={
              conversionOpportunities
            }
          />
        </div>

        {/* Intelligence Side Panel */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-rose-400" />
              Smart Follow-up
              Queue
            </h3>

            <div className="space-y-3">
              {followUpQueue.length >
              0 ? (
                followUpQueue.map(
                  (
                    item,
                    idx,
                  ) => (
                    <div
                      key={`${item.name}-${idx}`}
                      className="bg-navy-900/50 p-3 rounded-xl border border-white/5"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm font-bold text-cream">
                          {
                            item.name
                          }
                        </div>

                        <div
                          className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider ${
                            item.priority ===
                            'High'
                              ? 'bg-rose-400/10 text-rose-400'
                              : 'bg-blue-400/10 text-blue-400'
                          }`}
                        >
                          {
                            item.priority
                          }
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-ink/80">
                        <item.icon className="h-3.5 w-3.5 text-gold-400" />

                        {
                          item.action
                        }
                      </div>

                      <div className="text-[10px] text-ink/50 mt-2">
                        Follow-up due
                        scheduling
                        backend is
                        next.
                      </div>
                    </div>
                  ),
                )
              ) : (
                <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4 text-xs text-ink/50">
                  No New or
                  Contacted Leads
                  currently require
                  a follow-up
                  action.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-gold-400" />
              Next Best Action
            </h3>

            <div className="space-y-3">
              {nextBestActions.map(
                (
                  action,
                  idx,
                ) => (
                  <div
                    key={`${action.title}-${idx}`}
                    className="flex gap-3 bg-navy-900/50 p-3 rounded-xl border border-white/5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="pt-0.5">
                      <action.icon
                        className={`h-4 w-4 ${action.color}`}
                      />
                    </div>

                    <div>
                      <div className="text-xs font-bold text-cream mb-1">
                        {
                          action.title
                        }
                      </div>

                      <div className="text-[10px] text-ink/60 leading-relaxed">
                        {
                          action.desc
                        }
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-base font-bold text-cream mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Daily Contact
              Planner
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gold-400" />

                <div>
                  <div className="text-xs font-medium text-cream">
                    Call planning
                  </div>

                  <div className="text-[10px] text-ink/50 mt-1">
                    Daily call
                    scheduling
                    backend is not
                    implemented yet.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-blue-400" />

                <div>
                  <div className="text-xs font-medium text-cream">
                    Message planning
                  </div>

                  <div className="text-[10px] text-ink/50 mt-1">
                    Contact activity
                    tracking will use
                    the Lead activity
                    history.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-emerald-400" />

                <div>
                  <div className="text-xs font-medium text-cream">
                    Viewing schedule
                  </div>

                  <div className="text-[10px] text-ink/50 mt-1">
                    Confirmed viewing
                    dates are now
                    stored by the
                    backend.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ActivityTimeline
            title="Lead Activity Calendar"
            items={
              leadActivityCalendar
            }
          />
        </div>
      </div>

      <LeadDetailModal
        isOpen={!!selectedLead}
        onClose={() =>
          setSelectedLead(
            null,
          )
        }
        lead={selectedLead}
        onLeadUpdated={
          handleLeadUpdated
        }
      />
    </div>
  );
}

// Convert an updated backend Lead into the table/modal display shape.
function mapUpdatedLeadForDisplay(
  lead: AgentLead,
): DisplayLead {
  return {
    id: lead._id,

    name: lead.fullName,

    property:
      lead.property?.title ||
      'Property unavailable',

    source:
      lead.source ||
      'Unknown',

    status:
      lead.status ||
      'New',

    date: formatDateTime(
      lead.createdAt,
    ),

    score: null,

    email: lead.email,

    phone: lead.phone,

    message: lead.message,

    createdAt:
      lead.createdAt,

    preferredDate:
      lead.preferredDate ||
      null,

    preferredTime:
      lead.preferredTime ||
      null,

    // Preserve the confirmed viewing data returned by the backend.
    scheduledDate:
      lead.scheduledDate ||
      null,

    scheduledTime:
      lead.scheduledTime ||
      null,

    // Preserve the backend activity history.
    activities:
      lead.activities ||
      [],

    // Preserve the backend internal notes.
    notes:
      lead.notes ||
      [],

    agencyName:
      lead.agency?.name ||
      'Agency unavailable',

    ownerName:
      lead.owner?.fullName ||
      'Owner unavailable',

    propertyData:
      lead.property ||
      null,

    agencyData:
      lead.agency ||
      null,

    ownerData:
      lead.owner ||
      null,
  };
}

// Format backend ISO timestamps for the existing dashboard display.
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