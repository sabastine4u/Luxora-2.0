import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { CheckCircle, XCircle, AlertTriangle, ShieldAlert, Image as ImageIcon, MessageSquare, Clock, User, Activity, FileText } from 'lucide-react';

export interface ReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Record<string, unknown> | null;
}

export function ReportDetailModal({ isOpen, onClose, report }: ReportDetailModalProps) {
  const [notes, setNotes] = useState('');

  if (!report) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setNotes('');
        onClose();
      }}
      title={`Ticket Details: ${report.id}`}
      size="4xl"
      actionButton={
        <div className="flex gap-2">
          <GhostButton size="sm" className="text-amber-400 hover:text-amber-300 hover:bg-amber-400/10">
            <AlertTriangle className="h-4 w-4 mr-2" /> Escalate
          </GhostButton>
          <GhostButton size="sm" className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10">
            <XCircle className="h-4 w-4 mr-2" /> Close Ticket
          </GhostButton>
          <GoldButton size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-white">
            <CheckCircle className="h-4 w-4 mr-2" /> Resolve
          </GoldButton>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Details & Logs */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="text-xs text-ink/50 mb-1">Report Type</div>
              <div className="font-semibold text-cream flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                {String(report.type)}
              </div>
            </div>
            <div>
              <div className="text-xs text-ink/50 mb-1">Status & Priority</div>
              <div className="flex items-center gap-2">
                <span className="bg-white/5 border border-white/10 text-cream text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {String(report.status)}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  report.priority === 'High' ? 'bg-rose-400/10 text-rose-400 border border-rose-400/20' :
                  report.priority === 'Medium' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' :
                  'bg-blue-400/10 text-blue-400 border border-blue-400/20'
                }`}>
                  {String(report.priority)}
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs text-ink/50 mb-1">Reported By</div>
              <div className="font-medium text-cream flex items-center gap-2">
                <User className="h-4 w-4 text-ink/40" />
                {String(report.user)}
              </div>
            </div>
            <div>
              <div className="text-xs text-ink/50 mb-1">Target</div>
              <div className="font-medium text-cream">{String(report.target)}</div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-cream mb-3">Evidence Attached</h4>
            <div className="flex h-32 items-center justify-center rounded-xl border border-white/10 bg-navy-900/50">
              <div className="text-center">
                <ImageIcon className="h-8 w-8 text-ink/20 mx-auto mb-2" />
                <span className="text-sm text-ink/40 font-semibold">Evidence Placeholder</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-400" /> Related Reports
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-navy-900/50 p-3 rounded-xl border border-white/10">
                <div>
                  <div className="text-sm font-semibold text-cream">TKT-089: Similar issue</div>
                  <div className="text-xs text-ink/50 mt-0.5">Resolved 2 days ago</div>
                </div>
                <GhostButton size="sm" className="px-2 py-1 text-xs">View</GhostButton>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-cream mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" /> Internal Moderator Activity
            </h4>
            <div className="space-y-3">
              <div className="text-sm text-ink/60 bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="font-semibold text-cream">Admin Chidi</span> viewed this ticket 15 mins ago.
              </div>
              <div className="text-sm text-ink/60 bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="font-semibold text-cream">System</span> automatically assigned to queue.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Notes */}
        <div className="space-y-6 lg:border-l lg:border-white/10 lg:pl-8">
          <div>
            <h4 className="text-sm font-semibold text-cream mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-gold-400" /> Conversation Timeline & Escalation
            </h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-rose-400" />
                  <div className="h-full w-px bg-white/10 mt-1" />
                </div>
                <div className="pb-3 text-sm">
                  <div className="text-cream font-medium">Ticket Escalated to Management</div>
                  <div className="text-ink/60 mt-0.5">High severity policy violation detected.</div>
                  <div className="text-ink/50 text-xs flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" /> 1 hour ago
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-gold-400" />
                  <div className="h-full w-px bg-white/10 mt-1" />
                </div>
                <div className="pb-3 text-sm">
                  <div className="text-cream font-medium">User Replied</div>
                  <div className="text-ink/60 mt-0.5 italic bg-navy-900/50 p-3 rounded-lg border border-white/5 mt-2">
                    "I have updated the listing photos as requested. Please review."
                  </div>
                  <div className="text-ink/50 text-xs flex items-center gap-1 mt-2">
                    <Clock className="h-3 w-3" /> 3 hours ago
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                  <div className="h-full w-px bg-transparent mt-1" />
                </div>
                <div className="pb-3 text-sm">
                  <div className="text-cream font-medium">Ticket Created</div>
                  <div className="text-ink/50 text-xs flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" /> 1 day ago
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <h4 className="text-sm font-semibold text-cream mb-3">Resolution Summary</h4>
            <div className="flex items-center gap-3 bg-navy-900/50 p-4 rounded-xl border border-white/10">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div className="text-sm text-ink/60">
                Ticket is currently unresolved. Review evidence and assign an outcome.
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <h4 className="text-sm font-semibold text-cream mb-3">Moderator Notes</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes for other moderators..."
              className="w-full h-24 rounded-xl border border-white/10 bg-navy-900/50 p-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none resize-none"
            />
          </div>

        </div>
      </div>
    </Modal>
  );
}
