import { Network } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';

export const OrganizationChart = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-ink-dark relative p-6 md:p-8">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Network className="w-6 h-6 mr-3 text-gold-500" />
            Enterprise Hierarchy
          </h2>
          <p className="text-gray-500 mt-1">Interactive organizational chart of the Luxora ecosystem.</p>
        </div>
        <GhostButton>Export PDF</GhostButton>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white dark:bg-ink border border-gray-200 dark:border-ink-light rounded-xl shadow-sm relative overflow-auto custom-scrollbar">
        <div className="text-center p-12 text-gray-500">
          <Network className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Interactive Organization Tree</h3>
          <p className="max-w-md mx-auto">This canvas space is reserved for a drag-and-drop interactive org chart (e.g. using D3.js or react-flow) allowing drill-down from CEO to individual contributors.</p>
        </div>
      </div>
    </div>
  );
};
