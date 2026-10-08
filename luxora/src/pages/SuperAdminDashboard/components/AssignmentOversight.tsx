import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
  UserCheck,
  UserRound,
  Users,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { GhostButton } from '../../../components/ui/ui';
import { adminApi } from '../../../api/admin.api';

interface AssignmentProperty {
  _id: string;
  title: string;
  city?: string;
  state?: string;
  assignmentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
  owner?: {
    fullName?: string;
    email?: string;
  } | null;
  agency?: {
    _id?: string;
    name?: string;
  } | null;
  agent?: {
    _id?: string;
    user?: {
      fullName?: string;
      email?: string;
    } | null;
  } | null;
}

const getAssignmentLabel = (status?: string) => {
  switch (status) {
    case 'Pending Agency Assignment':
      return 'Pending Agency Assignment';

    case 'Agency Assigned':
      return 'Agency Assigned';

    case 'Agent Assigned':
      return 'Agent Assigned';

    case 'Agent Accepted':
      return 'Agent Accepted';

    case 'Agent Declined':
      return 'Agent Declined';

    default:
      return status || 'Not Assigned';
  }
};

const getStatusClasses = (status?: string) => {
  switch (status) {
    case 'Pending Agency Assignment':
      return 'border-amber-400/20 bg-amber-400/10 text-amber-300';

    case 'Agency Assigned':
      return 'border-sky-400/20 bg-sky-400/10 text-sky-300';

    case 'Agent Assigned':
      return 'border-violet-400/20 bg-violet-400/10 text-violet-300';

    case 'Agent Accepted':
      return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300';

    case 'Agent Declined':
      return 'border-rose-400/20 bg-rose-400/10 text-rose-300';

    default:
      return 'border-white/10 bg-white/5 text-ink/60';
  }
};

const formatDate = (value?: string) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const getWaitingAge = (property: AssignmentProperty) => {
  if (property.assignmentStatus !== 'Pending Agency Assignment') {
    return '—';
  }

  const sourceDate =
    property.updatedAt ||
    property.createdAt;

  if (!sourceDate) {
    return '—';
  }

  const date = new Date(sourceDate);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  const difference =
    Date.now() - date.getTime();

  const days = Math.max(
    0,
    Math.floor(
      difference /
        (1000 * 60 * 60 * 24),
    ),
  );

  if (days === 0) {
    return 'Today';
  }

  return `${days} day${days === 1 ? '' : 's'}`;
};

