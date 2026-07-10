export const FINANCE_WORKSPACES = [
  'dashboard',
  'transactions',
  'revenue',
  'expenses',
  'invoices',
  'payments',
  'commissions',
  'budgets',
  'cashflow',
  'reports',
  'tax',
  'analytics',
  'executive'
] as const;

export type FinanceWorkspace = typeof FINANCE_WORKSPACES[number];

export const NAVIGATION_CATEGORIES = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'transactions', label: 'Transactions', icon: 'ListOrdered' },
  { id: 'revenue', label: 'Revenue', icon: 'TrendingUp' },
  { id: 'expenses', label: 'Expenses', icon: 'TrendingDown' },
  { id: 'invoices', label: 'Invoices', icon: 'FileText' },
  { id: 'payments', label: 'Payments', icon: 'CreditCard' },
  { id: 'commissions', label: 'Commissions', icon: 'Award' },
  { id: 'budgets', label: 'Budgets', icon: 'PieChart' },
  { id: 'cashflow', label: 'Cash Flow', icon: 'Activity' },
  { id: 'analytics', label: 'Financial Analytics', icon: 'BarChart3' },
  { id: 'reports', label: 'Reports', icon: 'FileBarChart' },
  { id: 'tax', label: 'Tax Center', icon: 'Landmark' },
  { id: 'executive', label: 'Executive Insights', icon: 'Sparkles' },
];

export const TRANSACTION_STATUS_COLORS: Record<string, string> = {
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Processing: 'bg-blue-50 text-blue-700 border-blue-200',
  Failed: 'bg-red-50 text-red-700 border-red-200',
  Refunded: 'bg-orange-50 text-orange-700 border-orange-200',
};

export const INVOICE_STATUS_COLORS: Record<string, string> = {
  Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Draft: 'bg-gray-50 text-gray-700 border-gray-200',
  Overdue: 'bg-red-50 text-red-700 border-red-200',
  Cancelled: 'bg-gray-100 text-gray-500 border-gray-300',
};
