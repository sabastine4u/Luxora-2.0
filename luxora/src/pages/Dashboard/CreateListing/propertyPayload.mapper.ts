// Import the ListingDraft type so the mapper stays aligned with the Create Listing form.
import type { ListingDraft } from './types';

// Define the shape of the payload accepted by the backend Property creation endpoint.
export interface CreatePropertyPayload {
  title: string;
  description: string;
  propertyType: string;
  propertySubType: string | null;
  transactionType: 'buy' | 'rent' | 'lease';

  country: string;
  state: string;
  city: string;
  area: string | null;
  address: string | null;
  estateName: string | null;
  landmark: string | null;
  hideExactAddress: boolean;

  bedrooms: number;
  bathrooms: number;
  toilets: number;
  parkingSpaces: number;
  propertySize: number | null;
  propertySizeUnit: 'sqm';
  yearBuilt: number | null;
  floorNumber: number | null;
  totalFloors: number | null;
  furnishing: string | null;
  propertyCondition: string | null;
  amenities: string[];

  price: number | null;
  currency: string;
  priceType: 'fixed' | 'negotiable' | 'price_on_request' | 'auction';
  priceFrequency:
    | 'total'
    | 'monthly'
    | 'yearly'
    | 'perNight'
    | 'perPlot'
    | 'perAcre';
  isNegotiable: boolean;

  rentAmount: number | null;
  serviceCharge: number | null;
  agencyFee: number | null;
  legalFee: number | null;
  cautionDeposit: number | null;
  otherCharges: number | null;
  leaseDuration: string | null;

  listingTier: 'Basic' | 'Plus' | 'Pro';
  featuredLevel: 'Standard' | 'Premium' | 'Exclusive';

  paymentPlans: Array<{
    durationMonths: number;
    installmentAmount: number;
    frequency: 'monthly';
    description: string | null;
  }>;

  mortgageOptions: {
    available: boolean;
    providers: string[];
    minimumDownPaymentPercent: number | null;
    maximumTermYears: number | null;
    notes: string | null;
  };

  images: string[];
  coverImage: string | null;

  videoUrl: string | null;
  virtualTourUrl: string | null;
  brochureUrl: string | null;

  floorPlans: string[];

  documents: Array<{
    title: string;
    url: string;
    verified: boolean;
  }>;

  listingSource:
    | 'Assigned Property'
    | 'Private Owner'
    | 'Agency Portfolio'
    | 'Developer Project'
    | 'Bank Property'
    | 'Corporate Property'
    | 'Government Property';

  owner: string | null;
  agent: string | null;
  agency: string | null;

  verificationLevel:
    | 'Unverified'
    | 'Agent Reviewed'
    | 'Documents Verified'
    | 'Physical Inspection Completed';

  inspectionStatus:
    | 'Not Scheduled'
    | 'Scheduled'
    | 'In Progress'
    | 'Completed'
    | 'Failed';

  status:
    | 'Draft'
    | 'Pending Review'
    | 'Approved'
    | 'Published'
    | 'Under Offer'
    | 'Sold'
    | 'Rented'
    | 'Leased'
    | 'Archived';

  availabilityDate: string | null;

  availabilityStatus:
    | 'Available'
    | 'Unavailable'
    | 'Coming Soon';
}

// Convert an empty string into null.
const emptyToNull = <T>(value: T): T | null => {
  if (typeof value === 'string' && value.trim() === '') {
    return null;
  }

  return value;
};

// Convert a numeric form value into a number or null.
const toNumberOrNull = (
  value: number | string | null | undefined,
): number | null => {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : null;
};

// Extract the numeric duration from a payment-plan label.
const extractPlanDuration = (plan: string): number | null => {
  const match = plan.match(/\d+/);

  if (!match) {
    return null;
  }

  const duration = Number(match[0]);

  return Number.isFinite(duration) && duration > 0 ? duration : null;
};

// Convert the UI price type into the backend price-type enum.
const mapPriceType = (
  priceType: string,
): CreatePropertyPayload['priceType'] => {
  switch (priceType.trim().toLowerCase()) {
    case 'negotiable':
    case 'negotiable price':
      return 'negotiable';

    case 'price on request':
    case 'price_on_request':
      return 'price_on_request';

    case 'auction':
      return 'auction';

    case 'fixed':
    case 'fixed price':
    default:
      return 'fixed';
  }
};

// Determine the price frequency from the transaction type.
const mapPriceFrequency = (
  draft: ListingDraft,
): CreatePropertyPayload['priceFrequency'] => {
  if (draft.transactionType === 'rent') {
    return 'yearly';
  }

  if (draft.transactionType === 'lease') {
    return 'total';
  }

  return 'total';
};

// Convert payment-plan labels into structured backend payment-plan objects.
const mapPaymentPlans = (
  draft: ListingDraft,
): CreatePropertyPayload['paymentPlans'] => {
  return draft.paymentPlans
    .map((plan) => {
      const durationMonths = extractPlanDuration(plan);

      if (!durationMonths) {
        return null;
      }

      return {
        durationMonths,
        installmentAmount: 0,
        frequency: 'monthly' as const,
        description: `${plan} selected`,
      };
    })
    .filter(
      (
        plan,
      ): plan is {
        durationMonths: number;
        installmentAmount: number;
        frequency: 'monthly';
        description: string;
      } => plan !== null,
    );
};

