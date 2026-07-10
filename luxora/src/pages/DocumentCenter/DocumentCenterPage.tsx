import { DashboardHeader } from '../../components/dashboard/shared/headers/DashboardHeader';
import { LeftNavigation } from './components/LeftNavigation';
import { useDocumentCenter } from './hooks/useDocumentCenter';
import { SearchBar } from './components/SearchBar';
import { FilterPanel } from './components/FilterPanel';
import { DocumentLibrary } from './components/DocumentLibrary';
import { PreviewPanel } from './components/PreviewPanel';
import { MetadataPanel } from './components/MetadataPanel';
import { DocumentDashboard } from './components/DocumentDashboard';
import { VersionHistory } from './components/VersionHistory';
import { ApprovalWorkspace } from './components/ApprovalWorkspace';
import { SharingCenter } from './components/SharingCenter';
import { AuditLog } from './components/AuditLog';
import { AssetAnalytics } from './components/AssetAnalytics';
import { ExecutiveInsights } from './components/ExecutiveInsights';
import { LayoutGrid, List } from 'lucide-react';
import { GhostButton } from '../../components/ui/ui';

export default function DocumentCenterPage() {
  const { 
    activeWorkspace, 
    selectedDocument, 
    setSelectedDocumentId, 
    viewMode, 
    setViewMode 
  } = useDocumentCenter();

  const renderWorkspace = () => {
    switch (activeWorkspace) {
      case 'dashboard':
        return <DocumentDashboard />;
      case 'explorer':
      case 'recent':
      case 'favorites':
      case 'archives':
      case 'trash':
        return <DocumentLibrary />;
      case 'versions':
        return <VersionHistory />;
      case 'approvals':
        return <ApprovalWorkspace />;
      case 'sharing':
        return <SharingCenter />;
      case 'audit':
        return <AuditLog />;
      case 'analytics':
        return <AssetAnalytics />;
      case 'executive':
        return <ExecutiveInsights />;
      default:
        return <DocumentLibrary />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-ink-dark overflow-hidden">
      <div className="p-6 pb-2 shrink-0">
        <DashboardHeader 
          name="Enterprise Document Center" 
          subtitle="Centralized digital asset and document management." 
        />
      </div>

      {/* Global Toolbar */}
      <div className="h-14 bg-white dark:bg-ink border-b border-gray-200 dark:border-ink-light flex items-center px-6 shrink-0 justify-between">
        <div className="flex-1 max-w-2xl flex items-center space-x-4">
          <SearchBar />
          <FilterPanel />
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-gray-100 dark:bg-ink-light rounded-lg p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-ink shadow-sm text-gold-500' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-ink shadow-sm text-gold-500' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <LeftNavigation />
        
        <main className="flex-1 relative overflow-hidden flex flex-col">
          {renderWorkspace()}
        </main>

        <PreviewPanel 
          document={selectedDocument} 
          isOpen={!!selectedDocument} 
          onClose={() => setSelectedDocumentId(null)} 
        />
        
        {selectedDocument && activeWorkspace !== 'versions' && (
          <div className="w-72 bg-white dark:bg-ink border-l border-gray-100 dark:border-ink-light flex flex-col h-full overflow-y-auto shrink-0 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{selectedDocument.name}</h3>
            <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-gray-100 text-gray-600 dark:bg-ink-light dark:text-gray-400 inline-block w-max mb-4">
              {selectedDocument.assetType}
            </span>
            
            <GhostButton className="w-full justify-center mb-2">View Version History</GhostButton>
            
            <MetadataPanel />
          </div>
        )}
      </div>
    </div>
  );
}
