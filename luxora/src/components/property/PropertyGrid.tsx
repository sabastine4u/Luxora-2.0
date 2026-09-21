import React from 'react';
import { Search } from 'lucide-react';
import { EmptyState } from '../layout/EmptyState';
import { PropertyCard } from './PropertyCard';
import type { Property } from '../../types';

interface PropertyGridProps {
  properties: Property[];
  emptyTitle?: string;
  emptyDescription?: string;
  onClearFilters?: () => void;
  gridClassName?: string;
  viewMode?: 'grid' | 'list' | 'map';
  isLoading?: boolean;
  children?: React.ReactNode;
}

function PropertyGridSkeleton({
  viewMode,
  gridClassName,
}: {
  viewMode: 'grid' | 'list' | 'map';
  gridClassName: string;
}) {
  const skeletonCount = viewMode === 'list' ? 4 : 6;

  const containerClass =
    viewMode === 'list'
      ? 'flex flex-col space-y-6'
      : gridClassName;

  return (
    <div
      className={containerClass}
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading properties"
    >
      {Array.from({ length: skeletonCount }).map(
        (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-lg animate-pulse"
          >
            <div className="h-56 bg-white/[0.05]" />

            <div className="space-y-4 p-5">
              <div className="h-4 w-3/4 rounded bg-white/[0.06]" />
              <div className="h-3 w-1/2 rounded bg-white/[0.06]" />

              <div className="flex gap-3">
                <div className="h-3 w-16 rounded bg-white/[0.06]" />
                <div className="h-3 w-16 rounded bg-white/[0.06]" />
                <div className="h-3 w-16 rounded bg-white/[0.06]" />
              </div>

              <div className="h-5 w-28 rounded bg-white/[0.06]" />
            </div>
          </div>
        ),
      )}
    </div>
  );
}

export function PropertyGrid({
  properties,
  emptyTitle = 'No properties found',
  emptyDescription = "We couldn't find any properties matching your current filters. Try adjusting your search criteria.",
  onClearFilters,
  gridClassName = 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
  viewMode = 'grid',
  isLoading = false,
  children,
}: PropertyGridProps) {
  // Never show the empty state while the backend request is still running.
  if (isLoading) {
    return (
      <PropertyGridSkeleton
        viewMode={viewMode}
        gridClassName={gridClassName}
      />
    );
  }

  if (properties.length === 0) {
    return (
      <EmptyState
        icon={
          <Search className="h-8 w-8 text-ink/50" />
        }
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={
          onClearFilters ? 'Clear Filters' : undefined
        }
        onAction={onClearFilters}
        secondaryActionLabel="Browse All Properties"
        onSecondaryAction={onClearFilters}
      />
    );
  }

  const containerClass =
    viewMode === 'list'
      ? 'flex flex-col space-y-6'
      : gridClassName;

  return (
    <>
      <div className={containerClass}>
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            variant={
              viewMode === 'map'
                ? 'grid'
                : viewMode
            }
          />
        ))}
      </div>

      {children}
    </>
  );
}