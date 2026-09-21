import { useEffect, useMemo, useState } from 'react';
import {
  Star,
  ArrowRight,
  Award,
  Building2,
  Users,
} from 'lucide-react';

import {
  Reveal,
  SectionHeading,
  GoldButton,
} from '../ui/ui';

import { Section, Container } from '../layout';

import { agencyApi } from '../../api/agency.api';
import { agentApi } from '../../api/agent.api';

import type {
  PublicAgency,
  PublicAgent,
} from '../../types';

import { AgencyCard } from '../agency/AgencyCard';
import { AgentCard } from '../agent/AgentCard';

export default function AgencySpotlight() {
  const [agencies, setAgencies] =
    useState<PublicAgency[]>([]);

  const [agents, setAgents] =
    useState<PublicAgent[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [hasError, setHasError] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    const loadMarketplacePeople = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        const [
          agenciesResult,
          agentsResult,
        ] = await Promise.allSettled([
          agencyApi.getPublicAgencies({
            page: 1,
            limit: 100,
            sort: 'listings',
          }),

          agentApi.getPublicAgents({
            page: 1,
            limit: 100,
            sort: 'listings',
          }),
        ]);

        if (!mounted) return;

        let resolvedAgencies: PublicAgency[] =
          [];

        let resolvedAgents: PublicAgent[] =
          [];

        if (
          agenciesResult.status ===
          'fulfilled'
        ) {
          const response =
            agenciesResult.value;

          resolvedAgencies =
            Array.isArray(
              response?.agencies,
            )
              ? response.agencies
              : [];
        }

        if (
          agentsResult.status ===
          'fulfilled'
        ) {
          const response =
            agentsResult.value;

          resolvedAgents =
            Array.isArray(
              response?.agents,
            )
              ? response.agents
              : [];
        }

        const sortedAgencies =
          [...resolvedAgencies]
            .sort((a, b) => {
              if (
                b.listingCount !==
                a.listingCount
              ) {
                return (
                  b.listingCount -
                  a.listingCount
                );
              }

              if (
                b.agentCount !==
                a.agentCount
              ) {
                return (
                  b.agentCount -
                  a.agentCount
                );
              }

              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            })
            .slice(0, 4);

        const sortedAgents =
          [...resolvedAgents]
            .filter(
              (agent) =>
                agent.status === 'Active',
            )
            .sort((a, b) => {
              if (
                b.listingCount !==
                a.listingCount
              ) {
                return (
                  b.listingCount -
                  a.listingCount
                );
              }

              if (
                b.yearsOfExperience !==
                a.yearsOfExperience
              ) {
                return (
                  b.yearsOfExperience -
                  a.yearsOfExperience
                );
              }

              return a.name.localeCompare(
                b.name,
              );
            })
            .slice(0, 4);

        setAgencies(sortedAgencies);
        setAgents(sortedAgents);

        if (
          agenciesResult.status ===
          'rejected' &&
          agentsResult.status ===
          'rejected'
        ) {
          setHasError(true);
        }
      } catch (error) {
        console.error(
          'Failed to load homepage Agency Spotlight:',
          error,
        );

        if (!mounted) return;

        setAgencies([]);
        setAgents([]);
        setHasError(true);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadMarketplacePeople();

    return () => {
      mounted = false;
    };
  }, []);

  const hasAgencyData =
    agencies.length > 0;

  const hasAgentData =
    agents.length > 0;

  const showEmptyState = useMemo(
    () =>
      !isLoading &&
      !hasError &&
      !hasAgencyData &&
      !hasAgentData,
    [
      isLoading,
      hasError,
      hasAgencyData,
      hasAgentData,
    ],
  );

  return (
    <Section
      id="agencies"
      className="overflow-hidden"
    >
      <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-blue-500/5 blur-[100px]" />

      <Container>
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              center={false}
              eyebrow="Agency Spotlight"
              title={
                <>
                  Active{' '}
                  <span className="gold-text">
                    agencies & agents
                  </span>
                </>
              }
              subtitle="Explore agencies and agents currently active in the Luxora marketplace."
            />

            <GoldButton
              size="md"
              className="shrink-0"
              onClick={() =>
              (window.location.href =
                '/agencies')
              }
            >
              Explore Agencies
              <ArrowRight className="h-4 w-4" />
            </GoldButton>
          </div>
        </Reveal>

        {isLoading ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                <div className="mb-5 flex items-center gap-2">
                  <Award className="h-5 w-5 text-gold-400" />
                  <h3 className="font-heading text-lg font-semibold text-cream">
                    Agencies
                  </h3>
                </div>

                <div className="space-y-3">
                  {Array.from({
                    length: 3,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-3xl border border-white/5 bg-white/[0.03] p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-14 w-14 animate-pulse rounded-2xl bg-white/10" />

                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
                          <div className="h-3 w-1/3 animate-pulse rounded bg-white/10" />
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
                        <div className="h-8 animate-pulse rounded bg-white/10" />
                        <div className="h-8 animate-pulse rounded bg-white/10" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={50}>
              <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                <div className="mb-5 flex items-center gap-2">
                  <Star className="h-5 w-5 text-gold-400" />
                  <h3 className="font-heading text-lg font-semibold text-cream">
                    Agents
                  </h3>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {Array.from({
                    length: 4,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/5 bg-white/[0.03] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 animate-pulse rounded-full bg-white/10" />

                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
                          <div className="h-3 w-1/2 animate-pulse rounded bg-white/10" />
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-white/5 pt-3">
                        <div className="h-7 animate-pulse rounded bg-white/10" />
                        <div className="h-7 animate-pulse rounded bg-white/10" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        ) : showEmptyState ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-navy-800/50 px-6 py-12 text-center">
            <Building2 className="mx-auto mb-4 h-10 w-10 text-white/10" />

            <p className="font-medium text-cream">
              No active marketplace agencies or agents
              are available right now.
            </p>

            <p className="mt-2 text-sm text-ink/50">
              New marketplace profiles will appear here
              when they become active.
            </p>
          </div>
        ) : hasError ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-navy-800/50 px-6 py-12 text-center">
            <Building2 className="mx-auto mb-4 h-10 w-10 text-white/10" />

            <p className="font-medium text-cream">
              Marketplace profiles are temporarily
              unavailable.
            </p>

            <p className="mt-2 text-sm text-ink/50">
              Please try again shortly.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* Agencies */}
            <Reveal>
              <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                <div className="mb-5 flex items-center gap-2">
                  <Award className="h-5 w-5 text-gold-400" />

                  <h3 className="font-heading text-lg font-semibold text-cream">
                    Active Agencies
                  </h3>
                </div>

                {hasAgencyData ? (
                  <div className="space-y-3">
                    {agencies.map(
                      (agency, index) => (
                        <AgencyCard
                          key={agency.id}
                          agency={agency}
                          index={index}
                        />
                      ),
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
                    <Building2 className="mx-auto mb-3 h-8 w-8 text-white/10" />

                    <p className="font-medium text-cream">
                      No active agencies with marketplace
                      activity yet.
                    </p>
                  </div>
                )}
              </div>
            </Reveal>

            {/* Agents */}
            <Reveal delay={50}>
              <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                <div className="mb-5 flex items-center gap-2">
                  <Star className="h-5 w-5 text-gold-400" />

                  <h3 className="font-heading text-lg font-semibold text-cream">
                    Active Agents
                  </h3>
                </div>

                {hasAgentData ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {agents.map(
                      (agent, index) => (
                        <AgentCard
                          key={agent.id}
                          agent={agent}
                          index={index}
                        />
                      ),
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
                    <Users className="mx-auto mb-3 h-8 w-8 text-white/10" />

                    <p className="font-medium text-cream">
                      No active agents available yet.
                    </p>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        )}
      </Container>
    </Section>
  );
}