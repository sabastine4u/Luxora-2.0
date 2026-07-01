import { Bed, Bath, Maximize, Heart, MapPin, BadgeCheck } from 'lucide-react';
import { type properties } from '../../data/luxoraData';

export interface PropertyCardProps {
  property: (typeof properties)[number];
  saved?: boolean;
  onSave?: () => void;
}

export function PropertyCard({ property: p, saved = false, onSave }: PropertyCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-navy-800/50 transition-all duration-300 hover:border-gold-400/30 hover:shadow-lux">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={p.image}
          alt={p.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/20 to-transparent" />

        {/* Tag */}
        {p.tag && (
          <div className="absolute left-3 top-3 rounded-full border border-gold-400/30 bg-navy-900/80 px-3 py-1 text-xs font-semibold text-gold-200 backdrop-blur-md">
            {p.tag}
          </div>
        )}

        {/* Save */}
        {onSave && (
          <button
            onClick={onSave}
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all ${
              saved
                ? 'bg-gold-400 text-navy-900'
                : 'bg-navy-900/60 text-cream hover:bg-navy-900/80'
            }`}
          >
            <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Verified badges */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {p.verified.map((v) => (
            <span key={v} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-navy-900/70 px-2 py-0.5 text-[10px] font-medium text-ink/80 backdrop-blur-md">
              <BadgeCheck className="h-3 w-3 text-gold-400" /> {v}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="mb-1 flex items-center gap-1.5 text-xs text-ink/50">
          <MapPin className="h-3 w-3" /> {p.location}
        </div>
        <h3 className="font-heading text-lg font-semibold text-cream transition-colors group-hover:text-gold-200">
          {p.title}
        </h3>

        {/* Specs */}
        <div className="mt-3 flex items-center gap-4 text-xs text-ink/60">
          <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> {p.beds} Beds</span>
          <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {p.baths} Baths</span>
          <span className="flex items-center gap-1"><Maximize className="h-3.5 w-3.5" /> {p.area}</span>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-end justify-between border-t border-white/5 pt-4">
          <div>
            <div className="font-heading text-xl font-bold text-cream">{p.price}</div>
            <div className="text-xs text-gold-300">From {p.monthly}/month</div>
          </div>
          <button className="rounded-full border border-gold-400/30 px-4 py-2 text-xs font-semibold text-gold-200 transition-all hover:bg-gold-400/10">
            View Details
          </button>
        </div>

        {/* Agent */}
        <div className="mt-4 flex items-center gap-2.5 border-t border-white/5 pt-4">
          <img src={p.agent.avatar} alt={p.agent.name} className="h-8 w-8 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium text-cream">{p.agent.name}</div>
            <div className="truncate text-[10px] text-ink/50">{p.agent.agency}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
