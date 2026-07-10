import { Landmark, FileText, AlertTriangle } from 'lucide-react';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { GoldButton } from '../../../components/ui/ui';

export const TaxCenter = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Landmark className="w-6 h-6 mr-3 text-gold-500" />
          Tax & Compliance Center
        </h2>
        <p className="text-gray-500 mt-1">Manage VAT, Income Tax, Property Tax, and government compliance filings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard title="Estimated VAT Liability" value="₦14,500,000" icon={Landmark} trend="Q3 Filing Pending" trendColor="text-yellow-500" />
        <KPICard title="Property Tax Accrued" value="₦8,200,000" icon={FileText} trend="Due Oct 2026" trendColor="text-gray-500" />
        <KPICard title="Compliance Alerts" value="1" icon={AlertTriangle} trend="Action Required" trendColor="text-red-500" />
      </div>

      <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white">Upcoming Tax Deadlines</h3>
          <GoldButton size="sm">File Return</GoldButton>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-ink-light">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Q3 VAT Return (FIRS)</h4>
              <p className="text-sm text-gray-500">Period: Jul 1 - Sep 30, 2026</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-1 rounded">DUE IN 14 DAYS</span>
            </div>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-ink-light">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Annual Property Tax Assessment</h4>
              <p className="text-sm text-gray-500">All Lagos Properties</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded">FILED & PAID</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
