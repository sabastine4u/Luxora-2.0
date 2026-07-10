import { Award, UserCheck, Building } from 'lucide-react';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { useFinanceCenter } from '../hooks/useFinanceCenter';
import { formatMessageTime } from '../../CommunicationCenter/utils/formatter';
import { clsx } from 'clsx';
import { GoldButton } from '../../../components/ui/ui';

export const CommissionCenter = () => {
  const { commissions } = useFinanceCenter();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-ink-dark">
      <div className="p-6 md:p-8 shrink-0">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Award className="w-6 h-6 mr-3 text-gold-500" />
            Commission Center
          </h2>
          <p className="text-gray-500 mt-1">Track agency and agent commissions, pending payouts, and forecasts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard title="Pending Commissions" value={formatCurrency(7500000)} icon={Award} trend="1 deal closing" trendColor="text-emerald-500" />
          <KPICard title="Paid to Agents (YTD)" value={formatCurrency(45000000)} icon={UserCheck} trend="+12% YoY" trendColor="text-emerald-500" />
          <KPICard title="Paid to Agencies (YTD)" value={formatCurrency(85000000)} icon={Building} trend="+5% YoY" trendColor="text-emerald-500" />
        </div>
      </div>

      <div className="flex-1 overflow-x-auto bg-white dark:bg-ink border-t border-gray-200 dark:border-ink-light">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 dark:bg-ink-dark/50 text-gray-500 sticky top-0 border-b border-gray-200 dark:border-ink-light">
            <tr>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Agent / Agency</th>
              <th className="px-6 py-4 font-semibold">Deal Ref</th>
              <th className="px-6 py-4 font-semibold text-right">Amount</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-ink-light">
            {commissions.map(comm => (
              <tr key={comm.id} className="hover:bg-gray-50/50 dark:hover:bg-ink-light/20 transition-colors">
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{formatMessageTime(comm.date)}</td>
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">User: {comm.agentId}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">Deal: {comm.dealId}</td>
                <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                  {formatCurrency(comm.amount)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={clsx("text-[10px] font-bold uppercase px-2 py-1 rounded border", 
                    comm.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  )}>
                    {comm.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {comm.status !== 'Paid' && (
                    <GoldButton size="sm" className="h-8 px-3">Process Payout</GoldButton>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
