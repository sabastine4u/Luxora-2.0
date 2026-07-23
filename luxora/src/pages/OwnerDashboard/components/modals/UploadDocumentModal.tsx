import { useState } from 'react';
import { Upload } from 'lucide-react';
import { GhostButton, GoldButton } from '../../../../components/ui/ui';
import { Modal } from '../../../../components/ui/Modal';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (type: string, file: File | null, notes: string) => void;
  title?: string;
}

export default function UploadDocumentModal({ isOpen, onClose, onUpload, title = 'Upload Document' }: UploadDocumentModalProps) {
  const [docType, setDocType] = useState('Title Deed');
  const [notes, setNotes] = useState('');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">Document Type</label>
          <select value={docType} onChange={e => setDocType(e.target.value)} className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-gold-400">
            <option>Title Deed</option>
            <option>Government ID</option>
            <option>Survey Plan</option>
            <option>Utility Bill</option>
            <option>Property Photos</option>
            <option>Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">Select File</label>
          <div className="w-full border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-colors">
            <Upload className="h-8 w-8 text-ink/40 mb-3" />
            <p className="text-sm text-cream font-medium">Click to browse or drag and drop</p>
            <p className="text-xs text-ink/50 mt-1">PDF, JPG, PNG up to 10MB</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">Notes (Optional)</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-gold-400 resize-none" placeholder="Add any relevant notes..." />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <GoldButton onClick={() => onUpload(docType, null, notes)}>Upload Document</GoldButton>
        </div>
      </div>
    </Modal>
  );
}
