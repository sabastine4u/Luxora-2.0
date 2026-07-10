import type { Transaction, Invoice, Budget, Commission, CashFlow } from '../types/financeTypes';

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-1',
    date: '2026-07-09T10:30:00Z',
    type: 'Income',
    category: 'Property Sales',
    amount: 150000000,
    currency: 'NGN',
    status: 'Completed',
    reference: 'REF-893247A',
    description: 'Initial deposit for Azure Tower Penthouse',
    relatedPropertyId: 'prop-1',
    relatedContactId: 'contact-1',
    createdAt: '2026-07-09T10:30:00Z',
    updatedAt: '2026-07-09T10:30:00Z'
  },
  {
    id: 'txn-2',
    date: '2026-07-08T14:15:00Z',
    type: 'Expense',
    category: 'Marketing',
    amount: 2500000,
    currency: 'NGN',
    status: 'Completed',
    reference: 'REF-112233B',
    description: 'Q3 Digital Marketing Campaign',
    createdAt: '2026-07-08T14:15:00Z',
    updatedAt: '2026-07-08T14:15:00Z'
  },
  {
    id: 'txn-3',
    date: '2026-07-07T09:00:00Z',
    type: 'Income',
    category: 'Rental Income',
    amount: 5000000,
    currency: 'NGN',
    status: 'Pending',
    reference: 'REF-RENT-99',
    description: 'Annual rent for Unit 4B, Lekki Heights',
    relatedPropertyId: 'prop-2',
    createdAt: '2026-07-07T09:00:00Z',
    updatedAt: '2026-07-07T09:00:00Z'
  }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-001',
    date: '2026-07-01T00:00:00Z',
    dueDate: '2026-07-15T00:00:00Z',
    amount: 1000000,
    taxAmount: 75000,
    totalAmount: 1075000,
    currency: 'NGN',
    status: 'Pending',
    billedToContactId: 'contact-1',
    description: 'Agency Consultation Fee',
    items: [
      { description: 'Premium Market Analysis', quantity: 1, unitPrice: 1000000, amount: 1000000 }
    ],
    createdAt: '2026-07-01T08:00:00Z'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-002',
    date: '2026-06-15T00:00:00Z',
    dueDate: '2026-06-30T00:00:00Z',
    amount: 500000,
    taxAmount: 37500,
    totalAmount: 537500,
    currency: 'NGN',
    status: 'Overdue',
    billedToContactId: 'contact-2',
    description: 'Property Valuation Service',
    items: [
      { description: 'Valuation Service', quantity: 1, unitPrice: 500000, amount: 500000 }
    ],
    createdAt: '2026-06-15T08:00:00Z'
  }
];

export const MOCK_BUDGETS: Budget[] = [
  {
    id: 'bud-1',
    department: 'Marketing',
    period: 'Q3 2026',
    allocatedAmount: 50000000,
    spentAmount: 42000000,
    currency: 'NGN',
    health: 'At Risk'
  },
  {
    id: 'bud-2',
    department: 'Operations',
    period: 'Q3 2026',
    allocatedAmount: 120000000,
    spentAmount: 45000000,
    currency: 'NGN',
    health: 'On Track'
  }
];

export const MOCK_COMMISSIONS: Commission[] = [
  {
    id: 'comm-1',
    agentId: 'user-1',
    propertyId: 'prop-1',
    dealId: 'deal-1',
    amount: 7500000,
    currency: 'NGN',
    status: 'Pending',
    date: '2026-07-30T00:00:00Z'
  }
];

export const MOCK_CASH_FLOW: CashFlow[] = [
  { period: 'Jan', inflow: 120000000, outflow: 45000000, net: 75000000 },
  { period: 'Feb', inflow: 150000000, outflow: 50000000, net: 100000000 },
  { period: 'Mar', inflow: 110000000, outflow: 60000000, net: 50000000 },
  { period: 'Apr', inflow: 180000000, outflow: 55000000, net: 125000000 },
  { period: 'May', inflow: 210000000, outflow: 65000000, net: 145000000 },
  { period: 'Jun', inflow: 190000000, outflow: 70000000, net: 120000000 }
];
