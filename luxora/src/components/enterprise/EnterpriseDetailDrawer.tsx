import { X } from 'lucide-react';
import type { ReactNode } from 'react';

export interface EnterpriseDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footerActions?: ReactNode;
}

export function EnterpriseDetailDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footerActions
}: EnterpriseDetailDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[100] bg-navy-950/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 z-[101] w-full max-w-md bg-navy-900 border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/10 shrink-0">
          <div>
            <h2 className="font-heading text-xl font-bold text-cream">{title}</h2>
            {subtitle && <p className="text-sm text-ink/60 mt-1">{subtitle}</p>}
          </div>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-ink/40 hover:text-cream hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar space-y-6">
          {children}
        </div>

        {/* Footer */}
        {footerActions && (
          <div className="p-6 border-t border-white/10 shrink-0 bg-navy-800/50 flex flex-wrap gap-3">
            {footerActions}
          </div>
        )}
      </div>
    </>
  );
}
