import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';

export type CompareResult = 'added' | 'exists' | 'limit_reached';

export function useCompareProperties() {
  const [compareList, setCompareList] = useState<string[]>(() => {
    return storage.getItem<string[]>('luxora_compare_properties', []);
  });

  useEffect(() => {
    storage.setItem('luxora_compare_properties', compareList);
  }, [compareList]);

  const toggleCompareProperty = useCallback((id: string): CompareResult => {
    if (compareList.includes(id)) {
      return 'exists';
    }
    if (compareList.length >= 4) {
      return 'limit_reached';
    }
    setCompareList(prev => [...prev, id]);
    return 'added';
  }, [compareList]);

  const isCompared = useCallback((id: string) => compareList.includes(id), [compareList]);
  
  const clearCompare = useCallback(() => setCompareList([]), []);

  return { compareList, toggleCompareProperty, isCompared, clearCompare, setCompareList };
}
