import { useState } from 'react';
import { EnterpriseLayout } from '../../components/layout';
import Overview from './components/Overview';
import ServiceRequests from './components/ServiceRequests';
import Providers from './components/Providers';
import Bookings from './components/Bookings';
import Categories from './components/Categories';
import Financials from './components/Financials';
import Analytics from './components/Analytics';
import Messages from './components/Messages';
import Settings from './components/Settings';

export default function HomeServicesDashboardPage() {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <Overview />;
      case 'Service Requests': return <ServiceRequests />;
      case 'Providers': return <Providers />;
      case 'Bookings': return <Bookings />;
      case 'Categories': return <Categories />;
      case 'Financials': return <Financials />;
      case 'Analytics': return <Analytics />;
      case 'Messages': return <Messages />;
      case 'Settings': return <Settings />;
      default: return <Overview />;
    }
  };

  return (
    <EnterpriseLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </EnterpriseLayout>
  );
}
