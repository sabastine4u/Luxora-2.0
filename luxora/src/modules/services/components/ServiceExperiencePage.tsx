import { useEffect, useState } from 'react';
import type { ServiceData } from '../types';
import {
  ServiceLayout,
  ServiceHero,
  ServiceOverview,
  FeatureGrid,
  BenefitsSection,
  JourneySection,
  DashboardShowcase,
  Testimonials,
  FAQSection,
  CTASection,
} from './index';

interface Props {
  service: ServiceData;
}

const SERVICE_OVERVIEW_IMAGE =
  'https://images.unsplash.com/photo-1556156653-e5a7c69cc263?auto=format&fit=crop&q=80';

const preloadImage = (
  src: string,
): Promise<void> =>
  new Promise((resolve) => {
    if (!src) {
      resolve();
      return;
    }

    const image = new Image();

    image.onload = () => resolve();
    image.onerror = () => resolve();

    image.src = src;
  });

export function ServiceExperiencePage({
  service,
}: Props) {
  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    let isActive = true;

    const prepareServicePage =
      async () => {
        /*
         * Always start Service pages from the top.
         * This prevents a previous Service page's scroll
         * position from carrying into the next one.
         */
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'auto',
        });

        /*
         * Collect every image used by the shared Service
         * experience so the page does not render in a
         * partially loaded state.
         */
        const imageSources = [
          service.heroImage,
          service.dashboardPreview?.imageUrl,
          SERVICE_OVERVIEW_IMAGE,
          ...(service.testimonials || [])
            .map(
              (testimonial) =>
                testimonial.avatarUrl,
            )
            .filter(
              (
                imageUrl,
              ): imageUrl is string =>
                Boolean(imageUrl),
            ),
        ].filter(
          (
            imageUrl,
          ): imageUrl is string =>
            Boolean(imageUrl),
        );

        /*
         * Remove duplicate image URLs before preloading.
         */
        const uniqueImageSources = [
          ...new Set(imageSources),
        ];

        /*
         * Wait for all Service images to either load
         * successfully or fail gracefully.
         *
         * A failed image must never leave the Service
         * page stuck on the loading screen.
         */
        await Promise.all(
          uniqueImageSources.map(
            preloadImage,
          ),
        );

        /*
         * Wait for the next paint so the browser has
         * completed the loading transition before we
         * reveal the full Service page.
         */
        await new Promise<void>(
          (resolve) => {
            requestAnimationFrame(
              () => resolve(),
            );
          },
        );

        if (isActive) {
          setIsLoading(false);
        }
      };

    void prepareServicePage();

    return () => {
      isActive = false;
    };
  }, [service]);

  /*
   * Keep the entire loading surface dark so there is
   * no white blank screen while a Service page prepares.
   */
  if (isLoading) {
    return (
      <ServiceLayout>
        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-navy-900 px-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6 flex h-14 w-14 items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-gold-400/10" />

              <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-gold-400" />
            </div>

            <h2 className="font-heading text-xl font-semibold text-cream">
              Loading {service.name}
            </h2>

            <p className="mt-2 max-w-sm text-sm text-ink/50">
              Preparing your Luxora service experience...
            </p>
          </div>
        </div>
      </ServiceLayout>
    );
  }

  return (
    <ServiceLayout>
      <div className="flex w-full flex-col">
        <ServiceHero data={service} />
        <ServiceOverview data={service} />
        <FeatureGrid data={service} />
        <BenefitsSection data={service} />
        <JourneySection data={service} />
        <DashboardShowcase data={service} />
        <Testimonials data={service} />
        <FAQSection data={service} />
        <CTASection data={service} />
      </div>
    </ServiceLayout>
  );
}