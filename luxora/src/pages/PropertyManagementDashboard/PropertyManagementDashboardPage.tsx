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

export default function PropertyManagementDashboardPage() {
  const [activeTab, setActiveTab] = useState('Tenants');

  const renderContent = () => {
    switch (activeTab) {
      case 'Tenants': return <Tenants />;
      case 'Rent Collection': return <RentCollection />;
      case 'Maintenance': return <Maintenance />;
      case 'Lease Tracking': return <LeaseTracking />;
      case 'Documents': return <Documents />;
      case 'Inspections': return <Inspections />;
      case 'Expenses': return <Expenses />;
      case 'Income': return <Income />;
      case 'Analytics': return <Analytics />;
      default: return <Tenants />;
    }
  };

  return (
    <EnterpriseLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </EnterpriseLayout>
  );
}
