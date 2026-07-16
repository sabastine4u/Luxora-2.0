import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    return storage.getItem<string[]>('luxora_recently_viewed', []);
  });

  useEffect(() => {
    storage.setItem('luxora_recently_viewed', recentlyViewed);
  }, [recentlyViewed]);

  const addRecentlyViewed = useCallback((id: string) => {
    setRecentlyViewed(prev => {
      const updated = prev.filter(pid => pid !== id);
      return [id, ...updated].slice(0, 10);
    });
  }, []);

  return { recentlyViewed, addRecentlyViewed, setRecentlyViewed };
}
