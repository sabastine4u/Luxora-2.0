import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { storage } from '../utils/storage';
import { useSession } from './SessionContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { publishEvent } from '../modules/enterprise/events/publishEvent';
import { ENTERPRISE_EVENTS } from '../modules/enterprise/events/registry';

interface FavoriteContextType {
  favoriteProperties: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  clearFavorites: () => void;
  favoriteCount: number;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

const STORAGE_KEY = 'luxora_favorites';

export function FavoriteProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useSession();
  const navigate = useNavigate();

  const [favoriteProperties, setFavoriteProperties] = useState<string[]>(() => {
    return storage.getItem<string[]>(STORAGE_KEY, []);
  });

  useEffect(() => {
    storage.setItem(STORAGE_KEY, favoriteProperties);
  }, [favoriteProperties]);

  const toggleFavorite = useCallback((id: string) => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    const isAdding = !favoriteProperties.includes(id);

    if (isAdding) {
      publishEvent(ENTERPRISE_EVENTS.BUYER_PROPERTY_SAVED, {
        propertyId: id,
        buyerId: 'current-user-buyer',
        timestamp: new Date().toISOString()
      });
      setFavoriteProperties(prev => [...prev, id]);
    } else {
      setFavoriteProperties(prev => prev.filter(pid => pid !== id));
    }
  }, [isAuthenticated, navigate, favoriteProperties]);

  const isFavorite = useCallback((id: string) => {
    return favoriteProperties.includes(id);
  }, [favoriteProperties]);

  const clearFavorites = useCallback(() => {
    setFavoriteProperties([]);
  }, []);

  return (
    <FavoriteContext.Provider value={{
      favoriteProperties,
      isFavorite,
      toggleFavorite,
      clearFavorites,
      favoriteCount: favoriteProperties.length
    }}>
      {children}
    </FavoriteContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
}
