import { useEffect } from 'react';
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
  CTASection 
} from './index';

interface Props {
  service: ServiceData;
}

export function ServiceExperiencePage({ service }: Props) {
  // Simple analytics tracking stub for Phase 7
  useEffect(() => {
    console.log(`[Analytics] Page Viewed: ${service.name} Service Experience`);
    // Track 50% scroll
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 50) {
        console.log(`[Analytics] 50% Scroll Reached: ${service.name}`);
        window.removeEventListener('scroll', handleScroll);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [service]);

  return (
    <ServiceLayout>
      <div className="flex flex-col w-full">
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
