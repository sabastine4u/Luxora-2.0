import { useState } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton } from '../../../../components/ui/ui';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';

interface InspectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { propertyId: string; date: string; inspector: string }) => void;
}

export function InspectionFormModal({ isOpen, onClose, onSubmit }: InspectionFormModalProps) {
  const [propertyId, setPropertyId] = useState('');
  const [date, setDate] = useState('');
  const [inspector, setInspector] = useState('');

  const handleSubmit = () => {
    if (!propertyId || !date || !inspector) return;
    onSubmit({ propertyId, date, inspector });
    setPropertyId('');
    setDate('');
    setInspector('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Inspection"
      size="md"
      actionButton={
        <GoldButton onClick={handleSubmit} disabled={!propertyId || !date || !inspector}>
          Schedule
        </GoldButton>
      }
    >
      <div className="space-y-4">
        <Select 
          label="Property" 
          options={[
            { value: 'Lekki Phase 1 Apt', label: 'Lekki Phase 1 Apt' },
            { value: 'Victoria Island Villa', label: 'Victoria Island Villa' },
            { value: 'Abuja Central Office', label: 'Abuja Central Office' },
          ]}
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
        />
        <Input 
          label="Inspection Date" 
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Select 
          label="Inspector" 
          options={[
            { value: 'Internal Team', label: 'Internal Team' },
            { value: 'External Auditor', label: 'External Auditor' },
            { value: 'Govt Official', label: 'Govt Official' },
          ]}
          value={inspector}
          onChange={(e) => setInspector(e.target.value)}
        />
      </div>
    </Modal>
  );
}
