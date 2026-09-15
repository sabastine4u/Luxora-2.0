import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { ReactNode } from 'react';
import { useSession } from './SessionContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { publishEvent } from '../modules/enterprise/events/publishEvent';
import { ENTERPRISE_EVENTS } from '../modules/enterprise/events/registry';
import { favoriteApi } from '../api/favorite.api';




// Describe the populated Favorite record returned by the backend.
interface FavoriteRecord {
  _id: string;
  property: {
    _id: string;
    title: string;
    [key: string]: unknown;
  } | null;
}

interface FavoriteContextType {
  favoriteProperties: string[];

  // Expose the complete Favorite records to pages that need Property data.
  favoriteRecords: FavoriteRecord[];

  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => Promise<void>;
  clearFavorites: () => Promise<void>;
  favoriteCount: number;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined,
);

export function FavoriteProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useSession();
  const navigate = useNavigate();

  // Store only the Property IDs, while the backend remains the source of truth.
  const [favoriteProperties, setFavoriteProperties] = useState<string[]>([]);

  // Keep the complete Favorite records returned by the backend.
  const [favoriteRecords, setFavoriteRecords] = useState<FavoriteRecord[]>([]);

  // Load the authenticated user's Favorites from the backend.
  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      // Clear both the favorite IDs and populated records when logged out.
      setFavoriteProperties([]);
      setFavoriteRecords([]);
      return;
    }

    try {

      // Read the populated Favorite records returned by the backend.
      const response = (await favoriteApi.getFavorites()) as unknown as {
        favorites?: FavoriteRecord[];
      };

      // Keep the complete records for pages that need the real Property data.
      setFavoriteRecords(response.favorites || []);

      // Extract the real Property IDs from the populated Favorite records.
      const favoriteIds = (response.favorites || [])
        .map((favorite) => favorite.property?._id)
        .filter((id): id is string => typeof id === 'string');



      setFavoriteProperties(favoriteIds);
    } catch (error) {
      // Keep the UI usable if Favorites cannot be loaded.
      console.error('Failed to load favorites:', error);
     // Clear both representations if loading Favorites fails.
setFavoriteProperties([]);
setFavoriteRecords([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Add or remove a Property using the real backend API.
  const toggleFavorite = useCallback(
    async (id: string) => {
      // Unauthenticated users must log in before saving a Property.
      if (!isAuthenticated) {
        navigate(ROUTES.LOGIN);
        return;
      }

      const isAdding = !favoriteProperties.includes(id);

      try {
        if (isAdding) {
          // Save the Favorite in MongoDB.
          await favoriteApi.addFavorite(id);

          // Update local UI state only after the backend succeeds.
          setFavoriteProperties((prev) =>
            prev.includes(id) ? prev : [...prev, id],
          );

          // Reload the populated Favorite records after adding the Property.
          await loadFavorites();

          // Preserve the existing enterprise event behaviour.
          publishEvent(ENTERPRISE_EVENTS.BUYER_PROPERTY_SAVED, {
            propertyId: id,
            timestamp: new Date().toISOString(),
          });
        } else {
          // Remove the Favorite from MongoDB.
          await favoriteApi.removeFavorite(id);

          // Update local UI state only after the backend succeeds.
          setFavoriteProperties((prev) =>
            prev.filter((propertyId) => propertyId !== id),
          );

          // Reload the populated Favorite records after removing the Property.
          await loadFavorites();
        }
      } catch (error) {
        // Log API failures without corrupting the local Favorites state.
        console.error('Failed to update favorite:', error);
      }
    },
    [favoriteProperties, isAuthenticated, navigate, loadFavorites],
  );

  // Check whether a Property currently exists in the loaded Favorites.
  const isFavorite = useCallback(
    (id: string) => {
      return favoriteProperties.includes(id);
    },
    [favoriteProperties],
  );

  // Clear the current local representation and refresh it from the backend.
  const clearFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavoriteProperties([]);
      return;
    }

    try {
      // Snapshot the current IDs so we can remove them one by one.
      const ids = [...favoriteProperties];

      // Delete every Favorite from the backend.
      await Promise.all(
        ids.map((propertyId) => favoriteApi.removeFavorite(propertyId)),
      );

      // Clear the local UI state after successful deletion.
      setFavoriteProperties([]);
    } catch (error) {
      // Reload from the backend so local state stays trustworthy after an error.
      console.error('Failed to clear favorites:', error);
      await loadFavorites();
    }
  }, [favoriteProperties, isAuthenticated, loadFavorites]);

  return (
    <FavoriteContext.Provider
      value={{
        favoriteProperties,
        favoriteRecords,
        isFavorite,
        toggleFavorite,
        clearFavorites,
        favoriteCount: favoriteProperties.length,
      }}
    >
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