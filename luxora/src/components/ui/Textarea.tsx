import { forwardRef, type TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-ink/70 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-ink placeholder-white/30 backdrop-blur-md outline-none transition-all duration-300 focus:border-gold-500/50 focus:bg-white/10 resize-y min-h-[120px] ${
            error ? 'border-red-500/50 focus:border-red-500/50' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
