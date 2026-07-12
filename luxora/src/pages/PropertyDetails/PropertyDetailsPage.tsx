import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, BadgeCheck, Phone, Mail, Calculator, Calendar, AlertTriangle, ChevronLeft, ChevronRight, CheckCircle2, Share2, Link2, MessageCircle, ExternalLink, LayoutGrid, Video, X } from 'lucide-react';
import { properties } from '../../data/luxoraData';
import { PageLayout, Container, Section, Breadcrumb } from '../../components/layout';
import { GoldButton, GhostButton } from '../../components/ui/ui';
import { Slider } from '../../components/ui/Slider';
import { calculateMortgage, formatCurrency } from '../../utils';
import { PropertyCard } from '../../components/property/PropertyCard';
import { useSession } from '../../contexts/SessionContext';

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const property = properties.find(p => p.id === id);
  const { addRecentlyViewed, openScheduleViewingModal, openReportListingModal } = useSession();

  // Photo Gallery Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Contact Agent Modal State
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Share Modal State
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Tabs State
  const [activeTab, setActiveTab] = useState('Overview');

  // Mortgage Calculator State
  const initialPriceM = property ? property.priceValue / 1_000_000 : 0;
  const [price, setPrice] = useState(initialPriceM);
  const [down, setDown] = useState(20);
  const [months, setMonths] = useState(36);

  useEffect(() => {
    if (property) {
      addRecentlyViewed(property.id);
    }
  }, [property, addRecentlyViewed]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') setLightboxIndex(prev => (prev === 0 ? gallery.length - 1 : prev - 1));
      if (e.key === 'ArrowRight') setLightboxIndex(prev => (prev === gallery.length - 1 ? 0 : prev + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

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

  const MOCK_AMENITIES = [
    'Swimming Pool', 'Gym & Fitness Center', '24/7 Security',
    'Power Backup Generator', 'Borehole Water Supply',
    'High-Speed Internet', 'CCTV Surveillance', 'Covered Parking',
    'Air Conditioning', 'Intercom System', 'Elevator Access',
    'Visitor Parking', 'Waste Management', 'Landscaped Gardens',
    'Smart Home System'
  ];

  const tabs = ['Overview', 'Amenities', 'Location', 'Floor Plan', 'Virtual Tour'];
  
  // Related Properties
  const related = properties.filter(p => p.id !== property.id).slice(0, 3);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setTimeout(() => {
      setContactLoading(false);
      setContactSuccess(true);
    }, 1500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <div className="text-left md:text-right flex items-center justify-between md:flex-col md:items-end gap-4 md:gap-0">
            <div>
              <div className="font-heading text-3xl font-bold text-cream">{property.price}</div>
              <div className="text-sm font-medium text-gold-300">From {property.monthly}/month</div>
            </div>
            <GhostButton onClick={() => setShareModalOpen(true)}>
              <Share2 className="h-4 w-4 mr-2" /> Share
            </GhostButton>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2 h-[400px] md:h-[500px]">
          <div className="md:col-span-3 md:row-span-2 overflow-hidden rounded-2xl h-full cursor-pointer group relative" onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}>
            <img src={gallery[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
          <div className="hidden md:block overflow-hidden rounded-2xl h-full cursor-pointer group relative" onClick={() => { setLightboxIndex(1); setLightboxOpen(true); }}>
            <img src={gallery[1]} alt="Gallery 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
          <div className="hidden md:block overflow-hidden rounded-2xl h-full cursor-pointer group relative" onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}>
            <img src={gallery[2]} alt="Gallery 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-navy-900/60 flex items-center justify-center group-hover:bg-navy-900/70 transition-colors">
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

              {/* Tabs Section */}
              <div>
                <div className="flex overflow-x-auto border-b border-white/10 mb-6 custom-scrollbar">
                  {tabs.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab 
                          ? 'text-gold-400 border-b-2 border-gold-400' 
                          : 'text-ink/60 hover:text-cream border-b-2 border-transparent'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div>
                  {activeTab === 'Overview' && (
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
                  )}

                  {activeTab === 'Amenities' && (
                    <div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {MOCK_AMENITIES.map(amenity => (
                          <div key={amenity} className="flex items-center gap-2 rounded-xl border border-white/10 bg-navy-800/50 px-4 py-3 text-sm text-cream/80">
                            <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0" />
                            <span className="truncate">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'Location' && (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-white/10 bg-navy-800/50 h-64 flex flex-col items-center justify-center p-6 text-center">
                        <MapPin className="h-12 w-12 text-gold-400/30 mb-4" />
                        <h4 className="text-lg font-medium text-cream mb-1">Interactive map coming soon</h4>
                        <p className="text-sm text-ink/60">{property.location}</p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="rounded-xl border border-white/10 bg-navy-800/30 p-4 text-center">
                          <div className="text-2xl font-bold text-gold-400 mb-1">82<span className="text-sm text-ink/50">/100</span></div>
                          <div className="text-xs text-cream/70 uppercase tracking-wider">Walk Score</div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-navy-800/30 p-4 text-center">
                          <div className="text-2xl font-bold text-gold-400 mb-1">71<span className="text-sm text-ink/50">/100</span></div>
                          <div className="text-xs text-cream/70 uppercase tracking-wider">Transit Score</div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-navy-800/30 p-4 text-center">
                          <div className="text-2xl font-bold text-gold-400 mb-1">4</div>
                          <div className="text-xs text-cream/70 uppercase tracking-wider">Schools (&lt;2km)</div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-navy-800/30 p-4 text-center">
                          <div className="text-2xl font-bold text-gold-400 mb-1">2</div>
                          <div className="text-xs text-cream/70 uppercase tracking-wider">Hospitals (&lt;3km)</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'Floor Plan' && (
                    <div className="rounded-2xl border border-white/10 bg-navy-800/50 h-64 flex flex-col items-center justify-center p-6 text-center">
                      <LayoutGrid className="h-12 w-12 text-gold-400/30 mb-4" />
                      <h4 className="text-lg font-medium text-cream mb-1">Floor plan coming soon</h4>
                      <p className="text-sm text-ink/60 mb-6">Contact the agent to request detailed floor plans</p>
                      <GhostButton onClick={() => setContactModalOpen(true)}>Request Floor Plan</GhostButton>
                    </div>
                  )}

                  {activeTab === 'Virtual Tour' && (
                    <div className="rounded-2xl border border-white/10 bg-navy-800/50 h-64 flex flex-col items-center justify-center p-6 text-center">
                      <Video className="h-12 w-12 text-gold-400/30 mb-4" />
                      <h4 className="text-lg font-medium text-cream mb-1">Virtual tour coming soon</h4>
                      <p className="text-sm text-ink/60 mb-6">Request a live video walkthrough from the agent</p>
                      <GhostButton onClick={() => openScheduleViewingModal(property.id)}>Request Virtual Tour</GhostButton>
                    </div>
                  )}
                </div>
              </div>

              {/* Price History Section */}
              <div>
                <h3 className="font-heading text-xl font-bold text-cream mb-6">Price History</h3>
                <div className="rounded-2xl border border-white/10 bg-navy-800/50 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-navy-900/50 border-b border-white/10 text-xs uppercase tracking-wider text-ink/50">
                        <th className="px-6 py-4 font-medium">Date</th>
                        <th className="px-6 py-4 font-medium">Price</th>
                        <th className="px-6 py-4 font-medium">Change</th>
                        <th className="px-6 py-4 font-medium">Event</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      <tr className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-cream">Today</td>
                        <td className="px-6 py-4 font-bold text-gold-300">{property.price}</td>
                        <td className="px-6 py-4 text-ink/50">--</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">Current Price</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-ink/70">3 months ago</td>
                        <td className="px-6 py-4 text-ink/70">₦{formatCurrency(property.priceValue * 0.96)}</td>
                        <td className="px-6 py-4 text-emerald-400">+4.1%</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-400/10 text-blue-400 border border-blue-400/20">Price Reduced</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-ink/70">6 months ago</td>
                        <td className="px-6 py-4 text-ink/70">₦{formatCurrency(property.priceValue * 0.92)}</td>
                        <td className="px-6 py-4 text-ink/50">--</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-400/10 text-gold-400 border border-gold-400/20">Listed</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
                    <GhostButton size="md" className="w-full justify-center" onClick={() => setContactModalOpen(true)}>
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
                  <GoldButton size="md" className="w-full justify-center" onClick={() => openScheduleViewingModal(property.id)}>
                    Request Tour
                  </GoldButton>
                </div>
                
                <div className="mt-4 text-center">
                  <button onClick={() => openReportListingModal(property.id)} className="text-xs text-ink/40 hover:text-rose-400 transition-colors inline-flex items-center justify-center gap-1.5">
                    <AlertTriangle className="h-3 w-3" /> Report this listing
                  </button>
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

      {/* Lightbox Overlay */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="h-8 w-8" />
          </button>
          
          <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white/70 font-medium">
            {lightboxIndex + 1} / {gallery.length}
          </div>

          <button 
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev === 0 ? gallery.length - 1 : prev - 1)); }}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <button 
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev === gallery.length - 1 ? 0 : prev + 1)); }}
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <img 
            src={gallery[lightboxIndex]} 
            alt="Gallery" 
            className="w-full h-full object-contain max-w-[90vw] max-h-[90vh]" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

      {/* Contact Agent Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-navy-800 border border-white/10 p-6 md:p-8 relative shadow-2xl overflow-hidden">
            <button 
              className="absolute top-6 right-6 text-ink/50 hover:text-cream transition-colors"
              onClick={() => { setContactModalOpen(false); setContactSuccess(false); }}
            >
              <X className="h-6 w-6" />
            </button>
            
            <h3 className="font-heading text-2xl font-bold text-cream mb-2">Contact {property.agent.name}</h3>
            
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
              <img src={property.agent.avatar} alt={property.agent.name} className="h-10 w-10 rounded-full object-cover border border-gold-400/30" />
              <div>
                <div className="text-sm font-semibold text-cream">{property.agent.name}</div>
                <div className="text-xs text-ink/50">{property.agent.agency}</div>
              </div>
            </div>

            {contactSuccess ? (
              <div className="text-center py-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400 mb-4">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold text-cream mb-2">Message Sent!</h4>
                <p className="text-ink/60 mb-8">The agent will be in touch within 24 hours.</p>
                <GhostButton className="w-full justify-center" onClick={() => { setContactModalOpen(false); setContactSuccess(false); }}>Close</GhostButton>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <input type="text" placeholder="Your full name" required className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 px-4 text-cream placeholder-ink/50 focus:border-gold-400/50 focus:outline-none" />
                </div>
                <div>
                  <input type="email" placeholder="your@email.com" required className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 px-4 text-cream placeholder-ink/50 focus:border-gold-400/50 focus:outline-none" />
                </div>
                <div>
                  <input type="tel" placeholder="+234 800 000 0000" required className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 px-4 text-cream placeholder-ink/50 focus:border-gold-400/50 focus:outline-none" />
                </div>
                <div>
                  <textarea rows={4} required defaultValue={`I am interested in ${property.title} and would like more information.`} className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 px-4 text-cream placeholder-ink/50 focus:border-gold-400/50 focus:outline-none resize-none"></textarea>
                </div>
                <div className="pt-2">
                  <GoldButton type="submit" className="w-full justify-center" disabled={contactLoading}>
                    {contactLoading ? 'Sending...' : 'Send Message'}
                  </GoldButton>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-navy-800 border border-white/10 p-6 relative shadow-2xl">
            <button 
              className="absolute top-6 right-6 text-ink/50 hover:text-cream transition-colors"
              onClick={() => setShareModalOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="font-heading text-xl font-bold text-cream mb-6">Share this Listing</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={handleCopyLink}
                className="rounded-2xl border border-white/10 bg-navy-800/50 hover:border-gold-400/30 p-4 flex flex-col items-center gap-2 cursor-pointer transition-all text-center"
              >
                <Link2 className="h-8 w-8 text-gold-400 mb-1" />
                <span className="text-sm font-medium text-cream">{copied ? 'Copied!' : 'Copy Link'}</span>
              </div>
              <div 
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(property.title + " - " + window.location.href)}`, "_blank")}
                className="rounded-2xl border border-white/10 bg-navy-800/50 hover:border-gold-400/30 p-4 flex flex-col items-center gap-2 cursor-pointer transition-all text-center"
              >
                <MessageCircle className="h-8 w-8 text-emerald-400 mb-1" />
                <span className="text-sm font-medium text-cream">WhatsApp</span>
              </div>
              <div 
                onClick={() => {
                  window.location.href = `mailto:?subject=${encodeURIComponent(property.title)}&body=${encodeURIComponent("Check out this property on Luxora:\n\n" + property.title + "\n" + window.location.href)}`;
                }}
                className="rounded-2xl border border-white/10 bg-navy-800/50 hover:border-gold-400/30 p-4 flex flex-col items-center gap-2 cursor-pointer transition-all text-center"
              >
                <Mail className="h-8 w-8 text-blue-400 mb-1" />
                <span className="text-sm font-medium text-cream">Email</span>
              </div>
              <div 
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("Check out " + property.title + " on Luxora " + window.location.href)}`, "_blank")}
                className="rounded-2xl border border-white/10 bg-navy-800/50 hover:border-gold-400/30 p-4 flex flex-col items-center gap-2 cursor-pointer transition-all text-center"
              >
                <ExternalLink className="h-8 w-8 text-sky-400 mb-1" />
                <span className="text-sm font-medium text-cream">Post on X</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
