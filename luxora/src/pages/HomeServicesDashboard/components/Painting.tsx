import { Paintbrush, Star, ShieldCheck } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

export default function Painting() {
  const providers = [
    { id: 'PNT-1', name: 'ColorCraft Painters', rating: '4.9', reviews: 156, price: 'From ₦120,000/room', tags: ['Interior', 'Exterior', 'Texture'] },
    { id: 'PNT-2', name: 'Premium Finishes', rating: '4.8', reviews: 92, price: 'Custom Quote', tags: ['Luxury', 'Wallpapering'] },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Painting & Decorating</h2>
          <p className="text-sm text-ink/60">Expert painters for interior and exterior transformation.</p>
        </div>
      </div>

      <DataTableToolbar
        searchValue=""
        onSearchChange={() => {}}
        searchPlaceholder="Search providers..."
      />

      <div className="grid gap-4">
        {providers.map((p) => (
          <div key={p.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl border border-white/10 bg-navy-800/50 hover:border-gold-400/30 transition-colors">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
               <div className="h-12 w-12 rounded-xl bg-orange-400/10 flex items-center justify-center text-orange-400 shrink-0">
                 <Paintbrush className="h-6 w-6" />
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
            <GoldButton>Book Consult</GoldButton>
          </div>
        ))}
      </div>
    </div>
  );
}
