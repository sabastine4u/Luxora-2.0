import { Modal } from '../../../../components/ui/Modal';
import { GoldButton } from '../../../../components/ui/ui';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  danger?: boolean;
}

export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText = 'Confirm', 
  danger = false 
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      actionButton={
        <GoldButton 
          onClick={handleConfirm}
          className={danger ? 'bg-rose-500 hover:bg-rose-600 text-white' : ''}
        >
          {confirmText}
        </GoldButton>
      }
    >
      <div className="space-y-4">
        {danger && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">This is a destructive action and cannot be undone.</p>
          </div>
        )}
        <p className="text-cream leading-relaxed">{description}</p>
      </div>
    </Modal>
  );
}
