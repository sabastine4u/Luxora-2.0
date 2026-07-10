import { UserCheck } from 'lucide-react';
import { useComplianceCenter } from '../hooks/useComplianceCenter';
import { ComplianceStatusBadge as StatusBadge } from './ComplianceStatusBadge';
import { STATUS_COLORS } from '../constants/complianceConstants';
import { GhostButton } from '../../../components/ui/ui';

export const KYCCenter = () => {
  const { kycRecords } = useComplianceCenter();

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <UserCheck className="w-6 h-6 mr-3 text-gold-500" />
          KYC / AML Workspace
        </h2>
        <p className="text-gray-500 mt-1">Know Your Customer and Anti-Money Laundering verification center.</p>
      </div>

      <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-ink-light border-b border-gray-200 dark:border-ink-light text-gray-500 dark:text-gray-400 text-sm">
              <th className="p-4 font-medium">Record ID</th>
              <th className="p-4 font-medium">Entity Name</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Verification Level</th>
              <th className="p-4 font-medium">Last Checked</th>
              <th className="p-4 font-medium">AML Status</th>
              <th className="p-4 font-medium">KYC Status</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-ink-light">
            {kycRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-ink-light/50 transition-colors group">
                <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{record.id}</td>
                <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{record.entityName}</td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{record.entityType}</td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{record.verificationLevel}</td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{record.lastChecked}</td>
                <td className="p-4 text-sm">
                  <StatusBadge status={record.amlStatus} className={STATUS_COLORS[record.amlStatus]} />
                </td>
                <td className="p-4 text-sm">
                  <StatusBadge status={record.status} className={STATUS_COLORS[record.status]} />
                </td>
                <td className="p-4 text-sm text-right">
                  <GhostButton size="sm">Review Docs</GhostButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
