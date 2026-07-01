import { Star, TrendingUp, ArrowRight, Award } from 'lucide-react';
import { Reveal, SectionHeading, GoldButton } from '../ui/ui';
import { Section, Container } from '../layout';
import { agencies, agentPerformance } from '../../data/luxoraData';

export default function AgencySpotlight() {
  return (
    <Section id="agencies" className="overflow-hidden">
      <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-blue-500/5 blur-[100px]" />
      <Container>
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              center={false}
              eyebrow="Agency Spotlight"
              title={<>Top <span className="gold-text">agencies & agents</span></>}
              subtitle="Work with the highest-rated agencies and most productive agents on the platform."
            />
            <GoldButton size="md" className="shrink-0">
              Become a Partner <ArrowRight className="h-4 w-4" />
            </GoldButton>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Agencies */}
          <Reveal>
            <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
              <div className="mb-5 flex items-center gap-2">
                <Award className="h-5 w-5 text-gold-400" />
                <h3 className="font-heading text-lg font-semibold text-cream">Top Agencies</h3>
              </div>
              <div className="space-y-3">
                {agencies.map((a, i) => (
                  <div
                    key={a.name}
                    className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-all hover:border-gold-400/20 hover:bg-white/[0.06]"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${a.color} text-xl font-bold text-white`}>
                      {a.logo}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-sm font-semibold text-cream">{a.name}</span>
                        {i === 0 && (
                          <span className="rounded-full bg-gold-400/15 px-2 py-0.5 text-[10px] font-semibold text-gold-300">#1</span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-ink/50">
                        <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-gold-400 text-gold-400" /> {a.rating}</span>
                        <span>{a.listings} listings</span>
                        <span>{a.deals} deals</span>
                      </div>
                    </div>
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Agents */}
          <Reveal delay={100}>
            <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
              <div className="mb-5 flex items-center gap-2">
                <Star className="h-5 w-5 text-gold-400" />
                <h3 className="font-heading text-lg font-semibold text-cream">Top Agents</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {agentPerformance.map((a, i) => (
                  <div
                    key={a.name}
                    className="group rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-all hover:border-gold-400/20 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={a.avatar} alt={a.name} className="h-12 w-12 rounded-full object-cover" />
                        {i === 0 && (
                          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-gradient text-[10px] font-bold text-navy-900">
                            1
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-cream">{a.name}</div>
                        <div className="truncate text-xs text-ink/50">{a.agency}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                      <div>
                        <div className="font-heading text-lg font-bold text-cream">{a.deals}</div>
                        <div className="text-[10px] uppercase tracking-wider text-ink/40">Deals</div>
                      </div>
                      <div className="text-right">
                        <div className="font-heading text-lg font-bold gold-text">{a.value}</div>
                        <div className="text-[10px] uppercase tracking-wider text-ink/40">Volume</div>
                      </div>
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
