import { Mail, Phone, Calendar, Briefcase, Activity, TrendingUp, Award, BookOpen, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';
import { StatusBadge } from '../shared/StatusBadge';
import { ActivityTimeline } from '../../../../components/dashboard/shared/timelines/ActivityTimeline';

interface ManagementTeamDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Record<string, unknown> | null;
}

export function ManagementTeamDetailModal({ isOpen, onClose, member }: ManagementTeamDetailModalProps) {
  if (!member) return null;

  const performanceHistory = [
    { title: 'Q3 2025 Review', time: 'Oct 01, 2025', desc: 'Rated A+ by Manager', icon: TrendingUp, color: 'text-emerald-400' },
    { title: 'Promotion: Senior Staff', time: 'Jan 15, 2025', desc: 'Promoted to Senior level', icon: Award, color: 'text-gold-400' },
    { title: 'Department Transfer', time: 'Aug 10, 2024', desc: 'Transferred to current department', icon: Briefcase, color: 'text-blue-400' },
  ];

  const trainingProgress = [
    { id: 1, name: 'Enterprise Security Protocol', progress: 100, status: 'Completed' },
    { id: 2, name: 'Advanced Leadership Track', progress: 40, status: 'In Progress' },
    { id: 3, name: 'Data Privacy Compliance 2025', progress: 100, status: 'Completed' },
  ];

  const achievements = [
    'Q2 2025 Employee of the Quarter',
    'Spearheaded the V2 Process Optimization',
    'Perfect Attendance 2024'
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Employee Profile & Insights"
      size="xl"
      actionButton={<GoldButton>Manage Employee</GoldButton>}
    >
      <div className="space-y-8 pb-4">
        {/* Header Profile Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start border-b border-white/5 pb-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gold-gradient text-4xl font-bold text-navy-900 shrink-0">
            {String(member.name).charAt(0)}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-cream">{String(member.name)}</h2>
              <p className="text-ink/60 text-lg">{String(member.role)} • {String(member.department)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={String(member.status)} />
              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-ink/70">
                Performance: {member.performance ? String(member.performance) : 'A+'}
              </span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                Available
              </span>
            </div>
            <div className="flex gap-4 pt-2">
              <GhostButton className="flex items-center gap-2 px-3 py-1.5 text-sm">
                <Mail className="h-4 w-4" /> Contact
              </GhostButton>
              <GhostButton className="flex items-center gap-2 px-3 py-1.5 text-sm">
                <Calendar className="h-4 w-4" /> Schedule Check-in
              </GhostButton>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Workload, Skills, Notes */}
          <div className="space-y-6">
            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <h3 className="font-heading text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-ink/60" /> Current Workload
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-ink/60 mb-1">
                    <span>Task Capacity</span>
                    <span className="font-medium text-cream">85%</span>
                  </div>
                  <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-blue-400" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-ink/60">
                  <Clock className="h-3 w-3" /> 4 Active Projects / 1 Pending Review
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <h3 className="font-heading text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                <Award className="h-4 w-4 text-ink/60" /> Skills & Achievements
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {['Leadership', 'Agile Management', 'Risk Assessment', 'Enterprise Comms'].map((skill, idx) => (
                  <span key={idx} className="inline-flex items-center rounded-full bg-navy-800 px-2.5 py-1 text-xs font-medium text-cream border border-white/5">
                    {skill}
                  </span>
                ))}
              </div>
              <ul className="space-y-2">
                {achievements.map((ach, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-ink/80">
                    <CheckCircle2 className="h-3.5 w-3.5 text-gold-400 mt-0.5 shrink-0" /> {ach}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <h3 className="font-heading text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-ink/60" /> Internal Notes
              </h3>
              <p className="text-xs text-ink/80 leading-relaxed p-3 bg-navy-800 rounded-lg border border-white/5">
                Outstanding performer in Q3. Ready for cross-department leadership roles. Requires further training on new Enterprise Software Rollout expected in Q4.
              </p>
            </div>
          </div>

          {/* Contact, Training, Timeline */}
          <div className="space-y-6">
            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <h3 className="font-heading text-sm font-semibold text-cream mb-3">Employee Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-ink/40" />
                  <span className="text-cream truncate">{String(member.name).toLowerCase().replace(' ', '.')}@luxora.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-ink/40" />
                  <span className="text-cream">+234 (0) 800 123 4567</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-ink/40" />
                  <span className="text-ink/60">Joined: <span className="text-cream">Mar 15, 2022</span></span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <h3 className="font-heading text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-ink/60" /> Training & Certifications
              </h3>
              <div className="space-y-3">
                {trainingProgress.map((tr) => (
                  <div key={tr.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-cream truncate pr-2">{tr.name}</span>
                      <span className={tr.progress === 100 ? 'text-emerald-400 font-bold' : 'text-gold-400 font-bold'}>
                        {tr.progress}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden">
                      <div className={`h-full ${tr.progress === 100 ? 'bg-emerald-400' : 'bg-gold-400'}`} style={{ width: `${tr.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <ActivityTimeline
                title="Career & Performance History"
                items={performanceHistory}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
