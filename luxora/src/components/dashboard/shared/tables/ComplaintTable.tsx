import { CheckCircle, XCircle, MessageSquare, SearchX, ShieldAlert } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../ui/ui';
import { DataTable } from './DataTable';
import { EnterpriseStatusBadge } from '../../../enterprise/EnterpriseStatusBadge';
import type { AdminComplaint } from '../../../../types/admin';

export interface ComplaintTableProps {
  data: AdminComplaint[];
  mode?: 'operational' | 'oversight';
  onReview?: (item: AdminComplaint) => void;
  onResolve?: (item: AdminComplaint) => void;
  onClose?: (item: AdminComplaint) => void;
  onOverride?: (item: AdminComplaint) => void;
}

export function ComplaintTable({
  data,
  mode = 'operational',
  onReview,
  onResolve,
  onClose,
  onOverride
}: ComplaintTableProps) {
  return (
    <DataTable
      data={data}
      keyExtractor={(ticket) => ticket.id}
      columns={[
        {
          header: "Ticket ID",
          render: (ticket: AdminComplaint) => <span className="font-medium text-cream">{ticket.id}</span>
        },
        {
          header: "Type / Priority",
          render: (ticket: AdminComplaint) => (
            <>
              <div className="font-semibold text-cream">{ticket.type}</div>
              <div className={`text-xs mt-0.5 ${ticket.priority === 'High' ? 'text-rose-400' : ticket.priority === 'Medium' ? 'text-yellow-400' : 'text-blue-400'}`}>
                {ticket.priority} Priority
              </div>
            </>
          )
        },
        {
          header: "Reported By",
          render: (ticket: AdminComplaint) => <span className="text-ink/60">{ticket.user}</span>
        },
        {
          header: "Target",
          render: (ticket: AdminComplaint) => (
            <div className="flex flex-col gap-1">
              <div className="w-fit">
                <EnterpriseStatusBadge status={ticket.status} />
              </div>
              {ticket.priority === 'High' && (
                <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase w-fit text-rose-400 bg-rose-400/10 border-rose-400/20">
                  High Priority
                </span>
              )}
            </div>
          )
        },
        ...(mode === 'oversight' ? [{
          header: "Escalation Status",
          render: (ticket: AdminComplaint) => (
             ticket.priority === 'High' ? (
               <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase w-fit text-rose-400 bg-rose-400/10 border-rose-400/20">
                 Escalated to Exec
               </span>
             ) : (
               <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase w-fit text-emerald-400 bg-emerald-400/10 border-emerald-400/20">
                 Admin Handled
               </span>
             )
          )
        }] : []),
        {
          header: <div className="text-right">Actions</div>,
          className: "text-right",
          render: (ticket: AdminComplaint) => (
            <div className="flex items-center justify-end gap-2">
              {mode === 'operational' && ticket.status !== 'Resolved' && (
                <button onClick={() => onResolve?.(ticket)} className="rounded-lg p-2 text-ink/40 hover:bg-emerald-400/10 hover:text-emerald-400 transition-colors" title="Mark Resolved">
                  <CheckCircle className="h-5 w-5" />
                </button>
              )}
              {mode === 'operational' && (
                <button onClick={() => onClose?.(ticket)} className="rounded-lg p-2 text-ink/40 hover:bg-rose-400/10 hover:text-rose-400 transition-colors" title="Close Ticket">
                  <XCircle className="h-5 w-5" />
                </button>
              )}
              {mode === 'oversight' && (
                <GhostButton size="sm" onClick={() => onOverride?.(ticket)} className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 flex items-center gap-1">
                  <ShieldAlert className="h-4 w-4" /> Override
                </GhostButton>
              )}
              <GoldButton 
                size="sm" 
                className="ml-2 flex items-center gap-2"
                onClick={() => onReview?.(ticket)}
              >
                <MessageSquare className="h-4 w-4" /> View Thread
              </GoldButton>
            </div>
          )
        }
      ]}
      emptyState={
        <div className="flex flex-col items-center justify-center py-12 text-center bg-navy-900/50 rounded-xl border border-white/5 border-dashed">
          <SearchX className="h-12 w-12 text-ink/20 mb-4" />
          <h3 className="text-lg font-bold text-cream">No reports found</h3>
          <p className="text-sm text-ink/50 mt-1">All tickets have been processed or none match your criteria.</p>
        </div>
      }
    />
  );
}
