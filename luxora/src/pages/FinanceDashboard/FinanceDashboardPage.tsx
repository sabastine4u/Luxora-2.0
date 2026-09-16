import { useState } from 'react';
import { EnterpriseLayout } from '../../components/layout';
import Messages from './components/Messages';
import Settings from './components/Settings';
import { FinanceDataView, FinanceForecasting, FinanceOverview, FinanceReports, UnsupportedFinanceFeature } from './components/FinanceDataViews';

export default function FinanceDashboardPage() {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <FinanceOverview />;
      case 'Messages': return <Messages />;
      case 'Revenue': case 'Transactions': case 'Owner Payments': case 'Agency Earnings': case 'Agent Commissions': case 'Mortgage Statistics': case 'Budget': case 'Audit Logs': return <FinanceDataView tab={activeTab} />;
      case 'Reports': return <FinanceReports />;
      case 'Forecasting': return <FinanceForecasting />;
      case 'Invoices': case 'Refunds': case 'Payroll': case 'Tax Center': return <UnsupportedFinanceFeature title={activeTab} />;
      case 'Settings': return <Settings />;
      default: return <FinanceOverview />;
    }
  };

  return (
    <EnterpriseLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </EnterpriseLayout>
  );
}
