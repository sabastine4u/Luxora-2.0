import { useWorkflowCenter } from '../hooks/useWorkflowCenter';
import { TaskCard } from './TaskCard';
import { WorkflowSearch } from './WorkflowSearch';

export const TaskAssignmentCenter = () => {
  const { tasks, searchQuery, setSearchQuery } = useWorkflowCenter();
  
  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-ink">
      <div className="p-6 border-b border-gray-100 dark:border-ink-light shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Task Assignment Center</h1>
        <WorkflowSearch query={searchQuery} onChange={setSearchQuery} placeholder="Search tasks by assignee, title, or workflow..." />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
};
