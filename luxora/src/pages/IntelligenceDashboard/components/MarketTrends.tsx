import { TrendingUp } from 'lucide-react';
import { intelligenceApi } from '../../../api/intelligence.api';
import { useIntelligenceQuery } from '../useIntelligenceQuery';

const money = (value: unknown) =>
  typeof value === 'number'
    ? `₦${value.toLocaleString()}`
    : '—';

const formatPeriod = (period: any) => {
  const year = period?._id?.year;
  const month = period?._id?.month;

  if (
    typeof year === 'number' &&
    typeof month === 'number'
  ) {
    return new Intl.DateTimeFormat('en-NG', {
      month: 'long',
      year: 'numeric',
    }).format(
      new Date(year, month - 1, 1),
    );
  }

  if (typeof period?.period === 'string') {
    return period.period;
  }

  return 'Unspecified';
};

export default function MarketTrends() {
  const {
    data,
    loading,
    error,
    retry,
  } = useIntelligenceQuery(
    () =>
      intelligenceApi.getMarketTrends({}),
    [],
  );

  const periods = Array.isArray(
    data?.periods,
  )
    ? data.periods
    : [];

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-10 text-center text-ink/60">
        Loading recorded market trends…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-400/30 bg-navy-800/50 p-10 text-center text-ink/60">
        <p>{error}</p>

        <button
          onClick={retry}
          className="mx-auto mt-4 block text-gold-400"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!periods.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-10 text-center text-ink/60">
        <p>
          No listing history is available.
        </p>

        <button
          onClick={retry}
          className="mx-auto mt-4 block text-gold-400"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-cream">
          <TrendingUp className="h-6 w-6 text-gold-400" />
          Market Trends
        </h2>

        <p className="text-sm text-ink/60">
          Recorded asking-price, asking-rent,
          and listing counts by returned
          period. No forecast is inferred.
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-navy-800/50">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase text-ink/60">
              <tr>
                <th className="p-4">
                  Period
                </th>

                <th className="p-4">
                  Average asking price
                </th>

                <th className="p-4">
                  Average asking rent
                </th>

                <th className="p-4">
                  Listings recorded
                </th>
              </tr>
            </thead>

            <tbody>
              {periods.map(
                (
                  period: any,
                  index: number,
                ) => (
                  <tr
                    className="border-b border-white/5"
                    key={
                      period?._id?.year &&
                        period?._id?.month
                        ? `${period._id.year}-${period._id.month}`
                        : period.period ||
                        index
                    }
                  >
                    <td className="p-4 text-cream">
                      {formatPeriod(
                        period,
                      )}
                    </td>

                    <td className="p-4 text-ink/70">
                      {money(
                        period.averageAskingPrice,
                      )}
                    </td>

                    <td className="p-4 text-ink/70">
                      {money(
                        period.averageAskingRent,
                      )}
                    </td>

                    <td className="p-4 text-ink/70">
                      {typeof period.listings ===
                        'number'
                        ? period.listings.toLocaleString()
                        : '—'}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}