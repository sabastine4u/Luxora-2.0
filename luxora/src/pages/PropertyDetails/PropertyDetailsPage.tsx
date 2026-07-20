import { useState, useEffect, useMemo } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, BadgeCheck, AlertTriangle, CheckCircle2, Share2, LayoutGrid, Video, X, Heart, Scale, Download, FileText } from 'lucide-react';
import { properties } from '../../data/luxoraData';
import { PageLayout, Container, Section, Breadcrumb } from '../../components/layout';
import { GoldButton, GhostButton } from '../../components/ui/ui';
import { formatCurrency } from '../../utils';
import { PropertyCard } from '../../components/property/PropertyCard';
import { PropertyMap } from '../../components/property/PropertyMap';
import { PropertyGallery } from '../../components/property/PropertyGallery';
import { PropertySidebar } from '../../components/property/PropertySidebar';
import { MortgageCalculator } from '../../components/property/MortgageCalculator';
import { getSimilarProperties } from '../../utils/propertyRecommendations';
import { useSession } from '../../contexts/SessionContext';
import { useFavorites } from '../../contexts/FavoriteContext';
import { useToast } from '../../contexts/ToastContext';
import { agentNameToSlug, agencyNameToSlug } from '../../utils/agency';
import { ROUTES } from '../../constants/routes';

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const property = properties.find(p => p.id === id);
  const { addRecentlyViewed, openScheduleViewingModal, toggleCompareProperty, recentlyViewed } = useSession();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Contact Agent Modal State
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const { showToast } = useToast();

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

  const recentlyViewedProperties = useMemo(() => {
    return recentlyViewed
      .filter(id => id !== property?.id)
      .map(id => properties.find(p => p.id === id))
      .filter((p): p is NonNullable<typeof p> => !!p);
  }, [recentlyViewed, property]);

  if (!property) {
    return <Navigate to="/properties" replace />;
  }

  const tabs = ['Overview', 'Amenities', 'Location', 'Floor Plan', 'Virtual Tour', 'Property Video'];
  const saved = isFavorite(property.id);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setTimeout(() => {
      setContactLoading(false);
      setContactSuccess(true);
    }, 1500);
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
      navigator.clipboard.writeText(window.location.href);
      showToast({ type: 'success', title: 'Link Copied', description: 'Link copied to clipboard!' });
    }
  };

  const handleDownloadBrochure = () => {
    if (property.brochureUrl && property.brochureUrl !== '#') {
      window.open(property.brochureUrl, '_blank');
    } else {
      showToast({ type: 'info', title: 'Coming Soon', description: 'Brochure coming soon. Please contact the agent for more information.' });
    }
  };

  const handleCompareClick = () => {
    const result = toggleCompareProperty(property.id);
    if (result === 'limit_reached') {
      showToast({ type: 'warning', title: 'Limit Reached', description: 'You can compare up to 4 properties.' });
    } else if (result === 'added') {
      showToast({ type: 'success', title: 'Added to Compare', description: 'Property added to your compare list.' });
    } else if (result === 'exists') {
      showToast({ type: 'info', title: 'Removed from Compare', description: 'Property removed from your compare list.' });
    }
  };

  const getTierBadge = () => {
    if (!property.listingTier) return null;
    
    if (property.listingTier === 'Pro') {
      return (
        <span className="inline-flex items-center rounded-md border border-gold-400/30 bg-gold-400/10 px-2.5 py-0.5 text-xs font-semibold text-gold-400 uppercase tracking-wider shadow-[0_0_10px_rgba(212,175,55,0.2)]">
          {property.listingTier} Tier
        </span>
      );
    }
    if (property.listingTier === 'Plus') {
      return (
        <span className="inline-flex items-center rounded-md border border-blue-400/30 bg-blue-400/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400 uppercase tracking-wider">
          Plus Tier
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-md border border-white/20 bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-cream/70 uppercase tracking-wider">
        Basic Tier
      </span>
    );
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
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="font-heading text-3xl font-bold text-cream sm:text-4xl">{property.title}</h1>
              {getTierBadge()}
            </div>
            <div className="mt-1 flex items-center gap-2 text-ink/70">
              <MapPin className="h-4 w-4" /> {property.location}
            </div>
          </div>
          <div className="text-left md:text-right flex items-center justify-between md:flex-col md:items-end gap-4 md:gap-3 shrink-0">
            <div>
              <div className="font-heading text-3xl font-bold text-cream">{property.price}</div>
              <div className="text-sm font-medium text-gold-300">From {property.monthly}/month</div>
            </div>
            
            {/* Header Action Area */}
            <div className="flex items-center gap-2 flex-wrap">
              <GhostButton 
                size="sm"
                className={`transition-colors h-9 px-3 text-xs border border-white/10 ${saved ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20'}`}
                onClick={() => toggleFavorite(property.id)}
              >
                <Heart className={`h-3.5 w-3.5 mr-1.5 ${saved ? 'fill-current' : ''}`} /> {saved ? 'Saved' : 'Save'}
              </GhostButton>
              <GhostButton 
                size="sm"
                className="transition-colors h-9 px-3 text-xs border border-white/10 hover:bg-gold-400/10 hover:text-gold-400 hover:border-gold-400/20"
                onClick={handleCompareClick}
              >
                <Scale className="h-3.5 w-3.5 mr-1.5" /> Compare
              </GhostButton>
              <GhostButton 
                size="sm"
                className="transition-colors h-9 px-3 text-xs border border-white/10 hover:bg-white/10"
                onClick={handleDownloadBrochure}
              >
                <Download className="h-3.5 w-3.5 mr-1.5" /> Brochure
              </GhostButton>
              <GhostButton 
                size="sm"
                className="transition-colors h-9 px-3 text-xs border border-white/10 hover:bg-white/10"
                onClick={handleShareClick}
              >
                <Share2 className="h-3.5 w-3.5 mr-1.5" /> Share
              </GhostButton>
            </div>
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
              {/* Quick Specs & Verification */}
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

                {/* Extended Property Facts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/10">
                  <div className="flex flex-col gap-1.5 p-4 rounded-2xl border border-transparent hover:bg-navy-800/30 hover:border-white/5 transition-all duration-300 hover:-translate-y-1 cursor-default">
                    <span className="text-[10px] text-ink/50 uppercase tracking-widest font-semibold">Bedrooms</span>
                    <span className="text-sm font-medium text-cream">{property.beds}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 p-4 rounded-2xl border border-transparent hover:bg-navy-800/30 hover:border-white/5 transition-all duration-300 hover:-translate-y-1 cursor-default">
                    <span className="text-[10px] text-ink/50 uppercase tracking-widest font-semibold">Bathrooms</span>
                    <span className="text-sm font-medium text-cream">{property.baths}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 p-4 rounded-2xl border border-transparent hover:bg-navy-800/30 hover:border-white/5 transition-all duration-300 hover:-translate-y-1 cursor-default">
                    <span className="text-[10px] text-ink/50 uppercase tracking-widest font-semibold">Area</span>
                    <span className="text-sm font-medium text-cream">{property.area}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 p-4 rounded-2xl border border-transparent hover:bg-navy-800/30 hover:border-white/5 transition-all duration-300 hover:-translate-y-1 cursor-default">
                    <span className="text-[10px] text-ink/50 uppercase tracking-widest font-semibold">Parking Spaces</span>
                    <span className="text-sm font-medium text-cream">{property.parkingSpaces ?? 'N/A'}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 p-4 rounded-2xl border border-transparent hover:bg-navy-800/30 hover:border-white/5 transition-all duration-300 hover:-translate-y-1 cursor-default">
                    <span className="text-[10px] text-ink/50 uppercase tracking-widest font-semibold">Year Built</span>
                    <span className="text-sm font-medium text-cream">{property.yearBuilt ?? 'N/A'}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 p-4 rounded-2xl border border-transparent hover:bg-navy-800/30 hover:border-white/5 transition-all duration-300 hover:-translate-y-1 cursor-default">
                    <span className="text-[10px] text-ink/50 uppercase tracking-widest font-semibold">Property Status</span>
                    <span className="text-sm font-medium text-cream">{property.status ?? 'Available'}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 p-4 rounded-2xl border border-transparent hover:bg-navy-800/30 hover:border-white/5 transition-all duration-300 hover:-translate-y-1 cursor-default">
                    <span className="text-[10px] text-ink/50 uppercase tracking-widest font-semibold">Verification</span>
                    <span className="text-sm font-medium text-cream flex items-center gap-1">{property.verified?.includes('Premium') ? <CheckCircle2 className="h-3.5 w-3.5 text-gold-400" /> : null} {property.verified?.length ? 'Verified' : 'Pending'}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 p-4 rounded-2xl border border-transparent hover:bg-navy-800/30 hover:border-white/5 transition-all duration-300 hover:-translate-y-1 cursor-default">
                    <span className="text-[10px] text-ink/50 uppercase tracking-widest font-semibold">Listing Tier</span>
                    <span className="text-sm font-medium text-cream">{property.listingTier || 'Basic'}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 p-4 rounded-2xl border border-transparent hover:bg-navy-800/30 hover:border-white/5 transition-all duration-300 hover:-translate-y-1 cursor-default">
                    <span className="text-[10px] text-ink/50 uppercase tracking-widest font-semibold">Inspection Status</span>
                    <span className="text-sm font-medium text-cream">{property.inspectionStatus ?? 'Pending'}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 p-4 rounded-2xl border border-transparent hover:bg-navy-800/30 hover:border-white/5 transition-all duration-300 hover:-translate-y-1 cursor-default">
                    <span className="text-[10px] text-ink/50 uppercase tracking-widest font-semibold">Availability Date</span>
                    <span className="text-sm font-medium text-cream">{property.availabilityDate ?? 'Immediate'}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 p-4 rounded-2xl border border-transparent hover:bg-navy-800/30 hover:border-white/5 transition-all duration-300 hover:-translate-y-1 cursor-default">
                    <span className="text-[10px] text-ink/50 uppercase tracking-widest font-semibold">Furnishing</span>
                    <span className="text-sm font-medium text-cream">{property.furnishing ?? 'N/A'}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 p-4 rounded-2xl border border-transparent hover:bg-navy-800/30 hover:border-white/5 transition-all duration-300 hover:-translate-y-1 cursor-default">
                    <span className="text-[10px] text-ink/50 uppercase tracking-widest font-semibold">Property Type</span>
                    <span className="text-sm font-medium text-cream">{property.type}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 p-4 rounded-2xl border border-transparent hover:bg-navy-800/30 hover:border-white/5 transition-all duration-300 hover:-translate-y-1 cursor-default">
                    <span className="text-[10px] text-ink/50 uppercase tracking-widest font-semibold">Transaction Type</span>
                    <span className="text-sm font-medium text-cream capitalize">{property.transactionType}</span>
                  </div>
                </div>

                {/* Verified Documents */}
                {property.documents && property.documents.length > 0 && (
                  <div className="pt-8 border-t border-white/10">
                    <h4 className="text-sm font-semibold text-cream mb-4">Verified Documents</h4>
                    <div className="flex flex-wrap gap-3">
                      {property.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-2 rounded-lg border border-white/10 bg-navy-800/30 px-3 py-2 text-xs">
                          <FileText className="h-3.5 w-3.5 text-ink/50" />
                          <span className="text-cream/80">{doc.title}</span>
                          {doc.verified ? (
                            <span className="flex items-center gap-1 text-gold-400 font-medium ml-1">
                              <CheckCircle2 className="h-3 w-3" /> Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-ink/50 font-medium ml-1">
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
                <div className="flex overflow-x-auto border-b border-white/10 mb-6 scrollbar-hide">
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
                    <div className="space-y-6 animate-in fade-in duration-500">
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
                    <div className="animate-in fade-in duration-500">
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
                    <div className="space-y-8 animate-in fade-in duration-500">
                      <PropertyMap properties={[property]} className="h-[400px] w-full rounded-3xl overflow-hidden" />
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
                    <div className="rounded-3xl border border-white/10 bg-navy-800/50 flex flex-col items-center justify-center p-8 text-center min-h-[20rem] animate-in fade-in duration-500">
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
                    <div className="rounded-3xl border border-white/10 bg-navy-800/50 h-[300px] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                      <Video className="h-14 w-14 text-gold-400/30 mb-5" />
                      <h4 className="font-heading text-xl font-medium text-cream mb-2">Virtual tour coming soon</h4>
                      <p className="text-sm text-ink/60 mb-8 leading-relaxed">Request a live video walkthrough from the agent</p>
                      <GhostButton onClick={() => openScheduleViewingModal(property.id)}>Request Virtual Tour</GhostButton>
                    </div>
                  )}

                  {activeTab === 'Property Video' && (
                    <div className="rounded-3xl border border-white/10 bg-navy-800/50 min-h-[300px] flex flex-col items-center justify-center p-4 md:p-8 text-center animate-in fade-in duration-500 overflow-hidden">
                      {property.videoUrl ? (
                        <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl relative">
                          <iframe 
                            src={property.videoUrl} 
                            title={`${property.title} Video Presentation`} 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen 
                            className="absolute top-0 left-0 w-full h-full border-0"
                          ></iframe>
                        </div>
                      ) : (
                        <>
                          <Video className="h-14 w-14 text-gold-400/30 mb-5" />
                          <h4 className="font-heading text-xl font-medium text-cream mb-2">Property video coming soon</h4>
                          <p className="text-sm text-ink/60 mb-8 leading-relaxed">Contact the agent to request a video presentation</p>
                          <GhostButton onClick={() => setContactModalOpen(true)}>Request Video</GhostButton>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment & Financing */}
              <div className="pt-8 pb-4">
                <h3 className="font-heading text-2xl font-bold text-cream mb-6">Payment & Financing</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="rounded-3xl border border-white/10 bg-navy-800/30 p-6 md:p-8">
                    <h4 className="text-sm font-semibold text-cream mb-6 border-b border-white/5 pb-4">Financial Overview</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-ink/60">Purchase Price</span>
                        <span className="text-sm font-bold text-cream">{property.price}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-ink/60">Deposit</span>
                        <span className="text-sm font-medium text-cream">{property.paymentSnapshot?.deposit || 'Available on request'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-ink/60">Agency Fee</span>
                        <span className="text-sm font-medium text-cream">{property.paymentSnapshot?.agencyFee || 'Available on request'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-ink/60">Legal Fee</span>
                        <span className="text-sm font-medium text-cream">{property.paymentSnapshot?.legalFee || 'Available on request'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-sm text-ink/60">Service Charge</span>
                        <span className="text-sm font-medium text-cream">{property.paymentSnapshot?.serviceCharge || 'Available on request'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-ink/60">Price per SQM</span>
                        <span className="text-sm font-medium text-cream">{property.paymentSnapshot?.pricePerSqm || 'Available on request'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-navy-800/30 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-cream mb-6 border-b border-white/5 pb-4">Payment Plans</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-xl bg-navy-900/50 border border-white/5 hover:border-gold-400/30 transition-colors">
                          <span className="text-sm font-medium text-cream">12 Months</span>
                          <span className="text-sm text-gold-400 font-semibold">{property.monthly ? `${formatCurrency(property.priceValue / 12)}/mo` : 'Available on request'}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-navy-900/50 border border-white/5 hover:border-gold-400/30 transition-colors">
                          <span className="text-sm font-medium text-cream">24 Months</span>
                          <span className="text-sm text-gold-400 font-semibold">{property.monthly ? `${formatCurrency(property.priceValue / 24)}/mo` : 'Available on request'}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-navy-900/50 border border-white/5 hover:border-gold-400/30 transition-colors">
                          <span className="text-sm font-medium text-cream">36 Months</span>
                          <span className="text-sm text-gold-400 font-semibold">{property.monthly ? `${formatCurrency((property.priceValue * 1.1) / 36)}/mo` : 'Available on request'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-white/5">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="block text-xs text-ink/50 uppercase tracking-widest font-semibold mb-1">Mortgage Eligibility</span>
                          <span className="text-sm font-medium text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> {property.mortgageSupport ? 'Eligible' : 'Not Eligible'}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-ink/50 uppercase tracking-widest font-semibold mb-1 text-right">Est. Monthly</span>
                          <span className="text-lg font-bold text-cream">{property.monthly}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mortgage Calculator */}
                <MortgageCalculator property={property} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="relative">
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
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recentlyViewedProperties.map(p => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Contact Agent Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/90 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-navy-800 border border-white/10 p-6 md:p-8 relative shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <button 
              className="absolute top-6 right-6 text-ink/50 hover:text-cream transition-colors p-2 rounded-full hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
              onClick={() => { setContactModalOpen(false); setContactSuccess(false); }}
            >
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="font-heading text-2xl font-bold text-cream mb-2">Contact {property.agent.name}</h3>
            
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
              <button 
                onClick={() => navigate(ROUTES.AGENT_DETAILS.replace(':slug', agentNameToSlug(property.agent.name)))}
                className="shrink-0 transition-transform hover:scale-105 focus:outline-none"
              >
                <img src={property.agent.avatar} alt={property.agent.name} className="h-10 w-10 rounded-full object-cover border border-gold-400/30 hover:border-gold-400/80 transition-colors" />
              </button>
              <div>
                <button 
                  onClick={() => navigate(ROUTES.AGENT_DETAILS.replace(':slug', agentNameToSlug(property.agent.name)))}
                  className="text-sm font-semibold text-cream hover:text-gold-400 transition-colors focus:outline-none text-left block"
                >
                  {property.agent.name}
                </button>
                <button 
                  onClick={() => navigate(ROUTES.AGENCY_DETAILS.replace(':slug', agencyNameToSlug(property.agent.agency)))}
                  className="text-xs text-ink/50 hover:text-gold-300 transition-colors focus:outline-none text-left block w-full"
                >
                  {property.agent.agency}
                </button>
              </div>
            </div>

            {contactSuccess ? (
              <div className="text-center py-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400 mb-4">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold text-cream mb-2">Message Sent!</h4>
                <p className="text-ink/60 mb-8">The agent will be in touch within 24 hours.</p>
                <GhostButton className="w-full justify-center h-12" onClick={() => { setContactModalOpen(false); setContactSuccess(false); }}>Close</GhostButton>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <input type="text" placeholder="Your full name" required className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 px-4 text-sm text-cream placeholder-ink/50 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all shadow-inner" />
                </div>
                <div>
                  <input type="email" placeholder="your@email.com" required className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 px-4 text-sm text-cream placeholder-ink/50 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all shadow-inner" />
                </div>
                <div>
                  <input type="tel" placeholder="+234 800 000 0000" required className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 px-4 text-sm text-cream placeholder-ink/50 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all shadow-inner" />
                </div>
                <div>
                  <textarea rows={4} required defaultValue={`I am interested in ${property.title} and would like more information.`} className="w-full rounded-xl border border-white/10 bg-navy-900/50 py-3 px-4 text-sm text-cream placeholder-ink/50 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all shadow-inner resize-none"></textarea>
                </div>
                <div className="pt-2">
                  <GoldButton type="submit" className="w-full justify-center h-12 text-sm" disabled={contactLoading}>
                    {contactLoading ? 'Sending...' : 'Send Message'}
                  </GoldButton>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </PageLayout>
  );
}
