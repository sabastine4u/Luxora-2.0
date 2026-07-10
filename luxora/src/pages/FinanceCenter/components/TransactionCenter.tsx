import { useFinanceCenter } from '../hooks/useFinanceCenter';
import { ListOrdered, Filter, Search, Download } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../components/ui/ui';
import { clsx } from 'clsx';
import { TRANSACTION_STATUS_COLORS } from '../constants/financeConstants';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';

export const TransactionCenter = () => {
  const { transactions, searchQuery, setSearchQuery } = useFinanceCenter();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value);
  };

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-ink">
      <div className="p-6 border-b border-gray-200 dark:border-ink-light flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <ListOrdered className="w-5 h-5 mr-3 text-gold-500" />
            Transaction Ledger
          </h2>
          <p className="text-sm text-gray-500 mt-1">Comprehensive chronological list of all enterprise financial movements.</p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search ref, desc, category..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-ink-light rounded-lg bg-gray-50 dark:bg-ink-light/50 focus:outline-none focus:border-gold-500 transition-colors dark:text-white"
            />
          </div>
          <GhostButton size="sm"><Filter className="w-4 h-4 mr-2" /> Filters</GhostButton>
          <GoldButton size="sm"><Download className="w-4 h-4 mr-2" /> Export</GoldButton>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 dark:bg-ink-dark/50 text-gray-500 sticky top-0 border-b border-gray-200 dark:border-ink-light">
            <tr>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Reference</th>
              <th className="px-6 py-4 font-semibold">Description</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold text-right">Amount</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-ink-light">
            {filteredTransactions.map(txn => (
              <tr key={txn.id} className="hover:bg-gray-50/50 dark:hover:bg-ink-light/20 transition-colors">
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{formatMessageTime(txn.date)}</td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{txn.reference}</td>
                <td className="px-6 py-4">
                  <div className="text-gray-900 dark:text-white max-w-[250px] truncate" title={txn.description}>{txn.description}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {txn.relatedPropertyId && <span className="mr-2">Prop: {txn.relatedPropertyId}</span>}
                    {txn.relatedContactId && <span>Contact: {txn.relatedContactId}</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{txn.category}</td>
                <td className={clsx(
                  "px-6 py-4 text-right font-bold",
                  txn.type === 'Income' ? 'text-emerald-600 dark:text-emerald-400' : 
                  txn.type === 'Expense' ? 'text-gray-900 dark:text-white' : 'text-gray-500'
                )}>
                  {txn.type === 'Income' ? '+' : '-'}{formatCurrency(txn.amount)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={clsx("text-[10px] font-bold uppercase px-2 py-1 rounded border", TRANSACTION_STATUS_COLORS[txn.status] || TRANSACTION_STATUS_COLORS.Pending)}>
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No transactions found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
