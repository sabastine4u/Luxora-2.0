import { useState } from 'react';
import { GoldButton, GhostButton } from '../../../../components/ui/ui';
import { Modal } from '../../../../components/ui/Modal';
import type { Offer } from '../../../../types';

interface OfferActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, notes: string) => void;
  offer: Offer | null;
  actionType: 'counter' | 'revise';
}

export function OfferActionModal({
  isOpen,
  onClose,
  onSubmit,
  offer,
  actionType
}: OfferActionModalProps) {
  const [amount, setAmount] = useState(offer?.offerAmount?.toString() || '');
  const [notes, setNotes] = useState('');

  if (!offer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(Number(amount), notes);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={actionType === 'counter' ? 'Respond to Counter Offer' : 'Revise Offer'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-navy-900/50 border border-white/5 space-y-2">
            <div className="text-xs text-ink/60 uppercase tracking-wider font-semibold">Property</div>
            <div className="text-cream font-medium">{offer.propertyTitle}</div>
            {actionType === 'counter' && offer.counterOfferDetails && (
              <div className="mt-3 pt-3 border-t border-white/5">
                <div className="text-xs text-gold-400/80 uppercase tracking-wider font-semibold">Agent's Counter Details</div>
                <div className="text-sm text-cream/80 mt-1">{offer.counterOfferDetails}</div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-cream">Your New Offer Amount (₦)</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-cream focus:border-gold-400/50 focus:outline-none transition-colors"
              placeholder="Enter amount..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-cream">Notes to Agent (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-navy-900/80 p-3 text-cream focus:border-gold-400/50 focus:outline-none transition-colors min-h-[100px] resize-none"
              placeholder="E.g., We can close in 14 days..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
          <GhostButton type="button" onClick={onClose}>Cancel</GhostButton>
          <GoldButton type="submit">Submit Offer</GoldButton>
        </div>
      </form>
    </Modal>
  );
}
