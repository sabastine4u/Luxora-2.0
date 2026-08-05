import { useState } from 'react';
import { Modal } from '../../../ui/Modal';
import { GoldButton } from '../../../ui/ui';
import { Select } from '../../../ui/Select';
import { Textarea } from '../../../ui/Textarea';
import type { AdminListing } from '../../../../types/admin';

export interface AssignAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: AdminListing | null;
  onSave: (listingId: string, agencyName: string, notes: string) => void;
}

export function AssignAgentModal({ isOpen, onClose, listing, onSave }: AssignAgentModalProps) {
  const [agency, setAgency] = useState('Meridian Luxury');
  const [notes, setNotes] = useState('');

  if (!listing) return null;

  const handleSubmit = () => {
    onSave(listing.id, agency, notes);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Agent / Agency"
      actionButton={
        <GoldButton onClick={handleSubmit} size="sm">Assign</GoldButton>
      }
    >
      <div className="space-y-4">
        <Select 
          label="Select Agency"
          value={agency}
          onChange={(e) => setAgency(e.target.value)}
          options={[
            { value: 'Meridian Luxury', label: 'Meridian Luxury' },
            { value: 'Apex Real Estate', label: 'Apex Real Estate' },
            { value: 'Summit Properties', label: 'Summit Properties' }
          ]}
        />
        <Textarea 
          label="Assignment Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes for the assigned agency..."
          rows={4}
        />
      </div>
    </Modal>
  );
}
