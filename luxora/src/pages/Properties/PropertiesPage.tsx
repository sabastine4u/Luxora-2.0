import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageLayout, Section, Container, PageHeader, Breadcrumb } from '../../components/layout';
import { usePropertySearch } from '../../hooks/usePropertySearch';
import { PropertyFilterBar } from '../../components/property/PropertyFilterBar';
import { PropertySortControls } from '../../components/property/PropertySortControls';
import { PropertyGrid } from '../../components/property/PropertyGrid';
import { PropertyPagination } from '../../components/property/PropertyPagination';
import { PropertyFilterChips } from '../../components/property/PropertyFilterChips';
import { PropertyResultsSummary } from '../../components/property/PropertyResultsSummary';
import { ViewToggle } from '../../components/property/ViewToggle';

export default function PropertiesPage() {
  const location = useLocation();
  const initialType = location.state?.type;
  const initialLocationState = location.state?.location;

  const {
    search, setSearch,
    type, setType,
    location: filterLocation, setLocation: setFilterLocation,
    budgetString, setBudgetString,
    sort, setSort,
    page, goToPage,
    filteredProperties,
    paginatedProperties,
    totalPages,
    totalProperties,
    viewMode,
    setViewMode,
    resetFilters
  } = usePropertySearch({ 
    initialItemsPerPage: 9,
    initialType: initialType || 'Any Type',
    initialLocation: initialLocationState || 'Any Location'
  });

  const navigate = useNavigate();

  // Clear navigation state after initialization to prevent stale filters on refresh
  useEffect(() => {
    if (initialType || initialLocationState) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [initialType, initialLocationState, navigate, location.pathname]);

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
        >
          <PropertyFilterChips 
            search={search} setSearch={setSearch}
            type={type} setType={setType}
            location={filterLocation} setLocation={setFilterLocation}
            budgetString={budgetString} setBudgetString={setBudgetString}
            resetFilters={resetFilters}
          />

          {/* Bottom Bar: Results Count & Sort */}
          <div className="mt-4 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center">
            <PropertyResultsSummary filteredCount={filteredProperties.length} totalCount={totalProperties} />
            
            <div className="flex items-center gap-4">
              <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
              <PropertySortControls sort={sort} setSort={setSort} />
            </div>
          </div>
        </PropertyFilterBar>
      </Container>

      {/* Grid */}
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
    </PageLayout>
  );
}
