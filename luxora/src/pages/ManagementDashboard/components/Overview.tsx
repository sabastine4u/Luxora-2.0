import { useEffect, useState } from "react";
import {
  Activity,
  Users,
  CheckCircle2,
  Megaphone,
  Target,
  FileText,
  Calendar,
  Building2,
  TrendingUp,
  AlertTriangle,
  Clock,
  Zap,
  MessageSquare,
  Briefcase,
  ListTodo,
  ShieldAlert,
} from "lucide-react";

import { DashboardHeader } from "../../../components/dashboard/shared/headers/DashboardHeader";
import { KPICard } from "../../../components/dashboard/shared/cards/KPICard";
import { useSession } from "../../../contexts/SessionContext";
import { ActivityTimeline } from "../../../components/dashboard/shared/timelines/ActivityTimeline";
import { ConfirmationModal } from "../../../components/ui/ConfirmationModal";
import { managementApi } from "../../../api/management.api";

interface OverviewDepartment {
  department: string;
  total: number;
  active: number;
  verified: number;
}

interface OverviewApproval {
  id: string;
  title: string;
  requestedBy: string;
  type: string;
  priority: string | null;
  date: string | null;
}

interface OverviewDependency {
  department: string;
  impact: string | null;
  status: string;
  progress: number | null;
  description: string;
}

interface OverviewGoal {
  id?: string;
  title?: string;
  date?: string;
  status?: string;
  progress?: number;
}

interface OverviewAlert {
  title: string;
  severity: string | null;
  description: string;
  status: string;
  date: string | null;
}

interface OverviewCalendarEvent {
  title: string;
  time: string | null;
  type: string;
  attendees: number;
  date: string | null;
}

interface OverviewRecentAction {
  title: string;
  time: string | null;
  desc: string;
  type: string;
}

interface ManagementOverview {
  summary: {
    totalStaff: number;
    activeStaff: number;
    inactiveStaff: number;
    verifiedStaff: number;
    totalProperties: number;
    liveProperties: number;
    finalizedProperties: number;
    totalOffers: number;
    pendingOffers: number;
    acceptedOffers: number;
    totalInquiries: number;
    totalViewings: number;
    closedDealValue: number;
    agencyCommission: number;
    totalComplaints: number;
    resolvedComplaints: number;
  };

  organizationHealth: {
    operationalEfficiency: number | null;
    resourceUtilization: number | null;
    budgetAdherence: number | null;
    riskMitigation: number | null;
  };

  workforce: {
    totalStaff: number;
    activeStaff: number;
    inactiveStaff: number;
    verifiedStaff: number;
    departments: OverviewDepartment[];
  };

  propertySnapshot: {
    draft: number;
    pendingReview: number;
    approved: number;
    published: number;
    underOffer: number;
    sold: number;
    rented: number;
    leased: number;
    archived: number;
  };

  approvals: {
    total: number;
    items: OverviewApproval[];
  };

  dependencies: OverviewDependency[];

  weeklyHighlights: OverviewDepartment[];

  goals: OverviewGoal[];

  alerts: OverviewAlert[];

  calendar: OverviewCalendarEvent[];

  recentActions: OverviewRecentAction[];
}

interface ManagementOverviewResponse {
  success: boolean;
  message: string;
  overview: ManagementOverview;
}

function formatDate(dateValue: string | null) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(dateValue: string | null) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getHealthColor(
  value: number | null,
) {
  if (value === null) {
    return "bg-white/10";
  }

  if (value >= 85) {
    return "bg-emerald-400";
  }

  if (value >= 65) {
    return "bg-yellow-400";
  }

  return "bg-rose-400";
}

function getPriorityClass(
  priority: string | null,
) {
  if (priority === "High") {
    return "bg-rose-400/10 text-rose-400";
  }

  if (priority === "Medium") {
    return "bg-yellow-400/10 text-yellow-400";
  }

  return "bg-blue-400/10 text-blue-400";
}

