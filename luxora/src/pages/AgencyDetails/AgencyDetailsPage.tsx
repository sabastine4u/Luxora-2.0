import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Star, ShieldCheck, Phone, Mail, Globe, Building2, TrendingUp, Users, Award, Briefcase, MessageCircle, CheckCircle2, Navigation, ArrowUpRight, ArrowDownRight, Crown, LayoutGrid, Calendar } from 'lucide-react';
import { PageLayout, Container, Section, Breadcrumb } from '../../components/layout';
import { GoldButton, GhostButton, Reveal } from '../../components/ui/ui';
import { AgentCard } from '../../components/agent/AgentCard';
import { ReviewCard } from '../../components/common/ReviewCard';
import { PropertyGrid } from '../../components/property/PropertyGrid';
import { PropertyPagination } from '../../components/property/PropertyPagination';
import NotFoundPage from '../NotFound/NotFoundPage';
import { 
  slugToAgencyName, 
  getAgencyStats, 
  getAgencyAgents, 
  getAgencyProperties,
  getAgencyPortfolioStats
} from '../../utils/agency';
import { agencies, reviews } from '../../data/luxoraData';
import { ROUTES } from '../../constants/routes';

export default function AgencyDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const agencyName = useMemo(() => slugToAgencyName(slug || ''), [slug]);
  const agencyData = useMemo(() => agencies.find(a => a.name === agencyName), [agencyName]);
  
  const properties = useMemo(() => getAgencyProperties(agencyName || ''), [agencyName]);
  const agents = useMemo(() => getAgencyAgents(agencyName || ''), [agencyName]);
  const stats = useMemo(() => getAgencyStats(agencyName || ''), [agencyName]);

  // Derived Portfolio Stats from getAgencyPortfolioStats
  const { 
    avgPrice, 
    portfolioValue, 
    serviceAreas, 
    propertyCategories,
    propertyMix,
    primaryMarket,
    topMarkets,
    highestPrice,
    lowestPrice,
    highestValueProperty,
    newestListing,
    featuredCount,
    premiumCount,
    luxuryPercent,
    commercialPercent,
    residentialPercent,
    landPercent,
    shortLetPercent,
    featuredProperties,
    latestProperties
  } = useMemo(() => getAgencyPortfolioStats(properties), [properties]);

  const formatLargeNum = (num: number) => {
    if (num >= 1_000_000_000) return `₦${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `₦${(num / 1_000_000).toFixed(0)}M`;
    return `₦${num.toLocaleString()}`;
  };

  if (!agencyName || !agencyData) {
    return <NotFoundPage />;
  }

  const paginatedProperties = latestProperties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(latestProperties.length / itemsPerPage);

  const coverImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000';

  return (
    <PageLayout>
      {/* Agency Hero */}
      <div className="relative bg-navy-900 border-b border-white/5 pb-12 pt-32">
        <div className="absolute inset-0 top-0 h-80 w-full z-0">
          <img src={coverImage} alt={`${agencyName} Headquarters`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/60 via-navy-900/80 to-navy-900" />
        </div>

        <Container className="relative z-10 pt-10">
          <Breadcrumb items={[
            { label: 'Home', href: ROUTES.HOME },
            { label: 'Agencies', href: ROUTES.AGENCIES },
            { label: agencyName }
          ]} />
          
          <div className="mt-8 flex flex-col md:flex-row gap-8 items-start md:items-end">
            <div className={`flex shrink-0 h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br ${agencyData.color} text-5xl font-bold text-white shadow-2xl ring-4 ring-navy-900`}>
              {agencyData.logo}
            </div>

            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="font-heading text-4xl sm:text-5xl font-bold text-cream tracking-tight">
                  {agencyName}
                </h1>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verified Firm
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-ink/60">
                <span className="flex items-center gap-2 text-gold-400 font-medium">
                  <Star className="h-4 w-4 fill-gold-400" /> {stats.averageRating} Rating
                </span>
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {serviceAreas.join(', ') || 'Nationwide'}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto pb-2">
              <GoldButton 
                size="md" 
                className="gap-2 w-full sm:w-auto justify-center"
                onClick={() => window.location.href = 'tel:+2348000000000'}
              >
                <Phone className="h-4 w-4" /> Call Agency
              </GoldButton>
              <GhostButton 
                className="gap-2 w-full sm:w-auto justify-center"
                onClick={() => window.location.href = 'mailto:hello@agency.com'}
              >
                <Mail className="h-4 w-4" /> Email Agency
              </GhostButton>
              <GhostButton 
                className="gap-2 w-full sm:w-auto justify-center"
                onClick={() => window.open('https://wa.me/2348000000000', '_blank')}
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </GhostButton>
              <GhostButton 
                className="gap-2 w-full sm:w-auto justify-center"
                onClick={() => alert(`Visiting ${agencyName} office at ${serviceAreas[0] || 'Lagos'}`)}
              >
                <MapPin className="h-4 w-4" /> Visit Office
              </GhostButton>
            </div>
          </div>
        </Container>
      </div>

      <Section className="py-12 md:py-20 bg-navy-900 relative">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-10">
              
              {/* Trust Signals */}
              <Reveal>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <ShieldCheck className="h-6 w-6 text-emerald-400 mb-2" />
                    <span className="text-sm font-bold text-cream">Verified Agency</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <Star className="h-6 w-6 text-gold-400 mb-2" />
                    <span className="text-sm font-bold text-cream">{stats.averageRating} Rating</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <Award className="h-6 w-6 text-blue-400 mb-2" />
                    <span className="text-sm font-bold text-cream">{featuredProperties.length} Premium</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <Users className="h-6 w-6 text-rose-400 mb-2" />
                    <span className="text-sm font-bold text-cream">{stats.agentCount} Agents</span>
                  </div>
                </div>
              </Reveal>

              {/* Company Overview */}
              <Reveal delay={100}>
                <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                  <h3 className="font-heading text-xl font-bold text-cream mb-4">Company Overview</h3>
                  <p className="text-sm text-ink/70 leading-relaxed mb-6">
                    {agencyName} is a premier real estate brokerage specializing in luxury properties and high-end investments. 
                    Our team delivers unparalleled service, connecting discerning clients with extraordinary homes.
                  </p>
                  
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-ink/50">Primary Market</span>
                      <span className="font-medium text-cream">{primaryMarket || 'Nationwide'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-ink/50">Portfolio Size</span>
                      <span className="font-medium text-cream">{properties.length} Active Listings</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-ink/50">Average Price</span>
                      <span className="font-medium text-cream">{formatLargeNum(avgPrice)}</span>
                    </div>
                  </div>

                  {/* Coverage Areas */}
                  <div className="pt-6 mt-6 border-t border-white/10">
                    <h4 className="text-xs font-semibold text-cream uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Navigation className="h-3.5 w-3.5 text-gold-400" /> Coverage Areas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {serviceAreas.map(area => (
                        <span key={area} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-ink/70">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Property Categories */}
                  <div className="pt-6 mt-6 border-t border-white/10">
                    <h4 className="text-xs font-semibold text-cream uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-gold-400" /> Property Categories
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {propertyCategories.map(cat => (
                        <span key={cat} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gold-400/5 border border-gold-400/20 text-xs text-gold-300">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* NEW SECTION: Agency Strengths */}
              {propertyMix.length > 0 && (
                <Reveal delay={150}>
                  <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                    <h3 className="font-heading text-xl font-bold text-cream mb-4">Agency Strengths</h3>
                    <div className="space-y-4">
                      {propertyMix.map((mix) => (
                        <div key={mix.type} className="flex items-center justify-between">
                          <span className="text-sm text-ink/70">{mix.type}</span>
                          <div className="flex items-center gap-3">
                            <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${agencyData.color}`} 
                                style={{ width: `${Math.max(10, (mix.count / properties.length) * 100)}%` }} 
                              />
                            </div>
                            <span className="text-xs font-medium text-cream w-6 text-right">{mix.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}

              {/* NEW SECTION: Top Markets */}
              {topMarkets.length > 0 && (
                <Reveal delay={200}>
                  <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                    <h3 className="font-heading text-xl font-bold text-cream mb-4">Top Markets</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {topMarkets.map((market) => (
                        <div key={market.location} className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col">
                          <span className="text-sm font-bold text-cream truncate">{market.location}</span>
                          <span className="text-xs text-ink/50">{market.count} Listings</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}

              {/* Business Information */}
              <Reveal delay={250}>
                <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                  <h3 className="font-heading text-xl font-bold text-cream mb-4">Business Information</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-3 text-ink/70">
                      <Globe className="h-4 w-4 text-white/40 shrink-0" />
                      <a href="#" className="hover:text-gold-400 transition-colors">{agencyName.toLowerCase().replace(/\s+/g, '')}.com</a>
                    </div>
                    <div className="flex items-center gap-3 text-ink/70">
                      <Phone className="h-4 w-4 text-white/40 shrink-0" />
                      <span>+234 800 000 0000</span>
                    </div>
                    <div className="flex items-center gap-3 text-ink/70">
                      <Mail className="h-4 w-4 text-white/40 shrink-0" />
                      <span>hello@{agencyName.toLowerCase().replace(/\s+/g, '')}.com</span>
                    </div>
                    <div className="flex items-start gap-3 text-ink/70">
                      <MapPin className="h-4 w-4 text-white/40 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-cream font-medium mb-1">Service Coverage</div>
                        <div className="leading-relaxed">{serviceAreas.join(', ')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Agency Statistics */}
              <Reveal delay={300}>
                <h3 className="font-heading text-xl font-bold text-cream mb-6">Agency Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
                    <Building2 className="h-5 w-5 text-gold-400 mb-3" />
                    <div className="text-2xl font-heading font-bold text-cream">{properties.length}</div>
                    <div className="text-xs text-ink/50 mt-1 uppercase tracking-wider">Active Listings</div>
                  </div>
                  <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
                    <Briefcase className="h-5 w-5 text-blue-400 mb-3" />
                    <div className="text-2xl font-heading font-bold text-cream">{stats.deals}</div>
                    <div className="text-xs text-ink/50 mt-1 uppercase tracking-wider">Sold Properties</div>
                  </div>
                  <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
                    <TrendingUp className="h-5 w-5 text-emerald-400 mb-3" />
                    <div className="text-2xl font-heading font-bold text-cream">{formatLargeNum(portfolioValue)}</div>
                    <div className="text-xs text-ink/50 mt-1 uppercase tracking-wider">Portfolio Value</div>
                  </div>
                  <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
                    <Star className="h-5 w-5 text-gold-400 mb-3" />
                    <div className="text-2xl font-heading font-bold text-cream">{formatLargeNum(avgPrice)}</div>
                    <div className="text-xs text-ink/50 mt-1 uppercase tracking-wider">Average Price</div>
                  </div>
                  <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
                    <MapPin className="h-5 w-5 text-rose-400 mb-3" />
                    <div className="text-2xl font-heading font-bold text-cream">{serviceAreas.length}</div>
                    <div className="text-xs text-ink/50 mt-1 uppercase tracking-wider">Cities Covered</div>
                  </div>
                  <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 mb-3" />
                    <div className="text-2xl font-heading font-bold text-cream">{propertyCategories.length}</div>
                    <div className="text-xs text-ink/50 mt-1 uppercase tracking-wider">Categories</div>
                  </div>
                </div>
              </Reveal>

              {/* Meet Our Agents */}
              <Reveal delay={400}>
                <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-heading text-xl font-bold text-cream">Our Team</h3>
                    <Award className="h-5 w-5 text-gold-400" />
                  </div>
                  <div className="flex flex-col gap-4">
                    {agents.map((agent, i) => (
                      <AgentCard key={agent.name} agent={agent} index={i} />
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Agency Reviews */}
              <Reveal delay={500}>
                <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8 mt-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-heading text-xl font-bold text-cream">Agency Reviews</h3>
                    <div className="flex items-center gap-1.5 text-gold-400 font-bold bg-gold-400/10 px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-gold-400" /> {stats.averageRating}
                    </div>
                  </div>
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

            {/* Right Column: Property Portfolio Showcase */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* SECTION 5: Portfolio Highlights */}
              {properties.length > 0 && (
                <Reveal delay={100}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-ink/50 uppercase tracking-wider">Highest Value</span>
                        <Crown className="h-4 w-4 text-gold-400" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-cream truncate">{highestValueProperty?.title || 'N/A'}</div>
                        <div className="text-sm font-medium text-emerald-400 mt-1">{formatLargeNum(highestPrice)}</div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-ink/50 uppercase tracking-wider">Newest Listing</span>
                        <Calendar className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-cream truncate">{newestListing?.title || 'N/A'}</div>
                        <div className="text-sm font-medium text-gold-400 mt-1">{newestListing?.price || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-navy-800/50 p-5 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-ink/50 uppercase tracking-wider">Featured</span>
                        <Star className="h-4 w-4 text-gold-400" />
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
                  </div>
                </Reveal>
              )}

              {/* SECTION 3: Market Intelligence */}
              <Reveal delay={150}>
                <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                  <h3 className="font-heading text-xl font-bold text-cream mb-6 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-gold-400" /> Market Intelligence
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-sm text-ink/50 mb-1">Average Listing Price</div>
                      <div className="text-xl font-bold text-cream">{formatLargeNum(avgPrice)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-ink/50 mb-1 flex items-center gap-1"><ArrowUpRight className="h-3 w-3 text-emerald-400" /> Highest Price</div>
                      <div className="text-xl font-bold text-emerald-400">{formatLargeNum(highestPrice)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-ink/50 mb-1 flex items-center gap-1"><ArrowDownRight className="h-3 w-3 text-rose-400" /> Lowest Price</div>
                      <div className="text-xl font-bold text-rose-400">{formatLargeNum(lowestPrice)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-ink/50 mb-1">Most Common Type</div>
                      <div className="text-lg font-bold text-cream">{propertyMix[0]?.type || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-ink/50 mb-1">Most Active Market</div>
                      <div className="text-lg font-bold text-cream">{primaryMarket || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-ink/50 mb-1">Coverage Spread</div>
                      <div className="text-lg font-bold text-cream">{serviceAreas.length} Cities, {propertyCategories.length} Types</div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* SECTION 4: Investment Snapshot */}
              <Reveal delay={200}>
                <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-8">
                  <h3 className="font-heading text-xl font-bold text-cream mb-6 flex items-center gap-2">
                    <LayoutGrid className="h-5 w-5 text-emerald-400" /> Investment Snapshot
                  </h3>
                  <div className="space-y-5">
                    {[
                      { label: 'Luxury Listings', percent: luxuryPercent, color: 'bg-gold-400' },
                      { label: 'Residential', percent: residentialPercent, color: 'bg-blue-400' },
                      { label: 'Commercial', percent: commercialPercent, color: 'bg-emerald-400' },
                      { label: 'Land', percent: landPercent, color: 'bg-amber-600' },
                      { label: 'Short Let', percent: shortLetPercent, color: 'bg-purple-400' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-4">
                        <span className="text-sm font-medium text-ink/70 w-28 shrink-0">{item.label}</span>
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden flex">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                        </div>
                        <span className="text-sm font-bold text-cream w-12 text-right">{item.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* SECTION 1: Featured Collection */}
              {featuredProperties.length > 0 && (
                <Reveal delay={250}>
                  <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                    <h2 className="font-heading text-2xl font-bold text-cream">Featured Collection</h2>
                    <span className="text-sm font-medium text-gold-400 bg-gold-400/10 px-3 py-1 rounded-full">
                      {featuredProperties.length} Premium
                    </span>
                  </div>
                  <PropertyGrid properties={featuredProperties} />
                </Reveal>
              )}

              {/* SECTION 2: Latest Listings */}
              <Reveal delay={300}>
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                  <h2 className="font-heading text-2xl font-bold text-cream">Latest Listings</h2>
                  <span className="text-sm font-medium text-ink/50">
                    Showing {paginatedProperties.length} of {latestProperties.length}
                  </span>
                </div>

                {latestProperties.length > 0 ? (
                  <PropertyGrid properties={paginatedProperties}>
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
