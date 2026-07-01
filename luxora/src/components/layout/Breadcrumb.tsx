import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="mb-4 flex items-center gap-2 text-sm text-ink/60">
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="h-4 w-4 text-ink/40" />}
          {item.href ? (
            <Link to={item.href} className="hover:text-gold-400 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-cream">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
