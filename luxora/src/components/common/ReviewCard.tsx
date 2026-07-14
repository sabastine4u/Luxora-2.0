import { Star } from 'lucide-react';
import type { Review } from '../../data/luxoraData';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8 backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img 
            src={review.avatar} 
            alt={review.author} 
            className="h-12 w-12 rounded-full object-cover border-2 border-gold-400/30"
          />
          <div>
            <h4 className="font-heading text-base font-bold text-cream">{review.author}</h4>
            <p className="text-xs text-ink/50">{review.role}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < review.rating ? 'fill-gold-400 text-gold-400' : 'fill-white/10 text-transparent'}`} 
              />
            ))}
          </div>
          <span className="text-xs text-ink/40">{review.date}</span>
        </div>
      </div>
      <p className="text-sm text-ink/70 leading-relaxed italic">
        "{review.text}"
      </p>
    </div>
  );
}
