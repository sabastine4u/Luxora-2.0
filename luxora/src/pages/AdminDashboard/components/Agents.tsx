import { useEffect, useState } from 'react';
import {
  MoreHorizontal,
  SearchX,
  Users,
  CheckCircle,
  UserPlus,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { adminApi } from '../../../api/admin.api';
import type { AdminAgent } from '../../../types/admin';
import EditAgentModal from './modals/EditAgentModal';

// Define the full Agent structure returned by the Admin backend.
interface ApiAgent {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  residentialAddress?: string;
  employmentType?: string;
  yearsOfExperience?: number;
  licenseNumber?: string;
  backgroundCheckStatus?: string;
  branch?: string;
  department?: string;
  level?: string;
  reportingManager?: string;
  serviceStates?: string[];
  neighborhoods?: string[];
  coverageRadius?: string;
  specializations?: string[];
  commissionModel?: string;
  agentShare?: number;
  agencyShare?: number;
  signOnBonus?: number;
  user?: string;

  // Store the real number of completed deals returned by the Admin API.
  dealCount?: number;

  agency?: {
    _id?: string;
    name?: string;
  } | null;

  status: string;
  createdAt: string;
  updatedAt?: string;
}

// Define the response shape returned by GET /admin/agents.
interface GetAgentsResponse {
  agents?: ApiAgent[];
}

// Define the response shape returned by Agent update endpoints.
interface UpdateAgentResponse {
  agent?: ApiAgent;
}

export default function Agents() {
  // Store the Agent search value.
  const [searchQuery, setSearchQuery] = useState('');

  // Store the Agent currently opened in the details drawer.
  const [selectedUser, setSelectedUser] =
    useState<AdminAgent | null>(null);

  // Store the complete real Agent record for the details drawer.
  const [selectedAgent, setSelectedAgent] =
    useState<ApiAgent | null>(null);

  // Store real, platform-wide Agents fetched from the backend.
  const [agents, setAgents] =
    useState<AdminAgent[]>([]);

  // Store the complete API Agent records separately from the table data.
  const [apiAgents, setApiAgents] =
    useState<ApiAgent[]>([]);

  // Track whether the Agent request is loading.
  const [isLoadingAgents, setIsLoadingAgents] =
    useState(true);

  // Store a user-friendly Agent loading error.
  const [loadError, setLoadError] =
    useState<string | null>(null);

  // Track which Agent status action is currently being submitted.
  const [isUpdatingStatus, setIsUpdatingStatus] =
    useState(false);

  // Control the Edit Agent modal.
  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false);

  // Track whether an Agent profile update is being submitted.
  const [isUpdatingAgent, setIsUpdatingAgent] =
    useState(false);

  // Convert a real backend Agent into the existing AdminAgent table structure.
  const mapAgentToAdminAgent = (
    apiAgent: ApiAgent,
  ): AdminAgent => ({
    id: apiAgent._id,
    name: apiAgent.fullName,
    agency:
      apiAgent.agency?.name ||
      'Unassigned',

    // Use the real completed deal count from the backend.
    deals: apiAgent.dealCount ?? 0,

    joined: apiAgent.createdAt
      ? new Date(
          apiAgent.createdAt,
        ).toLocaleDateString()
      : 'N/A',

    status: apiAgent.status,
  });

  // Format arrays such as service states and specializations for the drawer.
  const formatList = (
    values?: string[],
  ) => {
    if (!values || values.length === 0) {
      return 'Not provided';
    }

    return values.join(', ');
  };

  // Format optional values without exposing undefined or empty strings.
  const formatValue = (
    value?: string | number | null,
  ) => {
    if (
      value === undefined ||
      value === null ||
      value === ''
    ) {
      return 'Not provided';
    }

    return String(value);
  };

  // Format the Agent date of birth when available.
  const formatDateOfBirth = (
    date?: string,
  ) => {
    if (!date) {
      return 'Not provided';
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime(),
      )
    ) {
      return 'Not provided';
    }

    return parsedDate.toLocaleDateString();
  };

  // Load all real Agents from the Admin backend.
  const fetchAgents = async () => {
    try {
      // Reset the existing error before requesting fresh data.
      setLoadError(null);

      // Show the loading state while the request is running.
      setIsLoadingAgents(true);

      // Request the real platform-wide Agent collection.
      const response =
        (await adminApi.getAgents()) as unknown as GetAgentsResponse;

      // Preserve the complete API records for the details drawer.
      const realAgents =
        response.agents || [];

      setApiAgents(realAgents);

      // Convert the API records into the existing table structure.
      setAgents(
        realAgents.map(
          mapAgentToAdminAgent,
        ),
      );
    } catch (error) {
      // Log the technical error for development/debugging.
      console.error(
        'Failed to load agents:',
        error,
      );

      // Show a readable message in the dashboard.
      setLoadError(
        'Unable to load agents right now.',
      );

      // Clear stale Agent data after a failed request.
      setAgents([]);

      // Clear stale complete Agent records.
      setApiAgents([]);
    } finally {
      // Stop the loading state after the request finishes.
      setIsLoadingAgents(false);
    }
  };

  // Load Agents when the page mounts.
  useEffect(() => {
    void fetchAgents();
  }, []);

  // Count Agents created within the last 30 days.
  const thirtyDaysAgo =
    Date.now() -
    30 * 24 * 60 * 60 * 1000;

  const newRegistrationsCount =
    apiAgents.filter((agent) => {
      // Use the original backend createdAt value for an accurate date comparison.
      const createdTime = new Date(
        agent.createdAt,
      ).getTime();

      return (
        !Number.isNaN(createdTime) &&
        createdTime >= thirtyDaysAgo
      );
    }).length;

  // Count Agents that are currently Active.
  const activeAgentsCount =
    agents.filter(
      (agent) =>
        agent.status ===
        'Active',
    ).length;

  // Count Agents that are currently Suspended.
  const suspendedAgentsCount =
    agents.filter(
      (agent) =>
        agent.status ===
        'Suspended',
    ).length;

  // Count Agents that are still waiting for verification.
  const pendingVerificationCount =
    agents.filter(
      (agent) =>
        agent.status ===
        'Pending Verification',
    ).length;

  // Keep the filtered Agent list based on name and Agency.
  const filteredAgents =
    agents.filter((agent) => {
      const search =
        searchQuery
          .trim()
          .toLowerCase();

      return (
        agent.name
          .toLowerCase()
          .includes(search) ||
        agent.agency
          .toLowerCase()
          .includes(search)
      );
    });

  // Suspend or reactivate the selected Agent using the real backend.
  const handleStatusChange = async (
    status:
      | 'Active'
      | 'Suspended',
  ) => {
    // Do nothing when there is no selected Agent.
    if (!selectedUser) {
      return;
    }

    try {
      // Prevent duplicate status submissions.
      setIsUpdatingStatus(true);

      // Call the real Admin Agent status endpoint.
      const response =
        (await adminApi.updateAgentStatus(
          selectedUser.id,
          status,
        )) as unknown as UpdateAgentResponse;

      // Prefer the real updated Agent returned by the backend.
      if (response.agent) {
        const updatedAgent =
          mapAgentToAdminAgent(
            response.agent,
          );

        // Update the Agent row immediately in local state.
        setAgents(
          (currentAgents) =>
            currentAgents.map(
              (agent) =>
                agent.id ===
                updatedAgent.id
                  ? updatedAgent
                  : agent,
            ),
        );

        // Update the complete Agent record used by the drawer.
        setSelectedAgent(
          response.agent,
        );

        // Also update the selected table Agent.
        setSelectedUser(
          updatedAgent,
        );

        // Update the matching full API Agent record.
        setApiAgents(
          (currentAgents) =>
            currentAgents.map(
              (agent) =>
                agent._id ===
                response.agent?._id
                  ? response.agent!
                  : agent,
            ),
        );
      } else {
        // Refresh the Agent list when the backend does not return the updated record.
        await fetchAgents();
      }
    } catch (error) {
      // Log the technical failure for debugging.
      console.error(
        'Failed to update Agent status:',
        error,
      );
    } finally {
      // Allow another status action after the request finishes.
      setIsUpdatingStatus(false);
    }
  };

  // Update the selected Agent profile using the real Admin backend.
  const handleAgentUpdate = async (
    data: Partial<ApiAgent>,
  ) => {
    // Do nothing when there is no selected Agent.
    if (!selectedAgent) {
      return;
    }

    try {
      // Prevent duplicate profile submissions.
      setIsUpdatingAgent(true);

      // Send the edited fields to PATCH /admin/agents/:id.
      const response =
        (await adminApi.updateAgent(
          selectedAgent._id,
          data,
        )) as unknown as UpdateAgentResponse;

      // The backend must return the updated Agent record.
      if (!response.agent) {
        throw new Error(
          'Updated Agent was not returned by the server.',
        );
      }

      // Store the real updated Agent returned by MongoDB.
      const updatedAgent =
        response.agent;

      // Convert the updated API record into the table structure.
      const updatedTableAgent =
        mapAgentToAdminAgent(
          updatedAgent,
        );

      // Update the Agent row immediately without a browser refresh.
      setAgents(
        (currentAgents) =>
          currentAgents.map(
            (agent) =>
              agent.id ===
              updatedTableAgent.id
                ? updatedTableAgent
                : agent,
          ),
      );

      // Update the complete Agent record used by the drawer.
      setSelectedAgent(
        updatedAgent,
      );

      // Keep the selected table Agent synchronized.
      setSelectedUser(
        updatedTableAgent,
      );

      // Update the corresponding real API Agent record.
      setApiAgents(
        (currentAgents) =>
          currentAgents.map(
            (agent) =>
              agent._id ===
              updatedAgent._id
                ? updatedAgent
                : agent,
          ),
      );

      // Close the edit modal after a successful backend update.
      setIsEditModalOpen(false);
    } catch (error) {
      // Log the real API failure for debugging.
      console.error(
        'Failed to update Agent profile:',
        error,
      );

      // Re-throw so the edit modal can display its error state.
      throw error;
    } finally {
      // Allow another edit after the request finishes.
      setIsUpdatingAgent(false);
    }
  };

  // Open the selected Agent and preserve both table and complete API data.
  const handleSelectAgent = (
    agent: AdminAgent,
  ) => {
    // Store the existing table representation.
    setSelectedUser(agent);

    // Find the matching complete Agent record from the API data.
    const fullAgent = apiAgents.find(
      (apiAgent) =>
        apiAgent._id ===
        agent.id,
    );

    // Store the complete record for the details drawer.
    setSelectedAgent(
      fullAgent || null,
    );
  };

  // Show a loading state while the real Agent data is being fetched.
  if (isLoadingAgents) {
    return (
      <div className="space-y-6">
        <DashboardHeader
          name="Agent Management"
          subtitle="Manage and monitor real estate agents on the platform."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 animate-pulse"
            >
              <div className="h-4 w-28 rounded bg-white/10" />

              <div className="mt-4 h-8 w-20 rounded bg-white/10" />

              <div className="mt-4 h-3 w-32 rounded bg-white/10" />
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-navy-800/50 p-6 animate-pulse">
            <div className="h-5 w-48 rounded bg-white/10" />

            <div className="mt-6 space-y-4">
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 gap-4"
                >
                  {Array.from({
                    length: 5,
                  }).map(
                    (_, cellIndex) => (
                      <div
                        key={
                          cellIndex
                        }
                        className="h-5 rounded bg-white/10"
                      />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 animate-pulse">
            <div className="h-5 w-48 rounded bg-white/10" />

            <div className="mt-6 space-y-4">
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-4 w-4/5 rounded bg-white/10" />
              <div className="h-4 w-3/5 rounded bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show a clear error state when the real Agent request fails.
  if (loadError) {
    return (
      <div className="space-y-6">
        <DashboardHeader
          name="Agent Management"
          subtitle="Manage and monitor real estate agents on the platform."
        />

        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-400 mt-0.5" />

            <div>
              <h3 className="font-semibold text-cream">
                Unable to load agents
              </h3>

              <p className="mt-1 text-sm text-ink/60">
                {loadError}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Agent Management"
        subtitle="Manage and monitor real estate agents on the platform."
      />

      {/* Use real Agent counts instead of the previous mock KPI values. */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Agents"
          value={agents.length.toString()}
          icon={Users}
          trend={`${activeAgentsCount} active`}
          trendColor="text-emerald-400"
          iconColor="text-blue-400"
        />

        <KPICard
          title="New Registrations"
          value={newRegistrationsCount.toString()}
          icon={UserPlus}
          trend="Last 30 days"
          trendColor="text-emerald-400"
          iconColor="text-emerald-400"
        />

        <KPICard
          title="Pending Verification"
          value={pendingVerificationCount.toString()}
          icon={CheckCircle}
          trend="Needs verification"
          trendColor="text-yellow-400"
          iconColor="text-yellow-400"
          backgroundColor="bg-yellow-400/10"
        />

        <KPICard
          title="Suspended Agents"
          value={suspendedAgentsCount.toString()}
          icon={Activity}
          trend={`${activeAgentsCount} active agents`}
          trendColor="text-emerald-400"
          iconColor="text-rose-400"
          backgroundColor="bg-rose-400/10"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={
              setSearchQuery
            }
            searchPlaceholder="Search agents..."
            showFilter
          />

          <DataTable
            data={filteredAgents}
            keyExtractor={(agent) =>
              agent.id
            }
            columns={[
              {
                header: 'Agent ID',
                render: (_, index) => (
                  <span className="font-medium text-cream">
                    {`AGT-${String(
                      index + 1,
                    ).padStart(
                      3,
                      '0',
                    )}`}
                  </span>
                ),
              },
              {
                header: 'Name',
                render: (agent) => (
                  <span className="font-semibold text-cream">
                    {agent.name}
                  </span>
                ),
              },
              {
                header:
                  'Agency Affiliation',
                render: (agent) => (
                  <span className="text-ink/60">
                    {agent.agency}
                  </span>
                ),
              },
              {
                header: 'Total Deals',
                render: (agent) => (
                  <span className="font-semibold text-gold-400">
                    {agent.deals}
                  </span>
                ),
              },
              {
                header: 'Joined Date',
                render: (agent) => (
                  <span className="text-ink/60">
                    {agent.joined}
                  </span>
                ),
              },
              {
                header: 'KYC Status',
                render: (agent) => (
                  <EnterpriseStatusBadge
                    status={
                      agent.status
                    }
                  />
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
                render: (agent) => (
                  <button
                    className="rounded-lg p-2 text-ink/40 hover:bg-white/10 hover:text-cream transition-colors"
                    onClick={() =>
                      handleSelectAgent(
                        agent,
                      )
                    }
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                ),
              },
            ]}
            emptyState={
              <div className="flex flex-col items-center justify-center py-12 text-center bg-navy-900/50 rounded-xl border border-white/5 border-dashed">
                <SearchX className="h-12 w-12 text-ink/20 mb-4" />

                <h3 className="text-lg font-bold text-cream">
                  No agents found
                </h3>

                <p className="text-sm text-ink/50 mt-1">
                  Try adjusting your search or filters.
                </p>
              </div>
            }
          />
        </div>

        {/* Keep the existing activity panel without inventing activity records. */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          <ActivityTimeline
            title="Recently Active Agents"
            items={[]}
          />
        </div>
      </div>

      <EnterpriseDetailDrawer
        isOpen={!!selectedUser}
        onClose={() => {
          // Close the details drawer.
          setSelectedUser(null);

          // Clear the selected complete Agent.
          setSelectedAgent(null);

          // Also close the edit form when the drawer closes.
          setIsEditModalOpen(false);
        }}
        title="Agent Details"
        subtitle={
          selectedUser?.name
        }
        footerActions={
          <div className="space-y-3">
            {/* Open the real Agent editing form. */}
            <button
              type="button"
              onClick={() =>
                setIsEditModalOpen(true)
              }
              disabled={!selectedAgent}
              className="w-full rounded-xl bg-gold-400 py-3 text-sm font-bold text-navy-900 transition-colors hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Edit Agent
            </button>

            {/* Suspend an active Agent account. */}
            {selectedUser?.status ===
              'Active' && (
              <button
                disabled={
                  isUpdatingStatus
                }
                onClick={() =>
                  void handleStatusChange(
                    'Suspended',
                  )
                }
                className="w-full rounded-xl border border-rose-400/30 bg-rose-400/10 py-3 text-sm font-bold text-rose-400 transition-colors hover:bg-rose-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingStatus
                  ? 'Updating...'
                  : 'Suspend Agent'}
              </button>
            )}

            {/* Reactivate a suspended Agent account. */}
            {selectedUser?.status ===
              'Suspended' && (
              <button
                disabled={
                  isUpdatingStatus
                }
                onClick={() =>
                  void handleStatusChange(
                    'Active',
                  )
                }
                className="w-full rounded-xl border border-emerald-400/30 bg-emerald-400/10 py-3 text-sm font-bold text-emerald-400 transition-colors hover:bg-emerald-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingStatus
                  ? 'Updating...'
                  : 'Reactivate Agent'}
              </button>
            )}
          </div>
        }
      >
        {selectedAgent && (
          <div className="space-y-6">
            {/* Account status section. */}
            <div>
              <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                Account Status
              </div>

              <EnterpriseStatusBadge
                status={
                  selectedAgent.status
                }
              />
            </div>

            {/* Basic contact information. */}
            <div className="space-y-4">
              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Full Name
                </div>

                <div className="text-sm font-semibold text-cream">
                  {formatValue(
                    selectedAgent.fullName,
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Email
                </div>

                <div className="text-sm font-semibold text-cream">
                  {formatValue(
                    selectedAgent.email,
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Phone
                </div>

                <div className="text-sm font-semibold text-cream">
                  {formatValue(
                    selectedAgent.phone,
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Date of Birth
                </div>

                <div className="text-sm font-semibold text-cream">
                  {formatDateOfBirth(
                    selectedAgent.dateOfBirth,
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Residential Address
                </div>

                <div className="text-sm font-semibold text-cream">
                  {formatValue(
                    selectedAgent.residentialAddress,
                  )}
                </div>
              </div>
            </div>

            {/* Agency and employment information. */}
            <div className="space-y-4 border-t border-white/10 pt-6">
              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Agency
                </div>

                <div className="text-sm font-semibold text-cream">
                  {formatValue(
                    selectedAgent.agency
                      ?.name,
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Employment Type
                </div>

                <div className="text-sm font-semibold text-cream">
                  {formatValue(
                    selectedAgent.employmentType,
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Years of Experience
                </div>

                <div className="text-sm font-semibold text-cream">
                  {formatValue(
                    selectedAgent.yearsOfExperience,
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Branch
                </div>

                <div className="text-sm font-semibold text-cream">
                  {formatValue(
                    selectedAgent.branch,
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Department
                </div>

                <div className="text-sm font-semibold text-cream">
                  {formatValue(
                    selectedAgent.department,
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Level
                </div>

                <div className="text-sm font-semibold text-cream">
                  {formatValue(
                    selectedAgent.level,
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Reporting Manager
                </div>

                <div className="text-sm font-semibold text-cream">
                  {formatValue(
                    selectedAgent.reportingManager,
                  )}
                </div>
              </div>
            </div>

            {/* Verification and licensing information. */}
            <div className="space-y-4 border-t border-white/10 pt-6">
              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  License Number
                </div>

                <div className="text-sm font-semibold text-cream">
                  {formatValue(
                    selectedAgent.licenseNumber,
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Background Check
                </div>

                <div className="text-sm font-semibold text-cream">
                  {formatValue(
                    selectedAgent.backgroundCheckStatus,
                  )}
                </div>
              </div>
            </div>

            {/* Coverage and specialization information. */}
            <div className="space-y-4 border-t border-white/10 pt-6">
              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Service States
                </div>

                <div className="text-sm font-semibold text-cream">
                  {formatList(
                    selectedAgent.serviceStates,
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Neighborhoods
                </div>

                <div className="text-sm font-semibold text-cream">
                  {formatList(
                    selectedAgent.neighborhoods,
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Coverage Radius
                </div>

                <div className="text-sm font-semibold text-cream">
                  {formatValue(
                    selectedAgent.coverageRadius,
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Specializations
                </div>

                <div className="text-sm font-semibold text-cream leading-6">
                  {formatList(
                    selectedAgent.specializations,
                  )}
                </div>
              </div>
            </div>

            {/* Compensation information. */}
            <div className="space-y-4 border-t border-white/10 pt-6">
              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Commission Model
                </div>

                <div className="text-sm font-semibold text-cream">
                  {formatValue(
                    selectedAgent.commissionModel,
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Agent Share
                </div>

                <div className="text-sm font-semibold text-gold-400">
                  {selectedAgent.agentShare !==
                  undefined
                    ? `${selectedAgent.agentShare}%`
                    : 'Not provided'}
                </div>
              </div>

              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Agency Share
                </div>

                <div className="text-sm font-semibold text-gold-400">
                  {selectedAgent.agencyShare !==
                  undefined
                    ? `${selectedAgent.agencyShare}%`
                    : 'Not provided'}
                </div>
              </div>

              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Sign-on Bonus
                </div>

                <div className="text-sm font-semibold text-gold-400">
                  {selectedAgent.signOnBonus !==
                  undefined
                    ? `₦${selectedAgent.signOnBonus.toLocaleString()}`
                    : 'Not provided'}
                </div>
              </div>
            </div>

            {/* Platform dates. */}
            <div className="space-y-4 border-t border-white/10 pt-6">
              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Joined Date
                </div>

                <div className="text-sm font-semibold text-cream">
                  {selectedAgent.createdAt
                    ? new Date(
                        selectedAgent.createdAt,
                      ).toLocaleDateString()
                    : 'Not provided'}
                </div>
              </div>

              <div>
                <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                  Last Updated
                </div>

                <div className="text-sm font-semibold text-cream">
                  {selectedAgent.updatedAt
                    ? new Date(
                        selectedAgent.updatedAt,
                      ).toLocaleDateString()
                    : 'Not provided'}
                </div>
              </div>
            </div>

            {/* Display the real completed deal count returned by the backend. */}
            <div className="border-t border-white/10 pt-6">
              <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                Total Deals
              </div>

              <div className="text-sm font-semibold text-gold-400">
                {selectedAgent.dealCount ??
                  selectedUser?.deals ??
                  0}
              </div>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      {/* Render the real Agent edit modal alongside the details drawer. */}
      <EditAgentModal
        isOpen={isEditModalOpen}
        agent={selectedAgent}
        isSaving={isUpdatingAgent}
        onClose={() =>
          setIsEditModalOpen(false)
        }
        onSave={handleAgentUpdate}
      />
    </div>
  );
}