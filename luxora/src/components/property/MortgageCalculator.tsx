import { useState } from 'react';
import { Calculator, Wallet, Percent, Calendar, PieChart, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { Property } from '../../data/luxoraData';
import { Slider } from '../ui/Slider';
import { formatCurrency } from '../../utils';

type MortgageCalculatorProps = {
  property: Property;
};

export function MortgageCalculator({ property }: MortgageCalculatorProps) {
  const initialPrice = property.priceValue;
  const [price, setPrice] = useState(initialPrice);
  const [depositPercent, setDepositPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(15);
  const [loanTerm, setLoanTerm] = useState(15);

  const deposit = price * (depositPercent / 100);
  const loanAmount = price - deposit;
  
  const r = (interestRate / 100) / 12;
  const n = loanTerm * 12;
  
  const monthlyPayment = loanAmount > 0 && r > 0
    ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    : loanAmount / n;

  const totalRepayment = monthlyPayment * n;
  const totalInterest = totalRepayment - loanAmount;

  // Mock Affordability Calculation (assuming buyer's monthly income is ~2% of the property value)
  const mockMonthlyIncome = initialPrice * 0.02;
  const dti = monthlyPayment / mockMonthlyIncome;
  
  let affordabilityLabel = 'High Risk';
  let affordabilityColor = 'text-red-400';
  let affordabilityBg = 'bg-red-400/10';
  let affordabilityBorder = 'border-red-400/20';

  if (dti <= 0.28) {
    affordabilityLabel = 'Excellent';
    affordabilityColor = 'text-emerald-400';
    affordabilityBg = 'bg-emerald-400/10';
    affordabilityBorder = 'border-emerald-400/20';
  } else if (dti <= 0.36) {
    affordabilityLabel = 'Good';
    affordabilityColor = 'text-blue-400';
    affordabilityBg = 'bg-blue-400/10';
    affordabilityBorder = 'border-blue-400/20';
  } else if (dti <= 0.43) {
    affordabilityLabel = 'Fair';
    affordabilityColor = 'text-gold-400';
    affordabilityBg = 'bg-gold-400/10';
    affordabilityBorder = 'border-gold-400/20';
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8 backdrop-blur-md">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
          <Calculator className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-heading text-xl font-semibold text-cream">Financial Calculator</h3>
          <p className="text-sm text-ink/50">Estimate your mortgage and view payment breakdown</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <Slider
            label="Purchase Price"
            value={price / 1_000_000}
            min={Math.floor((initialPrice * 0.5) / 1_000_000)}
            max={Math.floor((initialPrice * 2) / 1_000_000)}
            step={10}
            suffix="M"
            prefix="₦"
            onChange={(val) => setPrice(val * 1_000_000)}
          />
          <Slider
            label="Deposit"
            value={depositPercent}
            min={0}
            max={100}
            step={5}
            suffix="%"
            onChange={setDepositPercent}
          />
          <Slider
            label="Interest Rate"
            value={interestRate}
            min={1}
            max={30}
            step={0.5}
            suffix="%"
            onChange={setInterestRate}
          />
          <Slider
            label="Loan Term"
            value={loanTerm}
            min={5}
            max={30}
            step={1}
            suffix=" years"
            onChange={setLoanTerm}
          />
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex-1 rounded-2xl bg-navy-900/60 p-6 text-center border border-white/5 flex flex-col justify-center">
            <div className="text-sm text-ink/50 mb-2">Estimated Monthly Payment</div>
            <div className="font-heading text-4xl font-bold text-gold-300 mb-2">
              {formatCurrency(Math.round(monthlyPayment))}
            </div>
            <div className={`mx-auto mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${affordabilityBg} ${affordabilityColor} ${affordabilityBorder}`}>
               {dti <= 0.36 ? <ShieldCheck className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
               Affordability: {affordabilityLabel}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="rounded-xl border border-white/5 bg-navy-900/40 p-4 text-center">
               <div className="text-xs text-ink/50 mb-1">Loan Amount</div>
               <div className="text-sm font-semibold text-cream">{formatCurrency(Math.round(loanAmount))}</div>
             </div>
             <div className="rounded-xl border border-white/5 bg-navy-900/40 p-4 text-center">
               <div className="text-xs text-ink/50 mb-1">Total Interest</div>
               <div className="text-sm font-semibold text-cream">{formatCurrency(Math.round(totalInterest))}</div>
             </div>
             <div className="rounded-xl border border-white/5 bg-navy-900/40 p-4 col-span-2 text-center">
               <div className="text-xs text-ink/50 mb-1">Total Repayment</div>
               <div className="text-sm font-semibold text-cream">{formatCurrency(Math.round(totalRepayment))}</div>
             </div>
          </div>
        </div>
      </div>

      {/* Payment Snapshot */}
      {property.paymentSnapshot && (
        <div className="mt-10 pt-8 border-t border-white/5">
          <h4 className="font-heading text-lg font-semibold text-cream mb-6">Payment Snapshot</h4>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-navy-900/40 p-4 flex items-start gap-3">
              <Wallet className="h-5 w-5 text-gold-400 mt-0.5" />
              <div>
                <div className="text-xs text-ink/50 uppercase tracking-wider mb-1">Purchase Price</div>
                <div className="font-semibold text-cream">{property.price}</div>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-navy-900/40 p-4 flex items-start gap-3">
              <PieChart className="h-5 w-5 text-gold-400 mt-0.5" />
              <div>
                <div className="text-xs text-ink/50 uppercase tracking-wider mb-1">Deposit</div>
                <div className="font-semibold text-cream">{property.paymentSnapshot.deposit}</div>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-navy-900/40 p-4 flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gold-400 mt-0.5" />
              <div>
                <div className="text-xs text-ink/50 uppercase tracking-wider mb-1">Service Charge</div>
                <div className="font-semibold text-cream">{property.paymentSnapshot.serviceCharge}</div>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-navy-900/40 p-4 flex items-start gap-3">
              <Percent className="h-5 w-5 text-gold-400 mt-0.5" />
              <div>
                <div className="text-xs text-ink/50 uppercase tracking-wider mb-1">Agency Fee</div>
                <div className="font-semibold text-cream">{property.paymentSnapshot.agencyFee}</div>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-navy-900/40 p-4 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-gold-400 mt-0.5" />
              <div>
                <div className="text-xs text-ink/50 uppercase tracking-wider mb-1">Legal Fee</div>
                <div className="font-semibold text-cream">{property.paymentSnapshot.legalFee}</div>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-navy-900/40 p-4 flex items-start gap-3">
              <Calculator className="h-5 w-5 text-gold-400 mt-0.5" />
              <div>
                <div className="text-xs text-ink/50 uppercase tracking-wider mb-1">Price per sqm</div>
                <div className="font-semibold text-cream">{property.paymentSnapshot.pricePerSqm}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
