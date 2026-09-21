import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  HandCoins,
  Loader2,
  XCircle,
} from 'lucide-react';
import {
  GoldButton,
  GhostButton,
} from '../../../../components/ui/ui';
import { Modal } from '../../../../components/ui/Modal';
import { offerApi } from '../../../../api/offer.api';
import { formatCurrency } from '../../../../utils';
import type { Offer } from '../../../../types';

interface OfferActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, notes: string) => void;
  offer: Offer | null;
  actionType: 'counter' | 'revise';
}

type OfferWithCounterAmount = Offer & {
  counterOfferAmount?: number | null;
};

export function OfferActionModal({
  isOpen,
  onClose,
  onSubmit,
  offer,
  actionType,
}: OfferActionModalProps) {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [counterOfferAmount, setCounterOfferAmount] = useState<number | null>(
    null,
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Controls the Buyer counter-offer form.
  const [isMakingCounterOffer, setIsMakingCounterOffer] = useState(false);

  const currentOffer = offer as OfferWithCounterAmount | null;

  useEffect(() => {
    if (!isOpen || !offer) {
      return;
    }

    setErrorMessage('');
    setAmount('');
    setNotes('');
    setIsMakingCounterOffer(false);

    if (actionType !== 'counter') {
      setCounterOfferAmount(null);
      return;
    }

    const loadLatestCounterOffer = async () => {
      try {
        const response = await offerApi.getMyOffers();
        const backendOffers = response.data?.offers ?? [];

        const latestOffer = backendOffers.find(
          (backendOffer: any) =>
            backendOffer._id === offer.id,
        );

        setCounterOfferAmount(
          latestOffer?.counterOfferAmount ??
          currentOffer?.counterOfferAmount ??
          null,
        );
      } catch (error) {
        console.error(
          'Failed to load latest counter offer:',
          error,
        );

        setCounterOfferAmount(
          currentOffer?.counterOfferAmount ?? null,
        );
      }
    };

    loadLatestCounterOffer();
  }, [isOpen, offer, actionType, currentOffer]);

  if (!offer) {
    return null;
  }

  const handleReviseSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit(Number(amount), notes);
    onClose();
  };

  const handleAcceptCounter = async () => {
    try {
      setIsProcessing(true);
      setErrorMessage('');

      await offerApi.acceptCounterOffer(offer.id);

      onSubmit(
        counterOfferAmount ?? offer.offerAmount,
        'Counter offer accepted.',
      );

      onClose();
    } catch (error: any) {
      console.error(
        'Failed to accept counter offer:',
        error,
      );

      setErrorMessage(
        error?.response?.data?.message ||
        error?.message ||
        'Unable to accept the counter offer. Please try again.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectCounter = async () => {
    try {
      setIsProcessing(true);
      setErrorMessage('');

      await offerApi.rejectCounterOffer(offer.id);

      onSubmit(
        offer.offerAmount,
        'Counter offer rejected.',
      );

      onClose();
    } catch (error: any) {
      console.error(
        'Failed to reject counter offer:',
        error,
      );

      setErrorMessage(
        error?.response?.data?.message ||
        error?.message ||
        'Unable to reject the counter offer. Please try again.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBuyerCounterSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    const newAmount = Number(amount);

    if (!newAmount || newAmount <= 0) {
      setErrorMessage(
        'Please enter a valid counter offer amount.',
      );
      return;
    }

    if (
      counterOfferAmount !== null &&
      newAmount === counterOfferAmount
    ) {
      setErrorMessage(
        'Your counter offer should be different from the owner\'s counter.',
      );
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage('');

      await offerApi.buyerCounterOffer(
        offer.id,
        {
          counterOfferAmount: newAmount,
          buyerNotes: notes.trim(),
        });

      // Tell the parent that this Offer is now back in Submitted state.
      onSubmit(newAmount, 'Counter offer submitted.');

      onClose();
    } catch (error: any) {
      console.error(
        'Failed to submit Buyer counter offer:',
        error,
      );

      setErrorMessage(
        error?.response?.data?.message ||
        error?.message ||
        'Unable to submit your counter offer. Please try again.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isProcessing) {
          setErrorMessage('');
          setIsMakingCounterOffer(false);
          onClose();
        }
      }}
      title={
        actionType === 'counter'
          ? 'Respond to Counter Offer'
          : 'Revise Offer'
      }
      size="lg"
    >
      {actionType === 'counter' ? (
        <div className="space-y-6">
          {/* Property */}
          <div className="space-y-2 rounded-xl border border-white/5 bg-navy-900/50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink/60">
              Property
            </div>

            <div className="font-medium text-cream">
              {offer.propertyTitle}
            </div>

            {offer.location && (
              <div className="text-sm text-ink/60">
                {offer.location}
              </div>
            )}
          </div>

          {/* Offer comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/5 bg-navy-900/50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-ink/60">
                Your Offer
              </div>

              <div className="mt-2 text-lg font-bold text-cream">
                {formatCurrency(offer.offerAmount)}
              </div>
            </div>

            <div className="rounded-xl border border-gold-400/20 bg-gold-400/10 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-gold-400/70">
                Owner's Counter
              </div>

              <div className="mt-2 text-lg font-bold text-gold-400">
                {counterOfferAmount !== null
                  ? formatCurrency(counterOfferAmount)
                  : 'Counter received'}
              </div>
            </div>
          </div>

          {/* Counter details */}
          {offer.counterOfferDetails && (
            <div className="rounded-xl border border-purple-400/20 bg-purple-400/5 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                Owner's Counter Details
              </div>

              <div className="mt-2 text-sm leading-relaxed text-purple-200/80">
                {offer.counterOfferDetails}
              </div>
            </div>
          )}

          {/* Original buyer notes */}
          {offer.buyerNotes && (
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                Your Original Notes
              </div>

              <div className="mt-2 text-sm leading-relaxed text-cream/70">
                {offer.buyerNotes}
              </div>
            </div>
          )}

          {/* Error */}
          {errorMessage && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-4">
              <div className="text-sm text-red-300">
                {errorMessage}
              </div>
            </div>
          )}

          {isMakingCounterOffer ? (
            /* =========================================
             * BUYER COUNTER-OFFER FORM
             * ========================================= */
            <form
              onSubmit={handleBuyerCounterSubmit}
              className="space-y-5 border-t border-white/10 pt-6"
            >
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <HandCoins className="h-4 w-4 text-gold-400" />

                  <h4 className="font-semibold text-cream">
                    Make a Counter Offer
                  </h4>
                </div>

                <p className="text-sm leading-relaxed text-ink/60">
                  Enter the amount you are willing to offer in
                  response to the owner's counter.
                </p>
              </div>

              {/* New counter amount */}
              <div className="space-y-1.5">
                <label
                  htmlFor="buyer-counter-amount"
                  className="text-sm font-medium text-cream"
                >
                  Your Counter Offer Amount (₦)
                </label>

                <input
                  id="buyer-counter-amount"
                  type="number"
                  min="1"
                  required
                  autoFocus
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-cream transition-colors focus:border-gold-400/50 focus:outline-none"
                  placeholder={
                    counterOfferAmount
                      ? counterOfferAmount.toString()
                      : 'Enter amount...'
                  }
                />
              </div>

              {/* Buyer message */}
              <div className="space-y-1.5">
                <label
                  htmlFor="buyer-counter-notes"
                  className="text-sm font-medium text-cream"
                >
                  Message to Owner (Optional)
                </label>

                <textarea
                  id="buyer-counter-notes"
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  className="min-h-[110px] w-full resize-none rounded-xl border border-white/10 bg-navy-900/80 p-3 text-cream transition-colors focus:border-gold-400/50 focus:outline-none"
                  placeholder="E.g., I can proceed at ₦54,000,000..."
                />
              </div>

              {/* Buyer counter actions */}
              <div className="flex justify-end gap-3 border-t border-white/10 pt-6">
                <GhostButton
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setIsMakingCounterOffer(false);
                    setAmount('');
                    setNotes('');
                  }}
                  disabled={isProcessing}
                >
                  Back
                </GhostButton>

                <GoldButton
                  type="submit"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <HandCoins className="mr-2 h-4 w-4" />
                      Send Counter Offer
                    </>
                  )}
                </GoldButton>
              </div>
            </form>
          ) : (
            /* =========================================
             * COUNTER RESPONSE ACTIONS
             * ========================================= */
            <div className="flex flex-col gap-3 border-t border-white/10 pt-6">
              <div className="text-center">
                <p className="text-xs leading-relaxed text-ink/50">
                  You can accept the owner's counter, reject
                  it, or make your own counter offer.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <GhostButton
                  type="button"
                  onClick={handleRejectCounter}
                  disabled={isProcessing}
                  className="justify-center border-red-400/30 text-red-400 hover:border-red-400/50 hover:bg-red-400/5"
                >
                  {isProcessing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="mr-2 h-4 w-4" />
                  )}
                  Reject Counter
                </GhostButton>

                <GhostButton
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setAmount('');
                    setNotes('');
                    setIsMakingCounterOffer(true);
                  }}
                  disabled={isProcessing}
                  className="justify-center border-gold-400/30 text-gold-400 hover:border-gold-400/50 hover:bg-gold-400/5"
                >
                  <HandCoins className="mr-2 h-4 w-4" />
                  Make Counter
                </GhostButton>

                <GoldButton
                  type="button"
                  onClick={handleAcceptCounter}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  Accept Counter
                </GoldButton>
              </div>
            </div>
          )}
        </div>
      ) : (
        <form
          onSubmit={handleReviseSubmit}
          className="space-y-6"
        >
          {/* Property */}
          <div className="space-y-2 rounded-xl border border-white/5 bg-navy-900/50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink/60">
              Property
            </div>

            <div className="font-medium text-cream">
              {offer.propertyTitle}
            </div>

            {offer.location && (
              <div className="text-sm text-ink/60">
                {offer.location}
              </div>
            )}
          </div>

          {/* Revised offer amount */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-cream">
              Your New Offer Amount (₦)
            </label>

            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-cream transition-colors focus:border-gold-400/50 focus:outline-none"
              placeholder="Enter amount..."
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-cream">
              Notes to Agent (Optional)
            </label>

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              className="min-h-[100px] w-full resize-none rounded-xl border border-white/10 bg-navy-900/80 p-3 text-cream transition-colors focus:border-gold-400/50 focus:outline-none"
              placeholder="E.g., We can close in 14 days..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-white/10 pt-6">
            <GhostButton
              type="button"
              onClick={onClose}
            >
              Cancel
            </GhostButton>

            <GoldButton type="submit">
              Submit Offer
            </GoldButton>
          </div>
        </form>
      )}
    </Modal>
  );
}