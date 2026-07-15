import { useState, useMemo } from 'react';
import { properties } from '../data/luxoraData';
import type { PropertyType } from '../types';

export type SortOption = 'newest' | 'price-asc' | 'price-desc';

interface UsePropertySearchOptions {
  initialItemsPerPage?: number;
  initialType?: PropertyType;
  initialLocation?: string;
}

export function usePropertySearch({ initialItemsPerPage = 9, initialType = 'Any Type', initialLocation = 'Any Location' }: UsePropertySearchOptions = {}) {
  // Common Search & Filters
  const [search, setSearch] = useState('');
  const [type, setType] = useState<PropertyType>(initialType);
  const [location, setLocation] = useState(initialLocation);
  const [sort, setSort] = useState<SortOption>('newest');
  
  // PropertiesPage specific budget
  const [budgetString, setBudgetString] = useState('Any Budget');
  
  // SearchPage specific filters
  const [minPriceM, setMinPriceM] = useState(0);
  const [maxPriceM, setMaxPriceM] = useState(1000);
  const [beds, setBeds] = useState('Any');
  const [baths, setBaths] = useState('Any');

  // Pagination
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // View Mode
  const [viewMode, setViewModeState] = useState<'grid' | 'list'>(() => {
    try {
      const stored = localStorage.getItem('luxora_view_mode');
      if (stored === 'grid' || stored === 'list') return stored;
    } catch {
      // ignore
    }
    return 'grid';
  });

  const setViewMode = (mode: 'grid' | 'list') => {
    setViewModeState(mode);
    try {
      localStorage.setItem('luxora_view_mode', mode);
    } catch {
      // ignore
    }
  };

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

    // Sort
    result = [...result].sort((a, b) => {
      if (sort === 'price-asc') return a.priceValue - b.priceValue;
      if (sort === 'price-desc') return b.priceValue - a.priceValue;
      return 0; // newest
    });

    return result;
  }, [search, type, location, budgetString, minPriceM, maxPriceM, beds, baths, sort]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  
  // Constrain page to bounds if filters change heavily
  const validPage = Math.min(page, Math.max(1, totalPages));

  const paginatedProperties = useMemo(() => {
    return filteredProperties.slice((validPage - 1) * itemsPerPage, validPage * itemsPerPage);
  }, [filteredProperties, validPage, itemsPerPage]);

  const goToPage = (p: number) => setPage(p);

  const resetFilters = () => {
    setSearch('');
    setType('Any Type');
    setLocation('Any Location');
    setBudgetString('Any Budget');
    setMinPriceM(0);
    setMaxPriceM(1000);
    setBeds('Any');
    setBaths('Any');
    setPage(1);
  };

  return {
    // State
    search,
    type,
    location,
    budgetString,
    minPriceM,
    maxPriceM,
    beds,
    baths,
    sort,
    page: validPage,
    itemsPerPage,

    // Setters
    setSearch: (v: string) => { setSearch(v); setPage(1); },
    setType: (v: string) => { setType(v); setPage(1); },
    setLocation: (v: string) => { setLocation(v); setPage(1); },
    setBudgetString: (v: string) => { setBudgetString(v); setPage(1); },
    setMinPriceM: (v: number) => { setMinPriceM(v); setPage(1); },
    setMaxPriceM: (v: number) => { setMaxPriceM(v); setPage(1); },
    setBeds: (v: string) => { setBeds(v); setPage(1); },
    setBaths: (v: string) => { setBaths(v); setPage(1); },
    setSort: (v: SortOption) => { setSort(v); setPage(1); },
    setItemsPerPage,

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
