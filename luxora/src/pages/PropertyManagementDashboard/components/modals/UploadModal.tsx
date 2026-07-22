import { useState } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton } from '../../../../components/ui/ui';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Textarea } from '../../../../components/ui/Textarea';
import { UploadCloud } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; category: string; description: string }) => void;
  title?: string;
}

export function UploadModal({ isOpen, onClose, onSubmit, title = "Upload Document" }: UploadModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!name || !category) return;
    onSubmit({ name, category, description });
    setName('');
    setCategory('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      actionButton={
        <GoldButton onClick={handleSubmit} disabled={!name || !category}>
          Upload File
        </GoldButton>
      }
    >
      <div className="space-y-6">
        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center bg-navy-900/50 hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="h-12 w-12 rounded-full bg-gold-400/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="h-6 w-6 text-gold-400" />
          </div>
          <p className="text-cream font-medium">Click to select file</p>
          <p className="text-xs text-ink/40 mt-1">PDF, DOCX, JPG or PNG (max 10MB)</p>
        </div>

        <div className="space-y-4">
          <Input 
            label="Document Name" 
            placeholder="e.g. Q3 Financial Report" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Select 
            label="Category" 
            options={[
              { value: 'Lease Agreement', label: 'Lease Agreement' },
              { value: 'Financial', label: 'Financial' },
              { value: 'Property Record', label: 'Property Record' },
              { value: 'Inspection Report', label: 'Inspection Report' },
              { value: 'Other', label: 'Other' },
            ]}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <Textarea 
            label="Description (Optional)" 
            placeholder="Add any relevant notes..." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
