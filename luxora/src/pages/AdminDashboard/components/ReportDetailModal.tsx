import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ShieldAlert,
  MessageSquare,
  Clock,
  User,
  Target,
  UserCheck,
} from "lucide-react";

import { Modal } from "../../../components/ui/Modal";
import {
  GoldButton,
  GhostButton,
} from "../../../components/ui/ui";

import type { AdminComplaint } from "../../../types/admin";

export interface ReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AdminComplaint | null;
  onEscalate?: (id: string) => void;
  onCloseTicket?: (id: string) => void;
  onResolve?: (id: string) => void;
}

export function ReportDetailModal({
  isOpen,
  onClose,
  report,
  onEscalate,
  onCloseTicket,
  onResolve,
}: ReportDetailModalProps) {
  if (!report) {
    return null;
  }

  const formattedCreatedDate = report.date
    ? new Date(report.date).toLocaleString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      )
    : "Date unavailable";

  const formattedResolvedDate =
    report.resolvedAt
      ? new Date(
          report.resolvedAt,
        ).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  const formattedClosedDate =
    report.closedAt
      ? new Date(
          report.closedAt,
        ).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  const formattedEscalatedDate =
    report.escalatedAt
      ? new Date(
          report.escalatedAt,
        ).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  const isResolved =
    report.status ===
      "Resolved" ||
    report.status ===
      "Closed";

  const isEscalated =
    report.status ===
    "Escalated";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ticket Details: ${
        report.ticketId ||
        report.id
      }`}
      size="4xl"
      actionButton={
        <div className="flex flex-wrap gap-2">
          {!isEscalated &&
            !isResolved && (
              <GhostButton
                size="sm"
                onClick={() => {
                  onEscalate?.(
                    report.id,
                  );
                  onClose();
                }}
                className="text-amber-400 hover:text-amber-300 hover:bg-amber-400/10"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Escalate
              </GhostButton>
            )}

          {report.status !==
            "Closed" && (
            <GhostButton
              size="sm"
              onClick={() => {
                onCloseTicket?.(
                  report.id,
                );
                onClose();
              }}
              className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Close Ticket
            </GhostButton>
          )}

          {report.status !==
            "Resolved" &&
            report.status !==
              "Closed" && (
              <GoldButton
                size="sm"
                onClick={() => {
                  onResolve?.(
                    report.id,
                  );
                  onClose();
                }}
                className="bg-emerald-500 text-white hover:bg-emerald-400"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Resolve
              </GoldButton>
            )}
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Basic complaint information */}
          <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="mb-1 text-xs text-ink/50">
                Complaint Type
              </div>

              <div className="flex items-center gap-2 font-semibold text-cream">
                <ShieldAlert className="h-4 w-4 text-rose-400" />

                {report.type}
              </div>
            </div>

            <div>
              <div className="mb-1 text-xs text-ink/50">
                Status & Priority
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-cream">
                  {report.status}
                </span>

                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                    report.priority ===
                    "High"
                      ? "border-rose-400/20 bg-rose-400/10 text-rose-400"
                      : report.priority ===
                          "Medium"
                        ? "border-yellow-400/20 bg-yellow-400/10 text-yellow-400"
                        : "border-blue-400/20 bg-blue-400/10 text-blue-400"
                  }`}
                >
                  {report.priority}
                </span>
              </div>
            </div>

            <div>
              <div className="mb-1 text-xs text-ink/50">
                Reported By
              </div>

              <div className="flex items-center gap-2 font-medium text-cream">
                <User className="h-4 w-4 text-ink/40" />

                {report.user}
              </div>
            </div>

            <div>
              <div className="mb-1 text-xs text-ink/50">
                Target
              </div>

              <div className="flex items-center gap-2 font-medium text-cream">
                <Target className="h-4 w-4 text-ink/40" />

                {report.target}
              </div>

              {report.targetType && (
                <p className="mt-1 text-xs text-ink/40">
                  {report.targetType}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-cream">
              Complaint Description
            </h4>

            <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
              <p className="whitespace-pre-wrap text-sm leading-6 text-ink/70">
                {report.description ||
                  "No complaint description was provided."}
              </p>
            </div>
          </div>

          {/* Reporter */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-cream">
              <User className="h-4 w-4 text-blue-400" />
              Reporter
            </h4>

            <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
              <p className="text-sm font-semibold text-cream">
                {report.user}
              </p>

              <p className="mt-1 text-xs text-ink/50">
                Complaint submitted on{" "}
                {formattedCreatedDate}
              </p>
            </div>
          </div>

          {/* Assigned moderator */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-cream">
              <UserCheck className="h-4 w-4 text-gold-400" />
              Assigned Moderator
            </h4>

            <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
              {report.assignedTo ? (
                <>
                  <p className="text-sm font-semibold text-cream">
                    {report.assignedTo.name}
                  </p>

                  <p className="mt-1 text-xs text-ink/50">
                    {report.assignedTo.email}
                  </p>

                  <p className="mt-1 text-xs text-ink/50">
                    {report.assignedTo.role}
                  </p>
                </>
              ) : (
                <p className="text-sm text-ink/50">
                  No moderator is currently assigned.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6 lg:border-l lg:border-white/10 lg:pl-8">
          {/* Real timeline */}
          <div>
            <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-cream">
              <MessageSquare className="h-4 w-4 text-gold-400" />
              Complaint Timeline
            </h4>

            <div className="space-y-4">
              {/* Created */}
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />

                  <div className="mt-1 h-full w-px bg-white/10" />
                </div>

                <div className="pb-3 text-sm">
                  <div className="font-medium text-cream">
                    Complaint Created
                  </div>

                  <div className="mt-1 flex items-center gap-1 text-xs text-ink/50">
                    <Clock className="h-3 w-3" />
                    {formattedCreatedDate}
                  </div>
                </div>
              </div>

              {/* Escalated */}
              {report.escalatedAt && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-rose-400" />

                    <div className="mt-1 h-full w-px bg-white/10" />
                  </div>

                  <div className="pb-3 text-sm">
                    <div className="font-medium text-cream">
                      Complaint Escalated
                    </div>

                    <div className="mt-1 flex items-center gap-1 text-xs text-ink/50">
                      <Clock className="h-3 w-3" />
                      {formattedEscalatedDate}
                    </div>
                  </div>
                </div>
              )}

              {/* Resolved */}
              {report.resolvedAt && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />

                    <div className="mt-1 h-full w-px bg-white/10" />
                  </div>

                  <div className="pb-3 text-sm">
                    <div className="font-medium text-cream">
                      Complaint Resolved
                    </div>

                    <div className="mt-1 flex items-center gap-1 text-xs text-ink/50">
                      <Clock className="h-3 w-3" />
                      {formattedResolvedDate}
                    </div>
                  </div>
                </div>
              )}

              {/* Closed */}
              {report.closedAt && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-purple-400" />
                  </div>

                  <div className="pb-3 text-sm">
                    <div className="font-medium text-cream">
                      Complaint Closed
                    </div>

                    <div className="mt-1 flex items-center gap-1 text-xs text-ink/50">
                      <Clock className="h-3 w-3" />
                      {formattedClosedDate}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resolution */}
          <div className="border-t border-white/10 pt-6">
            <h4 className="mb-3 text-sm font-semibold text-cream">
              Resolution Summary
            </h4>

            {report.resolutionSummary ? (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

                  <p className="whitespace-pre-wrap text-sm leading-6 text-ink/70">
                    {report.resolutionSummary}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />

                  <p className="text-sm text-ink/60">
                    No resolution summary has been recorded yet.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Internal notes */}
          <div className="border-t border-white/10 pt-6">
            <h4 className="mb-3 text-sm font-semibold text-cream">
              Internal Moderator Notes
            </h4>

            <div className="rounded-xl border border-white/10 bg-navy-900/50 p-4">
              {report.internalNotes ? (
                <p className="whitespace-pre-wrap text-sm leading-6 text-ink/70">
                  {report.internalNotes}
                </p>
              ) : (
                <p className="text-sm text-ink/50">
                  No internal notes have been recorded for this complaint.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}