import { useState, useEffect, useCallback } from "react";

// Import the real Admin API used to load and update Internal Staff.
import { adminApi } from "../../../api/admin.api";

import {
  MoreHorizontal,
  SearchX,
  Building2,
  CheckCircle,
  Clock,
  UserPlus,
  ShieldCheck,
  Briefcase,
} from "lucide-react";

import { DataTable } from "../../../components/dashboard/shared/tables/DataTable";
import { DataTableToolbar } from "../../../components/dashboard/shared/filters/DataTableToolbar";
import { DashboardHeader } from "../../../components/dashboard/shared/headers/DashboardHeader";
import { KPICard } from "../../../components/dashboard/shared/cards/KPICard";
import { EnterpriseDetailDrawer } from "../../../components/enterprise/EnterpriseDetailDrawer";
import { EnterpriseStatusBadge } from "../../../components/enterprise/EnterpriseStatusBadge";
import { ProvisionUserModal } from "./modals/ProvisionUserModal";
import EditInternalStaffModal from "./modals/EditInternalStaffModal";
import { GoldButton } from "../../../components/ui/ui";

// Represents the real Internal Staff fields currently used by this page.
type InternalStaffRow = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department: string;
  isActive: boolean;
  isVerified: boolean;
  status: "Active" | "Suspended";
  joined: string;
};

// Convert a backend Internal Staff record into the shape used by this page.
const mapStaffToTableRow = (apiStaff: {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  department?: string | null;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}): InternalStaffRow => ({
  id: apiStaff._id,
  name: apiStaff.fullName,
  email: apiStaff.email,
  phone: apiStaff.phone || "",
  role: apiStaff.role,
  department: apiStaff.department || "",
  isActive: apiStaff.isActive,
  isVerified: apiStaff.isVerified,
  status: apiStaff.isActive
    ? "Active"
    : "Suspended",
  joined: new Date(
    apiStaff.createdAt,
  ).toLocaleDateString(),
});

