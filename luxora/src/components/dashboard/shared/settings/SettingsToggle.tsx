import type { ReactNode } from 'react';

export interface SettingsToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  loading?: boolean;
  onChange: (checked: boolean) => void;
  helperText?: string;
  icon?: ReactNode;
  checkedColor?: string;
  size?: 'sm' | 'md';
  labelClassName?: string;
  descriptionClassName?: string;
}

export function SettingsToggle({
  label,
  description,
  checked,
  disabled = false,
  loading = false,
  onChange,
  helperText,
  icon,
  checkedColor = 'bg-gold-400',
  size = 'md',
  labelClassName = 'text-cream',
  descriptionClassName
}: SettingsToggleProps) {
  const handleToggle = () => {
    if (disabled || loading) return;
    onChange(!checked);
  };

  const buttonSizeClass = size === 'sm' ? 'h-5 w-9' : 'h-6 w-11';
  const dotSizeClass = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  const translateClass = checked
    ? (size === 'sm' ? 'translate-x-5' : 'translate-x-6')
    : 'translate-x-1';

  return (
    <div className="flex items-start justify-between w-full gap-4">
      <div className="flex gap-3">
        {icon && <div className="mt-1 shrink-0 text-gold-400">{icon}</div>}
        <div className="space-y-1">
          <p className={`text-sm font-semibold ${labelClassName}`}>{label}</p>
          {description && (
            <p className={descriptionClassName || (size === 'sm' ? 'text-[10px] text-ink/50' : 'text-xs text-ink/50')}>
              {description}
            </p>
          )}
          {helperText && <p className="text-[10px] text-ink/40">{helperText}</p>}
        </div>
      </div>
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled || loading}
        className={`relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-gold-400/50 ${buttonSizeClass} ${
          checked ? checkedColor : 'bg-white/10'
        } ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        role="switch"
        aria-checked={checked}
        aria-label={label}
      >
        <span
          className={`inline-block transform rounded-full bg-white transition-transform ${dotSizeClass} ${translateClass}`}
        />
      </button>
    </div>
  );
}
