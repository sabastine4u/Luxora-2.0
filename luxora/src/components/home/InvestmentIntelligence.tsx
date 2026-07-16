import { MapPin, ArrowUpRight } from 'lucide-react';
import { Reveal, SectionHeading } from '../ui/ui';
import { metrics, areas } from '../../data/uiData';
import { Section, Container } from '../layout';

export default function InvestmentIntelligence() {
  return (
    <Section className="overflow-hidden bg-navy-950">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-850/40 to-transparent" />
      <Container className="relative">
        <Reveal>
          <SectionHeading
            eyebrow="Investment Intelligence"
            title={<>Decide with <span className="gold-text">data, not guesswork</span></>}
            subtitle="Every property comes with an investment score, rental yield estimate, and area growth projection."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          {/* Dashboard preview */}
          <Reveal className="lg:col-span-3" delay={50}>
            <div className="glass h-full rounded-3xl p-6 md:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-cream">Market Analytics</h3>
                  <p className="text-xs text-ink/50">Live performance overview</p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live
                </div>
              </div>

              {/* Metric cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                {metrics.map((m) => (
                  <div key={m.label} className="rounded-2xl border border-white/10 bg-navy-900/40 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <m.icon className={`h-5 w-5 ${m.color}`} />
                      <span className="text-[10px] font-semibold text-emerald-400">{m.trend}</span>
                    </div>
                    <div className="font-heading text-2xl font-bold text-cream">
                      {m.value}<span className="text-sm text-ink/50">{m.suffix}</span>
                    </div>
                    <div className="text-xs text-ink/50">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-navy-900/40 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-ink/70">Price Trend (12 months)</span>
                  <span className="text-xs text-gold-300">+24.6% YoY</span>
                </div>
                <div className="flex h-32 items-end gap-1.5">
                  {[40, 48, 45, 55, 52, 62, 58, 68, 72, 70, 80, 88].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-gradient-to-t from-gold-600/40 to-gold-400 transition-all duration-500 hover:from-gold-500/60 hover:to-gold-300"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-ink/40">
                  {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Area breakdown */}
          <Reveal className="lg:col-span-2" delay={100}>
            <div className="h-full rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
              <div className="mb-5 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gold-400" />
                <h3 className="font-heading text-lg font-semibold text-cream">Top Performing Areas</h3>
              </div>
              <div className="space-y-3">
                {areas.map((a, i) => (
                  <div key={a.name} className="group rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-all hover:border-gold-400/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-ink/40">#{i + 1}</span>
                        <span className="text-sm font-semibold text-cream">{a.name}</span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-ink/30 transition-colors group-hover:text-gold-400" />
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-ink/40">Score </span>
                        <span className="font-semibold text-cream">{a.score}</span>
                      </div>
                      <div>
                        <span className="text-ink/40">Yield </span>
                        <span className="font-semibold text-gold-300">{a.yield}</span>
                      </div>
                      <div>
                        <span className="text-ink/40">Growth </span>
                        <span className="font-semibold text-emerald-400">{a.growth}</span>
                      </div>
                    </div>
                    {/* Score bar */}
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gold-gradient" style={{ width: `${a.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
