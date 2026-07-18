import { Container, Section } from '../../../components/layout';
import type { ServiceData } from '../types';
import * as Icons from 'lucide-react';

export function JourneySection({ data }: { data: ServiceData }) {
  if (!data.journey || data.journey.length === 0) return null;

  return (
    <Section className="bg-navy-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gold-gradient opacity-5" />
      <Container className="relative z-10">
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-cream mb-4">
            The Process
          </h2>
          <p className="text-lg text-ink/70">
            How we deliver the {data.name} experience.
          </p>
        </div>

        <div className="relative border-l-2 border-white/10 ml-6 md:ml-12 space-y-12">
          {data.journey.map((step, idx) => {
            const Icon = (Icons as unknown as Record<string, React.ElementType>)[step.icon] || Icons.Circle;

            return (


              <div key={idx} className="relative pl-10 md:pl-16">
                <div className="absolute -left-[21px] top-0 w-10 h-10 bg-navy-900 border-2 border-gold-400 rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-cream mb-2">
                    {step.title}
                  </h3>
                  <p className="text-ink/80 leading-relaxed max-w-2xl">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
