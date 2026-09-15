import {
  Mail,
  Phone,
  Calendar,
  Briefcase,
  ShieldCheck,
  User,
} from 'lucide-react';

import { Modal } from '../../../../components/ui/Modal';
import { GhostButton } from '../../../../components/ui/ui';
import { StatusBadge } from '../shared/StatusBadge';

import type { TeamMember } from '../../../../types';

interface ManagementTeamDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
}

export function ManagementTeamDetailModal({
  isOpen,
  onClose,
  member,
}: ManagementTeamDetailModalProps) {
  if (!member) return null;

  const joinedDate = member.createdAt
    ? new Date(member.createdAt).toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }
      )
    : 'Not available';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Team Member Profile"
      size="xl"
    >
      <div className="space-y-6 pb-4">
        {/* Profile Header */}
        <div className="flex flex-col items-start gap-6 border-b border-white/5 pb-6 md:flex-row">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gold-gradient text-4xl font-bold text-navy-900">
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={member.name}
                className="h-full w-full object-cover"
              />
            ) : (
              member.name.charAt(0).toUpperCase()
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-cream">
                {member.name}
              </h2>

              <p className="mt-1 text-lg text-ink/60">
                {member.role}
              </p>

              <p className="mt-1 text-sm text-ink/40">
                {member.department || 'Department not assigned'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusBadge status={member.status} />

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-1 text-xs font-semibold text-ink/70">
                <ShieldCheck className="h-3.5 w-3.5" />

                {member.isVerified
                  ? 'Verified Account'
                  : 'Unverified Account'}
              </span>
            </div>

            <div className="pt-1">
              <GhostButton
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-sm"
              >
                Close Profile
              </GhostButton>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-white/5 bg-navy-900/50 p-5">
            <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-semibold text-cream">
              <User className="h-4 w-4 text-ink/60" />
              Account Information
            </h3>

            <div className="space-y-4">
              <div>
                <p className="mb-1 text-xs text-ink/40">
                  Full Name
                </p>

                <p className="text-sm text-cream">
                  {member.name}
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs text-ink/40">
                  Role
                </p>

                <p className="text-sm text-cream">
                  {member.role}
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs text-ink/40">
                  Department
                </p>

                <p className="text-sm text-cream">
                  {member.department ||
                    'Not assigned'}
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs text-ink/40">
                  Account Status
                </p>

                <p className="text-sm text-cream">
                  {member.isActive
                    ? 'Active'
                    : 'Inactive'}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="rounded-xl border border-white/5 bg-navy-900/50 p-5">
            <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-semibold text-cream">
              <Briefcase className="h-4 w-4 text-ink/60" />
              Contact & Employment
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ink/40" />

                <div className="min-w-0">
                  <p className="mb-1 text-xs text-ink/40">
                    Email
                  </p>

                  <p className="truncate text-sm text-cream">
                    {member.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ink/40" />

                <div>
                  <p className="mb-1 text-xs text-ink/40">
                    Phone
                  </p>

                  <p className="text-sm text-cream">
                    {member.phone ||
                      'Phone number not available'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-ink/40" />

                <div>
                  <p className="mb-1 text-xs text-ink/40">
                    Account Created
                  </p>

                  <p className="text-sm text-cream">
                    {joinedDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Role */}
        <div className="rounded-xl border border-white/5 bg-navy-900/50 p-5">
          <h3 className="mb-4 flex items-center gap-2 font-heading text-sm font-semibold text-cream">
            <Briefcase className="h-4 w-4 text-ink/60" />
            Current Assignment
          </h3>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-white/5 bg-navy-800/50 p-4">
              <p className="mb-1 text-xs text-ink/40">
                Role
              </p>

              <p className="text-sm font-medium text-cream">
                {member.role}
              </p>
            </div>

            <div className="rounded-lg border border-white/5 bg-navy-800/50 p-4">
              <p className="mb-1 text-xs text-ink/40">
                Department
              </p>

              <p className="text-sm font-medium text-cream">
                {member.department ||
                  'Not assigned'}
              </p>
            </div>

            <div className="rounded-lg border border-white/5 bg-navy-800/50 p-4">
              <p className="mb-1 text-xs text-ink/40">
                Verification
              </p>

              <p
                className={`text-sm font-medium ${
                  member.isVerified
                    ? 'text-emerald-400'
                    : 'text-yellow-400'
                }`}
              >
                {member.isVerified
                  ? 'Verified'
                  : 'Unverified'}
              </p>
            </div>
          </div>
        </div>

        {/* Data Availability Notice */}
        <div className="rounded-xl border border-white/5 bg-navy-900/50 p-5">
          <p className="text-xs leading-relaxed text-ink/60">
            Performance history, workload, attendance,
            leave, training, achievements, and internal
            notes are not currently stored in the personnel
            API, so no values are displayed here until those
            systems are implemented.
          </p>
        </div>
      </div>
    </Modal>
  );
}