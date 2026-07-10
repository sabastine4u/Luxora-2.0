import { X, Mail, Phone, Calendar, Clock, MessageSquare, Target, UserCircle, Plus, CheckSquare, Zap, ChevronRight, CheckCircle2 } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';
import { StatusBadge } from '../../../ManagementDashboard/components/shared/StatusBadge';
import { ActivityTimeline } from '../../../../components/dashboard/shared/timelines/ActivityTimeline';

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: {
    id: string; name: string; email: string; phone: string; interest: string; budget: string;
    status: string; agent: string; score: number; source: string; age: number; lastContact: string;
  } | null;
}

export function LeadDetailModal({ isOpen, onClose, lead }: LeadDetailModalProps) {
  if (!isOpen || !lead) return null;

  const communicationLog = [
    { title: 'Follow-up Call', time: '2 hours ago', desc: 'Discussed financing options. Very positive.', icon: Phone, color: 'text-emerald-400' },
    { title: 'Sent Property Brochure', time: 'Yesterday', desc: 'Emailed Ikoyi Penthouse details.', icon: Mail, color: 'text-blue-400' },
    { title: 'Initial Inquiry Received', time: '2 days ago', desc: 'Via Luxora Website Contact Form.', icon: Target, color: 'text-gold-400' },
  ];

  const upcomingTasks = [
    { title: 'Schedule Property Viewing', time: 'Tomorrow, 10:00 AM', status: 'Pending' },
    { title: 'Send Pre-approval Checklist', time: 'Thursday, 2:00 PM', status: 'Pending' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
      <div className="bg-navy-900 border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-navy-900 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-navy-950 flex items-center justify-center font-bold text-2xl text-cream border-2 border-white/10">
              {lead.name?.charAt(0) || 'L'}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-mono text-gold-400">{lead.id}</span>
                <StatusBadge status={lead.status} />
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 ${lead.score >= 80 ? 'bg-emerald-400/20 text-emerald-400' : lead.score >= 50 ? 'bg-yellow-400/20 text-yellow-400' : 'bg-rose-400/20 text-rose-400'}`}>
                  <Zap className="h-3 w-3" /> Score: {lead.score}
                </div>
              </div>
              <h2 className="text-2xl font-heading font-bold text-cream">{lead.name}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-ink/60">
                <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {lead.email}</span>
                <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {lead.phone}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-ink/60 hover:text-cream rounded-lg hover:bg-white/5 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Left Col: Journey & Details */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Conversion Journey */}
              <div className="p-5 rounded-xl border border-white/5 bg-navy-800/50">
                <h4 className="font-bold text-sm text-cream mb-4">Conversion Journey</h4>
                <div className="flex items-center justify-between relative">
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-navy-950 z-0"></div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-400 z-0" style={{ width: '50%' }}></div>
                  
                  {['New', 'Contacted', 'Qualified', 'Converted'].map((step, idx) => {
                    const isCompleted = idx <= 1; // Assuming 'Qualified' is the next step based on 50% width
                    const isCurrent = idx === 2;
                    return (
                      <div key={idx} className="relative z-10 flex flex-col items-center gap-2 bg-navy-800 px-2">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center border-2 ${
                          isCompleted ? 'bg-emerald-400 border-emerald-400 text-navy-950' : 
                          isCurrent ? 'bg-navy-950 border-gold-400 text-gold-400' : 
                          'bg-navy-950 border-white/20 text-ink/40'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-current"></div>}
                        </div>
                        <span className={`text-xs font-bold ${isCompleted ? 'text-emerald-400' : isCurrent ? 'text-gold-400' : 'text-ink/40'}`}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lead Requirements */}
              <div className="p-6 rounded-xl border border-white/5 bg-navy-800/50">
                <h4 className="font-bold text-sm text-cream mb-4 flex items-center gap-2"><Target className="h-4 w-4 text-gold-400" /> Requirements & Qualification</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs text-ink/60 mb-1">Primary Interest</div>
                    <div className="font-bold text-cream">{lead.interest}</div>
                  </div>
                  <div>
                    <div className="text-xs text-ink/60 mb-1">Stated Budget</div>
                    <div className="font-bold text-emerald-400">{lead.budget}</div>
                  </div>
                  <div>
                    <div className="text-xs text-ink/60 mb-1">Lead Source</div>
                    <div className="font-bold text-cream">{lead.source}</div>
                  </div>
                  <div>
                    <div className="text-xs text-ink/60 mb-1">Time on File</div>
                    <div className="font-bold text-cream">{lead.age} Days</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5">
                  <h5 className="text-xs font-bold text-ink/60 uppercase tracking-widest mb-3">Qualification Checklist</h5>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-cream"><CheckSquare className="h-4 w-4 text-emerald-400" /> Identity Verified</div>
                    <div className="flex items-center gap-2 text-sm text-cream"><CheckSquare className="h-4 w-4 text-emerald-400" /> Budget Confirmed</div>
                    <div className="flex items-center gap-2 text-sm text-ink/60"><CheckSquare className="h-4 w-4 opacity-30" /> Financing Approved</div>
                    <div className="flex items-center gap-2 text-sm text-ink/60"><CheckSquare className="h-4 w-4 opacity-30" /> Property Viewed</div>
                  </div>
                </div>
              </div>

              {/* Communication Log */}
              <div className="p-5 rounded-xl border border-white/5 bg-navy-800/50">
                 <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm text-cream flex items-center gap-2"><MessageSquare className="h-4 w-4 text-blue-400" /> Communication Log</h4>
                  <GhostButton className="text-[10px] px-2 py-1 h-auto">Log Activity</GhostButton>
                 </div>
                 <ActivityTimeline items={communicationLog} />
              </div>

            </div>

            {/* Right Col: Tasks & Agents */}
            <div className="space-y-6">
              
              {/* Assigned Agent */}
              <div className="p-5 rounded-xl border border-white/5 bg-navy-800/50">
                <h4 className="font-bold text-sm text-cream mb-4 flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-gold-400" /> Assigned Agent
                </h4>
                <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-navy-950">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-navy-900 flex items-center justify-center font-bold text-xs text-cream border border-gold-400/30">
                      {lead.agent?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-cream">{lead.agent}</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-ink/40" />
                </div>
                <GhostButton className="w-full mt-3 text-xs">Reassign Lead</GhostButton>
              </div>

              {/* Follow-up Tasks */}
              <div className="p-5 rounded-xl border border-white/5 bg-navy-800/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm text-cream flex items-center gap-2"><Calendar className="h-4 w-4 text-yellow-400" /> Follow-up Tasks</h4>
                  <GhostButton className="text-[10px] px-2 py-1 h-auto"><Plus className="h-3 w-3" /></GhostButton>
                </div>
                <div className="space-y-3">
                  {upcomingTasks.map((task, i) => (
                    <div key={i} className="p-3 rounded-lg border border-white/5 bg-navy-950 flex items-start gap-3">
                      <div className="mt-0.5"><div className="w-3 h-3 rounded border border-white/20"></div></div>
                      <div>
                        <div className="text-sm font-bold text-cream">{task.title}</div>
                        <div className="text-xs text-ink/60 flex items-center gap-1 mt-1"><Clock className="h-3 w-3" /> {task.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div className="p-5 rounded-xl border border-white/5 bg-navy-800/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-sm text-cream">Notes</h4>
                  </div>
                  <div className="p-3 rounded-lg border border-white/5 bg-navy-950 text-sm text-ink/80">
                    Client is very particular about security features. Wants to ensure the penthouse has private elevator access.
                  </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-between gap-3 bg-navy-900 sticky bottom-0 z-10">
           <GhostButton className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10">Mark as Lost</GhostButton>
           <div className="flex gap-3">
            <GhostButton onClick={onClose}>Close</GhostButton>
            <GoldButton>Convert to Client</GoldButton>
          </div>
        </div>

      </div>
    </div>
  );
}
