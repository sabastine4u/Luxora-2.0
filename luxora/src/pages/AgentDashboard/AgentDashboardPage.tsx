import { useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import AssignedLeads from './components/AssignedLeads';
import Properties from './components/Properties';
import Appointments from './components/Appointments';
import Messages from './components/Messages';
import Performance from './components/Performance';
import Reports from './components/Reports';
import Settings from './components/Settings';

export default function AgentDashboardPage() {
  const [activeTab, setActiveTab] = useState('Assigned Leads');

  const renderContent = () => {
    switch (activeTab) {
      case 'Assigned Leads': return <AssignedLeads />;
      case 'Properties': return <Properties />;
      case 'Appointments': return <Appointments />;
      case 'Messages': return <Messages />;
      case 'Performance': return <Performance />;
      case 'Reports': return <Reports />;
      case 'Settings': return <Settings />;
      default: return <AssignedLeads />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}
