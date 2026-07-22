import { useState } from 'react';
import { EnterpriseLayout } from '../../components/layout';
import Overview from './components/Overview';
import Messages from './components/Messages';
import Settings from './components/Settings';
import VendorDirectory from './components/VendorDirectory';
import VendorDetails from './components/VendorDetails/VendorDetails';
import RFQs from './components/RFQs';
import PurchaseRequests from './components/PurchaseRequests';
import PurchaseOrders from './components/PurchaseOrders';
import Contracts from './components/Contracts';
import Inventory from './components/Inventory';
import Assets from './components/Assets';
import Invoices from './components/Invoices';
import Budget from './components/Budget';
import Payments from './components/Payments';
import Reports from './components/Reports';

export default function ProcurementDashboardPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

  const handleNavigate = (tab: string, id?: string) => {
    if (id) {
      setSelectedVendorId(id);
    }
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <Overview />;
      case 'Messages': return <Messages />;
      case 'Settings': return <Settings />;
      case 'Vendor Directory': return <VendorDirectory onNavigate={handleNavigate} />;
      case 'Vendor Details': return <VendorDetails vendorId={selectedVendorId} onBack={() => setActiveTab('Vendor Directory')} />;
      case 'RFQs': return <RFQs />;
      case 'Purchase Requests': return <PurchaseRequests />;
      case 'Purchase Orders': return <PurchaseOrders />;
      case 'Contracts': return <Contracts />;
      case 'Inventory': return <Inventory />;
      case 'Assets': return <Assets />;
      case 'Invoices': return <Invoices />;
      case 'Budget': return <Budget />;
      case 'Payments': return <Payments />;
      case 'Reports': return <Reports />;
      default: return <Overview />;
    }
  };

  return (
    <EnterpriseLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </EnterpriseLayout>
  );
}
