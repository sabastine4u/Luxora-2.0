import { useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import BusinessKPIs from './components/BusinessKPIs';
import Operations from './components/Operations';
import AgencyPerformance from './components/AgencyPerformance';
import AgentPerformance from './components/AgentPerformance';
import Compliance from './components/Compliance';
import Complaints from './components/Complaints';
import FraudDetection from './components/FraudDetection';
import Analytics from './components/Analytics';
import Reports from './components/Reports';
import Announcements from './components/Announcements';

export default function ManagementDashboardPage() {
  const [activeTab, setActiveTab] = useState('Business KPIs');

  const renderContent = () => {
    switch (activeTab) {
      case 'Business KPIs': return <BusinessKPIs />;
      case 'Operations': return <Operations />;
      case 'Agency Performance': return <AgencyPerformance />;
      case 'Agent Performance': return <AgentPerformance />;
      case 'Compliance': return <Compliance />;
      case 'Complaints': return <Complaints />;
      case 'Fraud Detection': return <FraudDetection />;
      case 'Analytics': return <Analytics />;
      case 'Reports': return <Reports />;
      case 'Announcements': return <Announcements />;
      default: return <BusinessKPIs />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}
