import type { PropertyType, TransactionType } from '../../../types';

export interface ListingDraft {
  // Step 1
  title: string;
  propertyType: PropertyType | '';
  transactionType: TransactionType | '';
  description: string;

  // Step 2
  country: string;
  state: string;
  city: string;
  area: string;
  address: string;

  // Step 3
  bedrooms: number | '';
  bathrooms: number | '';
  propertySize: string;
  amenities: string[];
  furnishing: string;

  // Step 4
  price: string;
  priceValue: number | '';
  rentAmount: string;
  paymentPlans: string[];
  mortgageOptions: string;

  // Step 5
  images: File[];
  videoUrl: string;
  documents: File[];
  brochureUrl: string;

  // Step 6
  ownerReference: string;
  ownershipVerification: File[];
}

export const initialDraftState: ListingDraft = {
  title: '',
  propertyType: '',
  transactionType: '',
  description: '',
  country: 'Nigeria',
  state: '',
  city: '',
  area: '',
  address: '',
  bedrooms: '',
  bathrooms: '',
  propertySize: '',
  amenities: [],
  furnishing: '',
  price: '',
  priceValue: '',
  rentAmount: '',
  paymentPlans: [],
  mortgageOptions: '',
  images: [],
  videoUrl: '',
  documents: [],
  brochureUrl: '',
  ownerReference: '',
  ownershipVerification: []
};
