import React from 'react';
import { Container } from '../../../components/layout';
import type { ServiceData } from '../types';
import * as Icons from 'lucide-react';

export function FeatureGrid({ data }: { data: ServiceData }) {
  return (
    <section className="py-24 bg-navy-800">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-cream mb-6">
            Enterprise Capabilities
          </h2>
          <p className="text-lg text-ink/70">
            Powered by Luxora's proprietary technology and exclusive networks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.features.map((feature, idx) => {
            const IconComponent = (Icons as unknown as Record<string, React.ElementType>)[feature.icon] || Icons.CheckCircle;
            
            return (
              <div 
                key={idx} 
                className="group p-8 rounded-2xl bg-navy-900/50 border border-white/5 backdrop-blur-sm hover:border-gold-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6 text-gold-400" />
                </div>
                <h3 className="text-xl font-bold text-cream mb-3">
                  {feature.title}
                </h3>
                <p className="text-ink/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
