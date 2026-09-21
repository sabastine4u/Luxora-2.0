import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Home,
  DoorOpen,
  BedDouble,
  DoorClosed,
  Key,
  GraduationCap,
  Home as HouseIcon,
  Trees,
  Warehouse,
  Briefcase,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Reveal, SectionHeading } from '../ui/ui';
import { Section, Container } from '../layout';
import { propertyTypes } from '../../data/uiData';
import { propertyCategoryApi } from '../../api/property-category.api';
import { ROUTES } from '../../constants/routes';

const iconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Building2,
  Home,
  DoorOpen,
  BedDouble,
  DoorClosed,
  Key,
  GraduationCap,
  House: HouseIcon,
  Trees,
  Warehouse,
  Briefcase,
};

const categoryImages: Record<string, string> = {
  Apartment:
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80',
  Duplex:
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
  Studio:
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
  'Mini Flat':
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
  'Self Contain':
    'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=900&q=80',
  'Short Let':
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
  'Student Housing':
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80',
  'Affordable Rental':
    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=900&q=80',
  'Family House':
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
  Land:
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80',
  Warehouse:
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80',
  'Office Space':
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80',
};

const categoryIcons: Record<string, string> = {
  Apartment: 'Building2',
  Duplex: 'Home',
  Studio: 'DoorOpen',
  'Mini Flat': 'BedDouble',
  'Self Contain': 'DoorClosed',
  'Short Let': 'Key',
  'Student Housing': 'GraduationCap',
  'Affordable Rental': 'House',
  'Family House': 'Home',
  Land: 'Trees',
  Warehouse: 'Warehouse',
  'Office Space': 'Briefcase',
};

interface PropertyCategory {
  name: string;
  key: string;
  sortOrder: number;
  listingCount: number;
}

export default function PropertyCategories() {
  const navigate = useNavigate();

  const [listingCounts, setListingCounts] = useState<
    Record<string, number>
  >({});

  const [loadingCounts, setLoadingCounts] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      try {
        const response =
          await propertyCategoryApi.getPropertyCategories();

        if (!mounted) return;

        const categories: PropertyCategory[] =
          response.categories ?? [];

        const counts = categories.reduce(
          (
            acc: Record<string, number>,
            category: PropertyCategory,
          ) => {
            acc[category.name] = category.listingCount;

            return acc;
          },
          {},
        );

        setListingCounts(counts);
      } catch (error) {
        console.error(
          'Failed to load property category counts:',
          error,
        );
      } finally {
        if (mounted) {
          setLoadingCounts(false);
        }
      }
    };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  // "Any Type" is a search filter, not a property category card.
  const categories = useMemo(() => {
    return propertyTypes
      .filter((type) => type !== 'Any Type')
      .map((type) => ({
        id: type,
        propertyType: type,
        label: type,
        icon: categoryIcons[type] ?? 'Building2',
        image:
          categoryImages[type] ?? categoryImages.Apartment,
      }));
  }, []);

  return (
    <Section id="rent">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Property Categories"
            title={
              <>
                Browse by{' '}
                <span className="gold-text">
                  property type
                </span>
              </>
            }
            subtitle="From luxury penthouses to student housing — find exactly what you're looking for."
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat, i) => {
            const count =
              listingCounts[cat.propertyType] || 0;

            const countText = loadingCounts
              ? 'Loading...'
              : count === 1
                ? '1 Listing'
                : `${count} Listings`;

            const Icon =
              iconMap[cat.icon] ?? Building2;

            return (
              <Reveal
                key={cat.id}
                delay={(i % 12) * 50}
              >
                <button
                  onClick={() => {
                    if (loadingCounts || count === 0) {
                      return;
                    }

                    const params = new URLSearchParams();

                    params.append(
                      'propertyType',
                      cat.propertyType,
                    );

                    navigate(
                      `${ROUTES.PROPERTIES}?${params.toString()}`,
                    );
                  }}
                  className={`group relative flex h-52 w-full flex-col justify-end overflow-hidden rounded-2xl border border-white/10 text-left shadow-lg transition-all duration-300 ${
                    loadingCounts
                      ? 'cursor-default opacity-70'
                      : count === 0
                        ? 'cursor-default opacity-50'
                        : 'cursor-pointer hover:-translate-y-1 hover:border-gold-400/50 hover:shadow-lux'
                  }`}
                  aria-disabled={
                    loadingCounts || count === 0
                      ? true
                      : undefined
                  }
                >
                  <img
                    src={cat.image}
                    alt={cat.label}
                    loading="lazy"
                    className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ${
                      !loadingCounts && count > 0
                        ? 'group-hover:scale-110'
                        : ''
                    }`}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-navy-900/10" />

                  {!loadingCounts && count > 0 && (
                    <div className="absolute left-0 top-0 h-1 w-0 bg-gold-400 transition-all duration-300 group-hover:w-full" />
                  )}

                  <div className="relative z-10 p-5">
                    <div
                      className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/20 text-gold-400 backdrop-blur-md ${
                        loadingCounts || count === 0
                          ? 'opacity-50'
                          : ''
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="font-heading text-lg font-semibold text-cream">
                      {cat.label}
                    </div>

                    <div className="mt-1 text-xs font-medium text-gold-200">
                      {countText}
                    </div>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}