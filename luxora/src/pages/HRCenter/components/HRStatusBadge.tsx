interface HRStatusBadgeProps {
  status: string;
  className?: string;
}

export const HRStatusBadge = ({ status, className = '' }: HRStatusBadgeProps) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {status}
    </span>
  );
};
