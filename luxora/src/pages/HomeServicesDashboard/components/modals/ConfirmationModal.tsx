import { Modal } from '../../../../components/ui/Modal';
import { GoldButton } from '../../../../components/ui/ui';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isDestructive?: boolean;
}

export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm",
  isDestructive = false 
}: ConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      actionButton={
        <GoldButton 
          onClick={onConfirm} 
          className={isDestructive ? "!bg-red-500/20 !text-red-400 !border-red-500/30 hover:!bg-red-500/30" : ""}
        >
          {confirmText}
        </GoldButton>
      }
    >
      <div className="flex flex-col items-center text-center space-y-4 py-4">
        {isDestructive && (
          <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
        )}
        <p className="text-cream text-lg font-medium">{message}</p>
        <p className="text-sm text-ink/60">This action cannot be undone.</p>
      </div>
    </Modal>
  );
}
