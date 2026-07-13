import { useState, useEffect, useCallback } from 'react';

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const item = window.localStorage.getItem('luxora_recently_viewed');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error('Error reading localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('luxora_recently_viewed', JSON.stringify(recentlyViewed));
    } catch (error) {
      console.error('Error setting localStorage', error);
    }
  }, [recentlyViewed]);

  const addRecentlyViewed = useCallback((id: string) => {
    setRecentlyViewed(prev => {
      const updated = prev.filter(pid => pid !== id);
      return [id, ...updated].slice(0, 10);
    });
  }, []);

  return { recentlyViewed, addRecentlyViewed, setRecentlyViewed };
}
