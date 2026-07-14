import { Star, ArrowRight, Award } from 'lucide-react';
import { Reveal, SectionHeading, GoldButton } from '../ui/ui';
import { Section, Container } from '../layout';
import { agencies, agentPerformance } from '../../data/luxoraData';
import { AgencyCard } from '../agency/AgencyCard';
import { AgentCard } from '../agent/AgentCard';

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
                  <AgencyCard key={a.name} agency={a} index={i} />
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
                  <AgentCard key={a.name} agent={a} index={i} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
