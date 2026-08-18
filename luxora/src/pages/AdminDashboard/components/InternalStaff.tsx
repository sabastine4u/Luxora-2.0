import { useState, useEffect, useCallback } from "react";
// Import the real Admin API used to load Internal Staff from MongoDB.
import { adminApi } from "../../../api/admin.api";
import {
  MoreHorizontal,
  SearchX,
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
import { GoldButton } from "../../../components/ui/ui";

// Represents the real Internal Staff fields currently used by this page.
type InternalStaffRow = {
  id: string;
  name: string;
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
  role: string;
  department?: string | null;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}): InternalStaffRow => ({
  // Use the MongoDB User ID as the staff identifier.
  id: apiStaff._id,

  // Display the real staff member's full name.
  name: apiStaff.fullName,

  // Display the real Internal Staff role.
  role: apiStaff.role,

  // Display the real department.
  department: apiStaff.department || "",

  // Preserve the account's operational state.
  isActive: apiStaff.isActive,

  // Preserve the backend verification state.
  isVerified: apiStaff.isVerified,

  // Convert the backend active flag into the existing table status.
  status: apiStaff.isActive ? "Active" : "Suspended",

  // Format the MongoDB creation date for the existing table column.
  joined: new Date(apiStaff.createdAt).toLocaleDateString(),
});

export default function InternalStaff() {
  // Store the current search text used by the staff table.
  const [searchQuery, setSearchQuery] = useState("");



// Store the currently selected staff member for the detail drawer.
const [selectedUser, setSelectedUser] = useState<InternalStaffRow | null>(null);

  // Track whether the Internal Staff provisioning modal is open.
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);

  /// Store the real Internal Staff records returned by the backend.
const [staff, setStaff] = useState<InternalStaffRow[]>([]);

  // Track whether the Internal Staff request is currently loading.
  const [isLoadingStaff, setIsLoadingStaff] = useState(true);
// Convert a backend Internal Staff record into the shape used by this page.


  // Load the real Internal Staff accounts from the backend.
const fetchInternalStaff = useCallback(async () => {
  try {
    // Show the loading state before requesting the staff list.
    setIsLoadingStaff(true);

    // Request all six approved Internal Staff roles from the backend.
    const response = await adminApi.getInternalStaff();

    // Convert the backend records into the table shape used by this page.
    setStaff(response.staff.map(mapStaffToTableRow));
  } catch (error) {
    // Log the error while preserving the existing testing behavior.
    console.error("Failed to load internal staff:", error);

    // Clear the table instead of showing stale data when the request fails.
    setStaff([]);
  } finally {
    // Always stop the loading state after the request completes.
    setIsLoadingStaff(false);
  }
}, []);

 // Load the real Internal Staff list when the page first opens.
