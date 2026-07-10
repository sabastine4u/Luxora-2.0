import { Clock, Download } from 'lucide-react';
import { useHRCenter } from '../hooks/useHRCenter';
import { HRStatusBadge } from './HRStatusBadge';
import { HR_STATUS_COLORS } from '../constants/hrConstants';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export const AttendanceCenter = () => {
  const { attendance, allEmployees } = useHRCenter();

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Clock className="w-6 h-6 mr-3 text-gold-500" />
            Attendance & Time Tracking
          </h2>
          <p className="text-gray-500 mt-1">Monitor daily enterprise attendance, late arrivals, and remote workers.</p>
        </div>
        <div className="flex space-x-3">
          <GhostButton><Download className="w-4 h-4 mr-2" /> Export Timesheets</GhostButton>
          <GoldButton>View Weekly Roster</GoldButton>
        </div>
      </div>

      <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-ink-light border-b border-gray-200 dark:border-ink-light text-gray-500 dark:text-gray-400 text-sm">
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Employee</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Clock In</th>
              <th className="p-4 font-medium">Clock Out</th>
              <th className="p-4 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-ink-light">
            {attendance.map((record) => {
              const emp = allEmployees.find(e => e.id === record.employeeId);
              return (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-ink-light/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{record.date}</td>
                  <td className="p-4 text-sm">
                    {emp ? (
                      <div className="font-bold text-gray-900 dark:text-white">{emp.firstName} {emp.lastName}</div>
                    ) : (
                      <div className="text-gray-400">Unknown</div>
                    )}
                  </td>
                  <td className="p-4 text-sm">
                    <HRStatusBadge status={record.status} className={HR_STATUS_COLORS[record.status]} />
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{record.clockIn || '-'}</td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{record.clockOut || '-'}</td>
                  <td className="p-4 text-sm text-gray-500 italic max-w-xs truncate">{record.notes || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
