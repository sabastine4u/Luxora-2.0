import { Map, MapPin } from 'lucide-react';
import { PageLayout } from '../../components/layout';
import { usePropertySearch } from '../../hooks/usePropertySearch';
import { PropertyFilterBar } from '../../components/property/PropertyFilterBar';
import { PropertySortControls } from '../../components/property/PropertySortControls';
import { PropertyGrid } from '../../components/property/PropertyGrid';
import { PropertyPagination } from '../../components/property/PropertyPagination';
import { PropertyFilterChips } from '../../components/property/PropertyFilterChips';
import { PropertyResultsSummary } from '../../components/property/PropertyResultsSummary';
import { ViewToggle } from '../../components/property/ViewToggle';

export default function SearchPage() {
  const {
    search, setSearch,
    type, setType,
    location, setLocation,
    listingType, setListingType,
    budgetString, setBudgetString,
    beds, setBeds,
    baths, setBaths,
    status, setStatus,
    listingTier, setListingTier,
    furnishing, setFurnishing,
    availability, setAvailability,
    paymentPlan, setPaymentPlan,
    amenities, setAmenities,
    mortgageSupport, setMortgageSupport,
    verificationLevel, setVerificationLevel,
    minArea, setMinArea,
    maxArea, setMaxArea,
    sort, setSort,
    page, goToPage,
    filteredProperties,
    paginatedProperties,
    totalPages,
    viewMode,
    setViewMode,
    resetFilters,
    itemsPerPage
  } = usePropertySearch({ initialItemsPerPage: 6 });

  return (
    <PageLayout>
      <div className="flex min-h-screen pt-20">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-navy-900/50">
          
          {/* Map Placeholder */}
          <div className="h-64 md:h-80 w-full relative bg-navy-800 border-b border-white/10 overflow-hidden">
            <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-navy-900/60" />
            
            {/* Map Markers Mockup */}
            <div className="absolute top-1/3 left-1/4">
              <div className="flex items-center justify-center h-8 w-8 bg-gold-400 rounded-full shadow-lux text-navy-900 animate-pulse">
                <MapPin className="h-4 w-4" />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2">
              <div className="flex items-center justify-center h-8 w-8 bg-gold-400 rounded-full shadow-lux text-navy-900 animate-pulse">
                <MapPin className="h-4 w-4" />
              </div>
            </div>
            <div className="absolute bottom-1/3 right-1/4">
              <div className="flex items-center justify-center h-8 w-8 bg-gold-400 rounded-full shadow-lux text-navy-900 animate-pulse">
                <MapPin className="h-4 w-4" />
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-navy-900/80 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex items-center gap-3">
                <Map className="h-5 w-5 text-gold-400" />
                <span className="text-cream font-medium">Interactive Map View</span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {/* Header: Count & Sort */}
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold font-heading text-cream">Properties for Sale</h1>
                <PropertyResultsSummary 
                  filteredCount={filteredProperties.length} 
                  currentPage={page}
                  itemsPerPage={itemsPerPage}
                  listingType={listingType}
                  location={location}
                  type={type}
                />
              </div>
              
              <div className="flex items-center gap-4">
                <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                <PropertySortControls sort={sort} setSort={setSort} />
              </div>
            </div>

            <PropertyFilterBar
              search={search} setSearch={setSearch}
              listingType={listingType} setListingType={setListingType}
              type={type} setType={setType}
              location={location} setLocation={setLocation}
              budget={budgetString} setBudget={setBudgetString}
              status={status} setStatus={setStatus}
              listingTier={listingTier} setListingTier={setListingTier}
              furnishing={furnishing} setFurnishing={setFurnishing}
              availability={availability} setAvailability={setAvailability}
              paymentPlan={paymentPlan} setPaymentPlan={setPaymentPlan}
              amenities={amenities} setAmenities={setAmenities}
              mortgageSupport={mortgageSupport} setMortgageSupport={setMortgageSupport}
              verificationLevel={verificationLevel} setVerificationLevel={setVerificationLevel}
              minArea={minArea} setMinArea={setMinArea}
              maxArea={maxArea} setMaxArea={setMaxArea}
              beds={beds} setBeds={setBeds}
              baths={baths} setBaths={setBaths}
            />

            <PropertyFilterChips 
              search={search} setSearch={setSearch}
              listingType={listingType} setListingType={setListingType}
              type={type} setType={setType}
              location={location} setLocation={setLocation}
              budgetString={budgetString} setBudgetString={setBudgetString}
              status={status} setStatus={setStatus}
              listingTier={listingTier} setListingTier={setListingTier}
              furnishing={furnishing} setFurnishing={setFurnishing}
              availability={availability} setAvailability={setAvailability}
              paymentPlan={paymentPlan} setPaymentPlan={setPaymentPlan}
              amenities={amenities} setAmenities={setAmenities}
              mortgageSupport={mortgageSupport} setMortgageSupport={setMortgageSupport}
              verificationLevel={verificationLevel} setVerificationLevel={setVerificationLevel}
              minArea={minArea} setMinArea={setMinArea}
              maxArea={maxArea} setMaxArea={setMaxArea}
              beds={beds} setBeds={setBeds}
              baths={baths} setBaths={setBaths}
              resetFilters={resetFilters}
            />

            {/* Grid */}
            <PropertyGrid 
              properties={paginatedProperties} 
              gridClassName="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
              viewMode={viewMode}
              onClearFilters={resetFilters}
            >
              <PropertyPagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={goToPage} 
              />
            </PropertyGrid>
          </div>
        </main>
      </div>
    </PageLayout>
  );
}
