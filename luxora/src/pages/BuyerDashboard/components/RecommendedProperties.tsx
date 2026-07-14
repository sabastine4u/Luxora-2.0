import { useMemo } from 'react';
import { properties } from '../../../data/luxoraData';
import { useSession } from '../../../contexts/SessionContext';
import { useFavorites } from '../../../contexts/FavoriteContext';
import { PropertyCard } from '../../../components/property/PropertyCard';
import { EmptyState } from '../../../components/layout';
import { ROUTES } from '../../../constants/routes';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function RecommendedProperties() {
  const { recentlyViewed } = useSession();
  const { favoriteProperties: savedProperties } = useFavorites();
  const navigate = useNavigate();

  const recommendedProps = useMemo(() => {
    // 1. Exclude saved and recently viewed
    const excludeIds = new Set([...savedProperties, ...recentlyViewed]);
    const candidates = properties.filter(p => !excludeIds.has(p.id));

    // Derive preferred location and category from saved and viewed properties
    // This mocks a recommendation engine based on user history
    const interactedIds = [...savedProperties, ...recentlyViewed];
    const interactedProps = interactedIds
      .map(id => properties.find(p => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);

    let preferredLocation = 'Lekki'; // fallback mock
    let preferredType = 'Villa';
    let minPrice = 0;
    let maxPrice = 1000; // in Millions

    if (interactedProps.length > 0) {
      // Find most frequent location
      const locations = interactedProps.map(p => p.location);
      preferredLocation = locations.sort((a,b) =>
        locations.filter(v => v===a).length - locations.filter(v => v===b).length
      ).pop() || 'Lekki';

      // Find most frequent type
      const types = interactedProps.map(p => p.type);
      preferredType = types.sort((a,b) =>
        types.filter(v => v===a).length - types.filter(v => v===b).length
      ).pop() || 'Villa';

      // Find price range
      const prices = interactedProps.map(p => p.priceValue);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      minPrice = avgPrice * 0.5;
      maxPrice = avgPrice * 1.5;
    }

    // Score properties
    const scored = candidates.map(p => {
      let score = 0;
      
      // 1. Same preferred location
      if (p.location.includes(preferredLocation)) score += 40;
      
      // 2. Same property category
      if (p.type === preferredType) score += 30;
      
      // 3. Similar price range
      if (p.priceValue >= minPrice && p.priceValue <= maxPrice) score += 20;
      
      // 4. Verified properties first
      if (p.verified.length > 0) score += 10;
      
      // 5. Highest rated properties (mocking rating using price as a minor tiebreaker)
      score += (p.priceValue % 10); 
      
      return { property: p, score };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // Return max 6 without duplicates
    const finalProps = [];
    const addedIds = new Set();
    for (const item of scored) {
      if (!addedIds.has(item.property.id)) {
        finalProps.push(item.property);
        addedIds.add(item.property.id);
        if (finalProps.length === 6) break;
      }
    }
    
    return finalProps;
  }, [savedProperties, recentlyViewed]);

  if (recommendedProps.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-navy-800/50 p-6 md:p-12">
        <EmptyState
          icon={<Sparkles className="h-12 w-12 text-gold-400" />}
          title="No recommendations available yet."
          description="Browse and save properties to get personalized recommendations."
          actionLabel="Browse Properties"
          onAction={() => navigate(ROUTES.PROPERTIES)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-2xl font-bold text-cream">Recommended For You</h2>
        <p className="text-sm text-ink/60">Properties selected based on your interests and activity.</p>
        <div className="mt-1 text-xs font-semibold text-gold-400">
          Showing {recommendedProps.length} recommendation{recommendedProps.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {recommendedProps.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
