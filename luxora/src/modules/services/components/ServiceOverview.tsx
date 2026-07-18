import { Container } from '../../../components/layout';
import type { ServiceData } from '../types';

export function ServiceOverview({ data }: { data: ServiceData }) {
  return (
    <section className="py-24 bg-navy-900 border-b border-white/5">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-cream mb-6">
              {data.overview.title}
            </h2>
            <p className="text-lg text-ink/80 leading-relaxed mb-8">
              {data.overview.description}
            </p>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400">
                Who this is for
              </h3>
              <ul className="space-y-2">
                {data.overview.audience.map((item, idx) => (
                  <li key={idx} className="flex items-center text-ink/90">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-400 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 relative">
               <img 
                 src="https://images.unsplash.com/photo-1556156653-e5a7c69cc263?auto=format&fit=crop&q=80" 
                 alt="Overview" 
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-navy-900/20 mix-blend-multiply" />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl" />
          </div>
        </div>
      </Container>
    </section>
  );
}
