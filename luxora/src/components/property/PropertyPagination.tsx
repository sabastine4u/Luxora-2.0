

interface PropertyPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PropertyPagination({ currentPage, totalPages, onPageChange }: PropertyPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex justify-center gap-2">
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-semibold transition-colors ${
            currentPage === i + 1
              ? 'border-gold-400 bg-gold-400/10 text-gold-300'
              : 'border-white/10 bg-navy-800/50 text-ink/70 hover:border-white/20 hover:text-cream'
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
