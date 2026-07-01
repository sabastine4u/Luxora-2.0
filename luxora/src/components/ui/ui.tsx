import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { ButtonProps } from '../../types';

/* Reveal-on-scroll wrapper */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* Gold CTA button */
export function GoldButton({
  children,
  onClick,
  className = '',
  size = 'md',
  disabled,
  type = 'button',
}: ButtonProps) {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group relative inline-flex items-center justify-center gap-2 rounded-full bg-gold-gradient font-heading font-semibold text-navy-900 shadow-gold transition-all duration-300 hover:shadow-lux hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </button>
  );
}

/* Ghost / outline button */
export function GhostButton({
  children,
  onClick,
  className = '',
  size = 'md',
  disabled,
  type = 'button',
}: ButtonProps) {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 font-heading font-semibold text-ink backdrop-blur-md transition-all duration-300 hover:border-gold-400/50 hover:bg-white/10 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

/* Section heading */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <div
          className={`mb-3 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-300 ${
            center ? '' : ''
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
          {eyebrow}
        </div>
      )}
      <h2 className="font-heading text-3xl font-bold leading-tight text-cream sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-ink/70 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* Verification badge pill */
export function VerifyBadge({
  label,
  icon,
}: {
  label: string;
  icon: ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/5 px-3 py-1.5 text-xs font-medium text-gold-200">
      <span className="text-gold-400">{icon}</span>
      {label}
    </div>
  );
}
