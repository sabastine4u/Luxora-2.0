import { useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import Agents from './components/Agents';
import Listings from './components/Listings';
import Performance from './components/Performance';
import Revenue from './components/Revenue';
import Reports from './components/Reports';
import Settings from './components/Settings';

export default function AgencyDashboardPage() {
  const [activeTab, setActiveTab] = useState('Agents');

  const renderContent = () => {
    switch (activeTab) {
      case 'Agents': return <Agents />;
      case 'Listings': return <Listings />;
      case 'Performance': return <Performance />;
      case 'Revenue': return <Revenue />;
      case 'Reports': return <Reports />;
      case 'Settings': return <Settings />;
      default: return <Agents />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}
