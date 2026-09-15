import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
} from "lucide-react";

import { SegmentedProgressBar } from "../../../components/dashboard/shared/widgets/SegmentedProgressBar";
import { DataTableToolbar } from "../../../components/dashboard/shared/filters/DataTableToolbar";
import { ReportDetailModal } from "./ReportDetailModal";
import { DashboardHeader } from "../../../components/dashboard/shared/headers/DashboardHeader";
import { KPICard } from "../../../components/dashboard/shared/cards/KPICard";
import type { AdminComplaint } from "../../../types/admin";
import { ComplaintTable } from "../../../components/dashboard/shared/tables/ComplaintTable";
import { adminApi } from "../../../api/admin.api";

interface ApiComplaint {
  id: string;
  ticketId: string;
  type: string;
  user: string;
  target: string;
  targetType: string;
  status: string;
  priority: string;
  description: string;
  assignedTo: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  resolutionSummary: string;
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  closedAt: string | null;
  escalatedAt: string | null;
}

interface UpdatedComplaint {
  _id: string;
  status: string;
  priority: string;
}

export default function Complaints() {
  const [complaints, setComplaints] =
    useState<AdminComplaint[]>([]);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [selectedReport, setSelectedReport] =
    useState<AdminComplaint | null>(
      null,
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [updatingComplaintId, setUpdatingComplaintId] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * Load real complaints from MongoDB.
   */
  useEffect(() => {
    const loadComplaints =
      async () => {
        try {
          setIsLoading(true);
          setError(null);

          const response =
            await adminApi.getComplaints();

          const apiComplaints =
            (response.complaints ||
              []) as ApiComplaint[];

          /*
           * Keep the existing AdminComplaint
           * shape used by the current table.
           */
         const mappedComplaints =
  apiComplaints.map(
    (complaint) => ({
      id:
        complaint.id ||
        complaint.ticketId,

      ticketId:
        complaint.ticketId,

      type:
        complaint.type,

      user:
        complaint.user,

      target:
        complaint.target,

      targetType:
        complaint.targetType,

      status:
        complaint.status,

      priority:
        complaint.priority,

      date:
        complaint.createdAt,

      description:
        complaint.description,

      assignedTo:
        complaint.assignedTo,

      resolutionSummary:
        complaint.resolutionSummary,

      internalNotes:
        complaint.internalNotes,

      resolvedAt:
        complaint.resolvedAt,

      closedAt:
        complaint.closedAt,

      escalatedAt:
        complaint.escalatedAt,

      updatedAt:
        complaint.updatedAt,
    }),
  );

          setComplaints(
            mappedComplaints,
          );
        } catch (err) {
          console.error(
            "Failed to load Admin complaints:",
            err,
          );

          setError(
            "Unable to load complaints from the backend.",
          );
        } finally {
          setIsLoading(false);
        }
      };

    void loadComplaints();
  }, []);

  const filteredComplaints =
    useMemo(() => {
      if (!searchQuery) {
        return complaints;
      }

      const lowerQuery =
        searchQuery.toLowerCase();

      return complaints.filter(
        (complaint) =>
          complaint.id
            .toLowerCase()
            .includes(lowerQuery) ||
          complaint.type
            .toLowerCase()
            .includes(lowerQuery) ||
          complaint.user
            .toLowerCase()
            .includes(lowerQuery) ||
          complaint.target
            .toLowerCase()
            .includes(lowerQuery),
      );
    }, [
      complaints,
      searchQuery,
    ]);

  /*
   * Update complaint status in MongoDB.
   */
  const handleComplaintStatusUpdate =
    async (
      id: string,
      status:
        | "Resolved"
        | "Closed"
        | "Escalated",
    ) => {
      try {
        setUpdatingComplaintId(id);
        setError(null);

        const response =
          await adminApi.updateComplaintStatus(
            id,
            status,
          );

        const updatedComplaint =
          response.complaint as UpdatedComplaint;

        /*
         * Update the table immediately using
         * the backend-confirmed status.
         */
        setComplaints((prev) =>
          prev.map((complaint) =>
            complaint.id === id ||
            complaint.id ===
              updatedComplaint._id
              ? {
                  ...complaint,
                  status:
                    updatedComplaint.status,
                  priority:
                    updatedComplaint.priority,
                }
              : complaint,
          ),
        );

        /*
         * Keep the open detail modal synchronized
         * with the backend-confirmed status.
         */
        setSelectedReport((prev) =>
          prev &&
          (prev.id === id ||
            prev.id ===
              updatedComplaint._id)
            ? {
                ...prev,
                status:
                  updatedComplaint.status,
                priority:
                  updatedComplaint.priority,
              }
            : prev,
        );
      } catch (err) {
        console.error(
          "Failed to update complaint status:",
          err,
        );

        setError(
          "Unable to update the complaint status.",
        );
      } finally {
        setUpdatingComplaintId(null);
      }
    };

  const handleResolve = (
    id: string,
  ) =>
    handleComplaintStatusUpdate(
      id,
      "Resolved",
    );

  const handleClose = (
    id: string,
  ) =>
    handleComplaintStatusUpdate(
      id,
      "Closed",
    );

  const handleEscalate = (
    id: string,
  ) =>
    handleComplaintStatusUpdate(
      id,
      "Escalated",
    );

  /*
   * Real counts based on backend records.
   */
  const openTickets =
    complaints.filter(
      (complaint) =>
        complaint.status ===
          "Open" ||
        complaint.status ===
          "In Progress",
    ).length;

  const escalatedTickets =
    complaints.filter(
      (complaint) =>
        complaint.status ===
        "Escalated",
    ).length;

  const resolvedTickets =
    complaints.filter(
      (complaint) =>
        complaint.status ===
          "Resolved" ||
        complaint.status ===
          "Closed",
    ).length;

  const highSev =
    complaints.filter(
      (complaint) =>
        complaint.priority ===
        "High",
    ).length;

  const medSev =
    complaints.filter(
      (complaint) =>
        complaint.priority ===
        "Medium",
    ).length;

  const lowSev =
    complaints.filter(
      (complaint) =>
        complaint.priority ===
        "Low",
    ).length;

  /*
   * These remain placeholders until we expose
   * the required historical timing data.
   */
  const averageResolutionTime =
    "—";

  const resolvedToday =
    "—";

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Reported Listings & Tickets"
        subtitle="Resolve user disputes, reported listings, and platform issues."
      />

      {error && (
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      <div className="mb-2">
        <h2 className="text-sm font-semibold text-ink/50 uppercase tracking-wider">
          Moderator Workload
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPICard
          title="Open Tickets"
          value={
            isLoading
              ? "—"
              : openTickets
          }
          icon={FileText}
          trend={
            isLoading
              ? "Loading..."
              : "Action Required"
          }
          trendColor="text-yellow-400"
          iconColor="text-blue-400"
        />

        <KPICard
          title="Escalated Tickets"
          value={
            isLoading
              ? "—"
              : escalatedTickets
          }
          icon={AlertTriangle}
          trend={
            isLoading
              ? "Loading..."
              : "High Priority"
          }
          trendColor="text-rose-400"
          iconColor="text-rose-400"
          backgroundColor="bg-rose-400/10"
        />

        <KPICard
          title="Avg Resolution Time"
          value={
            isLoading
              ? "—"
              : averageResolutionTime
          }
          icon={Clock}
          trend={
            isLoading
              ? "Loading..."
              : "Backend metric pending"
          }
          trendColor="text-emerald-400"
          iconColor="text-emerald-400"
        />

        <KPICard
          title="Tickets Resolved Today"
          value={
            isLoading
              ? "—"
              : resolvedToday
          }
          icon={CheckCircle}
          trend={
            isLoading
              ? "Loading..."
              : `Total resolved: ${resolvedTickets}`
          }
          trendColor="text-emerald-400"
          iconColor="text-purple-400"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-rose-400" />

            <h3 className="font-heading text-lg font-bold text-cream">
              Report Severity Distribution
            </h3>
          </div>

          {isLoading ? (
            <div className="h-8 animate-pulse rounded-xl bg-white/5" />
          ) : (
            <SegmentedProgressBar
              segments={[
                {
                  label:
                    "High Severity",
                  value: highSev,
                  color:
                    "bg-rose-400",
                },
                {
                  label:
                    "Medium Severity",
                  value: medSev,
                  color:
                    "bg-yellow-400",
                },
                {
                  label:
                    "Low Severity",
                  value: lowSev,
                  color:
                    "bg-blue-400",
                },
              ]}
            />
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-emerald-400" />

            <h3 className="font-heading text-lg font-bold text-cream">
              Resolution & Status Overview
            </h3>
          </div>

          {isLoading ? (
            <div className="h-8 animate-pulse rounded-xl bg-white/5" />
          ) : (
            <SegmentedProgressBar
              segments={[
                {
                  label:
                    "Resolved (Closed)",
                  value:
                    resolvedTickets,
                  color:
                    "bg-emerald-400",
                },
                {
                  label:
                    "Open (In Progress)",
                  value:
                    openTickets,
                  color:
                    "bg-yellow-400",
                },
                {
                  label:
                    "Escalated",
                  value:
                    escalatedTickets,
                  color:
                    "bg-rose-400",
                },
              ]}
            />
          )}
        </div>
      </div>

      <DataTableToolbar
        searchValue={searchQuery}
        onSearchChange={
          setSearchQuery
        }
        searchPlaceholder="Search tickets..."
        showFilter
      />

      {isLoading ? (
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 space-y-4">
          <div className="h-10 animate-pulse rounded-xl bg-white/5" />
          <div className="h-10 animate-pulse rounded-xl bg-white/5" />
          <div className="h-10 animate-pulse rounded-xl bg-white/5" />
          <div className="h-10 animate-pulse rounded-xl bg-white/5" />
        </div>
      ) : (
        <ComplaintTable
          data={
            filteredComplaints
          }
          mode="operational"
          onReview={
            setSelectedReport
          }
          onResolve={(ticket) =>
            handleResolve(ticket.id)
          }
          onClose={(ticket) =>
            handleClose(ticket.id)
          }
        />
      )}

      <ReportDetailModal
        isOpen={
          !!selectedReport
        }
        onClose={() =>
          setSelectedReport(null)
        }
        report={
          selectedReport
        }
        onResolve={
          handleResolve
        }
        onEscalate={
          handleEscalate
        }
        onCloseTicket={
          handleClose
        }
      />

      {updatingComplaintId && (
        <div className="sr-only">
          Updating complaint...
        </div>
      )}
    </div>
  );
}