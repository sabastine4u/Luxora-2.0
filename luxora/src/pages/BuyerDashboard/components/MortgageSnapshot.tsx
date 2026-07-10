import { useMemo } from 'react';
import { Calculator, Home, Phone, ChevronRight } from 'lucide-react';
import { calculateMortgage, formatCurrency } from '../../../utils';
import { PropertyCard } from '../../../components/property/PropertyCard';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { properties } from '../../../data/luxoraData';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

export default function MortgageSnapshot() {
  const navigate = useNavigate();
  
  // Mock data for the snapshot
  const targetPropertyPriceMillions = 150;
  const downPaymentPct = 20;
  const loanTermMonths = 180; // 15 years
  const interestRate = 0.145; // 14.5%
  
  const { principal, monthly } = calculateMortgage(targetPropertyPriceMillions, downPaymentPct, loanTermMonths);
  
  const estimatedInterest = (monthly * loanTermMonths) - principal;

  // Affordability Summary Mock
  const monthlyBudget = 4000000;
  const budgetUsed = monthly;
  const remainingBudget = monthlyBudget - budgetUsed;
  const budgetUsedPct = Math.min((budgetUsed / monthlyBudget) * 100, 100);

  // Property Match
  const affordableProperties = useMemo(() => {
    return properties.filter(p => {
       const m = calculateMortgage(p.priceValue, 20, loanTermMonths).monthly;
       return m <= monthlyBudget;
    }).slice(0, 3);
  }, [monthlyBudget, loanTermMonths]);

  return (
    <div className="space-y-6">
      {/* Premium Dashboard Card */}
      <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8 backdrop-blur-md">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex items-center gap-3">
             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
               <Calculator className="h-6 w-6" />
             </div>
             <div>
               <h3 className="font-heading text-xl font-bold text-cream">Mortgage Snapshot</h3>
               <p className="text-sm text-ink/60">Your current estimated financing capability</p>
             </div>
           </div>
           <span className="self-start md:self-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold text-emerald-300">
             Pre-Qualified Active
           </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 lg:col-span-2">
            <div className="text-sm text-ink/60">Est. Monthly Payment</div>
            <div className="mt-2 font-heading text-3xl font-bold text-gold-400">{formatCurrency(monthly)}</div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <div className="text-sm text-ink/60">Est. Loan Amount</div>
            <div className="mt-2 font-heading text-xl font-bold text-cream">{formatCurrency(principal)}</div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <div className="text-sm text-ink/60">Est. Interest Paid</div>
            <div className="mt-2 font-heading text-xl font-bold text-cream">{formatCurrency(estimatedInterest)}</div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <div className="text-sm text-ink/60">Loan Term</div>
            <div className="mt-2 font-heading text-xl font-bold text-cream">{loanTermMonths / 12} Yrs @ {(interestRate * 100).toFixed(1)}%</div>
          </div>
        </div>

        {/* Affordability Summary */}
        <div className="mt-8 rounded-2xl border border-white/5 bg-navy-900/50 p-6">
          <h4 className="mb-4 font-heading text-lg font-semibold text-cream">Affordability Summary</h4>
          
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-ink/60">Budget Used: <span className="font-bold text-cream">{formatCurrency(budgetUsed)}</span></span>
            <span className="text-ink/60">Monthly Budget: <span className="font-bold text-cream">{formatCurrency(monthlyBudget)}</span></span>
          </div>
          
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/5">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${budgetUsedPct > 90 ? 'bg-rose-400' : 'bg-gold-400'}`}
              style={{ width: `${budgetUsedPct}%` }}
            />
          </div>
          
          <div className="mt-3 flex justify-between text-xs">
            <span className="text-emerald-400">Safe Range</span>
            <span className="text-ink/50">Remaining: {formatCurrency(remainingBudget)}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4">
           <GoldButton className="gap-2 w-full sm:w-auto justify-center">
             <Calculator className="h-4 w-4" /> Open Mortgage Calculator
           </GoldButton>
           <GhostButton onClick={() => navigate(ROUTES.PROPERTIES)} className="gap-2 w-full sm:w-auto justify-center">
             <Home className="h-4 w-4" /> Browse Affordable Properties
           </GhostButton>
           <GhostButton className="gap-2 w-full sm:w-auto justify-center">
             <Phone className="h-4 w-4" /> Contact Financial Advisor
           </GhostButton>
        </div>
      </div>

      {/* Property Match */}
      {affordableProperties.length > 0 && (
        <div className="pt-4">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-heading text-xl font-bold text-cream">Properties Within Budget</h3>
            <button onClick={() => navigate(ROUTES.PROPERTIES)} className="flex items-center gap-1 text-sm font-semibold text-gold-400 hover:text-gold-300">
              View All <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {affordableProperties.map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
