import { useState } from 'react';
import { Modal } from '../../../ui/Modal';
import { GoldButton } from '../../../ui/ui';
import { Input } from '../../../ui/Input';
import { Select } from '../../../ui/Select';
import type { AdminListing } from '../../../../types/admin';

export interface ListingEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: AdminListing | null;
  onSave: (updated: AdminListing) => void;
}

export function ListingEditModal({ isOpen, onClose, listing, onSave }: ListingEditModalProps) {
  const [formData, setFormData] = useState<Partial<AdminListing>>(listing || {});
  const [prevListingId, setPrevListingId] = useState<string | undefined>(listing?.id);

  if (listing && listing.id !== prevListingId) {
    setFormData(listing);
    setPrevListingId(listing.id);
  }

  if (!listing) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as AdminListing);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Listing"
      size="2xl"
      actionButton={
        <GoldButton onClick={handleSubmit} size="sm">Save Changes</GoldButton>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Title" 
          value={formData.title || ''} 
          onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
          required 
        />
        <Input 
          label="Owner" 
          value={formData.owner || ''} 
          onChange={(e) => setFormData({ ...formData, owner: e.target.value })} 
          required 
        />
        <Input 
          label="Location" 
          value={formData.location || ''} 
          onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
          required 
        />
        <Input 
          label="Price" 
          value={formData.price || ''} 
          onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
          required 
        />
        <Select 
          label="Priority"
          value={formData.priority || 'Normal'}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          options={[
            { value: 'Normal', label: 'Normal' },
            { value: 'High', label: 'High' }
          ]}
        />
      </form>
    </Modal>
  );
}
