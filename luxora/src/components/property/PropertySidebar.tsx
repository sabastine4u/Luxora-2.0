import { useEffect, useState } from 'react';
import {
  Calendar,
  Phone,
  Mail,
  AlertTriangle,
  Heart,
  Scale,
  Loader2,
  MessageCircle,
  HandCoins,
} from 'lucide-react';
import type {
  Property,
  PublicAgent,
  PublicAgency,
} from '../../types';
import {
  GoldButton,
  GhostButton,
} from '../ui/ui';
import { MakeOfferModal } from './MakeOfferModal';
import { useSession } from '../../contexts/SessionContext';
import { useFavorites } from '../../contexts/FavoriteContext';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { agentApi } from '../../api/agent.api';
import { agencyApi } from '../../api/agency.api';

interface PropertySidebarProps {
  property: Property;
  onContactClick?: () => void;
}

export function PropertySidebar({
  property,
  onContactClick,
}: PropertySidebarProps) {
  const {
    toggleCompareProperty,
    openScheduleViewingModal,
    openReportListingModal,
  } = useSession();

  const { isFavorite, toggleFavorite } =
    useFavorites();

  const { showToast } = useToast();

  const navigate = useNavigate();

  const [loadingAction, setLoadingAction] =
    useState<string | null>(null);

  const [
    isMakeOfferModalOpen,
    setIsMakeOfferModalOpen,
  ] = useState(false);

  /*
   * Resolve the real public Agent and Agency profiles.
   *
   * We do not generate these slugs from the display names
   * because the public marketplace uses the canonical slugs
   * returned by the backend.
   */
  const [publicAgent, setPublicAgent] =
    useState<PublicAgent | null>(null);

  const [publicAgency, setPublicAgency] =
    useState<PublicAgency | null>(null);

  useEffect(() => {
    let isActive = true;

    const resolvePublicProfiles =
      async () => {
        /*
         * The Property mapper preserves the real Agent database ID
         * in property.agent.id.
         */
        if (!property.agent.id) {
          setPublicAgent(null);
          setPublicAgency(null);
          return;
        }

        try {
          /*
           * Load the same public directories used by the
           * Agent Details and Agency Details pages.
           */
          const [
            agentsResponse,
            agenciesResponse,
          ] = await Promise.all([
            agentApi.getPublicAgents({
              page: 1,
              limit: 100,
            }),

            agencyApi.getPublicAgencies({
              page: 1,
              limit: 100,
            }),
          ]);

          if (!isActive) {
            return;
          }

          const publicAgents =
            Array.isArray(
              agentsResponse?.agents,
            )
              ? (agentsResponse.agents as PublicAgent[])
              : [];

          const publicAgencies =
            Array.isArray(
              agenciesResponse?.agencies,
            )
              ? (agenciesResponse.agencies as PublicAgency[])
              : [];

          /*
           * Match the Property's Agent ID to the real
           * public Agent record.
           *
           * This gives us the canonical public slug.
           */
          const matchedAgent =
            publicAgents.find(
              (agent) =>
                agent.id ===
                property.agent.id,
            ) || null;

          setPublicAgent(
            matchedAgent,
          );

          /*
           * The public Agent response contains the real Agency ID.
           * Use that ID to find the canonical public Agency slug.
           */
          const matchedAgency =
            matchedAgent?.agency?.id
              ? publicAgencies.find(
                  (agency) =>
                    agency.id ===
                    matchedAgent.agency?.id,
                ) || null
              : null;

          setPublicAgency(
            matchedAgency,
          );
        } catch (error) {
          if (!isActive) {
            return;
          }

          console.error(
            'Failed to resolve public Agent/Agency profiles:',
            error,
          );

          setPublicAgent(null);
          setPublicAgency(null);
        }
      };

    void resolvePublicProfiles();

    return () => {
      isActive = false;
    };
  }, [property.agent.id]);

  const saved = isFavorite(
    property.id,
  );

  /*
   * Normalize the transaction type coming from the
   * Property mapper so the Make Offer action does not
   * disappear because of casing or whitespace.
   */
  const transactionType =
    String(
      property.transactionType || '',
    )
      .trim()
      .toLowerCase();

  const canMakeOffer =
    transactionType === 'buy';

  const executeWithLoading = (
    actionKey: string,
    callback: () => void,
  ) => {
    setLoadingAction(actionKey);

    setTimeout(() => {
      setLoadingAction(null);
      callback();
    }, 400);
  };

  const handleSaveClick = () => {
    executeWithLoading(
      'save',
      () => {
        toggleFavorite(
          property.id,
        );
      },
    );
  };

  const handleCompareClick = () => {
    executeWithLoading(
      'compare',
      () => {
        const result =
          toggleCompareProperty(
            property.id,
          );

        if (
          result ===
          'limit_reached'
        ) {
          showToast({
            type: 'warning',
            title:
              'Limit Reached',
            description:
              'You can compare up to 4 properties.',
          });
        } else if (
          result === 'added'
        ) {
          showToast({
            type: 'success',
            title:
              'Added to Compare',
            description:
              'Property added to your compare list.',
          });
        } else if (
          result === 'exists'
        ) {
          showToast({
            type: 'info',
            title:
              'Already in Compare',
            description:
              'Property is already in your compare list.',
          });
        }
      },
    );
  };

  const handleContactClick =
    () => {
      if (onContactClick) {
        executeWithLoading(
          'contact',
          onContactClick,
        );
      }
    };

  const handleMakeOfferClick =
    () => {
      if (!canMakeOffer) {
        showToast({
          type: 'info',
          title:
            'Offer Unavailable',
          description:
            'Offers are currently available for properties listed for sale.',
        });

        return;
      }

      setIsMakeOfferModalOpen(
        true,
      );
    };

  return (
    <div className="relative space-y-6 pb-6 lg:sticky lg:top-24">
      {/* Agent Card */}
      <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md md:p-8">
        <h3 className="mb-6 font-heading text-lg font-semibold text-cream">
          Listed By
        </h3>

        <div className="mb-8 flex items-start gap-4">
          {/* Agent Image */}
          <button
            type="button"
            disabled={
              !publicAgent?.slug
            }
            onClick={() => {
              if (
                !publicAgent?.slug
              ) {
                return;
              }

              navigate(
                ROUTES.AGENT_DETAILS.replace(
                  ':slug',
                  publicAgent.slug,
                ),
              );
            }}
            className="shrink-0 transition-transform hover:scale-105 focus:outline-none disabled:cursor-default"
            aria-label={`View ${property.agent.name}'s profile`}
          >
            {publicAgent?.avatar ||
            property.agent.avatar ? (
              <img
                src={
                  publicAgent?.avatar ||
                  property.agent.avatar
                }
                alt={
                  publicAgent?.name ||
                  property.agent.name
                }
                className="h-16 w-16 rounded-full border-2 border-gold-400/30 object-cover transition-colors hover:border-gold-400/80"
              />
            ) : (
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-400/30 bg-gold-400/10 text-sm font-bold text-gold-300"
                aria-hidden="true"
              >
                {property.agent.name
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map(
                    (part) =>
                      part[0],
                  )
                  .join('')
                  .toUpperCase()}
              </div>
            )}
          </button>

          <div className="flex flex-col">
            {/* Agent Name */}
            <button
              type="button"
              disabled={
                !publicAgent?.slug
              }
              onClick={() => {
                if (
                  !publicAgent?.slug
                ) {
                  return;
                }

                navigate(
                  ROUTES.AGENT_DETAILS.replace(
                    ':slug',
                    publicAgent.slug,
                  ),
                );
              }}
              className="mb-0.5 text-left font-semibold text-cream transition-colors hover:text-gold-400 focus:outline-none disabled:cursor-default disabled:hover:text-cream"
            >
              {property.agent.name}
            </button>

            {property.agent
              .verified && (
              <span className="mb-2 flex items-center text-[9px] font-medium uppercase tracking-wide text-gold-400/90">
                ✓ Verified Agent,
                Trusted by Luxora
              </span>
            )}

            {/* Agency */}
            <button
              type="button"
              disabled={
                !publicAgency?.slug
              }
              onClick={() => {
                if (
                  !publicAgency?.slug
                ) {
                  return;
                }

                navigate(
                  ROUTES.AGENCY_DETAILS.replace(
                    ':slug',
                    publicAgency.slug,
                  ),
                );
              }}
              className="mb-2 block w-full text-left text-sm text-ink/50 transition-colors hover:text-gold-300 focus:outline-none disabled:cursor-default disabled:hover:text-ink/50"
            >
              {publicAgency?.name ||
                property.agent.agency}
            </button>

            {property.agent.phone && (
              <div className="mb-1 flex items-center gap-1.5 text-xs text-cream/70">
                <Phone className="h-3.5 w-3.5 text-gold-400/70" />
                {property.agent.phone}
              </div>
            )}

            {property.agent.email && (
              <div className="flex items-center gap-1.5 text-xs text-cream/70">
                <Mail className="h-3.5 w-3.5 text-gold-400/70" />
                {property.agent.email}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <GoldButton
            size="lg"
            className="h-12 w-full justify-center text-sm"
            disabled={
              loadingAction ===
              'call'
            }
            onClick={() =>
              executeWithLoading(
                'call',
                () => {
                  window.location.href = `tel:${property.agent.phone}`;
                },
              )
            }
          >
            {loadingAction ===
            'call' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Phone className="mr-2 h-4 w-4" />
            )}
            Call Agent
          </GoldButton>

          <div className="grid grid-cols-2 gap-3">
            <GhostButton
              size="sm"
              className="h-10 w-full justify-center border-white/10 text-xs transition-all hover:border-gold-400/50 hover:bg-gold-400/5 hover:text-gold-400"
              disabled={
                loadingAction ===
                'contact'
              }
              onClick={
                handleContactClick
              }
            >
              {loadingAction ===
              'contact' ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Mail className="mr-1.5 h-3.5 w-3.5" />
              )}
              Message
            </GhostButton>

            <GhostButton
              size="sm"
              className="h-10 w-full justify-center border-white/10 text-xs transition-all hover:border-gold-400/50 hover:bg-gold-400/5 hover:text-gold-400"
              disabled={
                loadingAction ===
                'whatsapp'
              }
              onClick={() =>
                executeWithLoading(
                  'whatsapp',
                  () =>
                    window.open(
                      `https://wa.me/${property.agent.phone?.replace(
                        /[^0-9]/g,
                        '',
                      )}`,
                      '_blank',
                    ),
                )
              }
            >
              {loadingAction ===
              'whatsapp' ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
              )}
              WhatsApp
            </GhostButton>
          </div>
        </div>

        {/* Save and Compare Properties */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/5 pt-6">
          <GhostButton
            size="sm"
            className={`h-10 w-full justify-center text-xs transition-colors ${
              saved
                ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                : 'border-white/10 hover:border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-400'
            }`}
            disabled={
              loadingAction ===
              'save'
            }
            onClick={
              handleSaveClick
            }
            aria-label={
              saved
                ? 'Unsave property'
                : 'Save property'
            }
          >
            {loadingAction ===
            'save' ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Heart
                className={`mr-1.5 h-3.5 w-3.5 ${
                  saved
                    ? 'fill-current'
                    : ''
                }`}
                aria-hidden="true"
              />
            )}

            {saved
              ? 'Saved'
              : 'Save'}
          </GhostButton>

          <GhostButton
            size="sm"
            className="h-10 w-full justify-center border-white/10 text-xs transition-colors hover:border-gold-400/20 hover:bg-gold-400/10 hover:text-gold-400"
            disabled={
              loadingAction ===
              'compare'
            }
            onClick={
              handleCompareClick
            }
            aria-label="Add to compare"
          >
            {loadingAction ===
            'compare' ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Scale
                className="mr-1.5 h-3.5 w-3.5"
                aria-hidden="true"
              />
            )}

            Compare
          </GhostButton>
        </div>
      </div>

      {/* Viewing / Offer Card */}
      <div className="rounded-3xl border border-white/10 bg-gold-400/5 p-6 text-center backdrop-blur-md md:p-8">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold-400/10 text-gold-400">
          <Calendar className="h-6 w-6" />
        </div>

        <h3 className="mb-2 font-heading text-xl font-semibold text-cream">
          Schedule a Viewing
        </h3>

        <p className="mb-6 text-sm leading-relaxed text-ink/60">
          Book an in-person or
          virtual tour with the
          listing agent.
        </p>

        {/* Make Offer */}
        {canMakeOffer && (
          <GoldButton
            size="lg"
            className="mb-3 h-12 w-full justify-center text-sm"
            disabled={
              loadingAction ===
              'offer'
            }
            onClick={
              handleMakeOfferClick
            }
          >
            {loadingAction ===
            'offer' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <HandCoins className="mr-2 h-4 w-4" />
            )}

            Make an Offer
          </GoldButton>
        )}

        {/* Request Tour */}
        <GhostButton
          size="lg"
          className="h-12 w-full justify-center border-gold-400/20 text-sm text-gold-400 transition-colors hover:border-gold-400/40 hover:bg-gold-400/5"
          disabled={
            loadingAction ===
            'tour'
          }
          onClick={() =>
            executeWithLoading(
              'tour',
              () =>
                openScheduleViewingModal(
                  property.id,
                ),
            )
          }
        >
          {loadingAction ===
          'tour' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Calendar className="mr-2 h-4 w-4" />
          )}

          Request Tour
        </GhostButton>
      </div>

      {/* Report Listing */}
      <div className="pb-2 text-center">
        <button
          type="button"
          onClick={() =>
            openReportListingModal(
              property.id,
            )
          }
          className="inline-flex items-center justify-center gap-1.5 rounded-sm px-2 py-1 text-xs text-ink/40 transition-colors hover:text-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
        >
          <AlertTriangle
            className="h-3.5 w-3.5"
            aria-hidden="true"
          />
          Report this listing
        </button>
      </div>

      {/* Make Offer Modal */}
      <MakeOfferModal
        isOpen={
          isMakeOfferModalOpen
        }
        onClose={() =>
          setIsMakeOfferModalOpen(
            false,
          )
        }
        property={property}
      />
    </div>
  );
}