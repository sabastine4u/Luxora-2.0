import { Laptop, Search } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';

export const AssetAssignmentCenter = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Laptop className="w-6 h-6 mr-3 text-gold-500" />
            Asset Management
          </h2>
          <p className="text-gray-500 mt-1">Track enterprise laptops, phones, vehicles, and physical access cards.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-ink-light rounded-lg bg-white dark:bg-ink focus:outline-none focus:ring-2 focus:ring-gold-500 dark:text-white w-full sm:w-64"
            />
          </div>
          <GoldButton>Assign Asset</GoldButton>
        </div>
      </div>

      <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-12 text-center text-gray-500">
        <Laptop className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p>Asset database integration pending. Search capabilities available UI-only.</p>
        <div className="mt-6 flex justify-center space-x-3">
          <GhostButton>Import Assets CSV</GhostButton>
        </div>
      </div>
    </div>
  );
};
