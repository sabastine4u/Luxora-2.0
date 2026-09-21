import {
  Building2,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
  Users,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { adminApi } from '../../../api/admin.api';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';

interface AgencyRecord {
  _id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  status?: 'Active' | 'Suspended' | string;
  agentCount?: number;
  listingCount?: number;
  createdAt?: string;
}

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

const getStatusClasses = (
  status?: string,
) => {
  if (status === 'Active') {
    return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300';
  }

  if (status === 'Suspended') {
    return 'border-rose-400/20 bg-rose-400/10 text-rose-300';
  }

  return 'border-white/10 bg-white/5 text-ink/60';
};

export default function AgencyRankings() {
  const [agencies, setAgencies] =
    useState<AgencyRecord[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const loadAgencies = useCallback(
    async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        const response =
          (await adminApi.getAgencies()) as {
            agencies?: AgencyRecord[];
          };

        setAgencies(
          response.agencies || [],
        );
      } catch (error: any) {
        console.error(
          'Failed to load Agency rankings:',
          error,
        );

        setAgencies([]);

        setLoadError(
          error?.message ||
            'Unable to load Agency data right now.',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadAgencies();
  }, [loadAgencies]);

  const metrics = useMemo(() => {
    const totalAgencies =
      agencies.length;

    const activeAgencies =
      agencies.filter(
        (agency) =>
          agency.status === 'Active',
      ).length;

    const suspendedAgencies =
      agencies.filter(
        (agency) =>
          agency.status === 'Suspended',
      ).length;

    const totalAgents =
      agencies.reduce(
        (total, agency) =>
          total +
          (agency.agentCount || 0),
        0,
      );

    const totalPropertyRecords =
      agencies.reduce(
        (total, agency) =>
          total +
          (agency.listingCount || 0),
        0,
      );

    return {
      totalAgencies,
      activeAgencies,
      suspendedAgencies,
      totalAgents,
      totalPropertyRecords,
    };
  }, [agencies]);

  const rankedAgencies = useMemo(() => {
    return [...agencies].sort(
      (first, second) => {
        const listingDifference =
          (second.listingCount || 0) -
          (first.listingCount || 0);

        if (listingDifference !== 0) {
          return listingDifference;
        }

        return (
          (second.agentCount || 0) -
          (first.agentCount || 0)
        );
      },
    );
  }, [agencies]);

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <DashboardHeader
          name="Agency Rankings"
          subtitle="Operational Agency ordering based on real platform records."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-white/10 bg-navy-800/50"
            />
          ))}
        </div>

        <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-white/10 bg-navy-800/50">
          <div className="flex items-center gap-3 text-sm text-ink/60">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading Agency data…
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="space-y-6 pb-12">
        <DashboardHeader
          name="Agency Rankings"
          subtitle="Operational Agency ordering based on real platform records."
        />

        <div className="rounded-2xl border border-rose-400/20 bg-navy-800/50 p-10 text-center">
          <h2 className="font-heading text-xl font-bold text-cream">
            Unable to load Agency data
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm text-ink/60">
            {loadError}
          </p>

          <button
            type="button"
            onClick={() => {
              void loadAgencies();
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
        name="Agency Rankings"
        subtitle="Operational Agency ordering based on recorded property and agent counts. No composite performance score is inferred."
        actions={
          <button
            type="button"
            onClick={() => {
              void loadAgencies();
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-ink/70 transition hover:bg-white/10 hover:text-cream"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KPICard
          title="Total Agencies"
          value={metrics.totalAgencies}
          icon={Building2}
          iconColor="text-gold-400"
          backgroundColor="bg-gold-400/10"
          layout="horizontal"
        />

        <KPICard
          title="Active Agencies"
          value={metrics.activeAgencies}
          icon={CheckCircle2}
          iconColor="text-emerald-300"
          backgroundColor="bg-emerald-400/10"
          layout="horizontal"
        />

        <KPICard
          title="Suspended Agencies"
          value={metrics.suspendedAgencies}
          icon={Clock3}
          iconColor="text-rose-300"
          backgroundColor="bg-rose-400/10"
          layout="horizontal"
        />

        <KPICard
          title="Assigned Agents"
          value={metrics.totalAgents}
          icon={Users}
          iconColor="text-sky-300"
          backgroundColor="bg-sky-400/10"
          layout="horizontal"
        />

        <KPICard
          title="Property Records"
          value={metrics.totalPropertyRecords}
          icon={Building2}
          iconColor="text-violet-300"
          backgroundColor="bg-violet-400/10"
          layout="horizontal"
        />
      </div>

      <section className="rounded-2xl border border-white/10 bg-navy-800/50">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="font-heading text-lg font-bold text-cream">
            Agency Operational Order
          </h2>

          <p className="mt-1 max-w-3xl text-sm text-ink/60">
            Agencies are ordered by the number of Property
            records currently associated with them. Agent count
            is used as the tie-breaker. This is not a profitability,
            quality, satisfaction, or performance score.
          </p>
        </div>

        {rankedAgencies.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Building2 className="mx-auto h-10 w-10 text-ink/30" />

            <h3 className="mt-4 font-heading text-lg font-semibold text-cream">
              No agencies found
            </h3>

            <p className="mt-2 text-sm text-ink/60">
              Agency records will appear here when they exist in the Admin domain.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase text-ink/50">
                <tr>
                  <th className="px-6 py-4">
                    #
                  </th>

                  <th className="px-6 py-4">
                    Agency
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Agents
                  </th>

                  <th className="px-6 py-4">
                    Property records
                  </th>

                  <th className="px-6 py-4">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody>
                {rankedAgencies.map(
                  (
                    agency,
                    index,
                  ) => (
                    <tr
                      key={agency._id}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="px-6 py-4 font-heading text-lg font-bold text-gold-400">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-cream">
                          {agency.name}
                        </div>

                        <div className="mt-1 text-xs text-ink/50">
                          {agency.contactPerson ||
                            'No contact person'}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                            agency.status,
                          )}`}
                        >
                          {agency.status ||
                            'Unknown'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-ink/70">
                        {(agency.agentCount ||
                          0).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 font-medium text-cream">
                        {(agency.listingCount ||
                          0).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-ink/60">
                        {formatDate(
                          agency.createdAt,
                        )}
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