import { Container } from '../../../components/layout';
import type { ServiceData } from '../types';
import { CheckCircle2 } from 'lucide-react';

export function DashboardShowcase({ data }: { data: ServiceData }) {
  if (!data.dashboardPreview) return null;

  return (
    <section className="py-24 bg-navy-900 border-b border-white/5 overflow-hidden">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-cream mb-6">
            Enterprise Operations
          </h2>
          <p className="text-lg text-ink/70">
            A glimpse into the powerful, authenticated workspace available to clients.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Dashboard static mockup wrapper */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-gold-500/10">
            {/* Window controls decoration */}
            <div className="h-8 bg-navy-800 border-b border-white/10 flex items-center px-4 space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            {/* The actual static image */}
            <img 
              src={data.dashboardPreview.imageUrl} 
              alt={data.dashboardPreview.imageAlt}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Floating animated elements */}
          <div className="absolute -right-8 top-1/4 p-4 rounded-xl bg-navy-800/90 backdrop-blur-xl border border-white/10 shadow-xl animate-float hidden lg:block">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-cream">System Synced</p>
                <p className="text-xs text-ink/70">Live data connection active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Caption and highlights */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {data.dashboardPreview.features.map((feat, idx) => (
            <div key={idx} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-ink/80">
              {feat}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
