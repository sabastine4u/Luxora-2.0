import { useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout';
import Overview from './components/Overview';
import BusinessHealth from './components/BusinessHealth';
import Revenue from './components/Revenue';
import Management from './components/Management';
import Procurement from './components/Procurement';
import Finance from './components/Finance';
import Reports from './components/Reports';
import FraudAlerts from './components/FraudAlerts';

import AssignmentOversight from './components/AssignmentOversight';
import MarketplaceOversight from './components/MarketplaceOversight';
import ComplaintOversight from './components/ComplaintOversight';
import PropertyIntelligence from './components/PropertyIntelligence';
import SuperAdminListings from './components/SuperAdminListings';
import Listings from '../AdminDashboard/components/Listings';
import HomeServices from './components/HomeServices';
import AdminManagement from './components/AdminManagement';
import SystemSettings from './components/SystemSettings';
import AgencyRankings from './components/AgencyRankings';
import Charts from './components/Charts';
import Analytics from './components/Analytics';
import Messages from './components/Messages';
import Settings from './components/Settings';

export default function SuperAdminDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'Overview';

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <Overview />;
      case 'Business Health': return <BusinessHealth />;
      case 'Revenue': return <Revenue />;
      case 'Management': return <Management />;
      case 'Procurement': return <Procurement />;
      case 'Finance': return <Finance />;
      case 'Reports': return <Reports />;
      case 'Fraud Alerts': return <FraudAlerts />;
      case 'Verification': return <Listings pageTitle="Verification" pageSubtitle="Pending Reviews" mode="oversight" />;
      case 'Assignment Oversight': return <AssignmentOversight />;
      case 'Marketplace Oversight': return <MarketplaceOversight />;
      case 'Complaint Oversight': return <ComplaintOversight />;
      case 'Property Intelligence': return <PropertyIntelligence />;
      case 'Listings': return <SuperAdminListings />;
      case 'Home Services': return <HomeServices />;
      case 'Admin Management': return <AdminManagement />;
      case 'System Settings': return <SystemSettings />;
      case 'Agency Rankings': return <AgencyRankings />;
      case 'Charts': return <Charts />;
      case 'Analytics': return <Analytics />;
      case 'Messages': return <Messages />;
      case 'User Settings': return <Settings />;
      default: return <Overview />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderContent()}
    </DashboardLayout>
  );
}
