import { useState, useEffect } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton } from '../../../../components/ui/ui';
import { Input } from '../../../../components/ui/Input';
import { Textarea } from '../../../../components/ui/Textarea';
import type { ServiceCategory } from '../../../../types';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ServiceCategory>) => void;
  initialData?: ServiceCategory | null;
}

export function CategoryFormModal({ isOpen, onClose, onSubmit, initialData }: CategoryFormModalProps) {
  const [formData, setFormData] = useState<Partial<ServiceCategory>>({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(initialData);
    } else {
      setFormData({ name: '', description: '' });
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!formData.name) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Category" : "Add Service Category"}
      size="md"
      actionButton={
        <GoldButton onClick={handleSubmit} disabled={!formData.name}>
          {initialData ? "Save Changes" : "Create Category"}
        </GoldButton>
      }
    >
      <div className="space-y-4">
        <Input 
          label="Category Name" 
          placeholder="e.g. Swimming Pool Maintenance" 
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <Textarea 
          label="Description" 
          placeholder="Describe the services under this category..." 
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
    </Modal>
  );
}
