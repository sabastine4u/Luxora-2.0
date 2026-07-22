import { useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import Overview from './components/Overview';
import MyListings from './components/MyListings';
import Leads from './components/Leads';
import Clients from './components/Clients';
import Appointments from './components/Appointments';
import Deals from './components/Deals';
import Commissions from './components/Commissions';
import Messages from './components/Messages';
import Performance from './components/Performance';
import Reports from './components/Reports';
import Settings from './components/Settings';

export default function AgentDashboardPage() {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <Overview />;
      case 'Messages': return <Messages />;
      case 'My Listings': return <MyListings />;
      case 'Leads': return <Leads />;
      case 'Clients': return <Clients />;
      case 'Appointments': return <Appointments />;
      case 'Deals': return <Deals />;
      case 'Commissions': return <Commissions />;
      case 'Performance': return <Performance />;
      case 'Reports': return <Reports />;
      case 'Settings': return <Settings />;
      default: return <Overview />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}
