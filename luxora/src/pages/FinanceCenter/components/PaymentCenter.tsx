import { CreditCard, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';

export const PaymentCenter = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <CreditCard className="w-6 h-6 mr-3 text-gold-500" />
          Payment Center
        </h2>
        <p className="text-gray-500 mt-1">Manage incoming payments, outgoing transfers, refunds, and installments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <KPICard title="Incoming Payments (30d)" value="₦145,000,000" icon={ArrowDownLeft} trend="12 Pending" trendColor="text-yellow-500" />
        <KPICard title="Outgoing Payments (30d)" value="₦42,000,000" icon={ArrowUpRight} trend="All clear" trendColor="text-emerald-500" />
      </div>

      <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6 h-96 flex flex-col items-center justify-center">
        <p className="text-gray-400">Payment Gateway Integrations & Installment Plans Placeholder</p>
      </div>
    </div>
  );
};
