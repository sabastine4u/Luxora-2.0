import { useCallback, useEffect, useState } from 'react';

export function useIntelligenceQuery<T>(request: () => Promise<{ data: { data: T } }>, dependencies: unknown[] = []) {
  const [data, setData] = useState<T | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async () => { setLoading(true); setError(''); try { setData((await request()).data); } catch (err: any) { setError(err?.message || 'Unable to load Intelligence data.'); } finally { setLoading(false); } }, dependencies);
  useEffect(() => { load(); }, [load]); return { data, loading, error, retry: load };
}
export function IntelligenceState({ loading, error, retry, empty, insufficient, children }: any) {
  if (loading) return <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-10 text-center text-ink/60">Loading Intelligence data…</div>;
  if (error) return <div className="rounded-2xl border border-rose-400/30 bg-navy-800/50 p-8 text-center text-ink/60">{error}<button className="block mx-auto mt-4 text-gold-400" onClick={retry}>Retry</button></div>;
  if (insufficient || empty) return <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-10 text-center text-ink/60">{insufficient ? 'Insufficient data is available for this analysis.' : 'No matching Intelligence data is available.'}<button className="block mx-auto mt-4 text-gold-400" onClick={retry}>Retry</button></div>;
  return children;
}
