import { FileSearch } from 'lucide-react';
import { useComplianceCenter } from '../hooks/useComplianceCenter';
import { ComplianceStatusBadge as StatusBadge } from './ComplianceStatusBadge';
import { STATUS_COLORS } from '../constants/complianceConstants';
import { GhostButton } from '../../../components/ui/ui';

export const AuditCenter = () => {
  const { audits } = useComplianceCenter();

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <FileSearch className="w-6 h-6 mr-3 text-gold-500" />
          Audit Center
        </h2>
        <p className="text-gray-500 mt-1">Manage internal and external enterprise audits and findings.</p>
      </div>

      <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-ink-light border-b border-gray-200 dark:border-ink-light text-gray-500 dark:text-gray-400 text-sm">
              <th className="p-4 font-medium">Audit ID</th>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Auditor</th>
              <th className="p-4 font-medium">Date Started</th>
              <th className="p-4 font-medium">Findings</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-ink-light">
            {audits.map((audit) => (
              <tr key={audit.id} className="hover:bg-gray-50 dark:hover:bg-ink-light/50 transition-colors group">
                <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{audit.id}</td>
                <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{audit.title}</td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{audit.type}</td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{audit.auditor}</td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{audit.dateStarted}</td>
                <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">
                  {audit.findingsCount > 0 ? (
                    <span className="text-orange-500 bg-orange-50 px-2 py-1 rounded">{audit.findingsCount} Open</span>
                  ) : (
                    <span className="text-emerald-500">None</span>
                  )}
                </td>
                <td className="p-4 text-sm">
                  <StatusBadge status={audit.status} className={STATUS_COLORS[audit.status]} />
                </td>
                <td className="p-4 text-sm text-right">
                  <GhostButton size="sm">View</GhostButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
