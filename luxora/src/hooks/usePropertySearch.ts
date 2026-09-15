import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertyApi } from '../api/property.api';
import { mapApiPropertiesToProperties } from '../api/property.mapper';
import type { PropertyType, Property } from '../types';
import { storage } from '../utils/storage';

export type SortOption = 'newest' | 'price-asc' | 'price-desc';

interface UsePropertySearchOptions {
  initialItemsPerPage?: number;
  initialType?: PropertyType;
  initialLocation?: string;
  initialListingType?: string;
}

// Describe the unwrapped response returned by the public Property search API.
interface PropertySearchResponse {
  // Properties returned for the requested page.
  properties: unknown[];

  // Pagination metadata returned by the backend.
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function usePropertySearch({
  initialItemsPerPage = 9,
  initialType = 'Any Type',
  initialLocation = 'Any Location',
  initialListingType = 'Any',
}: UsePropertySearchOptions = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Store the Properties returned by the real backend API.
  const [properties, setProperties] = useState<Property[]>([]);

  // Track whether the marketplace request is currently loading.
  const [isLoading, setIsLoading] = useState(true);

  // Store a readable API error for the marketplace UI.
  const [error, setError] = useState<string | null>(null);

  // Store backend pagination metadata.
  const [totalProperties, setTotalProperties] = useState(0);
  const [totalPagesFromApi, setTotalPagesFromApi] = useState(1);

  // Read a string URL parameter with a fallback value.
  const getParam = useCallback(
    (key: string, fallback: string) =>
      searchParams.get(key) || fallback,
    [searchParams],
  );

  // Read a numeric URL parameter with a fallback value.
  const getNumParam = useCallback(
    (key: string, fallback: number) => {
      const value = searchParams.get(key);

      // Return the fallback when the parameter is missing.
      if (!value) {
        return fallback;
      }

      // Convert the URL value into a number.
      const parsed = Number(value);

      // Return the fallback when the value is not numeric.
      return Number.isFinite(parsed) ? parsed : fallback;
    },
    [searchParams],
  );

  // Read a boolean URL parameter with a fallback value.
  const getBoolParam = useCallback(
    (key: string, fallback: boolean) => {
      const value = searchParams.get(key);

      // Return the fallback when the parameter is missing.
      if (!value) {
        return fallback;
      }

      // Convert the string representation into a boolean.
      return value === 'true';
    },
    [searchParams],
  );

  // Read a comma-separated URL parameter into an array.
  const getArrayParam = useCallback(
    (key: string, fallback: string[] = []) => {
      const value = searchParams.get(key);

      // Return the fallback when no parameter is present.
      if (!value) {
        return fallback;
      }

      // Convert the comma-separated value into an array.
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    },
    [searchParams],
  );

  // Update URL parameters while preserving unrelated parameters.
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams(
        (previous) => {
          // Clone the current URL parameters before changing anything.
          const next = new URLSearchParams(previous);

          // Apply each requested parameter update.
          Object.entries(updates).forEach(([key, value]) => {
            // Remove empty/default values from the URL.
            if (
              value === null ||
              value === '' ||
              value === 'Any Type' ||
              value === 'Any Location' ||
              value === 'Any Budget' ||
              value === 'Any' ||
              value === 'newest' ||
              value === 'false'
            ) {
              next.delete(key);
            } else {
              next.set(key, value);
            }
          });

          // Reset pagination whenever a filter changes.
          if (
            Object.keys(updates).some(
              (key) => key !== 'page' && key !== 'limit',
            )
          ) {
            next.delete('page');
          }

          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // Read the current search state from the URL.
  const search = getParam('search', '');

  // Read the Property type filter from the URL.
  const type = getParam(
    'propertyType',
    initialType,
  ) as PropertyType;

  // Read the broad location filter from the URL.
  const location = getParam(
    'location',
    initialLocation,
  );

  // Read the selected sort option.
  const sort = getParam(
    'sort',
    'newest',
  ) as SortOption;

  // Read the frontend budget preset.
  const budgetString = getParam(
    'budget',
    'Any Budget',
  );

  // Read frontend price-range values expressed in millions.
  const minPriceM = getNumParam(
    'minPriceM',
    0,
  );

  const maxPriceM = getNumParam(
    'maxPriceM',
    1000,
  );

  // Read bedroom and bathroom minimum values.
  const beds = getParam('bedrooms', 'Any');
  const baths = getParam('bathrooms', 'Any');

  // Read the advanced listing type from the current URL.
  const listingType = getParam(
    'listingType',
    initialListingType,
  );

  // Read the existing UI status filter.
  const status = getParam('status', 'Any');

  // Read advanced filter arrays and flags.
  const amenities = getArrayParam('amenities', []);
  const mortgageSupport = getBoolParam(
    'mortgageSupport',
    false,
  );

  const verificationLevel = getParam(
    'verificationLevel',
    'Any',
  );

  const minArea = getNumParam(
    'minArea',
    0,
  );

  const maxArea = getNumParam(
    'maxArea',
    10000,
  );

  const listingTier = getParam(
    'listingTier',
    'Any',
  );

  const furnishing = getParam(
    'furnishing',
    'Any',
  );

  const availability = getParam(
    'availability',
    'Any',
  );

  const paymentPlan = getArrayParam(
    'paymentPlan',
    [],
  );

  // Read backend pagination state from the URL.
  const page = getNumParam('page', 1);

  const itemsPerPage = getNumParam(
    'limit',
    initialItemsPerPage,
  );

  // Store the UI view mode separately from backend search state.
  const [viewMode, setViewModeState] = useState<
    'grid' | 'list' | 'map'
  >(() => {
    // Restore the user's previously selected view mode.
    const stored = storage.getItem<
      'grid' | 'list' | 'map' | null
    >(
      'luxora_view_mode',
      null,
    );

    // Accept only supported view modes.
    if (
      stored === 'grid' ||
      stored === 'list' ||
      stored === 'map'
    ) {
      return stored;
    }

    // Default to grid view.
    return 'grid';
  });

  // Persist the selected view mode.
  const setViewMode = useCallback(
    (mode: 'grid' | 'list' | 'map') => {
      // Update React state immediately.
      setViewModeState(mode);

      // Persist the preference for future visits.
      storage.setItem(
        'luxora_view_mode',
        mode,
      );
    },
    [],
  );

  // Convert the frontend budget preset into real NGN values.
  const getBudgetRange = useCallback(() => {
    // Default to no budget restrictions.
    let minPrice;
    let maxPrice;

    // Convert each existing UI preset into backend values.
    if (budgetString === '₦50M – ₦100M') {
      minPrice = 50_000_000;
      maxPrice = 100_000_000;
    } else if (
      budgetString === '₦100M – ₦300M'
    ) {
      minPrice = 100_000_000;
      maxPrice = 300_000_000;
    } else if (
      budgetString === '₦300M – ₦700M'
    ) {
      minPrice = 300_000_000;
      maxPrice = 700_000_000;
    } else if (
      budgetString === '₦700M+'
    ) {
      minPrice = 700_000_000;
    }

    // Return the translated backend range.
    return {
      minPrice,
      maxPrice,
    };
  }, [budgetString]);

  // Build the canonical backend search query from the frontend URL state.
  const apiQuery = useMemo(() => {
    // Convert the selected budget preset into NGN values.
    const budgetRange = getBudgetRange();

    // Convert the price slider values from millions into NGN.
    const sliderMinPrice =
      minPriceM > 0
        ? minPriceM * 1_000_000
        : undefined;

    const sliderMaxPrice =
      maxPriceM < 1000
        ? maxPriceM * 1_000_000
        : undefined;

    // Start with the required pagination and sorting values.
    const query: Record<string, string | number | boolean> = {
      page,
      limit: itemsPerPage,
      sort,
    };

    // Add the general text search only when supplied.
    if (search) {
      query.search = search;
    }

    // Add the Property type only when a specific type is selected.
    if (type !== 'Any Type') {
      query.propertyType = type;
    }

    // Convert the frontend listing type to the backend transaction type.
    if (
      listingType !== 'Any' &&
      listingType !== ''
    ) {
      query.transactionType =
        listingType.toLowerCase();
    }

    // Pass the location search through to the backend.
    if (location !== 'Any Location') {
      query.location = location;
    }

    // Prefer the explicit budget preset when selected.
    if (budgetRange.minPrice !== undefined) {
      query.minPrice = budgetRange.minPrice;
    }

    if (budgetRange.maxPrice !== undefined) {
      query.maxPrice = budgetRange.maxPrice;
    }

    // Apply the slider range when no preset has already provided the boundary.
    if (
      budgetRange.minPrice === undefined &&
      sliderMinPrice !== undefined
    ) {
      query.minPrice = sliderMinPrice;
    }

    if (
      budgetRange.maxPrice === undefined &&
      sliderMaxPrice !== undefined
    ) {
      query.maxPrice = sliderMaxPrice;
    }

    // Convert the frontend bedroom value into the backend field.
    if (beds !== 'Any') {
      query.bedrooms = Number(beds);
    }

    // Convert the frontend bathroom value into the backend field.
    if (baths !== 'Any') {
      query.bathrooms = Number(baths);
    }

    // Pass supported advanced filters to the backend.
    if (mortgageSupport) {
      query.mortgageSupport = true;
    }

    if (verificationLevel !== 'Any') {
      query.verificationLevel =
        verificationLevel;
    }

    if (listingTier !== 'Any') {
      query.listingTier =
        listingTier;
    }

    if (furnishing !== 'Any') {
      query.furnishing =
        furnishing;
    }

    // Map the frontend availability terminology to the backend enum.
    if (availability !== 'Any') {
      query.availabilityStatus =
        availability === 'Immediate'
          ? 'Available'
          : availability;
    }

    // Convert the frontend area range into the backend propertySize range.
    if (minArea > 0) {
      query.minArea = minArea;
    }

    if (maxArea < 10000) {
      query.maxArea = maxArea;
    }

    // Pass selected amenities as a comma-separated backend value.
    if (amenities.length > 0) {
      query.amenities =
        amenities.join(',');
    }

    // Convert the frontend payment-plan labels into backend durations.
    if (paymentPlan.length > 0) {
      const durations = paymentPlan
        .map((plan) => {
          // Extract numeric duration from labels like "6 Months Plan".
          const match =
            plan.match(/\d+/);

          return match
            ? match[0]
            : null;
        })
        .filter(Boolean);

      // Send only successfully parsed durations.
      if (durations.length > 0) {
        query.paymentPlan =
          durations.join(',');
      }
    }

    // Return the completed backend query.
    return query;
  }, [
    search,
    type,
    location,
    listingType,
    budgetString,
    minPriceM,
    maxPriceM,
    beds,
    baths,
    mortgageSupport,
    verificationLevel,
    listingTier,
    furnishing,
    availability,
    minArea,
    maxArea,
    amenities,
    paymentPlan,
    sort,
    page,
    itemsPerPage,
    getBudgetRange,
  ]);

  // Fetch Properties whenever the URL search state changes.
  useEffect(() => {
    // Track whether this particular request is still active.
    let isActive = true;

    // Wrap the API request in an async function.
    const fetchProperties = async () => {
      try {
        // Show the loading state before requesting fresh results.
        setIsLoading(true);

        // Clear the previous error before making the request.
        setError(null);

        // Request the published Properties from the backend using the canonical search query.
        const response = (await propertyApi.getProperties(
          apiQuery,
        )) as unknown as PropertySearchResponse;
        // Stop if another request has already replaced this one.
        if (!isActive) {
          return;
        }

        // Extract the backend Property collection.
        const apiProperties =
          response?.properties || [];

        // Convert backend Properties into the canonical frontend Property shape.
        const mappedProperties =
          mapApiPropertiesToProperties(
            apiProperties,
          ) as Property[];

        // Update the frontend Property collection.
        setProperties(mappedProperties);

        // Preserve backend pagination totals.
        setTotalProperties(
          response?.pagination?.total || 0,
        );

        // Preserve backend page count.
        setTotalPagesFromApi(
          response?.pagination?.totalPages || 1,
        );
      } catch (requestError) {
        // Ignore stale request errors after a newer request has started.
        if (!isActive) {
          return;
        }

        // Clear stale Property results after a failed request.
        setProperties([]);

        // Reset pagination metadata after a failed request.
        setTotalProperties(0);
        setTotalPagesFromApi(1);

        // Convert the caught error into a readable frontend message.
        const message =
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load Properties';

        // Expose the error to the existing UI.
        setError(message);
      } finally {
        // Stop the loading state for the active request.
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    // Start the backend request.
    fetchProperties();

    // Mark the request inactive when dependencies change or the component unmounts.
    return () => {
      isActive = false;
    };
  }, [apiQuery]);

  // Use the backend result count as the authoritative total.
  const totalPages = Math.max(
    1,
    totalPagesFromApi,
  );

  // Keep the current page inside the backend-reported bounds.
  const validPage = Math.min(
    Math.max(1, page),
    totalPages,
  );

  // Navigate to a different backend page.
  const goToPage = useCallback(
    (nextPage: number) => {
      // Keep the requested page at or above one.
      const safePage = Math.max(
        1,
        nextPage,
      );

      // Store the page in the URL.
      updateParams({
        page: safePage.toString(),
      });
    },
    [updateParams],
  );

  // Reset every search filter by clearing the URL.
  const resetFilters = useCallback(() => {
    setSearchParams(
      new URLSearchParams(),
      { replace: true },
    );
  }, [setSearchParams]);

  // Return the existing hook contract so current UI components require minimal changes.
  return {
    // State.
    search,
    type,
    location,
    listingType,
    budgetString,
    minPriceM,
    maxPriceM,
    beds,
    baths,
    sort,
    status,
    amenities,
    mortgageSupport,
    verificationLevel,
    listingTier,
    furnishing,
    availability,
    paymentPlan,
    minArea,
    maxArea,
    page: validPage,
    itemsPerPage,

    // Backend request state.
    isLoading,
    error,

    // Setters mapped to URL parameters.
    setSearch: useCallback(
      (value: string) =>
        updateParams({ search: value }),
      [updateParams],
    ),

    setType: useCallback(
      (value: string) =>
        updateParams({
          propertyType: value,
        }),
      [updateParams],
    ),

    setLocation: useCallback(
      (value: string) =>
        updateParams({
          location: value,
        }),
      [updateParams],
    ),

    setListingType: useCallback(
      (value: string) =>
        updateParams({
          listingType: value,
        }),
      [updateParams],
    ),

    setBudgetString: useCallback(
      (value: string) =>
        updateParams({
          budget: value,
        }),
      [updateParams],
    ),

    setMinPriceM: useCallback(
      (value: number) =>
        updateParams({
          minPriceM:
            value === 0
              ? null
              : value.toString(),
        }),
      [updateParams],
    ),

    setMaxPriceM: useCallback(
      (value: number) =>
        updateParams({
          maxPriceM:
            value === 1000
              ? null
              : value.toString(),
        }),
      [updateParams],
    ),

    setBeds: useCallback(
      (value: string) =>
        updateParams({
          bedrooms: value,
        }),
      [updateParams],
    ),

    setBaths: useCallback(
      (value: string) =>
        updateParams({
          bathrooms: value,
        }),
      [updateParams],
    ),

    setSort: useCallback(
      (value: SortOption) =>
        updateParams({
          sort: value,
        }),
      [updateParams],
    ),

    setStatus: useCallback(
      (value: string) =>
        updateParams({
          status: value,
        }),
      [updateParams],
    ),

    setAmenities: useCallback(
      (value: string[]) =>
        updateParams({
          amenities:
            value.length > 0
              ? value.join(',')
              : null,
        }),
      [updateParams],
    ),

    setMortgageSupport: useCallback(
      (value: boolean) =>
        updateParams({
          mortgageSupport:
            value
              ? 'true'
              : null,
        }),
      [updateParams],
    ),

    setVerificationLevel:
      useCallback(
        (value: string) =>
          updateParams({
            verificationLevel:
              value,
          }),
        [updateParams],
      ),

    setListingTier: useCallback(
      (value: string) =>
        updateParams({
          listingTier: value,
        }),
      [updateParams],
    ),

    setFurnishing: useCallback(
      (value: string) =>
        updateParams({
          furnishing: value,
        }),
      [updateParams],
    ),

    setAvailability: useCallback(
      (value: string) =>
        updateParams({
          availability: value,
        }),
      [updateParams],
    ),

    setPaymentPlan: useCallback(
      (value: string[]) =>
        updateParams({
          paymentPlan:
            value.length > 0
              ? value.join(',')
              : null,
        }),
      [updateParams],
    ),

    setMinArea: useCallback(
      (value: number) =>
        updateParams({
          minArea:
            value === 0
              ? null
              : value.toString(),
        }),
      [updateParams],
    ),

    setMaxArea: useCallback(
      (value: number) =>
        updateParams({
          maxArea:
            value === 10000
              ? null
              : value.toString(),
        }),
      [updateParams],
    ),

    setItemsPerPage: useCallback(
      (value: number) =>
        updateParams({
          limit: value.toString(),
        }),
      [updateParams],
    ),

    // Pagination actions.
    goToPage,

    // Reset all filters.
    resetFilters,

    // Real backend Property results.
    filteredProperties: properties,
    paginatedProperties: properties,

    // Backend pagination metadata.
    totalPages,
    totalProperties,

    // UI view mode.
    viewMode,
    setViewMode,
  };
}