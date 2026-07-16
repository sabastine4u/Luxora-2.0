import { lazy, Suspense } from 'react';
import FeaturedProperties from '../../components/home/FeaturedProperties';
import Hero from '../../components/home/Hero';
import PopularCities from '../../components/home/PopularCities';
import PropertyCategories from '../../components/home/PropertyCategories';
import ServicesEcosystem from '../../components/home/ServicesEcosystem';
import { PageLayout } from '../../components/layout';

const Affordability = lazy(() => import('../../components/home/Affordability'));
const AgencySpotlight = lazy(() => import('../../components/home/AgencySpotlight'));
const InvestmentIntelligence = lazy(() => import('../../components/home/InvestmentIntelligence'));
const TrustVerification = lazy(() => import('../../components/home/TrustVerification'));
const WhyLuxora = lazy(() => import('../../components/home/WhyLuxora'));
const Testimonials = lazy(() => import('../../components/home/Testimonials'));

const Fallback = () => <div className="min-h-[400px] animate-pulse rounded-3xl bg-navy-900/20" />;
export default function HomePage() {
  return (
    <PageLayout>
        {/* Hero — what is Luxora? */}
        <Hero />
        
        {/* Featured Properties — what properties are available? */}
        <FeaturedProperties />
        
        {/* Property Categories — explore by type */}
        <PropertyCategories />
        
        {/* Popular Cities — explore top locations */}
        <PopularCities />
        
        {/* Services Ecosystem — end-to-end property services */}
        <ServicesEcosystem />

        <Suspense fallback={<Fallback />}>
          {/* Affordability — flexible payment plans */}
          <Affordability />
          
          {/* Agency Spotlight — top performing partners */}
          <AgencySpotlight />
          
          {/* Investment Intelligence — data-driven decisions */}
          <InvestmentIntelligence />
          
          {/* Trust & Verification — why you should trust us */}
          <TrustVerification />
          
          {/* Why Luxora — value proposition */}
          <WhyLuxora />
          
          {/* Testimonials — social proof */}
          <Testimonials />
        </Suspense>
    </PageLayout>
  );
}
