import { FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

export const DepartmentDashboard = () => {
  const departments = [
    { name: 'Sales', active: 42, tasks: 128, completed: 45, alerts: 2, color: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10', border: 'border-emerald-100 dark:border-emerald-900/50' },
    { name: 'Finance', active: 18, tasks: 64, completed: 22, alerts: 1, color: 'bg-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10', border: 'border-blue-100 dark:border-blue-900/50' },
    { name: 'Procurement', active: 12, tasks: 34, completed: 18, alerts: 0, color: 'bg-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/10', border: 'border-purple-100 dark:border-purple-900/50' },
    { name: 'Compliance', active: 8, tasks: 45, completed: 12, alerts: 3, color: 'bg-gold-500', bg: 'bg-gold-50 dark:bg-gold-900/10', border: 'border-gold-100 dark:border-gold-900/50' },
    { name: 'Marketing', active: 15, tasks: 82, completed: 30, alerts: 0, color: 'bg-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/10', border: 'border-pink-100 dark:border-pink-900/50' },
    { name: 'Support', active: 24, tasks: 156, completed: 110, alerts: 5, color: 'bg-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/10', border: 'border-orange-100 dark:border-orange-900/50' }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-ink-dark/30">
      <div className="h-16 border-b border-gray-100 dark:border-ink-light bg-white dark:bg-ink flex items-center justify-between px-6 shrink-0">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">Department Activity Overview</h2>
          <p className="text-xs text-gray-500">Live operational metrics</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(dept => (
          <div key={dept.name} className={`rounded-2xl border ${dept.border} ${dept.bg} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white">{dept.name}</h3>
              <div className="flex items-center text-xs font-semibold text-gray-500 bg-white/50 dark:bg-ink/50 px-2 py-1 rounded-full">
                <div className={`w-2 h-2 rounded-full ${dept.color} mr-2`} />
                {dept.active} Online
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/60 dark:bg-ink/40 rounded-xl p-4 border border-white/40 dark:border-ink-light/20">
                <FileText className="w-4 h-4 text-gray-400 mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dept.tasks}</p>
                <p className="text-xs text-gray-500 font-medium">Pending Tasks</p>
              </div>
              <div className="bg-white/60 dark:bg-ink/40 rounded-xl p-4 border border-white/40 dark:border-ink-light/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dept.completed}</p>
                <p className="text-xs text-gray-500 font-medium">Completed</p>
              </div>
            </div>

            {dept.alerts > 0 ? (
              <div className="flex items-center text-sm font-medium text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-900/20 p-3 rounded-xl">
                <ShieldAlert className="w-4 h-4 mr-2" />
                {dept.alerts} Active Alerts
              </div>
            ) : (
              <div className="flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/20 p-3 rounded-xl">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                All clear
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
