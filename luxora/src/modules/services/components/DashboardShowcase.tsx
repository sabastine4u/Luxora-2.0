import { ServiceImage } from './ServiceImage';
import { Container } from '../../../components/layout';
import type { ServiceData } from '../types';
import { CheckCircle2 } from 'lucide-react';

export function DashboardShowcase({
  data,
}: {
  data: ServiceData;
}) {
  if (!data.dashboardPreview) {
    return null;
  }

  return (
    <section className="overflow-hidden border-b border-white/5 bg-navy-900 py-24">
      <Container>
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-6 font-heading text-3xl font-bold text-cream md:text-4xl">
            Enterprise Operations
          </h2>

          <p className="text-lg text-ink/70">
            A glimpse into the powerful, authenticated workspace available to clients.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          {/* Dashboard static mockup wrapper */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-navy-800 shadow-2xl shadow-gold-500/10">
            {/* Window controls decoration */}
            <div className="flex h-8 items-center space-x-2 border-b border-white/10 bg-navy-800 px-4">
              <div className="h-3 w-3 rounded-full bg-red-500/50" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
              <div className="h-3 w-3 rounded-full bg-green-500/50" />
            </div>

            {/* Dashboard image */}
            <ServiceImage
              src={
                data.dashboardPreview
                  .imageUrl
              }
              alt={
                data.dashboardPreview
                  .imageAlt
              }
              loading="eager"
              fetchPriority="high"
              wrapperClassName="w-full min-h-[280px]"
              className="h-auto w-full object-cover"
            />
          </div>

          {/* Floating animated elements */}
          <div className="absolute -right-8 top-1/4 hidden rounded-xl border border-white/10 bg-navy-800/90 p-4 shadow-xl backdrop-blur-xl animate-float lg:block">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>

              <div>
                <p className="text-sm font-bold text-cream">
                  System Synced
                </p>

                <p className="text-xs text-ink/70">
                  Live data connection active
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Caption and highlights */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {data.dashboardPreview.features.map(
            (feat, idx) => (
              <div
                key={idx}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-ink/80"
              >
                {feat}
              </div>
            ),
          )}
        </div>
      </Container>
    </section>
  );
}