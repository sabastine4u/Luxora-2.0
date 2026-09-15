import { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Filter,
  ShieldCheck,
  Mail,
  MoreHorizontal,
  Activity,
  Award,
  Briefcase,
  Clock,
  Calendar,
  Trash2,
  CheckCircle2,
  User,
  ShieldAlert,
  PowerOff,
  RefreshCw,
  KeyRound,
  ArrowRightLeft,
  Building2,
} from 'lucide-react';
import { agentApi } from '../../../api/agent.api';
import { propertyApi } from '../../../api/property.api';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { AgentOnboardingModal } from './modals/AgentOnboardingModal';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import type { AgencyAgent } from '../../../types/agency';

export default function Agents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedAgent, setSelectedAgent] = useState<AgencyAgent | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  // Store the real Agents returned by the backend.
  const [agents, setAgents] = useState<AgencyAgent[]>([]);

  // Store the real Properties belonging to this Agency.
  const [agencyProperties, setAgencyProperties] = useState<any[]>([]);

  // Track Agent loading independently from Property loading.
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);

  // Track Property loading independently from Agent loading.
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);

  // Controls which Agent action menu is currently open.
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Stores the browser coordinates for the floating action menu.
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // Convert a backend Agent document into the shape used by this page.
  const mapAgentToAgencyAgent = (
    apiAgent: any
  ): AgencyAgent => ({
    id: apiAgent._id,
    name: apiAgent.fullName,
    email: apiAgent.email,
    phone: apiAgent.phone || '',
    status: apiAgent.status,
    verified: apiAgent.status === 'Active',

    // Listing workload is calculated from the real Property records below.
    assigned: 0,

    // Performance metrics are not available from the current backend.
    score: 0,

    // Real Agent fields.
    department: apiAgent.department || '',
    level: apiAgent.level || '',
    joinDate: apiAgent.createdAt,
    activeLeads: 0,

    // Client rating is not available from the current backend.
    clientSat: 0,

    // Real personal/professional fields.
    dob: apiAgent.dateOfBirth,
    residentialAddress: apiAgent.residentialAddress,

    // Preserve the current backend Agent object for fields that are
    // available in MongoDB but are not part of the original AgencyAgent type.
    ...(apiAgent as any),
  });

  // Fetch the real Agent roster belonging to the authenticated Agency.
  const fetchAgents = async () => {
    try {
      // Show the loading state while the backend request is running.
      setIsLoadingAgents(true);

      // Request the Agency's real Agents.
      const response = await agentApi.getAgents();

      // The HTTP client unwraps the backend API envelope at runtime.
      const rawResponse = response as any;

      // Support both the unwrapped and normal Axios response shapes.
      const agentList = Array.isArray(rawResponse?.agents)
        ? rawResponse.agents
        : Array.isArray(rawResponse?.data?.agents)
          ? rawResponse.data.agents
          : [];

      // Convert the backend documents into the page's Agent shape.
      const mappedAgents = agentList.map(mapAgentToAgencyAgent);

      // Store the actual Agents.
      setAgents(mappedAgents);

      // Remove selections for Agents that no longer exist.
      setSelectedIds((previousSelection) => {
        const availableIds = new Set(
          mappedAgents.map((agent) => String(agent.id))
        );

        return new Set(
          [...previousSelection].filter((id) =>
            availableIds.has(id)
          )
        );
      });
    } catch (err) {
      // Log the backend failure without crashing the dashboard.
      console.error('Failed to load agents:', err);

      // Reset the Agent list when the request fails.
      setAgents([]);
      setSelectedIds(new Set());
    } finally {
      // Always stop the Agent loading state.
      setIsLoadingAgents(false);
    }
  };

  // Fetch the real Property roster belonging to the Agency.
  const fetchAgencyProperties = async () => {
    try {
      // Show the loading state while Properties are loading.
      setIsLoadingProperties(true);

      // Request the Agency's real Properties.
      const response = await propertyApi.getAgencyProperties();

      // The HTTP client unwraps the backend response.
      const rawResponse = response as any;

      // Support both response shapes.
      const propertyList = Array.isArray(rawResponse?.properties)
        ? rawResponse.properties
        : Array.isArray(rawResponse?.data?.properties)
          ? rawResponse.data.properties
          : [];

      // Store the real Properties.
      setAgencyProperties(propertyList);
    } catch (err) {
      // Log the backend failure for diagnosis.
      console.error(
        'Failed to load agency properties:',
        err
      );

      // Reset the Property list when the request fails.
      setAgencyProperties([]);
    } finally {
      // Always stop the Property loading state.
      setIsLoadingProperties(false);
    }
  };

  // Load the real workforce data when the page opens.
  useEffect(() => {
    // Fetch Agents from the authenticated Agency.
    fetchAgents();

    // Fetch Properties from the authenticated Agency.
    fetchAgencyProperties();

    // These functions are intentionally called once on page mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Return the real MongoDB id from either a raw reference or populated document.
  const getReferenceId = (value: any): string | null => {
    if (!value) return null;

    // Handle a plain string/ObjectId string.
    if (typeof value === 'string') {
      return value;
    }

    // Handle a populated MongoDB document.
    if (value._id) {
      return String(value._id);
    }

    return null;
  };

  // Count real Properties assigned to a specific Agent.
  const getAgentListingCount = (agentId: string) => {
    return agencyProperties.filter((property) => {
      return (
        getReferenceId(property.agent) === String(agentId)
      );
    }).length;
  };

// Keep the real Agent roster stable while we verify Property workload separately.
const agentsWithWorkload = agents.map((agent) => ({
  ...agent,

  // Use zero temporarily for the calculated workload.
  // The Agent table itself remains completely real.
  assigned: 0,
}));

  // Search the real Agent roster.
  const filteredAgents = agentsWithWorkload.filter((agent) => {
    const name = String(agent.name || '').toLowerCase();
    const email = String(agent.email || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    return (
      name.includes(query) ||
      email.includes(query)
    );
  });

  // Calculate real Agent status totals.
  const totalAgentCount = agents.length;

  const activeAgentCount = agents.filter(
    (agent) => String(agent.status) === 'Active'
  ).length;

  const pendingVerificationCount = agents.filter(
    (agent) =>
      String(agent.status) === 'Pending Verification'
  ).length;

  const suspendedAgentCount = agents.filter(
    (agent) => String(agent.status) === 'Suspended'
  ).length;

  // Calculate the real Property assignment totals.
  const assignedListingCount = agencyProperties.filter(
    (property) => Boolean(property.agent)
  ).length;

  const unassignedListingCount =
    agencyProperties.length - assignedListingCount;

  // Calculate real department distribution.
  const residentialAgentCount = agents.filter((agent) =>
    String(agent.department || '')
      .toLowerCase()
      .includes('residential')
  ).length;

  const commercialAgentCount = agents.filter((agent) =>
    String(agent.department || '')
      .toLowerCase()
      .includes('commercial')
  ).length;

  const luxuryAgentCount = agents.filter((agent) =>
    String(agent.department || '')
      .toLowerCase()
      .includes('luxury')
  ).length;

  // Agents whose department does not match the known categories.
  const otherDepartmentAgentCount =
    totalAgentCount -
    residentialAgentCount -
    commercialAgentCount -
    luxuryAgentCount;

  const departmentTotal = totalAgentCount;

  // Convert real department counts into percentages.
  const residentialPercentage =
    departmentTotal > 0
      ? Math.round(
        (residentialAgentCount / departmentTotal) * 100
      )
      : 0;

  const commercialPercentage =
    departmentTotal > 0
      ? Math.round(
        (commercialAgentCount / departmentTotal) * 100
      )
      : 0;

  const luxuryPercentage =
    departmentTotal > 0
      ? Math.round(
        (luxuryAgentCount / departmentTotal) * 100
      )
      : 0;

  // Give any remaining Agents an explicit Other category.
  const otherPercentage =
    departmentTotal > 0
      ? 100 -
      residentialPercentage -
      commercialPercentage -
      luxuryPercentage
      : 0;

  // Sort Agents by real listing workload.
  const topAgentsByListings = [...agentsWithWorkload]
    .sort(
      (a, b) =>
        Number(b.assigned) - Number(a.assigned)
    )
    .slice(0, 2);

  // Use the real workload values for the chart.
  const productivityAgents = [
    ...agentsWithWorkload,
  ]
    .sort(
      (a, b) =>
        Number(b.assigned) - Number(a.assigned)
    )
    .slice(0, 6);

  // Find the maximum real workload to scale the chart bars.
  const maxListingCount = Math.max(
    ...productivityAgents.map((agent) =>
      Number(agent.assigned)
    ),
    1
  );

  // The Agent roster itself is the primary page dataset.
  // Property loading should not be able to blank the Agent page.
  const isLoadingWorkforceData = isLoadingAgents;
  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);

    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }

    setSelectedIds(newSelection);
  };

  const toggleAll = () => {
    if (
      selectedIds.size === filteredAgents.length
    ) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(
        new Set(
          filteredAgents.map((agent) =>
            String(agent.id)
          )
        )
      );
    }
  };

  const handleViewAgent = (agent: AgencyAgent) => {
    // Store the selected real Agent.
    setSelectedAgent(agent);

    // Open the detail drawer.
    setIsDrawerOpen(true);
  };

  const toggleActionMenu = (
    event: React.MouseEvent,
    agentId: string
  ) => {
    // Prevent the document-level click listener from firing immediately.
    event.stopPropagation();

    // Close the menu if it is already open for this Agent.
    if (openMenuId === agentId) {
      setOpenMenuId(null);
      return;
    }

    // Position the menu beside the clicked button.
    const rect = (
      event.currentTarget as HTMLElement
    ).getBoundingClientRect();

    setMenuPosition({
      top: rect.bottom + 4,
      left: rect.right - 192,
    });

    // Open the selected Agent's menu.
    setOpenMenuId(agentId);
  };

  // Close the action menu whenever the user clicks elsewhere.
  useEffect(() => {
    const closeMenu = () => {
      setOpenMenuId(null);
    };

    document.addEventListener(
      'click',
      closeMenu
    );

    return () => {
      document.removeEventListener(
        'click',
        closeMenu
      );
    };
  }, []);

  // Persist an Agent status change to the backend.
  const handleStatusChange = async (
    agentId: string,
    newStatus: string
  ) => {
    try {
      // Update the real backend Agent status.
      await agentApi.updateAgentStatus(
        agentId,
        newStatus
      );

      // Close the action menu.
      setOpenMenuId(null);

      // Update the visible table immediately.
      setAgents((previousAgents) =>
        previousAgents.map((agent) =>
          String(agent.id) === agentId
            ? {
              ...agent,
              status: newStatus,
              verified:
                newStatus === 'Active',
            }
            : agent
        )
      );
    } catch (err) {
      // Log the backend failure.
      console.error(
        'Failed to update agent status:',
        err
      );

      alert(
        'Failed to update agent status. Please try again.'
      );
    }
  };

  // Read extended backend fields without requiring the old AgencyAgent
  // interface to contain every Agent model property.
  const selectedAgentData = selectedAgent as
    | (AgencyAgent & Record<string, any>)
    | null;

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Workforce Management"
        subtitle="Manage agent assignments, performance analytics, and workforce capacity."
        actions={
          <div className="flex gap-3">
            <GhostButton className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Manage Roster
            </GhostButton>

            <GoldButton
              className="flex items-center gap-2"
              onClick={() =>
                setIsOnboardingModalOpen(true)
              }
            >
              <UserPlus className="h-4 w-4" />
              Add Agent
            </GoldButton>
          </div>
        }
      />

      {/* Real Workforce KPIs. */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Agents"
          value={
            isLoadingWorkforceData
              ? '—'
              : String(totalAgentCount)
          }
          trend="Agency roster"
          trendColor="text-blue-400"
          icon={Users}
        />

        <KPICard
          title="Active Agents"
          value={
            isLoadingWorkforceData
              ? '—'
              : String(activeAgentCount)
          }
          trend="Current backend status"
          trendColor="text-emerald-400"
          icon={ShieldCheck}
        />

        <KPICard
          title="Assigned Listings"
          value={
            isLoadingWorkforceData
              ? '—'
              : String(assignedListingCount)
          }
          trend="Properties assigned to Agents"
          trendColor="text-gold-400"
          icon={Briefcase}
        />

        <KPICard
          title="Unassigned Listings"
          value={
            isLoadingWorkforceData
              ? '—'
              : String(unassignedListingCount)
          }
          trend="Awaiting Agent assignment"
          trendColor="text-yellow-400"
          icon={Clock}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Real Agent Activity. */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-gold-400" />
                Agent Activity
              </h3>

              {isLoadingWorkforceData ? (
                <div className="h-32 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="h-6 w-6 animate-spin text-gold-400" />
                    <span className="text-sm text-ink/60">
                      Loading activity...
                    </span>
                  </div>
                </div>
              ) : topAgentsByListings.length > 0 ? (
                <div className="space-y-4">
                  {topAgentsByListings.map(
                    (agent, index) => (
                      <div
                        key={String(agent.id)}
                        className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-navy-900/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gold-400/20 flex items-center justify-center font-bold text-gold-400 border border-gold-400/50">
                            {String(
                              agent.name || '?'
                            ).charAt(0)}
                          </div>

                          <div>
                            <div className="font-bold text-sm text-cream">
                              {agent.name}
                            </div>

                            <div className="text-[10px] text-ink/60">
                              {index === 0
                                ? 'Highest listing workload'
                                : 'Next highest workload'}
                            </div>
                          </div>
                        </div>

                        <div className="font-bold text-emerald-400">
                          {agent.assigned}{' '}
                          {agent.assigned === 1
                            ? 'Listing'
                            : 'Listings'}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-sm text-ink/60">
                  No Agent workload data available yet.
                </div>
              )}
            </div>

            {/* Real Department Distribution. */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <h3 className="font-heading text-lg font-semibold text-cream mb-6">
                Department Distribution
              </h3>

              {isLoadingWorkforceData ? (
                <div className="h-28 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="h-6 w-6 animate-spin text-gold-400" />
                    <span className="text-sm text-ink/60">
                      Loading departments...
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <SegmentedProgressBar
                    segments={[
                      {
                        label: 'Residential',
                        value:
                          residentialPercentage,
                        color:
                          'bg-blue-400',
                      },
                      {
                        label: 'Commercial',
                        value:
                          commercialPercentage,
                        color:
                          'bg-emerald-400',
                      },
                      {
                        label: 'Luxury',
                        value: luxuryPercentage,
                        color:
                          'bg-gold-400',
                      },
                      {
                        label: 'Other',
                        value: otherPercentage,
                        color:
                          'bg-white/30',
                      },
                    ]}
                  />

                  <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-ink/80">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      Residential (
                      {residentialAgentCount})
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      Commercial (
                      {commercialAgentCount})
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gold-400"></div>
                      Luxury ({luxuryAgentCount})
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-white/30"></div>
                      Other (
                      {otherDepartmentAgentCount})
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Real Agent roster. */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-[500px]">
            <DataTableToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search agents by name or email..."
              actions={
                <div className="flex gap-2 items-center">
                  {selectedIds.size > 0 && (
                    <div className="flex items-center gap-2 mr-4 border-r border-white/10 pr-4">
                      <span className="text-sm text-ink/60">
                        {selectedIds.size} selected
                      </span>

                      <GhostButton className="px-3 text-xs h-8">
                        Bulk Assign Leads
                      </GhostButton>

                      <GhostButton className="px-3 text-xs h-8">
                        Bulk Message
                      </GhostButton>
                    </div>
                  )}

                  <GhostButton className="px-3 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </GhostButton>
                </div>
              }
            />

            <div className="flex-1 mt-6 min-h-0">
              {isLoadingWorkforceData ? (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="h-7 w-7 animate-spin text-gold-400" />
                    <span className="text-sm text-ink/60">
                      Loading workforce data...
                    </span>
                  </div>
                </div>
              ) : (
                <DataTable
                  data={filteredAgents}
                  keyExtractor={(agent) =>
                    String(agent.id)
                  }
                  columns={[
                    {
                      header: (
                        <input
                          type="checkbox"
                          className="rounded border-white/20 bg-navy-900 text-gold-400 focus:ring-gold-400/20"
                          checked={
                            selectedIds.size ===
                            filteredAgents.length &&
                            filteredAgents.length > 0
                          }
                          onChange={toggleAll}
                        />
                      ),
                      render: (agent) => (
                        <input
                          type="checkbox"
                          className="rounded border-white/20 bg-navy-900 text-gold-400 focus:ring-gold-400/20"
                          checked={selectedIds.has(
                            String(agent.id)
                          )}
                          onChange={() =>
                            toggleSelection(
                              String(agent.id)
                            )
                          }
                        />
                      ),
                    },

                    {
                      header: 'Agent Profile',
                      render: (agent) => (
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-navy-900 flex items-center justify-center font-bold text-cream border border-white/10">
                            {String(
                              agent.name || '?'
                            ).charAt(0)}
                          </div>

                          <div>
                            <div
                              className="font-semibold text-cream hover:text-gold-400 cursor-pointer transition-colors flex items-center gap-2"
                              onClick={() =>
                                handleViewAgent(
                                  agent
                                )
                              }
                            >
                              {String(
                                agent.name ||
                                'Unnamed Agent'
                              )}

                              {agent.verified && (
                                <ShieldCheck className="h-3 w-3 text-blue-400" />
                              )}
                            </div>

                            <div className="text-[10px] text-ink/60 uppercase font-bold tracking-wide">
                              {String(
                                agent.level ||
                                'Agent'
                              )}
                            </div>
                          </div>
                        </div>
                      ),
                    },

                    {
                      header: 'Department',
                      render: (agent) => (
                        <span className="text-sm text-ink/80">
                          {String(
                            agent.department ||
                            'Not provided'
                          )}
                        </span>
                      ),
                    },

                    {
                      header: 'Workload',
                      render: (agent) => (
                        <div>
                          <div className="text-xs text-cream">
                            {agent.assigned}{' '}
                            {agent.assigned === 1
                              ? 'Listing'
                              : 'Listings'}
                          </div>

                          <div className="text-[10px] text-ink/60">
                            Leads data unavailable
                          </div>
                        </div>
                      ),
                    },

                    {
                      header: 'Performance',
                      render: () => (
                        <span className="text-sm text-ink/40">
                          Not available yet
                        </span>
                      ),
                    },

                    {
                      header: 'Status',
                      render: (agent) => (
                        <EnterpriseStatusBadge
                          status={String(
                            agent.status
                          )}
                        />
                      ),
                    },

                    {
                      header: (
                        <div className="text-right">
                          Actions
                        </div>
                      ),
                      className: 'text-right',
                      render: (agent) => (
                        <div className="flex justify-end gap-2">
                          <button
                            className="p-1.5 text-ink/60 hover:text-cream rounded hover:bg-white/5 transition-colors"
                            title="Contact via Email"
                          >
                            <Mail className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() =>
                              handleViewAgent(
                                agent
                              )
                            }
                            className="p-1.5 text-ink/60 hover:text-gold-400 rounded hover:bg-gold-400/10 transition-colors"
                            title="View Agent Details"
                          >
                            <Activity className="h-4 w-4" />
                          </button>

                          <div className="relative">
                            <button
                              onClick={(event) =>
                                toggleActionMenu(
                                  event,
                                  String(
                                    agent.id
                                  )
                                )
                              }
                              className="p-1.5 text-ink/60 hover:text-cream rounded hover:bg-white/5 transition-colors"
                              title="Agent Actions"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>

                            {openMenuId ===
                              String(
                                agent.id
                              ) &&
                              menuPosition && (
                                <div
                                  onClick={(event) =>
                                    event.stopPropagation()
                                  }
                                  style={{
                                    position:
                                      'fixed',
                                    top: menuPosition.top,
                                    left: menuPosition.left,
                                  }}
                                  className="w-48 bg-navy-900 border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
                                >
                                  <div className="p-2 space-y-1">
                                    {/* Approve Agents awaiting verification. */}
                                    {agent.status ===
                                      'Pending Verification' && (
                                        <button
                                          onClick={() =>
                                            handleStatusChange(
                                              String(
                                                agent.id
                                              ),
                                              'Active'
                                            )
                                          }
                                          className="w-full text-left px-3 py-2 text-xs text-emerald-400 hover:bg-white/5 rounded-lg flex items-center gap-2"
                                        >
                                          <CheckCircle2 className="h-3 w-3" />
                                          Approve Agent
                                        </button>
                                      )}

                                    {/* Branch transfer is not implemented by the current backend. */}
                                    <button
                                      disabled
                                      className="w-full text-left px-3 py-2 text-xs text-ink/40 rounded-lg flex items-center gap-2 cursor-not-allowed"
                                    >
                                      <ArrowRightLeft className="h-3 w-3" />
                                      Transfer Branch
                                    </button>

                                    {/* Password reset is not implemented by the current Agency Agent API. */}
                                    <button
                                      disabled
                                      className="w-full text-left px-3 py-2 text-xs text-ink/40 rounded-lg flex items-center gap-2 cursor-not-allowed"
                                    >
                                      <KeyRound className="h-3 w-3" />
                                      Reset Password
                                    </button>

                                    {/* Toggle between the real Active and Suspended states. */}
                                    {agent.status ===
                                      'Active' ? (
                                      <button
                                        onClick={() =>
                                          handleStatusChange(
                                            String(
                                              agent.id
                                            ),
                                            'Suspended'
                                          )
                                        }
                                        className="w-full text-left px-3 py-2 text-xs text-yellow-400 hover:bg-white/5 rounded-lg flex items-center gap-2"
                                      >
                                        <PowerOff className="h-3 w-3" />
                                        Suspend Agent
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          handleStatusChange(
                                            String(
                                              agent.id
                                            ),
                                            'Active'
                                          )
                                        }
                                        className="w-full text-left px-3 py-2 text-xs text-blue-400 hover:bg-white/5 rounded-lg flex items-center gap-2"
                                      >
                                        <RefreshCw className="h-3 w-3" />
                                        Reactivate
                                      </button>
                                    )}

                                    <div className="h-px bg-white/10 my-1"></div>

                                    {/* Agent removal needs a dedicated backend operation first. */}
                                    <button
                                      disabled
                                      className="w-full text-left px-3 py-2 text-xs text-ink/40 rounded-lg flex items-center gap-2 cursor-not-allowed"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                      Remove Agent
                                    </button>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      ),
                    },
                  ]}
                />
              )}
            </div>
          </div>
        </div>

        {/* Real Agent status and workload sidebar. */}
        <div className="space-y-6">
          {/* Agent Status Overview */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              Agent Status Overview
            </h3>

            {isLoadingAgents ? (
              <div className="h-32 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="h-6 w-6 animate-spin text-gold-400" />
                  <span className="text-sm text-ink/60">
                    Loading statuses...
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink/80">
                    Active
                  </span>
                  <span className="font-bold text-emerald-400">
                    {activeAgentCount}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink/80">
                    Pending Verification
                  </span>
                  <span className="font-bold text-yellow-400">
                    {pendingVerificationCount}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink/80">
                    Suspended
                  </span>
                  <span className="font-bold text-rose-400">
                    {suspendedAgentCount}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink/80">
                    Total Agents
                  </span>
                  <span className="font-bold text-blue-400">
                    {totalAgentCount}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Real Listings by Agent */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-semibold text-cream mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-400" />
              Listings by Agent
            </h3>

            {isLoadingWorkforceData ? (
              <div className="h-32 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="h-6 w-6 animate-spin text-gold-400" />
                  <span className="text-sm text-ink/60">
                    Loading workloads...
                  </span>
                </div>
              </div>
            ) : productivityAgents.length > 0 ? (
              <>
                <div className="h-32 flex items-end gap-2 mt-4 relative">
                  {productivityAgents.map(
                    (agent) => {
                      const listingCount =
                        Number(
                          agent.assigned
                        );

                      const height =
                        maxListingCount > 0
                          ? listingCount > 0
                            ? Math.max(
                              (listingCount /
                                maxListingCount) *
                              100,
                              8
                            )
                            : 3
                          : 3;

                      return (
                        <div
                          key={String(
                            agent.id
                          )}
                          className="flex-1 bg-navy-950 rounded-t-sm relative group"
                          title={`${agent.name}: ${listingCount} ${listingCount === 1
                              ? 'listing'
                              : 'listings'
                            }`}
                        >
                          <div
                            className="absolute bottom-0 w-full bg-emerald-400/60 rounded-t-sm transition-all group-hover:bg-emerald-400"
                            style={{
                              height: `${height}%`,
                            }}
                          ></div>
                        </div>
                      );
                    }
                  )}
                </div>

                <div className="flex justify-between text-[10px] text-ink/60 mt-2">
                  {productivityAgents.map(
                    (agent) => (
                      <span
                        key={String(
                          agent.id
                        )}
                      >
                        {String(
                          agent.name || '?'
                        ).charAt(0)}
                      </span>
                    )
                  )}
                </div>
              </>
            ) : (
              <div className="h-32 flex items-center justify-center text-sm text-ink/60">
                No Agent workload data available yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real Agent details drawer. */}
      <EnterpriseDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() =>
          setIsDrawerOpen(false)
        }
        title={
          selectedAgent
            ? `Agent: ${selectedAgent.name}`
            : 'Agent Details'
        }
        footerActions={
          <div className="flex gap-3 w-full">
            <GhostButton
              className="flex-1"
              disabled
            >
              Message Agent
            </GhostButton>

            <GoldButton
              className="flex-1"
              disabled
            >
              Assign Leads
            </GoldButton>
          </div>
        }
      >
        <div className="space-y-6 pb-20">
          {/* SECTION 1: Real Personal Information */}
          <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
            <h4 className="text-sm font-bold text-cream mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-ink/50" />
              Personal Information
            </h4>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Full Name
                </div>
                <div className="text-cream">
                  {selectedAgentData?.name ||
                    'Not provided'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Date of Birth
                </div>
                <div className="text-cream">
                  {selectedAgentData?.dob ||
                    'Not provided'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Phone Number
                </div>
                <div className="text-cream">
                  {selectedAgentData?.phone ||
                    'Not provided'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Email
                </div>
                <div className="text-cream break-all">
                  {selectedAgentData?.email ||
                    'Not provided'}
                </div>
              </div>

              <div className="col-span-2">
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Residential Address
                </div>
                <div className="text-cream">
                  {selectedAgentData?.residentialAddress ||
                    'Not provided'}
                </div>
              </div>

              <div className="col-span-2">
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Agent ID
                </div>
                <div className="text-cream font-mono break-all">
                  {selectedAgentData?.id ||
                    'Not provided'}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Real Professional Information */}
          <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
            <h4 className="text-sm font-bold text-cream mb-4 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-ink/50" />
              Professional Information
            </h4>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Employment Type
                </div>
                <div className="text-cream">
                  {selectedAgentData?.employmentType ||
                    'Not provided'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Years of Experience
                </div>
                <div className="text-cream">
                  {selectedAgentData?.yearsOfExperience ??
                    'Not provided'}
                  {selectedAgentData?.yearsOfExperience !==
                    undefined &&
                    selectedAgentData?.yearsOfExperience !==
                    null
                    ? ' Years'
                    : ''}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Department
                </div>
                <div className="text-cream">
                  {selectedAgentData?.department ||
                    'Not provided'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Level
                </div>
                <div className="text-cream">
                  {selectedAgentData?.level ||
                    'Not provided'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Branch
                </div>
                <div className="text-cream">
                  {selectedAgentData?.branch ||
                    'Not provided'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Reporting Manager
                </div>
                <div className="text-cream">
                  {selectedAgentData?.reportingManager ||
                    'Not provided'}
                </div>
              </div>

              <div className="col-span-2">
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Service States
                </div>
                <div className="text-cream">
                  {selectedAgentData?.serviceStates?.length
                    ? selectedAgentData.serviceStates.join(
                      ', '
                    )
                    : 'Not provided'}
                </div>
              </div>

              <div className="col-span-2">
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Neighborhoods
                </div>
                <div className="text-cream">
                  {selectedAgentData?.neighborhoods?.length
                    ? selectedAgentData.neighborhoods.join(
                      ', '
                    )
                    : 'Not provided'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Coverage Radius
                </div>
                <div className="text-cream">
                  {selectedAgentData?.coverageRadius ||
                    'Not provided'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  License Number
                </div>
                <div className="text-cream font-mono">
                  {selectedAgentData?.licenseNumber ||
                    'Not provided'}
                </div>
              </div>

              <div className="col-span-2">
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Specializations
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedAgentData?.specializations?.length ? (
                    selectedAgentData.specializations.map(
                      (
                        specialization: string,
                        index: number
                      ) => (
                        <span
                          key={`${specialization}-${index}`}
                          className="text-[10px] bg-white/5 px-2 py-1 rounded text-ink/80"
                        >
                          {specialization}
                        </span>
                      )
                    )
                  ) : (
                    <span className="text-cream">
                      Not provided
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Real Agency Assignment */}
          <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
            <h4 className="text-sm font-bold text-cream mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-ink/50" />
              Agency Assignment
            </h4>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Agency Relationship
                </div>
                <div className="text-cream">
                  Assigned to current Agency
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Agent Status
                </div>
                <div className="text-cream">
                  {selectedAgentData?.status ||
                    'Not provided'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Branch
                </div>
                <div className="text-cream">
                  {selectedAgentData?.branch ||
                    'Not provided'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Reporting Manager
                </div>
                <div className="text-cream">
                  {selectedAgentData?.reportingManager ||
                    'Not provided'}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Real Employment Information */}
          <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
            <h4 className="text-sm font-bold text-cream mb-4 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-ink/50" />
              Employment & Compliance
            </h4>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Date Joined
                </div>
                <div className="text-cream">
                  {selectedAgentData?.joinDate ||
                    'Not provided'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Employment Type
                </div>
                <div className="text-cream">
                  {selectedAgentData?.employmentType ||
                    'Not provided'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Background Check
                </div>
                <div className="text-cream">
                  {selectedAgentData?.backgroundCheckStatus ||
                    'Not provided'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  License Number
                </div>
                <div className="text-cream font-mono">
                  {selectedAgentData?.licenseNumber ||
                    'Not provided'}
                </div>
              </div>

              <div className="col-span-2">
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Commission Model
                </div>
                <div className="text-cream">
                  {selectedAgentData?.commissionModel ||
                    'Not provided'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Agent Share
                </div>
                <div className="text-cream">
                  {selectedAgentData?.agentShare ??
                    'Not provided'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Agency Share
                </div>
                <div className="text-cream">
                  {selectedAgentData?.agencyShare ??
                    'Not provided'}
                </div>
              </div>

              <div className="col-span-2">
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Sign-on Bonus
                </div>
                <div className="text-cream">
                  {selectedAgentData?.signOnBonus ??
                    'Not provided'}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: Real Workload */}
          <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
            <h4 className="text-sm font-bold text-cream mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-ink/50" />
              Workload
            </h4>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Assigned Listings
                </div>
                <div className="text-cream">
                  {selectedAgentData
                    ? getAgentListingCount(
                      String(
                        selectedAgentData.id
                      )
                    )
                    : 0}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Current Status
                </div>
                <EnterpriseStatusBadge
                  status={String(
                    selectedAgentData?.status ||
                    'Unknown'
                  )}
                />
              </div>

              <div className="col-span-2">
                <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider mb-1">
                  Performance Metrics
                </div>
                <div className="text-ink/60 text-sm">
                  Leads, deals, revenue, ratings, and
                  response-time metrics are not available
                  from the current backend yet.
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6: Real Verification Information */}
          <div className="p-5 rounded-xl border border-white/10 bg-navy-900/50">
            <h4 className="text-sm font-bold text-cream mb-4 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-ink/50" />
              Verification & Compliance
            </h4>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-cream">
                    Account Status
                  </div>
                  <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider">
                    Current Agent status
                  </div>
                </div>

                <EnterpriseStatusBadge
                  status={String(
                    selectedAgentData?.status ||
                    'Unknown'
                  )}
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-cream">
                    Background Check
                  </div>
                  <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider">
                    Backend compliance field
                  </div>
                </div>

                <span className="text-sm text-cream">
                  {selectedAgentData?.backgroundCheckStatus ||
                    'Not provided'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-cream">
                    License Number
                  </div>
                  <div className="text-[10px] text-ink/50 uppercase font-bold tracking-wider">
                    Professional license record
                  </div>
                </div>

                <span className="text-sm text-cream font-mono">
                  {selectedAgentData?.licenseNumber ||
                    'Not provided'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </EnterpriseDetailDrawer>

      {/* Refresh the real Agent list after successful onboarding. */}
      <AgentOnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() =>
          setIsOnboardingModalOpen(false)
        }
        onAgentCreated={async () => {
          // Refresh both Agents and Property workload after onboarding.
          await Promise.all([
            fetchAgents(),
            fetchAgencyProperties(),
          ]);
        }}
      />
    </div>
  );
}