export type PropertyType = 
  | 'Apartment'
  | 'Duplex'
  | 'Studio'
  | 'Mini Flat'
  | 'Self Contain'
  | 'Short Let'
  | 'Student Housing'
  | 'Affordable Rental'
  | 'Family House'
  | 'Land'
  | 'Warehouse'
  | 'Office Space'
  | 'Penthouse'
  | 'Villa'
  | string;

export type TransactionType =
  | 'buy'
  | 'rent'
  | 'lease';

export type Property = {
  id: string;
  transactionType: TransactionType;
  title: string;
  location: string;
  city: string;
  state: string;
  price: string;
  priceValue: number;
  monthly: string;
  type: PropertyType;
  beds: number;
  baths: number;
  area: string;
  image: string;
  verified: string[];
  agent: { 
    name: string; 
    agency: string; 
    avatar: string;
    id?: string;
    phone?: string;
    email?: string;
    image?: string;
    verified?: boolean;
  };
  tag?: string;
  gallery?: string[];
  amenities?: string[];
  features?: string[];
  nearbyPlaces?: { title: string; distance: string }[];
  paymentSnapshot?: {
    deposit: string;
    legalFee: string;
    serviceCharge: string;
    agencyFee: string;
    pricePerSqm: string;
  };
  documents?: { title: string; verified: boolean }[];
  walkScore?: number;
  transitScore?: number;
  schoolScore?: number;
  parkingSpaces?: number;
  yearBuilt?: number;
  floorPlans?: string[];
};
