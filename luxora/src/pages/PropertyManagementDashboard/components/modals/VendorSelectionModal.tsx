import { useState } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton } from '../../../../components/ui/ui';
import { Select } from '../../../../components/ui/Select';
import { Textarea } from '../../../../components/ui/Textarea';

interface VendorSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { vendorId: string; notes: string }) => void;
}

export function VendorSelectionModal({ isOpen, onClose, onSubmit }: VendorSelectionModalProps) {
  const [vendorId, setVendorId] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!vendorId) return;
    onSubmit({ vendorId, notes });
    setVendorId('');
    setNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Vendor"
      size="md"
      actionButton={
        <GoldButton onClick={handleSubmit} disabled={!vendorId}>
          Confirm Assignment
        </GoldButton>
      }
    >
      <div className="space-y-4">
        <Select 
          label="Select Vendor" 
          options={[
            { value: 'FixIt Pros', label: 'FixIt Pros (General Maintenance)' },
            { value: 'CoolAir HVAC', label: 'CoolAir HVAC (AC/Heating)' },
            { value: 'AquaPlumb', label: 'AquaPlumb (Plumbing)' },
            { value: 'VoltElectric', label: 'VoltElectric (Electrical)' },
          ]}
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
        />
        <Textarea 
          label="Instructions for Vendor (Optional)" 
          placeholder="e.g. Call tenant before arriving..." 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </Modal>
  );
}
