import { properties, agencies, agentPerformance, type Property } from '../data/luxoraData';
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
