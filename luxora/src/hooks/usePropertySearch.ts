import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { properties } from '../data/luxoraData';
import type { PropertyType } from '../types';
import { storage } from '../utils/storage';

export type SortOption = 'newest' | 'price-asc' | 'price-desc';

interface UsePropertySearchOptions {
  initialItemsPerPage?: number;
  initialType?: PropertyType;
  initialLocation?: string;
  initialListingType?: string;
}

export function usePropertySearch({ initialItemsPerPage = 9, initialType = 'Any Type', initialLocation = 'Any Location', initialListingType = 'Any' }: UsePropertySearchOptions = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Helpers
  const getParam = useCallback((key: string, fallback: string) => searchParams.get(key) || fallback, [searchParams]);
  const getNumParam = useCallback((key: string, fallback: number) => {
    const val = searchParams.get(key);
    return val ? parseInt(val, 10) : fallback;
  }, [searchParams]);
  const getBoolParam = useCallback((key: string, fallback: boolean) => {
    const val = searchParams.get(key);
    return val ? val === 'true' : fallback;
  }, [searchParams]);
  const getArrayParam = useCallback((key: string, fallback: string[] = []) => {
    const val = searchParams.get(key);
    return val ? val.split(',') : fallback;
  }, [searchParams]);

  const updateParams = useCallback((updates: Record<string, string | null>) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([k, v]) => {
        if (v === null || v === '' || v === 'Any Type' || v === 'Any Location' || v === 'Any Budget' || v === 'Any' || v === 'newest' || v === 'false') {
          next.delete(k);
        } else {
          next.set(k, v);
        }
      });
      // Reset page to 1 when filters change (if page isn't the thing being updated)
      if (Object.keys(updates).some(k => k !== 'page' && k !== 'limit')) {
        next.delete('page');
      }
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  // State mapped from URL
  const search = getParam('search', '');
  const type = getParam('propertyType', initialType) as PropertyType;
  const location = getParam('location', initialLocation);
  const sort = getParam('sort', 'newest') as SortOption;
  const budgetString = getParam('budget', 'Any Budget');
  const minPriceM = getNumParam('minPriceM', 0);
  const maxPriceM = getNumParam('maxPriceM', 1000);
  const beds = getParam('bedrooms', 'Any');
  const baths = getParam('bathrooms', 'Any');
  
  // Advanced State mapped from URL
  const listingType = getParam('listingType', initialListingType);
  const status = getParam('status', 'Any');
  const amenities = getArrayParam('amenities', []);
  const mortgageSupport = getBoolParam('mortgageSupport', false);
  const verificationLevel = getParam('verificationLevel', 'Any');
  const minArea = getNumParam('minArea', 0);
  const maxArea = getNumParam('maxArea', 10000);
  const listingTier = getParam('listingTier', 'Any');
  const furnishing = getParam('furnishing', 'Any');
  const availability = getParam('availability', 'Any');
  const paymentPlan = getArrayParam('paymentPlan', []);

  // Pagination mapped from URL
  const page = getNumParam('page', 1);
  const itemsPerPage = getNumParam('limit', initialItemsPerPage);

  // View Mode (Local Storage - not URL bound)
  const [viewMode, setViewModeState] = useState<'grid' | 'list' | 'map'>(() => {
    const stored = storage.getItem<'grid' | 'list' | 'map' | null>('luxora_view_mode', null);
    if (stored === 'grid' || stored === 'list' || stored === 'map') return stored;
    return 'grid';
  });

  const setViewMode = useCallback((mode: 'grid' | 'list' | 'map') => {
    setViewModeState(mode);
    storage.setItem('luxora_view_mode', mode);
  }, []);

  const filteredProperties = useMemo(() => {
    let result = properties;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
    }

    if (type !== 'Any Type') {
      result = result.filter(p => p.type === type);
    }

    if (location !== 'Any Location') {
      result = result.filter(p => p.city === location || p.state === location);
    }

    // Budget String Logic (for PropertiesPage)
    if (budgetString !== 'Any Budget') {
      let min = 0;
      let max = Infinity;
      if (budgetString === '₦50M – ₦100M') { min = 50_000_000; max = 100_000_000; }
      else if (budgetString === '₦100M – ₦300M') { min = 100_000_000; max = 300_000_000; }
      else if (budgetString === '₦300M – ₦700M') { min = 300_000_000; max = 700_000_000; }
      else if (budgetString === '₦700M+') { min = 700_000_000; max = Infinity; }
      result = result.filter(p => p.priceValue >= min && p.priceValue <= max);
    }

    // Range Logic (for SearchPage)
    if (minPriceM > 0) {
      result = result.filter(p => (p.priceValue / 1_000_000) >= minPriceM);
    }

    if (maxPriceM < 1000) {
      result = result.filter(p => (p.priceValue / 1_000_000) <= maxPriceM);
    }

    // Beds & Baths Logic
    if (beds !== 'Any') {
      result = result.filter(p => p.beds >= parseInt(beds, 10));
    }

    if (baths !== 'Any') {
      result = result.filter(p => p.baths >= parseInt(baths, 10));
    }

    // Advanced Filters Logic
    if (listingType !== 'Any' && listingType !== '') {
      result = result.filter(p => p.transactionType === listingType.toLowerCase());
    }

    if (status !== 'Any') {
      result = result.filter(p => p.status === status || (status === 'Available' && !p.status));
    }

    if (mortgageSupport) {
      result = result.filter(p => p.mortgageSupport === true);
    }

    if (verificationLevel !== 'Any') {
      result = result.filter(p => p.verified?.includes(verificationLevel));
    }

    if (listingTier !== 'Any') {
      result = result.filter(p => p.listingTier === listingTier || (listingTier === 'Basic' && !p.listingTier));
    }
    
    if (furnishing !== 'Any') {
      result = result.filter(p => p.furnishing === furnishing);
    }
    
    if (availability !== 'Any') {
      if (availability === 'Immediate') {
        result = result.filter(p => p.status === 'Available' || !p.status);
      } else {
        result = result.filter(p => p.status !== 'Available');
      }
    }

    if (minArea > 0) {
      result = result.filter(p => {
        const areaNum = parseInt(p.area.replace(/\D/g, ''), 10);
        return !isNaN(areaNum) && areaNum >= minArea;
      });
    }
    
    if (maxArea < 10000) {
      result = result.filter(p => {
        const areaNum = parseInt(p.area.replace(/\D/g, ''), 10);
        return !isNaN(areaNum) && areaNum <= maxArea;
      });
    }

    if (amenities.length > 0) {
      result = result.filter(p => 
        amenities.every(amenity => p.amenities?.includes(amenity))
      );
    }

    if (paymentPlan.length > 0) {
      result = result.filter(p => 
        paymentPlan.every(plan => p.paymentOptions?.includes(plan))
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sort === 'price-asc') return a.priceValue - b.priceValue;
      if (sort === 'price-desc') return b.priceValue - a.priceValue;
      return 0; // newest
    });

    return result;
  }, [search, type, location, budgetString, minPriceM, maxPriceM, beds, baths, sort, status, mortgageSupport, verificationLevel, minArea, maxArea, amenities, listingType, listingTier, furnishing, availability, paymentPlan]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  
  // Constrain page to bounds if filters change heavily
  const validPage = Math.min(page, Math.max(1, totalPages));

  const paginatedProperties = useMemo(() => {
    return filteredProperties.slice((validPage - 1) * itemsPerPage, validPage * itemsPerPage);
  }, [filteredProperties, validPage, itemsPerPage]);

  const goToPage = useCallback((p: number) => updateParams({ page: p.toString() }), [updateParams]);

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return {
    // State
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

    // Setters (Mapped to URL params)
    setSearch: useCallback((v: string) => updateParams({ search: v }), [updateParams]),
    setType: useCallback((v: string) => updateParams({ propertyType: v }), [updateParams]),
    setLocation: useCallback((v: string) => updateParams({ location: v }), [updateParams]),
    setListingType: useCallback((v: string) => updateParams({ listingType: v }), [updateParams]),
    setBudgetString: useCallback((v: string) => updateParams({ budget: v }), [updateParams]),
    setMinPriceM: useCallback((v: number) => updateParams({ minPriceM: v === 0 ? null : v.toString() }), [updateParams]),
    setMaxPriceM: useCallback((v: number) => updateParams({ maxPriceM: v === 1000 ? null : v.toString() }), [updateParams]),
    setBeds: useCallback((v: string) => updateParams({ bedrooms: v }), [updateParams]),
    setBaths: useCallback((v: string) => updateParams({ bathrooms: v }), [updateParams]),
    setSort: useCallback((v: SortOption) => updateParams({ sort: v }), [updateParams]),
    setStatus: useCallback((v: string) => updateParams({ status: v }), [updateParams]),
    setAmenities: useCallback((v: string[]) => updateParams({ amenities: v.length > 0 ? v.join(',') : null }), [updateParams]),
    setMortgageSupport: useCallback((v: boolean) => updateParams({ mortgageSupport: v ? 'true' : null }), [updateParams]),
    setVerificationLevel: useCallback((v: string) => updateParams({ verificationLevel: v }), [updateParams]),
    setListingTier: useCallback((v: string) => updateParams({ listingTier: v }), [updateParams]),
    setFurnishing: useCallback((v: string) => updateParams({ furnishing: v }), [updateParams]),
    setAvailability: useCallback((v: string) => updateParams({ availability: v }), [updateParams]),
    setPaymentPlan: useCallback((v: string[]) => updateParams({ paymentPlan: v.length > 0 ? v.join(',') : null }), [updateParams]),
    setMinArea: useCallback((v: number) => updateParams({ minArea: v === 0 ? null : v.toString() }), [updateParams]),
    setMaxArea: useCallback((v: number) => updateParams({ maxArea: v === 10000 ? null : v.toString() }), [updateParams]),
    setItemsPerPage: useCallback((v: number) => updateParams({ limit: v.toString() }), [updateParams]),

    // Pagination
    goToPage,
    
    // Actions
    resetFilters,

    // Derived Data
    filteredProperties,
    paginatedProperties,
    totalPages,
    totalProperties: properties.length,
    viewMode,
    setViewMode
  };
}
