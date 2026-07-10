import { X, Mail, Phone, Award, CheckCircle2, TrendingUp, Building2, Clock, MessageSquare, Briefcase, FileText, Star } from 'lucide-react';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';
import { StatusBadge } from '../../../ManagementDashboard/components/shared/StatusBadge';
import { ActivityTimeline } from '../../../../components/dashboard/shared/timelines/ActivityTimeline';

interface AgencyAgentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: {
    name: string; email: string; phone: string; status: string; verified: boolean; assigned: number; score: number; department: string; id: string;
    level: string; joinDate: string; activeLeads: number; clientSat: number;
  } | null;
}

export function AgencyAgentDetailModal({ isOpen, onClose, agent }: AgencyAgentDetailModalProps) {
  if (!isOpen || !agent) return null;

  const activityHistory = [
    { title: 'Closed The Continental', time: '2 days ago', desc: '₦450M Transaction', icon: Award, color: 'text-gold-400' },
    { title: 'Onboarded new client', time: '4 days ago', desc: 'Added Aliko Dangote as Buyer', icon: CheckCircle2, color: 'text-blue-400' },
    { title: 'Viewing completed', time: '1 week ago', desc: 'Marina View Apartment', icon: Building2, color: 'text-emerald-400' },
  ];

  const careerTimeline = [
    { title: 'Promoted to Senior Broker', time: 'Jan 2025', desc: 'Achieved ₦2B in sales', icon: TrendingUp, color: 'text-emerald-400' },
    { title: 'Luxury Certification', time: 'Nov 2024', desc: 'Completed Luxora Premium Training', icon: FileText, color: 'text-gold-400' },
    { title: 'Joined Agency', time: agent.joinDate, desc: 'Started as Junior Broker', icon: Briefcase, color: 'text-blue-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
      <div className="bg-navy-900 border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 relative overflow-hidden bg-navy-900 sticky top-0 z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-400/10 to-transparent pointer-events-none" />
          <div className="flex items-center gap-4 relative">
            <div className="h-16 w-16 rounded-full bg-navy-950 flex items-center justify-center font-bold text-2xl text-cream border-2 border-gold-400/50">
              {agent.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-cream flex items-center gap-3">
                {agent.name}
                <StatusBadge status={agent.status} />
              </h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-ink/60">
                <span className="flex items-center gap-1 font-semibold text-gold-400 uppercase tracking-widest text-[10px]">{agent.level}</span>
                <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {agent.email}</span>
                <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {agent.phone}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-ink/60 hover:text-cream rounded-lg hover:bg-white/5 transition-colors relative">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Left Col: Analytics & Performance */}
            <div className="md:col-span-2 space-y-6">
              
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-white/5 bg-navy-800/50">
                  <div className="flex items-center gap-2 text-emerald-400 mb-2">
                    <TrendingUp className="h-4 w-4" /> <span className="text-xs font-bold uppercase">Conversion</span>
                  </div>
                  <div className="text-2xl font-bold text-cream">28%</div>
                  <div className="text-[10px] text-ink/60 mt-1">Top 5% in agency</div>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-navy-800/50">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <Building2 className="h-4 w-4" /> <span className="text-xs font-bold uppercase">Listings</span>
                  </div>
                  <div className="text-2xl font-bold text-cream">{agent.assigned}</div>
                  <div className="text-[10px] text-ink/60 mt-1">Active properties</div>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-navy-800/50">
                  <div className="flex items-center gap-2 text-gold-400 mb-2">
                    <Award className="h-4 w-4" /> <span className="text-xs font-bold uppercase">Score</span>
                  </div>
                  <div className="text-2xl font-bold text-cream">{agent.score}/100</div>
                  <div className="text-[10px] text-ink/60 mt-1">Overall rating</div>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-navy-800/50">
                  <div className="flex items-center gap-2 text-yellow-400 mb-2">
                    <Star className="h-4 w-4" /> <span className="text-xs font-bold uppercase">CSAT</span>
                  </div>
                  <div className="text-2xl font-bold text-cream">{agent.clientSat}/5</div>
                  <div className="text-[10px] text-ink/60 mt-1">Client Satisfaction</div>
                </div>
              </div>

              {/* Sales History & Achievements */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-white/5 bg-navy-800/50">
                  <h4 className="font-bold text-sm text-cream mb-4">Quarterly Sales Performance</h4>
                  <div className="flex items-end gap-2 h-32 mt-4">
                    {[40, 60, 45, 80, 50, 95].map((h, i) => (
                      <div key={i} className="flex-1 bg-navy-950 rounded-t-sm relative group">
                        <div 
                          className="absolute bottom-0 w-full bg-gold-400/60 rounded-t-sm transition-all group-hover:bg-gold-400" 
                          style={{ height: `${h}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-ink/60 mt-2">
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                  </div>
                </div>
                
                <div className="p-6 rounded-xl border border-white/5 bg-navy-800/50">
                  <h4 className="font-bold text-sm text-cream mb-4">Achievement Badges</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-2 bg-navy-950 rounded border border-gold-400/20">
                      <Award className="h-5 w-5 text-gold-400" />
                      <span className="text-xs text-cream font-medium">Top Seller Q1</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-navy-950 rounded border border-emerald-400/20">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <span className="text-xs text-cream font-medium">100% CSAT</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-navy-950 rounded border border-blue-400/20">
                      <Briefcase className="h-5 w-5 text-blue-400" />
                      <span className="text-xs text-cream font-medium">Luxury Expert</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Career & Certifications */}
              <div className="p-5 rounded-xl border border-white/5 bg-navy-800/50">
                 <ActivityTimeline title="Career & Certification Timeline" items={careerTimeline} />
              </div>

            </div>

            {/* Right Col: Details & Actions */}
            <div className="space-y-6">
              
              <div className="p-4 rounded-xl border border-white/5 bg-navy-800/50">
                <h4 className="font-bold text-sm text-cream mb-4">Verification & Training</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink/80 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> ID Verified</span>
                    <span className="text-emerald-400">Valid</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink/80 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> License</span>
                    <span className="text-emerald-400">Valid</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink/80 flex items-center gap-2"><Clock className="h-4 w-4 text-yellow-400" /> Annual Training</span>
                    <span className="text-yellow-400">75% Complete</span>
                  </div>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="p-4 rounded-xl border border-white/5 bg-navy-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-cream">Manager Notes</h3>
                    <GhostButton className="text-[10px] px-2 py-1 h-auto">Add Note</GhostButton>
                  </div>
                  <div className="p-3 rounded-lg border border-white/5 bg-navy-950 text-sm text-ink/80 flex gap-3">
                    <MessageSquare className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                    <p>Exceptional performer in the luxury sector. Recommend for partner track consideration next year.</p>
                  </div>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-navy-800/50">
                <ActivityTimeline title="Recent Activity" items={activityHistory} />
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-between gap-3 bg-navy-900 sticky bottom-0 z-10">
           <GhostButton className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10">Suspend Agent</GhostButton>
           <div className="flex gap-3">
            <GhostButton onClick={onClose}>Close</GhostButton>
            <GoldButton>Edit Profile</GoldButton>
          </div>
        </div>

      </div>
    </div>
  );
}
