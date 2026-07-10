import { PenTool, Star, ShieldCheck } from 'lucide-react';
import { GoldButton } from '../../../components/ui/ui';
import { DataTableToolbar } from '../../../components/dashboard/shared/filters/DataTableToolbar';

export default function Architecture() {
  const providers = [
    { id: 'ARC-1', name: 'Vanguard Architects', rating: '4.9', reviews: 88, price: 'Custom Quote', tags: ['Residential', 'Commercial', 'Drafting'] },
    { id: 'ARC-2', name: 'Design Studio X', rating: '4.8', reviews: 62, price: 'Custom Quote', tags: ['Modern', 'Sustainable'] },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-cream">Architectural Services</h2>
          <p className="text-sm text-ink/60">Connect with visionary architects for your next building project.</p>
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
               <div className="h-12 w-12 rounded-xl bg-purple-400/10 flex items-center justify-center text-purple-400 shrink-0">
                 <PenTool className="h-6 w-6" />
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