export default function AssignmentOversight() {
  const [properties, setProperties] =
    useState<AssignmentProperty[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const loadAssignments = useCallback(
    async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        const response =
          (await adminApi.getProperties()) as {
            properties?: AssignmentProperty[];
          };

        setProperties(
          response.properties || [],
        );
      } catch (error: any) {
        console.error(
          'Failed to load assignment oversight data:',
          error,
        );

        setProperties([]);

        setLoadError(
          error?.message ||
            'Unable to load assignment data right now.',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadAssignments();
  }, [loadAssignments]);

  const metrics = useMemo(() => {
    const total =
      properties.length;

    const pendingAgency =
      properties.filter(
        (property) =>
          property.assignmentStatus ===
          'Pending Agency Assignment',
      ).length;

    const agencyAssigned =
      properties.filter(
        (property) =>
          property.assignmentStatus ===
          'Agency Assigned',
      ).length;

    const agentAssigned =
      properties.filter(
        (property) =>
          property.assignmentStatus ===
          'Agent Assigned',
      ).length;

    const agentAccepted =
      properties.filter(
        (property) =>
          property.assignmentStatus ===
          'Agent Accepted',
      ).length;

    const agentDeclined =
      properties.filter(
        (property) =>
          property.assignmentStatus ===
          'Agent Declined',
      ).length;

    return {
      total,
      pendingAgency,
      agencyAssigned,
      agentAssigned,
      agentAccepted,
      agentDeclined,
    };
  }, [properties]);

  const pendingAgencyAssignments =
    useMemo(
      () =>
        properties
          .filter(
            (property) =>
              property.assignmentStatus ===
              'Pending Agency Assignment',
          )
          .sort((a, b) => {
            const first = new Date(
              a.updatedAt ||
                a.createdAt ||
                0,
            ).getTime();

            const second = new Date(
              b.updatedAt ||
                b.createdAt ||
                0,
            ).getTime();

            return first - second;
          }),
      [properties],
    );

  const assignedProperties =
    useMemo(
      () =>
        properties.filter((property) =>
          [
            'Agency Assigned',
            'Agent Assigned',
            'Agent Accepted',
            'Agent Declined',
          ].includes(
            property.assignmentStatus || '',
          ),
        ),
      [properties],
    );

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <DashboardHeader
          name="Assignment Oversight"
          subtitle="Platform assignment governance."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-white/10 bg-navy-800/50"
            />
          ))}
        </div>

        <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-white/10 bg-navy-800/50">
          <div className="flex items-center gap-3 text-sm text-ink/60">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading assignment oversight…
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="space-y-6 pb-12">
        <DashboardHeader
          name="Assignment Oversight"
          subtitle="Platform assignment governance."
        />

        <div className="rounded-2xl border border-rose-400/20 bg-navy-800/50 p-10 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-rose-300" />

          <h2 className="mt-4 font-heading text-xl font-bold text-cream">
            Unable to load assignments
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm text-ink/60">
            {loadError}
          </p>

          <button
            type="button"
            onClick={() => {
              void loadAssignments();
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-gold-400/30 bg-gold-400/10 px-4 py-2 text-sm font-semibold text-gold-400 transition hover:bg-gold-400/20"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        name="Assignment Oversight"
        subtitle="Platform assignment governance using live Property assignment records."
        actions={
          <>
            <GhostButton
              onClick={() => {
                void loadAssignments();
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </GhostButton>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <KPICard
          title="Total Properties"
          value={metrics.total}
          icon={Building2}
          iconColor="text-gold-400"
          backgroundColor="bg-gold-400/10"
          layout="horizontal"
        />

        <KPICard
          title="Pending Agency"
          value={metrics.pendingAgency}
          icon={Clock3}
          iconColor="text-amber-300"
          backgroundColor="bg-amber-400/10"
          layout="horizontal"
        />

        <KPICard
          title="Agency Assigned"
          value={metrics.agencyAssigned}
          icon={Building2}
          iconColor="text-sky-300"
          backgroundColor="bg-sky-400/10"
          layout="horizontal"
        />

        <KPICard
          title="Agent Assigned"
          value={metrics.agentAssigned}
          icon={UserRound}
          iconColor="text-violet-300"
          backgroundColor="bg-violet-400/10"
          layout="horizontal"
        />

        <KPICard
          title="Agent Accepted"
          value={metrics.agentAccepted}
          icon={CheckCircle2}
          iconColor="text-emerald-300"
          backgroundColor="bg-emerald-400/10"
          layout="horizontal"
        />

        <KPICard
          title="Agent Declined"
          value={metrics.agentDeclined}
          icon={UserCheck}
          iconColor="text-rose-300"
          backgroundColor="bg-rose-400/10"
          layout="horizontal"
        />
      </div>

      <section className="rounded-2xl border border-white/10 bg-navy-800/50">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-lg font-bold text-cream">
                Pending Agency Assignment
              </h2>

              <p className="mt-1 text-sm text-ink/60">
                Properties currently waiting for an Agency assignment.
              </p>
            </div>

            <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
              {pendingAgencyAssignments.length} waiting
            </span>
          </div>
        </div>

        {pendingAgencyAssignments.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-300" />

            <h3 className="mt-4 font-heading text-lg font-semibold text-cream">
              No pending agency assignments
            </h3>

            <p className="mt-2 text-sm text-ink/60">
              There are currently no properties waiting for Agency assignment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase text-ink/50">
                <tr>
                  <th className="px-6 py-4">
                    Property
                  </th>

                  <th className="px-6 py-4">
                    Owner
                  </th>

                  <th className="px-6 py-4">
                    Location
                  </th>

                  <th className="px-6 py-4">
                    Submitted
                  </th>

                  <th className="px-6 py-4">
                    Waiting Age
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {pendingAgencyAssignments.map(
                  (property) => (
                    <tr
                      key={property._id}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-cream">
                          {property.title}
                        </div>

                        <div className="mt-1 text-xs text-ink/40">
                          {property._id}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-ink/70">
                        {property.owner?.fullName ||
                          'Unassigned'}
                      </td>

                      <td className="px-6 py-4 text-ink/70">
                        {[
                          property.city,
                          property.state,
                        ]
                          .filter(Boolean)
                          .join(', ') ||
                          'Not provided'}
                      </td>

                      <td className="px-6 py-4 text-ink/70">
                        {formatDate(
                          property.createdAt,
                        )}
                      </td>

                      <td className="px-6 py-4 font-medium text-amber-300">
                        {getWaitingAge(
                          property,
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                            property.assignmentStatus,
                          )}`}
                        >
                          {getAssignmentLabel(
                            property.assignmentStatus,
                          )}
                        </span>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-navy-800/50">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-lg font-bold text-cream">
                Current Assignment State
              </h2>

              <p className="mt-1 text-sm text-ink/60">
                Live Agency and Agent assignment states across the platform.
              </p>
            </div>

            <span className="inline-flex items-center gap-2 text-xs text-ink/50">
              <Users className="h-4 w-4" />
              {assignedProperties.length} assigned records
            </span>
          </div>
        </div>

        {assignedProperties.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Building2 className="mx-auto h-10 w-10 text-ink/30" />

            <h3 className="mt-4 font-heading text-lg font-semibold text-cream">
              No assigned properties
            </h3>

            <p className="mt-2 text-sm text-ink/60">
              Assignment records will appear here once Agencies or Agents are assigned.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase text-ink/50">
                <tr>
                  <th className="px-6 py-4">
                    Property
                  </th>

                  <th className="px-6 py-4">
                    Agency
                  </th>

                  <th className="px-6 py-4">
                    Agent
                  </th>

                  <th className="px-6 py-4">
                    Updated
                  </th>

                  <th className="px-6 py-4">
                    Assignment
                  </th>
                </tr>
              </thead>

              <tbody>
                {assignedProperties.map(
                  (property) => (
                    <tr
                      key={property._id}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-cream">
                          {property.title}
                        </div>

                        <div className="mt-1 text-xs text-ink/40">
                          {[
                            property.city,
                            property.state,
                          ]
                            .filter(Boolean)
                            .join(', ') ||
                            'Location not provided'}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-ink/70">
                        {property.agency?.name ||
                          'Unassigned'}
                      </td>

                      <td className="px-6 py-4 text-ink/70">
                        {property.agent?.user
                          ?.fullName ||
                          'Unassigned'}
                      </td>

                      <td className="px-6 py-4 text-ink/70">
                        {formatDate(
                          property.updatedAt,
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                            property.assignmentStatus,
                          )}`}
                        >
                          {getAssignmentLabel(
                            property.assignmentStatus,
                          )}
                        </span>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}