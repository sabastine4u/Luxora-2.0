import { Building2, Users, Target, ShieldAlert, Activity, CheckCircle2, DollarSign, Award, TrendingUp, Zap, FileText } from 'lucide-react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';
import { StatusBadge } from '../shared/StatusBadge';
import { ActivityTimeline } from '../../../../components/dashboard/shared/timelines/ActivityTimeline';

interface DepartmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Record<string, unknown> | null;
}

export function DepartmentDetailModal({ isOpen, onClose, department }: DepartmentDetailModalProps) {
  if (!department) return null;

  const timelineItems = [
    { title: 'Q3 Budget Approved', time: 'Oct 01, 2025', desc: 'Operating budget expanded by 12%', icon: DollarSign, color: 'text-emerald-400' },
    { title: 'Risk Assessment: Warning', time: 'Sep 15, 2025', desc: 'Resource constraints flagged', icon: ShieldAlert, color: 'text-yellow-400' },
    { title: 'New Department Head Appointed', time: 'Jan 10, 2025', desc: 'Leadership transition completed', icon: Users, color: 'text-blue-400' },
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Department Oversight Details"
      size="xl"
      actionButton={<GoldButton>Manage Department</GoldButton>}
    >
      <div className="space-y-8 pb-4">
        {/* Header Profile Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start border-b border-white/5 pb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-navy-800 border border-white/10 text-gold-400 shrink-0">
            <Building2 className="h-10 w-10" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-cream">{String(department.name)}</h2>
              <p className="text-ink/60 text-lg">Head: <span className="text-cream">{String(department.head)}</span></p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={String(department.status)} />
              <span className="inline-flex items-center rounded-full border border-white/10 bg-navy-800/50 px-2.5 py-0.5 text-xs font-semibold text-ink/70">
                Headcount: {String(department.headcount)}
              </span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                String(department.riskLevel) === 'Low' ? 'bg-emerald-400/10 text-emerald-400' :
                String(department.riskLevel) === 'Medium' ? 'bg-yellow-400/10 text-yellow-400' :
                'bg-rose-400/10 text-rose-400'
              }`}>
                Risk: {String(department.riskLevel)}
              </span>
            </div>
            <div className="flex gap-4 pt-2">
              <GhostButton className="flex items-center gap-2 px-3 py-1.5 text-sm">
                <Target className="h-4 w-4" /> View Objectives
              </GhostButton>
              <GhostButton className="flex items-center gap-2 px-3 py-1.5 text-sm">
                <Activity className="h-4 w-4" /> Performance Metrics
              </GhostButton>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Resource Allocation, Initiatives, Notes */}
          <div className="space-y-6">
            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <h3 className="font-heading text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-gold-400" /> Active Initiatives
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-cream">Process Optimization</span>
                    <span className="text-emerald-400 font-medium">90%</span>
                  </div>
                  <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-emerald-400" style={{ width: '90%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-cream">Core Systems Upgrade</span>
                    <span className="text-blue-400 font-medium">45%</span>
                  </div>
                  <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-blue-400" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <h3 className="font-heading text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-400" /> Resource Allocation
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-ink/60">Q3 Operating Budget</span>
                  <span className="text-cream font-medium">$4.2M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink/60">Budget Consumed</span>
                  <span className="text-yellow-400 font-medium">88%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink/60">Headcount Capacity</span>
                  <span className={Number(department.headcount) > 50 ? 'text-rose-400 font-medium' : 'text-emerald-400 font-medium'}>
                    {Number(department.headcount) > 50 ? '105% (Strained)' : '92% (Optimal)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <h3 className="font-heading text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-ink/60" /> Internal Notes
              </h3>
              <p className="text-xs text-ink/80 leading-relaxed p-3 bg-navy-800 rounded-lg border border-white/5">
                Department is currently meeting all core KPIs. However, resource capacity needs to be addressed in Q4 to prevent burnout. Recommend increasing budget allocation by 5% to support new hires.
              </p>
            </div>
          </div>

          {/* Performance Summary, Timeline, Achievements */}
          <div className="space-y-6">
            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gold-400/10 border border-gold-400/20 shrink-0">
                <TrendingUp className="h-8 w-8 text-gold-400" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-cream">Performance Summary</h3>
                <p className="text-xs text-ink/60 mt-1">Overall rating: <span className="text-emerald-400 font-bold">A- (Excellent)</span></p>
                <p className="text-[10px] text-ink/40 mt-0.5">Top 15% across enterprise</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <h3 className="font-heading text-sm font-semibold text-cream mb-3 flex items-center gap-2">
                <Award className="h-4 w-4 text-gold-400" /> Recent Achievements
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-xs text-ink/80">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" /> Exceeded Q2 revenue targets by 14%
                </li>
                <li className="flex items-start gap-2 text-xs text-ink/80">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" /> Completed core systems migration with zero downtime
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <ActivityTimeline
                title="Initiative Timeline"
                items={timelineItems}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
