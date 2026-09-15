// Import the Property mapper we want to test.
import { mapApiPropertyToProperty } from './property.mapper';

// Create a small backend-shaped Property object using the real API structure.
const testApiProperty = {
  _id: '6a8608be18c5a37529b1239d',
  title: 'Luxury 4 Bedroom Duplex',
  description:
    'A modern four-bedroom duplex in Lekki Phase 1 with premium amenities.',
  propertyType: 'Duplex',
  propertySubType: 'Detached Duplex',
  transactionType: 'buy',
  country: 'Nigeria',
  state: 'Lagos',
  city: 'Lagos',
  area: 'Lekki Phase 1',
  propertySize: 450,
  propertySizeUnit: 'sqm',
  bedrooms: 4,
  bathrooms: 4,
  parkingSpaces: 2,
  yearBuilt: 2022,
  price: 250000000,
  currency: 'NGN',
  priceType: 'fixed',
  priceFrequency: 'total',
  images: [],
  coverImage: null,
  floorPlans: [],
  amenities: [
    'Swimming Pool',
    '24/7 Security',
    'Parking',
    'Boys Quarters',
  ],
  verificationLevel: 'Unverified',
  availabilityStatus: 'Available',
  status: 'Published',
  furnishing: 'Fully Furnished',
  listingTier: 'Basic',
  featuredLevel: 'Standard',
  mortgageOptions: {
    available: false,
  },
  inspectionStatus: 'Not Scheduled',
  paymentPlans: [],
  documents: [],
  coordinates: {
    latitude: 6.4474,
    longitude: 3.4718,
  },
  agent: {
    _id: '6a7ae10928552ee9d451c13a',
    user: {
      _id: '6a7ae10828552ee9d451c139',
      fullName: 'Test Agent',
      email: 'agent@example.com',
    },
  },
  agency: {
    _id: '6a7a66b0cf0be8bfd0976cb9',
    name: 'Prime Realty Agency',
  },
  createdBy: '6a7ae10828552ee9d451c139',
  createdByRole: 'Agent',
  origin: 'agent',
  createdAt: '2026-08-19T19:49:18.189Z',
  updatedAt: '2026-08-20T10:27:30.444Z',
};

// Run the mapper against the real backend-shaped Property object.
const mappedProperty = mapApiPropertyToProperty(testApiProperty);

// Print the mapped Property so we can inspect the frontend shape.
console.log('Mapped Property:', mappedProperty);