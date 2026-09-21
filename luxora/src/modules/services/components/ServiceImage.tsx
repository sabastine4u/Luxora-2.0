import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ServiceImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
}

export function ServiceImage({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  loading = 'lazy',
  fetchPriority = 'auto',
}: ServiceImageProps) {
  const [isLoaded, setIsLoaded] =
    useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-navy-900 ${wrapperClassName}`}
    >
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-navy-900">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-gold-400" />

            <span className="text-[11px] font-medium uppercase tracking-wider text-ink/40">
              Loading
            </span>
          </div>
        </div>
      )}

      <img
        src={src}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        onLoad={() =>
          setIsLoaded(true)
        }
        onError={() =>
          setIsLoaded(true)
        }
        className={`block transition-opacity duration-500 ${
          isLoaded
            ? 'opacity-100'
            : 'opacity-0'
        } ${className}`}
      />
    </div>
  );
}