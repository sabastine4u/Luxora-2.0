import { useState, useRef, useEffect } from 'react';
import { Download, FileText, Table as TableIcon, FileSpreadsheet } from 'lucide-react';
import { GhostButton } from '../ui/ui';

export interface EnterpriseExportMenuProps {
  onExport: (format: 'pdf' | 'csv' | 'excel') => void;
}

export function EnterpriseExportMenu({ onExport }: EnterpriseExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    onExport(format);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <GhostButton size="sm" className="bg-navy-900/80" onClick={() => setIsOpen(!isOpen)}>
        <Download className="h-4 w-4 mr-2"/> Export
      </GhostButton>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-navy-800 shadow-2xl z-50 overflow-hidden">
          <div className="p-1">
            <button 
              onClick={() => handleExport('pdf')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-cream hover:bg-white/5 rounded-lg transition-colors text-left"
            >
              <FileText className="h-4 w-4 text-ink/60" /> Export as PDF
            </button>
            <button 
              onClick={() => handleExport('csv')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-cream hover:bg-white/5 rounded-lg transition-colors text-left"
            >
              <TableIcon className="h-4 w-4 text-ink/60" /> Export as CSV
            </button>
            <button 
              onClick={() => handleExport('excel')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-cream hover:bg-white/5 rounded-lg transition-colors text-left"
            >
              <FileSpreadsheet className="h-4 w-4 text-ink/60" /> Export as Excel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
