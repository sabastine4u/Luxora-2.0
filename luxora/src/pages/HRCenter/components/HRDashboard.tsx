import { Users, UserPlus, Clock, CalendarDays } from 'lucide-react';
import { useHRCenter } from '../hooks/useHRCenter';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { HRStatusBadge } from './HRStatusBadge';
import { HR_STATUS_COLORS } from '../constants/hrConstants';

export const HRDashboard = () => {
  const { totalEmployees, activeEmployeeCount, onLeaveCount, openPositionsCount, employees } = useHRCenter();

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Users className="w-6 h-6 mr-3 text-gold-500" />
          Enterprise HR Dashboard
        </h2>
        <p className="text-gray-500 mt-1">Real-time workforce intelligence and organizational overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <KPICard title="Total Employees" value={totalEmployees.toString()} icon={Users} trend="+5.2%" trendColor="text-emerald-500" />
        <KPICard title="Active Employees" value={activeEmployeeCount.toString()} icon={Users} trend="Current" trendColor="text-blue-500" />
        <KPICard title="On Leave" value={onLeaveCount.toString()} icon={CalendarDays} trend="Currently" trendColor="text-orange-500" />
        <KPICard title="Open Positions" value={openPositionsCount.toString()} icon={UserPlus} trend="Actively Hiring" trendColor="text-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Hires / Active Employees */}
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Workforce Updates</h3>
          <div className="space-y-4">
            {employees.slice(0, 5).map(emp => (
              <div key={emp.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-ink-light rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-ink-lighter">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{emp.firstName} {emp.lastName}</h4>
                  <p className="text-xs text-gray-500">{emp.position} • {emp.department}</p>
                </div>
                <HRStatusBadge 
                  status={emp.status} 
                  className={HR_STATUS_COLORS[emp.status] || 'bg-gray-100 text-gray-600'} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Summary Placeholder */}
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 flex flex-col">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Today's Attendance</h3>
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-ink-dark rounded-lg border border-dashed border-gray-200 dark:border-ink-light">
            <div className="text-center">
              <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Attendance Distribution (UI Only)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
