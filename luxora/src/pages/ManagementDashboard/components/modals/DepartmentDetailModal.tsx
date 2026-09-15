import {
  Building2,
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';

import { Modal } from '../../../../components/ui/Modal';
import { GhostButton } from '../../../../components/ui/ui';
import { StatusBadge } from '../shared/StatusBadge';

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

interface DepartmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
}

export function DepartmentDetailModal({
  isOpen,
  onClose,
  department,
}: DepartmentDetailModalProps) {
  if (!department) {
    return null;
  }

  const activePercentage =
    department.total > 0
      ? Math.round(
          (department.active / department.total) * 100
        )
      : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Department Details"
      size="xl"
    >
      <div className="space-y-6 pb-4">
        {/* Department Header */}
        <div className="flex flex-col gap-5 border-b border-white/5 pb-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-gold-400/20 bg-gold-400/10 text-gold-400">
            <Building2 className="h-10 w-10" />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-cream">
              {department.name}
            </h2>

            <p className="mt-1 text-sm text-ink/50">
              {department.total}{' '}
              {department.total === 1
                ? 'team member'
                : 'team members'}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {department.roles.map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-white/10 bg-navy-900/60 px-3 py-1 text-xs text-ink/60"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          <GhostButton
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-sm"
          >
            Close
          </GhostButton>
        </div>

        {/* Staffing Overview */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/5 bg-navy-900/50 p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs text-ink/40">
                Total Staff
              </span>

              <Users className="h-4 w-4 text-gold-400" />
            </div>

            <p className="text-2xl font-bold text-cream">
              {department.total}
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-navy-900/50 p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs text-ink/40">
                Active Staff
              </span>

              <UserCheck className="h-4 w-4 text-emerald-400" />
            </div>

            <p className="text-2xl font-bold text-emerald-400">
              {department.active}
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-navy-900/50 p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs text-ink/40">
                Inactive Staff
              </span>

              <UserX className="h-4 w-4 text-rose-400" />
            </div>

            <p className="text-2xl font-bold text-rose-400">
              {department.inactive}
            </p>
          </div>
        </div>

        {/* Staffing Coverage */}
        <div className="rounded-xl border border-white/5 bg-navy-900/50 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-cream">
                Active Staffing
              </h3>

              <p className="mt-1 text-xs text-ink/40">
                Current account activity within this department
              </p>
            </div>

            <span className="text-sm font-bold text-emerald-400">
              {activePercentage}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-navy-950">
            <div
              className="h-full rounded-full bg-emerald-400"
              style={{
                width: `${activePercentage}%`,
              }}
            />
          </div>
        </div>

        {/* Department Members */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-heading text-lg font-semibold text-cream">
                Department Members
              </h3>

              <p className="mt-1 text-xs text-ink/40">
                Actual personnel assigned to this department
              </p>
            </div>

            <Users className="h-5 w-5 text-ink/40" />
          </div>

          <div className="space-y-3">
            {department.members.map((member) => {
              const createdDate = member.createdAt
                ? new Date(
                    member.createdAt
                  ).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Not available';

              return (
                <div
                  key={member.id}
                  className="rounded-xl border border-white/5 bg-navy-900/50 p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-11 w-11 shrink-0 rounded-full border border-white/5 object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/5 bg-navy-700 text-sm font-bold text-gold-400">
                          {member.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="truncate text-sm font-semibold text-cream">
                            {member.name}
                          </h4>

                          <StatusBadge
                            status={member.status}
                          />
                        </div>

                        <p className="mt-1 text-xs text-ink/50">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-ink/50">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="max-w-[220px] truncate">
                          {member.email}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        <span>
                          {member.phone ||
                            'No phone'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {createdDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-white/5 pt-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        member.isVerified
                          ? 'bg-emerald-400/10 text-emerald-400'
                          : 'bg-yellow-400/10 text-yellow-400'
                      }`}
                    >
                      <ShieldCheck className="h-3 w-3" />

                      {member.isVerified
                        ? 'Verified'
                        : 'Unverified'}
                    </span>

                    <span className="rounded-full border border-white/10 bg-navy-800/60 px-2.5 py-1 text-[10px] text-ink/50">
                      {member.department ||
                        'Unassigned'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Scope */}
        <div className="rounded-xl border border-white/5 bg-navy-900/50 p-5">
          <p className="text-xs leading-relaxed text-ink/50">
            This department view currently reflects the real
            personnel data stored on Luxora staff accounts.
            Budget allocation, departmental risk, initiatives,
            and performance scores are not displayed until
            those systems are backed by real data.
          </p>
        </div>
      </div>
    </Modal>
  );
}