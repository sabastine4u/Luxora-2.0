interface PropertyResultsSummaryProps {
  filteredCount: number;
  totalCount?: number;
  listingType?: string;
  location?: string;
  type?: string;
}

export function PropertyResultsSummary({ filteredCount, listingType, location, type }: PropertyResultsSummaryProps) {
  const parts = [`${filteredCount} Properties`];
  
  if (listingType && listingType !== 'Any') {
    parts.push(listingType.charAt(0).toUpperCase() + listingType.slice(1));
  }
  if (location && location !== 'Any Location') {
    parts.push(location);
  }
  if (type && type !== 'Any Type') {
    parts.push(type);
  }

  return (
    <div className="text-sm font-medium text-cream">
      {parts.join(' • ')}
    </div>
  );
}
