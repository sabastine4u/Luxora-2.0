import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Reveal, SectionHeading, GoldButton } from '../ui/ui';
import { Section, Container } from '../layout';
import { PropertyCard } from '../property/PropertyCard';
import { ROUTES } from '../../constants/routes';
import { propertyApi } from '../../api/property.api';
import { mapApiPropertiesToProperties } from '../../api/property.mapper';
import type { Property } from '../../types';

interface PropertyListResponse {
  properties?: unknown[];
  results?: unknown[];
  data?:
    | {
        properties?: unknown[];
        results?: unknown[];
      }
    | unknown[];
}

const featuredLevelRank: Record<string, number> = {
  Exclusive: 0,
  Premium: 1,
  Standard: 2,
};

export default function FeaturedProperties() {
  const navigate = useNavigate();

  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadFeaturedProperties = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = (await propertyApi.getProperties({
          availabilityStatus: 'Available',
          limit: 100,
          sort: 'newest',
        })) as PropertyListResponse;

        if (!mounted) return;

        const payload = response ?? {};

        const properties =
          payload.properties ??
          payload.results ??
          (Array.isArray(payload.data)
            ? payload.data
            : payload.data?.properties ??
              payload.data?.results ??
              []);

        const mappedProperties = mapApiPropertiesToProperties(
          properties,
        );

        const sortedProperties = [...mappedProperties]
          .sort((a, b) => {
            const featuredRankA =
              featuredLevelRank[a.featuredLevel ?? 'Standard'] ?? 2;

            const featuredRankB =
              featuredLevelRank[b.featuredLevel ?? 'Standard'] ?? 2;

            if (featuredRankA !== featuredRankB) {
              return featuredRankA - featuredRankB;
            }

            const dateA = a.createdAt
              ? new Date(a.createdAt).getTime()
              : 0;

            const dateB = b.createdAt
              ? new Date(b.createdAt).getTime()
              : 0;

            return dateB - dateA;
          })
          .slice(0, 6);

        setFeaturedProperties(sortedProperties);
      } catch (loadError) {
        console.error(
          'Failed to load homepage featured properties:',
          loadError,
        );

        if (!mounted) return;

        setError(
          'We could not load featured properties right now.',
        );
        setFeaturedProperties([]);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadFeaturedProperties();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Section id="buy-property">
      <Container>
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              center={false}
              eyebrow="Featured Properties"
              title={
                <>
                  Handpicked{' '}
                  <span className="gold-text">
                    verified listings
                  </span>
                </>
              }
              subtitle="Each property is inspected, documented, and rated by our verification team."
            />

            <GoldButton
              size="md"
              className="shrink-0"
              onClick={() => navigate(ROUTES.PROPERTIES)}
            >
              View All Properties
              <ArrowRight className="h-4 w-4" />
            </GoldButton>
          </div>
        </Reveal>

        {isLoading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl border border-white/10 bg-navy-800/50"
              >
                <div className="aspect-[4/3] animate-pulse bg-white/5" />

                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
                  <div className="h-5 w-1/3 animate-pulse rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-navy-800/50 px-6 py-12 text-center">
            <p className="text-sm text-ink/60">{error}</p>
          </div>
        ) : featuredProperties.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-navy-800/50 px-6 py-12 text-center">
            <p className="text-sm text-ink/60">
              No featured properties are available right now.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map((property, index) => (
              <Reveal
                key={property.id}
                delay={(index % 3) * 50}
              >
                <PropertyCard property={property} />
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}