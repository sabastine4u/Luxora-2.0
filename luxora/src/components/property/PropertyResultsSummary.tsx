interface PropertyResultsSummaryProps {
  filteredCount: number;
  totalCount?: number;
  listingType?: string;
  location?: string;
  type?: string;
  currentPage?: number;
  itemsPerPage?: number;
}

export function PropertyResultsSummary({ 
  filteredCount, 
  listingType, 
  location, 
  type,
  currentPage,
  itemsPerPage 
}: PropertyResultsSummaryProps) {
  
  const parts = [];

  // Determine prefix: "Showing X-Y of Z" or "Z"
  if (filteredCount > 0 && currentPage && itemsPerPage) {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, filteredCount);
    parts.push(`Showing ${start}–${end} of ${filteredCount}`);
  } else {
    parts.push(`${filteredCount}`);
  }
  
  // Construct entity phrase
  const entityParts = [];
  if (listingType && listingType !== 'Any') {
    entityParts.push(listingType.charAt(0).toUpperCase() + listingType.slice(1));
  }
  
  if (type && type !== 'Any Type') {
    entityParts.push(type + (filteredCount === 1 ? '' : 's'));
  } else {
    entityParts.push(filteredCount === 1 ? 'Property' : 'Properties');
  }
  
  parts.push(entityParts.join(' '));

  // Add location
  if (location && location !== 'Any Location') {
    parts.push(`in ${location}`);
  }

  return (
    <div className="text-sm font-medium text-cream">
      {parts.join(' ')}
    </div>
  );
}
