import { useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import Overview from './components/Overview';
import MyPropertyRequests from './components/MyPropertyRequests';
import VerificationProgress from './components/VerificationProgress';
import ListingJourney from './components/ListingJourney';
import Messages from './components/Messages';
import Offers from './components/Offers';
import RentalIncome from './components/RentalIncome';
import Analytics from './components/Analytics';
import Settings from './components/Settings';

export default function OwnerDashboardPage() {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <Overview onNavigate={setActiveTab} />;
      case 'My Property Requests': return <MyPropertyRequests />;
      case 'Verification Progress': return <VerificationProgress />;
      case 'Listing Journey': return <ListingJourney />;
      case 'Messages': return <Messages />;
      case 'Offers': return <Offers />;
      case 'Rental Income': return <RentalIncome />;
      case 'Analytics': return <Analytics />;
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
