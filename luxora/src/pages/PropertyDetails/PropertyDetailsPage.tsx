import { useState, useEffect, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, BadgeCheck, AlertTriangle, CheckCircle2, Share2, LayoutGrid, Video, X } from 'lucide-react';
import { properties } from '../../data/luxoraData';
import { PageLayout, Container, Section, Breadcrumb } from '../../components/layout';
import { GoldButton, GhostButton } from '../../components/ui/ui';
import { formatCurrency } from '../../utils';
import { PropertyCard } from '../../components/property/PropertyCard';
import { PropertyGallery } from '../../components/property/PropertyGallery';
import { PropertySidebar } from '../../components/property/PropertySidebar';
import { MortgageCalculator } from '../../components/property/MortgageCalculator';
import { getSimilarProperties } from '../../utils/propertyRecommendations';
import { useSession } from '../../contexts/SessionContext';

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const property = properties.find(p => p.id === id);
  const { addRecentlyViewed, openScheduleViewingModal } = useSession();

  // Contact Agent Modal State
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Share Toast State
  const [shareToastVisible, setShareToastVisible] = useState(false);

  // Tabs State
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    if (property) {
      addRecentlyViewed(property.id);
    }
  }, [property, addRecentlyViewed]);

  // Smart Recommendation Engine (Memoized)
  const similarProperties = useMemo(() => {
    return property ? getSimilarProperties(property, properties, 4) : [];
  }, [property]);

  const { recentlyViewed } = useSession();

  const recentlyViewedProperties = useMemo(() => {
    return recentlyViewed
      .filter(id => id !== property?.id)
      .map(id => properties.find(p => p.id === id))
      .filter((p): p is NonNullable<typeof p> => !!p);
  }, [recentlyViewed, property]);

  if (!property) {
    return <Navigate to="/properties" replace />;
  }

  const tabs = ['Overview', 'Amenities', 'Location', 'Floor Plan', 'Virtual Tour'];

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
    setShareToastVisible(true);
    setTimeout(() => setShareToastVisible(false), 3000);
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
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
            <GhostButton 
              onClick={handleShareClick}
              aria-label="Share property"
            >
              <Share2 className="h-4 w-4 mr-2" aria-hidden="true" /> Share
            </GhostButton>
          </div>
        </div>

        {/* Gallery */}
        <PropertyGallery property={property} />
      </Container>

      <Section className="pb-24 pt-12 md:pb-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Specs & Verification */}
              <div className="flex flex-col gap-10 border-b border-white/10 pb-10">
                <div className="flex flex-wrap items-center gap-8">
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
                    {property.verified?.map(v => (
                      <span key={v} className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/20 bg-gold-400/5 px-3 py-1.5 text-xs font-medium text-gold-200">
                        <BadgeCheck className="h-4 w-4 text-gold-400" /> {v} Verified
                      </span>
                    ))}
                  </div>
                </div>

                {/* Property Facts */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8 border-t border-white/10">
                  <div className="flex flex-col gap-1.5 p-4 rounded-2xl border border-transparent hover:bg-navy-800/30 hover:border-white/5 transition-all duration-300 hover:-translate-y-1 cursor-default">
                    <span className="text-xs text-ink/50 uppercase tracking-wider">Year Built</span>
                    <span className="text-sm font-medium text-cream">{property.yearBuilt || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-4 rounded-2xl border border-transparent hover:bg-navy-800/30 hover:border-white/5 transition-all duration-300 hover:-translate-y-1 cursor-default">
                    <span className="text-xs text-ink/50 uppercase tracking-wider">Parking Spaces</span>
                    <span className="text-sm font-medium text-cream">{property.parkingSpaces || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-4 rounded-2xl border border-transparent hover:bg-navy-800/30 hover:border-white/5 transition-all duration-300 hover:-translate-y-1 cursor-default">
                    <span className="text-xs text-ink/50 uppercase tracking-wider">Property Type</span>
                    <span className="text-sm font-medium text-cream">{property.type}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-4 rounded-2xl border border-transparent hover:bg-navy-800/30 hover:border-white/5 transition-all duration-300 hover:-translate-y-1 cursor-default">
                    <span className="text-xs text-ink/50 uppercase tracking-wider">Area</span>
                    <span className="text-sm font-medium text-cream">{property.area}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-4 rounded-2xl border border-transparent hover:bg-navy-800/30 hover:border-white/5 transition-all duration-300 hover:-translate-y-1 cursor-default">
                    <span className="text-xs text-ink/50 uppercase tracking-wider">Bedrooms</span>
                    <span className="text-sm font-medium text-cream">{property.beds}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-4 rounded-2xl border border-transparent hover:bg-navy-800/30 hover:border-white/5 transition-all duration-300 hover:-translate-y-1 cursor-default">
                    <span className="text-xs text-ink/50 uppercase tracking-wider">Bathrooms</span>
                    <span className="text-sm font-medium text-cream">{property.baths}</span>
                  </div>
                </div>

                {/* Verified Documents */}
                {property.documents && property.documents.length > 0 && (
                  <div className="pt-8 border-t border-white/10">
                    <h4 className="text-sm font-semibold text-cream mb-4">Verified Documents</h4>
                    <div className="flex flex-wrap gap-3">
                      {property.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-2 rounded-lg border border-white/10 bg-navy-800/30 px-3 py-2 text-xs">
                          <span className="text-cream/80">{doc.title}</span>
                          {doc.verified ? (
                            <span className="flex items-center gap-1 text-gold-400 font-medium">
                              <CheckCircle2 className="h-3 w-3" /> Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-ink/50 font-medium">
                              <AlertTriangle className="h-3 w-3" /> Pending
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                    <div className="space-y-6">
                      <div className="space-y-4 text-ink/70 leading-relaxed">
                        <p>
                          Experience unparalleled luxury in this exquisite {property.type.toLowerCase()} located in the prestigious neighborhood of {property.location}. 
                          Designed with meticulous attention to detail, this residence offers a seamless blend of modern sophistication and timeless elegance.
                        </p>
                      </div>
                      
                      {property.features && property.features.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-cream mb-4">Key Features</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {property.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 rounded-xl border border-white/10 bg-navy-800/50 px-4 py-3 text-sm text-cream/80">
                                <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0" />
                                <span className="truncate">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'Amenities' && (
                    <div>
                      {property.amenities && property.amenities.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {property.amenities.map(amenity => (
                            <div key={amenity} className="flex items-center gap-2 rounded-xl border border-white/10 bg-navy-800/50 px-4 py-3 text-sm text-cream/80">
                              <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0" />
                              <span className="truncate">{amenity}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-ink/60 p-4 border border-white/5 rounded-xl text-center">
                          No amenities available.
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'Location' && (
                    <div className="space-y-8">
                      <div className="rounded-3xl border border-white/10 bg-navy-800/50 h-[300px] flex flex-col items-center justify-center p-8 text-center">
                        <MapPin className="h-12 w-12 text-gold-400/30 mb-5" />
                        <h4 className="font-heading text-xl font-medium text-cream mb-2">Interactive map coming soon</h4>
                        <p className="text-sm text-ink/60">{property.location}</p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="rounded-xl border border-white/10 bg-navy-800/30 p-4 text-center">
                          <div className="text-2xl font-bold text-gold-400 mb-1">{property.walkScore || '--'}<span className="text-sm text-ink/50">/100</span></div>
                          <div className="text-xs text-cream/70 uppercase tracking-wider">Walk Score</div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-navy-800/30 p-4 text-center">
                          <div className="text-2xl font-bold text-gold-400 mb-1">{property.transitScore || '--'}<span className="text-sm text-ink/50">/100</span></div>
                          <div className="text-xs text-cream/70 uppercase tracking-wider">Transit Score</div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-navy-800/30 p-4 text-center">
                          <div className="text-2xl font-bold text-gold-400 mb-1">{property.schoolScore || '--'}<span className="text-sm text-ink/50">/100</span></div>
                          <div className="text-xs text-cream/70 uppercase tracking-wider">School Score</div>
                        </div>
                      </div>

                      {property.nearbyPlaces && property.nearbyPlaces.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-cream mb-4">Nearby Places</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {property.nearbyPlaces.map((place, idx) => (
                              <div key={idx} className="rounded-xl border border-white/10 bg-navy-800/30 p-4">
                                <div className="text-sm font-medium text-cream mb-1 flex items-start gap-1">
                                  <MapPin className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                                  <span>{place.title}</span>
                                </div>
                                <div className="text-xs text-ink/50 pl-5">{place.distance}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'Floor Plan' && (
                    <div className="rounded-3xl border border-white/10 bg-navy-800/50 flex flex-col items-center justify-center p-8 text-center min-h-[20rem]">
                      {property.floorPlans && property.floorPlans.length > 0 ? (
                        <>
                          <img src={property.floorPlans[0]} alt="Floor Plan" loading="lazy" className="w-full max-w-2xl rounded-2xl object-contain mb-8" />
                          <GhostButton onClick={() => setContactModalOpen(true)}>Request Full Floor Plan</GhostButton>
                        </>
                      ) : (
                        <>
                          <LayoutGrid className="h-14 w-14 text-gold-400/30 mb-5" />
                          <h4 className="font-heading text-xl font-medium text-cream mb-2">Floor plan coming soon</h4>
                          <p className="text-sm text-ink/60 mb-8 leading-relaxed">Contact the agent to request detailed floor plans</p>
                          <GhostButton onClick={() => setContactModalOpen(true)}>Request Floor Plan</GhostButton>
                        </>
                      )}
                    </div>
                  )}

                  {activeTab === 'Virtual Tour' && (
                    <div className="rounded-3xl border border-white/10 bg-navy-800/50 h-[300px] flex flex-col items-center justify-center p-8 text-center">
                      <Video className="h-14 w-14 text-gold-400/30 mb-5" />
                      <h4 className="font-heading text-xl font-medium text-cream mb-2">Virtual tour coming soon</h4>
                      <p className="text-sm text-ink/60 mb-8 leading-relaxed">Request a live video walkthrough from the agent</p>
                      <GhostButton onClick={() => openScheduleViewingModal(property.id)}>Request Virtual Tour</GhostButton>
                    </div>
                  )}
                </div>
              </div>

              {/* Price History Section */}
              <div>
                <h3 className="font-heading text-xl font-bold text-cream mb-8">Price History</h3>
                <div className="rounded-3xl border border-white/10 bg-navy-800/50 overflow-hidden">
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
              <MortgageCalculator property={property} />
            </div>

            {/* Sidebar */}
            <div>
              <PropertySidebar property={property} onContactClick={() => setContactModalOpen(true)} />
            </div>
          </div>
        </Container>
      </Section>

      {/* Related Properties */}
      <Section className="bg-navy-900 border-t border-white/5">
        <Container>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-cream">Similar Properties</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {similarProperties.map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Recently Viewed */}
      {recentlyViewedProperties.length > 0 && (
        <Section className="bg-navy-900 border-t border-white/5 pb-24">
          <Container>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold text-cream">Recently Viewed</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recentlyViewedProperties.map(p => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </Container>
        </Section>
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

      {/* Share Toast */}
      {shareToastVisible && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-full text-sm font-medium shadow-xl shadow-emerald-500/20 whitespace-nowrap animate-in fade-in slide-in-from-bottom-4 duration-300">
          Link copied to clipboard!
        </div>
      )}
    </PageLayout>
  );
}
