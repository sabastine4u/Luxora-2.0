import { CheckCircle2 } from 'lucide-react';
import { Container, Section } from '../../../components/layout';
import type { ServiceData } from '../types';

export function BenefitsSection({ data }: { data: ServiceData }) {
  if (!data.benefits || data.benefits.length === 0) return null;

  return (
    <Section className="bg-navy-900 border-y border-white/5">
      <Container>
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-cream mb-4">
            Platform Benefits
          </h2>
          <p className="text-lg text-ink/70">
            Why industry leaders choose Luxora for {data.name.toLowerCase()}.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.benefits.map((benefit, idx) => (
            <div 
              key={idx} 
              className="flex items-start gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5"
            >
              <CheckCircle2 className="w-6 h-6 text-gold-400 shrink-0" />
              <p className="text-cream/90 font-medium leading-relaxed">{benefit}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
