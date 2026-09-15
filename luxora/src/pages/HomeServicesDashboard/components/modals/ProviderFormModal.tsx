import { useState, useEffect } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton } from '../../../../components/ui/ui';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import type { ServiceProvider } from '../../../../types';

interface ProviderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: Partial<ServiceProvider>,
  ) => void | Promise<void>;
  initialData?: ServiceProvider | null;
}

export function ProviderFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ProviderFormModalProps) {
  const [formData, setFormData] =
    useState<Partial<ServiceProvider>>({
      name: '',
      category: '',
      contactEmail: '',
      contactPhone: '',
      status: 'Pending',
    });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: initialData.name || '',
        category: initialData.category || '',
        contactEmail:
          initialData.contactEmail || '',
        contactPhone:
          initialData.contactPhone || '',
        status:
          initialData.status || 'Pending',
      });
    } else {
      setFormData({
        name: '',
        category: '',
        contactEmail: '',
        contactPhone: '',
        status: 'Pending',
      });
    }
  }, [initialData, isOpen]);

  const isValid =
    Boolean(formData.name?.trim()) &&
    Boolean(formData.category);

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      await onSubmit({
        name: formData.name?.trim(),
        category: formData.category,
        contactEmail:
          formData.contactEmail?.trim(),
        contactPhone:
          formData.contactPhone?.trim(),
      });

      setFormData({
        name: '',
        category: '',
        contactEmail: '',
        contactPhone: '',
        status: 'Pending',
      });

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={
        isSubmitting ? () => {} : onClose
      }
      title={
        initialData
          ? 'Edit Provider'
          : 'Onboard New Provider'
      }
      size="md"
      actionButton={
        <GoldButton
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting
            ? 'Submitting...'
            : initialData
              ? 'Save Changes'
              : 'Submit Onboarding'}
        </GoldButton>
      }
    >
      <div className="space-y-4">
        <Input
          label="Provider / Company Name"
          placeholder="e.g. Apex Electric"
          value={formData.name || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
        />

        <Select
          label="Category"
          options={[
            {
              value: 'Cleaning',
              label: 'Cleaning',
            },
            {
              value: 'Electrical',
              label: 'Electrical',
            },
            {
              value: 'Plumbing',
              label: 'Plumbing',
            },
            {
              value: 'Security',
              label: 'Security',
            },
            {
              value: 'Landscaping',
              label: 'Landscaping',
            },
          ]}
          value={formData.category || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              category: e.target.value,
            })
          }
        />

        <Input
          label="Email Address"
          placeholder="e.g. contact@apex.com"
          type="email"
          value={formData.contactEmail || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              contactEmail: e.target.value,
            })
          }
        />

        <Input
          label="Phone Number"
          placeholder="e.g. +234 800..."
          value={formData.contactPhone || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              contactPhone: e.target.value,
            })
          }
        />
      </div>
    </Modal>
  );
}