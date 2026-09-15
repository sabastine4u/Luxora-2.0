import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { SegmentedProgressBar } from '../../../components/dashboard/shared/widgets/SegmentedProgressBar';
import {
  Building2,
  Users,
  FileCheck,
  UserCheck,
  Activity,
  ShieldAlert,
  ChevronRight,
  Bell,
  Calendar as CalendarIcon,
  Key,
  Zap,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  FileText,
  CheckCircle,
} from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { useSession } from '../../../contexts/SessionContext';
import { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../../api/admin.api';

export default function Overview() {
  const { user } = useSession();

  const adminRole =
    user?.role || 'Platform Administrator';

  const [isLoading, setIsLoading] =
    useState(true);

  const [owners, setOwners] =
    useState<any[]>([]);

  const [agencies, setAgencies] =
    useState<any[]>([]);

  const [agents, setAgents] =
    useState<any[]>([]);

  const [properties, setProperties] =
    useState<any[]>([]);

  const [verificationSummary, setVerificationSummary] =
    useState({
      pending: 0,
      verified: 0,
      rejected: 0,
      revoked: 0,
    });

  const [verificationQueue, setVerificationQueue] =
    useState<any[]>([]);

  /*
   * Complaints are loaded opportunistically when the
   * current adminApi contains the complaints endpoint.
   *
   * This keeps the UI intact without creating a fake
   * complaint count when the endpoint is unavailable.
   */
  const [openComplaintCount, setOpenComplaintCount] =
    useState<number | null>(null);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        setIsLoading(true);

        const [
          ownersResponse,
          agenciesResponse,
          agentsResponse,
          propertiesResponse,
          verificationSummaryResponse,
          verificationQueueResponse,
        ] = await Promise.all([
          adminApi.getOwners(),
          adminApi.getAgencies(),
          adminApi.getAgents(),
          adminApi.getProperties(),
          adminApi.getVerificationCenterSummary(),
          adminApi.getVerificationQueue('Pending'),
        ]);

        const ownersData =
          ownersResponse as any;

        const agenciesData =
          agenciesResponse as any;

        const agentsData =
          agentsResponse as any;

        const propertiesData =
          propertiesResponse as any;

        const verificationSummaryData =
          verificationSummaryResponse as any;

        const verificationQueueData =
          verificationQueueResponse as any;

        const ownersList =
          Array.isArray(
            ownersData?.owners,
          )
            ? ownersData.owners
            : Array.isArray(
              ownersData?.data?.owners,
            )
              ? ownersData.data.owners
              : [];

        const agenciesList =
          Array.isArray(
            agenciesData?.agencies,
          )
            ? agenciesData.agencies
            : Array.isArray(
              agenciesData?.data?.agencies,
            )
              ? agenciesData.data.agencies
              : [];

        const agentsList =
          Array.isArray(
            agentsData?.agents,
          )
            ? agentsData.agents
            : Array.isArray(
              agentsData?.data?.agents,
            )
              ? agentsData.data.agents
              : [];

        const propertiesList =
          Array.isArray(
            propertiesData?.properties,
          )
            ? propertiesData.properties
            : Array.isArray(
              propertiesData?.data?.properties,
            )
              ? propertiesData.data.properties
              : [];

        const summary =
          verificationSummaryData?.summary ||
          verificationSummaryData?.data?.summary ||
          {
            pending: 0,
            verified: 0,
            rejected: 0,
            revoked: 0,
          };

        const verificationList =
          Array.isArray(
            verificationQueueData?.verifications,
          )
            ? verificationQueueData.verifications
            : Array.isArray(
              verificationQueueData?.data?.verifications,
            )
              ? verificationQueueData.data.verifications
              : [];

        setOwners(
          ownersList,
        );

        setAgencies(
          agenciesList,
        );

        setAgents(
          agentsList,
        );

        setProperties(
          propertiesList,
        );

        setVerificationSummary({
          pending:
            Number(summary.pending) || 0,
          verified:
            Number(summary.verified) || 0,
          rejected:
            Number(summary.rejected) || 0,
          revoked:
            Number(summary.revoked) || 0,
        });

        setVerificationQueue(
          verificationList,
        );

        /*
         * Complaints were implemented separately from the
         * uploaded Admin Overview API surface. When the
         * method exists in the current frontend, use it.
         *
         * Otherwise keep the card visible with no fake value.
         */
        const complaintsApi =
          adminApi as any;

        if (
          typeof complaintsApi.getComplaints ===
          'function'
        ) {
          try {
            const complaintsResponse =
              await complaintsApi.getComplaints();

            const complaintsData =
              complaintsResponse as any;

            const complaints =
              Array.isArray(
                complaintsData?.complaints,
              )
                ? complaintsData.complaints
                : Array.isArray(
                  complaintsData?.data?.complaints,
                )
                  ? complaintsData.data.complaints
                  : [];

            const activeComplaints =
              complaints.filter(
                (complaint: any) =>
                  complaint.status === 'Open' ||
                  complaint.status === 'In Progress' ||
                  complaint.status === 'Escalated',
              );

            setOpenComplaintCount(
              activeComplaints.length,
            );
          } catch {
            setOpenComplaintCount(
              null,
            );
          }
        } else {
          setOpenComplaintCount(
            null,
          );
        }
      } catch (error) {
        console.error(
          'Failed to load Admin Overview data:',
          error,
        );

        setOwners([]);
        setAgencies([]);
        setAgents([]);
        setProperties([]);
        setVerificationQueue([]);

        setVerificationSummary({
          pending: 0,
          verified: 0,
          rejected: 0,
          revoked: 0,
        });

        setOpenComplaintCount(
          null,
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadOverview();
  }, []);

  /*
   * Real platform counts derived from the records
   * returned by the backend.
   */
  const activeOwners =
    owners.filter(
      (owner) =>
        owner.isActive !== false,
    ).length;

  const activeAgencies =
    agencies.filter(
      (agency) =>
        agency.status !== 'Suspended',
    ).length;

  const activeAgents =
    agents.filter(
      (agent) =>
        agent.status === 'Active',
    ).length;

  const activeListings =
    properties.filter(
      (property) =>
        property.status === 'Published',
    ).length;

  const pendingModeration =
    properties.filter(
      (property) =>
        property.status === 'Pending Review',
    );

  const approvedProperties =
    properties.filter(
      (property) =>
        property.status === 'Approved',
    ).length;

  const rejectedProperties =
    properties.filter(
      (property) =>
        property.status === 'Rejected',
    ).length;

  const totalVerificationRecords =
    verificationSummary.pending +
    verificationSummary.verified +
    verificationSummary.rejected +
    verificationSummary.revoked;

  const verificationRate =
    totalVerificationRecords > 0
      ? Math.round(
        (
          verificationSummary.verified /
          totalVerificationRecords
        ) * 100,
      )
      : 0;

  const queueSummary =
    verificationSummary.pending +
    pendingModeration.length;

  /*
   * Convert actual Verification records into the
   * existing ActivityTimeline UI.
   */
  const recentActivity =
    useMemo(() => {
      return verificationQueue
        .slice(0, 3)
        .map(
          (
            verification: any,
          ) => {
            const agentName =
              verification.agent?.fullName ||
              verification.user?.fullName ||
              'Agent Verification';

            return {
              title:
                'Agent Verification Pending',
              desc:
                agentName,
              time:
                formatRelativeTime(
                  verification.createdAt,
                ),
              color:
                'text-gold-400',
              icon:
                ShieldCheck,
            };
          },
        );
    }, [verificationQueue]);

  /*
   * Keep the pending verification widget tied
   * directly to the real Verification queue.
   */
  const pendingVerificationItems =
    verificationQueue.slice(0, 3);

  /*
   * Keep the Pending Moderation widget tied to
   * actual Property lifecycle status.
   */
  const pendingModerationItems =
    pendingModeration.slice(0, 3);

  /*
   * Existing UI sections that currently do not have
   * supporting backend endpoints remain visible.
   *
   * These are intentionally NOT removed.
   */
  const announcements = [
    {
      id: 1,
      title:
        'Verification Policy Update',
      desc:
        'New guidelines for document verification.',
      time:
        'Today, 9:00 AM',
    },
    {
      id: 2,
      title:
        'System Maintenance',
      desc:
        'Scheduled downtime for db upgrade.',
      time:
        'Tomorrow, 2:00 AM',
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      title:
        'Dispatch Approved Properties',
      type:
        'Assignment Hub',
      due:
        'Today',
    },
    {
      id: 2,
      title:
        'Review Property Submissions',
      type:
        'Verification',
      due:
        'Today',
    },
  ];

  const recentLogins = [
    {
      id: 1,
      name:
        'Admin Chidi',
      role:
        'Super Admin',
      time:
        '10 mins ago',
      ip:
        '192.168.1.1',
    },
    {
      id: 2,
      name:
        'Moderator Bisi',
      role:
        'Moderator',
      time:
        '1 hour ago',
      ip:
        '10.0.0.5',
    },
  ];

  const operationalAlerts = [
    {
      id: 1,
      title:
        'Property Ready for Agency Assignment',
      level:
        'Notice',
      desc:
        'A property is currently waiting for agency assignment.',
      color:
        'text-gold-400',
    },
    {
      id: 2,
      title:
        'Verification Queue',
      level:
        'Warning',
      desc:
        `${verificationSummary.pending} items currently pending review.`,
      color:
        'text-yellow-400',
    },
    {
      id: 3,
      title:
        'Published Listings',
      level:
        'Success',
      desc:
        `${activeListings} properties are currently published.`,
      color:
        'text-emerald-400',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <DashboardHeader
        name="Luxora Operations Center"
        subtitle={`Platform Administration • Managed by ${
          user?.name?.split(' ')[0] ||
          'Administrator'
        }`}
        badges={[
          'Operations Department',
          'Verified Platform',
        ]}
        tags={[
          {
            label:
              adminRole,
            icon:
              ShieldCheck,
          },
          {
            label:
              'Platform Status • Online',
            icon:
              Activity,
          },
        ]}
        showVerifiedBadge={true}
        actions={
          <>
            <button
              onClick={() =>
                window.location.href =
                '?tab=Settings'
              }
              className="rounded-xl bg-gold-400 px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-gold-300"
            >
              Platform Settings
            </button>
          </>
        }
      />

      <div className="mb-2">
        <h2 className="text-sm font-semibold text-ink/50 uppercase tracking-wider">
          Platform Snapshot
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <KPICard
          title="Active Owners"
          value={
            isLoading
              ? '—'
              : activeOwners.toLocaleString()
          }
          icon={UserCheck}
          trend={
            isLoading
              ? 'Loading...'
              : `${owners.length.toLocaleString()} total accounts`
          }
          trendColor="text-emerald-400"
          iconColor="text-purple-400"
        />

        <KPICard
          title="Active Agencies"
          value={
            isLoading
              ? '—'
              : activeAgencies.toLocaleString()
          }
          icon={Building2}
          trend={
            isLoading
              ? 'Loading...'
              : `${agencies.length.toLocaleString()} total agencies`
          }
          trendColor="text-emerald-400"
          iconColor="text-blue-400"
        />

        <KPICard
          title="Active Agents"
          value={
            isLoading
              ? '—'
              : activeAgents.toLocaleString()
          }
          icon={Users}
          trend={
            isLoading
              ? 'Loading...'
              : `${agents.length.toLocaleString()} total agents`
          }
          trendColor="text-emerald-400"
          iconColor="text-gold-400"
        />

        <KPICard
          title="Active Listings"
          value={
            isLoading
              ? '—'
              : activeListings.toLocaleString()
          }
          icon={FileCheck}
          trend={
            isLoading
              ? 'Loading...'
              : `${properties.length.toLocaleString()} total properties`
          }
          trendColor="text-emerald-400"
          iconColor="text-emerald-400"
        />

        <KPICard
          title="Pending Verifications"
          value={
            isLoading
              ? '—'
              : verificationSummary.pending.toLocaleString()
          }
          icon={ShieldAlert}
          trend="Action Required"
          trendColor="text-yellow-400"
          iconColor="text-yellow-400"
          backgroundColor="bg-yellow-400/10"
        />

        <KPICard
          title="Platform Health"
          value="100%"
          icon={Activity}
          trend="Operational"
          trendColor="text-emerald-400"
          iconColor="text-emerald-400"
          backgroundColor="bg-emerald-400/10"
        />
      </div>

      {/* Operational Scope */}
      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="h-6 w-6 text-gold-400" />

          <h3 className="font-heading text-lg font-bold text-cream">
            Operational Scope & Responsibilities
          </h3>
        </div>

        <p className="text-sm text-ink/60 mb-6 max-w-3xl">
          As a {adminRole}, you are responsible for maintaining the integrity,
          security, and quality of the Luxora platform. Your primary operational
          duties include:
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            'Property Verification',
            'User Compliance & KYC',
            'Agency Management',
            'Marketplace Quality',
            'Platform Monitoring',
            'Fraud Prevention',
            'Operational Escalations',
          ].map(
            (
              scope,
              idx,
            ) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-xl border border-white/5 bg-navy-900/50 px-4 py-3"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-gold-400" />

                <span className="text-sm font-medium text-cream">
                  {scope}
                </span>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-gold-400" />

            <h3 className="font-heading text-lg font-bold text-cream">
              Weekly Moderation Trends
            </h3>
          </div>

          {/*
           * Kept exactly in the UI because there is currently
           * no backend endpoint supplying weekly moderation
           * history. The values below remain the existing
           * presentation data until that backend is built.
           */}
          <SegmentedProgressBar
            segments={[
              {
                label:
                  'Approved',
                value:
                  450,
                color:
                  'bg-emerald-400',
              },
              {
                label:
                  'Rejected',
                value:
                  120,
                color:
                  'bg-rose-400',
              },
              {
                label:
                  'Pending Review',
                value:
                  isLoading
                    ? 0
                    : verificationSummary.pending,
                color:
                  'bg-yellow-400',
              },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <KPICard
            title="Queue Summary"
            value={
              isLoading
                ? '—'
                : queueSummary.toLocaleString()
            }
            icon={FileText}
            trend="Verification + Moderation"
            trendColor="text-yellow-400"
            iconColor="text-yellow-400"
          />

          <KPICard
            title="Open Complaints"
            value={
              openComplaintCount === null
                ? '—'
                : openComplaintCount.toLocaleString()
            }
            icon={ShieldAlert}
            trend={
              openComplaintCount === null
                ? 'Backend metric unavailable'
                : 'Requires attention'
            }
            trendColor="text-rose-400"
            iconColor="text-rose-400"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending Verification Widget */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
            <h3 className="font-heading text-lg font-bold text-cream">
              Pending Verification
            </h3>

            <GhostButton
              size="sm"
              className="px-2 py-1 text-xs text-gold-400"
            >
              View All
            </GhostButton>
          </div>

          <div className="space-y-4 flex-1">
            {isLoading ? (
              <div className="text-sm text-ink/50">
                Loading verification queue...
              </div>
            ) : pendingVerificationItems.length === 0 ? (
              <div className="text-sm text-ink/50">
                No pending verifications.
              </div>
            ) : (
              pendingVerificationItems.map(
                (
                  item: any,
                ) => {
                  const title =
                    item.agent?.fullName ||
                    item.user?.fullName ||
                    'Agent Verification';

                  return (
                    <div
                      key={
                        item._id ||
                        item.id
                      }
                      className="flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-sm font-semibold text-cream">
                          {title}
                        </div>

                        <div className="text-xs text-ink/50 mt-0.5">
                          Agent Verification
                          {' • '}
                          {formatRelativeTime(
                            item.createdAt,
                          )}
                        </div>
                      </div>

                      <button
                        className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
                      >
                        <ChevronRight className="h-4 w-4 text-ink/40" />
                      </button>
                    </div>
                  );
                },
              )
            )}
          </div>
        </div>

        {/* Pending Moderation Widget */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
            <h3 className="font-heading text-lg font-bold text-cream">
              Pending Moderation
            </h3>

            <GhostButton
              size="sm"
              className="px-2 py-1 text-xs text-gold-400"
            >
              View All
            </GhostButton>
          </div>

          <div className="space-y-4 flex-1">
            {isLoading ? (
              <div className="text-sm text-ink/50">
                Loading moderation queue...
              </div>
            ) : pendingModerationItems.length === 0 ? (
              <div className="text-sm text-ink/50">
                No properties pending moderation.
              </div>
            ) : (
              pendingModerationItems.map(
                (
                  item: any,
                ) => (
                  <div
                    key={
                      item._id ||
                      item.id
                    }
                    className="flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-cream">
                        {item.title ||
                          'Untitled Property'}
                      </div>

                      <div className="text-xs text-ink/50 mt-0.5">
                        {getPropertyLocation(
                          item,
                        )}
                        {' • '}
                        {formatRelativeTime(
                          item.createdAt,
                        )}
                      </div>
                    </div>

                    <button
                      className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
                    >
                      <ChevronRight className="h-4 w-4 text-ink/40" />
                    </button>
                  </div>
                ),
              )
            )}
          </div>
        </div>

        {/* Recent Reports Widget */}
        <div className="space-y-6">
          <ActivityTimeline
            title="Verification Activity"
            items={
              recentActivity.length > 0
                ? recentActivity
                : [
                  {
                    title:
                      isLoading
                        ? 'Loading verification activity'
                        : 'No recent verification activity',
                    desc:
                      isLoading
                        ? 'Fetching current verification records'
                        : 'No pending verification activity available',
                    time:
                      '',
                    color:
                      'text-ink/50',
                    icon:
                      Activity,
                  },
                ]
            }
            showViewAll
          />

          {/* Quick Links */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <h3 className="font-heading text-lg font-bold text-cream mb-4 border-b border-white/10 pb-4">
              Administrator Quick Links
            </h3>

            <div className="space-y-2">
              <GhostButton className="w-full justify-start">
                Add Administrator
              </GhostButton>

              <GhostButton className="w-full justify-start">
                Platform Settings
              </GhostButton>

              <GhostButton className="w-full justify-start">
                Verification Queue
              </GhostButton>

              <GhostButton className="w-full justify-start">
                Moderation Queue
              </GhostButton>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Platform Announcements */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-400" />

              <h3 className="font-heading text-lg font-bold text-cream">
                Announcements
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            {announcements.map(
              (
                item,
              ) => (
                <div key={item.id}>
                  <div className="text-sm font-semibold text-cream">
                    {item.title}
                  </div>

                  <div className="text-xs text-ink/60 mt-1">
                    {item.desc}
                  </div>

                  <div className="text-[10px] text-ink/40 mt-1">
                    {item.time}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-emerald-400" />

              <h3 className="font-heading text-lg font-bold text-cream">
                Upcoming Tasks
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            {upcomingTasks.map(
              (
                item,
              ) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-semibold text-cream">
                      {item.title}
                    </div>

                    <div className="text-xs text-ink/50 mt-1">
                      {item.type}
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                    {item.due}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Recent Logins */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-gold-400" />

              <h3 className="font-heading text-lg font-bold text-cream">
                Recent Logins
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            {recentLogins.map(
              (
                item,
              ) => (
                <div key={item.id}>
                  <div className="text-sm font-semibold text-cream flex justify-between">
                    {item.name}

                    <span className="text-xs text-ink/40">
                      {item.time}
                    </span>
                  </div>

                  <div className="text-xs text-ink/60 mt-1">
                    {item.role}
                    {' • '}
                    {item.ip}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Operational Alerts */}
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-rose-400" />

              <h3 className="font-heading text-lg font-bold text-cream">
                Alerts
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            {operationalAlerts.map(
              (
                item,
              ) => (
                <div
                  key={item.id}
                  className="flex gap-3"
                >
                  <div
                    className={`mt-0.5 h-2 w-2 rounded-full ${item.color} shrink-0`}
                  />

                  <div>
                    <div className="text-sm font-semibold text-cream">
                      {item.title}
                    </div>

                    <div className="text-xs text-ink/60 mt-1">
                      {item.desc}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * Format backend timestamps into a compact relative
 * time suitable for the existing dashboard UI.
 */
function formatRelativeTime(
  value?: string,
) {
  if (!value) {
    return 'Recently';
  }

  const timestamp =
    new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return 'Recently';
  }

  const diff =
    Date.now() - timestamp;

  const minutes =
    Math.floor(
      diff /
      (1000 * 60),
    );

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours =
    Math.floor(
      minutes / 60,
    );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days =
    Math.floor(
      hours / 24,
    );

  if (days < 7) {
    return `${days}d ago`;
  }

  return new Date(
    value,
  ).toLocaleDateString(
    'en-NG',
    {
      day: 'numeric',
      month: 'short',
    },
  );
}

/*
 * Property location can be stored differently depending
 * on the property record/version, so keep the UI safe
 * without assuming one exact shape.
 */
function getPropertyLocation(
  property: any,
) {
  if (
    typeof property?.location ===
    'string'
  ) {
    return property.location;
  }

  if (
    property?.location?.city
  ) {
    return property.location.city;
  }

  if (
    property?.city
  ) {
    return property.city;
  }

  if (
    property?.address?.city
  ) {
    return property.address.city;
  }

  return 'Location not provided';
}