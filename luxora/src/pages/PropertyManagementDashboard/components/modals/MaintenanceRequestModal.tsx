import { useState } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton } from '../../../../components/ui/ui';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Textarea } from '../../../../components/ui/Textarea';

interface MaintenanceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { propertyId: string; priority: string; title: string; description: string }) => void;
}

export function MaintenanceRequestModal({ isOpen, onClose, onSubmit }: MaintenanceRequestModalProps) {
  const [propertyId, setPropertyId] = useState('');
  const [priority, setPriority] = useState('Low');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!propertyId || !title) return;
    onSubmit({ propertyId, priority, title, description });
    setPropertyId('');
    setPriority('Low');
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Maintenance Ticket"
      size="md"
      actionButton={
        <GoldButton onClick={handleSubmit} disabled={!propertyId || !title}>
          Submit Request
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
        <Select 
          label="Priority" 
          options={[
            { value: 'Low', label: 'Low' },
            { value: 'Medium', label: 'Medium' },
            { value: 'High', label: 'High' },
            { value: 'Emergency', label: 'Emergency' },
          ]}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        />
        <Input 
          label="Issue Title" 
          placeholder="e.g. Broken AC Unit" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea 
          label="Description" 
          placeholder="Detailed description of the issue..." 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </Modal>
  );
}
