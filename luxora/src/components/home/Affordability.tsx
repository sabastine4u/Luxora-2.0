import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Calculator,
  Check,
  Home,
  TrendingDown,
  Wallet,
  Calendar,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Reveal, SectionHeading, GoldButton } from '../ui/ui';
import { Slider } from '../ui/Slider';
import { formatCurrency, calculateMortgage } from '../../utils';
import { Section, Container } from '../layout';
import { ROUTES } from '../../constants/routes';

const RATE_BY_TERM: Record<number, number> = {
  12: 0.085,
  24: 0.11,
  36: 0.135,
  60: 0.16,
};

const PLANNING_DTI = 0.36;

const calculateMaxLoanFromPayment = (
  monthlyPayment: number,
  annualRate: number,
  months: number,
) => {
  if (monthlyPayment <= 0 || months <= 0) {
    return 0;
  }

  const monthlyRate = annualRate / 12;

  if (monthlyRate === 0) {
    return monthlyPayment * months;
  }

  return (
    monthlyPayment *
    (1 - Math.pow(1 + monthlyRate, -months)) /
    monthlyRate
  );
};

export default function Affordability() {
  const navigate = useNavigate();

  const [price, setPrice] = useState(120);
  const [down, setDown] = useState(20);
  const [months, setMonths] = useState(36);
  const [monthlyIncome, setMonthlyIncome] = useState(5_000_000);
  const [monthlyDebt, setMonthlyDebt] = useState(0);

  const { monthly } = calculateMortgage(
    price,
    down,
    months,
  );

  const affordability = useMemo(() => {
    const annualRate =
      RATE_BY_TERM[months] ?? 0.135;

    const maximumTotalDebt =
      monthlyIncome * PLANNING_DTI;

    const maximumHousingPayment = Math.max(
      maximumTotalDebt - monthlyDebt,
      0,
    );

    const maximumLoan =
      calculateMaxLoanFromPayment(
        maximumHousingPayment,
        annualRate,
        months,
      );

    const maximumPropertyPrice =
      down >= 100
        ? 0
        : maximumLoan / (1 - down / 100);

    const depositRequired =
      maximumPropertyPrice * (down / 100);

    const withinTarget =
      monthly <= maximumHousingPayment;

    const closeToTarget =
      monthly > maximumHousingPayment &&
      monthly <= maximumHousingPayment * 1.1;

    return {
      annualRate,
      maximumHousingPayment,
      maximumPropertyPrice,
      depositRequired,
      withinTarget,
      closeToTarget,
    };
  }, [
    down,
    monthlyDebt,
    monthlyIncome,
    months,
    monthly,
  ]);

  const affordabilityLabel =
    affordability.withinTarget
      ? 'Within your planning target'
      : affordability.closeToTarget
        ? 'Close to your planning target'
        : 'Above your planning target';

  const affordabilityTone =
    affordability.withinTarget
      ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
      : affordability.closeToTarget
        ? 'border-gold-400/20 bg-gold-400/10 text-gold-300'
        : 'border-rose-400/20 bg-rose-400/10 text-rose-300';

  const handleExploreProperties = () => {
    navigate(
      `${ROUTES.PROPERTIES}?listingType=buy`,
    );
  };

  return (
    <Section
      id="affordability"
      className="overflow-hidden"
    >
      <div className="absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-gold-400/5 blur-[100px]" />

      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Affordability"
            title={
              <>
                Know what you can{' '}
                <span className="gold-text">
                  comfortably afford
                </span>
              </>
            }
            subtitle="Use your income, existing debt, deposit, and payment term to build an illustrative property budget before you start viewing homes."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          {/* Calculator */}
          <Reveal
            className="lg:col-span-3"
            delay={50}
          >
            <div className="glass h-full rounded-3xl p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
                  <Calculator className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-heading text-lg font-semibold text-cream">
                    Affordability Calculator
                  </h3>

                  <p className="text-xs text-ink/50">
                    Adjust the numbers to build your
                    planning range
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink/70">
                      Monthly Income
                    </span>

                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink/40">
                        ₦
                      </span>

                      <input
                        type="number"
                        min="0"
                        step="50000"
                        value={monthlyIncome}
                        onChange={(event) =>
                          setMonthlyIncome(
                            Math.max(
                              Number(
                                event.target.value,
                              ) || 0,
                              0,
                            ),
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-8 pr-3 text-sm text-cream outline-none transition-colors focus:border-gold-400/40"
                        aria-label="Monthly income"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink/70">
                      Monthly Debt Payments
                    </span>

                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink/40">
                        ₦
                      </span>

                      <input
                        type="number"
                        min="0"
                        step="50000"
                        value={monthlyDebt}
                        onChange={(event) =>
                          setMonthlyDebt(
                            Math.max(
                              Number(
                                event.target.value,
                              ) || 0,
                              0,
                            ),
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-8 pr-3 text-sm text-cream outline-none transition-colors focus:border-gold-400/40"
                        aria-label="Monthly debt payments"
                      />
                    </div>
                  </label>
                </div>

                <Slider
                  label="Property Price"
                  value={price}
                  min={20}
                  max={700}
                  step={5}
                  suffix="M"
                  prefix="₦"
                  onChange={setPrice}
                />

                <Slider
                  label="Down Payment"
                  value={down}
                  min={5}
                  max={80}
                  step={5}
                  suffix="%"
                  onChange={setDown}
                />

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-ink/70">
                      Payment Term
                    </span>

                    <span className="text-sm font-semibold text-cream">
                      {months} months
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[12, 24, 36, 60].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() =>
                          setMonths(m)
                        }
                        className={`rounded-xl border py-2.5 text-sm font-medium transition-all ${
                          months === m
                            ? 'border-gold-400/50 bg-gold-400/10 text-gold-200'
                            : 'border-white/10 bg-white/5 text-ink/60 hover:border-white/20 hover:text-cream'
                        }`}
                      >
                        {m}mo
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-gold-400/20 bg-gradient-to-br from-gold-400/10 to-transparent p-6">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-300">
                  <TrendingDown className="h-3.5 w-3.5" />

                  Estimated Monthly Payment
                </div>

                <div className="mt-2 font-heading text-4xl font-bold text-cream md:text-5xl">
                  {formatCurrency(monthly)}
                </div>

                <div className="mt-2 text-sm text-ink/50">
                  on a{' '}
                  {formatCurrency(
                    price * 1_000_000,
                  )}{' '}
                  property with {down}% down
                </div>

                <div
                  className={`mt-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${affordabilityTone}`}
                >
                  {affordabilityLabel}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-xs leading-relaxed text-ink/50">
                This is a planning estimate, not a
                lender approval. The calculation uses a
                36% total-debt planning target; actual
                lender criteria, rates, fees, and
                approval requirements may differ.
              </div>
            </div>
          </Reveal>

          {/* Affordability summary + next steps */}
          <Reveal
            className="lg:col-span-2"
            delay={100}
          >
            <div className="flex h-full flex-col gap-4">
              <div className="relative overflow-hidden rounded-3xl border border-gold-400/30 bg-gradient-to-br from-navy-800 to-navy-850 p-6">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold-400/10 blur-2xl" />

                <div className="relative">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gold-300">
                    Your Planning Range
                  </div>

                  <div className="font-heading text-3xl font-bold text-cream">
                    {formatCurrency(
                      Math.round(
                        affordability.maximumPropertyPrice,
                      ),
                    )}
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-ink/50">
                    Estimated maximum property price
                    based on the figures you entered.
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-ink/40">
                        Housing Target
                      </div>

                      <div className="mt-1 text-sm font-semibold text-gold-300">
                        {formatCurrency(
                          Math.round(
                            affordability.maximumHousingPayment,
                          ),
                        )}
                        /mo
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-ink/40">
                        Estimated Deposit
                      </div>

                      <div className="mt-1 text-sm font-semibold text-gold-300">
                        {formatCurrency(
                          Math.round(
                            affordability.depositRequired,
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {[
                      'Illustrative estimate',
                      `${
                        Math.round(
                          affordability.annualRate *
                            1000,
                        ) / 10
                      }% rate`,
                      `${months} month term`,
                    ].map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink/70"
                      >
                        <Check className="h-3 w-3 text-gold-400" />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1 rounded-3xl border border-white/10 bg-navy-800/50 p-6">
                <div className="mb-5 flex items-center gap-2">
                  <Home className="h-4 w-4 text-gold-400" />

                  <h3 className="font-heading text-sm font-semibold text-cream">
                    What to do next
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />

                    <div>
                      <div className="text-sm font-medium text-cream">
                        Explore available properties
                      </div>

                      <div className="text-xs text-ink/50">
                        Browse verified Buy listings
                        after reviewing your planning
                        range.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />

                    <div>
                      <div className="text-sm font-medium text-cream">
                        Review mortgage options
                      </div>

                      <div className="text-xs text-ink/50">
                        Learn about Luxora&apos;s
                        mortgage assistance and
                        application flow.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <GoldButton
                    size="sm"
                    className="w-full justify-center"
                    onClick={
                      handleExploreProperties
                    }
                  >
                    Explore Properties{' '}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </GoldButton>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        ROUTES.SERVICE_MORTGAGE,
                      )
                    }
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-white/10 px-4 text-sm font-semibold text-ink/80 transition-colors hover:border-gold-400/30 hover:text-cream"
                  >
                    Mortgage Assistance
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}