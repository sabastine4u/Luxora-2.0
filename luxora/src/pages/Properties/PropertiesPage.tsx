import { PageLayout, Section, Container, PageHeader, Breadcrumb } from '../../components/layout';
import { usePropertySearch } from '../../hooks/usePropertySearch';
import { PropertyFilterBar } from '../../components/property/PropertyFilterBar';
import { PropertySortControls } from '../../components/property/PropertySortControls';
import { PropertyGrid } from '../../components/property/PropertyGrid';
import { PropertyPagination } from '../../components/property/PropertyPagination';
import { PropertyFilterChips } from '../../components/property/PropertyFilterChips';
import { PropertyMap } from '../../components/property/PropertyMap';
import { PropertyResultsSummary } from '../../components/property/PropertyResultsSummary';
import { ViewToggle } from '../../components/property/ViewToggle';

export default function PropertiesPage() {

  const {
    search, setSearch,
    listingType, setListingType,
    type, setType,
    location: filterLocation, setLocation: setFilterLocation,
    budgetString, setBudgetString,
    sort, setSort,
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
    beds, setBeds,
    baths, setBaths,
    page, goToPage,
    filteredProperties,
    paginatedProperties,
    totalPages,
    viewMode,
    setViewMode,
    resetFilters,
    itemsPerPage
  } = usePropertySearch({ 
    initialItemsPerPage: 9
  });



  return (
    <PageLayout>
      <Container className="pt-24 md:pt-32">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Properties' },
          ]}
        />
        
        <PageHeader
          title="Explore Properties"
          description="Discover verified luxury homes, apartments, and commercial spaces across prime locations."
        />

        <PropertyFilterBar
          search={search} setSearch={setSearch}
          type={type} setType={setType}
          location={filterLocation} setLocation={setFilterLocation}
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
        >
          <PropertyFilterChips 
            search={search} setSearch={setSearch}
            listingType={listingType} setListingType={setListingType}
            type={type} setType={setType}
            location={filterLocation} setLocation={setFilterLocation}
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

          {/* Bottom Bar: Results Count & Sort */}
          <div className="mt-4 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center">
            <PropertyResultsSummary 
              filteredCount={filteredProperties.length} 
              currentPage={page}
              itemsPerPage={itemsPerPage}
              listingType={listingType}
              location={filterLocation}
              type={type}
            />
            
            <div className="flex items-center gap-4">
              <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              <PropertySortControls sort={sort} setSort={setSort} />
            </div>
          </div>
        </PropertyFilterBar>
      </Container>

      {/* Grid or Map View */}
      {viewMode === 'map' ? (
        <Section noPadding className="pb-0 border-t border-white/10 bg-navy-900/50">
          <div className="flex flex-col lg:flex-row h-[calc(100vh-160px)]">
            <div className="w-full lg:w-1/2 xl:w-2/5 h-[50vh] lg:h-full overflow-y-auto px-4 py-6 lg:p-8 custom-scrollbar">
              <PropertyGrid
                properties={paginatedProperties}
                viewMode="list"
                onClearFilters={resetFilters}
              >
                <PropertyPagination 
                  currentPage={page} 
                  totalPages={totalPages} 
                  onPageChange={goToPage} 
                />
              </PropertyGrid>
            </div>
            <div className="w-full lg:w-1/2 xl:w-3/5 h-[50vh] lg:h-full border-t lg:border-t-0 lg:border-l border-white/10 relative z-0">
              <PropertyMap properties={filteredProperties} className="h-full w-full rounded-none border-none" />
            </div>
          </div>
        </Section>
      ) : (
        <Section noPadding className="pb-24 md:pb-32">
          <Container>
            <PropertyGrid
              properties={paginatedProperties}
              viewMode={viewMode}
              onClearFilters={resetFilters}
            >
              <PropertyPagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={goToPage} 
              />
            </PropertyGrid>
          </Container>
        </Section>
      )}
    </PageLayout>
  );
}
