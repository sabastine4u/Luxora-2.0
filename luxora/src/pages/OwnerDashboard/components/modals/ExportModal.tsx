import { useState } from 'react';
import { FileText, FileSpreadsheet, FileIcon } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../../components/ui/ui';
import { Modal } from '../../../../components/ui/Modal';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string) => void;
  title?: string;
}

export default function ExportModal({ isOpen, onClose, onExport, title = 'Export Data' }: ExportModalProps) {
  const [format, setFormat] = useState('pdf');

  const formats = [
    { id: 'pdf', name: 'PDF Document', icon: FileText, desc: 'Best for printing and sharing' },
    { id: 'excel', name: 'Excel Spreadsheet', icon: FileSpreadsheet, desc: 'Best for data analysis' },
    { id: 'csv', name: 'CSV File', icon: FileIcon, desc: 'Raw data format' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="grid gap-3">
          {formats.map(f => (
            <div 
              key={f.id}
              onClick={() => setFormat(f.id)}
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                format === f.id ? 'bg-gold-400/10 border-gold-400/50' : 'bg-navy-800 border-white/10 hover:border-white/20'
              }`}
            >
              <div className={`p-2 rounded-lg ${format === f.id ? 'bg-gold-400/20 text-gold-400' : 'bg-white/5 text-ink/60'}`}>
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className={`font-medium ${format === f.id ? 'text-gold-400' : 'text-cream'}`}>{f.name}</h4>
                <p className="text-xs text-ink/50 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <GoldButton onClick={() => onExport(format)}>Export</GoldButton>
        </div>
      </div>
    </Modal>
  );
}
