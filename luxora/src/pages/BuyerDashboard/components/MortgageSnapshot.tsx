import { Calculator, Home, Phone } from 'lucide-react';
import { formatCurrency } from '../../../utils';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

// Describe the mortgage application data supplied by MortgageTracker.
interface MortgageApplication {
  requestedLoanAmount: number;
  approvedLoanAmount: number | null;
  interestRate: number | null;
  loanTermYears: number | null;
  monthlyPayment: number | null;
  status: string;
}

// Accept the active mortgage application from the parent component.
interface MortgageSnapshotProps {
  application?: MortgageApplication;
}

export default function MortgageSnapshot({
  application,
}: MortgageSnapshotProps) {
  const navigate = useNavigate();

  // Show an honest empty state when the Buyer has no active mortgage application.
  if (!application) {
    return (
      <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8 backdrop-blur-md">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
              <Calculator className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-cream">
                Mortgage Snapshot
              </h3>

              <p className="text-sm text-ink/60">
                Your current estimated financing capability
              </p>
            </div>
          </div>

          <span className="self-start rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-semibold text-ink/50 md:self-center">
            No Active Application
          </span>
        </div>

        <div className="mt-8 rounded-2xl border border-white/5 bg-navy-900/50 p-6">
          <h4 className="font-heading text-lg font-semibold text-cream">
            Your mortgage snapshot will appear here
          </h4>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
            Submit a mortgage application to start tracking your financing,
            payment details, interest rate, loan term, and application status.
          </p>
        </div>

        {/* Keep the useful Buyer actions available even without an application. */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <GoldButton
            onClick={() => navigate(ROUTES.PROPERTIES)}
            className="w-full justify-center gap-2 sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Browse Properties
          </GoldButton>

          <GhostButton className="w-full justify-center gap-2 sm:w-auto">
            <Calculator className="h-4 w-4" />
            Mortgage Calculator
          </GhostButton>

          <GhostButton className="w-full justify-center gap-2 sm:w-auto">
            <Phone className="h-4 w-4" />
            Contact Financial Advisor
          </GhostButton>
        </div>
      </div>
    );
  }

  // Prefer the approved loan amount when one exists.
  const loanAmount =
    application.approvedLoanAmount ?? application.requestedLoanAmount;

  // Convert the annual interest rate into the monthly decimal rate used by the formula.
  const monthlyRate =
    application.interestRate != null
      ? application.interestRate / 100 / 12
      : 0;

  // Convert the loan term from years into the total number of monthly payments.
  const totalPayments = application.loanTermYears
    ? application.loanTermYears * 12
    : 0;

  // Calculate an estimated payment when the lender has not supplied an official payment.
  const estimatedMonthlyPayment =
    monthlyRate > 0 && totalPayments > 0
      ? (loanAmount *
        monthlyRate *
        Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1)
      : 0;

  // Prefer the official lender payment when available, otherwise use our estimate.
  const monthlyPayment =
    application.monthlyPayment ?? estimatedMonthlyPayment;

  // Calculate estimated total interest using the payment and loan duration.
  const estimatedInterest =
    totalPayments > 0 && monthlyPayment > 0
      ? Math.max(monthlyPayment * totalPayments - loanAmount, 0)
      : 0;

  // Track whether the displayed payment is an estimate rather than an official lender figure.
  const isEstimatedPayment = application.monthlyPayment == null;

  return (
    <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8 backdrop-blur-md">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
            <Calculator className="h-6 w-6" />
          </div>

          <div>
            <h3 className="font-heading text-xl font-bold text-cream">
              Mortgage Snapshot
            </h3>

            <p className="text-sm text-ink/60">
              Your current estimated financing capability
            </p>
          </div>
        </div>

        <span className="self-start rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 md:self-center">
          {application.status}
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="text-sm text-ink/60">
            {isEstimatedPayment ? 'Est. Monthly Payment' : 'Monthly Payment'}
          </div>
          <div className="mt-2 font-heading text-3xl font-bold text-gold-400">
           {monthlyPayment > 0
  ? formatCurrency(Math.round(monthlyPayment))
  : 'Not available'}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="text-sm text-ink/60">Loan Amount</div>

          <div className="mt-2 font-heading text-xl font-bold text-cream">
            {formatCurrency(loanAmount)}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="text-sm text-ink/60">Interest Rate</div>

          <div className="mt-2 font-heading text-xl font-bold text-cream">
            {application.interestRate != null
              ? `${application.interestRate}%`
              : 'Not set'}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="text-sm text-ink/60">Loan Term</div>

          <div className="mt-2 font-heading text-xl font-bold text-cream">
            {application.loanTermYears
              ? `${application.loanTermYears} Years`
              : 'Not set'}
          </div>
        </div>
      </div>

      {/* Show estimated interest only when the backend has enough data to calculate it. */}
      <div className="mt-8 rounded-2xl border border-white/5 bg-navy-900/50 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
           <h4 className="font-heading text-lg font-semibold text-cream">
  Est. Total Interest
</h4>

           <p className="mt-1 text-sm text-ink/60">
  Based on your current mortgage application details.
  {isEstimatedPayment && ' This is an estimate until your lender provides an official payment.'}
</p>
          </div>

          <div className="text-right font-heading text-xl font-bold text-cream">
           {estimatedInterest > 0
  ? formatCurrency(Math.round(estimatedInterest))
  : 'Not available'}
          </div>
        </div>
      </div>

      {/* Keep the main Buyer actions available for an active application. */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <GhostButton
          onClick={() => navigate(ROUTES.PROPERTIES)}
          className="w-full justify-center gap-2 sm:w-auto"
        >
          <Home className="h-4 w-4" />
          Browse Properties
        </GhostButton>

        <GhostButton className="w-full justify-center gap-2 sm:w-auto">
          <Calculator className="h-4 w-4" />
          Mortgage Calculator
        </GhostButton>

        <GhostButton className="w-full justify-center gap-2 sm:w-auto">
          <Phone className="h-4 w-4" />
          Contact Financial Advisor
        </GhostButton>
      </div>
    </div>
  );
}