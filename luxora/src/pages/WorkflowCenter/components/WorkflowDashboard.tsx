import { useWorkflowCenter } from '../hooks/useWorkflowCenter';
import { WorkflowCard } from './WorkflowCard';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { WorkflowSearch } from './WorkflowSearch';
import { Activity, Clock, ShieldAlert, GitMerge } from 'lucide-react';

export const WorkflowDashboard = () => {
  const { workflows, metrics, searchQuery, setSearchQuery } = useWorkflowCenter();
  
  const filteredWorkflows = workflows.filter(w => 
    w.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    w.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-ink">
      <div className="p-6 border-b border-gray-100 dark:border-ink-light shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Workflow Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <KPICard title="Active Workflows" value={metrics.activeWorkflowsCount.toString()} icon={GitMerge} trend="+12" trendColor="text-emerald-500" />
          <KPICard title="Pending Approvals" value={metrics.pendingApprovalsCount.toString()} icon={Clock} trend="-5" trendColor="text-red-500" />
          <KPICard title="Completed Today" value="14" icon={Activity} trend="+8" trendColor="text-emerald-500" />
          <KPICard title="Escalations" value={metrics.escalationCount.toString()} icon={ShieldAlert} trend="-2" trendColor="text-red-500" />
        </div>
        
        <WorkflowSearch query={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Active Workflows</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkflows.map(workflow => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      </div>
    </div>
  );
};
