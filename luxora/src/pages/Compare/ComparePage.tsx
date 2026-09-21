import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../contexts/SessionContext';
import { useToast } from '../../contexts/ToastContext';
import {
  mapApiPropertiesToProperties,
} from '../../api/property.mapper';
import { propertyApi } from '../../api/property.api';
import type { Property } from '../../types';

import { GhostButton, GoldButton } from '../../components/ui/ui';
import { EmptyState } from '../../components/layout/EmptyState';
import { PageLayout } from '../../components/layout';
import { PageHeader } from '../../components/layout/PageHeader';
import { MakeOfferModal } from '../../components/property/MakeOfferModal';

import {
  Printer,
  Download,
  Share2,
  Scale,
  MapPin,
  BadgeCheck,
  Check,
  Minus,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

import { ROUTES } from '../../constants/routes';

interface PropertyDetailsResponse {
  property?: unknown;
}

const hasAmenity = (
  property: Property,
  terms: string[],
) => {
  const amenities = property.amenities ?? [];

  return amenities.some((amenity) => {
    const normalizedAmenity =
      amenity.toLowerCase();

    return terms.some((term) =>
      normalizedAmenity.includes(
        term.toLowerCase(),
      ),
    );
  });
};

export default function ComparePage() {
  const navigate = useNavigate();

  const {
    compareList,
    toggleCompareProperty,
    isAuthenticated,
    openScheduleViewingModal,
    openReportListingModal,
  } = useSession();

  const { showToast } = useToast();

  const [
    selectedProperties,
    setSelectedProperties,
  ] = useState<Property[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [highlightDifferences, setHighlightDifferences] =
    useState(false);

  const [
    selectedPropertyForOffer,
    setSelectedPropertyForOffer,
  ] = useState<Property | null>(null);

  /*
   * Load the actual backend Properties represented
   * by the IDs stored in the Compare list.
   */
  useEffect(() => {
    let isActive = true;

    const loadCompareProperties = async () => {
      /*
       * Nothing is selected, so there is nothing to load.
       */
      if (compareList.length === 0) {
        if (isActive) {
          setSelectedProperties([]);
          setLoadError(null);
          setIsLoading(false);
        }

        return;
      }

      try {
        setIsLoading(true);
        setLoadError(null);

        /*
         * Resolve every selected Property ID against
         * the real backend.
         */
        const responses = await Promise.all(
          compareList.map((propertyId) =>
            propertyApi.getPropertyById(propertyId),
          ),
        );

        if (!isActive) {
          return;
        }

        /*
         * The HTTP client may return the unwrapped payload
         * at runtime while the API method is typed as AxiosResponse.
         */
        const rawProperties = responses
          .map(
            (response) =>
              (
                response as unknown as PropertyDetailsResponse
              )?.property,
          )
          .filter(Boolean);

        /*
         * Map backend records into the canonical
         * frontend Property shape.
         */
        const mappedProperties =
          mapApiPropertiesToProperties(
            rawProperties,
          ) as Property[];

        /*
         * Preserve the exact order of compareList so the
         * comparison columns remain stable.
         */
        const orderedProperties =
          compareList
            .map((propertyId) =>
              mappedProperties.find(
                (property) =>
                  property.id === propertyId,
              ),
            )
            .filter(
              (
                property,
              ): property is Property =>
                property !== undefined,
            );

        setSelectedProperties(
          orderedProperties,
        );

        /*
         * Report if some selected IDs could not
         * be resolved from the backend.
         */
        if (
          orderedProperties.length <
          compareList.length
        ) {
          setLoadError(
            'Some selected properties are no longer available.',
          );
        }
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error(
          'Failed to load compare properties:',
          error,
        );

        setSelectedProperties([]);

        setLoadError(
          error instanceof Error
            ? error.message
            : 'Failed to load the selected properties.',
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadCompareProperties();

    return () => {
      isActive = false;
    };
  }, [compareList]);

  /*
   * Compare rows against the real backend Property data.
   */
  const isDifferent = <T,>(
    extractor: (property: Property) => T,
  ) => {
    if (selectedProperties.length <= 1) {
      return false;
    }

    const firstValue = extractor(
      selectedProperties[0],
    );

    return selectedProperties.some(
      (property) =>
        extractor(property) !== firstValue,
    );
  };

  /*
   * Render a standard comparison row.
   */
  const renderRow = <T,>(
    label: string,
    extractor: (
      property: Property,
    ) => T,
    format: 'text' | 'boolean' = 'text',
  ) => {
    const different = isDifferent(
      extractor,
    );

    const muted =
      highlightDifferences && !different;

    return (
      <div
        className={`grid min-w-max border-b border-white/5 transition-opacity ${
          muted
            ? 'opacity-30'
            : 'opacity-100'
        }`}
        style={{
          gridTemplateColumns: `200px repeat(${selectedProperties.length}, minmax(250px, 1fr))`,
        }}
      >
        <div className="sticky left-0 z-10 flex items-center bg-navy-900 py-4 pr-4 text-sm font-medium text-ink/70">
          {label}
        </div>

        {selectedProperties.map(
          (property) => (
            <div
              key={property.id}
              className="min-w-[250px] border-l border-white/5 px-4 py-4 text-sm text-cream"
            >
              {format === 'boolean' ? (
                extractor(property) ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Minus className="h-4 w-4 text-ink/30" />
                )
              ) : (
                (extractor(
                  property,
                ) as ReactNode) ?? 'N/A'
              )}
            </div>
          ),
        )}
      </div>
    );
  };

  /*
   * Lowest actual listing price among the selected
   * backend properties.
   */
  const lowestPriceProperty =
    useMemo(() => {
      if (selectedProperties.length === 0) {
        return null;
      }

      return selectedProperties.reduce(
        (lowest, current) =>
          current.priceValue <
          lowest.priceValue
            ? current
            : lowest,
      );
    }, [selectedProperties]);

  /*
   * Remove a property from the real Compare list.
   */
  const handleRemoveProperty = (
    propertyId: string,
  ) => {
    toggleCompareProperty(propertyId);
  };

  /*
   * Open the real Make Offer workflow.
   */
  const handleOfferClick = (
    property: Property,
  ) => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    setSelectedPropertyForOffer(
      property,
    );
  };

  /*
   * Use the browser print dialog for PDF saving
   * instead of pretending there is a backend PDF service.
   */
  const handleExportPdf = () => {
    window.print();
  };

  /*
   * Share the current Compare page through the
   * browser share API or clipboard.
   */
  const handleShareCompare = async () => {
    const shareData = {
      title: 'Luxora Property Comparison',
      text: `Comparing ${selectedProperties.length} Luxora properties.`,
      url: window.location.href,
    };

    try {
      if (
        navigator.share &&
        typeof navigator.share === 'function'
      ) {
        await navigator.share(
          shareData,
        );
        return;
      }

      await navigator.clipboard.writeText(
        window.location.href,
      );

      showToast({
        type: 'success',
        title: 'Comparison Link Copied',
        description:
          'The current comparison URL has been copied to your clipboard.',
      });
    } catch (error) {
      /*
       * Browser cancellation of navigator.share
       * should not become an application error.
       */
      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        return;
      }

      console.error(
        'Failed to share comparison:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Share Failed',
        description:
          'The comparison link could not be shared.',
      });
    }
  };

  /*
   * Loading state.
   *
   * Do not display the empty state while the selected
   * Properties are still being retrieved.
   */
  if (isLoading) {
    return (
      <PageLayout className="pb-20">
        <div className="mx-auto max-w-[1600px] p-4 md:p-6 lg:p-8">
          <PageHeader
            title="Compare Properties"
            description="Loading your selected properties..."
          />

          <div className="rounded-3xl border border-white/10 bg-navy-800/30 p-6">
            <div className="mb-6 flex items-center justify-center gap-3 py-8 text-sm text-ink/60">
              <Loader2 className="h-5 w-5 animate-spin text-gold-400" />
              Loading selected properties...
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({
                length: Math.max(
                  compareList.length,
                  1,
                ),
              }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-navy-800/50"
                >
                  <div className="h-52 animate-pulse bg-white/5" />

                  <div className="space-y-3 p-5">
                    <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />

                    <div className="h-6 w-4/5 animate-pulse rounded bg-white/10" />

                    <div className="h-5 w-1/3 animate-pulse rounded bg-white/10" />

                    <div className="h-10 w-full animate-pulse rounded bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  /*
   * No selected Properties.
   *
   * This now happens only after loading has completed.
   */
  if (
    compareList.length === 0 ||
    selectedProperties.length === 0
  ) {
    return (
      <PageLayout className="flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-navy-800/50 p-8">
          <EmptyState
            icon={
              <Scale className="h-12 w-12 text-gold-400" />
            }
            title="No properties selected"
            description={
              loadError ||
              "You haven't added any properties to compare yet. Add up to 4 properties side-by-side to compare their real listing details."
            }
            actionLabel="Browse Properties"
            onAction={() =>
              navigate(ROUTES.PROPERTIES)
            }
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout className="pb-20">
        <div className="mx-auto max-w-[1600px] p-4 md:p-6 lg:p-8">
          <PageHeader
            title="Compare Properties"
            description={`Comparing ${selectedProperties.length} of 4 properties side-by-side using their real Luxora listing data.`}
            action={
              <div className="flex flex-wrap items-center gap-3">
                <GhostButton
                  size="sm"
                  onClick={() =>
                    window.print()
                  }
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </GhostButton>

                <GhostButton
                  size="sm"
                  onClick={handleExportPdf}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Save as PDF
                </GhostButton>

                <GhostButton
                  size="sm"
                  onClick={
                    handleShareCompare
                  }
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </GhostButton>
              </div>
            }
          />

          {/* Comparison Summary */}
          <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-navy-800/50 p-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-ink/60">
                  Properties:
                </span>

                <span className="font-semibold text-cream">
                  {selectedProperties.length}
                </span>
              </div>

              <div className="hidden h-4 w-px bg-white/10 sm:block" />

              <div className="flex items-center gap-2">
                <span className="text-ink/60">
                  Lowest Listed Price:
                </span>

                <span className="font-semibold text-gold-400">
                  {lowestPriceProperty?.price ||
                    'N/A'}
                </span>
              </div>

              <div className="hidden h-4 w-px bg-white/10 sm:block" />

              <div className="text-xs text-ink/50">
                Values below come directly from the
                selected Property records.
              </div>
            </div>

            <label className="flex shrink-0 cursor-pointer items-center gap-3">
              <span className="text-sm font-medium text-cream">
                Highlight Differences
              </span>

              <div
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  highlightDifferences
                    ? 'bg-gold-400'
                    : 'bg-white/10'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    highlightDifferences
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`}
                />
              </div>

              <input
                type="checkbox"
                className="sr-only"
                checked={
                  highlightDifferences
                }
                onChange={(event) =>
                  setHighlightDifferences(
                    event.target.checked,
                  )
                }
              />
            </label>
          </div>

          {loadError && (
            <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-sm text-amber-200">
              {loadError}
            </div>
          )}

          {/* Comparison Table */}
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-navy-800/30">
            <div className="min-w-max w-full">
              {/* Properties Header Row */}
              <div
                className="sticky top-0 z-20 grid border-b border-white/10 bg-navy-800/95 shadow-sm backdrop-blur-md"
                style={{
                  gridTemplateColumns: `200px repeat(${selectedProperties.length}, minmax(250px, 1fr))`,
                }}
              >
                <div className="sticky left-0 z-30 bg-navy-800/95 py-6 pr-4 backdrop-blur-md" />

                {selectedProperties.map(
                  (property) => (
                    <div
                      key={property.id}
                      className="relative min-w-[250px] border-l border-white/10 p-6"
                    >
                      <button
                        onClick={() =>
                          handleRemoveProperty(
                            property.id,
                          )
                        }
                        className="absolute right-2 top-2 z-10 rounded-full bg-navy-900/80 p-1.5 text-ink transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                        title="Remove from compare"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <div className="mb-4 aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
                        {property.image ? (
                          <img
                            src={property.image}
                            alt={property.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-navy-900 text-xs text-ink/40">
                            No image available
                          </div>
                        )}
                      </div>

                      <div className="mb-2 flex items-center gap-1.5 text-xs text-ink/50">
                        <MapPin className="h-3 w-3" />
                        {property.location}
                      </div>

                      <h3 className="mb-2 line-clamp-2 font-heading text-lg font-bold text-cream">
                        {property.title}
                      </h3>

                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {property.verified?.map(
                          (verification) => (
                            <span
                              key={verification}
                              className="inline-flex items-center gap-1 rounded-full border border-gold-400/20 bg-gold-400/10 px-2 py-0.5 text-[10px] font-medium text-gold-300"
                            >
                              <BadgeCheck className="h-3 w-3" />
                              {verification}
                            </span>
                          ),
                        )}
                      </div>

                      <div className="mb-1 font-heading text-xl font-bold text-cream">
                        {property.price}
                      </div>

                      <div className="mb-6 text-xs text-gold-400">
                        {property.monthly}
                      </div>

                      <div className="space-y-2">
                        <GoldButton
                          className="w-full"
                          size="sm"
                          onClick={() =>
                            navigate(
                              ROUTES.PROPERTY_DETAILS.replace(
                                ':id',
                                property.id,
                              ),
                            )
                          }
                        >
                          View Details
                        </GoldButton>

                        <div className="grid grid-cols-2 gap-2">
                          <GhostButton
                            className="w-full"
                            size="sm"
                            onClick={() =>
                              isAuthenticated
                                ? openScheduleViewingModal(
                                    property.id,
                                  )
                                : navigate(
                                    ROUTES.LOGIN,
                                  )
                            }
                          >
                            Schedule
                          </GhostButton>

                          <GhostButton
                            className="w-full"
                            size="sm"
                            onClick={() =>
                              handleOfferClick(
                                property,
                              )
                            }
                          >
                            Offer
                          </GhostButton>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          openReportListingModal(
                            property.id,
                          )
                        }
                        className="mt-3 inline-flex w-full items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-ink/40 transition-colors hover:text-rose-400"
                      >
                        <AlertTriangle className="h-3 w-3" />
                        Report
                      </button>
                    </div>
                  ),
                )}
              </div>

              {/* Basic Information */}
              <div className="border-b border-white/5 bg-navy-900/50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-gold-400">
                Basic Information
              </div>

              {renderRow(
                'Property Type',
                (property) =>
                  property.type,
              )}

              {renderRow(
                'Transaction Type',
                (property) =>
                  property.transactionType,
              )}

              {renderRow(
                'Property Size',
                (property) =>
                  property.area,
              )}

              {renderRow(
                'Bedrooms',
                (property) =>
                  property.beds,
              )}

              {renderRow(
                'Bathrooms',
                (property) =>
                  property.baths,
              )}

              {renderRow(
                'Parking Spaces',
                (property) =>
                  property.parkingSpaces ??
                  'N/A',
              )}

              {renderRow(
                'Year Built',
                (property) =>
                  property.yearBuilt ??
                  'N/A',
              )}

              {renderRow(
                'Furnishing',
                (property) =>
                  property.furnishing ??
                  'N/A',
              )}

              {/* Pricing */}
              <div className="border-b border-t border-white/5 bg-navy-900/50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-gold-400">
                Pricing Details
              </div>

              {renderRow(
                'Listed Price',
                (property) =>
                  property.price,
              )}

              {renderRow(
                'Price Type',
                (property) =>
                  property.priceType ??
                  'N/A',
              )}

              {renderRow(
                'Price Frequency',
                (property) =>
                  property.priceFrequency ??
                  'N/A',
              )}

              {renderRow(
                'Monthly Price',
                (property) =>
                  property.monthly,
              )}

              {renderRow(
                'Currency',
                (property) =>
                  property.currency ??
                  'NGN',
              )}

              {renderRow(
                'Mortgage Support',
                (property) =>
                  property.mortgageSupport ===
                  true,
                'boolean',
              )}

              {/* Amenities */}
              <div className="border-b border-t border-white/5 bg-navy-900/50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-gold-400">
                Amenities
              </div>

              {renderRow(
                'Swimming Pool',
                (property) =>
                  hasAmenity(property, [
                    'swimming pool',
                    'pool',
                  ]),
                'boolean',
              )}

              {renderRow(
                'Gym / Fitness',
                (property) =>
                  hasAmenity(property, [
                    'gym',
                    'fitness',
                  ]),
                'boolean',
              )}

              {renderRow(
                'Security',
                (property) =>
                  hasAmenity(property, [
                    'security',
                    'cctv',
                    '24/7 security',
                  ]),
                'boolean',
              )}

              {renderRow(
                'Power Backup',
                (property) =>
                  hasAmenity(property, [
                    'power backup',
                    '24/7 power',
                    'generator',
                    'inverter',
                  ]),
                'boolean',
              )}

              {renderRow(
                'Water Supply',
                (property) =>
                  hasAmenity(property, [
                    'water supply',
                    'water',
                  ]),
                'boolean',
              )}

              {renderRow(
                'Internet',
                (property) =>
                  hasAmenity(property, [
                    'internet',
                    'wifi',
                    'wi-fi',
                  ]),
                'boolean',
              )}

              {renderRow(
                'Balcony / Terrace',
                (property) =>
                  hasAmenity(property, [
                    'balcony',
                    'terrace',
                  ]),
                'boolean',
              )}

              {renderRow(
                'Garden',
                (property) =>
                  hasAmenity(property, [
                    'garden',
                  ]),
                'boolean',
              )}

              {renderRow(
                'Dedicated Parking',
                (property) =>
                  (property.parkingSpaces ??
                    0) > 0,
                'boolean',
              )}

              {/* Location */}
              <div className="border-b border-t border-white/5 bg-navy-900/50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-gold-400">
                Location
              </div>

              {renderRow(
                'Area',
                (property) =>
                  property.location
                    .split(',')
                    .map((part) =>
                      part.trim(),
                    )[0] || 'N/A',
              )}

              {renderRow(
                'City',
                (property) =>
                  property.city ||
                  'N/A',
              )}

              {renderRow(
                'State',
                (property) =>
                  property.state ||
                  'N/A',
              )}

              {/* Listing & Verification */}
              <div className="border-b border-t border-white/5 bg-navy-900/50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-gold-400">
                Listing & Verification
              </div>

              {renderRow(
                'Status',
                (property) =>
                  property.status ??
                  'N/A',
              )}

              {renderRow(
                'Listing Tier',
                (property) =>
                  property.listingTier ??
                  'N/A',
              )}

              {renderRow(
                'Featured Level',
                (property) =>
                  property.featuredLevel ??
                  'N/A',
              )}

              {renderRow(
                'Inspection Status',
                (property) =>
                  property.inspectionStatus ??
                  'N/A',
              )}

              {renderRow(
                'Availability Date',
                (property) =>
                  property.availabilityDate ??
                  'Immediate',
              )}

              {renderRow(
                'Verification',
                (property) =>
                  property.verified.length > 0
                    ? property.verified.join(
                        ', ',
                      )
                    : 'Not verified',
              )}

              {/* Payment Options */}
              <div className="border-b border-t border-white/5 bg-navy-900/50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-gold-400">
                Payment Options
              </div>

              {renderRow(
                'Payment Plans',
                (property) =>
                  property.paymentOptions &&
                  property.paymentOptions.length >
                    0
                    ? property.paymentOptions.join(
                        ', ',
                      )
                    : 'Not specified',
              )}

              {/* Agent Information */}
              <div className="border-b border-t border-white/5 bg-navy-900/50 px-6 py-3 text-xs font-bold uppercase tracking-wider text-gold-400">
                Agent Information
              </div>

              <div
                className="grid border-b border-white/5"
                style={{
                  gridTemplateColumns: `200px repeat(${selectedProperties.length}, minmax(250px, 1fr))`,
                }}
              >
                <div className="sticky left-0 z-10 flex items-center bg-navy-900 py-4 pr-4 text-sm font-medium text-ink/70">
                  Assigned Agent
                </div>

                {selectedProperties.map(
                  (property) => (
                    <div
                      key={property.id}
                      className="min-w-[250px] border-l border-white/5 px-4 py-4"
                    >
                      <div className="flex items-center gap-3">
                        {property.agent.avatar ? (
                          <img
                            src={
                              property.agent
                                .avatar
                            }
                            alt={
                              property.agent
                                .name
                            }
                            className="h-10 w-10 rounded-full border border-white/10 object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-navy-900 text-sm font-semibold text-gold-400">
                            {property.agent.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        <div>
                          <div className="text-sm font-medium text-cream">
                            {property.agent.name}
                          </div>

                          <div className="text-[10px] text-ink/60">
                            {property.agent.agency}
                          </div>
                        </div>
                      </div>

                      <GhostButton
                        className="mt-4 w-full"
                        size="sm"
                        onClick={() =>
                          navigate(
                            ROUTES.AGENT_DETAILS.replace(
                              ':slug',
                              property.agent.name
                                .toLowerCase()
                                .trim()
                                .replace(
                                  /\s+/g,
                                  '-',
                                ),
                            ),
                          )
                        }
                      >
                        View Agent
                      </GhostButton>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </PageLayout>

      {/* Real Buyer Offer Flow */}
      {selectedPropertyForOffer && (
        <MakeOfferModal
          isOpen={
            selectedPropertyForOffer !== null
          }
          onClose={() =>
            setSelectedPropertyForOffer(
              null,
            )
          }
          property={
            selectedPropertyForOffer
          }
        />
      )}
    </>
  );
}