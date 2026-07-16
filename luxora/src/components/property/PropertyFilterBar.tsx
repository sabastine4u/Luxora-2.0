import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, ChevronDown, SlidersHorizontal, MapPin, Home, History, Loader2 } from 'lucide-react';
import { useRecentSearches, type SearchState } from '../../hooks/useRecentSearches';
import { propertyTypes, locations, budgets } from '../../data/uiData';
import { AdvancedFilterPanel } from './AdvancedFilterPanel';

interface PropertyFilterBarProps {
  search: string;
  setSearch: (s: string) => void;
  listingType?: string;
  setListingType?: (t: string) => void;
  type: string;
  setType: (t: string) => void;
  location: string;
  setLocation: (l: string) => void;
  budget: string;
  setBudget: (b: string) => void;
  
  // Advanced filters
  status?: string;
  setStatus?: (v: string) => void;
  listingTier?: string;
  setListingTier?: (v: string) => void;
  furnishing?: string;
  setFurnishing?: (v: string) => void;
  availability?: string;
  setAvailability?: (v: string) => void;
  paymentPlan?: string[];
  setPaymentPlan?: (v: string[]) => void;
  amenities?: string[];
  setAmenities?: (v: string[]) => void;
  mortgageSupport?: boolean;
  setMortgageSupport?: (v: boolean) => void;
  verificationLevel?: string;
  setVerificationLevel?: (v: string) => void;
  minArea?: number;
  setMinArea?: (v: number) => void;
  maxArea?: number;
  setMaxArea?: (v: number) => void;
  beds?: string;
  setBeds?: (v: string) => void;
  baths?: string;
  setBaths?: (v: string) => void;

  children?: React.ReactNode;
}

