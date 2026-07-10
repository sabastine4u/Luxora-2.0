import { useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import Overview from './components/Overview';
import Listings from './components/Listings';
import VerificationQueue from './components/VerificationQueue';
import Owners from './components/Owners';
import Buyers from './components/Buyers';
import Agents from './components/Agents';
import Agencies from './components/Agencies';
import Complaints from './components/Complaints';
import Reports from './components/Reports';
import Finance from './components/Finance';
import Settings from './components/Settings';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <Overview />;
      case 'Listings': return <Listings />;
      case 'Verification Queue': return <VerificationQueue />;
      case 'Owners': return <Owners />;
      case 'Buyers': return <Buyers />;
      case 'Agents': return <Agents />;
      case 'Agencies': return <Agencies />;
      case 'Complaints': return <Complaints />;
      case 'Reports': return <Reports />;
      case 'Finance': return <Finance />;
      case 'Settings': return <Settings />;
      default: return <Overview />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}
