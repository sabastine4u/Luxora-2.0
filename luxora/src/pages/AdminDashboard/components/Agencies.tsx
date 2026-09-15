import { useState, useEffect, useCallback } from "react";
import {
  MoreHorizontal,
  SearchX,
  Building2,
  CheckCircle,
  Clock,
  UserPlus,
  Activity,
} from "lucide-react";

import { ActivityTimeline } from "../../../components/dashboard/shared/timelines/ActivityTimeline";
import { DataTable } from "../../../components/dashboard/shared/tables/DataTable";
import { DataTableToolbar } from "../../../components/dashboard/shared/filters/DataTableToolbar";
import { DashboardHeader } from "../../../components/dashboard/shared/headers/DashboardHeader";
import { KPICard } from "../../../components/dashboard/shared/cards/KPICard";
import { EnterpriseDetailDrawer } from "../../../components/enterprise/EnterpriseDetailDrawer";
import { EnterpriseStatusBadge } from "../../../components/enterprise/EnterpriseStatusBadge";
import { ProvisionUserModal } from "./modals/ProvisionUserModal";
import EditAgencyModal from "./modals/EditAgencyModal";

import { adminApi } from "../../../api/admin.api";
import { GoldButton } from "../../../components/ui/ui";

import type { AdminAgency } from "../../../types/admin";

interface ApiAgency {
  _id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone?: string;
  status: "Active" | "Suspended";
  createdAt: string;
  updatedAt?: string;
  agentCount?: number;
  listingCount?: number;
}

const mapAgencyToAdminAgency = (
  apiAgency: ApiAgency,
): AdminAgency => ({
  id: apiAgency._id,
  name: apiAgency.name,
  agents: apiAgency.agentCount || 0,
  listings: apiAgency.listingCount || 0,
  joined: new Date(
    apiAgency.createdAt,
  ).toLocaleDateString(),
  status: apiAgency.status,
});

/*
 * Convert a real Agency timestamp into
 * a readable relative time.
 */
const formatRelativeTime = (
  dateString: string,
) => {
  const date = new Date(dateString);
  const now = new Date();

  const difference =
    now.getTime() - date.getTime();

  const seconds = Math.floor(
    difference / 1000,
  );

  if (seconds < 60) {
    return `${Math.max(seconds, 0)}s ago`;
  }

  const minutes = Math.floor(
    seconds / 60,
  );

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

  if (days < 7) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString();
};

