
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'Overview';

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <Overview onNavigate={handleTabChange} />;
      case 'My Property Requests': return <MyPropertyRequests />;
      case 'Verification Progress': return <VerificationProgress />;
      case 'Listing Journey': return <ListingJourney />;
      case 'Messages': return <Messages />;
      case 'Offers': return <Offers />;
      case 'Rental Income': return <RentalIncome />;
      case 'Analytics': return <Analytics />;
      case 'Settings': return <Settings />;
      default: return <Overview onNavigate={handleTabChange} />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderContent()}
    </DashboardLayout>
  );
}
