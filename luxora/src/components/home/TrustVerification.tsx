import { CheckCircle2 } from 'lucide-react';
import { Reveal, SectionHeading } from '../ui/ui';
import { Section, Container } from '../layout';
import { badges } from '../../data/uiData';

export default function TrustVerification() {
  return (
    <Section id="about">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Trust & Verification"
            title={<>Every property passes a <span className="gold-text">4-layer verification</span></>}
            subtitle="We do the due diligence so you don't have to. No hidden defects, no fake listings, no surprises."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((b, i) => (
            <Reveal key={b.title} delay={i * 100}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-navy-800/50 p-6 transition-all duration-300 hover:border-gold-400/30 hover:bg-navy-800/80">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold-400/5 blur-2xl transition-opacity duration-300 group-hover:bg-gold-400/10" />
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-gold-400/20 bg-gold-400/10 text-gold-400">
                    {b.icon}
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-gold-400" />
                    <h3 className="font-heading text-base font-semibold text-cream">{b.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-ink/60">{b.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
