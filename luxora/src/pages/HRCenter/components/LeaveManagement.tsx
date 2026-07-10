import { CalendarDays, Filter } from 'lucide-react';
import { useHRCenter } from '../hooks/useHRCenter';
import { HRStatusBadge } from './HRStatusBadge';
import { HR_STATUS_COLORS } from '../constants/hrConstants';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export const LeaveManagement = () => {
  const { leaveRequests, allEmployees } = useHRCenter();

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <CalendarDays className="w-6 h-6 mr-3 text-gold-500" />
            Leave Management
          </h2>
          <p className="text-gray-500 mt-1">Review pending leave requests, balances, and enterprise holiday calendar.</p>
        </div>
        <div className="flex items-center space-x-3">
          <GhostButton><Filter className="w-4 h-4 mr-2" /> Filter</GhostButton>
          <GoldButton>Enterprise Calendar</GoldButton>
        </div>
      </div>

      <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-ink-light border-b border-gray-200 dark:border-ink-light text-gray-500 dark:text-gray-400 text-sm">
              <th className="p-4 font-medium">Request ID</th>
              <th className="p-4 font-medium">Employee</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Dates</th>
              <th className="p-4 font-medium">Days</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-ink-light">
            {leaveRequests.map((req) => {
              const emp = allEmployees.find(e => e.id === req.employeeId);
              return (
                <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-ink-light/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{req.id}</td>
                  <td className="p-4 text-sm">
                    {emp ? (
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{emp.firstName} {emp.lastName}</div>
                        <div className="text-xs text-gray-500">{emp.department}</div>
                      </div>
                    ) : (
                      <div className="text-gray-400">Unknown</div>
                    )}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-700 dark:text-gray-300">{req.type}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{req.startDate} to {req.endDate}</td>
                  <td className="p-4 text-sm text-gray-900 dark:text-white font-bold">{req.days}</td>
                  <td className="p-4 text-sm">
                    <HRStatusBadge status={req.status} className={HR_STATUS_COLORS[req.status]} />
                  </td>
                  <td className="p-4 text-sm text-right">
                    {req.status === 'Pending' && (
                      <div className="flex justify-end space-x-2">
                        <GhostButton size="sm">Review</GhostButton>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
