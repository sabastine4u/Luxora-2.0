import { DashboardHeader } from '../../components/dashboard/shared/headers/DashboardHeader';
import { LeftNavigation } from './components/LeftNavigation';
import { WorkflowDashboard } from './components/WorkflowDashboard';
import { ApprovalCenter } from './components/ApprovalCenter';
import { TaskAssignmentCenter } from './components/TaskAssignmentCenter';
import { WorkflowBuilder } from './components/WorkflowBuilder';
import { WorkflowTemplates } from './components/WorkflowTemplates';
import { EscalationCenter } from './components/EscalationCenter';
import { WorkflowTimeline } from './components/WorkflowTimeline';
import { SLADashboard } from './components/SLADashboard';
import { WorkflowAnalytics } from './components/WorkflowAnalytics';
import { DepartmentOverview } from './components/DepartmentOverview';
import { ExecutiveInsights } from './components/ExecutiveInsights';
import { useWorkflowCenter } from './hooks/useWorkflowCenter';
import { EnterpriseLayout } from '../../components/layout/EnterpriseLayout';
import { GhostButton } from '../../components/ui/ui';
import { Filter, Settings, Bell, GitMerge } from 'lucide-react';

export const WorkflowCenterPage = () => {
  const { activeWorkspace, setActiveWorkspace } = useWorkflowCenter();

  const renderWorkspace = () => {
    switch (activeWorkspace) {
      case 'dashboard': return <WorkflowDashboard />;
      case 'approvals': return <ApprovalCenter />;
      case 'tasks': return <TaskAssignmentCenter />;
      case 'builder': return <WorkflowBuilder />;
      case 'templates': return <WorkflowTemplates />;
      case 'escalations': return <EscalationCenter />;
      case 'timeline': return <WorkflowTimeline />;
      case 'sla': return <SLADashboard />;
      case 'analytics': return <WorkflowAnalytics />;
      case 'departments': return <DepartmentOverview />;
      case 'executive': return <ExecutiveInsights />;
      default: return <WorkflowDashboard />;
    }
  };

  return (
    <EnterpriseLayout activeTab="Workflow Center">
      <div className="min-h-[calc(100vh-8rem)] flex flex-col bg-gray-50 dark:bg-ink-dark overflow-hidden rounded-2xl border border-gray-100 dark:border-ink-light">
        <div className="p-6 pb-2 shrink-0">
        <DashboardHeader 
          name="Enterprise Workflow Engine" 
          subtitle="Automate, track, and manage business processes across Luxora." 
        />
      </div>
      
      {/* Global Toolbar */}
      <div className="h-14 bg-white dark:bg-ink border-b border-gray-200 dark:border-ink-light flex items-center px-6 shrink-0 justify-between">
        <div className="flex items-center text-sm font-semibold text-gray-900 dark:text-white">
          <GitMerge className="w-4 h-4 mr-2 text-gold-500" />
          Central Orchestration Layer
        </div>
        <div className="flex items-center space-x-3">
          <GhostButton size="sm"><Filter className="w-4 h-4 mr-2" /> Global Filter</GhostButton>
          <div className="w-px h-4 bg-gray-200 dark:bg-ink-light mx-2" />
          <GhostButton size="sm"><Bell className="w-4 h-4" /></GhostButton>
          <GhostButton size="sm"><Settings className="w-4 h-4" /></GhostButton>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <LeftNavigation activeWorkspace={activeWorkspace} onSelect={setActiveWorkspace} />
        <main className="flex-1 relative overflow-hidden bg-white dark:bg-ink">
          {renderWorkspace()}
        </main>
        </div>
      </div>
    </EnterpriseLayout>
  );
};
