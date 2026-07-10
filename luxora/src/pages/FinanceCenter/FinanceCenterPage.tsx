import { DashboardHeader } from '../../components/dashboard/shared/headers/DashboardHeader';
import { LeftNavigation } from './components/LeftNavigation';
import { useFinanceCenter } from './hooks/useFinanceCenter';
import { FinanceDashboard } from './components/FinanceDashboard';
import { TransactionCenter } from './components/TransactionCenter';
import { RevenueCenter } from './components/RevenueCenter';
import { ExpenseCenter } from './components/ExpenseCenter';
import { InvoiceCenter } from './components/InvoiceCenter';
import { PaymentCenter } from './components/PaymentCenter';
import { CommissionCenter } from './components/CommissionCenter';
import { BudgetCenter } from './components/BudgetCenter';
import { CashFlowDashboard } from './components/CashFlowDashboard';
import { TaxCenter } from './components/TaxCenter';
import { FinancialReports } from './components/FinancialReports';
import { FinancialAnalytics } from './components/FinancialAnalytics';
import { ExecutiveInsights } from './components/ExecutiveInsights';

export default function FinanceCenterPage() {
  const { activeWorkspace } = useFinanceCenter();

  const renderWorkspace = () => {
    switch (activeWorkspace) {
      case 'dashboard': return <FinanceDashboard />;
      case 'transactions': return <TransactionCenter />;
      case 'revenue': return <RevenueCenter />;
      case 'expenses': return <ExpenseCenter />;
      case 'invoices': return <InvoiceCenter />;
      case 'payments': return <PaymentCenter />;
      case 'commissions': return <CommissionCenter />;
      case 'budgets': return <BudgetCenter />;
      case 'cashflow': return <CashFlowDashboard />;
      case 'tax': return <TaxCenter />;
      case 'reports': return <FinancialReports />;
      case 'analytics': return <FinancialAnalytics />;
      case 'executive': return <ExecutiveInsights />;
      default: return <FinanceDashboard />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-ink-dark overflow-hidden">
      <div className="p-6 pb-2 shrink-0 border-b border-gray-200 dark:border-ink-light bg-white dark:bg-ink">
        <DashboardHeader 
          name="Enterprise Finance & Accounting" 
          subtitle="Centralized financial intelligence and accounting engine." 
        />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <LeftNavigation />
        
        <main className="flex-1 relative overflow-hidden flex flex-col">
          {renderWorkspace()}
        </main>
      </div>
    </div>
  );
}
