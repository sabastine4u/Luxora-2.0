
import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';

type RecentlyViewedState = {
  userId: string | null;
  propertyIds: string[];
};

type RecentlyViewedUpdate =
  | string[]
  | ((previous: string[]) => string[]);

export function useRecentlyViewed(userId?: string | null) {
  const activeUserId = userId || null;

  // Each account gets its own browsing history.
  const storageKey = activeUserId
    ? `luxora_recently_viewed:${activeUserId}`
    : null;

  const readHistory = useCallback((): string[] => {
    if (!storageKey) {
      return [];
    }

    return storage.getItem<string[]>(storageKey, []);
  }, [storageKey]);

  const [state, setState] = useState<RecentlyViewedState>(() => ({
    userId: activeUserId,
    propertyIds: readHistory(),
  }));

  // Load the correct history whenever the authenticated account changes.
  useEffect(() => {
    setState({
      userId: activeUserId,
      propertyIds: readHistory(),
    });
  }, [activeUserId, readHistory]);

  // Persist history only under the matching account's storage key.
  useEffect(() => {
    if (!storageKey || state.userId !== activeUserId) {
      return;
    }

    storage.setItem(storageKey, state.propertyIds);
  }, [activeUserId, state, storageKey]);

  // Never display the previous account's history during an account switch.
  const recentlyViewed =
    state.userId === activeUserId
      ? state.propertyIds
      : readHistory();

  const setRecentlyViewed = useCallback(
    (update: RecentlyViewedUpdate) => {
      if (!activeUserId || !storageKey) {
        return;
      }

      setState((previousState) => {
        const previousIds =
          previousState.userId === activeUserId
            ? previousState.propertyIds
            : storage.getItem<string[]>(storageKey, []);

        const nextIds =
          typeof update === 'function'
            ? update(previousIds)
            : update;

        return {
          userId: activeUserId,
          propertyIds: nextIds,
        };
      });
    },
    [activeUserId, storageKey],
  );

  const addRecentlyViewed = useCallback(
    (id: string) => {
      setRecentlyViewed((previous) => {
        const updated = previous.filter(
          (propertyId) => propertyId !== id,
        );

        return [id, ...updated].slice(0, 10);
      });
    },
    [setRecentlyViewed],
  );

  return {
    recentlyViewed,
    addRecentlyViewed,
    setRecentlyViewed,
  };
}
