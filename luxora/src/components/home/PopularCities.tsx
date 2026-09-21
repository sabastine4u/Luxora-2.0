import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reveal, SectionHeading } from '../ui/ui';
import { Section, Container } from '../layout';
import { ROUTES } from '../../constants/routes';
import { propertyLocationApi } from '../../api/property-location.api';

interface PropertyLocation {
  city: string;
  state: string;
  listingCount: number;
}

interface CityCard {
  name: string;
  state: string;
  image: string;
  listingCount: number;
  trending?: boolean;
}

const cityCards = [
  {
    name: 'Lagos',
    state: 'Lagos State',
    image:
      'https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Abuja',
    state: 'Federal Capital Territory',
    image:
      'https://images.pexels.com/photos/316093/pexels-photo-316093.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Lekki',
    state: 'Lagos State',
    image:
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Ikoyi',
    state: 'Lagos State',
    image:
      'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Port Harcourt',
    state: 'Rivers State',
    image:
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Anambra',
    state: 'Anambra State',
    image:
      'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

function LocationGridSkeleton() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-64 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-lg animate-pulse"
        >
          <div className="h-full bg-white/[0.04]" />
        </div>
      ))}
    </div>
  );
}

export default function PopularCities() {
  const navigate = useNavigate();

  const [locations, setLocations] = useState<
    PropertyLocation[]
  >([]);

  const [loadingLocations, setLoadingLocations] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    const loadLocations = async () => {
      try {
        const response =
          await propertyLocationApi.getPropertyLocations();

        if (!mounted) return;

        setLocations(response.locations ?? []);
      } catch (error) {
        console.error(
          'Failed to load property locations:',
          error,
        );

        if (mounted) {
          setLocations([]);
        }
      } finally {
        if (mounted) {
          setLoadingLocations(false);
        }
      }
    };

    loadLocations();

    return () => {
      mounted = false;
    };
  }, []);

  const cities = useMemo<CityCard[]>(() => {
    const locationCountMap = new Map<
      string,
      PropertyLocation
    >();

    locations.forEach((location) => {
      locationCountMap.set(
        location.city.trim().toLowerCase(),
        location,
      );
    });

    const mappedCities = cityCards.map((city) => {
      const location = locationCountMap.get(
        city.name.trim().toLowerCase(),
      );

      return {
        ...city,
        listingCount:
          location?.listingCount ?? 0,
      };
    });

    const highestListingCount = Math.max(
      ...mappedCities.map(
        (city) => city.listingCount,
      ),
    );

    return mappedCities.map((city) => ({
      ...city,
      trending:
        highestListingCount > 0 &&
        city.listingCount === highestListingCount,
    }));
  }, [locations]);

  const handleCityClick = (
    cityName: string,
    count: number,
  ) => {
    if (count === 0) return;

    const params = new URLSearchParams();

    params.append('location', cityName);

    navigate(
      `${ROUTES.PROPERTIES}?${params.toString()}`,
    );
  };

  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Explore Locations"
            title={
              <>
                Browse by{' '}
                <br className="sm:hidden" />
                <span className="gold-text">
                  Popular City
                </span>
              </>
            }
            subtitle="Find luxury homes, apartments, commercial properties and investment opportunities across Nigeria's most desirable locations."
          />
        </Reveal>

        {loadingLocations ? (
          <LocationGridSkeleton />
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city, i) => {
              const count = city.listingCount;

              const countText =
                count === 1
                  ? '1 Listing'
                  : `${count} Listings`;

              return (
                <Reveal
                  key={`${city.name}-${city.state}`}
                  delay={(i % 6) * 50}
                >
                  <div
                    role="button"
                    tabIndex={count === 0 ? -1 : 0}
                    aria-disabled={
                      count === 0
                        ? true
                        : undefined
                    }
                    aria-label={`View ${
                      count === 0
                        ? 'no listings'
                        : countText
                    } in ${city.name}, ${city.state}`}
                    onClick={() =>
                      handleCityClick(
                        city.name,
                        count,
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === 'Enter' ||
                        e.key === ' '
                      ) {
                        e.preventDefault();

                        handleCityClick(
                          city.name,
                          count,
                        );
                      }
                    }}
                    className={`group relative flex h-64 w-full flex-col justify-end overflow-hidden rounded-2xl border border-white/10 text-left shadow-lg transition-all duration-300 ${
                      count === 0
                        ? 'cursor-default opacity-50'
                        : 'cursor-pointer hover:-translate-y-1 hover:border-gold-400/50 hover:shadow-lux focus:border-gold-400 focus:outline-none'
                    }`}
                  >
                    <img
                      src={city.image}
                      alt={city.name}
                      loading="lazy"
                      className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ${
                        count > 0
                          ? 'group-hover:scale-110'
                          : ''
                      }`}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-navy-900/10" />

                    {count > 0 && (
                      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gold-400 transition-all duration-300 group-hover:w-full" />
                    )}

                    <div className="relative z-10 flex w-full items-end justify-between p-5">
                      <div>
                        <h3 className="font-heading text-xl font-bold text-cream">
                          {city.name}
                        </h3>

                        <p className="mt-1 text-sm font-medium text-ink/70">
                          {city.state}
                        </p>

                        <p className="mt-2 text-xs font-semibold text-gold-300">
                          {count === 0
                            ? 'Coming Soon'
                            : countText}
                        </p>
                      </div>

                      {city.trending && (
                        <div
                          className={`inline-flex items-center rounded-full border border-gold-400/30 bg-gold-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-300 backdrop-blur-md ${
                            count === 0
                              ? 'opacity-50'
                              : ''
                          }`}
                        >
                          Trending
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </Container>
    </Section>
  );
}