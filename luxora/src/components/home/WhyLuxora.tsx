import { Reveal, SectionHeading } from '../ui/ui';
import { Section, Container } from '../layout';
import { pillars } from '../../data/uiData';

export default function WhyLuxora() {
  return (
    <Section className="overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-850/50 via-transparent to-navy-850/50" />
      <div className="absolute left-1/4 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-gold-400/5 blur-[100px]" />

      <Container className="relative">
        <Reveal>
          <SectionHeading
            eyebrow="Why Luxora"
            title={<>The platform built on <span className="gold-text">six pillars</span></>}
            subtitle="We're not just a listing site. We're a complete property ecosystem engineered for trust."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 100}>
              <div className="group relative h-full overflow-hidden rounded-2xl glass p-6 transition-all duration-300 hover:border-gold-400/30">
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gold-400/5 blur-2xl transition-opacity duration-300 group-hover:bg-gold-400/10" />
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-gold-400/20 bg-gold-400/10 text-gold-400">
                    <p.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-semibold text-cream">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-ink/60">{p.desc}</p>
                </div>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gold-gradient transition-all duration-500 group-hover:w-full" />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
