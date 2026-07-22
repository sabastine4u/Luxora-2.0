import { useState } from 'react';
import { Users, AlertTriangle, Building2, TrendingUp, Calendar, CheckCircle2, Activity } from 'lucide-react';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { useToast } from '../../../contexts/ToastContext';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseDetailDrawer } from '../../../components/enterprise/EnterpriseDetailDrawer';
import { ConfirmationModal } from './modals/ConfirmationModal';

export default function Overview() {
  const { showToast } = useToast();
  const [selectedTask, setSelectedTask] = useState<{id: string, title: string, type: string, priority: string, date: string} | null>(null);
  const [modalState, setModalState] = useState<'report' | 'complete' | 'reassign' | null>(null);

  const handleAction = (action: string) => {
    showToast({
      title: 'Backend Integration',
      description: `Action "${action}" is ready for backend integration.`,
      type: 'info'
    });
    setModalState(null);
  };

  const pendingTasks = [
    { id: 'T-01', title: 'Lease Renewal: Apt 4B', type: 'Administrative', priority: 'High', date: 'Today' },
    { id: 'T-02', title: 'HVAC Inspection: Unit 12', type: 'Maintenance', priority: 'High', date: 'Tomorrow' },
    { id: 'T-03', title: 'Review Expense Report', type: 'Financial', priority: 'Medium', date: 'In 2 days' }
  ];

  const recentActivities = [
    { id: 'A-01', text: 'Rent payment received from John Doe (Apt 2A)', time: '2 hours ago', icon: TrendingUp },
    { id: 'A-02', text: 'Maintenance request resolved: Leaking pipe (Unit 5)', time: '4 hours ago', icon: CheckCircle2 },
    { id: 'A-03', text: 'New tenant onboarding completed (Apt 7C)', time: '1 day ago', icon: Users }
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Property Manager Overview</h2>
          <p className="text-sm text-ink/60">Your command center for portfolio operations.</p>
        </div>
        <div className="flex gap-2">
          <GhostButton onClick={() => setModalState('report')}>Generate Report</GhostButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Properties"
          value="45"
          icon={Building2}
          iconColor="text-gold-400"
          trend="+2 this month"
          trendColor="text-emerald-400"
        />
        <KPICard
          title="Occupancy Rate"
          value="94%"
          icon={Users}
          iconColor="text-emerald-400"
          trend="Target: 95%"
          trendColor="text-rose-400"
        />
        <KPICard
          title="Pending Requests"
          value="12"
          icon={AlertTriangle}
          iconColor="text-rose-400"
          trend="-3 since last week"
          trendColor="text-emerald-400"
        />
        <KPICard
          title="Rent Collected"
          value="₦28.5M"
          icon={TrendingUp}
          iconColor="text-blue-400"
          trend="88% of monthly target"
          trendColor="text-emerald-400"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-lg font-semibold text-cream flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gold-400" /> Pending Tasks
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {pendingTasks.map(task => (
              <div 
                key={task.id} 
                className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-navy-900/50 hover:bg-white/5 cursor-pointer transition-colors"
                onClick={() => setSelectedTask(task)}
              >
                <div>
                  <div className="font-medium text-cream">{task.title}</div>
                  <div className="text-xs text-ink/60 mt-1 flex items-center gap-2">
                    <EnterpriseStatusBadge status={task.priority} />
                    <span>{task.type}</span>
                  </div>
                </div>
                <div className="text-xs font-semibold text-ink/40">{task.date}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-lg font-semibold text-cream flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-400" /> Recent Activities
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4">
            {recentActivities.map(activity => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex gap-4">
                  <div className="mt-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 border border-white/10 text-ink/40">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-cream">{activity.text}</div>
                    <div className="text-xs text-ink/40 mt-1">{activity.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <EnterpriseDetailDrawer
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title || 'Task Details'}
      >
        {selectedTask && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-navy-800/50 border border-white/10 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-ink/60 mb-1">Task ID</div>
                  <div className="font-medium text-cream">{selectedTask.id}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60 mb-1">Priority</div>
                  <EnterpriseStatusBadge status={selectedTask.priority} />
                </div>
                <div>
                  <div className="text-xs text-ink/60 mb-1">Type</div>
                  <div className="font-medium text-cream">{selectedTask.type}</div>
                </div>
                <div>
                  <div className="text-xs text-ink/60 mb-1">Due Date</div>
                  <div className="font-medium text-cream">{selectedTask.date}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-cream mb-2">Description</h4>
              <p className="text-sm text-ink/80 leading-relaxed">
                This is a mock description for the pending task {selectedTask.id}. 
                During backend integration, this will display the full details of the required operation.
              </p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <GoldButton className="flex-1" onClick={() => setModalState('complete')}>
                Complete Task
              </GoldButton>
              <GhostButton onClick={() => setModalState('reassign')}>
                Reassign Task
              </GhostButton>
            </div>
          </div>
        )}
      </EnterpriseDetailDrawer>

      <ConfirmationModal 
        isOpen={modalState === 'report'}
        onClose={() => setModalState(null)}
        title="Generate Executive Report"
        description="This will compile a comprehensive PDF report of all property operations, financials, and tasks for the current month. Proceed?"
        onConfirm={() => handleAction('Generate Report')}
      />

      <ConfirmationModal 
        isOpen={modalState === 'complete'}
        onClose={() => setModalState(null)}
        title="Complete Task"
        description={`Mark "${selectedTask?.title}" as completed?`}
        onConfirm={() => { handleAction('Complete Task'); setSelectedTask(null); }}
      />

      <ConfirmationModal 
        isOpen={modalState === 'reassign'}
        onClose={() => setModalState(null)}
        title="Reassign Task"
        description={`Are you sure you want to reassign "${selectedTask?.title}" to another team member?`}
        onConfirm={() => { handleAction('Reassign Task'); setSelectedTask(null); }}
      />
    </div>
  );
}
