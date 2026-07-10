import { PieChart, AlertCircle, CheckCircle } from 'lucide-react';
import { useFinanceCenter } from '../hooks/useFinanceCenter';
import { clsx } from 'clsx';

export const BudgetCenter = () => {
  const { budgets } = useFinanceCenter();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', { notation: 'compact', compactDisplay: 'short', style: 'currency', currency: 'NGN' }).format(value);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50 dark:bg-ink-dark">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <PieChart className="w-6 h-6 mr-3 text-gold-500" />
          Department Budgets
        </h2>
        <p className="text-gray-500 mt-1">Monitor budget allocations, spending, and departmental financial health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map(budget => {
          const usagePercent = Math.min(100, Math.round((budget.spentAmount / budget.allocatedAmount) * 100));
          const remaining = budget.allocatedAmount - budget.spentAmount;

          return (
            <div key={budget.id} className="bg-white dark:bg-ink rounded-xl border border-gray-200 dark:border-ink-light p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{budget.department}</h3>
                  <div className="text-sm text-gray-500">{budget.period} Allocation</div>
                </div>
                <div className={clsx("flex items-center px-2.5 py-1 rounded-full text-xs font-bold border", 
                  budget.health === 'On Track' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  budget.health === 'At Risk' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  'bg-red-50 text-red-700 border-red-200'
                )}>
                  {budget.health === 'On Track' ? <CheckCircle className="w-3.5 h-3.5 mr-1" /> : <AlertCircle className="w-3.5 h-3.5 mr-1" />}
                  {budget.health}
                </div>
              </div>

              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(budget.spentAmount)} Spent</span>
                <span className="text-gray-500">{formatCurrency(budget.allocatedAmount)} Total</span>
              </div>

              <div className="h-3 w-full bg-gray-100 dark:bg-ink-light rounded-full overflow-hidden mb-4">
                <div 
                  className={clsx("h-full transition-all duration-500", 
                    usagePercent > 90 ? 'bg-red-500' : usagePercent > 75 ? 'bg-yellow-500' : 'bg-emerald-500'
                  )} 
                  style={{ width: `${usagePercent}%` }}
                />
              </div>

              <div className="text-sm font-semibold text-gray-500 flex justify-end">
                {formatCurrency(remaining)} Remaining ({100 - usagePercent}%)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