// Convert the mortgage UI value into the backend mortgage structure.
const mapMortgageOptions = (
  mortgageOptions: string,
): CreatePropertyPayload['mortgageOptions'] => {
  const available = mortgageOptions === 'true';

  return {
    available,
    providers: [],
    minimumDownPaymentPercent: null,
    maximumTermYears: null,
    notes: null,
  };
};

// Convert the complete ListingDraft into the backend Property payload.
export const mapListingDraftToPropertyPayload = (
  draft: ListingDraft,
  uploadedImages: string[] = [],
  uploadedDocuments: Array<{ title: string; url: string }> = [],
): CreatePropertyPayload => {
  // Normalize the transaction type.
  const transactionType =
    draft.transactionType === 'rent' || draft.transactionType === 'lease'
      ? draft.transactionType
      : 'buy';

  // Convert the UI price type into the backend enum.
  const priceType = mapPriceType(draft.priceType);

  // Keep negotiable state consistent with the selected price type.
  const isNegotiable =
    priceType === 'negotiable' ? true : draft.isNegotiable;

  // Use uploaded image URLs instead of browser File objects.
  const images = uploadedImages.filter(Boolean);

  // Resolve the selected cover image from the uploaded image list.
  const coverImage =
    images.length > 0
      ? images[Math.min(draft.coverImageIndex, images.length - 1)] ?? null
      : null;

  // Convert uploaded documents into the backend document structure.
  const documents = uploadedDocuments
    .filter((document) => document.url)
    .map((document) => ({
      title: document.title,
      url: document.url,
      verified: false,
    }));

  // Return the final backend-ready Property object.
  return {
    title: draft.title.trim(),
    description: draft.description.trim(),

    propertyType: draft.propertyType,
    propertySubType: emptyToNull(draft.propertySubType),
    transactionType,

    country: draft.country.trim() || 'Nigeria',
    state: draft.state.trim(),
    city: draft.city.trim(),
    area: emptyToNull(draft.area),
    address: emptyToNull(draft.address),
    estateName: emptyToNull(draft.estateName),
    landmark: emptyToNull(draft.landmark),
    hideExactAddress: draft.hideExactAddress,

    bedrooms: toNumberOrNull(draft.bedrooms) ?? 0,
    bathrooms: toNumberOrNull(draft.bathrooms) ?? 0,
    toilets: toNumberOrNull(draft.toilets) ?? 0,
    parkingSpaces: toNumberOrNull(draft.parkingSpaces) ?? 0,

    propertySize: toNumberOrNull(draft.propertySize),
    propertySizeUnit: 'sqm',

    yearBuilt: toNumberOrNull(draft.yearBuilt),
    floorNumber: toNumberOrNull(draft.floorNumber),
    totalFloors: toNumberOrNull(draft.totalFloors),

    furnishing: emptyToNull(draft.furnishing),
    propertyCondition: emptyToNull(draft.propertyCondition),

    amenities: draft.amenities,

    price: toNumberOrNull(draft.priceValue),
    currency: draft.currency || 'NGN',

      // Map the transaction type to the backend price-frequency enum.
    priceType,
    priceFrequency: mapPriceFrequency(draft),
    isNegotiable,

    rentAmount:
      transactionType === 'rent'
        ? toNumberOrNull(draft.rentAmount) ??
          toNumberOrNull(draft.priceValue)
        : null,

    serviceCharge: toNumberOrNull(draft.serviceCharge),
    agencyFee: toNumberOrNull(draft.agencyFee),
    legalFee: toNumberOrNull(draft.legalFee),
    cautionDeposit: toNumberOrNull(draft.cautionDeposit),
    otherCharges: toNumberOrNull(draft.otherCharges),

    leaseDuration:
      transactionType === 'lease'
        ? emptyToNull(draft.leaseDuration)
        : null,

    // New listings start on the basic tier.
    listingTier: 'Basic',
    featuredLevel: 'Standard',

    paymentPlans: mapPaymentPlans(draft),

    mortgageOptions: mapMortgageOptions(draft.mortgageOptions),

    images,
    coverImage,

    videoUrl: emptyToNull(draft.videoUrl),
    virtualTourUrl: emptyToNull(draft.virtualTourUrl),
    brochureUrl: emptyToNull(draft.brochureUrl),

    floorPlans: [],

    documents,

    listingSource:
      (draft.listingSource as CreatePropertyPayload['listingSource']) ||
      'Private Owner',

    // These relationships are assigned by the backend.
    owner: null,
    agent: null,
    agency: null,

    verificationLevel: 'Unverified',
    inspectionStatus: 'Not Scheduled',

    // The backend creates new listings as Draft.
    status: 'Draft',

    availabilityDate: null,
    availabilityStatus: 'Available',
  };
};