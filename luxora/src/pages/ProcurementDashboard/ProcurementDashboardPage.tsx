import { useSearchParams } from 'react-router-dom';
import { EnterpriseLayout } from '../../components/layout';
import { ProcurementOverview, ProcurementRecordCenter, ProcurementReports } from './components/ProcurementRecordCenter';
import Messages from './components/Messages';
import Settings from './components/Settings';

export default function ProcurementDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'Overview';

  const handleNavigate = (tab: string, id?: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    if (id) {
      newParams.set('vendorId', id);
    } else {
      newParams.delete('vendorId');
    }
    setSearchParams(newParams);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <ProcurementOverview />;
      case 'Messages': return <Messages />;
      case 'Settings': return <Settings />;
      case 'Vendor Directory': return <ProcurementRecordCenter recordType="vendor" />;
      case 'RFQs': return <ProcurementRecordCenter recordType="rfq" />;
      case 'Purchase Requests': return <ProcurementRecordCenter recordType="request" />;
      case 'Purchase Orders': return <ProcurementRecordCenter recordType="order" />;
      case 'Contracts': return <ProcurementRecordCenter recordType="contract" />;
      case 'Inventory': return <ProcurementRecordCenter recordType="inventory" />;
      case 'Assets': return <ProcurementRecordCenter recordType="asset" />;
      case 'Invoices': return <ProcurementRecordCenter recordType="invoice" />;
      case 'Budget': return <ProcurementRecordCenter recordType="budget" />;
      case 'Payments': return <ProcurementRecordCenter recordType="payment" />;
      case 'Reports': return <ProcurementReports />;
      default: return <ProcurementOverview />;
    }
  };

  const handleTabChange = (tab: string) => {
    handleNavigate(tab);
  };

  return (
    <EnterpriseLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderContent()}
    </EnterpriseLayout>
  );
}
