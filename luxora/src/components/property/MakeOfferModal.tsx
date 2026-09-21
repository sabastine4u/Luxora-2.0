import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { GoldButton, GhostButton } from '../ui/ui';
import { offerApi } from '../../api/offer.api';
import { formatCurrency } from '../../utils';
import type { Property } from '../../types';

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export function MakeOfferModal({
  isOpen,
  onClose,
  property,
}: MakeOfferModalProps) {
  const [offerAmount, setOfferAmount] = useState('');
  const [buyerNotes, setBuyerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdOfferId, setCreatedOfferId] = useState('');
  const [step, setStep] = useState<'form' | 'success'>('form');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setOfferAmount('');
    setBuyerNotes('');
    setErrorMessage('');
    setCreatedOfferId('');
    setStep('form');
    setIsSubmitting(false);
  }, [isOpen, property.id]);

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setOfferAmount('');
    setBuyerNotes('');
    setErrorMessage('');
    setCreatedOfferId('');
    setStep('form');

    onClose();
  };

  const submitOffer = async () => {
    const amount = Number(offerAmount);

    if (!amount || amount <= 0) {
      setErrorMessage('Please enter a valid offer amount.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const response = await offerApi.createOffer({
        propertyId: property.id,
        offerAmount: amount,
        buyerNotes: buyerNotes.trim(),
      });

      const offer = response?.data?.offer;

      if (!offer?._id) {
        throw new Error(
          'The offer was not returned by the server.',
        );
      }

      setCreatedOfferId(offer._id);
      setStep('success');
    } catch (error: any) {
      console.error('Failed to create offer:', error);

      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          'Unable to submit your offer. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await submitOffer();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        step === 'success'
          ? 'Offer Submitted'
          : 'Make an Offer'
      }
      size="lg"
      actionButton={
        step === 'form' ? (
          <GoldButton
            type="button"
            size="sm"
            disabled={isSubmitting}
            onClick={submitOffer}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Offer'
            )}
          </GoldButton>
        ) : null
      }
    >
      {step === 'form' ? (
        <form
          id="make-offer-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Property Summary */}
          <div className="flex gap-4 rounded-xl border border-white/5 bg-navy-900/50 p-4">
            <img
              src={property.image}
              alt={property.title}
              className="h-20 w-24 rounded-lg border border-white/10 object-cover"
            />

            <div className="flex min-w-0 flex-col justify-center">
              <h4 className="line-clamp-1 font-heading font-bold text-cream">
                {property.title}
              </h4>

              <p className="mt-1 text-xs text-ink/60">
                {property.location}
              </p>

              <p className="mt-2 text-sm font-bold text-gold-400">
                Asking Price: {formatCurrency(property.priceValue)}
              </p>
            </div>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3">
              <p className="text-sm text-rose-400">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Offer Amount */}
          <div className="space-y-1.5">
            <label
              htmlFor="offer-amount"
              className="text-sm font-medium text-cream"
            >
              Your Offer Amount (₦) *
            </label>

            <input
              id="offer-amount"
              type="number"
              min="1"
              required
              value={offerAmount}
              onChange={(event) =>
                setOfferAmount(event.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-cream transition-colors focus:border-gold-400/50 focus:outline-none"
              placeholder={property.priceValue.toString()}
            />
          </div>

          {/* Buyer Notes */}
          <div className="space-y-1.5">
            <label
              htmlFor="buyer-notes"
              className="text-sm font-medium text-cream"
            >
              Message to Owner (Optional)
            </label>

            <textarea
              id="buyer-notes"
              value={buyerNotes}
              onChange={(event) =>
                setBuyerNotes(event.target.value)
              }
              className="min-h-[120px] w-full resize-none rounded-xl border border-white/10 bg-navy-900/80 p-3 text-cream transition-colors focus:border-gold-400/50 focus:outline-none"
              placeholder="Add any important details about your offer..."
            />
          </div>

          <div className="rounded-xl border border-white/5 bg-navy-900/30 px-4 py-3">
            <p className="text-xs leading-relaxed text-ink/50">
              Your offer will be sent to the property's owner
              for review. The assigned agent will also have
              access to the offer.
            </p>
          </div>
        </form>
      ) : (
        <div className="space-y-6 py-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div>
            <h4 className="font-heading text-2xl font-bold text-cream">
              Offer Submitted
            </h4>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/70">
              Your offer of{' '}
              <strong className="text-gold-400">
                {formatCurrency(Number(offerAmount))}
              </strong>{' '}
              for{' '}
              <strong className="text-cream">
                {property.title}
              </strong>{' '}
              has been submitted successfully.
            </p>
          </div>

          {createdOfferId && (
            <div className="rounded-xl border border-white/5 bg-navy-900/50 px-4 py-3">
              <p className="text-xs text-ink/50">
                Offer ID
              </p>

              <p className="mt-1 break-all font-mono text-xs text-cream/70">
                {createdOfferId}
              </p>
            </div>
          )}

          <div className="flex justify-center">
            <GhostButton
              type="button"
              onClick={handleClose}
            >
              Done
            </GhostButton>
          </div>
        </div>
      )}
    </Modal>
  );
}