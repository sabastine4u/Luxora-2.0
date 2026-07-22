import { useState } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton } from '../../../../components/ui/ui';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Textarea } from '../../../../components/ui/Textarea';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { propertyId: string; category: string; amount: string; description: string }) => void;
}

export function ExpenseFormModal({ isOpen, onClose, onSubmit }: ExpenseFormModalProps) {
  const [propertyId, setPropertyId] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!propertyId || !category || !amount) return;
    onSubmit({ propertyId, category, amount, description });
    setPropertyId('');
    setCategory('');
    setAmount('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Expense"
      size="md"
      actionButton={
        <GoldButton onClick={handleSubmit} disabled={!propertyId || !category || !amount}>
          Submit Expense
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
          label="Category" 
          options={[
            { value: 'Maintenance', label: 'Maintenance' },
            { value: 'Utilities', label: 'Utilities' },
            { value: 'Insurance', label: 'Insurance' },
            { value: 'Taxes', label: 'Taxes' },
          ]}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Input 
          label="Amount (₦)" 
          type="number"
          placeholder="e.g. 50000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Textarea 
          label="Description / Vendor" 
          placeholder="Add any relevant notes..." 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </Modal>
  );
}
