import type { PropertyType, TransactionType } from '../../../types';

export interface ListingDraft {
  // Step 1
  title: string;
  propertyType: PropertyType | '';
  transactionType: TransactionType | '';
  description: string;
  propertyCondition: string;
  propertySubType: string;

  // Step 2
  country: string;
  state: string;
  city: string;
  area: string;
  address: string;
  estateName: string;
  landmark: string;
  hideExactAddress: boolean;

  // Step 3
  bedrooms: number | '';
  bathrooms: number | '';
  toilets: number | '';
  parkingSpaces: number | '';
  propertySize: string;
  yearBuilt: string;
  floorNumber: string;
  totalFloors: string;
  amenities: string[];
  furnishing: string;

  // Step 4
  price: string;
  priceValue: number | '';
  currency: string;
  priceType: string;
  
  // Rent/Lease specific
  rentAmount: string;
  serviceCharge: number | '';
  agencyFee: number | '';
  legalFee: number | '';
  cautionDeposit: number | '';
  otherCharges: number | '';
  isNegotiable: boolean;
  leaseDuration: string;
  
  paymentPlans: string[];
  mortgageOptions: string;

  // Step 5
  images: File[];
  coverImageIndex: number;
  videoUrl: string;
  virtualTourUrl: string;
  documents: File[];
  brochureUrl: string;

  // Step 6
  listingSource: string;
  ownerReference: string;
  ownerName: string; // for search
  organizationName: string;
  organizationRep: string;
  ownershipVerification: File[];
}

export const initialDraftState: ListingDraft = {
  title: '',
  propertyType: '',
  transactionType: '',
  description: '',
  propertyCondition: '',
  propertySubType: '',
  country: 'Nigeria',
  state: '',
  city: '',
  area: '',
  address: '',
  estateName: '',
  landmark: '',
  hideExactAddress: false,
  bedrooms: '',
  bathrooms: '',
  toilets: '',
  parkingSpaces: '',
  propertySize: '',
  yearBuilt: '',
  floorNumber: '',
  totalFloors: '',
  amenities: [],
  furnishing: '',
  price: '',
  priceValue: '',
  currency: 'NGN',
  priceType: 'Fixed Price',
  rentAmount: '',
  serviceCharge: '',
  agencyFee: '',
  legalFee: '',
  cautionDeposit: '',
  otherCharges: '',
  isNegotiable: false,
  leaseDuration: '',
  paymentPlans: [],
  mortgageOptions: '',
  images: [],
  coverImageIndex: 0,
  videoUrl: '',
  virtualTourUrl: '',
  documents: [],
  brochureUrl: '',
  listingSource: 'Private Owner',
  ownerReference: '',
  ownerName: '',
  organizationName: '',
  organizationRep: '',
  ownershipVerification: []
};
