import type { MessageStatus } from '../types/communicationTypes';
import { Check, CheckCheck } from 'lucide-react';
import { clsx } from 'clsx';

interface ReadReceiptProps {
  status: MessageStatus;
  className?: string;
}

export const ReadReceipt = ({ status, className }: ReadReceiptProps) => {
  if (status === 'sent') {
    return <Check className={clsx('w-4 h-4 text-gray-400', className)} />;
  }
  if (status === 'delivered') {
    return <CheckCheck className={clsx('w-4 h-4 text-gray-400', className)} />;
  }
  if (status === 'read') {
    return <CheckCheck className={clsx('w-4 h-4 text-blue-500', className)} />;
  }
  return null;
};
