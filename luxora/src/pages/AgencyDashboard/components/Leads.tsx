import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Filter,
  Plus,
  Calendar,
  Clock,
  UserCircle,
  MessageSquare,
  Zap,
  Activity,
  Building2,
  CheckCircle2,
  X,
  MessageCircle,
  Loader2,
} from 'lucide-react';

import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';

import { useSession } from '../../../contexts/SessionContext';
import { useToast } from '../../../contexts/ToastContext';

import { conversationApi } from '../../../api/conversation.api';
import { messageApi } from '../../../api/message.api';
import { propertyApi } from '../../../api/property.api';

import { ROUTES } from '../../../constants/routes';

import type { AgencyLead } from '../../../types/agency';

const getLeadInitials = (name: string) => {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return 'L';
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

export default function Leads() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    isAuthLoading,
  } = useSession();

  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] =
    useState('');

  const [leadStatus, setLeadStatus] =
    useState<
      | 'All'
      | 'New'
      | 'Contacted'
      | 'Viewing Scheduled'
      | 'Negotiating'
      | 'Closed'
      | 'Lost'
    >('All');

  const [selectedLead, setSelectedLead] =
    useState<AgencyLead | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] =
    useState(false);

  // Store the real Inquiry records returned for this Agency.
  const [
    agencyInquiries,
    setAgencyInquiries,
  ] = useState<any[]>([]);

  // Track the Lead page loading state.
  const [
    isLoadingLeads,
    setIsLoadingLeads,
  ] = useState(true);

  // Message modal state.
  const [
    messageModalOpen,
    setMessageModalOpen,
  ] = useState(false);

  const [
    messageLead,
    setMessageLead,
  ] = useState<AgencyLead | null>(null);

  const [
    messageText,
    setMessageText,
  ] = useState('');

  const [
    messageSuccess,
    setMessageSuccess,
  ] = useState(false);

  const [
    messageError,
    setMessageError,
  ] = useState<string | null>(null);

  const [
    isMessaging,
    setIsMessaging,
  ] = useState(false);

  // Load the Agency's real inquiries when the Leads page opens.
  useEffect(() => {
    const fetchAgencyInquiries =
      async () => {
        try {
          setIsLoadingLeads(true);

          const response =
            await propertyApi.getAgencyInquiries();

          const rawResponse =
            response as any;

          // Support both the unwrapped API response
          // and the Axios response shape.
          const inquiries =
            Array.isArray(
              rawResponse?.inquiries,
            )
              ? rawResponse.inquiries
              : Array.isArray(
                rawResponse?.data?.inquiries,
              )
                ? rawResponse.data.inquiries
                : [];

          setAgencyInquiries(
            inquiries,
          );
        } catch (error) {
          console.error(
            'Failed to load Agency inquiries:',
            error,
          );

          setAgencyInquiries([]);
        } finally {
          setIsLoadingLeads(false);
        }
      };

    void fetchAgencyInquiries();
  }, []);

  // Convert backend Inquiry records into
  // the shape expected by this UI.
  const leads: AgencyLead[] =
    agencyInquiries.map(
      (inquiry) => ({
        id: String(
          inquiry._id,
        ),

        // Preserve the authenticated User
        // reference when one exists.
        inquirerId:
          inquiry.inquirer
            ? String(
              inquiry.inquirer,
            )
            : null,

        name: String(
          inquiry.fullName ||
          'Unknown Lead',
        ),

        email: String(
          inquiry.email || '',
        ),

        phone: String(
          inquiry.phone || '',
        ),

        interest: String(
          inquiry.property?.title ||
          'Property Inquiry',
        ),

        // Existing AgencyLead type uses "budget",
        // but this is the real property price.
        budget: inquiry.property?.price
          ? `₦${Number(
            inquiry.property.price,
          ).toLocaleString()}`
          : 'Not provided',

        status: String(
          inquiry.status || 'New',
        ),

                score:
          typeof inquiry.score === 'number'
            ? inquiry.score
            : 0,

        agent: String(
          inquiry.agent?.fullName ||
          'Unassigned',
        ),

        source: String(
          inquiry.source ||
          'Website',
        ),

        age: inquiry.createdAt
          ? Math.max(
            0,
            Math.floor(
              (Date.now() -
                new Date(
                  inquiry.createdAt,
                ).getTime()) /
              (1000 *
                60 *
                60 *
                24),
            ),
          )
          : 0,

        lastContact:
          inquiry.updatedAt
            ? new Date(
              inquiry.updatedAt,
            ).toLocaleString()
            : 'Never',
      }),
    );

  // Calculate inquiries created in the last seven days.
  const newLeadsLast7Days =
    agencyInquiries.filter(
      (inquiry) => {
        if (!inquiry.createdAt) {
          return false;
        }

        const createdAt =
          new Date(
            inquiry.createdAt,
          ).getTime();

        const sevenDaysAgo =
          Date.now() -
          7 *
          24 *
          60 *
          60 *
          1000;

        return (
          createdAt >=
          sevenDaysAgo
        );
      },
    ).length;

  // Pipeline counts.
  const newInquiryCount =
    agencyInquiries.filter(
      (inquiry) =>
        inquiry.status === 'New',
    ).length;

  const contactedCount =
    agencyInquiries.filter(
      (inquiry) =>
        inquiry.status ===
        'Contacted',
    ).length;

  const viewingScheduledCount =
    agencyInquiries.filter(
      (inquiry) =>
        inquiry.status ===
        'Viewing Scheduled',
    ).length;

  const negotiatingCount =
    agencyInquiries.filter(
      (inquiry) =>
        inquiry.status ===
        'Negotiating',
    ).length;

  const closedCount =
    agencyInquiries.filter(
      (inquiry) =>
        inquiry.status ===
        'Closed',
    ).length;

  const conversionRate =
    agencyInquiries.length > 0
      ? (closedCount /
        agencyInquiries.length) *
      100
      : 0;

  // Lead source counts.
  const websiteCount =
    agencyInquiries.filter(
      (inquiry) =>
        inquiry.source ===
        'Website',
    ).length;

  const contactAgentCount =
    agencyInquiries.filter(
      (inquiry) =>
        inquiry.source ===
        'Contact Agent',
    ).length;

  const scheduleViewingCount =
    agencyInquiries.filter(
      (inquiry) =>
        inquiry.source ===
        'Schedule Viewing',
    ).length;

  const totalSourceCount =
    websiteCount +
    contactAgentCount +
    scheduleViewingCount;

  const websitePercentage =
    totalSourceCount > 0
      ? (websiteCount /
        totalSourceCount) *
      100
      : 0;

  const contactAgentPercentage =
    totalSourceCount > 0
      ? (contactAgentCount /
        totalSourceCount) *
      100
      : 0;

  const scheduleViewingPercentage =
    totalSourceCount > 0
      ? (scheduleViewingCount /
        totalSourceCount) *
      100
      : 0;

  const filteredLeads =
    leads.filter((lead) => {
      const matchesSearch =
        lead.name
          .toLowerCase()
          .includes(
            searchQuery.toLowerCase(),
          ) ||
        lead.interest
          .toLowerCase()
          .includes(
            searchQuery.toLowerCase(),
          );

      const matchesStatus =
        leadStatus === 'All' ||
        lead.status ===
        leadStatus;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // Close the message modal and reset its state.
  const closeMessageModal = () => {
    if (isMessaging) {
      return;
    }

    setMessageModalOpen(false);
    setMessageLead(null);
    setMessageText('');
    setMessageSuccess(false);
    setMessageError(null);
  };

  // Open the inline message composer.
  const openMessageModal = (
    lead: AgencyLead,
  ) => {
    if (isAuthLoading) {
      return;
    }

    if (
      !isAuthenticated ||
      !user
    ) {
      navigate(ROUTES.LOGIN);
      return;
    }

    // Anonymous Inquiry — no User account
    // exists to receive a direct message.
    if (!lead.inquirerId) {
      showToast({
        type: 'error',
        title:
          'Messaging unavailable',
        description:
          'This lead is not linked to a Luxora user account.',
      });

      return;
    }

    // Prevent messaging yourself.
    if (
      String(
        lead.inquirerId,
      ) ===
      String(user.id)
    ) {
      return;
    }

    // Close the Lead drawer before
    // opening the message modal.
    setIsDrawerOpen(false);
    setSelectedLead(null);

    setMessageLead(lead);
    setMessageText('');
    setMessageSuccess(false);
    setMessageError(null);
    setMessageModalOpen(true);
  };

  // Keep the Lead drawer action wired to the existing real message composer.
const handleMessageLead = openMessageModal;

  // Send the message using the real
  // Conversation + Message APIs.
  const handleMessageSubmit =
    async (
      event: React.FormEvent,
    ) => {
      event.preventDefault();

      if (
        isMessaging ||
        messageSuccess
      ) {
        return;
      }

      if (!messageLead) {
        return;
      }

      if (
        !messageLead.inquirerId
      ) {
        const errorMessage =
          'This lead does not have a messaging account.';

        setMessageError(
          errorMessage,
        );

        showToast({
          type: 'error',
          title:
            'Messaging unavailable',
          description:
            errorMessage,
        });

        return;
      }

      if (
        !isAuthenticated ||
        !user
      ) {
        closeMessageModal();
        navigate(ROUTES.LOGIN);
        return;
      }

      if (
        String(
          messageLead.inquirerId,
        ) ===
        String(user.id)
      ) {
        closeMessageModal();
        return;
      }

      const body =
        messageText.trim();

      if (!body) {
        const errorMessage =
          'Please enter a message.';

        setMessageError(
          errorMessage,
        );

        showToast({
          type: 'error',
          title:
            'Message is empty',
          description:
            errorMessage,
        });

        return;
      }

      setIsMessaging(true);
      setMessageError(null);

      try {
        // Create or reuse the direct conversation.
        const conversationResponse =
          await conversationApi.createConversation(
            {
              type: 'direct',
              targetUserId:
                messageLead.inquirerId,
            },
          );

        const conversationId =
          conversationResponse
            ?.conversation?._id ??
          conversationResponse
            ?.conversation?.id ??
          conversationResponse
            ?.data
            ?.conversation?._id ??
          conversationResponse
            ?.data
            ?.conversation?.id;

        if (!conversationId) {
          throw new Error(
            'The server did not return a conversation.',
          );
        }

        // Send the actual message.
        await messageApi.sendMessage(
          String(
            conversationId,
          ),
          body,
        );

        setMessageSuccess(true);
        setMessageError(null);

        showToast({
          type: 'success',
          title:
            'Message sent',
          description: `Your message was sent to ${messageLead.name}.`,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Unable to send your message. Please try again.';

        setMessageError(
          errorMessage,
        );

        showToast({
          type: 'error',
          title:
            'Message not sent',
          description:
            errorMessage,
        });
      } finally {
        setIsMessaging(false);
      }
    };

  // Open Lead details drawer.
  const handleViewLead = (
    lead: AgencyLead,
  ) => {
    setSelectedLead(lead);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Lead Management"
        subtitle="Track incoming inquiries, assign agents, and monitor conversion pipelines."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Follow-ups
            </GhostButton>

            <GoldButton className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Lead
            </GoldButton>
          </div>
        }
      />

      {isLoadingLeads ? (
        <div className="flex min-h-[520px] items-center justify-center rounded-2xl border border-white/10 bg-navy-800/50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-gold-400" />

            <div className="text-center">
              <p className="font-medium text-cream">
                Loading leads...
              </p>

              <p className="mt-1 text-sm text-ink/50">
                Fetching the Agency's latest inquiries.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Real Lead performance metrics */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="New Leads (7d)"
              value={String(
                newLeadsLast7Days,
              )}
              trend="Real inquiries received in the last 7 days"
              trendColor="text-emerald-400"
              icon={Zap}
            />

            <KPICard
              title="Active Pipeline"
              value={String(
                contactedCount +
                viewingScheduledCount +
                negotiatingCount,
              )}
              trend={`${contactedCount} contacted • ${viewingScheduledCount} viewing • ${negotiatingCount} negotiating`}
              trendColor="text-blue-400"
              icon={Target}
            />

            <KPICard
              title="Response Time"
              value="—"
              trend="Response-time tracking not available yet"
              trendColor="text-ink/50"
              icon={Clock}
            />

            <KPICard
              title="Conversion Rate"
              value={`${conversionRate.toFixed(
                1,
              )}%`}
              trend={`${closedCount} closed of ${agencyInquiries.length} total inquiries`}
              trendColor="text-gold-400"
              icon={CheckCircle2}
            />
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Lead Table */}
            <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
              <DataTableToolbar
                searchValue={searchQuery}
                onSearchChange={
                  setSearchQuery
                }
                searchPlaceholder="Search leads by name or interest..."
                actions={
                  <div className="flex gap-2">
                    <select
                      className="bg-navy-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold-400"
                      value={
                        leadStatus
                      }
                      onChange={(e) =>
                        setLeadStatus(
                          e.target.value as
                          | 'All'
                          | 'New'
                          | 'Contacted'
                          | 'Viewing Scheduled'
                          | 'Negotiating'
                          | 'Closed'
                          | 'Lost',
                        )
                      }
                    >
                      <option value="All">
                        All Statuses
                      </option>

                      <option value="New">
                        New
                      </option>

                      <option value="Contacted">
                        Contacted
                      </option>

                      <option value="Viewing Scheduled">
                        Viewing Scheduled
                      </option>

                      <option value="Negotiating">
                        Negotiating
                      </option>

                      <option value="Closed">
                        Closed
                      </option>

                      <option value="Lost">
                        Lost
                      </option>
                    </select>

                    <GhostButton className="px-3 flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </GhostButton>
                  </div>
                }
              />

              <div className="flex-1 mt-6">
                <DataTable
                  data={
                    filteredLeads
                  }
                  keyExtractor={(
                    lead,
                  ) =>
                    String(
                      lead.id,
                    )
                  }
                  columns={[
                    {
                      header:
                        'Lead Info',

                      render: (
                        lead,
                      ) => (
                        <div>
                          <div
                            className="font-semibold text-cream hover:text-gold-400 cursor-pointer transition-colors"
                            onClick={() =>
                              handleViewLead(
                                lead,
                              )
                            }
                          >
                            {String(
                              lead.name,
                            )}
                          </div>

                          <div className="text-xs text-ink/60 mt-0.5">
                            {String(
                              lead.email,
                            )}
                          </div>
                        </div>
                      ),
                    },

                    {
                      header:
                        'Interest',

                      render: (
                        lead,
                      ) => (
                        <div>
                          <div className="text-sm text-cream flex items-center gap-1">
                            <Building2 className="h-3 w-3" />

                            {String(
                              lead.interest,
                            )}
                          </div>

                          <div className="text-xs text-ink/60 mt-0.5">
                            {String(
                              lead.budget,
                            )}
                          </div>
                        </div>
                      ),
                    },

                    {
                      header:
                        'Status',

                      render: (
                        lead,
                      ) => (
                        <EnterpriseStatusBadge
                          status={String(
                            lead.status,
                          )}
                        />
                      ),
                    },

                    {
                      header:
                        'Agent',

                      render: (
                        lead,
                      ) => (
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${lead.agent ===
                                'Unassigned'
                                ? 'bg-navy-900 text-ink/40 border border-white/5'
                                : 'bg-navy-900 text-cream border border-gold-400/30'
                              }`}
                          >
                            {lead.agent ===
                              'Unassigned'
                              ? '?'
                              : String(
                                lead.agent,
                              ).charAt(
                                0,
                              )}
                          </div>

                          <span
                            className={`text-sm ${lead.agent ===
                                'Unassigned'
                                ? 'text-rose-400'
                                : 'text-ink/80'
                              }`}
                          >
                            {String(
                              lead.agent,
                            )}
                          </span>
                        </div>
                      ),
                    },

                    {
                      header:
                        'Activity',

                      render: (
                        lead,
                      ) => (
                        <div>
                          <div className="text-xs text-cream flex items-center gap-1">
                            <Clock className="h-3 w-3" />

                            {String(
                              lead.lastContact,
                            )}
                          </div>

                          <div className="text-[10px] text-ink/60 mt-0.5">
                            Age:{' '}
                            {
                              lead.age
                            }{' '}
                            days
                          </div>
                        </div>
                      ),
                    },

                    {
                      header: (
                        <div className="text-right">
                          Actions
                        </div>
                      ),

                      className:
                        'text-right',

                      render: (
                        lead,
                      ) => (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              openMessageModal(
                                lead,
                              )
                            }
                            className="p-1.5 text-ink/60 hover:text-cream rounded hover:bg-white/5 transition-colors"
                            title="Message"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() =>
                              handleViewLead(
                                lead,
                              )
                            }
                            className="p-1.5 text-ink/60 hover:text-gold-400 rounded hover:bg-gold-400/10 transition-colors"
                            title="View Full Profile"
                          >
                            <UserCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Lead Funnel */}
              <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
                <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-gold-400" />
                  Conversion Funnel
                </h3>

                <div className="space-y-3">
                  {/* New inquiries */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-ink/80">
                        New Inquiries
                      </span>

                      <span className="font-bold text-cream">
                        {
                          newInquiryCount
                        }
                      </span>
                    </div>

                    <div className="h-6 w-full bg-navy-950 rounded border border-white/5 overflow-hidden">
                      <div
                        className="h-full bg-slate-500"
                        style={{
                          width: `${agencyInquiries.length >
                              0
                              ? (newInquiryCount /
                                agencyInquiries.length) *
                              100
                              : 0
                            }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Contacted */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-ink/80">
                        Contacted
                      </span>

                      <span className="font-bold text-cream">
                        {
                          contactedCount
                        }
                      </span>
                    </div>

                    <div className="h-6 w-[80%] mx-auto bg-navy-950 rounded border border-white/5 overflow-hidden">
                      <div
                        className="h-full bg-blue-400"
                        style={{
                          width: `${agencyInquiries.length >
                              0
                              ? (contactedCount /
                                agencyInquiries.length) *
                              100
                              : 0
                            }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Viewing scheduled */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-ink/80">
                        Viewing Scheduled
                      </span>

                      <span className="font-bold text-cream">
                        {
                          viewingScheduledCount
                        }
                      </span>
                    </div>

                    <div className="h-6 w-[60%] mx-auto bg-navy-950 rounded border border-white/5 overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{
                          width: `${agencyInquiries.length >
                              0
                              ? (viewingScheduledCount /
                                agencyInquiries.length) *
                              100
                              : 0
                            }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Negotiating */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-ink/80">
                        Negotiating
                      </span>

                      <span className="font-bold text-cream">
                        {
                          negotiatingCount
                        }
                      </span>
                    </div>

                    <div className="h-6 w-[50%] mx-auto bg-navy-950 rounded border border-white/5 overflow-hidden">
                      <div
                        className="h-full bg-orange-400"
                        style={{
                          width: `${agencyInquiries.length >
                              0
                              ? (negotiatingCount /
                                agencyInquiries.length) *
                              100
                              : 0
                            }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Closed */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-ink/80">
                        Closed
                      </span>

                      <span className="font-bold text-cream">
                        {
                          closedCount
                        }
                      </span>
                    </div>

                    <div className="h-6 w-[40%] mx-auto bg-navy-950 rounded border border-white/5 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400"
                        style={{
                          width: `${agencyInquiries.length >
                              0
                              ? (closedCount /
                                agencyInquiries.length) *
                              100
                              : 0
                            }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead Sources */}
              <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
                <h3 className="font-heading text-lg font-semibold text-cream mb-6">
                  Lead Sources
                </h3>

                <SegmentedProgressBar
                  segments={[
                    {
                      label:
                        'Website',
                      value:
                        websitePercentage,
                      color:
                        'bg-blue-400',
                    },
                    {
                      label:
                        'Contact Agent',
                      value:
                        contactAgentPercentage,
                      color:
                        'bg-emerald-400',
                    },
                    {
                      label:
                        'Schedule Viewing',
                      value:
                        scheduleViewingPercentage,
                      color:
                        'bg-gold-400',
                    },
                  ]}
                />

                <div className="mt-6 flex flex-col gap-2 text-xs text-ink/80">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      Website
                    </span>

                    <span className="font-bold">
                      {websitePercentage.toFixed(
                        0,
                      )}
                      %
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      Contact Agent
                    </span>

                    <span className="font-bold text-emerald-400">
                      {contactAgentPercentage.toFixed(
                        0,
                      )}
                      %
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gold-400" />
                      Schedule Viewing
                    </span>

                    <span className="font-bold text-gold-400">
                      {scheduleViewingPercentage.toFixed(
                        0,
                      )}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lead details drawer */}
          <EnterpriseDetailDrawer
            isOpen={
              isDrawerOpen &&
              selectedLead !== null
            }
            onClose={() => {
              setIsDrawerOpen(
                false,
              );
              setSelectedLead(null);
            }}
            title={`Lead: ${selectedLead?.name ??
              'Details'
              }`}
            footerActions={
              selectedLead ? (
                <div className="flex w-full">
                  <GhostButton
                    className="w-full"
                    onClick={() =>
                      handleMessageLead(
                        selectedLead,
                      )
                    }
                  >
                    Message Lead
                  </GhostButton>
                </div>
              ) : null
            }
          >
            {selectedLead && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl border border-white/10 bg-navy-900/50">
                  <h4 className="text-sm font-semibold text-cream mb-4">
                    Lead Information
                  </h4>

                  <div className="space-y-3 text-sm text-ink/80">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span>
                        Email
                      </span>

                      <span className="font-medium text-cream">
                        {
                          selectedLead.email
                        }
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span>
                        Phone
                      </span>

                      <span className="font-medium text-cream">
                        {
                          selectedLead.phone
                        }
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span>
                        Interest
                      </span>

                      <span className="font-medium text-cream">
                        {
                          selectedLead.interest
                        }
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span>
                        Property Price
                      </span>

                      <span className="font-medium text-cream">
                        {
                          selectedLead.budget
                        }
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span>
                        Assigned Agent
                      </span>

                      <span className="font-medium text-cream">
                        {
                          selectedLead.agent
                        }
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span>
                        Source
                      </span>

                      <span className="font-medium text-cream">
                        {
                          selectedLead.source
                        }
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span>
                        Last Contact
                      </span>

                      <span className="font-medium text-cream">
                        {
                          selectedLead.lastContact
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </EnterpriseDetailDrawer>

          {/* Message Lead Modal */}
          {messageModalOpen &&
            messageLead && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/90 p-4 backdrop-blur-sm">
                <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-navy-800 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-300 md:p-8">
                  <button
                    type="button"
                    aria-label="Close message dialog"
                    className="absolute right-6 top-6 rounded-full p-2 text-ink/50 transition-colors hover:bg-white/5 hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 disabled:pointer-events-none disabled:opacity-50"
                    onClick={
                      closeMessageModal
                    }
                    disabled={
                      isMessaging
                    }
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/30 bg-gold-500/10 text-sm font-bold text-gold-300">
                      {getLeadInitials(
                        messageLead.name,
                      )}
                    </div>

                    <div>
                      <h3 className="font-heading text-xl font-bold text-cream">
                        Message{' '}
                        {
                          messageLead.name
                        }
                      </h3>

                      <p className="text-sm text-ink/50">
                        Send a message directly to this Lead.
                      </p>
                    </div>
                  </div>

                  {messageSuccess ? (
                    <div className="py-8 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>

                      <h4 className="mb-2 text-xl font-bold text-cream">
                        Message Sent!
                      </h4>

                      <p className="mb-8 text-ink/60">
                        Your message was sent successfully.
                      </p>

                      <GhostButton
                        type="button"
                        className="h-12 w-full justify-center"
                        onClick={
                          closeMessageModal
                        }
                      >
                        Close
                      </GhostButton>
                    </div>
                  ) : (
                    <form
                      onSubmit={
                        handleMessageSubmit
                      }
                      noValidate
                      className="space-y-4"
                    >
                      {messageError && (
                        <div
                          role="alert"
                          className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200"
                        >
                          {
                            messageError
                          }
                        </div>
                      )}

                      <textarea
                        autoFocus
                        rows={6}
                        placeholder="Write your message..."
                        value={
                          messageText
                        }
                        onChange={(
                          event,
                        ) => {
                          setMessageText(
                            event.target
                              .value,
                          );

                          if (
                            messageError
                          ) {
                            setMessageError(
                              null,
                            );
                          }
                        }}
                        className="w-full resize-none rounded-2xl border border-white/10 bg-navy-900/50 px-4 py-3 text-sm leading-relaxed text-cream shadow-inner transition-all placeholder:text-ink/50 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
                        disabled={
                          isMessaging
                        }
                      />

                      <GoldButton
                        type="submit"
                        size="md"
                        className="h-12 w-full justify-center gap-2"
                        disabled={
                          isMessaging ||
                          !messageText.trim()
                        }
                      >
                        {isMessaging ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MessageCircle className="h-4 w-4" />
                        )}

                        {isMessaging
                          ? 'Sending...'
                          : 'Send Message'}
                      </GoldButton>
                    </form>
                  )}
                </div>
              </div>
            )}
        </>
      )}
    </div>
  );
}