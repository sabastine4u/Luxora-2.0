import { Award } from 'lucide-react';
import { useComplianceCenter } from '../hooks/useComplianceCenter';
import { ComplianceStatusBadge as StatusBadge } from './ComplianceStatusBadge';
import { STATUS_COLORS } from '../constants/complianceConstants';
import { GhostButton } from '../../../components/ui/ui';

export const LicenseCenter = () => {
  const { licenses } = useComplianceCenter();

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Award className="w-6 h-6 mr-3 text-gold-500" />
          Licenses & Permits
        </h2>
        <p className="text-gray-500 mt-1">Manage corporate licenses, property permits, and agent certifications.</p>
      </div>

      <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-ink-light border-b border-gray-200 dark:border-ink-light text-gray-500 dark:text-gray-400 text-sm">
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Title & Authority</th>
              <th className="p-4 font-medium">Holder</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Issue Date</th>
              <th className="p-4 font-medium">Expiry Date</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-ink-light">
            {licenses.map((license) => (
              <tr key={license.id} className="hover:bg-gray-50 dark:hover:bg-ink-light/50 transition-colors group">
                <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{license.id}</td>
                <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                  <div className="font-medium text-gray-900 dark:text-white">{license.title}</div>
                  <div className="text-xs text-gray-500">{license.issuingAuthority}</div>
                </td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{license.holderName}</td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{license.type}</td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{license.issueDate}</td>
                <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{license.expiryDate}</td>
                <td className="p-4 text-sm">
                  <StatusBadge status={license.status} className={STATUS_COLORS[license.status]} />
                </td>
                <td className="p-4 text-sm text-right">
                  <GhostButton size="sm">Renew</GhostButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
