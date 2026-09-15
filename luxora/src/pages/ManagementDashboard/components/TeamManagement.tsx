import { useEffect, useMemo, useState } from 'react';
import {
  Users,
  Filter,
  CheckCircle2,
  UserCheck,
  UserX,
  Activity,
  ShieldCheck,
  Search,
} from 'lucide-react';

import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { GhostButton } from '../../../components/ui/ui';
import { StatusBadge } from './shared/StatusBadge';
import { ManagementTeamDetailModal } from './modals/ManagementTeamDetailModal';

import { managementApi } from '../../../api/management.api';

import type { TeamMember } from '../../../types';

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] =
    useState<TeamMember | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchValue, setSearchValue] = useState('');

  const [selectedDepartment, setSelectedDepartment] =
    useState('All Departments');

  useEffect(() => {
    const loadTeam = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await managementApi.getTeam();

        setTeamMembers(response?.team ?? []);
      } catch (err) {
        console.error('Failed to load management team:', err);

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load management team.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadTeam();
  }, []);

  /*
   * Build department options from the actual team data.
   *
   * Department is informational in the current system,
   * so we do not hardcode the five original UI departments.
   */
  const departments = useMemo(() => {
    const uniqueDepartments = Array.from(
      new Set(
        teamMembers
          .map((member) => member.department)
          .filter(Boolean)
      )
    ) as string[];

    return ['All Departments', ...uniqueDepartments];
  }, [teamMembers]);

  /*
   * Filter the real team locally.
   *
   * Search works against:
   * - name
   * - email
   * - role
   * - department
   */
  const filteredTeamMembers = useMemo(() => {
    const normalizedSearch = searchValue
      .trim()
      .toLowerCase();

    return teamMembers.filter((member) => {
      const matchesSearch =
        !normalizedSearch ||
        member.name
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        member.email
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        member.role
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        member.department
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesDepartment =
        selectedDepartment === 'All Departments' ||
        member.department === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }, [
    teamMembers,
    searchValue,
    selectedDepartment,
  ]);

  /*
   * These values come from the actual returned users.
   */
  const totalMembers = teamMembers.length;

  const activeMembers = teamMembers.filter(
    (member) => member.isActive
  ).length;

  const inactiveMembers =
    totalMembers - activeMembers;

  const verifiedMembers = teamMembers.filter(
    (member) => member.isVerified
  ).length;

  /*
   * Department distribution from actual records.
   */
  const departmentDistribution = useMemo(() => {
    const counts = new Map<string, number>();

    teamMembers.forEach((member) => {
      const department =
        member.department || 'Unassigned';

      counts.set(
        department,
        (counts.get(department) ?? 0) + 1
      );
    });

    return Array.from(counts.entries())
      .map(([department, count]) => ({
        department,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [teamMembers]);

  const handleRowClick = (
    member: TeamMember
  ) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Team Management"
        subtitle="Manage cross-department personnel, workforce distribution, and enterprise capacity."
        actions={<div className="flex gap-3" />}
      />

      {/* Real Team KPIs */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Team Members"
          value={isLoading ? '—' : String(totalMembers)}
          trend="Internal workforce"
          trendColor="text-ink/60"
          icon={Users}
          footer={
            <div className="text-xs text-ink/60">
              Operational dashboard roles
            </div>
          }
        />

        <KPICard
          title="Active Members"
          value={isLoading ? '—' : String(activeMembers)}
          trend={
            isLoading
              ? 'Loading...'
              : `${inactiveMembers} inactive`
          }
          trendColor={
            inactiveMembers > 0
              ? 'text-yellow-400'
              : 'text-emerald-400'
          }
          icon={UserCheck}
          footer={
            <div className="text-xs text-ink/60">
              Currently active accounts
            </div>
          }
        />

        <KPICard
          title="Inactive Members"
          value={isLoading ? '—' : String(inactiveMembers)}
          trend={
            inactiveMembers > 0
              ? 'Requires attention'
              : 'All active'
          }
          trendColor={
            inactiveMembers > 0
              ? 'text-rose-400'
              : 'text-emerald-400'
          }
          icon={UserX}
          footer={
            <div className="text-xs text-ink/60">
              Account activity status
            </div>
          }
        />

        <KPICard
          title="Verified Accounts"
          value={isLoading ? '—' : String(verifiedMembers)}
          trend={
            isLoading
              ? 'Loading...'
              : `${Math.max(
                  totalMembers - verifiedMembers,
                  0
                )} unverified`
          }
          trendColor={
            verifiedMembers === totalMembers
              ? 'text-emerald-400'
              : 'text-yellow-400'
          }
          icon={ShieldCheck}
          footer={
            <div className="text-xs text-ink/60">
              Account verification status
            </div>
          }
        />
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-4">
          <div className="flex items-start gap-3">
            <Activity className="h-5 w-5 shrink-0 text-rose-400" />

            <div>
              <p className="text-sm font-semibold text-cream">
                Unable to load team
              </p>

              <p className="mt-1 text-xs text-ink/70">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="space-y-6 lg:col-span-3">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Real Workforce Distribution */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <h3 className="mb-4 font-heading text-lg font-semibold text-cream">
                Workforce Distribution
              </h3>

              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="space-y-2 animate-pulse"
                      >
                        <div className="h-3 w-2/3 rounded bg-navy-700" />
                        <div className="h-1.5 w-full rounded bg-navy-700" />
                      </div>
                    )
                  )}
                </div>
              ) : departmentDistribution.length === 0 ? (
                <div className="py-8 text-center text-sm text-ink/60">
                  No department data available.
                </div>
              ) : (
                <div className="space-y-4">
                  {departmentDistribution.map(
                    (department) => {
                      const percentage =
                        totalMembers > 0
                          ? Math.round(
                              (department.count /
                                totalMembers) *
                                100
                            )
                          : 0;

                      return (
                        <div
                          key={department.department}
                          className="flex flex-col gap-1"
                        >
                          <div className="flex justify-between text-xs">
                            <span className="text-ink/60">
                              {department.department}
                            </span>

                            <span className="font-medium text-cream">
                              {department.count}{' '}
                              {department.count === 1
                                ? 'Member'
                                : 'Members'}
                            </span>
                          </div>

                          <div className="h-1.5 w-full overflow-hidden rounded-full border border-white/5 bg-navy-950">
                            <div
                              className="h-full bg-gold-400 transition-all"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* Department Coverage */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading text-lg font-semibold text-cream">
                  Department Coverage
                </h3>

                <span className="text-xs text-ink/60">
                  Current Team
                </span>
              </div>

              {isLoading ? (
                <div className="grid flex-1 grid-cols-2 gap-3">
                  {Array.from({ length: 6 }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="animate-pulse rounded-lg border border-white/5 bg-navy-900/50"
                      />
                    )
                  )}
                </div>
              ) : departmentDistribution.length ===
                0 ? (
                <div className="flex min-h-[160px] items-center justify-center text-sm text-ink/60">
                  No department data available.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {departmentDistribution.map(
                    (department) => (
                      <div
                        key={department.department}
                        className="rounded-lg border border-white/5 bg-navy-900/50 p-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-xs text-ink/60">
                            {department.department}
                          </span>

                          <span className="text-sm font-bold text-cream">
                            {department.count}
                          </span>
                        </div>

                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy-950">
                          <div
                            className="h-full bg-emerald-400"
                            style={{
                              width: `${Math.max(
                                (department.count /
                                  Math.max(
                                    ...departmentDistribution.map(
                                      (item) =>
                                        item.count
                                    )
                                  )) *
                                  100,
                                8
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Personnel Directory */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-heading text-lg font-semibold text-cream">
                  Personnel Directory
                </h3>

                {!isLoading && (
                  <p className="mt-1 text-xs text-ink/50">
                    Showing {filteredTeamMembers.length} of{' '}
                    {teamMembers.length} team members
                  </p>
                )}
              </div>

              <DataTableToolbar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                searchPlaceholder="Search personnel..."
                actions={
                  <div className="flex gap-2">
                    <GhostButton
                      type="button"
                      className="px-3"
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </GhostButton>
                  </div>
                }
              />
            </div>

            {/* Department Filter */}
            <div className="mb-5 flex flex-wrap gap-2">
              {departments.map((department) => {
                const isSelected =
                  selectedDepartment === department;

                return (
                  <button
                    key={department}
                    type="button"
                    onClick={() =>
                      setSelectedDepartment(
                        department
                      )
                    }
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      isSelected
                        ? 'border-gold-400/40 bg-gold-400/10 text-gold-400'
                        : 'border-white/10 bg-navy-900/50 text-ink/60 hover:text-cream'
                    }`}
                  >
                    {department}
                  </button>
                );
              })}
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="h-14 animate-pulse rounded-lg bg-navy-900/50"
                    />
                  )
                )}
              </div>
            ) : filteredTeamMembers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="mb-3 h-8 w-8 text-ink/30" />

                <h4 className="text-sm font-semibold text-cream">
                  No team members found
                </h4>

                <p className="mt-1 max-w-sm text-xs text-ink/50">
                  Try changing your search or department
                  filter.
                </p>
              </div>
            ) : (
              <DataTable
                data={filteredTeamMembers}
                keyExtractor={(member) => member.id}
                onRowClick={handleRowClick}
                columns={[
                  {
                    header: 'Name',
                    render: (member) => (
                      <div className="flex items-center gap-3 font-semibold text-cream">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="h-8 w-8 rounded-full border border-white/5 object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-navy-700 text-xs font-bold text-gold-400">
                            {member.name
                              ?.charAt(0)
                              ?.toUpperCase() || '?'}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="truncate">
                            {member.name}
                          </div>

                          <div className="truncate text-xs font-normal text-ink/40">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    header: 'Role',
                    render: (member) => (
                      <span className="text-ink/60">
                        {member.role}
                      </span>
                    ),
                  },
                  {
                    header: 'Department',
                    render: (member) => (
                      <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-900/50 px-2.5 py-0.5 text-xs text-ink/60">
                        {member.department ||
                          'Unassigned'}
                      </span>
                    ),
                  },
                  {
                    header: 'Verification',
                    render: (member) => (
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium ${
                          member.isVerified
                            ? 'text-emerald-400'
                            : 'text-yellow-400'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />

                        {member.isVerified
                          ? 'Verified'
                          : 'Unverified'}
                      </span>
                    ),
                  },
                  {
                    header: 'Status',
                    render: (member) => (
                      <StatusBadge
                        status={member.status}
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
                    render: (member) => (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleRowClick(member);
                        }}
                        className="text-sm font-medium text-gold-400 hover:underline"
                      >
                        View Profile
                      </button>
                    ),
                  },
                ]}
              />
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Team Summary */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-gold-400" />

              <h3 className="font-heading text-lg font-semibold text-cream">
                Team Summary
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg p-2 hover:bg-white/5">
                <span className="text-sm text-ink/80">
                  Total Members
                </span>

                <span className="text-sm font-medium text-cream">
                  {isLoading ? '—' : totalMembers}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg p-2 hover:bg-white/5">
                <span className="text-sm text-ink/80">
                  Active
                </span>

                <span className="text-sm font-medium text-emerald-400">
                  {isLoading ? '—' : activeMembers}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg p-2 hover:bg-white/5">
                <span className="text-sm text-ink/80">
                  Inactive
                </span>

                <span className="text-sm font-medium text-rose-400">
                  {isLoading ? '—' : inactiveMembers}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg p-2 hover:bg-white/5">
                <span className="text-sm text-ink/80">
                  Verified
                </span>

                <span className="text-sm font-medium text-blue-400">
                  {isLoading
                    ? '—'
                    : verifiedMembers}
                </span>
              </div>
            </div>
          </div>

          {/* Roles Covered */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />

              <h3 className="font-heading text-lg font-semibold text-cream">
                Operational Roles
              </h3>
            </div>

            <div className="space-y-2">
              {[
                'Procurement Officer',
                'Finance Manager',
                'Data Analyst',
                'Property Manager',
                'Service Manager',
              ].map((role) => {
                const roleCount =
                  teamMembers.filter(
                    (member) =>
                      member.role === role
                  ).length;

                return (
                  <div
                    key={role}
                    className="flex items-center justify-between rounded-lg p-2 hover:bg-white/5"
                  >
                    <span className="text-xs text-ink/70">
                      {role}
                    </span>

                    <span className="text-xs font-semibold text-cream">
                      {isLoading
                        ? '—'
                        : roleCount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ManagementTeamDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        member={selectedMember}
      />
    </div>
  );
}