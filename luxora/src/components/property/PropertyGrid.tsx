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
  children?: React.ReactNode;
}

export function PropertyGrid({
  properties,
  emptyTitle = 'No properties found',
  emptyDescription = "We couldn't find any properties matching your current filters. Try adjusting your search criteria.",
  onClearFilters,
  gridClassName = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
  viewMode = 'grid',
  children
}: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <EmptyState
        icon={<Search className="h-8 w-8 text-ink/50" />}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={onClearFilters ? "Clear Filters" : undefined}
        onAction={onClearFilters}
        secondaryActionLabel="Browse All Properties"
        onSecondaryAction={onClearFilters}
      />
    );
  }

  const containerClass = viewMode === 'list' 
    ? "flex flex-col space-y-6" 
    : gridClassName;

  return (
    <>
      <div className={containerClass}>
        {properties.map(p => (
          <PropertyCard key={p.id} property={p} variant={viewMode === 'map' ? 'grid' : viewMode} />
        ))}
      </div>
      {children}
    </>
  );
}
