import { CheckSquare } from 'lucide-react';
import { useComplianceCenter } from '../hooks/useComplianceCenter';
import { ComplianceStatusBadge as StatusBadge } from './ComplianceStatusBadge';
import { STATUS_COLORS } from '../constants/complianceConstants';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export const InspectionCenter = () => {
  const { inspections } = useComplianceCenter();

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <CheckSquare className="w-6 h-6 mr-3 text-gold-500" />
            Inspection Center
          </h2>
          <p className="text-gray-500 mt-1">Track property, safety, and environmental inspections.</p>
        </div>
        <GoldButton>Schedule Inspection</GoldButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inspections.map((inspection) => (
          <div key={inspection.id} className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold bg-gray-100 dark:bg-ink-light text-gray-500 px-2 py-1 rounded">{inspection.type}</span>
              <StatusBadge status={inspection.status} className={STATUS_COLORS[inspection.status]} />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{inspection.title}</h3>
            
            <div className="space-y-2 mt-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Inspector:</span>
                <span className="font-medium text-gray-900 dark:text-white">{inspection.inspector}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-medium text-gray-900 dark:text-white">{inspection.date}</span>
              </div>
              {inspection.score !== undefined && (
                <div className="flex justify-between">
                  <span>Score:</span>
                  <span className={`font-bold ${inspection.score >= 80 ? 'text-emerald-500' : 'text-red-500'}`}>{inspection.score}/100</span>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-ink-light">
              <GhostButton className="w-full">View Report</GhostButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
