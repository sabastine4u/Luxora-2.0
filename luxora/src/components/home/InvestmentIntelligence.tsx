import { useEffect, useMemo, useState } from 'react';
import {
  MapPin,
  ArrowUpRight,
  BarChart3,
  Percent,
  TrendingUp,
} from 'lucide-react';

import {
  Reveal,
  SectionHeading,
} from '../ui/ui';

import {
  Section,
  Container,
} from '../layout';

import { marketplaceApi } from '../../api/marketplace.api';

interface InvestmentMetric {
  value: number | null;
  sufficientData: boolean;
  label?: string;
  sampleSize?: number;
}

interface InvestmentArea {
  name: string;
  score: number;
  yield: number | null;
  growth: number | null;
  sampleSize: number;
  sufficientData: boolean;
  rank: number;
}

interface InvestmentPeriod {
  period: string;
  label: string;
  averageAskingPrice: number;
  listings: number;
}

interface InvestmentIntelligenceResponse {
  sufficientData: boolean;

  dataScope?: string;

  metrics: {
    investmentScore: InvestmentMetric;
    rentalYield: InvestmentMetric;
    areaGrowth: InvestmentMetric;
  };

  priceTrend: {
    sufficientData: boolean;
    growth?: number | null;
    indicator?: string;
    periods: InvestmentPeriod[];
  };

  topAreas: InvestmentArea[];

  generatedAt?: string;
}

interface InvestmentApiResponse {
  intelligence?: InvestmentIntelligenceResponse;

  data?: {
    intelligence?: InvestmentIntelligenceResponse;
  };
}

