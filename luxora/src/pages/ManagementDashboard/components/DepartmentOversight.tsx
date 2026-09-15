import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Users,
  UserCheck,
  UserX,
  ChevronRight,
  Search,
  ShieldCheck,
} from 'lucide-react';

import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { departmentApi } from '../../../api/department.api';

interface DepartmentMember {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  department: string | null;
  status: string;
  isActive: boolean;
  isVerified: boolean;
  avatar: string | null;
  createdAt: string;
}

interface Department {
  name: string;
  total: number;
  active: number;
  inactive: number;
  roles: string[];
  members: DepartmentMember[];
}

export default function DepartmentOversight() {
  const [departments, setDepartments] = useState<
    Department[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [searchValue, setSearchValue] =
    useState('');

  const [selectedDepartment, setSelectedDepartment] =
    useState<string | null>(null);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response =
          await departmentApi.getDepartments();

        setDepartments(
          response?.departments ?? []
        );
      } catch (err) {
        console.error(
          'Failed to load departments:',
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load departments.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDepartments();
  }, []);

  const totalMembers = useMemo(
    () =>
      departments.reduce(
        (total, department) =>
          total + department.total,
        0
      ),
    [departments]
  );

  const activeMembers = useMemo(
    () =>
      departments.reduce(
        (total, department) =>
          total + department.active,
        0
      ),
    [departments]
  );

  const inactiveMembers = useMemo(
    () =>
      departments.reduce(
        (total, department) =>
          total + department.inactive,
        0
      ),
    [departments]
  );

  const filteredDepartments =
    useMemo(() => {
      const normalizedSearch =
        searchValue.trim().toLowerCase();

      return departments.filter(
        (department) => {
          if (!normalizedSearch) {
            return true;
          }

          return (
            department.name
              .toLowerCase()
              .includes(normalizedSearch) ||
            department.roles.some(
              (role) =>
                role
                  .toLowerCase()
                  .includes(
                    normalizedSearch
                  )
            ) ||
            department.members.some(
              (member) =>
                member.name
                  .toLowerCase()
                  .includes(
                    normalizedSearch
                  ) ||
                member.email
                  .toLowerCase()
                  .includes(
                    normalizedSearch
                  )
            )
          );
        }
      );
    }, [departments, searchValue]);

  const selected =
    departments.find(
      (department) =>
        department.name ===
        selectedDepartment
    ) ?? null;

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Department Oversight"
        subtitle="Monitor department structure, workforce distribution, and operational staffing across the enterprise."
        actions={<div className="flex gap-3" />}
      />

      {error && (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-4">
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 shrink-0 text-rose-400" />

            <div>
              <p className="text-sm font-semibold text-cream">
                Unable to load departments
              </p>

              <p className="mt-1 text-xs text-ink/60">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Department KPIs */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Departments"
          value={
            isLoading
              ? '—'
              : String(departments.length)
          }
          trend="Current organizational structure"
          trendColor="text-blue-400"
          icon={Building2}
          footer={
            <div className="text-xs text-ink/60">
              Departments represented by current staff
            </div>
          }
        />

        <KPICard
          title="Total Staff"
          value={
            isLoading
              ? '—'
              : String(totalMembers)
          }
          trend="Operational workforce"
          trendColor="text-gold-400"
          icon={Users}
          footer={
            <div className="text-xs text-ink/60">
              Across all represented departments
            </div>
          }
        />

        <KPICard
          title="Active Staff"
          value={
            isLoading
              ? '—'
              : String(activeMembers)
          }
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
          title="Inactive Staff"
          value={
            isLoading
              ? '—'
              : String(inactiveMembers)
          }
          trend={
            inactiveMembers > 0
              ? 'Requires attention'
              : 'All staff active'
          }
          trendColor={
            inactiveMembers > 0
              ? 'text-rose-400'
              : 'text-emerald-400'
          }
          icon={UserX}
          footer={
            <div className="text-xs text-ink/60">
              Current account status
            </div>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Department Directory */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-heading text-lg font-semibold text-cream">
                  Department Directory
                </h3>

                {!isLoading && (
                  <p className="mt-1 text-xs text-ink/50">
                    Showing{' '}
                    {filteredDepartments.length}{' '}
                    of {departments.length}{' '}
                    departments
                  </p>
                )}
              </div>

              <DataTableToolbar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                searchPlaceholder="Search departments..."
                actions={<div />}
              />
            </div>

            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({
                  length: 6,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="h-44 animate-pulse rounded-2xl border border-white/5 bg-navy-900/50"
                  />
                ))}
              </div>
            ) : filteredDepartments.length ===
              0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="mb-3 h-8 w-8 text-ink/30" />

                <h4 className="text-sm font-semibold text-cream">
                  No departments found
                </h4>

                <p className="mt-1 text-xs text-ink/50">
                  Try another department, role, or
                  staff name.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredDepartments.map(
                  (department) => {
                    const activePercentage =
                      department.total > 0
                        ? Math.round(
                            (department.active /
                              department.total) *
                              100
                          )
                        : 0;

                    return (
                      <button
                        key={department.name}
                        type="button"
                        onClick={() =>
                          setSelectedDepartment(
                            department.name
                          )
                        }
                        className={`rounded-2xl border p-5 text-left transition ${
                          selectedDepartment ===
                          department.name
                            ? 'border-gold-400/30 bg-gold-400/5'
                            : 'border-white/10 bg-navy-900/40 hover:border-white/20 hover:bg-white/5'
                        }`}
                      >
                        <div className="mb-4 flex items-start justify-between gap-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-navy-800 text-gold-400">
                              <Building2 className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                              <h4 className="truncate text-sm font-semibold text-cream">
                                {department.name}
                              </h4>

                              <p className="mt-1 text-xs text-ink/50">
                                {department.total}{' '}
                                {department.total ===
                                1
                                  ? 'member'
                                  : 'members'}
                              </p>
                            </div>
                          </div>

                          <ChevronRight className="h-4 w-4 shrink-0 text-ink/40" />
                        </div>

                        <div className="mb-4 flex flex-wrap gap-2">
                          {department.roles.map(
                            (role) => (
                              <span
                                key={role}
                                className="rounded-full border border-white/10 bg-navy-800/70 px-2.5 py-1 text-[10px] text-ink/60"
                              >
                                {role}
                              </span>
                            )
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-ink/60">
                              Active staffing
                            </span>

                            <span className="font-medium text-cream">
                              {department.active}/
                              {department.total}
                            </span>
                          </div>

                          <div className="h-1.5 overflow-hidden rounded-full bg-navy-950">
                            <div
                              className="h-full rounded-full bg-emerald-400"
                              style={{
                                width: `${activePercentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </div>

        {/* Selected Department */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-semibold text-cream">
                  Department Details
                </h3>

                <p className="mt-1 text-xs text-ink/50">
                  Select a department to inspect its
                  current staff.
                </p>
              </div>

              <ShieldCheck className="h-5 w-5 text-gold-400" />
            </div>

            {!selected ? (
              <div className="rounded-xl border border-white/5 bg-navy-900/50 p-6 text-center">
                <Building2 className="mx-auto mb-3 h-8 w-8 text-ink/30" />

                <p className="text-sm font-medium text-cream">
                  No department selected
                </p>

                <p className="mt-1 text-xs leading-relaxed text-ink/50">
                  Select one of the department cards to
                  view its current workforce.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <h4 className="text-base font-semibold text-cream">
                    {selected.name}
                  </h4>

                  <p className="mt-1 text-xs text-ink/50">
                    {selected.total}{' '}
                    {selected.total === 1
                      ? 'team member'
                      : 'team members'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                    <p className="text-[11px] text-ink/40">
                      Active
                    </p>

                    <p className="mt-1 text-xl font-bold text-emerald-400">
                      {selected.active}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
                    <p className="text-[11px] text-ink/40">
                      Inactive
                    </p>

                    <p className="mt-1 text-xl font-bold text-rose-400">
                      {selected.inactive}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/40">
                    Team Members
                  </p>

                  <div className="space-y-2">
                    {selected.members.map(
                      (member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 rounded-xl border border-white/5 bg-navy-900/40 p-3"
                        >
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="h-9 w-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/5 bg-navy-700 text-xs font-bold text-gold-400">
                              {member.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-cream">
                              {member.name}
                            </p>

                            <p className="truncate text-[10px] text-ink/40">
                              {member.role}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 text-[10px] font-semibold ${
                              member.isActive
                                ? 'text-emerald-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {member.status}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}