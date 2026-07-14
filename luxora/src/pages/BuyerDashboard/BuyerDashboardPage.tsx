import { useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import Overview from './components/Overview';
import RecentlyViewed from './components/RecentlyViewed';
import RecommendedProperties from './components/RecommendedProperties';
import SavedProperties from './components/SavedProperties';
import MortgageTracker from './components/MortgageTracker';
import Messages from './components/Messages';
import ViewingRequests from './components/ViewingRequests';
import Offers from './components/Offers';
import Settings from './components/Settings';

export default function BuyerDashboardPage() {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <Overview onNavigate={setActiveTab} />;
      case 'Recently Viewed': return <RecentlyViewed />;
      case 'Recommendations': return <RecommendedProperties />;
      case 'My Favorites': return <SavedProperties />;
      case 'Mortgage Tracker': return <MortgageTracker />;
      case 'Messages': return <Messages />;
      case 'Viewing Requests': return <ViewingRequests />;
      case 'Offers': return <Offers />;
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
