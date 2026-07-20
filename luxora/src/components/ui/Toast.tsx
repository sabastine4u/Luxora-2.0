import { useEffect, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { ToastMessage } from '../../contexts/ToastContext';

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div 
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4 sm:px-0"
      aria-live="polite"
    >
      {toasts.map(toast => (
        <ToastCard key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
}

interface ToastCardProps {
  toast: ToastMessage;
  removeToast: (id: string) => void;
}

function ToastCard({ toast, removeToast }: ToastCardProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 300); // Match CSS transition duration
  }, [removeToast, toast.id]);

  useEffect(() => {
    const duration = toast.duration ?? 3000;
    const timer = setTimeout(() => {
      handleClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.duration, handleClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-orange-400 shrink-0" />;
      case 'info': return <Info className="h-5 w-5 text-blue-400 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success': return 'border-emerald-400/30';
      case 'error': return 'border-rose-400/30';
      case 'warning': return 'border-orange-400/30';
      case 'info': return 'border-blue-400/30';
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success': return 'bg-emerald-500/10';
      case 'error': return 'bg-rose-500/10';
      case 'warning': return 'bg-orange-500/10';
      case 'info': return 'bg-blue-500/10';
    }
  };

  return (
    <div 
      className={`pointer-events-auto flex items-start gap-4 p-4 rounded-xl shadow-2xl backdrop-blur-xl border border-white/10 ${getBgColor()} bg-navy-900/95 transition-all duration-300 ${isExiting ? 'opacity-0 translate-x-8' : 'animate-in fade-in slide-in-from-right-8'}`}
      role="status"
    >
      <div className={`p-2 rounded-xl border bg-navy-950/80 shadow-inner flex items-center justify-center shrink-0 ${getBorderColor()}`}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <h4 className="text-sm font-bold text-cream">{toast.title}</h4>
        {toast.description && (
          <p className="text-xs text-ink/70 mt-1 leading-relaxed">{toast.description}</p>
        )}
      </div>
      <button 
        onClick={handleClose}
        className="shrink-0 p-1.5 -mr-1.5 -mt-1.5 rounded-lg text-ink/50 hover:text-cream hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
