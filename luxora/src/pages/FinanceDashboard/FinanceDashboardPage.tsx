import { useState } from 'react';
import { DashboardLayout } from '../../components/layout';
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

export default function FinanceDashboardPage() {
  const [activeTab, setActiveTab] = useState('Revenue');

  const renderContent = () => {
    switch (activeTab) {
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
      default: return <Revenue />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}
