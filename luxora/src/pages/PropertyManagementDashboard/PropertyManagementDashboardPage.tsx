import { useState } from 'react';
import { EnterpriseLayout } from '../../components/layout';
import Tenants from './components/Tenants';
import RentCollection from './components/RentCollection';
import Maintenance from './components/Maintenance';
import LeaseTracking from './components/LeaseTracking';
import Documents from './components/Documents';
import Inspections from './components/Inspections';
import Expenses from './components/Expenses';
import Income from './components/Income';
import Analytics from './components/Analytics';
import Overview from './components/Overview';
import Messages from './components/Messages';
import Settings from './components/Settings';

export default function PropertyManagementDashboardPage() {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <Overview />;
      case 'Tenants': return <Tenants onNavigate={setActiveTab} />;
      case 'Rent Collection': return <RentCollection />;
      case 'Maintenance': return <Maintenance />;
      case 'Lease Tracking': return <LeaseTracking />;
      case 'Documents': return <Documents />;
      case 'Inspections': return <Inspections />;
      case 'Expenses': return <Expenses />;
      case 'Income': return <Income />;
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
