import Footer from '../../components/layout/Footer';
import Navbar from '../../components/layout/Navbar';
import Affordability from '../../components/home/Affordability';
import AgencySpotlight from '../../components/home/AgencySpotlight';
import FeaturedProperties from '../../components/home/FeaturedProperties';
import Hero from '../../components/home/Hero';
import InvestmentIntelligence from '../../components/home/InvestmentIntelligence';
import PropertyCategories from '../../components/home/PropertyCategories';
import ServicesEcosystem from '../../components/home/ServicesEcosystem';
import Testimonials from '../../components/home/Testimonials';
import TrustVerification from '../../components/home/TrustVerification';
import WhyLuxora from '../../components/home/WhyLuxora';
import { PageLayout } from '../../components/layout';

export default function HomePage() {
  return (
    <PageLayout>
      <Navbar />
      <main>
        <Hero />
        <TrustVerification />
        <Affordability />
        <FeaturedProperties />
        <PropertyCategories />
        <WhyLuxora />
        <ServicesEcosystem />
        <AgencySpotlight />
        <InvestmentIntelligence />
        <Testimonials />
      </main>
      <Footer />
    </PageLayout>
  );
}
