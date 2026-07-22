import { useState, useEffect } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton } from '../../../../components/ui/ui';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Textarea } from '../../../../components/ui/Textarea';
import type { ServiceRequest } from '../../../../types';

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ServiceRequest>) => void;
  initialData?: ServiceRequest | null;
}

export function ServiceRequestModal({ isOpen, onClose, onSubmit, initialData }: ServiceRequestModalProps) {
  const [formData, setFormData] = useState<Partial<ServiceRequest>>({
    customerName: '',
    category: '',
    priority: 'Low',
    location: '',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(initialData);
    } else {
      setFormData({ customerName: '', category: '', priority: 'Low', location: '', description: '' });
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!formData.customerName || !formData.category) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Service Request" : "Create Service Request"}
      size="md"
      actionButton={
        <GoldButton onClick={handleSubmit} disabled={!formData.customerName || !formData.category}>
          {initialData ? "Save Changes" : "Create Request"}
        </GoldButton>
      }
    >
      <div className="space-y-4">
        <Input 
          label="Customer Name" 
          placeholder="e.g. Dr. Ayo Balogun" 
          value={formData.customerName || ''}
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
        />
        <Select 
          label="Category" 
          options={[
            { value: 'Cleaning', label: 'Cleaning' },
            { value: 'Electrical', label: 'Electrical' },
            { value: 'Plumbing', label: 'Plumbing' },
            { value: 'Security', label: 'Security' },
            { value: 'Landscaping', label: 'Landscaping' },
          ]}
          value={formData.category || ''}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />
        <Select 
          label="Priority" 
          options={[
            { value: 'Low', label: 'Low' },
            { value: 'Medium', label: 'Medium' },
            { value: 'High', label: 'High' },
            { value: 'Emergency', label: 'Emergency' },
          ]}
          value={formData.priority || 'Low'}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value as ServiceRequest['priority'] })}
        />
        <Input 
          label="Location" 
          placeholder="e.g. Victoria Island, Lagos" 
          value={formData.location || ''}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
        <Textarea 
          label="Description" 
          placeholder="Describe the service needed..." 
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
    </Modal>
  );
}
