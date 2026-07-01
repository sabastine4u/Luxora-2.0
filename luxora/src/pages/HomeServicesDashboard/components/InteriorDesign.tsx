import { Palette, Star, Search, ShieldCheck } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';

export default function InteriorDesign() {
  const providers = [
    { id: 'INT-1', name: 'Luxe Interiors', rating: '5.0', reviews: 234, price: 'Custom Quote', tags: ['Luxury', '3D Rendering', 'Styling'] },
    { id: 'INT-2', name: 'Minimalist Spaces', rating: '4.8', reviews: 105, price: 'From ₦250,000/room', tags: ['Contemporary', 'Minimalist'] },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Interior Design</h2>
          <p className="text-sm text-ink/60">Elevate your living spaces with award-winning interior designers.</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search providers..." 
            className="w-full rounded-xl border border-white/10 bg-navy-900/80 py-2 pl-9 pr-4 text-sm text-cream placeholder:text-ink/40 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {providers.map((p) => (
          <div key={p.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl border border-white/10 bg-navy-800/50 hover:border-gold-400/30 transition-colors">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
               <div className="h-12 w-12 rounded-xl bg-pink-400/10 flex items-center justify-center text-pink-400 shrink-0">
                 <Palette className="h-6 w-6" />
               </div>
               <div>
                 <div className="flex items-center gap-2">
                   <h3 className="font-heading text-lg font-bold text-cream">{p.name}</h3>
                   <ShieldCheck className="h-4 w-4 text-emerald-400" />
                 </div>
                 <div className="flex items-center gap-4 mt-1">
                   <div className="flex items-center text-sm text-gold-400">
                     <Star className="h-4 w-4 fill-current mr-1" /> {p.rating} <span className="text-ink/60 ml-1">({p.reviews})</span>
                   </div>
                   <div className="text-sm font-medium text-emerald-400">{p.price}</div>
                 </div>
                 <div className="flex gap-2 mt-2">
                   {p.tags.map(tag => (
                     <span key={tag} className="text-[10px] uppercase font-bold text-ink/60 bg-white/5 px-2 py-1 rounded-md border border-white/10">{tag}</span>
                   ))}
                 </div>
               </div>
            </div>
            <GoldButton>View Portfolio</GoldButton>
          </div>
        ))}
      </div>
    </div>
  );
}
