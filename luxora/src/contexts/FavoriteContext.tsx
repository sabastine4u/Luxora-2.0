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

interface FavoriteRecord {
  _id: string;

  // The backend Favorite relationship includes timestamps.
  createdAt?: string;
  updatedAt?: string;

  property: {
    _id: string;
    title: string;
    [key: string]: unknown;
  } | null;
}

interface FavoriteContextType {
  favoriteProperties: string[];

  // Expose the complete Favorite records to pages that need
  // Property data and saved timestamps.
  favoriteRecords: FavoriteRecord[];

  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => Promise<void>;
  clearFavorites: () => Promise<void>;
  favoriteCount: number;
}

const FavoriteContext =
  createContext<
    FavoriteContextType | undefined
  >(undefined);

export function FavoriteProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    isAuthenticated,
  } = useSession();

  const navigate =
    useNavigate();

  // Store only the Property IDs, while the backend remains the source of truth.
  const [
    favoriteProperties,
    setFavoriteProperties,
  ] = useState<string[]>([]);

  // Keep the complete Favorite records returned by the backend.
  const [
    favoriteRecords,
    setFavoriteRecords,
  ] = useState<FavoriteRecord[]>(
    [],
  );

  // Load the authenticated user's Favorites from the backend.
  const loadFavorites =
    useCallback(async () => {
      if (!isAuthenticated) {
        setFavoriteProperties([]);
        setFavoriteRecords([]);
        return;
      }

      try {
        const response =
          (await favoriteApi.getFavorites()) as unknown as {
            favorites?: FavoriteRecord[];
          };

        const records =
          response.favorites || [];

        setFavoriteRecords(
          records,
        );

        const favoriteIds =
          records
            .map(
              (favorite) =>
                favorite.property?._id,
            )
            .filter(
              (
                id,
              ): id is string =>
                typeof id ===
                'string',
            );

        setFavoriteProperties(
          favoriteIds,
        );
      } catch (error) {
        console.error(
          'Failed to load favorites:',
          error,
        );

        setFavoriteProperties(
          [],
        );

        setFavoriteRecords(
          [],
        );
      }
    }, [isAuthenticated]);

  useEffect(() => {
    void loadFavorites();
  }, [loadFavorites]);

  // Add or remove a Property using the real backend API.
  const toggleFavorite =
    useCallback(
      async (id: string) => {
        if (!isAuthenticated) {
          navigate(
            ROUTES.LOGIN,
          );
          return;
        }

        const isAdding =
          !favoriteProperties.includes(
            id,
          );

        try {
          if (isAdding) {
            // Save the Favorite in MongoDB.
            await favoriteApi.addFavorite(
              id,
            );

            // Update local UI state only after the backend succeeds.
            setFavoriteProperties(
              (prev) =>
                prev.includes(id)
                  ? prev
                  : [...prev, id],
            );

            // Reload the populated Favorite records so createdAt
            // and the current Property data remain authoritative.
            await loadFavorites();

            publishEvent(
              ENTERPRISE_EVENTS
                .BUYER_PROPERTY_SAVED,
              {
                propertyId: id,
                timestamp:
                  new Date().toISOString(),
              },
            );
          } else {
            // Remove the Favorite from MongoDB.
            await favoriteApi.removeFavorite(
              id,
            );

            // Update local UI state only after the backend succeeds.
            setFavoriteProperties(
              (prev) =>
                prev.filter(
                  (
                    propertyId,
                  ) =>
                    propertyId !==
                    id,
                ),
            );

            // Refresh the populated Favorite records.
            await loadFavorites();
          }
        } catch (error) {
          console.error(
            'Failed to update favorite:',
            error,
          );

          // Reconcile local state with the backend if an update failed.
          await loadFavorites();
        }
      },
      [
        favoriteProperties,
        isAuthenticated,
        navigate,
        loadFavorites,
      ],
    );

  const isFavorite =
    useCallback(
      (id: string) => {
        return favoriteProperties.includes(
          id,
        );
      },
      [favoriteProperties],
    );

  const clearFavorites =
    useCallback(async () => {
      if (!isAuthenticated) {
        setFavoriteProperties(
          [],
        );
        setFavoriteRecords(
          [],
        );
        return;
      }

      try {
        const ids = [
          ...favoriteProperties,
        ];

        await Promise.all(
          ids.map((propertyId) =>
            favoriteApi.removeFavorite(
              propertyId,
            ),
          ),
        );

        setFavoriteProperties(
          [],
        );

        setFavoriteRecords(
          [],
        );
      } catch (error) {
        console.error(
          'Failed to clear favorites:',
          error,
        );

        await loadFavorites();
      }
    }, [
      favoriteProperties,
      isAuthenticated,
      loadFavorites,
    ]);

  return (
    <FavoriteContext.Provider
      value={{
        favoriteProperties,
        favoriteRecords,
        isFavorite,
        toggleFavorite,
        clearFavorites,
        favoriteCount:
          favoriteProperties.length,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
  const context =
    useContext(
      FavoriteContext,
    );

  if (
    context === undefined
  ) {
    throw new Error(
      'useFavorites must be used within a FavoriteProvider',
    );
  }

  return context;
}