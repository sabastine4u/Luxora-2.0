import type { Property } from '../../../types';
import { useMemo, useState } from 'react';
import {
  Heart,
  Scale,
  Share2,
  Trash2,
  Clock,
  Star,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mapApiPropertyToProperty } from '../../../api/property.mapper';
import { useFavorites } from '../../../contexts/FavoriteContext';
import { useSession } from '../../../contexts/SessionContext';
import { useToast } from '../../../contexts/ToastContext';
import { PropertyCard } from '../../../components/property/PropertyCard';
import { EmptyState } from '../../../components/layout';
import { KPICard } from '../../../components/dashboard/shared/cards/KPICard';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';
import { ROUTES } from '../../../constants/routes';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { ShareModal } from './modals/ShareModal';

const getPropertyUrl = (propertyId: string) => {
  const propertyPath = ROUTES.PROPERTY_DETAILS.replace(
    ':id',
    encodeURIComponent(propertyId),
  );

  return `${window.location.origin}${propertyPath}`;
};

const buildShareText = (properties: Property[]) => {
  const lines = properties.map((property) => {
    return `${property.title}\n${getPropertyUrl(property.id)}`;
  });

  return `Luxora saved properties:\n\n${lines.join('\n\n')}`;
};

const copyToClipboard = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');

  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';

  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand('copy');

  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error('Unable to copy the property link.');
  }
};

