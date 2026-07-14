
import Affordability from '../../components/home/Affordability';
import AgencySpotlight from '../../components/home/AgencySpotlight';
import FeaturedProperties from '../../components/home/FeaturedProperties';
import Hero from '../../components/home/Hero';
import InvestmentIntelligence from '../../components/home/InvestmentIntelligence';
import PopularCities from '../../components/home/PopularCities';
import PropertyCategories from '../../components/home/PropertyCategories';
import ServicesEcosystem from '../../components/home/ServicesEcosystem';
import Testimonials from '../../components/home/Testimonials';
import TrustVerification from '../../components/home/TrustVerification';
import WhyLuxora from '../../components/home/WhyLuxora';
import { PageLayout } from '../../components/layout';

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
        
        {/* Why Luxora — value proposition */}
        <WhyLuxora />
        
        {/* Trust & Verification — why you should trust us */}
        <TrustVerification />
        
        {/* Affordability — flexible payment plans */}
        <Affordability />
        
        {/* Investment Intelligence — data-driven decisions */}
        <InvestmentIntelligence />
        
        {/* Services Ecosystem — end-to-end property services */}
        <ServicesEcosystem />
        
        {/* Agency Spotlight — top performing partners */}
        <AgencySpotlight />
        
        {/* Testimonials — social proof */}
        <Testimonials />
    </PageLayout>
  );
}
