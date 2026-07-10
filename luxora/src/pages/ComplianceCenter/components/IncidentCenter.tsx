import { Scale } from 'lucide-react';
import { useComplianceCenter } from '../hooks/useComplianceCenter';
import { ComplianceStatusBadge as StatusBadge } from './ComplianceStatusBadge';
import { GoldButton, GhostButton } from '../../../components/ui/ui';

export const IncidentCenter = () => {
  const { incidents } = useComplianceCenter();

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Scale className="w-6 h-6 mr-3 text-gold-500" />
            Incidents & Legal Cases
          </h2>
          <p className="text-gray-500 mt-1">Track compliance incidents, legal issues, and ongoing investigations.</p>
        </div>
        <GoldButton>Report Incident</GoldButton>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {incidents.map((incident) => (
          <div key={incident.id} className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-ink-light px-2 py-1 rounded">{incident.id}</span>
                  <span className="text-sm text-gray-500 border-r border-gray-200 dark:border-ink-light pr-3">{incident.type}</span>
                  <span className={`text-xs font-bold ${incident.severity === 'Critical' ? 'text-red-500' : 'text-orange-500'}`}>
                    Severity: {incident.severity}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{incident.title}</h3>
              </div>
              <StatusBadge status={incident.status} className={
                incident.status === 'Escalated' ? 'bg-red-50 text-red-700 border-red-200' :
                incident.status === 'Under Investigation' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                'bg-gray-100 text-gray-700'
              } />
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">{incident.description}</p>
            
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-ink-light flex justify-between items-center text-sm">
              <div className="space-x-4">
                <span className="text-gray-500">Reported: <span className="font-medium text-gray-700 dark:text-gray-300">{incident.dateReported}</span></span>
                <span className="text-gray-500">Assigned To: <span className="font-medium text-gray-700 dark:text-gray-300">{incident.assignedTo}</span></span>
              </div>
              <div className="flex space-x-3">
                <GhostButton size="sm">Add Note</GhostButton>
                <GhostButton size="sm">View Case File</GhostButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
