import { Truck, Star, Search, ShieldCheck } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';

export default function Moving() {
  const providers = [
    { id: 'MOV-1', name: 'Swift Movers Ltd', rating: '4.8', reviews: 312, price: 'From ₦80,000', tags: ['Local', 'Interstate', 'Packing'] },
    { id: 'MOV-2', name: 'Careful Relocations', rating: '4.6', reviews: 145, price: 'From ₦50,000', tags: ['Local', 'Fragile Handling'] },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Moving & Relocation</h2>
          <p className="text-sm text-ink/60">Reliable logistics for a seamless transition to your new property.</p>
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
               <div className="h-12 w-12 rounded-xl bg-blue-400/10 flex items-center justify-center text-blue-400 shrink-0">
                 <Truck className="h-6 w-6" />
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
            <GoldButton>Get Quote</GoldButton>
          </div>
        ))}
      </div>
    </div>
  );
}
