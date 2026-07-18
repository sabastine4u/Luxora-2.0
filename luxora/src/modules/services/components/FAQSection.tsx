import { ChevronDown, HelpCircle } from 'lucide-react';
import { Container, Section } from '../../../components/layout';
import type { ServiceData } from '../types';

export function FAQSection({ data }: { data: ServiceData }) {
  if (!data.faqs || data.faqs.length === 0) return null;

  return (
    <Section className="bg-navy-950 border-t border-white/5 pb-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-cream mb-4 flex items-center justify-center gap-3">
              <HelpCircle className="h-8 w-8 text-gold-400" />
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-ink/70">
              Find answers to common questions about {data.name}.
            </p>
          </div>

          <div className="space-y-4">
            {data.faqs.map((faq, i) => (
              <details 
                key={i} 
                className="group rounded-2xl border border-white/10 bg-navy-800/30 p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer"
              >
                <summary className="flex items-center justify-between font-semibold text-cream text-lg">
                  {faq.question}
                  <ChevronDown className="h-5 w-5 text-ink/50 transition-transform group-open:rotate-180 shrink-0 ml-4" />
                </summary>
                <p className="mt-4 text-ink/70 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
