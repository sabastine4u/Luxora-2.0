import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, BadgeCheck, Phone, Mail, Calculator, Calendar } from 'lucide-react';
import { properties } from '../../data/luxoraData';
import { PageLayout, Container, Section, Breadcrumb } from '../../components/layout';
import { GoldButton, GhostButton } from '../../components/ui/ui';
import { Slider } from '../../components/ui/Slider';
import { calculateMortgage } from '../../utils';
import { PropertyCard } from '../../components/property/PropertyCard';

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const property = properties.find(p => p.id === id);

  // Mortgage Calculator State
  const initialPriceM = property ? property.priceValue / 1_000_000 : 0;
  const [price, setPrice] = useState(initialPriceM);
  const [down, setDown] = useState(20);
  const [months, setMonths] = useState(36);

  if (!property) {
    return <Navigate to="/properties" replace />;
  }

  const { monthly } = calculateMortgage(price, down, months);

  // Fallback gallery images
  const gallery = [
    property.image,
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
  ];

  // Related Properties
  const related = properties.filter(p => p.id !== property.id).slice(0, 3);

  return (
    <PageLayout>
      <Container className="pt-24 md:pt-32">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Properties', href: '/properties' },
            { label: property.title },
          ]}
        />

        <div className="mt-6 mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-cream sm:text-4xl">{property.title}</h1>
            <div className="mt-2 flex items-center gap-2 text-ink/70">
              <MapPin className="h-4 w-4" /> {property.location}
            </div>
          </div>
          <div className="text-left md:text-right">
            <div className="font-heading text-3xl font-bold text-cream">{property.price}</div>
            <div className="text-sm font-medium text-gold-300">From {property.monthly}/month</div>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2 h-[400px] md:h-[500px]">
          <div className="md:col-span-3 md:row-span-2 overflow-hidden rounded-2xl h-full">
            <img src={gallery[0]} alt={property.title} className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:block overflow-hidden rounded-2xl h-full">
            <img src={gallery[1]} alt="Gallery 1" className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:block overflow-hidden rounded-2xl h-full relative">
            <img src={gallery[2]} alt="Gallery 2" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-navy-900/40 flex items-center justify-center cursor-pointer hover:bg-navy-900/50 transition-colors">
              <span className="text-cream font-semibold flex items-center gap-2">
                <Maximize className="h-5 w-5" /> View All Photos
              </span>
            </div>
          </div>
        </div>
      </Container>

      <Section className="pb-24 pt-12 md:pb-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Specs & Verification */}
              <div className="flex flex-wrap items-center gap-8 border-b border-white/10 pb-8">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-ink/50">Bedrooms</span>
                    <span className="flex items-center gap-2 font-semibold text-cream"><Bed className="h-5 w-5 text-gold-400" /> {property.beds}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-ink/50">Bathrooms</span>
                    <span className="flex items-center gap-2 font-semibold text-cream"><Bath className="h-5 w-5 text-gold-400" /> {property.baths}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-ink/50">Area</span>
                    <span className="flex items-center gap-2 font-semibold text-cream"><Maximize className="h-5 w-5 text-gold-400" /> {property.area}</span>
                  </div>
                </div>

                <div className="h-12 w-px bg-white/10 hidden md:block"></div>

                <div className="flex flex-wrap gap-2">
                  {property.verified.map(v => (
                    <span key={v} className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/20 bg-gold-400/5 px-3 py-1.5 text-xs font-medium text-gold-200">
                      <BadgeCheck className="h-4 w-4 text-gold-400" /> {v} Verified
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-cream mb-4">About this property</h2>
                <div className="space-y-4 text-ink/70 leading-relaxed">
                  <p>
                    Experience unparalleled luxury in this exquisite {property.type.toLowerCase()} located in the prestigious neighborhood of {property.location}. 
                    Designed with meticulous attention to detail, this residence offers a seamless blend of modern sophistication and timeless elegance.
                  </p>
                  <p>
                    The expansive layout features {property.beds} spacious bedrooms, {property.baths} luxurious bathrooms, and a state-of-the-art kitchen equipped with top-tier appliances. 
                    Floor-to-ceiling windows provide breathtaking views and flood the interior with natural light, creating an inviting and warm atmosphere.
                  </p>
                  <p>
                    Residents will enjoy exclusive access to world-class amenities, robust security, and the unparalleled convenience of premium city living.
                  </p>
                </div>
              </div>

              {/* Mortgage Calculator */}
              <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8 backdrop-blur-md">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-cream">Mortgage Estimator</h3>
                    <p className="text-sm text-ink/50">Calculate your estimated monthly payments</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <Slider
                      label="Property Price"
                      value={price}
                      min={50}
                      max={1000}
                      step={10}
                      suffix="M"
                      prefix="₦"
                      onChange={setPrice}
                    />
                    <Slider
                      label="Down Payment"
                      value={down}
                      min={0}
                      max={50}
                      step={5}
                      suffix="%"
                      onChange={setDown}
                    />
                    <Slider
                      label="Duration"
                      value={months}
                      min={12}
                      max={60}
                      step={12}
                      suffix=" mos"
                      onChange={setMonths}
                    />
                  </div>
                  <div className="flex flex-col justify-center rounded-2xl bg-navy-900/60 p-6 text-center border border-white/5">
                    <div className="text-sm text-ink/50 mb-2">Estimated Monthly Payment</div>
                    <div className="font-heading text-3xl font-bold text-gold-300">
                      ₦{(monthly / 1_000_000).toFixed(2)}M
                    </div>
                    <div className="mt-4 text-xs text-ink/40 max-w-[200px] mx-auto">
                      *Estimates are based on current average interest rates and do not include taxes or insurance.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-24 space-y-6">
                {/* Agent Card */}
                <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md">
                  <h3 className="font-heading text-lg font-semibold text-cream mb-6">Listed By</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <img src={property.agent.avatar} alt={property.agent.name} className="h-16 w-16 rounded-full object-cover border-2 border-gold-400/30" />
                    <div>
                      <div className="font-semibold text-cream">{property.agent.name}</div>
                      <div className="text-sm text-ink/50">{property.agent.agency}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <GoldButton size="md" className="w-full justify-center">
                      <Phone className="h-4 w-4" /> Call Agent
                    </GoldButton>
                    <GhostButton size="md" className="w-full justify-center">
                      <Mail className="h-4 w-4" /> Send Message
                    </GhostButton>
                  </div>
                </div>

                {/* Viewing Card */}
                <div className="rounded-3xl border border-white/10 bg-gold-400/5 p-6 backdrop-blur-md text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/10 text-gold-400 mb-4">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-cream mb-2">Schedule a Viewing</h3>
                  <p className="text-sm text-ink/60 mb-6">Book an in-person or virtual tour with the listing agent.</p>
                  <GoldButton size="md" className="w-full justify-center">
                    Request Tour
                  </GoldButton>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Related Properties */}
      <Section className="bg-navy-900 border-t border-white/5">
        <Container>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-cream">Similar Properties</h2>
            <GhostButton size="sm">View All</GhostButton>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </Container>
      </Section>
    </PageLayout>
  );
}
