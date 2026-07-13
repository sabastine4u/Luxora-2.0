interface PropertyResultsSummaryProps {
  filteredCount: number;
  totalCount: number;
}

export function PropertyResultsSummary({ filteredCount, totalCount }: PropertyResultsSummaryProps) {
  return (
    <div className="text-sm text-ink/70">
      Showing <span className="font-semibold text-cream">{filteredCount}</span> of <span className="font-semibold text-cream">{totalCount}</span> Luxury Properties
    </div>
  );
}
