import { Users, Search, Filter } from 'lucide-react';
import { useHRCenter } from '../hooks/useHRCenter';
import { HRStatusBadge } from './HRStatusBadge';
import { HR_STATUS_COLORS, DEPARTMENTS } from '../constants/hrConstants';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { EmployeeProfile } from './EmployeeProfile';

export const EmployeeDirectory = () => {
  const { 
    employees, 
    searchQuery, 
    setSearchQuery, 
    selectedDepartment, 
    setSelectedDepartment,
    selectedEmployee,
    viewEmployeeProfile 
  } = useHRCenter();

  if (selectedEmployee) {
    return <EmployeeProfile />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Users className="w-6 h-6 mr-3 text-gold-500" />
            Employee Directory
          </h2>
          <p className="text-gray-500 mt-1">Manage and view the entire Luxora enterprise workforce.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search employees..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-ink-light rounded-lg bg-white dark:bg-ink focus:outline-none focus:ring-2 focus:ring-gold-500 dark:text-white w-full sm:w-64"
            />
          </div>
          <select 
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-ink-light rounded-lg bg-white dark:bg-ink focus:outline-none focus:ring-2 focus:ring-gold-500 dark:text-white"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <GhostButton><Filter className="w-4 h-4 mr-2" /> More Filters</GhostButton>
        </div>
      </div>

      <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-ink-light border-b border-gray-200 dark:border-ink-light text-gray-500 dark:text-gray-400 text-sm">
              <th className="p-4 font-medium">Employee</th>
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Position</th>
              <th className="p-4 font-medium">Department</th>
              <th className="p-4 font-medium">Location</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-ink-light">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-ink-light/50 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gold-100 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400 flex items-center justify-center font-bold text-lg mr-3 shrink-0">
                      {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{emp.firstName} {emp.lastName}</div>
                      <div className="text-xs text-gray-500">{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{emp.id}</td>
                <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{emp.position}</td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{emp.department}</td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{emp.location}</td>
                <td className="p-4 text-sm">
                  <HRStatusBadge status={emp.status} className={HR_STATUS_COLORS[emp.status]} />
                </td>
                <td className="p-4 text-sm text-right">
                  <GoldButton size="sm" onClick={() => viewEmployeeProfile(emp)}>View Profile</GoldButton>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No employees found matching the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
