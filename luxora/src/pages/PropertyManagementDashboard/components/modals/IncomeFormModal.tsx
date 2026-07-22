import { useState } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton } from '../../../../components/ui/ui';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Textarea } from '../../../../components/ui/Textarea';

interface IncomeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { propertyId: string; source: string; amount: string; description: string }) => void;
}

export function IncomeFormModal({ isOpen, onClose, onSubmit }: IncomeFormModalProps) {
  const [propertyId, setPropertyId] = useState('');
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!propertyId || !source || !amount) return;
    onSubmit({ propertyId, source, amount, description });
    setPropertyId('');
    setSource('');
    setAmount('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Income"
      size="md"
      actionButton={
        <GoldButton onClick={handleSubmit} disabled={!propertyId || !source || !amount}>
          Submit Income
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
          label="Income Source" 
          options={[
            { value: 'Rent', label: 'Rent' },
            { value: 'Late Fee', label: 'Late Fee' },
            { value: 'Security Deposit', label: 'Security Deposit' },
            { value: 'Other', label: 'Other' },
          ]}
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <Input 
          label="Amount (₦)" 
          type="number"
          placeholder="e.g. 50000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Textarea 
          label="Description / Payer" 
          placeholder="Add any relevant notes..." 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </Modal>
  );
}
