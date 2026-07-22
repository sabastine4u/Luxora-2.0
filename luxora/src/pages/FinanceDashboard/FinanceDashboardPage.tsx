import { useState } from 'react';
import { EnterpriseLayout } from '../../components/layout';
import Overview from './components/Overview';
import Messages from './components/Messages';
import Settings from './components/Settings';
import Revenue from './components/Revenue';
import Transactions from './components/Transactions';
import OwnerPayments from './components/OwnerPayments';
import AgencyEarnings from './components/AgencyEarnings';
import AgentCommissions from './components/AgentCommissions';
import Invoices from './components/Invoices';
import Refunds from './components/Refunds';
import MortgageStatistics from './components/MortgageStatistics';
import Budget from './components/Budget';
import Reports from './components/Reports';
import Payroll from './components/Payroll';
import TaxCenter from './components/TaxCenter';
import AuditLogs from './components/AuditLogs';
import Forecasting from './components/Forecasting';

export default function FinanceDashboardPage() {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <Overview />;
      case 'Messages': return <Messages />;
      case 'Revenue': return <Revenue />;
      case 'Transactions': return <Transactions />;
      case 'Owner Payments': return <OwnerPayments />;
      case 'Agency Earnings': return <AgencyEarnings />;
      case 'Agent Commissions': return <AgentCommissions />;
      case 'Invoices': return <Invoices />;
      case 'Refunds': return <Refunds />;
      case 'Mortgage Statistics': return <MortgageStatistics />;
      case 'Budget': return <Budget />;
      case 'Reports': return <Reports />;
      case 'Payroll': return <Payroll />;
      case 'Tax Center': return <TaxCenter />;
      case 'Audit Logs': return <AuditLogs />;
      case 'Forecasting': return <Forecasting />;
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
