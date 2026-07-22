import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseExportMenu } from '../../../components/enterprise/EnterpriseExportMenu';
import { DollarSign, CreditCard, Briefcase } from 'lucide-react';
import { serviceTransactions } from '../../../data/homeServicesData';
import { useToast } from '../../../contexts/ToastContext';

export default function Financials() {
  const { showToast } = useToast();

  const handleExport = (format: string) => {
    showToast({ title: 'Success', description: `Financial report exported as ${format}`, type: 'success' });
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Financial Management</h2>
          <p className="text-sm text-ink/60">Service revenue, provider payouts, and commissions.</p>
        </div>
        <EnterpriseExportMenu onExport={handleExport} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard 
          title="Total Revenue" 
          value="₦24.5M" 
          trend="+12%" 
          icon={DollarSign} 
        />
        <KPICard 
          title="Provider Payouts" 
          value="₦18.2M" 
          trend="+8%" 
          trendColor="text-red-400"
          icon={CreditCard} 
        />
        <KPICard 
          title="Active Subscriptions" 
          value="1,240" 
          trend="+5%" 
          icon={Briefcase} 
        />
      </div>

      <div className="bg-navy-800/50 rounded-2xl border border-white/10 p-6">
        <div className="mb-6">
          <h3 className="font-heading text-lg font-bold text-cream mb-4">Recent Transactions</h3>
          <DataTableToolbar searchPlaceholder="Search transactions..." onFilter={() => {}} />
        </div>
        
        <DataTable
          columns={[
            { header: 'Date', render: (t) => t.date },
            { header: 'Description', render: (t) => t.description },
            { header: 'Type', render: (t) => t.type },
            { header: 'Amount', render: (t) => `₦${t.amount.toLocaleString()}` },
            { header: 'Status', render: (t) => <EnterpriseStatusBadge status={t.status} /> },
          ]}
          keyExtractor={(t) => t.id}
          data={serviceTransactions}
        />
      </div>
    </div>
  );
}
