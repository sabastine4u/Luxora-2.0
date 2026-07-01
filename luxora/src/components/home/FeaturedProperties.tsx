import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Reveal, SectionHeading, GoldButton } from '../ui/ui';
import { Section, Container } from '../layout';
import { properties } from '../../data/luxoraData';
import { PropertyCard } from '../property/PropertyCard';

export default function FeaturedProperties() {
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const toggleSave = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Section id="buy-property">
      <Container>
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              center={false}
              eyebrow="Featured Properties"
              title={<>Handpicked <span className="gold-text">verified listings</span></>}
              subtitle="Each property is inspected, documented, and rated by our verification team."
            />
            <GoldButton size="md" className="shrink-0">
              View All Properties <ArrowRight className="h-4 w-4" />
            </GoldButton>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 100}>
              <PropertyCard property={p} saved={saved.has(p.id)} onSave={() => toggleSave(p.id)} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