export default function InvestmentIntelligence() {
  const [
    intelligence,
    setIntelligence,
  ] =
    useState<InvestmentIntelligenceResponse | null>(
      null,
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    hasError,
    setHasError,
  ] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadInvestmentIntelligence =
      async () => {
        try {
          setIsLoading(true);
          setHasError(false);

          const response =
            (await marketplaceApi.getPublicInvestmentIntelligence()) as unknown as InvestmentApiResponse;

          if (!isActive) {
            return;
          }

          const payload =
            response?.intelligence ??
            response?.data?.intelligence ??
            null;

          setIntelligence(payload);
        } catch (error) {
          if (!isActive) {
            return;
          }

          console.error(
            'Failed to load public investment intelligence:',
            error,
          );

          setIntelligence(null);
          setHasError(true);
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      };

    void loadInvestmentIntelligence();

    return () => {
      isActive = false;
    };
  }, []);

  const metricCards = useMemo(() => {
    if (!intelligence) {
      return [];
    }

    return [
      {
        label: 'Investment Score',
        value:
          intelligence.metrics
            .investmentScore.value,
        suffix: '/100',
        icon: BarChart3,
        color: 'text-emerald-400',
        note:
          intelligence.metrics
            .investmentScore.sufficientData
            ? 'Current signal'
            : 'Insufficient data',
      },

      {
        label: 'Rental Yield',
        value:
          intelligence.metrics
            .rentalYield.value,
        suffix: '%',
        icon: Percent,
        color: 'text-gold-400',
        note:
          intelligence.metrics
            .rentalYield.sufficientData
            ? `Based on ${intelligence.metrics.rentalYield.sampleSize ?? 0} listings`
            : 'Not available',
      },

      {
        label: 'Area Growth',
        value:
          intelligence.metrics
            .areaGrowth.value,
        suffix: '%',
        icon: TrendingUp,
        color: 'text-blue-400',
        note:
          intelligence.metrics
            .areaGrowth.sufficientData
            ? 'Historical signal'
            : 'Not enough history',
      },
    ];
  }, [intelligence]);

  const trendPeriods =
    intelligence?.priceTrend
      ?.periods ?? [];

  const chartPeriods =
    trendPeriods.slice(-12);

  const maxAskingPrice =
    chartPeriods.length > 0
      ? Math.max(
        ...chartPeriods.map(
          (period) =>
            period.averageAskingPrice,
        ),
      )
      : 0;

  const formatPrice =
    (value: number) => {
      if (value >= 1_000_000_000) {
        return `₦${(
          value / 1_000_000_000
        ).toFixed(1)}B`;
      }

      if (value >= 1_000_000) {
        return `₦${(
          value / 1_000_000
        ).toFixed(1)}M`;
      }

      if (value >= 1_000) {
        return `₦${(
          value / 1_000
        ).toFixed(0)}K`;
      }

      return `₦${value}`;
    };

  const formatMetricValue = (
    value: number | null,
    suffix: string,
  ) => {
    if (value === null) {
      return '—';
    }

    return (
      <>
        {value}
        <span className="text-sm text-ink/50">
          {suffix}
        </span>
      </>
    );
  };

  const getTrendLabel = () => {
    if (
      !intelligence?.priceTrend
        ?.sufficientData
    ) {
      return 'Limited history';
    }

    if (
      chartPeriods.length < 12
    ) {
      return `${chartPeriods.length} period${chartPeriods.length === 1
          ? ''
          : 's'
        } available`;
    }

    if (
      intelligence.priceTrend
        .growth === null ||
      intelligence.priceTrend
        .growth === undefined
    ) {
      return 'Trend available';
    }

    return `${intelligence.priceTrend
        .growth > 0
        ? '+'
        : ''
      }${intelligence.priceTrend
        .growth
      }%`;
  };

  return (
    <Section className="overflow-hidden bg-navy-950">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-850/40 to-transparent" />

      <Container className="relative">
        <Reveal>
          <SectionHeading
            eyebrow="Investment Intelligence"
            title={
              <>
                Decide with{' '}
                <span className="gold-text">
                  data, not guesswork
                </span>
              </>
            }
            subtitle="Current marketplace signals from Luxora's published property data."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          {/* Dashboard preview */}
          <Reveal
            className="lg:col-span-3"
            delay={50}
          >
            <div className="glass h-full rounded-3xl p-6 md:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-cream">
                    Market Analytics
                  </h3>

                  <p className="text-xs text-ink/50">
                    Current marketplace overview
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Current
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[1, 2, 3].map(
                      (item) => (
                        <div
                          key={item}
                          className="h-28 animate-pulse rounded-2xl border border-white/10 bg-navy-900/40"
                        />
                      ),
                    )}
                  </div>

                  <div className="h-44 animate-pulse rounded-2xl border border-white/10 bg-navy-900/40" />
                </div>
              ) : hasError ||
                !intelligence ? (
                <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-white/10 bg-navy-900/40 text-center">
                  <div>
                    <BarChart3 className="mx-auto mb-3 h-8 w-8 text-gold-400/40" />

                    <p className="text-sm font-medium text-cream">
                      Investment intelligence is
                      temporarily unavailable.
                    </p>

                    <p className="mt-1 text-xs text-ink/50">
                      Please check back shortly.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Metric cards */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    {metricCards.map(
                      (metric) => {
                        const Icon =
                          metric.icon;

                        return (
                          <div
                            key={
                              metric.label
                            }
                            className="rounded-2xl border border-white/10 bg-navy-900/40 p-4"
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <Icon
                                className={`h-5 w-5 ${metric.color}`}
                              />

                              <span className="text-[10px] font-semibold text-ink/40">
                                {metric.note}
                              </span>
                            </div>

                            <div className="font-heading text-2xl font-bold text-cream">
                              {formatMetricValue(
                                metric.value,
                                metric.suffix,
                              )}
                            </div>

                            <div className="text-xs text-ink/50">
                              {metric.label}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>

                  {/* Asking price trend */}
                  <div className="mt-6 rounded-2xl border border-white/10 bg-navy-900/40 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-ink/70">
                        Asking Price Trend
                      </span>

                      <span className="text-xs text-gold-300">
                        {getTrendLabel()}
                      </span>
                    </div>

                    {chartPeriods.length > 0 ? (
                      <>
                        <div className="flex h-32 items-end gap-1.5">
                          {chartPeriods.map(
                            (
                              period,
                              index,
                            ) => {
                              const height =
                                maxAskingPrice >
                                  0
                                  ? Math.max(
                                    12,
                                    (period.averageAskingPrice /
                                      maxAskingPrice) *
                                    100,
                                  )
                                  : 12;

                              return (
                                <div
                                  key={`${period.period}-${index}`}
                                  className="group flex h-full flex-1 flex-col items-center justify-end"
                                >
                                  <div className="mb-1 hidden text-[9px] text-ink/50 group-hover:block">
                                    {formatPrice(
                                      period.averageAskingPrice,
                                    )}
                                  </div>

                                  <div
                                    className="w-full rounded-t bg-gradient-to-t from-gold-600/40 to-gold-400 transition-all duration-500 hover:from-gold-500/60 hover:to-gold-300"
                                    style={{
                                      height: `${height}%`,
                                    }}
                                    title={`${period.label}: ${formatPrice(
                                      period.averageAskingPrice,
                                    )}`}
                                  />
                                </div>
                              );
                            },
                          )}
                        </div>

                        <div className="mt-2 flex justify-between text-[10px] text-ink/40">
                          {chartPeriods.map(
                            (period) => (
                              <span
                                key={
                                  period.period
                                }
                              >
                                {
                                  period.label
                                }
                              </span>
                            ),
                          )}
                        </div>

                        <p className="mt-4 text-[10px] leading-relaxed text-ink/40">
                          Published asking-price
                          trend. This is not closed-sale
                          appreciation.
                        </p>
                      </>
                    ) : (
                      <div className="flex h-32 items-center justify-center text-xs text-ink/50">
                        No historical asking-price
                        periods are available yet.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </Reveal>

          {/* Area breakdown */}
          <Reveal
            className="lg:col-span-2"
            delay={100}
          >
            <div className="h-full rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
              <div className="mb-5 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gold-400" />

                <h3 className="font-heading text-lg font-semibold text-cream">
                  Top Performing Areas
                </h3>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(
                    (item) => (
                      <div
                        key={item}
                        className="h-24 animate-pulse rounded-2xl border border-white/5 bg-white/[0.03]"
                      />
                    ),
                  )}
                </div>
              ) : intelligence &&
                intelligence.topAreas
                  .length > 0 ? (
                <div className="space-y-3">
                  {intelligence.topAreas.map(
                    (area) => (
                      <div
                        key={area.name}
                        className="group rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-all hover:border-gold-400/20"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-ink/40">
                              #
                              {
                                area.rank
                              }
                            </span>

                            <span className="text-sm font-semibold text-cream">
                              {area.name}
                            </span>
                          </div>

                          <ArrowUpRight className="h-4 w-4 text-ink/30 transition-colors group-hover:text-gold-400" />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                          <div>
                            <span className="text-ink/40">
                              Score{' '}
                            </span>

                            <span className="font-semibold text-cream">
                              {area.score}
                            </span>
                          </div>

                          <div>
                            <span className="text-ink/40">
                              Yield{' '}
                            </span>

                            <span className="font-semibold text-gold-300">
                              {area.yield !==
                                null
                                ? `${area.yield}%`
                                : '—'}
                            </span>
                          </div>

                          <div>
                            <span className="text-ink/40">
                              Growth{' '}
                            </span>

                            <span className="font-semibold text-emerald-400">
                              {area.growth !==
                                null
                                ? `${area.growth >
                                  0
                                  ? '+'
                                  : ''
                                }${area.growth}%`
                                : '—'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gold-gradient"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  area.score,
                                ),
                              )}%`,
                            }}
                          />
                        </div>

                        <div className="mt-2 text-[10px] text-ink/35">
                          {area.sampleSize}{' '}
                          published listing
                          {area.sampleSize ===
                            1
                            ? ''
                            : 's'}
                          {area.sufficientData
                            ? ' · sufficient sample'
                            : ' · limited sample'}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div className="flex min-h-[260px] items-center justify-center text-center">
                  <div>
                    <MapPin className="mx-auto mb-3 h-8 w-8 text-gold-400/40" />

                    <p className="text-sm font-medium text-cream">
                      Area intelligence is not
                      available yet.
                    </p>

                    <p className="mt-1 text-xs text-ink/50">
                      More published market data is
                      needed.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}