import { Crown, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import type { IconProps } from '../../types';
import { footerColumns } from '../../data/uiData';
import { Container } from './index';

function TwitterIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.2 2h3.3l-7.2 8.2L22.8 22h-6.6l-5.2-6.8L5.1 22H1.8l7.7-8.8L1.3 2h6.8l4.7 6.2L18.2 2Zm-1.1 17.9h1.8L7.1 4H5.2l11.9 15.9Z" />
    </svg>
  );
}

function LinkedinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5ZM3 9.75h4v10.7H3V9.75Zm6.25 0h3.8v1.46h.05c.53-1 1.82-1.73 3.75-1.73 4.01 0 4.75 2.5 4.75 5.75v5.22h-4v-4.63c0-1.1-.02-2.52-1.62-2.52-1.62 0-1.87 1.2-1.87 2.44v4.71h-3.86V9.75Z" />
    </svg>
  );
}

function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect width="16" height="16" x="4" y="4" rx="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="2" />
      <circle cx="16.8" cy="7.2" r="1.1" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14 8.2V6.7c0-.7.5-.9 1-.9h2.1V2.2L14.2 2C11 2 9.3 3.9 9.3 6.4v1.8H6.7V12h2.6v10H14V12h2.8l.5-3.8H14Z" />
    </svg>
  );
}

const socials = [
  { icon: TwitterIcon, label: 'Twitter' },
  { icon: LinkedinIcon, label: 'LinkedIn' },
  { icon: InstagramIcon, label: 'Instagram' },
  { icon: FacebookIcon, label: 'Facebook' },
];

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="relative border-t border-white/10 bg-navy-950">
      <Container className="py-16 md:py-20">
        {/* Top */}
        <div className="grid gap-10 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-1">
            <button onClick={() => navigate(ROUTES.HOME)} className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-gradient">
                <Crown className="h-5 w-5 text-navy-900" strokeWidth={2.5} />
              </div>
              <span className="font-heading text-xl font-extrabold text-cream">
                Luxora<span className="gold-text"> 2.0</span>
              </span>
            </button>
            <p className="mt-4 text-sm leading-relaxed text-ink/50">
              Africa's most trusted property ecosystem. Verified listings, flexible payments, and complete property services.
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map((s) => (
                <button
                  key={s.label}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-ink/60 transition-all hover:border-gold-400/30 hover:text-gold-300"
                >
                  <s.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-cream">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-ink/50 transition-colors hover:text-gold-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="mt-12 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
          {[
            { icon: Mail, label: 'Email', value: 'hello@luxora.africa' },
            { icon: Phone, label: 'Phone', value: '+234 700 LUXORA' },
            { icon: MapPin, label: 'HQ', value: 'Eko Atlantic, Lagos, Nigeria' },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-400/20 bg-gold-400/5 text-gold-400">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-ink/40">{c.label}</div>
                <div className="text-sm font-medium text-cream">{c.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-ink/40">
            © 2026 Luxora 2.0. All rights reserved. Crafted with precision.
          </p>
          <div className="flex gap-6 text-xs text-ink/40">
            <a href="#" className="transition-colors hover:text-gold-300">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-gold-300">Terms of Service</a>
            <a href="#" className="transition-colors hover:text-gold-300">Cookie Policy</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
