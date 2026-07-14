import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, MapPin, Mail, Building2, TrendingUp, Handshake, CalendarCheck, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { PageLayout, Container, Section, Breadcrumb } from '../../components/layout';
import { GoldButton, GhostButton, Reveal } from '../../components/ui/ui';
import { ReviewCard } from '../../components/common/ReviewCard';
import { PropertyGrid } from '../../components/property/PropertyGrid';
import { PropertyPagination } from '../../components/property/PropertyPagination';
import NotFoundPage from '../NotFound/NotFoundPage';
import { 
  slugToAgentName, 
  getAgentProperties, 
  agencyNameToSlug,
  getAgencyPortfolioStats
} from '../../utils/agency';
import { agentPerformance, reviews } from '../../data/luxoraData';
import { useSession } from '../../contexts/SessionContext';
import { ROUTES } from '../../constants/routes';

export default function AgentDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { openScheduleViewingModal } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const agentName = useMemo(() => slugToAgentName(slug || ''), [slug]);
  const agentData = useMemo(() => agentPerformance.find(a => a.name === agentName), [agentName]);
  const properties = useMemo(() => getAgentProperties(agentName || ''), [agentName]);

  // Derive missing data from properties if possible
  const agencyName = agentData?.agency || properties[0]?.agent.agency || 'Independent';
  const avatar = agentData?.avatar || properties[0]?.agent.avatar || '';

  // Derive Portfolio Stats from centralized utility
  const {
    avgPrice,
    portfolioValue,
    serviceAreas,
    propertyCategories,
    propertyMix,
    primaryMarket,
    topMarkets,
    highestPrice,
    highestValueProperty,
    featuredCount,
    premiumCount,
    featuredProperties,
    latestProperties
  } = useMemo(() => getAgencyPortfolioStats(properties), [properties]);

  const formatLargeNum = (num: number) => {
    if (num >= 1_000_000_000) return `₦${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `₦${(num / 1_000_000).toFixed(0)}M`;
    return `₦${num.toLocaleString()}`;
  };

  if (!agentName) {
    return <NotFoundPage />;
  }

  const paginatedProperties = latestProperties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(latestProperties.length / itemsPerPage);

  const agencySlug = agencyNameToSlug(agencyName);

  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 bg-navy-900 border-b border-white/5 overflow-hidden">
        <div className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-gold-500/5 blur-[120px] pointer-events-none" />
        
        <Container className="relative z-10">
          <Breadcrumb items={[
            { label: 'Home', href: ROUTES.HOME },
            { label: 'Agencies', href: ROUTES.AGENCIES },
            { label: agencyName, href: ROUTES.AGENCY_DETAILS.replace(':slug', agencySlug) },
            { label: agentName }
          ]} />
          
          <div className="mt-8 flex flex-col md:flex-row gap-10 items-start">
            {/* Agent Photo */}
            <div className="relative shrink-0">
              <img 
                src={avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256'} 
                alt={agentName} 
                className="h-40 w-40 rounded-3xl object-cover ring-1 ring-white/10 shadow-2xl" 
              />
              <div className="absolute -bottom-3 -right-3 flex items-center justify-center h-10 w-10 rounded-full bg-navy-900 ring-2 ring-emerald-500/20">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col items-start gap-1 mb-4">
                <h1 className="font-heading text-4xl sm:text-5xl font-bold text-cream tracking-tight flex items-center gap-3">
                  {agentName}
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="h-4 w-4" /> Verified
                  </div>
                </h1>
                <button 
                  onClick={() => navigate(ROUTES.AGENCY_DETAILS.replace(':slug', agencySlug))}
                  className="text-gold-400 hover:text-gold-300 font-medium transition-colors flex items-center gap-1.5 mt-1 focus:outline-none"
                >
                  <Building2 className="h-4 w-4" /> {agencyName}
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-ink/60 mb-8">
                <span className="flex items-center gap-2"><Star className="h-4 w-4 fill-gold-400 text-gold-400" /> 4.9 Rating</span>
                {serviceAreas.length > 0 && (
                  <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {serviceAreas.slice(0, 2).join(', ')}</span>
                )}
                {propertyMix.length > 0 && (
                  <span className="flex items-center gap-2"><Building2 className="h-4 w-4" /> {propertyMix[0].type} Specialist</span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                <GoldButton 
                  size="md" 
                  className="gap-2 w-full sm:w-auto justify-center"
                  onClick={() => window.location.href = 'tel:+2348000000000'}
                >
                  <Phone className="h-4 w-4" /> Call Agent
                </GoldButton>
                <GhostButton 
                  className="gap-2 w-full sm:w-auto justify-center"
                  onClick={() => window.open('https://wa.me/2348000000000', '_blank')}
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </GhostButton>
                <GhostButton 
                  className="gap-2 w-full sm:w-auto justify-center"
                  onClick={() => openScheduleViewingModal(properties[0]?.id || '')}
                >
                  <CalendarCheck className="h-4 w-4" /> Schedule Viewing
                </GhostButton>
                <GhostButton 
                  className="gap-2 w-full sm:w-auto justify-center"
                  onClick={() => window.location.href = `mailto:${agentName.toLowerCase().replace(' ', '.')}@luxora.com`}
                >
                  <Mail className="h-4 w-4" /> Email
                </GhostButton>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Section className="py-12 md:py-20 bg-navy-900 relative">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column: Biography, Stats, Specializations */}
            <div className="lg:col-span-1 space-y-10">
              
              {/* Biography */}
              <Reveal>
                <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                  <h3 className="font-heading text-xl font-bold text-cream mb-4">Biography</h3>
                  <p className="text-sm text-ink/70 leading-relaxed mb-6">
                    {agentName} is an elite real estate professional representing {agencyName}. 
                    Specializing primarily in {propertyMix[0]?.type || 'premium properties'} across {primaryMarket || 'top markets'}, {agentName.split(' ')[0]} currently manages a portfolio of {properties.length} active listings and has cultivated a reputation for unmatched client service and expert negotiation in the luxury sector.
                  </p>
                  
                  {/* Property Expertise */}
                  <div className="pt-6 border-t border-white/10 space-y-6">
                    {propertyCategories.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-cream uppercase tracking-wider mb-3">Property Expertise</h4>
                        <div className="flex flex-wrap gap-2">
                          {propertyCategories.map(cat => (
                            <span key={cat} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gold-400/5 border border-gold-400/20 text-xs text-gold-300">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Markets Covered */}
                    {serviceAreas.length > 0 && (
                      <div className="pt-2">
                        <h4 className="text-xs font-semibold text-cream uppercase tracking-wider mb-3">Markets Covered</h4>
                        <div className="flex flex-wrap gap-2">
                          {serviceAreas.map(area => (
                            <span key={area} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-ink/70">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>

              {/* Stats & Performance Metrics */}
              <Reveal delay={100}>
                <h3 className="font-heading text-xl font-bold text-cream mb-6">Performance Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
                    <Building2 className="h-5 w-5 text-gold-400 mb-3" />
                    <div className="text-2xl font-heading font-bold text-cream">{properties.length}</div>
                    <div className="text-xs text-ink/50 mt-1 uppercase tracking-wider">Active Listings</div>
                  </div>
                  <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
                    <Handshake className="h-5 w-5 text-blue-400 mb-3" />
                    <div className="text-2xl font-heading font-bold text-cream">{agentData?.deals ?? 0}</div>
                    <div className="text-xs text-ink/50 mt-1 uppercase tracking-wider">Deals Closed</div>
                  </div>
                  <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
                    <TrendingUp className="h-5 w-5 text-emerald-400 mb-3" />
                    <div className="text-2xl font-heading font-bold text-cream">{agentData?.value ?? formatLargeNum(portfolioValue)}</div>
                    <div className="text-xs text-ink/50 mt-1 uppercase tracking-wider">Sales Volume</div>
                  </div>
                  <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
                    <Star className="h-5 w-5 text-gold-400 mb-3" />
                    <div className="text-2xl font-heading font-bold text-cream">{formatLargeNum(avgPrice)}</div>
                    <div className="text-xs text-ink/50 mt-1 uppercase tracking-wider">Average Price</div>
                  </div>
                  <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
                    <MapPin className="h-5 w-5 text-rose-400 mb-3" />
                    <div className="text-2xl font-heading font-bold text-cream">{topMarkets.length}</div>
                    <div className="text-xs text-ink/50 mt-1 uppercase tracking-wider">Active Markets</div>
                  </div>
                  <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
                    <ArrowRight className="h-5 w-5 text-emerald-400 mb-3" />
                    <div className="text-2xl font-heading font-bold text-emerald-400">{formatLargeNum(highestPrice)}</div>
                    <div className="text-xs text-ink/50 mt-1 uppercase tracking-wider">Highest Listing</div>
                  </div>
                </div>
              </Reveal>

              {/* View Agency CTA */}
              <Reveal delay={200}>
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-navy-800 to-navy-900 p-6 md:p-8 text-center flex flex-col items-center">
                  <Building2 className="h-10 w-10 text-gold-400/50 mb-4" />
                  <h3 className="font-heading text-lg font-bold text-cream mb-2">Representing {agencyName}</h3>
                  <p className="text-sm text-ink/60 mb-6 leading-relaxed">View the entire luxury portfolio and meet the rest of the team.</p>
                  <button 
                    onClick={() => navigate(ROUTES.AGENCY_DETAILS.replace(':slug', agencySlug))}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 px-6 py-2.5 text-sm font-semibold text-cream transition-all hover:bg-white/10 hover:border-white/20 focus:outline-none"
                  >
                    View Agency Profile <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </Reveal>

              {/* Client Reviews */}
              <Reveal delay={300}>
                <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8 mt-10">
                  <h3 className="font-heading text-xl font-bold text-cream mb-6">Client Reviews</h3>
                  
                  {/* Reviews Summary */}
                  <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-white/10">
                    <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl flex-1 border border-white/5">
                      <div className="flex items-center gap-1.5 text-gold-400 font-bold text-xl mb-1">
                        <Star className="h-5 w-5 fill-gold-400" /> 4.9
                      </div>
                      <span className="text-xs text-ink/50 uppercase tracking-wider">Overall Rating</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl flex-1 border border-white/5">
                      <div className="text-emerald-400 font-bold text-xl mb-1 flex items-center gap-1">
                        100%
                      </div>
                      <span className="text-xs text-ink/50 uppercase tracking-wider">Response Rate</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl flex-1 border border-white/5">
                      <div className="text-blue-400 font-bold text-xl mb-1 flex items-center gap-1">
                        98%
                      </div>
                      <span className="text-xs text-ink/50 uppercase tracking-wider">Recommendation</span>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.slice(0, 2).map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                  <button className="mt-6 w-full py-3 rounded-xl border border-white/10 text-sm font-medium text-cream hover:bg-white/5 transition-colors">
                    View All Reviews
                  </button>
                </div>
              </Reveal>

            </div>

            {/* Right Column: Listings */}
            <div className="lg:col-span-2 space-y-12">

              {/* NEW SECTION: Professional Highlights */}
              {properties.length > 0 && (
                <Reveal delay={50}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-ink/50 uppercase tracking-wider">Highest Value</span>
                        <Star className="h-4 w-4 text-gold-400" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-cream truncate">{highestValueProperty?.title || 'N/A'}</div>
                        <div className="text-sm font-medium text-emerald-400 mt-1">{formatLargeNum(highestPrice)}</div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-ink/50 uppercase tracking-wider">Featured</span>
                        <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-cream">{featuredCount}</div>
                        <div className="text-xs text-ink/50 mt-1">Highlighted Properties</div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-ink/50 uppercase tracking-wider">Premium</span>
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-cream">{premiumCount}</div>
                        <div className="text-xs text-ink/50 mt-1">Verified Premium</div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-ink/50 uppercase tracking-wider">Expertise</span>
                        <Building2 className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-cream truncate">{propertyMix[0]?.type || 'N/A'}</div>
                        <div className="text-xs text-ink/50 mt-1">Primary Type</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )}
              
              {/* Featured Listings */}
              {featuredProperties.length > 0 && (
                <Reveal delay={100}>
                  <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                    <h2 className="font-heading text-2xl font-bold text-cream">Featured Properties</h2>
                    <span className="text-sm font-medium text-gold-400 bg-gold-400/10 px-3 py-1 rounded-full">
                      {featuredProperties.length} Properties
                    </span>
                  </div>
                  <PropertyGrid properties={featuredProperties} gridClassName="grid gap-6 sm:grid-cols-2" />
                </Reveal>
              )}

              {/* Latest Listings */}
              <Reveal delay={200}>
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                  <h2 className="font-heading text-2xl font-bold text-cream">Recent Listings</h2>
                  <span className="text-sm font-medium text-ink/50">
                    Showing {paginatedProperties.length} of {latestProperties.length}
                  </span>
                </div>

                {latestProperties.length > 0 ? (
                  <PropertyGrid properties={paginatedProperties} gridClassName="grid gap-6 sm:grid-cols-2">
                    {totalPages > 1 && (
                      <PropertyPagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    )}
                  </PropertyGrid>
                ) : (
                  <div className="text-center py-12 rounded-3xl border border-white/10 bg-navy-800/30">
                    <Building2 className="h-12 w-12 text-white/10 mx-auto mb-4" />
                    <p className="text-cream font-medium">No additional listings</p>
                    <p className="text-sm text-ink/50 mt-1">Check back later for new properties.</p>
                  </div>
                )}
              </Reveal>

            </div>

          </div>
        </Container>
      </Section>
    </PageLayout>
  );
}