export default function Agencies() {
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedUser, setSelectedUser] =
    useState<AdminAgency | null>(null);

  /*
   * Complete Agency record used by the
   * detail drawer and EditAgencyModal.
   */
  const [selectedAgency, setSelectedAgency] =
    useState<ApiAgency | null>(null);

  const [isProvisionModalOpen, setIsProvisionModalOpen] =
    useState(false);

  /*
   * Controls the Agency edit modal.
   * This is completely separate from EditAgentModal.
   */
  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false);

  const [isUpdatingAgency, setIsUpdatingAgency] =
    useState(false);

  const [apiAgencies, setApiAgencies] =
    useState<ApiAgency[]>([]);

  const [agencies, setAgencies] =
    useState<AdminAgency[]>([]);

  const [isLoadingAgencies, setIsLoadingAgencies] =
    useState(true);

  /*
   * Load all Agencies from the backend.
   */
  const fetchAgencies = useCallback(async () => {
    try {
      setIsLoadingAgencies(true);

      const response =
        await adminApi.getAgencies();

      const fetchedAgencies =
        (response.agencies || []) as ApiAgency[];

      setApiAgencies(fetchedAgencies);

      setAgencies(
        fetchedAgencies.map(
          mapAgencyToAdminAgency,
        ),
      );
    } catch (error) {
      console.error(
        "Failed to load agencies:",
        error,
      );

      setApiAgencies([]);
      setAgencies([]);
    } finally {
      setIsLoadingAgencies(false);
    }
  }, []);

  useEffect(() => {
    void fetchAgencies();
  }, [fetchAgencies]);

  /*
   * Open the Agency detail drawer.
   */
  const handleOpenAgency = (
    agency: AdminAgency,
  ) => {
    setSelectedUser(agency);

    const fullAgency =
      apiAgencies.find(
        (item) =>
          item._id === agency.id,
      );

    setSelectedAgency(
      fullAgency || null,
    );
  };

  /*
   * Open the Agency edit modal.
   */
  const handleOpenEditModal = () => {
    if (!selectedAgency) {
      return;
    }

    setIsEditModalOpen(true);
  };

  /*
   * Save Agency changes.
   */
  const handleAgencyUpdate = async (
    data: Partial<ApiAgency>,
  ) => {
    if (!selectedAgency) {
      return;
    }

    try {
      setIsUpdatingAgency(true);

      const response =
        await adminApi.updateAgency(
          selectedAgency._id,
          data,
        );

      const updatedAgency =
        response.agency as ApiAgency;

      /*
       * Keep the selected Agency updated.
       */
      if (updatedAgency?._id) {
        setSelectedAgency(
          updatedAgency,
        );

        setSelectedUser(
          mapAgencyToAdminAgency(
            updatedAgency,
          ),
        );
      }

      /*
       * Refresh the table from the backend
       * so the page reflects the real database.
       */
      await fetchAgencies();

      setIsEditModalOpen(false);
    } catch (error) {
      console.error(
        "Failed to update Agency:",
        error,
      );

      /*
       * Re-throw so the modal can keep itself
       * open and show its error state.
       */
      throw error;
    } finally {
      setIsUpdatingAgency(false);
    }
  };

  /*
   * Search Agencies.
   */
  const filteredAgencies =
    agencies.filter((agency) =>
      agency.name
        .toLowerCase()
        .includes(
          searchQuery.toLowerCase(),
        ),
    );

  /*
   * Calculate the real total number of Agencies.
   */
  const totalAgencies =
    apiAgencies.length;

  /*
   * Calculate the real number of Active Agencies.
   */
  const activeAgencies =
    apiAgencies.filter(
      (agency) =>
        agency.status === "Active",
    ).length;

  /*
   * Calculate the real number of Suspended Agencies.
   */
  const suspendedAgencies =
    apiAgencies.filter(
      (agency) =>
        agency.status === "Suspended",
    ).length;

  /*
   * Calculate Agencies created during the
   * current calendar month.
   */
  const now = new Date();

  const newRegistrations =
    apiAgencies.filter((agency) => {
      const createdDate =
        new Date(
          agency.createdAt,
        );

      return (
        createdDate.getMonth() ===
          now.getMonth() &&
        createdDate.getFullYear() ===
          now.getFullYear()
      );
    }).length;

  /*
   * Build the Recently Active Agencies list
   * from real Agency timestamps.
   *
   * If updatedAt is newer than createdAt,
   * we consider the Agency recently updated.
   * Otherwise, we treat the event as a registration.
   */
  const recentAgencyActivities =
    [...apiAgencies]
      .sort((a, b) => {
        const aDate = new Date(
          a.updatedAt ||
            a.createdAt,
        ).getTime();

        const bDate = new Date(
          b.updatedAt ||
            b.createdAt,
        ).getTime();

        return bDate - aDate;
      })
      .slice(0, 3)
      .map((agency) => {
        const createdTime =
          new Date(
            agency.createdAt,
          ).getTime();

        const activityTime =
          new Date(
            agency.updatedAt ||
              agency.createdAt,
          ).getTime();

        const wasUpdated =
          activityTime > createdTime;

        return {
          title: agency.name,

          desc: wasUpdated
            ? "Agency profile updated"
            : "Agency registered",

          time: formatRelativeTime(
            agency.updatedAt ||
              agency.createdAt,
          ),

          color: wasUpdated
            ? "text-blue-400"
            : "text-emerald-400",

          icon: wasUpdated
            ? Activity
            : Building2,
        };
      });

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Agency Management"
        subtitle="Manage corporate real estate agencies and their teams."
        actions={
          <GoldButton
            onClick={() =>
              setIsProvisionModalOpen(true)
            }
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Add Agency
          </GoldButton>
        }
      />

      {/* KPI CARDS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Agencies"
          value={String(totalAgencies)}
          icon={Building2}
          trend="Registered on platform"
          trendColor="text-ink/50"
          iconColor="text-purple-400"
        />

        <KPICard
          title="New Registrations"
          value={String(newRegistrations)}
          icon={UserPlus}
          trend="This month"
          trendColor="text-emerald-400"
          iconColor="text-emerald-400"
        />

        <KPICard
          title="Active Agencies"
          value={String(activeAgencies)}
          icon={CheckCircle}
          trend="Currently active"
          trendColor="text-emerald-400"
          iconColor="text-blue-400"
        />

        <KPICard
          title="Suspended Agencies"
          value={String(suspendedAgencies)}
          icon={Clock}
          trend="Requires attention"
          trendColor="text-yellow-400"
          iconColor="text-yellow-400"
          backgroundColor="bg-yellow-400/10"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search agencies..."
            showFilter
          />

          {isLoadingAgencies ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy-800/50">
              <div className="space-y-4 p-6">
                {Array.from({
                  length: 5,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="h-12 animate-pulse rounded-xl bg-white/5"
                  />
                ))}
              </div>
            </div>
          ) : (
            <DataTable
              data={filteredAgencies}
              keyExtractor={(agency) =>
                agency.id
              }
              columns={[
                {
                  header: "Agency ID",
                  render: (agency) => (
                    <span className="font-medium text-cream">
                      AGN-
                      {String(
                        agencies.findIndex(
                          (item) =>
                            item.id ===
                            agency.id,
                        ) + 1,
                      ).padStart(
                        3,
                        "0",
                      )}
                    </span>
                  ),
                },

                {
                  header: "Name",
                  render: (agency) => (
                    <span className="font-semibold text-cream">
                      {agency.name}
                    </span>
                  ),
                },

                {
                  header: "Total Agents",
                  render: (agency) => (
                    <span className="text-ink/60">
                      {agency.agents}
                    </span>
                  ),
                },

                {
                  header: "Active Listings",
                  render: (agency) => (
                    <span className="font-semibold text-gold-400">
                      {agency.listings}
                    </span>
                  ),
                },

                {
                  header: "Joined Date",
                  render: (agency) => (
                    <span className="text-ink/60">
                      {agency.joined}
                    </span>
                  ),
                },

                {
                  header: "Status",
                  render: (agency) => (
                    <EnterpriseStatusBadge
                      status={
                        agency.status
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
                    "text-right",
                  render: (agency) => (
                    <button
                      type="button"
                      className="rounded-lg p-2 text-ink/40 transition-colors hover:bg-white/10 hover:text-cream"
                      onClick={() =>
                        handleOpenAgency(
                          agency,
                        )
                      }
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  ),
                },
              ]}
              emptyState={
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/5 bg-navy-900/50 py-12 text-center">
                  <SearchX className="mb-4 h-12 w-12 text-ink/20" />

                  <h3 className="text-lg font-bold text-cream">
                    No agencies found
                  </h3>

                  <p className="mt-1 text-sm text-ink/50">
                    Try adjusting your
                    search or filters.
                  </p>
                </div>
              }
            />
          )}
        </div>

        {/* RECENTLY ACTIVE AGENCIES */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
          {recentAgencyActivities.length >
          0 ? (
            <ActivityTimeline
              title="Recently Active Agencies"
              items={
                recentAgencyActivities
              }
            />
          ) : (
            <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
              <Activity className="mb-3 h-8 w-8 text-ink/30" />

              <h3 className="text-sm font-bold uppercase tracking-wider text-cream">
                Recently Active Agencies
              </h3>

              <p className="mt-2 text-sm text-ink/50">
                No Agency activity
                available yet.
              </p>

              <p className="mt-1 text-xs text-ink/40">
                New registrations and
                profile updates will
                appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AGENCY DETAIL DRAWER */}
      <EnterpriseDetailDrawer
        isOpen={!!selectedUser}
        onClose={() => {
          setSelectedUser(null);
          setSelectedAgency(null);
        }}
        title="Agency Details"
        subtitle={
          selectedUser?.name
        }
        footerActions={
          <button
            type="button"
            disabled={!selectedAgency}
            onClick={
              handleOpenEditModal
            }
            className="w-full rounded-xl bg-gold-400 py-3 text-sm font-bold text-navy-900 transition-colors hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Edit Agency
          </button>
        }
      >
        {selectedUser && (
          <div className="space-y-6">
            <div>
              <div className="mb-1 text-xs uppercase tracking-wider text-ink/60">
                Status
              </div>

              <EnterpriseStatusBadge
                status={
                  selectedUser.status
                }
              />
            </div>

            {selectedAgency && (
              <>
                <div>
                  <div className="mb-1 text-xs uppercase tracking-wider text-ink/60">
                    Contact Person
                  </div>

                  <div className="text-sm font-semibold text-cream">
                    {
                      selectedAgency.contactPerson
                    }
                  </div>
                </div>

                <div>
                  <div className="mb-1 text-xs uppercase tracking-wider text-ink/60">
                    Email
                  </div>

                  <div className="break-all text-sm font-semibold text-cream">
                    {
                      selectedAgency.email
                    }
                  </div>
                </div>

                <div>
                  <div className="mb-1 text-xs uppercase tracking-wider text-ink/60">
                    Phone
                  </div>

                  <div className="text-sm font-semibold text-cream">
                    {selectedAgency.phone ||
                      "Not provided"}
                  </div>
                </div>
              </>
            )}

            <div>
              <div className="mb-1 text-xs uppercase tracking-wider text-ink/60">
                Total Agents
              </div>

              <div className="text-sm font-semibold text-cream">
                {selectedUser.agents}
              </div>
            </div>

            <div>
              <div className="mb-1 text-xs uppercase tracking-wider text-ink/60">
                Total Listings
              </div>

              <div className="text-sm font-semibold text-gold-400">
                {selectedUser.listings}
              </div>
            </div>

            <div>
              <div className="mb-1 text-xs uppercase tracking-wider text-ink/60">
                Joined Date
              </div>

              <div className="text-sm font-semibold text-cream">
                {selectedUser.joined}
              </div>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      {/* EDIT AGENCY MODAL */}
      <EditAgencyModal
        isOpen={isEditModalOpen}
        agency={selectedAgency}
        isSaving={isUpdatingAgency}
        onClose={() =>
          setIsEditModalOpen(false)
        }
        onSave={
          handleAgencyUpdate
        }
      />

      {/* EXISTING PROVISION AGENCY MODAL */}
      <ProvisionUserModal
        isOpen={
          isProvisionModalOpen
        }
        onClose={() =>
          setIsProvisionModalOpen(
            false,
          )
        }
        mode="admin"
        fixedType="agency"
        onAgencyCreated={() => {
          void fetchAgencies();
        }}
      />
    </div>
  );
}