useEffect(() => {
  void fetchInternalStaff();
}, [fetchInternalStaff]);

  // Store the ID of the Internal Staff member whose Actions menu is open.
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Change the verification state of an Internal Staff account.
  const handleVerificationChange = async (
    staffId: string,
    isVerified: boolean,
  ) => {
    try {
      // Send the requested verification state to the real backend.
      const response = await adminApi.updateInternalStaffVerification(
        staffId,
        isVerified,
      );

      // Update the matching staff member locally so the UI changes immediately.
      setStaff((prev) =>
        prev.map((member) =>
          member.id === staffId
            ? {
              ...member,
              isVerified: response.user.isVerified,
            }
            : member,
        ),
      );

      // Keep the currently selected detail drawer synchronized if it is open.
      setSelectedUser((current) =>
        current && current.id === staffId
          ? {
            ...current,
            isVerified: response.user.isVerified,
          }
          : current,
      );
    } catch (error) {
      // Log the real backend/API error during testing.
      console.error("Failed to update Internal Staff verification:", error);

      // Show a simple temporary error until we connect the project's toast system here.
      alert("Failed to update staff verification. Please try again.");
    }
  };

  const filteredStaff = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Internal Staff"
        subtitle="Manage Luxora operational employees and department access."
        actions={
          <GoldButton
            onClick={() => setIsProvisionModalOpen(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" /> Add Staff
          </GoldButton>
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Staff"
          value="48"
          icon={Briefcase}
          trend="+3 this month"
          trendColor="text-emerald-400"
          iconColor="text-blue-400"
        />
        <KPICard
          title="Active Staff"
          value="45"
          icon={CheckCircle}
          trend="Operations Normal"
          trendColor="text-emerald-400"
          iconColor="text-emerald-400"
        />
        <KPICard
          title="Management"
          value="12"
          icon={ShieldCheck}
          trend="Leadership Team"
          trendColor="text-emerald-400"
          iconColor="text-gold-400"
        />
        <KPICard
          title="Pending Onboarding"
          value="3"
          icon={Clock}
          trend="Action Required"
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
  keyExtractor={(staff) => staff.id}
            columns={[
              {
                header: "Staff ID",
                render: (staff) => (
                  <span className="font-medium text-cream">{staff.id}</span>
                ),
              },
              {
                header: "Name",
                render: (staff) => (
                  <span className="font-semibold text-cream">{staff.name}</span>
                ),
              },
              {
                header: "Role",
                render: (staff) => (
                  <span className="text-ink/60">{staff.role}</span>
                ),
              },
              {
                header: "Department",
                render: (staff) => (
                  <span className="text-ink/60">{staff.department}</span>
                ),
              },
              {
                header: "Joined Date",
                render: (staff) => (
                  <span className="text-ink/60">{staff.joined}</span>
                ),
              },
              {
                header: "Status",
                render: (staff) => (
                  <EnterpriseStatusBadge status={staff.status} />
                ),
              },
              {
                // Show the real verification state separately from the account's active status.
                header: "Verification",
                render: (staff) => (
                  // Use green for verified accounts and yellow for accounts still awaiting verification.
                  <span
                    className={`text-sm font-medium ${staff.isVerified ? "text-emerald-400" : "text-yellow-400"
                      }`}
                  >
                    {/* Read the actual isVerified value returned by the backend. */}
                    {staff.isVerified ? "Verified" : "Not Verified"}
                  </span>
                ),
              },
              {
                header: <div className="text-right">Actions</div>,
                className: "text-right",
                render: (staff) => (
                  <div className="relative flex justify-end">
                    {/* Open the action menu for this specific staff member. */}
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === String(staff.id)
                            ? null
                            : String(staff.id),
                        )
                      }
                      className="rounded-lg p-2 text-ink/40 hover:bg-white/10 hover:text-cream transition-colors"
                    >
                      {/* Show the three-dot actions icon. */}
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {/* Only render the menu for the staff member whose actions are open. */}
                    {openMenuId === String(staff.id) && (
                      <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-navy-900 shadow-xl z-50 overflow-hidden">
                        <div className="p-2 space-y-1">
                          {/* Open the existing detail drawer for this staff member. */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(staff);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-3 py-2 text-xs text-cream hover:bg-white/5 rounded-lg"
                          >
                            View Details
                          </button>

                          {/* Verify an account that is currently unverified. */}
                          {!staff.isVerified ? (
                            <button
                              type="button"
                              onClick={() => {
                                handleVerificationChange(
                                  String(staff.id),
                                  true,
                                );
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-emerald-400 hover:bg-white/5 rounded-lg flex items-center gap-2"
                            >
                              {/* Reuse the existing check icon for verification. */}
                              <CheckCircle className="h-3 w-3" />
                              Verify Staff
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                handleVerificationChange(
                                  String(staff.id),
                                  false,
                                );
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-yellow-400 hover:bg-white/5 rounded-lg flex items-center gap-2"
                            >
                              {/* Use the same action to reverse verification. */}
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
              <div className="flex flex-col items-center justify-center py-12 text-center bg-navy-900/50 rounded-xl border border-white/5 border-dashed">
                <SearchX className="h-12 w-12 text-ink/20 mb-4" />
                <h3 className="text-lg font-bold text-cream">No staff found</h3>
                <p className="text-sm text-ink/50 mt-1">
                  Try adjusting your search or filters.
                </p>
              </div>
            }
          />
        </div>
      </div>

      <EnterpriseDetailDrawer
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="Staff Details"
        subtitle={selectedUser?.name}
        footerActions={
          <button className="w-full rounded-xl bg-gold-400 py-3 text-sm font-bold text-navy-900 transition-colors hover:bg-gold-300">
            Edit Access
          </button>
        }
      >
        {selectedUser && (
          <div className="space-y-6">
            <div>
              <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                Status
              </div>
              <EnterpriseStatusBadge status={selectedUser.status} />
            </div>
            <div>
              {/* Label the verification state separately from account status. */}
              <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                Verification
              </div>

              {/* Display the actual backend verification state. */}
              <div
                className={`text-sm font-semibold ${selectedUser.isVerified
                    ? "text-emerald-400"
                    : "text-yellow-400"
                  }`}
              >
                {selectedUser.isVerified ? "Verified" : "Not Verified"}
              </div>
            </div>
            <div>
              <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                Role
              </div>
              <div className="text-sm font-semibold text-cream">
                {selectedUser.role}
              </div>
            </div>
            <div>
              <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                Department
              </div>
              <div className="text-sm font-semibold text-cream">
                {selectedUser.department}
              </div>
            </div>
            <div>
              <div className="text-xs text-ink/60 uppercase tracking-wider mb-1">
                Joined Date
              </div>
              <div className="text-sm font-semibold text-cream">
                {selectedUser.joined}
              </div>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <ProvisionUserModal
        isOpen={isProvisionModalOpen}
        onClose={() => setIsProvisionModalOpen(false)}
        mode="admin"
        fixedType="internal_staff"
        // Refresh the real Internal Staff list after successful staff creation.
        onInternalStaffCreated={() => {
          void fetchInternalStaff();
        }}
      />
    </div>
  );
}
