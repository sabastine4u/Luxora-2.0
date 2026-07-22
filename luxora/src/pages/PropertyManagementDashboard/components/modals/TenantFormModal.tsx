/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton } from '../../../../components/ui/ui';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import type { Tenant } from '../../../../types/propertyManager';

interface TenantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tenant: Partial<Tenant>) => void;
  initialData?: Tenant | null;
}

export function TenantFormModal({ isOpen, onClose, onSubmit, initialData }: TenantFormModalProps) {
  const [formData, setFormData] = useState<Partial<Tenant>>({
    name: '',
    email: '',
    phone: '',
    unit: '',
    status: 'Active'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '', email: '', phone: '', unit: '', status: 'Active' });
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!formData.name || !formData.email) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Tenant" : "Add New Tenant"}
      size="lg"
      actionButton={
        <GoldButton onClick={handleSubmit} disabled={!formData.name || !formData.email}>
          {initialData ? "Save Changes" : "Add Tenant"}
        </GoldButton>
      }
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Input 
          label="Full Name" 
          placeholder="Enter full name" 
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <Input 
          label="Email Address" 
          placeholder="Enter email" 
          type="email"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Input 
          label="Phone Number" 
          placeholder="Enter phone number" 
          value={formData.phone || ''}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <Input 
          label="Unit / Property" 
          placeholder="e.g. Apt 4B" 
          value={formData.unit || ''}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
        />
        <Select 
          label="Status" 
          options={[
            { value: 'Active', label: 'Active' },
            { value: 'Moving Out', label: 'Moving Out' },
            { value: 'Past', label: 'Past' },
            { value: 'Eviction', label: 'Eviction' },
          ]}
          value={formData.status || 'Active'}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as Tenant['status'] })}
        />
      </div>
    </Modal>
  );
}
