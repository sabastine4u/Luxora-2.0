import { ClipboardCheck, Filter, Search } from 'lucide-react';
import { useComplianceCenter } from '../hooks/useComplianceCenter';
import { ComplianceStatusBadge as StatusBadge } from './ComplianceStatusBadge';
import { STATUS_COLORS } from '../constants/complianceConstants';
import { GhostButton } from '../../../components/ui/ui';

export const ComplianceCenter = () => {
  const { complianceRecords, searchQuery, setSearchQuery } = useComplianceCenter();

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <ClipboardCheck className="w-6 h-6 mr-3 text-gold-500" />
            Compliance Records
          </h2>
          <p className="text-gray-500 mt-1">Manage global enterprise compliance deadlines and statuses.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search records..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-ink-light rounded-lg bg-white dark:bg-ink focus:outline-none focus:ring-2 focus:ring-gold-500 dark:text-white w-64"
            />
          </div>
          <GhostButton><Filter className="w-4 h-4 mr-2" /> Filter</GhostButton>
        </div>
      </div>

      <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-ink-light border-b border-gray-200 dark:border-ink-light text-gray-500 dark:text-gray-400 text-sm">
              <th className="p-4 font-medium">Record ID</th>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Department</th>
              <th className="p-4 font-medium">Deadline</th>
              <th className="p-4 font-medium">Priority</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-ink-light">
            {complianceRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-ink-light/50 transition-colors group">
                <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{record.id}</td>
                <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                  <div className="font-medium text-gray-900 dark:text-white">{record.title}</div>
                  <div className="text-xs text-gray-500 truncate max-w-xs">{record.description}</div>
                </td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{record.type}</td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{record.department}</td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{record.deadline || '-'}</td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    record.priority === 'Urgent' ? 'bg-red-100 text-red-700' :
                    record.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{record.priority}</span>
                </td>
                <td className="p-4 text-sm">
                  <StatusBadge status={record.status} className={STATUS_COLORS[record.status]} />
                </td>
              </tr>
            ))}
            {complianceRecords.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No compliance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
