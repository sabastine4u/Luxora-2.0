import { DashboardHeader } from '../../components/dashboard/shared/headers/DashboardHeader';
import { LeftNavigation } from './components/LeftNavigation';
import { useCRMCenter } from './hooks/useCRMCenter';
import { SearchBar } from './components/SearchBar';
import { FilterPanel } from './components/FilterPanel';
import { CRMDashboard } from './components/CRMDashboard';
import { ContactDirectory } from './components/ContactDirectory';
import { ContactProfile } from './components/ContactProfile';
import { Customer360 } from './components/Customer360';
import { LeadPipeline } from './components/LeadPipeline';
import { ActivityCenter } from './components/ActivityCenter';
import { ContactAnalytics } from './components/ContactAnalytics';
import { ExecutiveInsights } from './components/ExecutiveInsights';
import { LayoutGrid, List } from 'lucide-react';

export default function CRMCenterPage() {
  const { activeWorkspace, viewMode, setViewMode } = useCRMCenter();

  const renderWorkspace = () => {
    switch (activeWorkspace) {
      case 'dashboard':
        return <CRMDashboard />;
      case 'directory':
      case 'organizations':
        return <ContactDirectory />;
      case 'profile':
        return <ContactProfile />;
      case 'customer360':
        return <Customer360 />;
      case 'pipeline':
        return <LeadPipeline />;
      case 'activities':
      case 'follow-ups':
        return <ActivityCenter />;
      case 'analytics':
        return <ContactAnalytics />;
      case 'executive':
        return <ExecutiveInsights />;
      default:
        return <CRMDashboard />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-ink-dark overflow-hidden">
      <div className="p-6 pb-2 shrink-0">
        <DashboardHeader 
          name="Enterprise CRM Center" 
          subtitle="Centralized relationship and interaction management." 
        />
      </div>

      {/* Global Toolbar */}
      <div className="h-14 bg-white dark:bg-ink border-b border-gray-200 dark:border-ink-light flex items-center px-6 shrink-0 justify-between">
        <div className="flex-1 max-w-2xl flex items-center space-x-4">
          <SearchBar />
          <FilterPanel />
        </div>
        
        {activeWorkspace === 'directory' && (
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
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        <LeftNavigation />
        
        <main className="flex-1 relative overflow-hidden flex flex-col">
          {renderWorkspace()}
        </main>
      </div>
    </div>
  );
}
