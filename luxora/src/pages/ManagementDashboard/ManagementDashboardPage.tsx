import { useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import Overview from './components/Overview';
import TeamManagement from './components/TeamManagement';
import Performance from './components/Performance';
import DepartmentOversight from './components/DepartmentOversight';
import Reports from './components/Reports';

export default function ManagementDashboardPage() {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <Overview />;
      case 'Team Management': return <TeamManagement />;
      case 'Performance': return <Performance />;
      case 'Department Oversight': return <DepartmentOversight />;
      case 'Reports': return <Reports />;
      default: return <Overview />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}
