import { ArrowUpRight } from 'lucide-react';
import { Reveal, SectionHeading } from '../ui/ui';
import { Section, Container } from '../layout';
import { services } from '../../data/uiData';

export default function ServicesEcosystem() {
  return (
    <Section id="services">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Services Ecosystem"
            title={<>Everything property, <span className="gold-text">in one place</span></>}
            subtitle="Beyond listings — a full suite of services that cover the entire property lifecycle."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 100} className={i === 0 ? 'lg:col-span-2' : ''}>
              <div className={`group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-navy-800/50 p-7 transition-all duration-300 hover:border-gold-400/30 hover:bg-navy-800/80 ${i === 0 ? 'lg:flex lg:items-center lg:gap-8' : ''}`}>
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold-400/5 blur-2xl transition-opacity duration-300 group-hover:bg-gold-400/10" />
                <div className="relative flex-1">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-400/20 bg-gold-400/10 text-gold-400">
                      <s.icon className="h-7 w-7" />
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink/60">
                      {s.tag}
                    </span>
                  </div>
                  <h3 className="mb-2 font-heading text-xl font-semibold text-cream">{s.title}</h3>
                  <p className={`text-sm leading-relaxed text-ink/60 ${i === 0 ? 'max-w-md' : ''}`}>{s.desc}</p>
                </div>
                <button className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300 transition-colors hover:text-gold-200 lg:mt-0">
                  Explore service <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
