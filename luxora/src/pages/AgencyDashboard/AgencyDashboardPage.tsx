import { useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import Overview from './components/Overview';
import Listings from './components/Listings';
import Agents from './components/Agents';
import Leads from './components/Leads';
import Clients from './components/Clients';
import Performance from './components/Performance';
import Commissions from './components/Commissions';

export default function AgencyDashboardPage() {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <Overview />;
      case 'Listings': return <Listings />;
      case 'Agents': return <Agents />;
      case 'Leads': return <Leads />;
      case 'Clients': return <Clients />;
      case 'Performance': return <Performance />;
      case 'Commissions': return <Commissions />;
      default: return <Overview />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}
