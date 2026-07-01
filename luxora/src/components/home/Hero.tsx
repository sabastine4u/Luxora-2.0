import { useState } from 'react';
import { Search, MapPin, Home, Wallet, ChevronDown, ArrowRight, Star } from 'lucide-react';
import { GoldButton, GhostButton } from '../ui/ui';
import { propertyTypes, locations, budgets } from '../../data/uiData';
import { Section, Container } from '../layout';

export default function Hero() {
  const [type, setType] = useState('Any Type');
  const [location, setLocation] = useState('Any Location');
  const [budget, setBudget] = useState('Any Budget');

  return (
    <Section className="relative min-h-screen overflow-hidden" noPadding>
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Luxury property"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/85 via-navy-900/70 to-navy-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/80 via-transparent to-transparent" />
      </div>

      {/* Floating accent orbs */}
      <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-gold-400/10 blur-[120px]" />
      <div className="absolute -right-32 top-1/2 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

      {/* Content */}
      <Container className="section-pad relative z-10 flex flex-col items-center pt-32 pb-20 md:pt-40 md:pb-28">
        {/* Trust pill */}
        <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-200 backdrop-blur-md">
          <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
          Africa's Most Trusted Property Ecosystem
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up text-center font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-cream text-balance sm:text-5xl md:text-6xl lg:text-7xl">
          Find Properties You Can
          <br />
          <span className="gold-text">Trust And Afford</span>
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-up mt-6 max-w-2xl text-center text-base leading-relaxed text-ink/80 sm:text-lg md:text-xl" style={{ animationDelay: '120ms' }}>
          Verified properties, expert agents, flexible payment plans, and complete
          property services — all in one premium platform.
        </p>

        {/* CTA buttons */}
        <div className="animate-fade-up mt-8 flex flex-col items-center gap-3 sm:flex-row" style={{ animationDelay: '240ms' }}>
          <GoldButton size="lg">
            Browse Properties
            <ArrowRight className="h-4 w-4" />
          </GoldButton>
          <GhostButton size="lg">List Your Property</GhostButton>
        </div>

        {/* Search bar */}
        <div className="animate-fade-up mt-12 w-full max-w-4xl" style={{ animationDelay: '360ms' }}>
          <div className="glass rounded-2xl p-2 shadow-lux md:rounded-full">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <SearchField icon={<Home className="h-4 w-4" />} label="Property Type" value={type} options={propertyTypes} onChange={setType} />
              <Divider />
              <SearchField icon={<MapPin className="h-4 w-4" />} label="Location" value={location} options={locations} onChange={setLocation} />
              <Divider />
              <SearchField icon={<Wallet className="h-4 w-4" />} label="Budget" value={budget} options={budgets} onChange={setBudget} />
              <div className="p-1">
                <GoldButton size="md" className="w-full md:w-auto">
                  <Search className="h-4 w-4" />
                  Search
                </GoldButton>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="animate-fade-up mt-14 grid w-full max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4" style={{ animationDelay: '480ms' }}>
          {[
            { value: '12,400+', label: 'Verified Listings' },
            { value: '₦4.8B', label: 'Property Value' },
            { value: '1,290+', label: 'Expert Agents' },
            { value: '88K+', label: 'Happy Users' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-heading text-2xl font-bold text-cream sm:text-3xl">{s.value}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-ink/60">{s.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function Divider() {
  return <div className="hidden h-10 w-px bg-white/10 md:block" />;
}

function SearchField({
  icon,
  label,
  value,
  options,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex-1 px-3 py-2">
      <div className="flex items-center gap-2.5">
        <span className="text-gold-400">{icon}</span>
        <div className="flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink/50">{label}</div>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 text-sm font-medium text-cream"
          >
            {value}
            <ChevronDown className="h-3.5 w-3.5 text-ink/50" />
          </button>
        </div>
      </div>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-white/10 bg-navy-800 shadow-lux">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/5 ${
                  opt === value ? 'text-gold-300' : 'text-ink/80'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
