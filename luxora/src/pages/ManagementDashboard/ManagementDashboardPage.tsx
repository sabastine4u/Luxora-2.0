import { useState } from 'react';
import { EnterpriseLayout } from '../../components/layout';
import Overview from './components/Overview';
import TeamManagement from './components/TeamManagement';
import Performance from './components/Performance';
import DepartmentOversight from './components/DepartmentOversight';
import Reports from './components/Reports';
import Messages from './components/Messages';
import Settings from './components/Settings';

export default function ManagementDashboardPage() {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <Overview />;
      case 'Messages': return <Messages />;
      case 'Team Management': return <TeamManagement />;
      case 'Performance': return <Performance />;
      case 'Department Oversight': return <DepartmentOversight />;
      case 'Reports': return <Reports />;
      case 'Settings': return <Settings />;
      default: return <Overview />;
    }
  };

  return (
    <EnterpriseLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </EnterpriseLayout>
  );
}
