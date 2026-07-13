import { useState, useEffect, memo } from 'react';
import { Maximize, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Property } from '../../data/luxoraData';

type PropertyGalleryProps = {
  property: Property;
};

export const PropertyGallery = memo(function PropertyGallery({ property }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const gallery = property.gallery && property.gallery.length > 0 ? property.gallery : [property.image];

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') setLightboxIndex(prev => (prev === 0 ? gallery.length - 1 : prev - 1));
      if (e.key === 'ArrowRight') setLightboxIndex(prev => (prev === gallery.length - 1 ? 0 : prev + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, gallery.length]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2 h-[400px] md:h-[500px]">
        <div 
          role="button"
          tabIndex={0}
          aria-label={`View main image of ${property.title}`}
          className="md:col-span-3 md:row-span-2 overflow-hidden rounded-2xl h-full cursor-pointer group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400" 
          onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
          onKeyDown={(e) => { if(e.key === 'Enter') { setLightboxIndex(0); setLightboxOpen(true); } }}
        >
          <img src={gallery[0]} alt={`Main view of ${property.title}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          <div className="absolute bottom-4 right-4 rounded-full bg-navy-900/80 px-3 py-1.5 text-xs font-semibold text-cream backdrop-blur-md flex items-center gap-1.5">
            <Maximize className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" />
            1 / {gallery.length}
          </div>
        </div>
        
        {gallery.length > 1 ? (
          <div 
            role="button"
            tabIndex={0}
            aria-label={`View image 2 of ${property.title}`}
            className="hidden md:block overflow-hidden rounded-2xl h-full cursor-pointer group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400" 
            onClick={() => { setLightboxIndex(1); setLightboxOpen(true); }}
            onKeyDown={(e) => { if(e.key === 'Enter') { setLightboxIndex(1); setLightboxOpen(true); } }}
          >
            <img src={gallery[1]} alt={`${property.title} - View 2`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
        ) : (
          <div className="hidden md:block overflow-hidden rounded-2xl h-full bg-navy-800/30 border border-white/5" />
        )}
        
        {gallery.length > 2 ? (
          <div 
            role="button"
            tabIndex={0}
            aria-label="View all photos"
            className="hidden md:block overflow-hidden rounded-2xl h-full cursor-pointer group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400" 
            onClick={() => { setLightboxIndex(2); setLightboxOpen(true); }}
            onKeyDown={(e) => { if(e.key === 'Enter') { setLightboxIndex(2); setLightboxOpen(true); } }}
          >
            <img src={gallery[2]} alt={`${property.title} - View 3`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-navy-900/60 flex items-center justify-center group-hover:bg-navy-900/70 transition-colors">
              <span className="text-cream font-semibold flex items-center gap-2">
                <Maximize className="h-5 w-5" aria-hidden="true" /> View All Photos
              </span>
            </div>
          </div>
        ) : (
          <div className="hidden md:block overflow-hidden rounded-2xl h-full bg-navy-800/30 border border-white/5" />
        )}
      </div>

      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
        >
          <button 
            aria-label="Close gallery"
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-full p-1"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="h-8 w-8" />
          </button>
          
          <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white/70 font-medium" aria-live="polite">
            {lightboxIndex + 1} / {gallery.length}
          </div>

          {/* Keyboard hints */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-xs flex gap-4 hidden md:flex" aria-hidden="true">
            <span><kbd className="px-1.5 py-0.5 border border-white/20 rounded bg-white/10 mr-1">Esc</kbd> to close</span>
            <span><kbd className="px-1.5 py-0.5 border border-white/20 rounded bg-white/10 mr-1">←</kbd> <kbd className="px-1.5 py-0.5 border border-white/20 rounded bg-white/10 mr-1">→</kbd> to navigate</span>
          </div>

          <button 
            aria-label="Previous image"
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev === 0 ? gallery.length - 1 : prev - 1)); }}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <button 
            aria-label="Next image"
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev === gallery.length - 1 ? 0 : prev + 1)); }}
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <img 
            src={gallery[lightboxIndex]} 
            alt={`${property.title} - Gallery Image ${lightboxIndex + 1}`} 
            className="w-full h-full object-contain max-w-[90vw] max-h-[90vh]" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </>
  );
});