export default function InternalStaff() {
  const [searchQuery, setSearchQuery] =
    useState("");

  const [selectedUser, setSelectedUser] =
    useState<InternalStaffRow | null>(
      null,
    );

  /*
   * Controls the Internal Staff edit modal.
   */
  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false);

  /*
   * Tracks the Internal Staff save operation.
   */
  const [isUpdatingStaff, setIsUpdatingStaff] =
    useState(false);

  // Track whether the Internal Staff provisioning modal is open.
  const [isProvisionModalOpen, setIsProvisionModalOpen] =
    useState(false);

  // Store the real Internal Staff records returned by the backend.
  const [staff, setStaff] =
    useState<InternalStaffRow[]>([]);

  // Track whether the Internal Staff request is currently loading.
  const [isLoadingStaff, setIsLoadingStaff] =
    useState(true);

  /*
   * Load the real Internal Staff accounts from the backend.
   */
  const fetchInternalStaff = useCallback(
    async () => {
      try {
        setIsLoadingStaff(true);

        const response =
          await adminApi.getInternalStaff();

        setStaff(
          response.staff.map(
            mapStaffToTableRow,
          ),
        );
      } catch (error) {
        console.error(
          "Failed to load internal staff:",
          error,
        );

        setStaff([]);
      } finally {
        setIsLoadingStaff(false);
      }
    },
    [],
  );

  useEffect(() => {
    void fetchInternalStaff();
  }, [fetchInternalStaff]);

  // Store the ID of the Internal Staff member whose Actions menu is open.
  const [openMenuId, setOpenMenuId] =
    useState<string | null>(null);

  /*
   * Change the verification state of an Internal Staff account.
   */
  const handleVerificationChange =
    async (
      staffId: string,
      isVerified: boolean,
    ) => {
      try {
        const response =
          await adminApi.updateInternalStaffVerification(
            staffId,
            isVerified,
          );

        setStaff((prev) =>
          prev.map((member) =>
            member.id === staffId
              ? {
                  ...member,
                  isVerified:
                    response.user
                      .isVerified,
                }
              : member,
          ),
        );

        setSelectedUser((current) =>
          current &&
          current.id === staffId
            ? {
                ...current,
                isVerified:
                  response.user
                    .isVerified,
              }
            : current,
        );
      } catch (error) {
        console.error(
          "Failed to update Internal Staff verification:",
          error,
        );

        alert(
          "Failed to update staff verification. Please try again.",
        );
      }
    };

  /*
   * Open the Edit Internal Staff modal.
   */
  const handleOpenEditModal = () => {
    if (!selectedUser) {
      return;
    }

    setIsEditModalOpen(true);
  };

  /*
   * Save Internal Staff changes through
   * the real backend update endpoint.
   */
  const handleStaffUpdate = async (
    data: {
      fullName?: string;
      email?: string;
      phone?: string;
      role?: string;
      department?: string | null;
      isActive?: boolean;
    },
  ) => {
    if (!selectedUser) {
      return;
    }

    try {
      setIsUpdatingStaff(true);

      const response =
        await adminApi.updateInternalStaff(
          selectedUser.id,
          data,
        );

      const updatedStaff =
        response.user;

      /*
       * Convert the updated backend User
       * into the same shape used by the table.
       */
      const updatedRow =
        mapStaffToTableRow({
          _id:
            updatedStaff._id,
          fullName:
            updatedStaff.fullName,
          email:
            updatedStaff.email,
          phone:
            updatedStaff.phone,
          role:
            updatedStaff.role,
          department:
            updatedStaff.department,
          isActive:
            updatedStaff.isActive,
          isVerified:
            updatedStaff.isVerified,
          createdAt:
            updatedStaff.createdAt,
        });

      /*
       * Update the table immediately.
       */
      setStaff((prev) =>
        prev.map((member) =>
          member.id ===
          updatedRow.id
            ? updatedRow
            : member,
        ),
      );

      /*
       * Keep the detail drawer synchronized.
       */
      setSelectedUser(
        updatedRow,
      );

      /*
       * Close the edit modal only after
       * the backend confirms the update.
       */
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(
        "Failed to update Internal Staff:",
        error,
      );

      /*
       * Re-throw so the modal remains open
       * and displays its error state.
       */
      throw error;
    } finally {
      setIsUpdatingStaff(false);
    }
  };

  const filteredStaff = staff.filter(
    (member) =>
      member.name
        .toLowerCase()
        .includes(
          searchQuery.toLowerCase(),
        ) ||
      member.role
        .toLowerCase()
        .includes(
          searchQuery.toLowerCase(),
        ) ||
      member.department
        .toLowerCase()
        .includes(
          searchQuery.toLowerCase(),
        ),
  );

  /*
   * REAL INTERNAL STAFF KPI CALCULATIONS
   */

  const totalStaff =
    staff.length;

  const activeStaff =
    staff.filter(
      (member) =>
        member.isActive,
    ).length;

  const managementStaff =
    staff.filter((member) =>
      member.role
        .toLowerCase()
        .includes("manager"),
    ).length;

  const pendingOnboarding =
    staff.filter(
      (member) =>
        !member.isVerified,
    ).length;

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Internal Staff"
        subtitle="Manage Luxora operational employees and department access."
        actions={
          <GoldButton
            onClick={() =>
              setIsProvisionModalOpen(
                true,
              )
            }
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Add Staff
          </GoldButton>
        }
      />

      {/* REAL INTERNAL STAFF KPI CARDS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Staff"
          value={
            isLoadingStaff
              ? "—"
              : String(totalStaff)
          }
          icon={Briefcase}
          trend="Registered on platform"
          trendColor="text-ink/50"
          iconColor="text-blue-400"
        />

        <KPICard
          title="Active Staff"
          value={
            isLoadingStaff
              ? "—"
              : String(activeStaff)
          }
          icon={CheckCircle}
          trend="Currently active"
          trendColor="text-emerald-400"
          iconColor="text-emerald-400"
        />

        <KPICard
          title="Management"
          value={
            isLoadingStaff
              ? "—"
              : String(managementStaff)
          }
          icon={ShieldCheck}
          trend="Management team"
          trendColor="text-emerald-400"
          iconColor="text-gold-400"
        />

        <KPICard
          title="Pending Onboarding"
          value={
            isLoadingStaff
              ? "—"
              : String(
                  pendingOnboarding,
                )
          }
          icon={Clock}
          trend="Awaiting verification"
          trendColor="text-yellow-400"
          iconColor="text-yellow-400"
          backgroundColor="bg-yellow-400/10"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <div className="space-y-6">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search staff by name, role, or department..."
            showFilter
          />

          <DataTable
            data={filteredStaff}
            isLoading={isLoadingStaff}
            keyExtractor={(member) =>
              member.id
            }
            columns={[
              {
                header: "Staff ID",
                render: (member) => (
                  <span className="font-medium text-cream">
                    STF-
                    {String(
                      staff.findIndex(
                        (item) =>
                          item.id ===
                          member.id,
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
                render: (member) => (
                  <span className="font-semibold text-cream">
                    {member.name}
                  </span>
                ),
              },

              {
                header: "Role",
                render: (member) => (
                  <span className="text-ink/60">
                    {member.role}
                  </span>
                ),
              },

              {
                header: "Department",
                render: (member) => (
                  <span className="text-ink/60">
                    {member.department}
                  </span>
                ),
              },

              {
                header: "Joined Date",
                render: (member) => (
                  <span className="text-ink/60">
                    {member.joined}
                  </span>
                ),
              },

              {
                header: "Status",
                render: (member) => (
                  <EnterpriseStatusBadge
                    status={
                      member.status
                    }
                  />
                ),
              },

              {
                header: "Verification",
                render: (member) => (
                  <span
                    className={`text-sm font-medium ${
                      member.isVerified
                        ? "text-emerald-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {member.isVerified
                      ? "Verified"
                      : "Not Verified"}
                  </span>
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
                render: (member) => (
                  <div className="relative flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId ===
                            String(
                              member.id,
                            )
                            ? null
                            : String(
                                member.id,
                              ),
                        )
                      }
                      className="rounded-lg p-2 text-ink/40 transition-colors hover:bg-white/10 hover:text-cream"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {openMenuId ===
                      String(
                        member.id,
                      ) && (
                      <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-navy-900 shadow-xl">
                        <div className="space-y-1 p-2">
                          {/* View Details */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(
                                member,
                              );
                              setOpenMenuId(
                                null,
                              );
                            }}
                            className="w-full rounded-lg px-3 py-2 text-left text-xs text-cream hover:bg-white/5"
                          >
                            View Details
                          </button>

                          {/* Verify / Unverify */}
                          {!member.isVerified ? (
                            <button
                              type="button"
                              onClick={() => {
                                void handleVerificationChange(
                                  String(
                                    member.id,
                                  ),
                                  true,
                                );

                                setOpenMenuId(
                                  null,
                                );
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-emerald-400 hover:bg-white/5"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Verify Staff
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                void handleVerificationChange(
                                  String(
                                    member.id,
                                  ),
                                  false,
                                );

                                setOpenMenuId(
                                  null,
                                );
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-yellow-400 hover:bg-white/5"
                            >
                              <ShieldCheck className="h-3 w-3" />
                              Unverify Staff
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
            emptyState={
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/5 bg-navy-900/50 py-12 text-center">
                <SearchX className="mb-4 h-12 w-12 text-ink/20" />

                <h3 className="text-lg font-bold text-cream">
                  No staff found
                </h3>

                <p className="mt-1 text-sm text-ink/50">
                  Try adjusting your
                  search or filters.
                </p>
              </div>
            }
          />
        </div>
      </div>

      {/* STAFF DETAIL DRAWER */}
      <EnterpriseDetailDrawer
        isOpen={!!selectedUser}
        onClose={() =>
          setSelectedUser(null)
        }
        title="Staff Details"
        subtitle={
          selectedUser?.name
        }
        footerActions={
          <button
            type="button"
            disabled={!selectedUser}
            onClick={
              handleOpenEditModal
            }
            className="w-full rounded-xl bg-gold-400 py-3 text-sm font-bold text-navy-900 transition-colors hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Edit Access
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

            <div>
              <div className="mb-1 text-xs uppercase tracking-wider text-ink/60">
                Verification
              </div>

              <div
                className={`text-sm font-semibold ${
                  selectedUser.isVerified
                    ? "text-emerald-400"
                    : "text-yellow-400"
                }`}
              >
                {selectedUser.isVerified
                  ? "Verified"
                  : "Not Verified"}
              </div>
            </div>

            <div>
              <div className="mb-1 text-xs uppercase tracking-wider text-ink/60">
                Role
              </div>

              <div className="text-sm font-semibold text-cream">
                {selectedUser.role}
              </div>
            </div>

            <div>
              <div className="mb-1 text-xs uppercase tracking-wider text-ink/60">
                Department
              </div>

              <div className="text-sm font-semibold text-cream">
                {selectedUser.department}
              </div>
            </div>

            <div>
              <div className="mb-1 text-xs uppercase tracking-wider text-ink/60">
                Email
              </div>

              <div className="break-all text-sm font-semibold text-cream">
                {selectedUser.email}
              </div>
            </div>

            <div>
              <div className="mb-1 text-xs uppercase tracking-wider text-ink/60">
                Phone
              </div>

              <div className="text-sm font-semibold text-cream">
                {selectedUser.phone ||
                  "Not provided"}
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

      {/* EDIT INTERNAL STAFF MODAL */}
      <EditInternalStaffModal
        isOpen={isEditModalOpen}
        staff={
          selectedUser
            ? {
                _id:
                  selectedUser.id,
                fullName:
                  selectedUser.name,
                email:
                  selectedUser.email,
                phone:
                  selectedUser.phone,
                role:
                  selectedUser.role,
                department:
                  selectedUser.department,
                isActive:
                  selectedUser.isActive,
                isVerified:
                  selectedUser.isVerified,
              }
            : null
        }
        isSaving={isUpdatingStaff}
        onClose={() =>
          setIsEditModalOpen(false)
        }
        onSave={
          handleStaffUpdate
        }
      />

      {/* INTERNAL STAFF PROVISIONING */}
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
        fixedType="internal_staff"
        onInternalStaffCreated={() => {
          void fetchInternalStaff();
        }}
      />
    </div>
  );
}