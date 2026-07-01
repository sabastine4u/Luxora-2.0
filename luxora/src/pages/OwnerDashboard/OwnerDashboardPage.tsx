import { useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import MyPropertyRequests from './components/MyPropertyRequests';
import VerificationProgress from './components/VerificationProgress';
import Messages from './components/Messages';
import Offers from './components/Offers';
import RentalIncome from './components/RentalIncome';
import Analytics from './components/Analytics';
import Settings from './components/Settings';

export default function OwnerDashboardPage() {
  const [activeTab, setActiveTab] = useState('My Property Requests');

  const renderContent = () => {
    switch (activeTab) {
      case 'My Property Requests': return <MyPropertyRequests />;
      case 'Verification Progress': return <VerificationProgress />;
      case 'Messages': return <Messages />;
      case 'Offers': return <Offers />;
      case 'Rental Income': return <RentalIncome />;
      case 'Analytics': return <Analytics />;
      case 'Settings': return <Settings />;
      default: return <MyPropertyRequests />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}
