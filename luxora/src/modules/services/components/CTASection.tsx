import { useNavigate } from 'react-router-dom';
import { Container } from '../../../components/layout';
import { GoldButton } from '../../../components/ui/ui';
import type { ServiceData } from '../types';
import { useServiceCTA } from '../hooks/useServiceCTA';
import { ArrowRight, MessageSquare } from 'lucide-react';

export function CTASection({ data }: { data: ServiceData }) {
  const navigate = useNavigate();
  const cta = useServiceCTA();


  return (
    <section className="py-24 bg-navy-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gold-gradient opacity-5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />

      <Container className="relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-cream mb-6">
          Ready to Elevate Your Experience?
        </h2>
        <p className="text-xl text-ink/80 mb-10 max-w-2xl mx-auto">
          Join Luxora's elite network and unlock the full potential of our {data.name} platform.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {cta.showSignIn && (
            <GoldButton 
              size="lg" 
              className="w-full sm:w-auto px-8 group"
              onClick={() => navigate(cta.signInAction)}
            >
              {cta.signInText}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </GoldButton>
          )}
          
          <button 
            onClick={() => navigate(cta.contactAction)}
            className="w-full sm:w-auto px-8 py-3 flex items-center justify-center gap-2 rounded-full border border-white/20 text-cream font-medium hover:bg-white/5 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            {cta.contactText}
          </button>
        </div>
      </Container>
    </section>
  );
}
