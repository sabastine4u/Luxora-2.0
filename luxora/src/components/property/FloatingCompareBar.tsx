import { X, Scale, Trash2 } from 'lucide-react';
import { useSession } from '../../contexts/SessionContext';
import { properties } from '../../data/luxoraData';
import { GoldButton } from '../ui/ui';
import { useNavigate } from 'react-router-dom';

export function FloatingCompareBar() {
  const { compareList, toggleCompareProperty, clearCompare } = useSession();
  const navigate = useNavigate();

  if (compareList.length < 2) return null;

  const compareProperties = compareList.map(id => properties.find(p => p.id === id)).filter(Boolean);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center lg:bottom-6 pointer-events-none lg:pl-72">
      <div className="pointer-events-auto w-full lg:w-auto bg-navy-800/95 lg:rounded-2xl border-t lg:border border-white/10 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-md p-4 flex flex-col md:flex-row items-center gap-4 lg:gap-8 transition-transform animate-in slide-in-from-bottom-10">
        
        {/* Properties Preview */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
          <div className="flex items-center gap-2 mr-4 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400/20 text-gold-400">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-cream">Compare</p>
              <p className="text-[10px] text-ink/60">{compareList.length} of 4 selected</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {compareProperties.map((p, idx) => (
              <div key={p?.id || idx} className="relative group shrink-0">
                <img src={p?.image} className="h-12 w-16 md:h-14 md:w-20 rounded-lg object-cover border border-white/10" alt={p?.title} />
                <button 
                  onClick={() => toggleCompareProperty(p!.id)}
                  className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-navy-900 border border-white/10 flex items-center justify-center text-ink hover:text-rose-400 hover:border-rose-400/50 transition-colors lg:opacity-0 lg:group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {/* Empty Slots */}
            {Array.from({ length: 4 - compareList.length }).map((_, i) => (
              <div key={`empty-${i}`} className="h-12 w-16 md:h-14 md:w-20 rounded-lg border border-dashed border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                <span className="text-ink/30 text-[10px] sm:text-xs">Empty</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end shrink-0">
          <button 
            onClick={clearCompare}
            className="text-xs text-ink/60 hover:text-rose-400 transition-colors flex items-center gap-1 p-2"
          >
            <Trash2 className="h-3.5 w-3.5" /> <span>Clear All</span>
          </button>
          <GoldButton onClick={() => navigate('/compare')} size="sm">Compare Now</GoldButton>
        </div>
      </div>
    </div>
  );
}
