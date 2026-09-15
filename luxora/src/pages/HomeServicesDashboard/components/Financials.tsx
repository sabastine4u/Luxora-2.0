import { useEffect, useState } from 'react';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTable } from '../../../components/dashboard/shared/tables/DataTable';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { EnterpriseStatusBadge } from '../../../components/enterprise/EnterpriseStatusBadge';
import { EnterpriseExportMenu } from '../../../components/enterprise/EnterpriseExportMenu';
import { DollarSign, CreditCard, Briefcase } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { homeServicesApi } from '../../../api/home-services.api';

interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  type: string;
  amount: number;
  status: string;
}

interface FinancialsData {
  summary: {
    totalRevenue: number;
    providerPayouts: number;
    activeSubscriptions: number | null;
  };
  transactions: FinancialTransaction[];
}

export default function Financials() {
  const { showToast } = useToast();

  const [financials, setFinancials] =
    useState<FinancialsData | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const loadFinancials = async () => {
    try {
      setIsLoading(true);

      const response =
        await homeServicesApi.getFinancials();

      setFinancials(response.financials);
    } catch (error) {
      console.error(
        'Failed to load Home Services financials:',
        error,
      );

      showToast({
        title: 'Error',
        description:
          'Failed to load financial data.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFinancials();
  }, []);

  const handleExport = (format: string) => {
    showToast({
      title: 'Success',
      description: `Financial report exported as ${format}`,
      type: 'success',
    });
  };

  const summary = financials?.summary;

  const transactions =
    financials?.transactions || [];

  const formatCurrency = (value: number) => {
    return `₦${value.toLocaleString('en-NG')}`;
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">
            Financial Management
          </h2>

          <p className="text-sm text-ink/60">
            Service revenue, provider payouts, and commissions.
          </p>
        </div>

        <EnterpriseExportMenu
          onExport={handleExport}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard
          title="Total Revenue"
          value={
            isLoading
              ? 'Loading...'
              : formatCurrency(
                  summary?.totalRevenue || 0,
                )
          }
          trend=""
          icon={DollarSign}
        />

        <KPICard
          title="Provider Payouts"
          value={
            isLoading
              ? 'Loading...'
              : formatCurrency(
                  summary?.providerPayouts || 0,
                )
          }
          trend=""
          trendColor="text-red-400"
          icon={CreditCard}
        />

        <KPICard
          title="Active Subscriptions"
          value={
            isLoading
              ? 'Loading...'
              : summary?.activeSubscriptions === null ||
                  summary?.activeSubscriptions ===
                    undefined
                ? '—'
                : String(
                    summary.activeSubscriptions,
                  )
          }
          trend=""
          icon={Briefcase}
        />
      </div>

      <div className="bg-navy-800/50 rounded-2xl border border-white/10 p-6">
        <div className="mb-6">
          <h3 className="font-heading text-lg font-bold text-cream mb-4">
            Recent Transactions
          </h3>

          <DataTableToolbar
            searchPlaceholder="Search transactions..."
            onFilter={() => {}}
          />
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-sm text-ink/50">
            Loading financial transactions...
          </div>
        ) : (
          <DataTable
            columns={[
              {
                header: 'Date',
                render: (t: FinancialTransaction) =>
                  t.date,
              },
              {
                header: 'Description',
                render: (
                  t: FinancialTransaction,
                ) => t.description,
              },
              {
                header: 'Type',
                render: (t: FinancialTransaction) =>
                  t.type,
              },
              {
                header: 'Amount',
                render: (
                  t: FinancialTransaction,
                ) =>
                  `₦${t.amount.toLocaleString('en-NG')}`,
              },
              {
                header: 'Status',
                render: (
                  t: FinancialTransaction,
                ) => (
                  <EnterpriseStatusBadge
                    status={t.status}
                  />
                ),
              },
            ]}
            keyExtractor={(
              t: FinancialTransaction,
            ) => t.id}
            data={transactions}
          />
        )}
      </div>
    </div>
  );
}