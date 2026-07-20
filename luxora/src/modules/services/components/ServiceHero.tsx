import { useNavigate } from 'react-router-dom';
import { Container } from '../../../components/layout';
import { GoldButton } from '../../../components/ui/ui';
import { ArrowRight, MessageSquare } from 'lucide-react';
import type { ServiceData } from '../types';
import { useServiceCTA } from '../hooks/useServiceCTA';

export function ServiceHero({ data }: { data: ServiceData }) {
  const navigate = useNavigate();
  const cta = useServiceCTA();


  return (
    <section className="relative min-h-[80vh] flex items-center pt-24 pb-12 overflow-hidden bg-navy-900">
      <div className="absolute inset-0 bg-navy-900">
        <img 
          src={data.heroImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80'} 
          alt={data.name} 
          loading="eager"
          fetchPriority="high"
          className="w-full h-full object-cover opacity-40" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/60 to-transparent" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-cream mb-6 leading-tight">
            {data.name}
          </h1>
          <p className="text-xl md:text-2xl text-ink/90 mb-10 max-w-2xl font-light">
            {data.tagline}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {cta.showSignIn && (
              <GoldButton size="lg" className="group" onClick={() => navigate(cta.signInAction)}>
                {cta.signInText}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </GoldButton>
            )}
            
            <button 
              onClick={() => navigate(cta.contactAction)}
              className="px-8 py-3 flex items-center justify-center gap-2 rounded-full border border-white/20 text-cream font-medium hover:bg-white/5 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              {cta.contactText}
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
