import { useState, useEffect, useCallback } from 'react';

export function useSavedProperties() {
  const [savedProperties, setSavedProperties] = useState<string[]>(() => {
    try {
      const item = window.localStorage.getItem('luxora_saved_properties');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error('Error reading localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('luxora_saved_properties', JSON.stringify(savedProperties));
    } catch (error) {
      console.error('Error setting localStorage', error);
    }
  }, [savedProperties]);

  const toggleSavedProperty = useCallback((id: string) => {
    setSavedProperties(prev => {
      if (prev.includes(id)) {
        return prev.filter(pid => pid !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  const isSaved = useCallback((id: string) => savedProperties.includes(id), [savedProperties]);

  return { savedProperties, toggleSavedProperty, isSaved, setSavedProperties };
}
