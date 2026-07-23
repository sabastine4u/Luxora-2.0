import { useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout';
import Overview from './components/Overview';
import Listings from './components/Listings';
import Agents from './components/Agents';
import Leads from './components/Leads';
import Clients from './components/Clients';
import Performance from './components/Performance';
import Commissions from './components/Commissions';
import Messages from './components/Messages';
import Settings from './components/Settings';

export default function AgencyDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'Overview';

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <Overview onNavigate={setActiveTab} />;
      case 'Messages': return <Messages />;
      case 'Listings': return <Listings />;
      case 'Agents': return <Agents />;
      case 'Leads': return <Leads />;
      case 'Clients': return <Clients />;
      case 'Performance': return <Performance />;
      case 'Commissions': return <Commissions />;
      case 'Settings': return <Settings />;
      default: return <Overview onNavigate={setActiveTab} />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}
