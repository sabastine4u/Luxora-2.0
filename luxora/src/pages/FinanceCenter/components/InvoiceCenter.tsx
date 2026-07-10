import { useFinanceCenter } from '../hooks/useFinanceCenter';
import { FileText, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { clsx } from 'clsx';
import { INVOICE_STATUS_COLORS } from '../constants/financeConstants';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';

export const InvoiceCenter = () => {
  const { invoices } = useFinanceCenter();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-ink">
      <div className="p-6 border-b border-gray-200 dark:border-ink-light flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <FileText className="w-5 h-5 mr-3 text-gold-500" />
            Invoice Center
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage draft, pending, overdue, and paid invoices.</p>
        </div>
        <GoldButton size="sm">Create Invoice</GoldButton>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 dark:bg-ink-dark/50 text-gray-500 sticky top-0 border-b border-gray-200 dark:border-ink-light">
            <tr>
              <th className="px-6 py-4 font-semibold">Invoice #</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Due Date</th>
              <th className="px-6 py-4 font-semibold">Billed To</th>
              <th className="px-6 py-4 font-semibold text-right">Total Amount</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-ink-light">
            {invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-gray-50/50 dark:hover:bg-ink-light/20 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{inv.invoiceNumber}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{formatMessageTime(inv.date)}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    {new Date(inv.dueDate) < new Date() && inv.status !== 'Paid' ? (
                      <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                    ) : null}
                    {formatMessageTime(inv.dueDate)}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">Contact: {inv.billedToContactId}</td>
                <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                  {formatCurrency(inv.totalAmount)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={clsx("text-[10px] font-bold uppercase px-2 py-1 rounded border", INVOICE_STATUS_COLORS[inv.status] || INVOICE_STATUS_COLORS.Draft)}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <GhostButton size="sm" className="h-8 px-2"><Download className="w-4 h-4" /></GhostButton>
                    {inv.status !== 'Paid' && (
                      <GoldButton size="sm" className="h-8 px-2"><CheckCircle className="w-4 h-4 mr-1" /> Mark Paid</GoldButton>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
