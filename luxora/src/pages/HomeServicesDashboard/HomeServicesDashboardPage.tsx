import { useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import Cleaning from './components/Cleaning';
import Moving from './components/Moving';
import Painting from './components/Painting';
import Electrical from './components/Electrical';
import Plumbing from './components/Plumbing';
import Security from './components/Security';
import Architecture from './components/Architecture';
import InteriorDesign from './components/InteriorDesign';
import Furniture from './components/Furniture';
import SmartHome from './components/SmartHome';
import Landscaping from './components/Landscaping';

export default function HomeServicesDashboardPage() {
  const [activeTab, setActiveTab] = useState('Cleaning');

  const renderContent = () => {
    switch (activeTab) {
      case 'Cleaning': return <Cleaning />;
      case 'Moving': return <Moving />;
      case 'Painting': return <Painting />;
      case 'Electrical': return <Electrical />;
      case 'Plumbing': return <Plumbing />;
      case 'Security': return <Security />;
      case 'Architecture': return <Architecture />;
      case 'Interior Design': return <InteriorDesign />;
      case 'Furniture': return <Furniture />;
      case 'Smart Home': return <SmartHome />;
      case 'Landscaping': return <Landscaping />;
      default: return <Cleaning />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}
