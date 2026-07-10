import { AlertTriangle, Plus } from 'lucide-react';
import { useComplianceCenter } from '../hooks/useComplianceCenter';
import { ComplianceStatusBadge as StatusBadge } from './ComplianceStatusBadge';
import { STATUS_COLORS } from '../constants/complianceConstants';
import { GoldButton } from '../../../components/ui/ui';

export const RiskManagementCenter = () => {
  const { risks } = useComplianceCenter();

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <AlertTriangle className="w-6 h-6 mr-3 text-gold-500" />
            Enterprise Risk Management
          </h2>
          <p className="text-gray-500 mt-1">Identify, assess, and mitigate risks across the portfolio.</p>
        </div>
        <GoldButton><Plus className="w-4 h-4 mr-2" /> Log Risk</GoldButton>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {risks.map((risk) => (
          <div key={risk.id} className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-ink-light px-2 py-1 rounded">{risk.id}</span>
                  <StatusBadge status={risk.level} className={STATUS_COLORS[risk.level]} />
                  <span className="text-sm text-gray-500 border-l border-gray-200 dark:border-ink-light pl-3">{risk.category}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{risk.title}</h3>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-gray-900 dark:text-white">{risk.score}</div>
                <div className="text-xs text-gray-500">Risk Score</div>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">{risk.description}</p>
            
            <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 p-4 rounded-lg">
              <h4 className="text-sm font-bold text-orange-800 dark:text-orange-400 mb-1">Mitigation Plan</h4>
              <p className="text-sm text-orange-700 dark:text-orange-300">{risk.mitigationPlan}</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-ink-light flex justify-between items-center text-sm">
              <span className="text-gray-500">Owner: <span className="font-medium text-gray-700 dark:text-gray-300">{risk.ownerId}</span></span>
              <span className={`font-medium ${risk.status === 'Escalated' ? 'text-red-500' : 'text-gray-500'}`}>{risk.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
