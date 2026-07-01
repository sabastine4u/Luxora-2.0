import { Heart, Search, MapPin, BedDouble, Bath, Square } from 'lucide-react';
import { properties } from '../../../data/luxoraData';

export default function SavedProperties() {
  const savedProps = properties.slice(0, 3); // Mocking 3 saved properties

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Saved Properties</h2>
          <p className="text-sm text-ink/60">You have {savedProps.length} properties in your wishlist.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search saved..." 
            className="w-full sm:w-64 rounded-full border border-white/10 bg-navy-800/80 py-2 pl-10 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {savedProps.map((property) => (
          <div key={property.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-navy-800/50 transition-all hover:-translate-y-1 hover:shadow-lux">
            <div className="relative h-48 w-full overflow-hidden">
              <img 
                src={property.image} 
                alt={property.title} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/20 to-transparent opacity-80" />
              <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-navy-900/80 text-rose-400 backdrop-blur-md transition-colors hover:bg-rose-400 hover:text-navy-900">
                <Heart className="h-4 w-4 fill-current" />
              </button>
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="rounded-full border border-gold-400/30 bg-gold-400/20 px-2 py-1 text-[10px] font-semibold text-gold-200 backdrop-blur-md">
                  {property.type}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-2 text-xl font-bold text-gold-400">{property.price}</div>
              <h3 className="font-heading text-lg font-semibold text-cream line-clamp-1">{property.title}</h3>
              <div className="mt-1 flex items-center gap-1 text-sm text-ink/60">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{property.location}</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-sm text-ink/70">
                <div className="flex items-center gap-1.5"><BedDouble className="h-4 w-4" />{property.beds}</div>
                <div className="flex items-center gap-1.5"><Bath className="h-4 w-4" />{property.baths}</div>
                <div className="flex items-center gap-1.5"><Square className="h-4 w-4" />{property.area}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
