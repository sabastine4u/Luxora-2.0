import { useEffect, useMemo, useState } from 'react';
import { useSession } from '../../../contexts/SessionContext';
import { useFavorites } from '../../../contexts/FavoriteContext';
import { PropertyCard } from '../../../components/property/PropertyCard';

// Fetch published Properties from the Luxora backend.
import { propertyApi } from '../../../api/property.api';
import { mapApiPropertiesToProperties } from '../../../api/property.mapper.js';

import type { Property } from '../../../types';
import { EmptyState } from '../../../components/layout';
import { ROUTES } from '../../../constants/routes';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

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

export default function RecommendedProperties() {
  // Store published Properties loaded from the Luxora backend.
  const [availableProperties, setAvailableProperties] = useState<
    Property[]
  >([]);

  // Track whether the initial recommendations request is still loading.
  const [isLoading, setIsLoading] = useState(true);

  // Store any backend loading error.
  const [loadError, setLoadError] = useState<string | null>(
    null,
  );

  const { recentlyViewed } = useSession();
  const { favoriteProperties: savedProperties } =
    useFavorites();
  const navigate = useNavigate();

  /*
   * Load published and available Properties from the
   * Luxora backend.
   */
  useEffect(() => {
    let isActive = true;

    const loadProperties = async () => {
      try {
        // Start loading before making the request.
        setIsLoading(true);
        setLoadError(null);

        /*
         * Request real published and available Properties.
         * Use a larger limit so recommendations are not
         * restricted to the API's default page size.
         */
        const response =
          await propertyApi.getProperties({
            status: 'Published',
            availabilityStatus: 'Available',
            limit: 100,
          });

        /*
         * The API is typed as AxiosResponse, while the
         * HTTP client may return the unwrapped payload
         * at runtime.
         */
        const payload =
          response as unknown as PropertyListResponse;

        let backendProperties: unknown[] = [];

        /*
         * Support the possible response shapes used
         * by the existing Luxora API layer.
         */
        if (Array.isArray(payload.properties)) {
          backendProperties = payload.properties;
        } else if (Array.isArray(payload.results)) {
          backendProperties = payload.results;
        } else if (Array.isArray(payload.data)) {
          backendProperties = payload.data;
        } else if (
          payload.data &&
          typeof payload.data === 'object'
        ) {
          backendProperties =
            payload.data.properties ??
            payload.data.results ??
            [];
        }

        /*
         * Map the backend records into the canonical
         * frontend Property structure.
         */
        const mappedProperties =
          mapApiPropertiesToProperties(
            backendProperties,
          );

        if (!isActive) {
          return;
        }

        setAvailableProperties(
          mappedProperties as Property[],
        );
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error(
          'Failed to load properties for recommendations:',
          error,
        );

        setAvailableProperties([]);

        setLoadError(
          error instanceof Error
            ? error.message
            : 'Failed to load recommended properties.',
        );
      } finally {
        /*
         * Loading ends only after the API request has
         * completed or failed.
         */
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadProperties();

    return () => {
      isActive = false;
    };
  }, []);

  /*
   * Build the recommendation list from the real
   * Properties returned by the backend.
   */
  const recommendedProps = useMemo(() => {
    /*
     * Exclude Properties the Buyer has already saved
     * or viewed.
     */
    const excludeIds = new Set([
      ...savedProperties,
      ...recentlyViewed,
    ]);

    const candidates = availableProperties.filter(
      (property) =>
        !excludeIds.has(property.id),
    );

    /*
     * Find Properties the Buyer has interacted with
     * so we can derive preferences.
     */
    const interactedIds = [
      ...savedProperties,
      ...recentlyViewed,
    ];

    const interactedProps = interactedIds
      .map((id) =>
        availableProperties.find(
          (property) => property.id === id,
        ),
      )
      .filter(
        (property): property is Property =>
          property !== undefined,
      );

    /*
     * Default preference values are only used when
     * there is no saved/viewed Property history.
     */
    let preferredLocation = 'Lekki';
    let preferredType = 'Villa';
    let minPrice = 0;
    let maxPrice = 100000000000;

    if (interactedProps.length > 0) {
      /*
       * Find the most frequently interacted location.
       */
      const locationCounts = new Map<
        string,
        number
      >();

      interactedProps.forEach((property) => {
        locationCounts.set(
          property.location,
          (locationCounts.get(property.location) ?? 0) +
            1,
        );
      });

      preferredLocation =
        [...locationCounts.entries()].sort(
          (a, b) => b[1] - a[1],
        )[0]?.[0] || 'Lekki';

      /*
       * Find the most frequently interacted
       * Property type.
       */
      const typeCounts = new Map<string, number>();

      interactedProps.forEach((property) => {
        typeCounts.set(
          property.type,
          (typeCounts.get(property.type) ?? 0) + 1,
        );
      });

      preferredType =
        [...typeCounts.entries()].sort(
          (a, b) => b[1] - a[1],
        )[0]?.[0] || 'Villa';

      /*
       * Build a price range around the average price
       * of interacted Properties.
       */
      const prices = interactedProps
        .map((property) => property.priceValue)
        .filter(
          (price): price is number =>
            typeof price === 'number' &&
            Number.isFinite(price),
        );

      if (prices.length > 0) {
        const averagePrice =
          prices.reduce(
            (sum, price) => sum + price,
            0,
          ) / prices.length;

        minPrice = averagePrice * 0.5;
        maxPrice = averagePrice * 1.5;
      }
    }

    /*
     * Score each available Property.
     */
    const scored = candidates.map((property) => {
      let score = 0;

      // Same preferred location.
      if (
        property.location
          .toLowerCase()
          .includes(
            preferredLocation.toLowerCase(),
          )
      ) {
        score += 40;
      }

      // Same preferred Property type.
      if (property.type === preferredType) {
        score += 30;
      }

      // Similar price range.
      if (
        property.priceValue >= minPrice &&
        property.priceValue <= maxPrice
      ) {
        score += 20;
      }

      // Verified Properties receive an additional score.
      if (property.verified.length > 0) {
        score += 10;
      }

      /*
       * Keep the existing minor price tie-breaker.
       */
      score += property.priceValue % 10;

      return {
        property,
        score,
      };
    });

    /*
     * Highest recommendation score first.
     */
    scored.sort(
      (a, b) => b.score - a.score,
    );

    /*
     * Return a maximum of six unique recommendations.
     */
    const finalProps: Property[] = [];
    const addedIds = new Set<string>();

    for (const item of scored) {
      if (!addedIds.has(item.property.id)) {
        finalProps.push(item.property);
        addedIds.add(item.property.id);

        if (finalProps.length === 6) {
          break;
        }
      }
    }

    return finalProps;
  }, [
    savedProperties,
    recentlyViewed,
    availableProperties,
  ]);

  /*
   * IMPORTANT:
   * Do not show an EmptyState while the backend request
   * is still running.
   */
  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-white/10" />

          <div className="h-4 w-80 animate-pulse rounded-lg bg-white/10" />

          <div className="h-3 w-40 animate-pulse rounded-lg bg-white/10" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-white/10 bg-navy-800/50"
              >
                <div className="h-52 animate-pulse bg-white/5" />

                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />

                  <div className="h-6 w-1/3 animate-pulse rounded bg-white/10" />
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    );
  }

  /*
   * Only show the EmptyState AFTER loading finishes.
   */
  if (recommendedProps.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-12">
        <EmptyState
          icon={
            <Sparkles className="h-12 w-12 text-gold-400" />
          }
          title={
            loadError
              ? 'Recommendations could not be loaded.'
              : 'No recommendations available yet.'
          }
          description={
            loadError
              ? 'We could not retrieve available properties from the backend.'
              : 'Browse and save properties to get personalized recommendations.'
          }
          actionLabel="Browse Properties"
          onAction={() =>
            navigate(ROUTES.PROPERTIES)
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-2xl font-bold text-cream">
          Recommended For You
        </h2>

        <p className="text-sm text-ink/60">
          Properties selected based on your
          interests and activity.
        </p>

        <div className="mt-1 text-xs font-semibold text-gold-400">
          Showing {recommendedProps.length}{' '}
          recommendation
          {recommendedProps.length === 1
            ? ''
            : 's'}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recommendedProps.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
          />
        ))}
      </div>
    </div>
  );
}