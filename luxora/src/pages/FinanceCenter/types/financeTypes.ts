export type TransactionType = 'Income' | 'Expense' | 'Transfer' | 'Refund';
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded' | 'Processing';
export type InvoiceStatus = 'Draft' | 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';
export type ExpenseCategory = 'Procurement' | 'Maintenance' | 'Payroll' | 'Marketing' | 'Taxes' | 'Utilities' | 'Insurance' | 'Operations';
export type RevenueCategory = 'Property Sales' | 'Rental Income' | 'Service Fees' | 'Commission Income' | 'Subscription Income';
export type TaxCategory = 'VAT' | 'Income Tax' | 'Property Tax' | 'Government Fees';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: ExpenseCategory | RevenueCategory | string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  reference: string;
  description: string;
  relatedPropertyId?: string;
  relatedContactId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: InvoiceStatus;
  billedToContactId: string;
  description: string;
  items: { description: string; quantity: number; unitPrice: number; amount: number }[];
  createdAt: string;
}

export interface Budget {
  id: string;
  department: string;
  period: string; // e.g., 'Q3 2026'
  allocatedAmount: number;
  spentAmount: number;
  currency: string;
  health: 'On Track' | 'At Risk' | 'Over Budget';
}

export interface Commission {
  id: string;
  agentId: string;
  propertyId: string;
  dealId: string;
  amount: number;
  currency: string;
  status: 'Pending' | 'Paid';
  date: string;
}

export interface CashFlow {
  period: string;
  inflow: number;
  outflow: number;
  net: number;
}
