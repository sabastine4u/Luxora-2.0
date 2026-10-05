import { useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout';
import Properties from './components/Properties';

import Overview from './components/Overview';
import BusinessHealth from './components/BusinessHealth';
import Revenue from './components/Revenue';
import Management from './components/Management';
import Finance from './components/Finance';
import FraudAlerts from './components/FraudAlerts';

// Reuse the existing real Agent Verification Center for Super Admin.
import VerificationQueue from '../AdminDashboard/components/VerificationQueue';

import AssignmentOversight from './components/AssignmentOversight';
import Listings from '../AdminDashboard/components/Listings';
import Agents from '../AdminDashboard/components/Agents';
import Agencies from '../AdminDashboard/components/Agencies';
import InternalStaff from '../AdminDashboard/components/InternalStaff';
import AdminManagement from './components/AdminManagement';
import SystemSettings from './components/SystemSettings';
import AgencyRankings from './components/AgencyRankings';
import Messages from './components/Messages';
import Settings from './components/Settings';

// Admin components reused by Super Admin where the functionality is shared.
import AdminReports from '../AdminDashboard/components/Reports';
import AdminComplaints from '../AdminDashboard/components/Complaints';

// Super Admin has its own Offers page.
import Offers from './components/Offer';

// Deals remain platform-wide and use the existing shared Deals implementation.
import Deals from '../AdminDashboard/components/Deals';

import { ProcurementOverview } from '../ProcurementDashboard/components/ProcurementRecordCenter';
import HomeServicesOverview from '../HomeServicesDashboard/components/Overview';
import IntelligenceOverview from '../IntelligenceDashboard/components/Overview';
import MarketTrends from '../IntelligenceDashboard/components/MarketTrends';
import HeatMap from '../IntelligenceDashboard/components/HeatMap';

export default function SuperAdminDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab =
    searchParams.get('tab') || 'Overview';

  const handleTabChange = (
    tab: string,
  ) => {
    setSearchParams({ tab });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <Overview />;

      case 'Business Health':
        return <BusinessHealth />;

      case 'Revenue':
        return <Revenue />;

      case 'Management':
        return <Management />;

      case 'Procurement':
        return <ProcurementOverview />;

      case 'Finance':
        return <Finance />;

      case 'Offers':
        return <Offers />;

      case 'Deals':
        return <Deals />;

      case 'Reports':
        return <AdminReports />;

      case 'Fraud Alerts':
        return <FraudAlerts />;

      case 'Verification':
        return <VerificationQueue />;

      case 'Properties':
        return <Properties />;

      case 'Assignment Oversight':
        return <AssignmentOversight />;

      case 'Marketplace Oversight':
        return (
          <Listings
            pageTitle="Marketplace Oversight"
            pageSubtitle="Platform listing moderation and governance"
            mode="oversight"
          />
        );

      case 'Complaint Oversight':
        return <AdminComplaints />;

      case 'Property Intelligence':
        return <IntelligenceOverview />;

      case 'Listings':
        return (
          <Listings
            pageTitle="All Listings"
            pageSubtitle="Platform listing management"
            mode="operational"
          />
        );

      case 'Home Services':
        return <HomeServicesOverview />;

      case 'Admin Management':
        return <AdminManagement />;

      case 'Agents':
        return <Agents />;

      case 'Agencies':
        return <Agencies />;

      case 'Internal Staff':
        return <InternalStaff />;

      case 'System Settings':
        return <SystemSettings />;

      case 'Agency Rankings':
        return <AgencyRankings />;

      case 'Charts':
        return <HeatMap />;

      case 'Analytics':
        return <MarketTrends />;

      case 'Messages':
        return <Messages />;

      case 'User Settings':
        return <Settings />;

      default:
        return <Overview />;
    }
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      {renderContent()}
    </DashboardLayout>
  );
}