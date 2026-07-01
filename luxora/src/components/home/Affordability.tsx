import { useState } from 'react';
import { Calculator, TrendingDown, Calendar, ArrowRight, Check } from 'lucide-react';
import { Reveal, SectionHeading, GoldButton } from '../ui/ui';
import { Slider } from '../ui/Slider';
import { formatCurrency, calculateMortgage } from '../../utils';
import { plans } from '../../data/uiData';
import { Section, Container } from '../layout';

export default function Affordability() {
  const [price, setPrice] = useState(120);
  const [down, setDown] = useState(20);
  const [months, setMonths] = useState(36);

  const { monthly } = calculateMortgage(price, down, months);

  return (
    <Section id="services" className="overflow-hidden">
      <div className="absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-gold-400/5 blur-[100px]" />
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Affordability"
            title={<>Make luxury <span className="gold-text">affordable</span></>}
            subtitle="Flexible mortgage and payment plans designed around your budget. See exactly what you'll pay — no hidden fees."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          {/* Calculator */}
          <Reveal className="lg:col-span-3" delay={100}>
            <div className="glass h-full rounded-3xl p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-cream">Mortgage Calculator</h3>
                  <p className="text-xs text-ink/50">Adjust to see your monthly payment</p>
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-6">
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
                  min={0}
                  max={50}
                  step={5}
                  suffix="%"
                  onChange={setDown}
                />

                {/* Term selector */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-ink/70">Payment Term</span>
                    <span className="text-sm font-semibold text-cream">{months} months</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[12, 24, 36, 60].map((m) => (
                      <button
                        key={m}
                        onClick={() => setMonths(m)}
                        className={`rounded-xl border py-2.5 text-sm font-medium transition-all ${
                          months === m
                            ? 'border-gold-400/50 bg-gold-400/10 text-gold-200'
                            : 'border-white/10 bg-white/5 text-ink/60 hover:border-white/20'
                        }`}
                      >
                        {m}mo
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Result */}
              <div className="mt-8 rounded-2xl border border-gold-400/20 bg-gradient-to-br from-gold-400/10 to-transparent p-6">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-300">
                  <TrendingDown className="h-3.5 w-3.5" />
                  Estimated Monthly Payment
                </div>
                <div className="mt-2 font-heading text-4xl font-bold text-cream md:text-5xl">
                  {formatCurrency(monthly)}
                </div>
                <div className="mt-2 text-sm text-ink/50">
                  on a {formatCurrency(price * 1_000_000)} property with {down}% down
                </div>
              </div>
            </div>
          </Reveal>

          {/* Payment plans + example */}
          <Reveal className="lg:col-span-2" delay={200}>
            <div className="flex h-full flex-col gap-4">
              {/* Example card */}
              <div className="relative overflow-hidden rounded-3xl border border-gold-400/30 bg-gradient-to-br from-navy-800 to-navy-850 p-6">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold-400/10 blur-2xl" />
                <div className="relative">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gold-300">Featured Example</div>
                  <div className="font-heading text-2xl font-bold text-cream">₦120M Property</div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-sm text-ink/50">From</span>
                    <span className="font-heading text-3xl font-bold gold-text">₦850,000</span>
                    <span className="text-sm text-ink/50">/month</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['No hidden fees', 'Flexible terms', 'Verified title'].map((t) => (
                      <span key={t} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink/70">
                        <Check className="h-3 w-3 text-gold-400" /> {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Plans list */}
              <div className="flex-1 rounded-3xl border border-white/10 bg-navy-800/50 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gold-400" />
                  <h3 className="font-heading text-sm font-semibold text-cream">Payment Plan Options</h3>
                </div>
                <div className="space-y-2">
                  {plans.map((p) => (
                    <div key={p.name} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-3 transition-colors hover:border-gold-400/20">
                      <div>
                        <div className="text-sm font-medium text-cream">{p.name}</div>
                        <div className="text-xs text-ink/50">{p.desc}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gold-300">{p.rate}</div>
                        <div className="text-[10px] uppercase tracking-wider text-ink/40">APR</div>
                      </div>
                    </div>
                  ))}
                </div>
                <GoldButton size="sm" className="mt-4 w-full">
                  Get Pre-Approved <ArrowRight className="h-3.5 w-3.5" />
                </GoldButton>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
