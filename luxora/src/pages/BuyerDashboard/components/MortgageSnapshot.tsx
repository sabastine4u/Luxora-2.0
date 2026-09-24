import { Calculator, Home } from 'lucide-react';
import { formatCurrency } from '../../../utils';
import { GoldButton, GhostButton } from '../../../components/ui/ui';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

interface MortgageApplication {
  requestedLoanAmount: number;
  approvedLoanAmount: number | null;
  interestRate: number | null;
  loanTermYears: number | null;
  monthlyPayment: number | null;
  status: string;
}

interface MortgageSnapshotProps {
  application?: MortgageApplication;
  onStartApplication: () => void;
}

export default function MortgageSnapshot({
  application,
  onStartApplication,
}: MortgageSnapshotProps) {
  const navigate = useNavigate();

  if (!application) {
    return (
      <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md md:p-8">
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
                Track your real financing application and
                loan status.
              </p>
            </div>
          </div>

          <span className="self-start rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-semibold text-ink/50 md:self-center">
            No Active Application
          </span>
        </div>

        <div className="mt-8 rounded-2xl border border-white/5 bg-navy-900/50 p-6">
          <h4 className="font-heading text-lg font-semibold text-cream">
            Start your mortgage application
          </h4>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
            Choose a published Buy property, enter the amount
            you want to finance, and submit a real mortgage
            application. Your application will then appear
            here with its current status and financing details.
          </p>

          <GoldButton
            onClick={onStartApplication}
            className="mt-6 justify-center gap-2"
          >
            Start Mortgage Application
          </GoldButton>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <GhostButton
            onClick={() =>
              navigate(ROUTES.PROPERTIES)
            }
            className="w-full justify-center gap-2 sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Browse Properties
          </GhostButton>

          <GhostButton
            onClick={onStartApplication}
            className="w-full justify-center gap-2 sm:w-auto"
          >
            <Calculator className="h-4 w-4" />
            Open Financing Flow
          </GhostButton>
        </div>
      </div>
    );
  }

  const loanAmount =
    application.approvedLoanAmount ??
    application.requestedLoanAmount;

  const monthlyRate =
    application.interestRate != null
      ? application.interestRate / 100 / 12
      : 0;

  const totalPayments =
    application.loanTermYears
      ? application.loanTermYears * 12
      : 0;

  const estimatedMonthlyPayment =
    monthlyRate > 0 &&
    totalPayments > 0
      ? (loanAmount *
          monthlyRate *
          Math.pow(
            1 + monthlyRate,
            totalPayments,
          )) /
        (Math.pow(
          1 + monthlyRate,
          totalPayments,
        ) - 1)
      : 0;

  const monthlyPayment =
    application.monthlyPayment ??
    estimatedMonthlyPayment;

  const estimatedInterest =
    totalPayments > 0 &&
    monthlyPayment > 0
      ? Math.max(
          monthlyPayment *
            totalPayments -
            loanAmount,
          0,
        )
      : 0;

  const isEstimatedPayment =
    application.monthlyPayment == null;

  return (
    <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md md:p-8">
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
              Your latest financing application details.
            </p>
          </div>
        </div>

        <span className="self-start rounded-full border border-gold-400/20 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold text-gold-300 md:self-center">
          {application.status}
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="text-sm text-ink/60">
            {isEstimatedPayment
              ? 'Est. Monthly Payment'
              : 'Monthly Payment'}
          </div>

          <div className="mt-2 font-heading text-3xl font-bold text-gold-400">
            {monthlyPayment > 0
              ? formatCurrency(
                  Math.round(
                    monthlyPayment,
                  ),
                )
              : 'Not available'}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="text-sm text-ink/60">
            Loan Amount
          </div>

          <div className="mt-2 font-heading text-xl font-bold text-cream">
            {formatCurrency(
              loanAmount,
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="text-sm text-ink/60">
            Interest Rate
          </div>

          <div className="mt-2 font-heading text-xl font-bold text-cream">
            {application.interestRate != null
              ? `${application.interestRate}%`
              : 'Pending'}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
          <div className="text-sm text-ink/60">
            Loan Term
          </div>

          <div className="mt-2 font-heading text-xl font-bold text-cream">
            {application.loanTermYears
              ? `${application.loanTermYears} Years`
              : 'Pending'}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/5 bg-navy-900/50 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="font-heading text-lg font-semibold text-cream">
              Estimated Total Interest
            </h4>

            <p className="mt-1 text-sm text-ink/60">
              {isEstimatedPayment
                ? 'Estimated from the current application data. The lender payment becomes authoritative once supplied.'
                : 'Based on the monthly payment currently supplied by the lender.'}
            </p>
          </div>

          <div className="font-heading text-xl font-bold text-cream sm:text-right">
            {estimatedInterest > 0
              ? formatCurrency(
                  Math.round(
                    estimatedInterest,
                  ),
                )
              : 'Not available'}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <GhostButton
          onClick={() =>
            navigate(ROUTES.PROPERTIES)
          }
          className="w-full justify-center gap-2 sm:w-auto"
        >
          <Home className="h-4 w-4" />
          Browse Properties
        </GhostButton>

        <GhostButton
          onClick={onStartApplication}
          className="w-full justify-center gap-2 sm:w-auto"
        >
          <Calculator className="h-4 w-4" />
          Start New Application
        </GhostButton>
      </div>
    </div>
  );
}