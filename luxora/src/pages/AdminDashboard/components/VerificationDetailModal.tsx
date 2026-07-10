import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { ShieldCheck, CheckCircle, XCircle, AlertTriangle, FileText, Calendar, Clock, Activity } from 'lucide-react';

export interface VerificationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  item: Record<string, unknown> | null;
}

export function VerificationDetailModal({ isOpen, onClose, onApprove, onReject, item }: VerificationDetailModalProps) {
  const [notes, setNotes] = useState('');
  
  if (!item) return null;

  const checklist = [
    { id: 1, text: 'ID Document is clearly legible', checked: true },
    { id: 2, text: 'Selfie matches ID photo', checked: true },
    { id: 3, text: 'No signs of digital manipulation', checked: true },
    { id: 4, text: 'Document is not expired', checked: false },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setNotes('');
        onClose();
      }}
      title={`Verification Review: ${item.title}`}
      size="4xl"
      actionButton={
        <div className="flex gap-2">
          <GhostButton size="sm" className="text-ink/60 hover:text-cream hover:bg-white/10" onClick={onClose}>
            Cancel
          </GhostButton>
          <GhostButton size="sm" className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10" onClick={onReject}>
            <XCircle className="h-4 w-4 mr-2" /> Reject
          </GhostButton>
          <GoldButton size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-white" onClick={onApprove}>
            <CheckCircle className="h-4 w-4 mr-2" /> Approve
          </GoldButton>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Documents */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="text-xs text-ink/50 mb-1 flex items-center gap-2">
                <FileText className="h-3 w-3" /> Submitted By
              </div>
              <div className="font-semibold text-cream">{String(item.submitter || '')}</div>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="text-xs text-ink/50 mb-1 flex items-center gap-2">
                <Calendar className="h-3 w-3" /> Document Type
              </div>
              <div className="font-semibold text-cream">{String(item.type || 'Unknown')}</div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-cream mb-3">Document Comparison</h4>
            <div className="space-y-4">
              <div className="flex flex-col h-48 items-center justify-center rounded-xl border border-white/10 bg-navy-900/50">
                <ShieldCheck className="h-8 w-8 text-ink/20 mb-2" />
                <span className="text-ink/40 font-semibold text-sm">Primary Document</span>
                <span className="text-xs text-ink/50 mt-1">ID_FRONT_SCAN.jpg</span>
              </div>
              <div className="flex flex-col h-48 items-center justify-center rounded-xl border border-white/10 bg-navy-900/50">
                <ShieldCheck className="h-8 w-8 text-ink/20 mb-2" />
                <span className="text-ink/40 font-semibold text-sm">Supporting Document / Selfie</span>
                <span className="text-xs text-ink/50 mt-1">USER_SELFIE.jpg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Risk & Checklist */}
        <div className="space-y-6 lg:border-l lg:border-white/10 lg:pl-8">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/10">
              <div className="text-xs text-ink/50 flex items-center gap-2 mb-2">
                <Activity className="h-3 w-3" /> Verification Score
              </div>
              <div className="text-3xl font-bold text-emerald-400">85<span className="text-sm text-ink/40">/100</span></div>
            </div>
            <div className="bg-navy-900/50 p-4 rounded-xl border border-white/10">
              <div className="text-xs text-ink/50 flex items-center gap-2 mb-2">
                <AlertTriangle className="h-3 w-3" /> Risk Indicator
              </div>
              <div className="text-lg font-bold text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full inline-block border border-yellow-400/20">
                Medium Risk
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-cream mb-3">Verification Checklist</h4>
            <div className="space-y-3">
              {checklist.map((c) => (
                <label key={c.id} className="flex items-start gap-3 cursor-pointer group">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-white/20 bg-navy-900 group-hover:border-gold-400/50 transition-colors">
                    {c.checked && <CheckCircle className="h-3 w-3 text-gold-400" />}
                  </div>
                  <span className="text-sm text-ink/60 group-hover:text-cream transition-colors">{c.text}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-cream mb-3">Reviewer Notes</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes..."
              className="w-full h-20 rounded-xl border border-white/10 bg-navy-900/50 p-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-6 border-t border-white/10">
            <h4 className="text-sm font-semibold text-cream mb-4">Notes History</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-rose-400" />
                  <div className="h-full w-px bg-transparent mt-1" />
                </div>
                <div className="pb-2 text-sm">
                  <div className="text-cream font-medium">Previous Attempt Rejected</div>
                  <div className="text-ink/60 mt-0.5 text-xs">"Image was too blurry to read." - Admin Chidi</div>
                  <div className="text-ink/50 text-xs flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" /> 1 day ago
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </Modal>
  );
}
