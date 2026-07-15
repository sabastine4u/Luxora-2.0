import type { Property } from '../types';

/**
 * Intelligent recommendation engine for Luxora 2.0 properties.
 * Scores properties based on similarity metrics to provide highly relevant recommendations.
 * 
 * Scoring System:
 * - Same Property Type: +50
 * - Same City/Area: +30
 * - Similar Price (±20%): +20
 * - Similar Bedrooms (Exact: +15, Difference of 1: +8)
 * - Same Verification Status: +10 per shared status
 * - Premium Property: +5
 * 
 * Fallback:
 * Sorts by score first, then by Premium status, then by highest value to ensure slots are always filled.
 */
export function getSimilarProperties(
  currentProperty: Property,
  allProperties: Property[],
  limit = 4
): Property[] {
  // Memoization is handled at the component level using useMemo, 
  // keeping this utility pure and focused on the algorithm.
  
  const getArea = (location: string) => location.split(',')[0].trim().toLowerCase();
  const currentArea = getArea(currentProperty.location);
  const minPrice = currentProperty.priceValue * 0.8;
  const maxPrice = currentProperty.priceValue * 1.2;

  const scoredProperties = allProperties
    .filter(p => p.id !== currentProperty.id)
    .map(property => {
      let score = 0;

      // Same Property Type
      if (property.type === currentProperty.type) {
        score += 50;
      }

      // Same City / Area
      if (getArea(property.location) === currentArea) {
        score += 30;
      }

      // Similar Price (Within ±20%)
      if (property.priceValue >= minPrice && property.priceValue <= maxPrice) {
        score += 20;
      }

      // Similar Bedrooms
      if (property.beds === currentProperty.beds) {
        score += 15;
      } else if (Math.abs(property.beds - currentProperty.beds) === 1) {
        score += 8;
      }

      // Same Verification Status (+10 per shared status)
      if (property.verified && currentProperty.verified) {
        const sharedStatuses = property.verified.filter(v => currentProperty.verified.includes(v));
        score += sharedStatuses.length * 10;
      }

      // Premium Property
      const isPremium = property.verified?.includes('Premium') || property.tag?.toLowerCase().includes('premium');
      if (isPremium) {
        score += 5;
      }

      return { property, score, isPremium };
    });

  // Sort by Score (desc), then Premium (desc), then PriceValue (desc)
  scoredProperties.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    
    // Fallback logic: Highest-value premium properties
    const aPremium = a.isPremium ? 1 : 0;
    const bPremium = b.isPremium ? 1 : 0;
    if (bPremium !== aPremium) {
      return bPremium - aPremium;
    }

    return b.property.priceValue - a.property.priceValue;
  });

  return scoredProperties.slice(0, limit).map(sp => sp.property);
}
