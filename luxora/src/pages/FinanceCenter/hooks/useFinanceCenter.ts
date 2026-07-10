import { useState, useMemo } from 'react';
import type { FinanceWorkspace } from '../constants/financeConstants';
import type { Transaction, Invoice, Budget, Commission, CashFlow } from '../types/financeTypes';
import { MOCK_TRANSACTIONS, MOCK_INVOICES, MOCK_BUDGETS, MOCK_COMMISSIONS, MOCK_CASH_FLOW } from '../data/mockData';

export const useFinanceCenter = () => {
  const [activeWorkspace, setActiveWorkspace] = useState<FinanceWorkspace>('dashboard');
  
  const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [invoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [budgets] = useState<Budget[]>(MOCK_BUDGETS);
  const [commissions] = useState<Commission[]>(MOCK_COMMISSIONS);
  const [cashFlowData] = useState<CashFlow[]>(MOCK_CASH_FLOW);

  const [searchQuery, setSearchQuery] = useState('');
  
  const metrics = useMemo(() => {
    const totalRevenue = transactions.filter(t => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0);
    const netProfit = totalRevenue - totalExpenses;
    
    const outstandingInvoicesCount = invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').length;
    const outstandingInvoicesValue = invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').reduce((acc, i) => acc + i.totalAmount, 0);
    
    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      outstandingInvoicesCount,
      outstandingInvoicesValue
    };
  }, [transactions, invoices]);

  return {
    activeWorkspace,
    setActiveWorkspace,
    transactions,
    invoices,
    budgets,
    commissions,
    cashFlowData,
    searchQuery,
    setSearchQuery,
    metrics
  };
};
