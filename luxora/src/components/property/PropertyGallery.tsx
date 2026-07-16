import { useState, useEffect, memo, useRef } from 'react';
import { Maximize, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import type { Property } from '../../types';

type PropertyGalleryProps = {
  property: Property;
};

export const PropertyGallery = memo(function PropertyGallery({ property }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const gallery = property.gallery && property.gallery.length > 0 ? property.gallery : [property.image];
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (lightboxOpen && thumbnailContainerRef.current) {
      const activeThumb = thumbnailContainerRef.current.children[lightboxIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [lightboxIndex, lightboxOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      setLightboxIndex(prev => (prev === gallery.length - 1 ? 0 : prev + 1));
    }
    if (isRightSwipe) {
      setLightboxIndex(prev => (prev === 0 ? gallery.length - 1 : prev - 1));
    }
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2 h-[300px] sm:h-[400px] md:h-[500px]">
        {/* Main Hero Image */}
        <div 
          role="button"
          tabIndex={0}
          aria-label={`View main image of ${property.title}`}
          className="md:col-span-3 md:row-span-2 overflow-hidden rounded-2xl h-full cursor-pointer group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 bg-navy-800/30" 
          onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
          onKeyDown={(e) => { if(e.key === 'Enter') { setLightboxIndex(0); setLightboxOpen(true); } }}
        >
          {!loadedImages[0] && (
            <div className="absolute inset-0 flex items-center justify-center animate-pulse bg-navy-800/50">
              <ImageIcon className="h-10 w-10 text-white/10" />
            </div>
          )}
          <img 
            src={gallery[0]} 
            alt={`Main view of ${property.title}`} 
            loading="eager"
            onLoad={() => handleImageLoad(0)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${loadedImages[0] ? 'opacity-100' : 'opacity-0'}`} 
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          <div className="absolute bottom-4 right-4 rounded-full bg-navy-900/80 px-3 py-1.5 text-xs font-semibold text-cream backdrop-blur-md flex items-center gap-1.5">
            <Maximize className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" />
            1 / {gallery.length}
          </div>
        </div>
        
        {/* Secondary Images */}
        {gallery.length > 1 ? (
          <div 
            role="button"
            tabIndex={0}
            aria-label={`View image 2 of ${property.title}`}
            className="hidden md:block overflow-hidden rounded-2xl h-full cursor-pointer group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 bg-navy-800/30" 
            onClick={() => { setLightboxIndex(1); setLightboxOpen(true); }}
            onKeyDown={(e) => { if(e.key === 'Enter') { setLightboxIndex(1); setLightboxOpen(true); } }}
          >
            {!loadedImages[1] && (
              <div className="absolute inset-0 flex items-center justify-center animate-pulse bg-navy-800/50">
                <ImageIcon className="h-6 w-6 text-white/10" />
              </div>
            )}
            <img 
              src={gallery[1]} 
              alt={`${property.title} - View 2`} 
              loading="lazy" 
              onLoad={() => handleImageLoad(1)}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${loadedImages[1] ? 'opacity-100' : 'opacity-0'}`} 
            />
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
            className="hidden md:block overflow-hidden rounded-2xl h-full cursor-pointer group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 bg-navy-800/30" 
            onClick={() => { setLightboxIndex(2); setLightboxOpen(true); }}
            onKeyDown={(e) => { if(e.key === 'Enter') { setLightboxIndex(2); setLightboxOpen(true); } }}
          >
            {!loadedImages[2] && (
              <div className="absolute inset-0 flex items-center justify-center animate-pulse bg-navy-800/50">
                <ImageIcon className="h-6 w-6 text-white/10" />
              </div>
            )}
            <img 
              src={gallery[2]} 
              alt={`${property.title} - View 3`} 
              loading="lazy" 
              onLoad={() => handleImageLoad(2)}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${loadedImages[2] ? 'opacity-100' : 'opacity-0'}`} 
            />
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
          className="fixed inset-0 z-50 bg-navy-950/95 backdrop-blur-xl flex flex-col items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
        >
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/50 to-transparent flex items-center justify-between px-6 z-10 pointer-events-none">
            <div className="text-cream font-medium pointer-events-auto">
              {lightboxIndex + 1} / {gallery.length}
            </div>
            <button 
              aria-label="Close gallery"
              className="text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-full p-2 hover:bg-white/10 pointer-events-auto"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div 
            className="relative w-full flex-1 flex items-center justify-center overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <button
              onClick={() => setLightboxIndex(prev => (prev === 0 ? gallery.length - 1 : prev - 1))}
              className="absolute left-4 z-10 p-3 rounded-full bg-black/20 text-white/70 hover:text-white hover:bg-black/40 backdrop-blur-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 hidden sm:block"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <div className="w-full h-full max-w-7xl mx-auto p-4 md:p-12 flex items-center justify-center relative">
              <img 
                key={lightboxIndex}
                src={gallery[lightboxIndex]} 
                alt={`${property.title} - Full size view ${lightboxIndex + 1}`} 
                className="max-h-full max-w-full object-contain rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-300"
              />
            </div>

            <button
              onClick={() => setLightboxIndex(prev => (prev === gallery.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 z-10 p-3 rounded-full bg-black/20 text-white/70 hover:text-white hover:bg-black/40 backdrop-blur-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 hidden sm:block"
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>

          {/* Thumbnail Strip */}
          <div className="w-full bg-black/40 backdrop-blur-md pb-6 pt-4 px-4 hidden md:block">
            <div 
              ref={thumbnailContainerRef}
              className="max-w-5xl mx-auto flex gap-2 overflow-x-auto snap-x scrollbar-hide py-2 px-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`relative shrink-0 w-24 h-16 rounded-md overflow-hidden snap-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
                    i === lightboxIndex ? 'ring-2 ring-gold-400 scale-105' : 'opacity-50 hover:opacity-100'
                  }`}
                  aria-label={`View thumbnail ${i + 1}`}
                  aria-current={i === lightboxIndex}
                >
                  <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
});
