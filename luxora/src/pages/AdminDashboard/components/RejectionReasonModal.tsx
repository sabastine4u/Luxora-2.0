import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { GoldButton } from '../../../components/ui/ui';
import { XCircle, AlertTriangle, Clock } from 'lucide-react';

export type ReviewActionType = 'reject' | 'return' | 'hold';

export interface RejectionReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, actionType: ReviewActionType) => void;
  actionType?: ReviewActionType;
  title?: string;
}

export function RejectionReasonModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  actionType = 'reject',
  title
}: RejectionReasonModalProps) {
  const [reason, setReason] = useState('');

  const handleClose = () => {
    setReason('');
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(reason, actionType);
    setReason('');
  };

  const config = {
    reject: {
      title: 'Reject Property',
      desc: 'Please provide a reason for rejecting this property. This is a final action for policy violations, fraud, or duplicates.',
      buttonText: 'Reject',
      buttonIcon: XCircle,
      buttonColor: 'bg-rose-500 hover:bg-rose-400 text-white',
      focusColor: 'focus:border-rose-400/50'
    },
    return: {
      title: 'Return for Correction',
      desc: 'Specify what the owner needs to correct (e.g., missing documents, better photos, pricing clarification).',
      buttonText: 'Return',
      buttonIcon: AlertTriangle,
      buttonColor: 'bg-yellow-500 hover:bg-yellow-400 text-navy-900',
      focusColor: 'focus:border-yellow-400/50'
    },
    hold: {
      title: 'Hold Property',
      desc: 'Provide a reason for putting this property on hold (e.g., awaiting external verification, legal review).',
      buttonText: 'Hold',
      buttonIcon: Clock,
      buttonColor: 'bg-ink/30 hover:bg-ink/50 text-cream',
      focusColor: 'focus:border-ink/50'
    }
  };

  const currentConfig = config[actionType];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title || currentConfig.title}
      size="md"
      actionButton={
        <GoldButton 
          size="sm" 
          onClick={handleConfirm} 
          disabled={!reason.trim()}
          className={`flex items-center gap-2 ${currentConfig.buttonColor}`}
        >
          <currentConfig.buttonIcon className="h-4 w-4" /> {currentConfig.buttonText}
        </GoldButton>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-ink/70">
          {currentConfig.desc}
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={`Enter ${actionType} reason...`}
          className={`w-full h-32 rounded-xl border border-white/10 bg-navy-900/50 p-4 text-sm text-cream placeholder:text-ink/40 focus:outline-none resize-none ${currentConfig.focusColor}`}
        />
      </div>
    </Modal>
  );
}
