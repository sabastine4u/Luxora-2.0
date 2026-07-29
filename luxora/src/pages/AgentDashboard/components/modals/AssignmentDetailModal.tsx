import { X, Building2, MapPin, Calendar, CreditCard, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';
import { EnterpriseStatusBadge } from '../../../../components/enterprise/EnterpriseStatusBadge';

interface Assignment {
  id: string;
  propertyId: string;
  propertyTitle: string;
  coverImage: string;
  location: string;
  propertyType: string;
  transactionType: string;
  owner: string;
  agency: string;
  assignedBy: string;
  assignmentDate: string;
  responseDeadline: string;
  priority: string;
  verificationStatus: string;
  estimatedCommission: string;
  assignmentStatus: string;
  notes: string;
  documents: { name: string; type: string }[];
  images: string[];
}

interface AssignmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

export default function AssignmentDetailModal({ isOpen, onClose, assignment, onAccept, onDecline }: AssignmentDetailModalProps) {
  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-white/10 bg-navy-900 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6 bg-navy-950/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex rounded-full bg-gold-400/20 border border-gold-400/30 px-2 py-0.5 text-[10px] font-bold uppercase text-gold-400">
                New Assignment
              </span>
              <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase border ${
                assignment.priority === 'High' ? 'border-rose-400/30 bg-rose-500/10 text-rose-400' : 'border-blue-400/30 bg-blue-500/10 text-blue-400'
              }`}>
                {assignment.priority} Priority
              </span>
            </div>
            <h2 className="font-heading text-xl font-bold text-cream">{assignment.propertyTitle}</h2>
            <div className="flex items-center gap-2 text-sm text-ink/60 mt-1">
              <MapPin className="h-4 w-4" /> {assignment.location}
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-ink/50 hover:text-cream transition-colors rounded-lg bg-white/5">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          
          {/* Photos */}
          <div>
            <h3 className="text-sm font-bold text-cream mb-3 flex items-center gap-2">Property Images</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x">
              {assignment.images.map((img, i) => (
                <img key={i} src={img} alt="Property" className="h-40 w-64 object-cover rounded-xl border border-white/10 snap-start shrink-0" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Property Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-cream border-b border-white/10 pb-2">Assignment Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-[10px] uppercase tracking-wider text-ink/50 mb-1">Property Type</div>
                  <div className="text-sm font-semibold text-cream flex items-center gap-2"><Building2 className="h-3 w-3 text-gold-400" /> {assignment.propertyType}</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-[10px] uppercase tracking-wider text-ink/50 mb-1">Transaction</div>
                  <div className="text-sm font-semibold text-cream capitalize flex items-center gap-2"><CreditCard className="h-3 w-3 text-gold-400" /> {assignment.transactionType}</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-[10px] uppercase tracking-wider text-ink/50 mb-1">Assigned Date</div>
                  <div className="text-sm font-semibold text-cream flex items-center gap-2"><Calendar className="h-3 w-3 text-gold-400" /> {assignment.assignmentDate}</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-[10px] uppercase tracking-wider text-ink/50 mb-1">Est. Commission</div>
                  <div className="text-sm font-semibold text-emerald-400">{assignment.estimatedCommission}</div>
                </div>
              </div>

              <h3 className="text-sm font-bold text-cream border-b border-white/10 pb-2 mt-6">Internal Notes</h3>
              <div className="p-4 bg-navy-950/50 rounded-xl border border-white/5 text-sm text-ink/80 leading-relaxed italic">
                "{assignment.notes}"
              </div>
            </div>

            {/* Verification & Docs */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-cream border-b border-white/10 pb-2">Verification & Parties</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-xs text-ink/60">Owner</span>
                  <span className="text-sm font-medium text-cream">{assignment.owner}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-xs text-ink/60">Agency</span>
                  <span className="text-sm font-medium text-cream">{assignment.agency}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-xs text-ink/60">Assigned By</span>
                  <span className="text-sm font-medium text-cream">{assignment.assignedBy}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-xs text-ink/60 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Verification</span>
                  <EnterpriseStatusBadge status={assignment.verificationStatus} />
                </div>
              </div>

              <h3 className="text-sm font-bold text-cream border-b border-white/10 pb-2 mt-6">Available Documents</h3>
              <div className="space-y-2">
                {assignment.documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-navy-950/30 border border-white/5">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gold-400" />
                      <span className="text-xs text-cream">{doc.name}</span>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-white/10 p-6 bg-navy-950/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-rose-400 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Response Deadline: <span className="font-bold">{assignment.responseDeadline}</span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <GhostButton className="flex-1 sm:flex-none border-rose-500/20 text-rose-400 hover:bg-rose-500/10" onClick={() => onDecline(assignment.id)}>
              Decline Assignment
            </GhostButton>
            <GoldButton className="flex-1 sm:flex-none" onClick={() => onAccept(assignment.id)}>
              Accept Assignment
            </GoldButton>
          </div>
        </div>

      </div>
    </div>
  );
}
