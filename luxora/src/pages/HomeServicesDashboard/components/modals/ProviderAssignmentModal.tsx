import { useState } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton } from '../../../../components/ui/ui';
import { Select } from '../../../../components/ui/Select';
import { Textarea } from '../../../../components/ui/Textarea';

interface ProviderAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { providerId: string; notes?: string }) => void;
  requestCategory?: string;
}

export function ProviderAssignmentModal({ isOpen, onClose, onSubmit, requestCategory }: ProviderAssignmentModalProps) {
  const [providerId, setProviderId] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!providerId) return;
    onSubmit({ providerId, notes });
    setProviderId('');
    setNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Provider"
      size="md"
      actionButton={
        <GoldButton onClick={handleSubmit} disabled={!providerId}>
          Confirm Assignment
        </GoldButton>
      }
    >
      <div className="space-y-4">
        {requestCategory && (
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl mb-4">
            <span className="text-sm text-ink/60">Filtering providers for: </span>
            <span className="text-sm font-bold text-gold-400">{requestCategory}</span>
          </div>
        )}
        <Select 
          label="Select Verified Provider" 
          options={[
            { value: 'PRV-001', label: 'Pristine Cleaners (4.9⭐)' },
            { value: 'PRV-002', label: 'Volt Electricians (4.8⭐)' },
            { value: 'PRV-003', label: 'AquaPlumb Services (4.6⭐)' },
            { value: 'PRV-004', label: 'SafeGuard Pro (4.9⭐)' },
          ]}
          value={providerId}
          onChange={(e) => setProviderId(e.target.value)}
        />
        <Textarea 
          label="Assignment Notes (Optional)" 
          placeholder="e.g. Client requested arrival before noon..." 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </Modal>
  );
}