export default function Overview() {
  const { user } = useSession();

  const [
    overview,
    setOverview,
  ] = useState<ManagementOverview | null>(
    null,
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    confirmationState,
    setConfirmationState,
  ] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    confirmText: "Confirm",
    onConfirm: () => {},
  });

  useEffect(() => {
    const initializeOverview = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await managementApi.getOverview();

        const data =
          response.data as ManagementOverviewResponse;

        setOverview(
          data?.overview ?? null,
        );
      } catch (requestError: any) {
        console.error(
          "Failed to load management overview:",
          requestError,
        );

        setError(
          requestError?.response?.data
            ?.message ||
            requestError?.message ||
            "Failed to load management overview.",
        );
      } finally {
        setLoading(false);
      }
    };

    initializeOverview();
  }, []);

  const summary =
    overview?.summary;

  const organizationHealth =
    overview?.organizationHealth;

  const workforce =
    overview?.workforce;

  const pendingApprovals =
    overview?.approvals?.items ?? [];

  const dependencies =
    overview?.dependencies ?? [];

  const weeklyHighlights =
    overview?.weeklyHighlights ?? [];

  const goals =
    overview?.goals ?? [];

  const alerts =
    overview?.alerts ?? [];

  const upcomingCalendar =
    overview?.calendar ?? [];

  const decisionsTimeline =
    overview?.recentActions ?? [];

  const healthMetrics = [
    {
      label: "Operational Efficiency",
      percentage:
        organizationHealth?.operationalEfficiency ??
        null,
      color: getHealthColor(
        organizationHealth?.operationalEfficiency ??
          null,
      ),
    },
    {
      label: "Resource Utilization",
      percentage:
        organizationHealth?.resourceUtilization ??
        null,
      color: getHealthColor(
        organizationHealth?.resourceUtilization ??
          null,
      ),
    },
    {
      label: "Budget Adherence",
      percentage:
        organizationHealth?.budgetAdherence ??
        null,
      color: getHealthColor(
        organizationHealth?.budgetAdherence ??
          null,
      ),
    },
    {
      label: "Risk Mitigation",
      percentage:
        organizationHealth?.riskMitigation ??
        null,
      color: getHealthColor(
        organizationHealth?.riskMitigation ??
          null,
      ),
    },
  ];

  const highlightDepartments =
    weeklyHighlights.slice(0, 4);

  const recentTimelineItems =
    decisionsTimeline.map((action) => {
      let icon = Activity;
      let color = "text-blue-400";

      if (action.type === "Property") {
        icon = Building2;
        color = "text-gold-400";
      }

      if (action.type === "Offer") {
        icon = Briefcase;
        color = "text-yellow-400";
      }

      if (action.type === "Viewing") {
        icon = Calendar;
        color = "text-emerald-400";
      }

      if (action.type === "Complaint") {
        icon = ShieldAlert;
        color = "text-rose-400";
      }

      if (action.type === "Inquiry") {
        icon = MessageSquare;
        color = "text-blue-400";
      }

      return {
        title: action.title,
        time: formatDateTime(
          action.time,
        ),
        desc: action.desc,
        icon,
        color,
      };
    });

  const handleApprove = (
    approval: OverviewApproval,
  ) => {
    setConfirmationState({
      isOpen: true,
      title: "Approve Request",
      description: `The approval action for "${approval.title}" is not connected to a Manager approval endpoint yet.`,
      confirmText: "Close",
      onConfirm: () => {},
    });
  };

  const handleReview = (
    approval: OverviewApproval,
  ) => {
    setConfirmationState({
      isOpen: true,
      title: "Review Request",
      description: `The review action for "${approval.title}" is not connected to a Manager review endpoint yet.`,
      confirmText: "Close",
      onConfirm: () => {},
    });
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Management Overview"
        subtitle="Operational command center for department leadership, team performance, approvals, and organizational execution."
        actions={
          <div className="flex gap-3"></div>
        }
      />

      {error && (
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      {/* Manager Daily Briefing */}
      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Zap className="w-48 h-48 text-gold-400" />
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-400/20 text-gold-400 shrink-0 border border-gold-400/30">
          <MessageSquare className="h-8 w-8" />
        </div>

        <div className="flex-1 relative z-10">
          <h2 className="text-xl font-bold text-cream mb-2">
            Good morning,{" "}
            {user?.name?.split(" ")[0] ||
              "Manager"}
            .
          </h2>

          <p className="text-ink/80 text-sm leading-relaxed max-w-3xl">
            {loading
              ? "Loading today’s management overview..."
              : `There are ${
                  summary?.pendingOffers || 0
                } pending offers, ${
                  summary?.totalComplaints || 0
                } recorded complaints, and ${
                  summary?.totalViewings || 0
                } viewing records in the current management data. ${
                  summary?.liveProperties || 0
                } properties are currently live.`}
          </p>
        </div>
      </div>

      {/* Department Performance Snapshot */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Overall Dept Health"
          value={
            organizationHealth?.operationalEfficiency !==
            null &&
            organizationHealth?.operationalEfficiency !==
            undefined
              ? `${organizationHealth.operationalEfficiency}/100`
              : "—"
          }
          trend={
            organizationHealth?.operationalEfficiency !==
            null &&
            organizationHealth?.operationalEfficiency !==
            undefined
              ? "Current operational ratio"
              : "No health data"
          }
          trendColor="text-emerald-400"
          icon={Activity}
          footer={
            <div className="text-xs text-ink/60">
              Cross-team composite
            </div>
          }
        />

        <KPICard
          title="Total Workforce"
          value={String(
            workforce?.totalStaff ?? 0,
          )}
          trend={
            workforce
              ? `${workforce.activeStaff} active`
              : "Loading..."
          }
          trendColor="text-emerald-400"
          icon={Users}
          footer={
            <div className="text-xs text-ink/60">
              Across{" "}
              {workforce?.departments
                ?.length ?? 0} departments
            </div>
          }
        />

        <KPICard
          title="Pending Approvals"
          value={String(
            overview?.approvals?.total ?? 0,
          )}
          trend={
            overview?.approvals?.total
              ? "Requires manager review"
              : "No pending approvals"
          }
          trendColor="text-rose-400"
          icon={Clock}
          footer={
            <div className="text-xs text-ink/60">
              Property review workflow
            </div>
          }
        />

        <KPICard
          title="Department Goals"
          value={
            goals.length > 0
              ? `${Math.round(
                  goals.reduce(
                    (total, goal) =>
                      total +
                      Number(
                        goal.progress || 0,
                      ),
                    0,
                  ) / goals.length,
                )}%`
              : "—"
          }
          trend={
            goals.length > 0
              ? "Current goal progress"
              : "No goal data"
          }
          trendColor="text-emerald-400"
          icon={Target}
          footer={
            <div className="text-xs text-ink/60">
              Operational milestone progress
            </div>
          }
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Department Health */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4">
                Department Health
              </h3>

              <div className="space-y-4 flex-1">
                {healthMetrics.map(
                  (metric) => (
                    <div
                      key={metric.label}
                      className="space-y-2"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="text-cream">
                          {metric.label}
                        </span>

                        <span className="font-semibold text-cream">
                          {metric.percentage ===
                          null
                            ? "—"
                            : `${metric.percentage}%`}
                        </span>
                      </div>

                      <div className="h-2 w-full bg-navy-950 rounded-full overflow-hidden border border-white/5">
                        <div
                          className={`h-full ${metric.color}`}
                          style={{
                            width: `${
                              metric.percentage ??
                              0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Cross-Department Dependency Summary */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4">
                Cross-Department Dependency
              </h3>

              <div className="space-y-5 flex-1">
                {dependencies
                  .slice(0, 3)
                  .map(
                    (dependency) => (
                      <div
                        key={
                          dependency.department
                        }
                      >
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-cream flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-ink/60" />
                            {
                              dependency.department
                            }
                          </span>

                          <span className="text-yellow-400 font-medium">
                            {dependency.impact ||
                              "—"}
                          </span>
                        </div>

                        <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full bg-yellow-400"
                            style={{
                              width: `${
                                dependency.progress ??
                                0
                              }%`,
                            }}
                          ></div>
                        </div>

                        <p className="text-[10px] text-ink/60 mt-1">
                          {dependency.description}
                        </p>
                      </div>
                    ),
                  )}
              </div>
            </div>
          </div>

          {/* Pending Department Approvals */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-lg font-semibold text-cream">
                Pending Department Approvals
              </h3>
            </div>

            <div className="space-y-3">
              {pendingApprovals.length ===
              0 ? (
                <div className="rounded-xl border border-white/5 bg-navy-900/50 p-6 text-center">
                  <p className="text-sm text-ink/60">
                    No pending approvals.
                  </p>
                </div>
              ) : (
                pendingApprovals.map(
                  (approval) => (
                    <div
                      key={approval.id}
                      className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 rounded-xl border border-white/5 bg-navy-900/50 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-800 border border-white/10 shrink-0">
                          <FileText className="h-5 w-5 text-gold-400" />
                        </div>

                        <div>
                          <h4 className="text-cream font-medium text-sm">
                            {approval.title}
                          </h4>

                          <p className="text-xs text-ink/60 mt-1">
                            Requested by:{" "}
                            {
                              approval.requestedBy
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:justify-end">
                        <div className="text-right hidden md:block">
                          <div className="text-xs font-semibold text-cream mb-1">
                            {approval.type}
                          </div>

                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getPriorityClass(
                              approval.priority,
                            )}`}
                          >
                            {approval.priority ||
                              "—"}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleApprove(
                                approval,
                              )
                            }
                            className="h-8 w-8 rounded bg-emerald-400/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-400/20 transition-colors"
                            title="Approve"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleReview(
                                approval,
                              )
                            }
                            className="h-8 px-3 rounded bg-navy-800 text-xs font-medium text-cream hover:bg-navy-700 transition-colors"
                          >
                            Review
                          </button>
                        </div>
                      </div>
                    </div>
                  ),
                )
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Weekly Department Highlights */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4">
                Weekly Department Highlights
              </h3>

              <div className="grid grid-cols-2 gap-4 flex-1">
                {(
                  highlightDepartments.length
                    ? highlightDepartments
                    : [
                        {
                          department:
                            "No data",
                          total: 0,
                          active: 0,
                          verified: 0,
                        },
                      ]
                )
                  .slice(0, 4)
                  .map(
                    (department) => {
                      const activeRate =
                        department.total >
                        0
                          ? Math.round(
                              (department.active /
                                department.total) *
                                100,
                            )
                          : null;

                      return (
                        <div
                          key={
                            department.department
                          }
                          className="p-4 rounded-xl border border-white/5 bg-navy-900/50 text-center flex flex-col justify-center"
                        >
                          <div className="text-xs text-ink/60 mb-2">
                            {
                              department.department
                            }
                          </div>

                          <div className="text-2xl font-bold text-cream mb-1">
                            {
                              department.total
                            }
                          </div>

                          <div className="text-[10px] text-emerald-400 flex items-center justify-center gap-1">
                            <TrendingUp className="h-3 w-3" />

                            {activeRate ===
                            null
                              ? "No activity data"
                              : `${activeRate}% active`}
                          </div>
                        </div>
                      );
                    },
                  )}
              </div>
            </div>

            {/* Department Goal Progress */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4">
                Department Goal Progress
              </h3>

              <div className="space-y-4 flex-1">
                {goals.length ===
                0 ? (
                  <div className="p-4 rounded-xl border border-white/5 bg-navy-900/50">
                    <div className="text-sm text-cream">
                      No goal data available
                    </div>

                    <div className="text-xs text-ink/60 mt-2">
                      Department goals are not
                      currently stored in the
                      management backend.
                    </div>
                  </div>
                ) : (
                  goals.map(
                    (milestone, index) => (
                      <div
                        key={
                          milestone.id ||
                          index
                        }
                        className="p-4 rounded-xl border border-white/5 bg-navy-900/50 hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-sm text-cream">
                            {milestone.title ||
                              "Department Goal"}
                          </div>

                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-400/10 text-blue-400">
                            {milestone.status ||
                              "Pending"}
                          </span>
                        </div>

                        <div className="text-xs text-ink/60 mb-3 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />

                          {milestone.date ||
                            "No date"}
                        </div>

                        <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gold-400 rounded-full"
                            style={{
                              width: `${
                                milestone.progress ??
                                0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ),
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Critical Operational Alerts */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="h-5 w-5 text-rose-400" />

              <h3 className="font-heading text-lg font-semibold text-cream">
                Critical Operational Alerts
              </h3>
            </div>

            <div className="space-y-4">
              {alerts.length ===
              0 ? (
                <div className="p-3 rounded-lg border border-white/5 bg-navy-900/50">
                  <p className="text-xs text-ink/60">
                    No critical operational
                    alerts.
                  </p>
                </div>
              ) : (
                alerts.map(
                  (alert, index) => {
                    const isCritical =
                      alert.severity ===
                        "Critical" ||
                      alert.severity ===
                        "High";

                    return (
                      <div
                        key={`${alert.title}-${index}`}
                        className={`p-3 rounded-lg border ${
                          isCritical
                            ? "border-rose-400/20 bg-rose-400/5"
                            : "border-blue-400/20 bg-blue-400/5"
                        }`}
                      >
                        <div
                          className={`text-sm font-semibold flex items-center gap-2 mb-1 ${
                            isCritical
                              ? "text-rose-400"
                              : "text-blue-400"
                          }`}
                        >
                          <AlertTriangle className="h-4 w-4" />

                          {alert.title}
                        </div>

                        <p className="text-xs text-ink/80 leading-relaxed">
                          {alert.description}
                        </p>
                      </div>
                    );
                  },
                )
              )}
            </div>
          </div>

          {/* Management Calendar */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-semibold text-cream flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gold-400" />

                Management Calendar
              </h3>
            </div>

            <div className="space-y-3">
              {upcomingCalendar.length ===
              0 ? (
                <div className="p-3 bg-navy-900/50 rounded-xl border border-white/5">
                  <p className="text-xs text-ink/60">
                    No calendar data available.
                  </p>
                </div>
              ) : (
                upcomingCalendar.map(
                  (event, index) => (
                    <div
                      key={`${event.title}-${index}`}
                      className="p-3 bg-navy-900/50 rounded-xl border border-white/5 border-l-2 border-l-gold-400"
                    >
                      <div className="font-medium text-sm text-cream mb-1">
                        {event.title}
                      </div>

                      <div className="text-[10px] text-ink/60 mb-2">
                        {formatDate(
                          event.date,
                        )}
                      </div>

                      <div className="flex justify-between items-center text-xs text-ink/60 mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />

                          {event.time ||
                            "—"}
                        </span>

                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />

                          {event.attendees}
                        </span>
                      </div>
                    </div>
                  ),
                )
              )}
            </div>
          </div>

          {/* Recent Management Actions */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            {recentTimelineItems.length >
            0 ? (
              <ActivityTimeline
                title="Recent Management Actions"
                items={
                  recentTimelineItems
                }
              />
            ) : (
              <div>
                <h3 className="font-heading text-lg font-semibold text-cream mb-4">
                  Recent Management Actions
                </h3>

                <p className="text-sm text-ink/60">
                  No recent management
                  activity.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={
          confirmationState.isOpen
        }
        onClose={() =>
          setConfirmationState(
            (prev) => ({
              ...prev,
              isOpen: false,
            }),
          )
        }
        onConfirm={
          confirmationState.onConfirm
        }
        title={
          confirmationState.title
        }
        description={
          confirmationState.description
        }
        confirmText={
          confirmationState.confirmText
        }
      />
    </div>
  );
}