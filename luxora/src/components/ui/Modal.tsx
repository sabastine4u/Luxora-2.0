import type { ReactNode } from 'react';
import { GhostButton } from './ui';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actionButton?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

export function Modal({ isOpen, onClose, title, children, actionButton, size = 'md' }: ModalProps) {
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-sm">
      <div className={`w-full ${sizeClasses[size]} rounded-2xl border border-white/10 bg-navy-800 shadow-2xl flex flex-col max-h-[90vh]`}>
        <div className="p-6 border-b border-white/10 shrink-0">
          <h3 className="font-heading text-xl font-bold text-cream">{title}</h3>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
        <div className="p-6 border-t border-white/10 shrink-0 flex justify-end gap-3 bg-navy-900/50 rounded-b-2xl">
          <GhostButton onClick={onClose} size="sm">Close</GhostButton>
          {actionButton}
        </div>
      </div>
    </div>
  );
}