export default function SavedProperties() {
  const {
    favoriteRecords,
    toggleFavorite,
  } = useFavorites();

  const { toggleCompareProperty } = useSession();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterLocation, setFilterLocation] =
    useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedIds, setSelectedIds] =
    useState<Set<string>>(new Set());

  const [isRemoveOpen, setIsRemoveOpen] =
    useState(false);
  const [isShareOpen, setIsShareOpen] =
    useState(false);

  // Convert populated backend Favorite records into the canonical frontend Property shape.
  const baseProps = useMemo<Property[]>(() => {
    return favoriteRecords
      .filter(
        (favorite) =>
          favorite.property !== null,
      )
      .map(
        (favorite) =>
          mapApiPropertyToProperty(
            favorite.property,
          ) as Property,
      );
  }, [favoriteRecords]);

  // Keep the backend Favorite timestamps available for real saved-date sorting
  // and the "this week" metric.
  const favoriteRecordByPropertyId = useMemo(() => {
    const map = new Map<
      string,
      (typeof favoriteRecords)[number]
    >();

    favoriteRecords.forEach((favorite) => {
      const propertyId =
        favorite.property?._id;

      if (propertyId) {
        map.set(propertyId, favorite);
      }
    });

    return map;
  }, [favoriteRecords]);

  const getSavedTimestamp = (
    propertyId: string,
  ) => {
    const favorite =
      favoriteRecordByPropertyId.get(
        propertyId,
      );

    if (!favorite?.createdAt) {
      return 0;
    }

    const timestamp = Date.parse(
      favorite.createdAt,
    );

    return Number.isFinite(timestamp)
      ? timestamp
      : 0;
  };

  const metrics = useMemo(() => {
    const total = baseProps.length;

    const latestFavorite =
      favoriteRecords[0];

    const lastSaved =
      latestFavorite?.property?.title ||
      'None';

    const premiumCount = baseProps.filter(
      (property) =>
        property.verified.includes('Premium'),
    ).length;

    const totalValue = baseProps.reduce(
      (sum, property) =>
        sum + property.priceValue,
      0,
    );

    const formatPrice = (value: number) =>
      `₦${(
        value / 1_000_000
      ).toFixed(1)}M`;

    // Calculate the number of favorites created during
    // the current calendar week from the real Favorite timestamps.
    const now = new Date();
    const weekStart = new Date(now);

    weekStart.setDate(
      now.getDate() - now.getDay(),
    );
    weekStart.setHours(
      0,
      0,
      0,
      0,
    );

    const savedThisWeek =
      favoriteRecords.filter(
        (favorite) => {
          if (!favorite.createdAt) {
            return false;
          }

          const createdAt = new Date(
            favorite.createdAt,
          );

          return (
            !Number.isNaN(
              createdAt.getTime(),
            ) &&
            createdAt >= weekStart
          );
        },
      ).length;

    return {
      total,
      lastSaved:
        lastSaved.length > 20
          ? `${lastSaved.substring(
            0,
            20,
          )}...`
          : lastSaved,
      premiumCount,
      totalValue: formatPrice(
        totalValue,
      ),
      savedThisWeek,
    };
  }, [
    baseProps,
    favoriteRecords,
  ]);

  const filteredAndSortedProps =
    useMemo(() => {
      let result = [...baseProps];

      if (searchQuery) {
        const query =
          searchQuery.toLowerCase();

        result = result.filter((property) =>
          property.title
            .toLowerCase()
            .includes(query),
        );
      }

      if (filterType !== 'All') {
        result = result.filter(
          (property) =>
            property.type ===
            filterType,
        );
      }

      if (filterLocation !== 'All') {
        result = result.filter(
          (property) =>
            property.location.includes(
              filterLocation,
            ),
        );
      }

      result.sort((a, b) => {
        if (sortBy === 'price_asc') {
          return (
            a.priceValue -
            b.priceValue
          );
        }

        if (sortBy === 'price_desc') {
          return (
            b.priceValue -
            a.priceValue
          );
        }

        if (sortBy === 'alpha') {
          return a.title.localeCompare(
            b.title,
          );
        }

        if (sortBy === 'oldest') {
          return (
            getSavedTimestamp(a.id) -
            getSavedTimestamp(b.id)
          );
        }

        // Default: newest saved first.
        return (
          getSavedTimestamp(b.id) -
          getSavedTimestamp(a.id)
        );
      });

      return result;
    }, [
      baseProps,
      searchQuery,
      filterType,
      filterLocation,
      sortBy,
      favoriteRecordByPropertyId,
    ]);

  // Build the Property Type filter from the real backend Favorites.
  const uniqueTypes = [
    'All',
    ...new Set(
      baseProps.map(
        (property) => property.type,
      ),
    ),
  ];

  // Build the location filter from the real backend Favorites.
  const uniqueLocations = [
    'All',
    ...new Set(
      baseProps.map(
        (property) =>
          property.location
            .split(',')[0]
            .trim(),
      ),
    ),
  ];

  const handleSelect = (
    id: string,
  ) => {
    setSelectedIds((previous) => {
      const next = new Set(
        previous,
      );

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const handleSelectAll = () => {
    if (
      selectedIds.size ===
      filteredAndSortedProps.length
    ) {
      setSelectedIds(
        new Set(),
      );
      return;
    }

    setSelectedIds(
      new Set(
        filteredAndSortedProps.map(
          (property) => property.id,
        ),
      ),
    );
  };

  const handleBulkRemoveConfirm =
    async () => {
      try {
        await Promise.all(
          Array.from(selectedIds).map(
            (id) =>
              toggleFavorite(id),
          ),
        );

        setSelectedIds(
          new Set(),
        );

        setIsRemoveOpen(false);

        showToast({
          type: 'success',
          title: 'Removed',
          description:
            'Selected properties were removed from your favorites.',
        });
      } catch (error) {
        console.error(
          'Failed to remove selected favorites:',
          error,
        );

        showToast({
          type: 'error',
          title: 'Unable to remove favorites',
          description:
            'Some properties could not be removed. Please try again.',
        });
      }
    };

  const handleBulkCompare = () => {
    let added = 0;
    let limitHit = false;

    for (const id of Array.from(
      selectedIds,
    )) {
      const result =
        toggleCompareProperty(id);

      if (
        result === 'limit_reached'
      ) {
        limitHit = true;
        break;
      }

      if (result === 'added') {
        added++;
      }
    }

    setSelectedIds(
      new Set(),
    );

    if (limitHit) {
      showToast({
        type: 'warning',
        title: 'Compare Limit Reached',
        description: `Added ${added} to compare. Compare limit (4) reached.`,
      });
    } else {
      showToast({
        type: 'success',
        title: 'Added to Compare',
        description: `Added ${added} properties to compare.`,
      });
    }
  };

  const handleShareSubmit = async (
    method: string,
  ) => {
    const selectedProperties =
      baseProps.filter(
        (property) =>
          selectedIds.has(
            property.id,
          ),
      );

    if (!selectedProperties.length) {
      showToast({
        type: 'error',
        title: 'Nothing selected',
        description:
          'Select at least one saved property to share.',
      });

      return;
    }

    const shareText =
      buildShareText(
        selectedProperties,
      );

    try {
      switch (method) {
        case 'Copy Link':
          await copyToClipboard(
            shareText,
          );

          showToast({
            type: 'success',
            title: 'Link Copied',
            description:
              selectedProperties.length ===
                1
                ? 'The property link was copied to your clipboard.'
                : 'The selected property links were copied to your clipboard.',
          });
          break;

        case 'Email': {
          const subject =
            selectedProperties.length ===
              1
              ? `Luxora Property: ${selectedProperties[0].title}`
              : `Luxora Saved Properties (${selectedProperties.length})`;

          const mailtoUrl = `mailto:?subject=${encodeURIComponent(
            subject,
          )}&body=${encodeURIComponent(
            shareText,
          )}`;

          window.location.href =
            mailtoUrl;

          showToast({
            type: 'success',
            title: 'Email Share Ready',
            description:
              'Your email application has been opened with the selected property links.',
          });
          break;
        }

        case 'WhatsApp': {
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
            shareText,
          )}`;

          window.open(
            whatsappUrl,
            '_blank',
            'noopener,noreferrer',
          );

          showToast({
            type: 'success',
            title: 'WhatsApp Share Ready',
            description:
              'WhatsApp has been opened with the selected property links.',
          });
          break;
        }

        default:
          showToast({
            type: 'info',
            title: 'Share option unavailable',
            description:
              'That sharing option is not currently supported.',
          });
      }
    } catch (error) {
      console.error(
        'Failed to share saved properties:',
        error,
      );

      showToast({
        type: 'error',
        title: 'Share failed',
        description:
          'We could not complete the selected sharing action.',
      });
    }
  };

  if (baseProps.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-12">
        <EmptyState
          icon={
            <Heart className="h-12 w-12 text-gold-400" />
          }
          title="My Favorites is Empty"
          description="You haven't saved any properties yet. Browse our collection and click the heart icon to save your favorites."
          actionLabel="Browse Properties"
          onAction={() =>
            navigate(
              ROUTES.PROPERTIES,
            )
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-2xl font-bold text-cream">
          My Favorites
        </h2>

        <p className="text-sm text-ink/60">
          Manage and compare your saved properties.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Saved"
          value={metrics.total.toString()}
          trend={
            metrics.savedThisWeek > 0
              ? `+${metrics.savedThisWeek} this week`
              : 'No new saves this week'
          }
          trendColor={
            metrics.savedThisWeek > 0
              ? 'text-emerald-400'
              : 'text-ink/40'
          }
          icon={Heart}
        />

        <KPICard
          title="Last Saved"
          value={metrics.lastSaved}
          icon={Clock}
        />

        <KPICard
          title="Premium Properties"
          value={metrics.premiumCount.toString()}
          icon={Star}
        />

        <KPICard
          title="Total Value"
          value={metrics.totalValue}
          icon={TrendingUp}
        />
      </div>

      <div className="space-y-4 rounded-3xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={
                handleSelectAll
              }
              className="text-xs font-semibold text-gold-400 transition-colors hover:text-gold-300"
            >
              {selectedIds.size ===
                filteredAndSortedProps.length
                ? 'Deselect All'
                : 'Select All'}
            </button>

            {selectedIds.size > 0 && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-cream">
                {selectedIds.size}{' '}
                Selected
              </span>
            )}
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={
                  handleBulkCompare
                }
                className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-cream/70 transition-colors hover:bg-white/5 hover:text-gold-400"
              >
                <Scale className="h-3.5 w-3.5" />
                Compare
              </button>

              <button
                type="button"
                onClick={() =>
                  setIsShareOpen(
                    true,
                  )
                }
                className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-cream/70 transition-colors hover:bg-white/5 hover:text-blue-400"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </button>

              <button
                type="button"
                onClick={() =>
                  setIsRemoveOpen(
                    true,
                  )
                }
                className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-rose-400/70 transition-colors hover:bg-white/5 hover:text-rose-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          )}
        </div>

        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={
            setSearchQuery
          }
          searchPlaceholder="Search favorites..."
          actions={
            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <label className="pl-1 text-[10px] font-semibold uppercase tracking-wider text-ink/50">
                  City
                </label>

                <select
                  value={
                    filterLocation
                  }
                  onChange={(event) =>
                    setFilterLocation(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:outline-none"
                >
                  {uniqueLocations.map(
                    (location) => (
                      <option
                        key={location}
                        value={location}
                      >
                        {location}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="pl-1 text-[10px] font-semibold uppercase tracking-wider text-ink/50">
                  Property Type
                </label>

                <select
                  value={filterType}
                  onChange={(event) =>
                    setFilterType(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:outline-none"
                >
                  {uniqueTypes.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="pl-1 text-[10px] font-semibold uppercase tracking-wider text-ink/50">
                  Sort By
                </label>

                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-2.5 text-sm text-cream focus:outline-none"
                >
                  <option value="newest">
                    Recently Saved
                  </option>

                  <option value="oldest">
                    Oldest Saved
                  </option>

                  <option value="price_desc">
                    Price (High to Low)
                  </option>

                  <option value="price_asc">
                    Price (Low to High)
                  </option>

                  <option value="alpha">
                    Alphabetical
                  </option>
                </select>
              </div>
            </div>
          }
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAndSortedProps.map(
          (property) => (
            <div
              key={property.id}
              className="group relative"
            >
              <div className="absolute left-4 top-4 z-10">
                <input
                  type="checkbox"
                  checked={selectedIds.has(
                    property.id,
                  )}
                  onChange={() =>
                    handleSelect(
                      property.id,
                    )
                  }
                  className="h-5 w-5 cursor-pointer rounded border-white/20 bg-navy-900/80 checked:border-gold-400 checked:bg-gold-400 focus:ring-gold-400 focus:ring-offset-navy-900"
                  aria-label={`Select ${property.title}`}
                />
              </div>

              <PropertyCard
                property={property}
              />
            </div>
          ),
        )}
      </div>

      <ConfirmationModal
        isOpen={isRemoveOpen}
        onClose={() =>
          setIsRemoveOpen(false)
        }
        onConfirm={
          handleBulkRemoveConfirm
        }
        title="Remove Saved Properties"
        message={`Are you sure you want to remove ${selectedIds.size} propert${selectedIds.size === 1
            ? 'y'
            : 'ies'
          } from your favorites?`}
        confirmText="Remove"
        type="danger"
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() =>
          setIsShareOpen(false)
        }
        onShare={
          handleShareSubmit
        }
        propertyTitle={`${selectedIds.size} Selected Properties`}
      />
    </div>
  );
}