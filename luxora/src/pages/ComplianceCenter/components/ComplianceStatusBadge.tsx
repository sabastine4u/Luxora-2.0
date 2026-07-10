interface ComplianceStatusBadgeProps {
  status: string;
  className?: string;
}

export const ComplianceStatusBadge = ({ status, className = '' }: ComplianceStatusBadgeProps) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {status}
    </span>
  );
};
