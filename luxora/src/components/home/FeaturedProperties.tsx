import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Reveal, SectionHeading, GoldButton } from '../ui/ui';
import { Section, Container } from '../layout';
import { properties } from '../../data/luxoraData';
import { PropertyCard } from '../property/PropertyCard';
import { ROUTES } from '../../constants/routes';

export default function FeaturedProperties() {
  const navigate = useNavigate();

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
            <GoldButton size="md" className="shrink-0" onClick={() => navigate(ROUTES.PROPERTIES)}>
              View All Properties <ArrowRight className="h-4 w-4" />
            </GoldButton>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.slice(0, 6).map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 50}>
              <PropertyCard property={p} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
