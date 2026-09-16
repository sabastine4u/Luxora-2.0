import { useCallback, useEffect, useState } from 'react';

export function usePropertyManagementResource<T>(load: () => Promise<T>, dependencies: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (isInitial = false) => {
    isInitial ? setLoading(true) : setRefreshing(true);
    setError(null);
    try { setData(await load()); }
    catch (err: any) { setError(err?.message || 'Unable to load this information.'); }
    finally { setLoading(false); setRefreshing(false); }
  // Callers deliberately own their stable load callback/dependencies.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => { void refresh(true); }, [refresh]);
  return { data, setData, loading, refreshing, error, refresh };
}
