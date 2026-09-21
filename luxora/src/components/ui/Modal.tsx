import React, { useEffect, useRef, type ReactNode } from 'react';
import { GhostButton } from './ui';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actionButton?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  actionButton,
  size = 'md',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }

      if (e.key === 'Tab' && modalRef.current) {
        // Simple focus trap: prevent tabbing completely out of modal.
        // For a true focus trap we'd need to cycle focus between first
        // and last focusable element.
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement =
          focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Auto focus the modal itself only when the modal opens.
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Prevent body scroll when modal is open.
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
     className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-900/80 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`w-full ${sizeClasses[size]} flex max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-white/10 bg-navy-800 shadow-2xl outline-none`}
      >
        <div className="shrink-0 border-b border-white/10 p-6">
          <h3
            id="modal-title"
            className="font-heading text-xl font-bold text-cream"
          >
            {title}
          </h3>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {children}
        </div>

        <div className="flex shrink-0 justify-end gap-3 rounded-b-2xl border-t border-white/10 bg-navy-900/50 p-6">
          <GhostButton onClick={onClose} size="sm">
            Close
          </GhostButton>

          {actionButton}
        </div>
      </div>
    </div>
  );
}