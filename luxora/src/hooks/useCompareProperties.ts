import { useState, useEffect, useCallback } from 'react';

export type CompareResult = 'added' | 'exists' | 'limit_reached';

export function useCompareProperties() {
  const [compareList, setCompareList] = useState<string[]>(() => {
    try {
      const item = window.localStorage.getItem('luxora_compare_properties');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error('Error reading localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('luxora_compare_properties', JSON.stringify(compareList));
    } catch (error) {
      console.error('Error setting localStorage', error);
    }
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