export function PropertyFilterBar(props: PropertyFilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Debounced search
  const [localSearch, setLocalSearch] = useState(props.search);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Intelligent Search State
  const { recentSearches, addSearch, clearSearches } = useRecentSearches();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalSearch(props.search);
  }, [props.search]);

  const { setSearch } = props;

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    setIsSearching(true);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      setSearch(val);
      setIsSearching(false);
    }, 500);
  }, [setSearch]);

  const handleSelectSuggestion = (type: 'location' | 'propertyType' | 'keyword', val: string) => {
    if (type === 'location') props.setLocation(val);
    else if (type === 'propertyType') props.setType(val);
    else {
      setLocalSearch(val);
      setSearch(val);
    }
    setIsSearchFocused(false);
    
    addSearch({
      keyword: type === 'keyword' ? val : localSearch,
      location: type === 'location' ? val : props.location,
      propertyType: type === 'propertyType' ? val : props.type,
      listingType: props.listingType || 'buy',
      budget: props.budget
    });
  };

  const handleSelectRecent = (state: SearchState) => {
    setLocalSearch(state.keyword);
    setSearch(state.keyword);
    props.setLocation(state.location);
    props.setType(state.propertyType);
    if (props.setListingType) props.setListingType(state.listingType);
    props.setBudget(state.budget);
    setIsSearchFocused(false);
    addSearch(state);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchFocused(false);
    } else if (e.key === 'Enter' && localSearch.trim()) {
      handleSelectSuggestion('keyword', localSearch);
    }
  };

  useEffect(() => {
    function handleClickOutsideSearch(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    if (isSearchFocused) {
      document.addEventListener('mousedown', handleClickOutsideSearch);
    }
    return () => document.removeEventListener('mousedown', handleClickOutsideSearch);
  }, [isSearchFocused]);

  const suggestedLocations = locations.filter(l => l !== 'Any Location' && l.toLowerCase().includes(localSearch.toLowerCase())).slice(0, 3);
  const suggestedTypes = propertyTypes.filter(t => t !== 'Any Type' && t.toLowerCase().includes(localSearch.toLowerCase())).slice(0, 3);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowAdvanced(false);
      }
    }
    if (showAdvanced) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAdvanced]);

  // Determine if any advanced filters are active
  const hasActiveAdvancedFilters = 
    (props.status && props.status !== 'Any') ||
    (props.amenities && props.amenities.length > 0) ||
    props.mortgageSupport ||
    (props.verificationLevel && props.verificationLevel !== 'Any') ||
    (props.minArea !== undefined && props.minArea > 0) ||
    (props.maxArea !== undefined && props.maxArea < 10000) ||
    (props.beds && props.beds !== 'Any') ||
    (props.baths && props.baths !== 'Any') ||
    (props.listingTier && props.listingTier !== 'Any') ||
    (props.furnishing && props.furnishing !== 'Any') ||
    (props.availability && props.availability !== 'Any') ||
    (props.paymentPlan && props.paymentPlan.length > 0);

  return (
    <div className="relative mb-10 rounded-2xl border border-white/10 bg-navy-800/50 p-4 backdrop-blur-md md:p-6 md:sticky md:top-24 md:z-40" ref={panelRef}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1" ref={searchContainerRef}>
          <div className={`relative flex items-center w-full rounded-xl border bg-navy-900/50 transition-all duration-300 ${isSearchFocused ? 'border-gold-400/50 ring-1 ring-gold-400/50 shadow-[0_0_15px_rgba(212,175,55,0.15)]' : 'border-white/10'}`}>
            <Search className={`absolute left-4 h-5 w-5 transition-colors duration-300 ${isSearchFocused ? 'text-gold-400' : 'text-ink/50'}`} />
            <input
              type="text"
              placeholder="Search properties or locations..."
              value={localSearch}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent py-3.5 pl-12 pr-10 text-sm text-cream placeholder-ink/50 focus:outline-none"
              aria-label="Search properties"
            />
            {isSearching && (
              <Loader2 className="absolute right-4 h-4 w-4 animate-spin text-gold-400" />
            )}
          </div>

          {/* Intelligent Dropdown */}
          {isSearchFocused && (
            <div className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-2xl border border-white/10 bg-navy-900/95 backdrop-blur-xl shadow-2xl animate-fade-in-up">
              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                
                {/* Recent Searches */}
                {!localSearch && recentSearches.length > 0 && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between px-3 py-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-ink/50">Recent Searches</h4>
                      <button onClick={clearSearches} className="text-xs text-gold-400 hover:text-gold-300 transition-colors">Clear</button>
                    </div>
                    {recentSearches.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectRecent(s)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/5 focus:bg-white/5 focus:outline-none"
                      >
                        <History className="h-4 w-4 text-ink/50" />
                        <div className="flex-1 truncate">
                          <span className="text-sm font-medium text-cream">{s.keyword || 'All Properties'}</span>
                          <span className="ml-2 text-xs text-ink/50">
                            {s.listingType.charAt(0).toUpperCase() + s.listingType.slice(1)} • {s.location} • {s.propertyType}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Suggestions */}
                {(localSearch || recentSearches.length === 0) && (
                  <div className="space-y-4 py-2">
                    {localSearch && (
                      <button
                        onClick={() => handleSelectSuggestion('keyword', localSearch)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/5 focus:bg-white/5 focus:outline-none"
                      >
                        <Search className="h-4 w-4 text-gold-400" />
                        <span className="text-sm text-cream">Search for "{localSearch}"</span>
                      </button>
                    )}

                    {suggestedLocations.length > 0 && (
                      <div>
                        <h4 className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-ink/50">Locations</h4>
                        {suggestedLocations.map(l => (
                          <button
                            key={l}
                            onClick={() => handleSelectSuggestion('location', l)}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/5 focus:bg-white/5 focus:outline-none"
                          >
                            <MapPin className="h-4 w-4 text-ink/50" />
                            <span className="text-sm text-cream">{l}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {suggestedTypes.length > 0 && (
                      <div>
                        <h4 className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-ink/50">Property Types</h4>
                        {suggestedTypes.map(t => (
                          <button
                            key={t}
                            onClick={() => handleSelectSuggestion('propertyType', t)}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/5 focus:bg-white/5 focus:outline-none"
                          >
                            <Home className="h-4 w-4 text-ink/50" />
                            <span className="text-sm text-cream">{t}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {suggestedLocations.length === 0 && suggestedTypes.length === 0 && localSearch && (
                       <div className="px-3 py-4 text-center text-sm text-ink/50">
                         No specific suggestions found. Press Enter to search everywhere.
                       </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dropdowns & Actions */}
        <div className="grid grid-cols-2 gap-4 lg:flex md:w-auto">
          {/* Intent */}
          {props.listingType !== undefined && props.setListingType && (
            <div className="relative col-span-2 lg:col-span-1">
              <select
                value={props.listingType}
                onChange={(e) => props.setListingType!(e.target.value)}
                className="w-full appearance-none rounded-xl border border-white/10 bg-navy-900/50 py-3.5 pl-4 pr-10 text-sm text-cream focus:border-gold-400/50 focus:outline-none lg:w-32"
              >
                <option value="Any">Any Intent</option>
                <option value="buy">Buy</option>
                <option value="rent">Rent</option>
                <option value="lease">Lease</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
            </div>
          )}
          {/* Type */}
          <div className="relative">
            <select
              value={props.type}
              onChange={(e) => props.setType(e.target.value)}
              className="w-full appearance-none rounded-xl border border-white/10 bg-navy-900/50 py-3.5 pl-4 pr-10 text-sm text-cream focus:border-gold-400/50 focus:outline-none md:w-36"
            >
              {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
          </div>

          {/* Location */}
          <div className="relative">
            <select
              value={props.location}
              onChange={(e) => props.setLocation(e.target.value)}
              className="w-full appearance-none rounded-xl border border-white/10 bg-navy-900/50 py-3.5 pl-4 pr-10 text-sm text-cream focus:border-gold-400/50 focus:outline-none md:w-36"
            >
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
          </div>

          {/* Budget */}
          <div className="relative col-span-2 md:col-span-1">
            <select
              value={props.budget}
              onChange={(e) => props.setBudget(e.target.value)}
              className="w-full appearance-none rounded-xl border border-white/10 bg-navy-900/50 py-3.5 pl-4 pr-10 text-sm text-cream focus:border-gold-400/50 focus:outline-none md:w-44"
            >
              {budgets.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
          </div>

          {/* More Filters Toggle */}
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`col-span-2 flex items-center justify-center gap-2 rounded-xl border py-3.5 px-4 text-sm font-medium transition-colors md:col-span-1 ${
              showAdvanced || hasActiveAdvancedFilters 
                ? 'border-gold-400 bg-gold-400/10 text-gold-400' 
                : 'border-white/10 bg-navy-900/50 text-cream hover:bg-white/5'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden lg:inline">More Filters</span>
            <span className="lg:hidden">Filters</span>
            {hasActiveAdvancedFilters && (
              <span className="ml-1 flex h-2 w-2 rounded-full bg-gold-400"></span>
            )}
          </button>
        </div>
      </div>
      
      {/* Advanced Filter Panel */}
      {showAdvanced && props.status && props.setStatus && (
        <AdvancedFilterPanel
          status={props.status}
          setStatus={props.setStatus}
          listingTier={props.listingTier || 'Any'}
          setListingTier={props.setListingTier!}
          furnishing={props.furnishing || 'Any'}
          setFurnishing={props.setFurnishing!}
          availability={props.availability || 'Any'}
          setAvailability={props.setAvailability!}
          paymentPlan={props.paymentPlan || []}
          setPaymentPlan={props.setPaymentPlan!}
          amenities={props.amenities || []}
          setAmenities={props.setAmenities!}
          mortgageSupport={props.mortgageSupport || false}
          setMortgageSupport={props.setMortgageSupport!}
          verificationLevel={props.verificationLevel || 'Any'}
          setVerificationLevel={props.setVerificationLevel!}
          minArea={props.minArea || 0}
          setMinArea={props.setMinArea!}
          maxArea={props.maxArea || 10000}
          setMaxArea={props.setMaxArea!}
          beds={props.beds || 'Any'}
          setBeds={props.setBeds!}
          baths={props.baths || 'Any'}
          setBaths={props.setBaths!}
          onClose={() => setShowAdvanced(false)}
        />
      )}

      {props.children}
    </div>
  );
}
