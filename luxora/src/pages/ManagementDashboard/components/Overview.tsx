import { Activity, Users, CheckCircle2, Megaphone, Target, FileText, Calendar, Building2, TrendingUp, AlertTriangle, Clock, Zap, MessageSquare, Briefcase, ListTodo, ShieldAlert } from 'lucide-react';
import { DashboardHeader } from '../../../components/dashboard/shared/headers/DashboardHeader';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { useState } from 'react';
import { useSession } from '../../../contexts/SessionContext';
import { ActivityTimeline } from '../../../components/dashboard/shared/timelines/ActivityTimeline';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import type { PendingApproval } from '../../../types';

export default function Overview() {
  const { user } = useSession();
  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'Confirm',
    onConfirm: () => {}
  });

  const organizationHealth = [
    { label: 'Operational Efficiency', percentage: 94, color: 'bg-emerald-400' },
    { label: 'Resource Utilization', percentage: 88, color: 'bg-blue-400' },
    { label: 'Budget Adherence', percentage: 92, color: 'bg-gold-400' },
    { label: 'Risk Mitigation', percentage: 85, color: 'bg-yellow-400' }
  ];

  const pendingApprovals: PendingApproval[] = [
    { id: 1, title: 'Annual Leave Request', requestedBy: 'Sarah Jacobs (Finance)', type: 'HR', priority: 'Low', date: 'Today' },
    { id: 2, title: 'Department Training Budget', requestedBy: 'Chidi Okafor (Procurement)', type: 'Budget', priority: 'Medium', date: 'Yesterday' },
    { id: 3, title: 'New Software License Allocation', requestedBy: 'Musa Bello (Intelligence)', type: 'IT', priority: 'High', date: 'Oct 05' },
  ];

  const milestones = [
    { id: 1, title: 'Q4 Department OKRs', date: 'Nov 01, 2025', status: 'On Track', progress: 85 },
    { id: 2, title: 'Annual Performance Reviews', date: 'Dec 15, 2025', status: 'Pending', progress: 10 },
    { id: 3, title: 'Staff Training Program', date: 'Jan 10, 2026', status: 'Planning', progress: 30 },
  ];

  const decisionsTimeline = [
    { title: 'Shift Schedule Updated', time: 'Yesterday, 02:00 PM', desc: 'Approved by Department Head', icon: CheckCircle2, color: 'text-emerald-400' },
    { title: 'Training Program Initiated', time: 'Oct 04, 2025', desc: 'Implemented across all teams', icon: AlertTriangle, color: 'text-yellow-400' },
    { title: 'Q3 Budget Allocated', time: 'Oct 01, 2025', desc: 'Resource distribution completed', icon: FileText, color: 'text-blue-400' },
  ];

  const upcomingCalendar = [
    { title: 'Department Heads Meeting', time: 'Today, 10:00 AM', type: 'Management', attendees: 12 },
    { title: 'Operations Stand-up', time: 'Today, 02:30 PM', type: 'Departmental', attendees: 5 },
    { title: 'Performance Review Session', time: 'Tomorrow, 09:00 AM', type: 'HR', attendees: 8 },
  ];

  const handleApprove = (approval: PendingApproval) => {
    setConfirmationState({
      isOpen: true,
      title: 'Approve Request',
      description: `Are you sure you want to approve "${approval.title}" requested by ${approval.requestedBy}?`,
      confirmText: 'Approve',
      onConfirm: () => {
        // Mock backend approval
      }
    });
  };

  const handleReview = (approval: PendingApproval) => {
    setConfirmationState({
      isOpen: true,
      title: 'Submit for Review',
      description: `Do you want to submit "${approval.title}" for further review?`,
      confirmText: 'Submit',
      onConfirm: () => {
        // Mock backend review submission
      }
    });
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        name="Management Overview"
        subtitle="Operational command center for department leadership, team performance, approvals, and organizational execution."
        actions={
          <div className="flex gap-3">
          </div>
        }
      />

      {/* Manager Daily Briefing */}
      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Zap className="w-48 h-48 text-gold-400" />
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-400/20 text-gold-400 shrink-0 border border-gold-400/30">
          <MessageSquare className="h-8 w-8" />
        </div>
        <div className="flex-1 relative z-10">
          <h2 className="text-xl font-bold text-cream mb-2">Good morning, {user?.name?.split(' ')[0] || 'Manager'}.</h2>
          <p className="text-ink/80 text-sm leading-relaxed max-w-3xl">
            Department operations are performing at 94% efficiency today. There are <span className="font-bold text-cream">3 pending approvals</span> requiring your attention. Q3 department reports have been consolidated for review, and team performance remains on target across all active departments.
          </p>
        </div>
      </div>

      {/* Department Performance Snapshot (KPIs) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Overall Dept Health"
          value="94/100"
          trend="+2 points MoM"
          trendColor="text-emerald-400"
          icon={Activity}
          footer={<div className="text-xs text-ink/60">Cross-team composite</div>}
        />
        <KPICard
          title="Total Workforce"
          value="142"
          trend="98% present today"
          trendColor="text-emerald-400"
          icon={Users}
          footer={<div className="text-xs text-ink/60">Across 8 departments</div>}
        />
        <KPICard
          title="Pending Approvals"
          value="12"
          trend="3 high priority"
          trendColor="text-rose-400"
          icon={Clock}
          footer={<div className="text-xs text-ink/60">Requires manager review</div>}
        />
        <KPICard
          title="Department Goals"
          value="85%"
          trend="On track for Q4"
          trendColor="text-emerald-400"
          icon={Target}
          footer={<div className="text-xs text-ink/60">Operational milestone progress</div>}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Department Health */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4">Department Health</h3>
              <div className="space-y-4 flex-1">
                {organizationHealth.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-cream">{metric.label}</span>
                      <span className="font-semibold text-cream">{metric.percentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-navy-950 rounded-full overflow-hidden border border-white/5">
                      <div className={`h-full ${metric.color}`} style={{ width: `${metric.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cross-Department Dependency Summary */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4">Cross-Department Dependency</h3>
              <div className="space-y-5 flex-1">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-cream flex items-center gap-2"><Building2 className="h-4 w-4 text-ink/60" /> Finance & Admin</span>
                    <span className="text-yellow-400 font-medium">High Impact</span>
                  </div>
                  <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-yellow-400" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-[10px] text-ink/60 mt-1">Blocking 3 Intelligence workflows</p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-cream flex items-center gap-2"><Briefcase className="h-4 w-4 text-ink/60" /> Intelligence</span>
                    <span className="text-rose-400 font-medium">Critical</span>
                  </div>
                  <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-rose-400" style={{ width: '95%' }}></div>
                  </div>
                  <p className="text-[10px] text-ink/60 mt-1">Pending Procurement sign-off</p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-cream flex items-center gap-2"><ListTodo className="h-4 w-4 text-ink/60" /> Procurement</span>
                    <span className="text-emerald-400 font-medium">Optimal</span>
                  </div>
                  <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-emerald-400" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-[10px] text-ink/60 mt-1">Operating independently</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Department Approvals */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-lg font-semibold text-cream">Pending Department Approvals</h3>
            </div>
            <div className="space-y-3">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 rounded-xl border border-white/5 bg-navy-900/50 hover:bg-white/5 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-800 border border-white/10 shrink-0">
                      <FileText className="h-5 w-5 text-gold-400" />
                    </div>
                    <div>
                      <h4 className="text-cream font-medium text-sm">{approval.title}</h4>
                      <p className="text-xs text-ink/60 mt-1">Requested by: {approval.requestedBy}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:justify-end">
                    <div className="text-right hidden md:block">
                      <div className="text-xs font-semibold text-cream mb-1">{approval.type}</div>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${approval.priority === 'High' ? 'bg-rose-400/10 text-rose-400' : 'bg-yellow-400/10 text-yellow-400'}`}>
                        {approval.priority}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleApprove(approval)}
                        className="h-8 w-8 rounded bg-emerald-400/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-400/20 transition-colors" 
                        title="Approve"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleReview(approval)}
                        className="h-8 px-3 rounded bg-navy-800 text-xs font-medium text-cream hover:bg-navy-700 transition-colors"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Weekly Department Highlights */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4">Weekly Department Highlights</h3>
              <div className="grid grid-cols-2 gap-4 flex-1">
                {['Finance', 'Procurement', 'Intelligence', 'Property'].map((dept, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-white/5 bg-navy-900/50 text-center flex flex-col justify-center">
                    <div className="text-xs text-ink/60 mb-2">{dept}</div>
                    <div className="text-2xl font-bold text-cream mb-1">{98 - idx * 4}</div>
                    <div className="text-[10px] text-emerald-400 flex items-center justify-center gap-1">
                      <TrendingUp className="h-3 w-3" /> +{(4 - idx).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Goal Progress */}
            <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-full">
              <h3 className="font-heading text-lg font-semibold text-cream mb-4">Department Goal Progress</h3>
              <div className="space-y-4 flex-1">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="p-4 rounded-xl border border-white/5 bg-navy-900/50 hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-sm text-cream">{milestone.title}</div>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        milestone.status === 'On Track' ? 'bg-emerald-400/10 text-emerald-400' :
                        milestone.status === 'Pending' ? 'bg-yellow-400/10 text-yellow-400' :
                        'bg-blue-400/10 text-blue-400'
                      }`}>
                        {milestone.status}
                      </span>
                    </div>
                    <div className="text-xs text-ink/60 mb-3 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {milestone.date}
                    </div>
                    <div className="h-1.5 w-full bg-navy-950 rounded-full overflow-hidden">
                      <div className="h-full bg-gold-400 rounded-full" style={{ width: `${milestone.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          
          {/* Critical Operational Alerts */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="h-5 w-5 text-rose-400" />
              <h3 className="font-heading text-lg font-semibold text-cream">Critical Operational Alerts</h3>
            </div>
            <div className="space-y-4">
              <div className="p-3 rounded-lg border border-rose-400/20 bg-rose-400/5">
                <div className="text-sm font-semibold text-rose-400 flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4" /> Compliance Risk Detected
                </div>
                <p className="text-xs text-ink/80 leading-relaxed">3 vendor contracts expiring in 15 days without renewal drafts in Procurement.</p>
              </div>
              <div className="p-3 rounded-lg border border-blue-400/20 bg-blue-400/5">
                <div className="text-sm font-semibold text-blue-400 flex items-center gap-2 mb-1">
                  <Megaphone className="h-4 w-4" /> Policy Enforcement
                </div>
                <p className="text-xs text-ink/80 leading-relaxed">New hybrid work schedule requires department head acknowledgment by Friday.</p>
              </div>
            </div>
          </div>

          {/* Management Calendar */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-semibold text-cream flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gold-400" /> Management Calendar
              </h3>
            </div>
            <div className="space-y-3">
              {upcomingCalendar.map((event, i) => (
                <div key={i} className="p-3 bg-navy-900/50 rounded-xl border border-white/5 border-l-2 border-l-gold-400">
                  <div className="font-medium text-sm text-cream mb-1">{event.title}</div>
                  <div className="flex justify-between items-center text-xs text-ink/60 mt-2">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {event.time}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {event.attendees}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Management Actions */}
          <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6">
            <ActivityTimeline
              title="Recent Management Actions"
              items={decisionsTimeline}
            />
          </div>

        </div>
      </div>
      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={() => setConfirmationState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationState.onConfirm}
        title={confirmationState.title}
        description={confirmationState.description}
        confirmText={confirmationState.confirmText}
      />
    </div>
  );
}
