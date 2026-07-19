import { useState } from 'react';
import { EnterpriseLayout } from '../../components/layout';
import VendorDirectory from './components/VendorDirectory';
import VendorDetails from './components/VendorDetails';
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
  const [activeTab, setActiveTab] = useState('Vendor Directory');

  const renderContent = () => {
    switch (activeTab) {
      case 'Vendor Directory': return <VendorDirectory />;
      case 'Vendor Details': return <VendorDetails />;
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
      default: return <VendorDirectory />;
    }
  };

  return (
    <EnterpriseLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </EnterpriseLayout>
  );
}
