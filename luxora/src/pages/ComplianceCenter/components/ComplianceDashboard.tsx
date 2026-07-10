import { ShieldCheck, AlertTriangle, FileSearch, Award } from 'lucide-react';
import { useComplianceCenter } from '../hooks/useComplianceCenter';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { ComplianceStatusBadge as StatusBadge } from './ComplianceStatusBadge';
import { STATUS_COLORS } from '../constants/complianceConstants';

export const ComplianceDashboard = () => {
  const { complianceScore, openRisksCount, pendingAuditsCount, expiredLicensesCount, complianceRecords } = useComplianceCenter();

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <ShieldCheck className="w-6 h-6 mr-3 text-gold-500" />
          Enterprise Compliance Dashboard
        </h2>
        <p className="text-gray-500 mt-1">Real-time governance, risk management, and regulatory compliance health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <KPICard title="Compliance Score" value={`${complianceScore}%`} icon={ShieldCheck} trend="+2%" trendColor="text-emerald-500" />
        <KPICard title="Open Risks" value={openRisksCount.toString()} icon={AlertTriangle} trend="Needs Attention" trendColor="text-orange-500" />
        <KPICard title="Pending Audits" value={pendingAuditsCount.toString()} icon={FileSearch} trend="In Progress" trendColor="text-blue-500" />
        <KPICard title="Expired Licenses" value={expiredLicensesCount.toString()} icon={Award} trend="Action Required" trendColor="text-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Compliance Activities */}
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Compliance Alerts</h3>
          <div className="space-y-4">
            {complianceRecords.slice(0, 5).map(record => (
              <div key={record.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-ink-light rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-ink-lighter">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{record.title}</h4>
                  <p className="text-xs text-gray-500">Owner: {record.ownerId} • Dept: {record.department}</p>
                </div>
                <StatusBadge 
                  status={record.status} 
                  className={STATUS_COLORS[record.status] || 'bg-gray-100 text-gray-600'} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Risk Heat Map Placeholder */}
        <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 flex flex-col">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Enterprise Risk Heat Map</h3>
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-ink-dark rounded-lg border border-dashed border-gray-200 dark:border-ink-light">
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Interactive Risk Matrix (UI Only)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
