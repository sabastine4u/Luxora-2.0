import { useState } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton } from '../../../../components/ui/ui';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { tenantId: string; amount: string; method: string }) => void;
}

export function PaymentModal({ isOpen, onClose, onSubmit }: PaymentModalProps) {
  const [tenantId, setTenantId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');

  const handleSubmit = () => {
    if (!tenantId || !amount || !method) return;
    onSubmit({ tenantId, amount, method });
    setTenantId('');
    setAmount('');
    setMethod('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Payment"
      size="md"
      actionButton={
        <GoldButton onClick={handleSubmit} disabled={!tenantId || !amount || !method}>
          Submit Payment
        </GoldButton>
      }
    >
      <div className="space-y-4">
        <Select 
          label="Tenant" 
          options={[
            { value: 'Dr. Ayo Balogun', label: 'Dr. Ayo Balogun' },
            { value: 'Sarah Jenkins', label: 'Sarah Jenkins' },
            { value: 'TechFlow Ltd', label: 'TechFlow Ltd' },
          ]}
          value={tenantId}
          onChange={(e) => setTenantId(e.target.value)}
        />
        <Input 
          label="Amount (₦)" 
          placeholder="e.g. 1500000" 
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Select 
          label="Payment Method" 
          options={[
            { value: 'Bank Transfer', label: 'Bank Transfer' },
            { value: 'Card', label: 'Card' },
            { value: 'Cash', label: 'Cash' },
            { value: 'Cheque', label: 'Cheque' },
          ]}
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        />
      </div>
    </Modal>
  );
}
