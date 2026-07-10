import { useDocumentCenter } from '../hooks/useDocumentCenter';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { FileText, HardDrive, ShieldAlert, Users } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { DocumentLibrary } from './DocumentLibrary';

export const DocumentDashboard = () => {
  const { metrics, setActiveWorkspace } = useDocumentCenter();

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="p-6 shrink-0 border-b border-gray-100 dark:border-ink-light bg-gray-50/50 dark:bg-ink-light/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Document Dashboard</h2>
            <p className="text-gray-500">Enterprise Digital Asset Management overview.</p>
          </div>
          <GhostButton onClick={() => setActiveWorkspace('explorer')}>
            Browse Folders
          </GhostButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KPICard 
            title="Total Documents" 
            value={metrics.totalDocuments} 
            icon={FileText} 
            trend="+5" 
            trendColor="text-emerald-500" 
          />
          <KPICard 
            title="Storage Used" 
            value={`${(metrics.storageUsedBytes / 1024 / 1024).toFixed(1)} MB`} 
            icon={HardDrive} 
            trend="+1.2%" 
            trendColor="text-emerald-500" 
          />
          <KPICard 
            title="Pending Approvals" 
            value={metrics.pendingApprovals} 
            icon={ShieldAlert} 
            trend="-2" 
            trendColor="text-red-500" 
          />
          <KPICard 
            title="Shared Externally" 
            value={metrics.sharedFiles} 
            icon={Users} 
            trend="+1" 
            trendColor="text-emerald-500" 
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* We can embed the document library here for a seamless experience */}
        <DocumentLibrary />
      </div>
    </div>
  );
};
