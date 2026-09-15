import { useEffect, useState } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { GoldButton } from '../../../../components/ui/ui';
import { Select } from '../../../../components/ui/Select';
import { Textarea } from '../../../../components/ui/Textarea';
import type { ServiceProvider } from '../../../../types';
import { homeServicesApi } from '../../../../api/home-services.api';

interface ProviderAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    providerId: string;
    notes?: string;
  }) => void | Promise<void>;
  requestCategory?: string;
}

export function ProviderAssignmentModal({
  isOpen,
  onClose,
  onSubmit,
  requestCategory,
}: ProviderAssignmentModalProps) {
  const [providers, setProviders] = useState<ServiceProvider[]>(
    [],
  );

  const [providerId, setProviderId] = useState('');
  const [notes, setNotes] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProviders = async () => {
    try {
      setIsLoading(true);

      const response =
        await homeServicesApi.getServiceProviders();

      const verifiedActiveProviders = (
        response.providers || []
      ).filter(
        (provider: ServiceProvider) =>
          provider.status === 'Active' &&
          provider.verificationStatus === 'Verified',
      );

      setProviders(verifiedActiveProviders);
    } catch (error) {
      console.error(
        'Failed to load providers for assignment:',
        error,
      );

      setProviders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    setProviderId('');
    setNotes('');

    loadProviders();
  }, [isOpen]);

  const filteredProviders = requestCategory
    ? providers.filter(
        (provider) =>
          provider.category === requestCategory,
      )
    : providers;

  const handleSubmit = async () => {
    if (!providerId || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      await onSubmit({
        providerId,
        notes: notes.trim() || undefined,
      });

      setProviderId('');
      setNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const providerOptions = filteredProviders.map(
    (provider) => ({
      value: provider.id,
      label: `${provider.name}${
        provider.rating > 0
          ? ` (${provider.rating.toFixed(1)}⭐)`
          : ''
      }`,
    }),
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={
        isSubmitting ? () => {} : onClose
      }
      title="Assign Provider"
      size="md"
      actionButton={
        <GoldButton
          onClick={handleSubmit}
          disabled={
            !providerId ||
            isLoading ||
            isSubmitting
          }
        >
          {isSubmitting
            ? 'Assigning...'
            : 'Confirm Assignment'}
        </GoldButton>
      }
    >
      <div className="space-y-4">
        {requestCategory && (
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl mb-4">
            <span className="text-sm text-ink/60">
              Filtering providers for:{' '}
            </span>

            <span className="text-sm font-bold text-gold-400">
              {requestCategory}
            </span>
          </div>
        )}

        {isLoading ? (
          <div className="py-6 text-center text-sm text-ink/50">
            Loading verified providers...
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="py-6 text-center text-sm text-ink/50">
            No verified active providers are available
            for this category.
          </div>
        ) : (
          <Select
            label="Select Verified Provider"
            options={providerOptions}
            value={providerId}
            onChange={(e) =>
              setProviderId(e.target.value)
            }
          />
        )}

        <Textarea
          label="Assignment Notes (Optional)"
          placeholder="e.g. Client requested arrival before noon..."
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
        />
      </div>
    </Modal>
  );
}