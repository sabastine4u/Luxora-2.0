export const PROPERTY_CONDITIONS = [
  { value: '', label: 'Select Condition' },
  { value: 'newly_built', label: 'Newly Built' },
  { value: 'renovated', label: 'Renovated' },
  { value: 'fairly_used', label: 'Fairly Used' },
  { value: 'off_plan', label: 'Off Plan' },
  { value: 'under_construction', label: 'Under Construction' },
];

export const PROPERTY_TYPES = [
  { value: '', label: 'Select Type' },
  { value: 'Apartment', label: 'Apartment' },
  { value: 'Duplex', label: 'Duplex' },
  { value: 'Studio', label: 'Studio' },
  { value: 'Villa', label: 'Villa' },
  { value: 'Penthouse', label: 'Penthouse' },
  { value: 'Maisonette', label: 'Maisonette' },
  { value: 'Land', label: 'Land' },
  { value: 'Office Space', label: 'Office Space' },
  { value: 'Commercial', label: 'Commercial' },
];

export const PROPERTY_SUB_TYPES: Record<string, { value: string, label: string }[]> = {
  'Apartment': [
    { value: '', label: 'Select Sub-Type' },
    { value: 'Studio', label: 'Studio' },
    { value: 'Mini Flat', label: 'Mini Flat' },
    { value: 'Penthouse', label: 'Penthouse' },
    { value: 'Maisonette', label: 'Maisonette' },
    { value: 'Standard', label: 'Standard Apartment' }
  ],
  'Duplex': [
    { value: '', label: 'Select Sub-Type' },
    { value: 'Semi-Detached', label: 'Semi-Detached' },
    { value: 'Fully Detached', label: 'Fully Detached' },
    { value: 'Terraced', label: 'Terraced' }
  ],
  'Land': [
    { value: '', label: 'Select Sub-Type' },
    { value: 'Residential', label: 'Residential Plot' },
    { value: 'Commercial', label: 'Commercial Plot' },
    { value: 'Mixed Use', label: 'Mixed Use Plot' },
    { value: 'Agricultural', label: 'Agricultural Land' }
  ],
  'Office Space': [
    { value: '', label: 'Select Sub-Type' },
    { value: 'Open Plan', label: 'Open Plan' },
    { value: 'Partitioned', label: 'Partitioned' },
    { value: 'Co-working', label: 'Co-working Space' },
    { value: 'Serviced', label: 'Serviced Office' }
  ]
};

export const TRANSACTION_TYPES = [
  { value: '', label: 'Select Transaction' },
  { value: 'buy', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
  { value: 'lease', label: 'For Lease' }
];

export const LISTING_SOURCES = [
  { value: 'Assigned Property', label: 'Assigned Property' },
  { value: 'Private Owner', label: 'Private Owner' },
  { value: 'Agency Portfolio', label: 'Agency Portfolio' },
  { value: 'Developer Project', label: 'Developer Project' },
  { value: 'Bank Property', label: 'Bank Property' },
  { value: 'Corporate Property', label: 'Corporate Property' },
  { value: 'Government Property', label: 'Government Property' },
];

export const PRICE_TYPES = [
  { value: 'Fixed Price', label: 'Fixed Price' },
  { value: 'Negotiable', label: 'Negotiable' },
  { value: 'Price On Request', label: 'Price On Request' },
  { value: 'Auction', label: 'Auction' }
];

export const CURRENCIES = [
  { value: 'NGN', label: '₦ (NGN)' },
  { value: 'USD', label: '$ (USD)' },
  { value: 'GBP', label: '£ (GBP)' },
  { value: 'EUR', label: '€ (EUR)' },
];

export const AMENITIES_LIST = [
  'Swimming Pool', 'Gym', '24/7 Power', '24/7 Security', 
  'Elevator', 'BQ', 'CCTV', 'Fitted Kitchen',
  'Generator', 'Solar', 'Smart Home', 'Internet', 'Water Supply'
];

export const PAYMENT_PLANS = [
  'Outright Payment',
  '3 Months Plan',
  '6 Months Plan',
  '12 Months Plan'
];
