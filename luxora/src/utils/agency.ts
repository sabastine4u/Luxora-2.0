import { properties, agencies, agentPerformance } from '../data/luxoraData';
import type { Property } from '../types';
import type { Agent } from '../types';

/**
 * Slug Helpers
 */
export function agencyNameToSlug(name: string): string {
  if (!name) return '';
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export function agentNameToSlug(name: string): string {
  if (!name) return '';
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export function slugToAgencyName(slug: string): string | undefined {
  if (!slug) return undefined;
  // First check agencies array
  const agency = agencies.find(a => agencyNameToSlug(a.name) === slug);
  if (agency) return agency.name;
  
  // Fallback to properties
  const prop = properties.find(p => agencyNameToSlug(p.agent.agency) === slug);
  return prop?.agent.agency;
}

export function slugToAgentName(slug: string): string | undefined {
  if (!slug) return undefined;
  // First check agentPerformance
  const agent = agentPerformance.find(a => agentNameToSlug(a.name) === slug);
  if (agent) return agent.name;
  
  // Fallback to properties
  const prop = properties.find(p => agentNameToSlug(p.agent.name) === slug);
  return prop?.agent.name;
}

/**
 * Data Helpers
 */
export function getAgencyProperties(agencyName: string): Property[] {
  if (!agencyName) return [];
  return properties.filter(p => p.agent.agency === agencyName);
}

export function getAgencyAgents(agencyName: string): Agent[] {
  if (!agencyName) return [];
  const agencyProps = getAgencyProperties(agencyName);
  const agentsMap = new Map<string, Agent>();
  
  // Add from properties
  agencyProps.forEach(p => {
    if (!agentsMap.has(p.agent.name)) {
      agentsMap.set(p.agent.name, p.agent);
    }
  });

  // Supplement/override with data from agentPerformance if available
  agentPerformance.forEach(a => {
    if (a.agency === agencyName) {
      const existing = agentsMap.get(a.name);
      agentsMap.set(a.name, {
        ...existing,
        ...a
      });
    }
  });

  return Array.from(agentsMap.values());
}

export function getAgentProperties(agentName: string): Property[] {
  if (!agentName) return [];
  return properties.filter(p => p.agent.name === agentName);
}

export function getAgencyStats(agencyName: string) {
  if (!agencyName) return { listingCount: 0, agentCount: 0, featuredCount: 0, averageRating: 0, deals: 0 };
  
  const agencyProps = getAgencyProperties(agencyName);
  const agencyAgents = getAgencyAgents(agencyName);
  const agencyData = agencies.find(a => a.name === agencyName);
  
  return {
    listingCount: agencyData?.listings ?? agencyProps.length,
    agentCount: agencyAgents.length,
    featuredCount: agencyProps.filter(p => p.tag === 'Featured' || p.tag === 'Premium Verified').length,
    averageRating: agencyData?.rating ?? 0,
    deals: agencyData?.deals ?? 0
  };
}

export function getAgencyPortfolioStats(properties: Property[]) {
  if (!properties.length) {
    return { 
      avgPrice: 0, 
      portfolioValue: 0, 
      serviceAreas: [], 
      propertyCategories: [],
      propertyMix: [] as { type: string; count: number }[],
      primaryMarket: '',
      topMarkets: [] as { location: string; count: number }[],
      highestPrice: 0,
      lowestPrice: 0,
      highestValueProperty: null as Property | null,
      newestListing: null as Property | null,
      featuredCount: 0,
      premiumCount: 0,
      luxuryPercent: 0,
      commercialPercent: 0,
      residentialPercent: 0,
      landPercent: 0,
      shortLetPercent: 0,
      featuredProperties: [] as Property[],
      latestProperties: [] as Property[]
    };
  }
  
  let total = 0;
  let highestPrice = 0;
  let lowestPrice = Infinity;
  let highestValueProperty: Property | null = null;
  const newestListing = properties[properties.length - 1] || properties[0];

  const areaCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();

  let featuredCount = 0;
  let premiumCount = 0;
  let luxury = 0;
  let commercial = 0;
  let residential = 0;
  let land = 0;
  let shortLet = 0;

  const featuredProperties: Property[] = [];
  const latestProperties: Property[] = [];

  properties.forEach(p => {
    const num = p.priceValue || parseInt(p.price.replace(/[^\d]/g, ''), 10);
    if (!isNaN(num)) {
      total += num;
      if (num > highestPrice) {
        highestPrice = num;
        highestValueProperty = p;
      }
      if (num < lowestPrice) lowestPrice = num;
    }

    // Coverage Areas (Service Areas)
    const locationParts = p.location.split(',');
    const area = locationParts.length > 1 ? locationParts[locationParts.length - 1].trim() : p.location;
    areaCounts.set(area, (areaCounts.get(area) || 0) + 1);

    // Specific Markets (Top Markets) e.g., Ikoyi, Lekki
    const market = locationParts[0].trim();
    areaCounts.set(market, (areaCounts.get(market) || 0) + 1);

    // Property Categories
    categoryCounts.set(p.type, (categoryCounts.get(p.type) || 0) + 1);

    // Tags & Segmentation
    const tag = p.tag?.toLowerCase() || '';
    const isFeatured = tag.includes('feature') || tag.includes('premium') || tag.includes('luxury');
    
    if (isFeatured) {
      featuredProperties.push(p);
      if (tag.includes('feature')) featuredCount++;
      if (tag.includes('premium')) premiumCount++;
    } else {
      latestProperties.push(p);
    }

    // Mix %
    const type = p.type.toLowerCase();
    if (tag.includes('luxury')) luxury++;
    else if (type.includes('office') || type.includes('warehouse') || type.includes('commercial')) commercial++;
    else if (type.includes('land')) land++;
    else if (type.includes('short let') || type.includes('studio')) shortLet++;
    else residential++;
  });

  const sortedAreas = Array.from(areaCounts.entries()).sort((a, b) => b[1] - a[1]);
  const sortedCategories = Array.from(categoryCounts.entries()).sort((a, b) => b[1] - a[1]);

  return {
    portfolioValue: total,
    avgPrice: total / properties.length,
    serviceAreas: Array.from(new Set(properties.map(p => {
      const parts = p.location.split(',');
      return parts.length > 1 ? parts[parts.length - 1].trim() : p.location;
    }))),
    topMarkets: sortedAreas.slice(0, 4).map(a => ({ location: a[0], count: a[1] })),
    propertyCategories: Array.from(categoryCounts.keys()),
    propertyMix: sortedCategories.map(c => ({ type: c[0], count: c[1] })),
    primaryMarket: sortedAreas[0]?.[0] || '',
    highestPrice,
    lowestPrice: lowestPrice === Infinity ? 0 : lowestPrice,
    highestValueProperty,
    newestListing,
    featuredCount,
    premiumCount,
    luxuryPercent: Math.round((luxury / properties.length) * 100),
    commercialPercent: Math.round((commercial / properties.length) * 100),
    residentialPercent: Math.round((residential / properties.length) * 100),
    landPercent: Math.round((land / properties.length) * 100),
    shortLetPercent: Math.round((shortLet / properties.length) * 100),
    featuredProperties,
    latestProperties
  };
}
