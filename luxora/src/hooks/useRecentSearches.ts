/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export interface SearchState {
  keyword: string;
  location: string;
  propertyType: string;
  listingType: string;
  budget: string;
}

const STORAGE_KEY = 'luxora_recent_searches';

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<SearchState[]>([]);

  useEffect(() => {
    const stored = storage.getItem<SearchState[] | Record<string, string>>(STORAGE_KEY, []);
    // Migration from old single object to array of objects
    if (!Array.isArray(stored)) {
      if (stored && typeof stored === 'object' && Object.keys(stored).length > 0) {
        const migrated: SearchState = {
          keyword: stored.keyword || '',
          location: stored.location || 'Any Location',
          propertyType: stored.propertyType || 'Any Type',
          listingType: stored.listingType || 'buy',
          budget: stored.budget || 'Any Budget'
        };
        setRecentSearches([migrated]);
        storage.setItem(STORAGE_KEY, [migrated]);
      } else {
        setRecentSearches([]);
      }
    } else {
      setRecentSearches(stored);
    }
  }, []);

  const addSearch = (search: SearchState) => {
    setRecentSearches(prev => {
      // Remove exact duplicates
      const filtered = prev.filter(s => 
        !(s.keyword === search.keyword && 
          s.location === search.location && 
          s.propertyType === search.propertyType && 
          s.listingType === search.listingType && 
          s.budget === search.budget)
      );
      
      const updated = [search, ...filtered].slice(0, 5);
      storage.setItem(STORAGE_KEY, updated);
      return updated;
    });
  };

  const removeSearch = (index: number) => {
    setRecentSearches(prev => {
      const updated = prev.filter((_, i) => i !== index);
      storage.setItem(STORAGE_KEY, updated);
      return updated;
    });
  };

  const clearSearches = () => {
    setRecentSearches([]);
    storage.removeItem(STORAGE_KEY);
  };

  return { recentSearches, addSearch, removeSearch, clearSearches };
}
