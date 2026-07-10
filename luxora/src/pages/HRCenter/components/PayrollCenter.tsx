import { Banknote, FileText } from 'lucide-react';
import { useHRCenter } from '../hooks/useHRCenter';
import { HRStatusBadge } from './HRStatusBadge';
import { HR_STATUS_COLORS } from '../constants/hrConstants';
import { GoldButton, GhostButton } from '../../../components/ui/ui';

export const PayrollCenter = () => {
  const { payroll, allEmployees } = useHRCenter();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Banknote className="w-6 h-6 mr-3 text-gold-500" />
            Payroll Summaries
          </h2>
          <p className="text-gray-500 mt-1">Review compensation, bonuses, deductions, and integration with Finance Center.</p>
        </div>
        <div className="flex space-x-3">
          <GhostButton><FileText className="w-4 h-4 mr-2" /> Export CSV</GhostButton>
          <GoldButton>Run Payroll Integration</GoldButton>
        </div>
      </div>

      <div className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-ink-light border-b border-gray-200 dark:border-ink-light text-gray-500 dark:text-gray-400 text-sm">
              <th className="p-4 font-medium">Month</th>
              <th className="p-4 font-medium">Employee</th>
              <th className="p-4 font-medium">Base Salary</th>
              <th className="p-4 font-medium">Bonus</th>
              <th className="p-4 font-medium">Deductions</th>
              <th className="p-4 font-medium">Net Pay</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-ink-light">
            {payroll.map((pay) => {
              const emp = allEmployees.find(e => e.id === pay.employeeId);
              return (
                <tr key={pay.id} className="hover:bg-gray-50 dark:hover:bg-ink-light/50 transition-colors">
                  <td className="p-4 text-sm font-bold text-gray-900 dark:text-white">{pay.month}</td>
                  <td className="p-4 text-sm">
                    {emp ? (
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{emp.firstName} {emp.lastName}</div>
                        <div className="text-xs text-gray-500">{emp.position}</div>
                      </div>
                    ) : (
                      <div className="text-gray-400">Unknown</div>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{formatCurrency(pay.baseSalary)}</td>
                  <td className="p-4 text-sm text-emerald-600 dark:text-emerald-500">+{formatCurrency(pay.bonus)}</td>
                  <td className="p-4 text-sm text-red-600 dark:text-red-500">-{formatCurrency(pay.deductions)}</td>
                  <td className="p-4 text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(pay.netPay)}</td>
                  <td className="p-4 text-sm">
                    <HRStatusBadge status={pay.status} className={
                      pay.status === 'Paid' ? HR_STATUS_COLORS['Completed'] :
                      pay.status === 'Approved' ? HR_STATUS_COLORS['Active'] :
                      HR_STATUS_COLORS['Pending']
                    } />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
