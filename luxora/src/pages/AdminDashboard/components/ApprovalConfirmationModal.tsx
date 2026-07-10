import { Modal } from '../../../components/ui/Modal';
import { GoldButton } from '../../../components/ui/ui';
import { CheckCircle } from 'lucide-react';

export interface ApprovalConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export function ApprovalConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = "Confirm Approval",
  message = "Are you sure you want to approve this item? This action will be recorded in the moderation history."
}: ApprovalConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      actionButton={
        <GoldButton size="sm" onClick={onConfirm} className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" /> Approve
        </GoldButton>
      }
    >
      <p className="text-ink/70">{message}</p>
    </Modal>
  );
}
