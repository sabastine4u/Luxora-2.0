import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { GoldButton } from '../../../components/ui/ui';
import { XCircle } from 'lucide-react';

export interface RejectionReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title?: string;
}

export function RejectionReasonModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = "Confirm Rejection"
}: RejectionReasonModalProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason);
    setReason('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setReason('');
        onClose();
      }}
      title={title}
      size="md"
      actionButton={
        <GoldButton 
          size="sm" 
          onClick={handleConfirm} 
          disabled={!reason.trim()}
          className="flex items-center gap-2 bg-rose-500 hover:bg-rose-400 text-white"
        >
          <XCircle className="h-4 w-4" /> Reject
        </GoldButton>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-ink/70">
          Please provide a reason for rejection. This will be visible in the moderation history and may be shared with the user.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter rejection reason..."
          className="w-full h-32 rounded-xl border border-white/10 bg-navy-900/50 p-4 text-sm text-cream placeholder:text-ink/40 focus:border-rose-400/50 focus:outline-none resize-none"
        />
      </div>
    </Modal>
  );
}
