import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reveal, SectionHeading } from '../ui/ui';
import { Section, Container } from '../layout';
import { ROUTES } from '../../constants/routes';
import { properties } from '../../data/luxoraData';

interface City {
  name: string;
  state: string;
  image: string;
  trending?: boolean;
}

export default function PopularCities() {
  const navigate = useNavigate();

  const cities = useMemo<City[]>(() => [
    { name: 'Lagos', state: 'Lagos State', image: 'https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?auto=compress&cs=tinysrgb&w=800', trending: true },
    { name: 'Abuja', state: 'Federal Capital Territory', image: 'https://images.pexels.com/photos/316093/pexels-photo-316093.jpeg?auto=compress&cs=tinysrgb&w=800', trending: true },
    { name: 'Lekki', state: 'Lagos State', image: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Ikoyi', state: 'Lagos State', image: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800', trending: true },
    { name: 'Port Harcourt', state: 'Rivers State', image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Anambra', state: 'Anambra State', image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800' }
  ], []);

  const listingCounts = useMemo(() => {
    return properties.reduce((acc, property) => {
      acc[property.city] = (acc[property.city] || 0) + 1;
      acc[property.state] = (acc[property.state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  const handleCityClick = (cityName: string, count: number) => {
    if (count === 0) return;
    
    const params = new URLSearchParams();
    params.append('location', cityName);
    navigate(`${ROUTES.PROPERTIES}?${params.toString()}`);
  };

  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Explore Locations"
            title={<>Browse by <br className="sm:hidden" /><span className="gold-text">Popular City</span></>}
            subtitle="Find luxury homes, apartments, commercial properties and investment opportunities across Nigeria's most desirable locations."
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city, i) => {
            const count = listingCounts[city.name] || 0;
            const countText = count === 1 ? '1 Listing' : `${count} Listings`;

            return (
              <Reveal key={city.name} delay={(i % 6) * 50}>
                <div
                  role="button"
                  tabIndex={count === 0 ? -1 : 0}
                  aria-disabled={count === 0 ? true : undefined}
                  aria-label={`View ${count === 0 ? 'no listings' : countText} in ${city.name}, ${city.state}`}
                  onClick={() => handleCityClick(city.name, count)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCityClick(city.name, count);
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
                    className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ${count > 0 ? 'group-hover:scale-110' : ''}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-navy-900/10" />

                  {/* Animated Gold Bottom Border on Hover */}
                  {count > 0 && (
                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-gold-400 transition-all duration-300 group-hover:w-full" />
                  )}

                  <div className="relative z-10 flex w-full items-end justify-between p-5">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-cream">{city.name}</h3>
                      <p className="mt-1 text-sm font-medium text-ink/70">{city.state}</p>
                      <p className="mt-2 text-xs font-semibold text-gold-300">{count === 0 ? 'Coming Soon' : countText}</p>
                    </div>
                    {city.trending && (
                      <div className={`inline-flex items-center rounded-full border border-gold-400/30 bg-gold-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-300 backdrop-blur-md ${count === 0 ? 'opacity-50' : ''}`}>
                        Trending
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
