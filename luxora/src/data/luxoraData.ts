/* Centralized mock data for Luxora 2.0 */
import { ROLES } from '../constants/roles';

export type Property = {
  id: string;
  title: string;
  location: string;
  price: string;
  priceValue: number;
  monthly: string;
  type: string;
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

export const properties: Property[] = [
  {
    id: 'p1',
    title: 'Skyline Penthouse Residence',
    location: 'Eko Atlantic, Lagos',
    price: '₦420,000,000',
    priceValue: 420_000_000,
    monthly: '₦2.9M',
    type: 'Penthouse',
    beds: 5,
    baths: 6,
    area: '640 m²',
    image:
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
    verified: ['Documents', 'Inspection', 'Premium'],
    agent: { 
      name: 'Adaeze Okonkwo', 
      agency: 'Meridian Luxury', 
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
      id: 'a1',
      phone: '+234 800 111 2222',
      email: 'adaeze@meridian.lux',
      verified: true
    },
    tag: 'Featured',
    gallery: [
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    amenities: ['Private Pool', 'Helipad Access', '24/7 Concierge', 'Smart Home Integration', 'Private Elevator'],
    features: ['Ocean View', 'Double Height Ceilings', 'Wine Cellar', 'Staff Quarters'],
    nearbyPlaces: [
      { title: 'Eko Atlantic Marina', distance: '0.2 km' },
      { title: 'International School Lagos', distance: '3.5 km' }
    ],
    paymentSnapshot: {
      deposit: '₦126,000,000',
      legalFee: '₦21,000,000',
      serviceCharge: '₦5,000,000/yr',
      agencyFee: '₦21,000,000',
      pricePerSqm: '₦656,250'
    },
    documents: [
      { title: 'C of O', verified: true },
      { title: 'Governor\'s Consent', verified: true }
    ],
    walkScore: 92,
    transitScore: 85,
    schoolScore: 88,
    parkingSpaces: 4,
    yearBuilt: 2023,
    floorPlans: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800']
  },
  {
    id: 'p2',
    title: 'Garden Court Villa',
    location: 'Banana Island, Lagos',
    price: '₦680,000,000',
    priceValue: 680_000_000,
    monthly: '₦4.7M',
    type: 'Villa',
    beds: 7,
    baths: 8,
    area: '920 m²',
    image:
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200',
    verified: ['Documents', 'Inspection', 'Premium', ROLES.AGENT],
    agent: { 
      name: 'Tunde Bakare', 
      agency: 'Crest & Crown', 
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
      id: 'a2',
      phone: '+234 800 333 4444',
      email: 'tunde@crestcrown.com',
      verified: true
    },
    tag: 'Premium Verified',
    gallery: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1572889/pexels-photo-1572889.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    amenities: ['Lush Garden', 'Infinity Pool', 'Home Theater', 'Gymnasium', 'Backup Power'],
    features: ['Waterfront', 'Bulletproof Doors', 'Gourmet Kitchen'],
    nearbyPlaces: [
      { title: 'Banana Island Club', distance: '1.2 km' }
    ],
    paymentSnapshot: {
      deposit: '₦204,000,000',
      legalFee: '₦34,000,000',
      serviceCharge: '₦8,000,000/yr',
      agencyFee: '₦34,000,000',
      pricePerSqm: '₦739,130'
    },
    walkScore: 60,
    transitScore: 40,
    parkingSpaces: 6,
    yearBuilt: 2021
  },
  {
    id: 'p3',
    title: 'Marina View Apartment',
    location: 'Lekki Phase 1, Lagos',
    price: '₦185,000,000',
    priceValue: 185_000_000,
    monthly: '₦1.3M',
    type: 'Apartment',
    beds: 3,
    baths: 4,
    area: '210 m²',
    image:
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
    verified: ['Documents', 'Inspection'],
    agent: { 
      name: 'Ngozi Eze', 
      agency: 'Atlas Realty', 
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
      id: 'a3',
      phone: '+234 800 555 6666',
      email: 'ngozi@atlasrealty.ng',
      verified: true
    },
    gallery: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    amenities: ['Shared Pool', '24/7 Security', 'Elevator', 'Fitted Kitchen'],
    paymentSnapshot: {
      deposit: '₦55,500,000',
      legalFee: '₦9,250,000',
      serviceCharge: '₦1,500,000/yr',
      agencyFee: '₦9,250,000',
      pricePerSqm: '₦880,952'
    },
    walkScore: 78,
    transitScore: 65,
    parkingSpaces: 2,
    yearBuilt: 2020
  },
  {
    id: 'p4',
    title: 'The Continental Duplex',
    location: 'Maitama, Abuja',
    price: '₦310,000,000',
    priceValue: 310_000_000,
    monthly: '₦2.1M',
    type: 'Duplex',
    beds: 5,
    baths: 6,
    area: '480 m²',
    image:
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
    verified: ['Documents', 'Inspection', 'Premium', ROLES.AGENT],
    agent: { 
      name: 'Femi Adeola', 
      agency: 'Sterling Homes', 
      avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=200',
      id: 'a4',
      phone: '+234 800 777 8888',
      email: 'femi@sterling.ng',
      verified: true
    },
    tag: 'New',
    gallery: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    amenities: ['Private Garden', 'Security Gate', 'Spacious Compound'],
    walkScore: 50,
    transitScore: 30,
    parkingSpaces: 5,
    yearBuilt: 2024
  },
  {
    id: 'p5',
    title: 'Hilltop Family Estate',
    location: 'Asokoro, Abuja',
    price: '₦540,000,000',
    priceValue: 540_000_000,
    monthly: '₦3.8M',
    type: 'Family House',
    beds: 6,
    baths: 7,
    area: '760 m²',
    image:
      'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1200',
    verified: ['Documents', 'Inspection', 'Premium'],
    agent: { name: 'Chioma Obi', agency: 'Meridian Luxury', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200' },
  },
  {
    id: 'p6',
    title: 'Aurora Smart Studio',
    location: 'Yaba, Lagos',
    price: '₦62,000,000',
    priceValue: 62_000_000,
    monthly: '₦450,000',
    type: 'Studio',
    beds: 1,
    baths: 1,
    area: '65 m²',
    image:
      'https://images.pexels.com/photos/1572889/pexels-photo-1572889.jpeg?auto=compress&cs=tinysrgb&w=1200',
    verified: ['Documents', ROLES.AGENT],
    agent: { name: 'Kunle Sanusi', agency: 'Atlas Realty', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200' },
    tag: 'Investor Pick',
  },
];

export type Category = {
  name: string;
  icon: string;
  count: string;
  image: string;
};

export const categories: Category[] = [
  { name: 'Apartment', icon: 'Building2', count: '4,210 listings', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800' },
  { name: 'Duplex', icon: 'Home', count: '1,840 listings', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800' },
  { name: 'Studio Apartment', icon: 'DoorOpen', count: '920 listings', image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=800' },
  { name: 'Mini Flat', icon: 'BedDouble', count: '1,360 listings', image: 'https://images.unsplash.com/photo-1502672260266-1c1de24227e8?auto=format&fit=crop&q=80&w=800' },
  { name: 'Self Contain', icon: 'DoorClosed', count: '2,540 listings', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800' },
  { name: 'Short Let', icon: 'Key', count: '780 listings', image: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=800' },
  { name: 'Student Housing', icon: 'GraduationCap', count: '540 listings', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800' },
  { name: 'Family House', icon: 'House', count: '1,120 listings', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800' },
  { name: 'Land', icon: 'Trees', count: '3,200 listings', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800' },
  { name: 'Warehouse', icon: 'Warehouse', count: '410 listings', image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c663b0?auto=format&fit=crop&q=80&w=800' },
  { name: 'Office Space', icon: 'Briefcase', count: '680 listings', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800' },
];

export type Agency = {
  name: string;
  rating: number;
  listings: number;
  deals: number;
  logo: string;
  color: string;
};

export const agencies: Agency[] = [
  { name: 'Meridian Luxury', rating: 4.9, listings: 420, deals: 312, logo: 'M', color: 'from-gold-400 to-gold-600' },
  { name: 'Crest & Crown', rating: 4.8, listings: 380, deals: 289, logo: 'C', color: 'from-blue-400 to-blue-600' },
  { name: 'Atlas Realty', rating: 4.7, listings: 510, deals: 401, logo: 'A', color: 'from-emerald-400 to-emerald-600' },
  { name: 'Sterling Homes', rating: 4.8, listings: 290, deals: 234, logo: 'S', color: 'from-rose-400 to-rose-600' },
];

export type Testimonial = {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    name: 'Bisi Williams',
    role: 'Investor, Lagos',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    quote: 'Luxora changed how I evaluate property. The verification badges and investment score gave me the confidence to close on three units in one quarter.',
    rating: 5,
  },
  {
    name: 'Chidi Okafor',
    role: 'Homeowner, Abuja',
    avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=200',
    quote: 'The mortgage calculator showed me I could afford a home I thought was out of reach. The payment plan was transparent from day one.',
    rating: 5,
  },
  {
    name: 'Amara Eze',
    role: 'Agency Director, Crest & Crown',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200',
    quote: 'As an agency, the intelligence dashboard and verification queue have cut our deal cycle time by 40%. It is the platform we always wanted.',
    rating: 5,
  },
];

/* ---------- Dashboard data ---------- */

export type NavItem = { label: string; icon: string; badge?: string };

export const sidebarNav: NavItem[] = [
  { label: 'Dashboard', icon: 'LayoutDashboard' },
  { label: 'Properties', icon: 'Building2', badge: '12.4k' },
  { label: 'Verification', icon: 'ShieldCheck', badge: '38' },
  { label: 'Agencies', icon: 'Landmark' },
  { label: 'Agents', icon: 'Users' },
  { label: 'Finance', icon: 'Wallet' },
  { label: 'Procurement', icon: 'Package' },
  { label: 'Property Intelligence', icon: 'Brain' },
  { label: 'Property Management', icon: 'KeyRound' },
  { label: 'Home Services', icon: 'Wrench' },
  { label: 'Partnerships', icon: 'Handshake' },
  { label: 'Users', icon: 'UserCircle' },
  { label: 'Admins', icon: 'Shield' },
  { label: 'Reports', icon: 'FileBarChart' },
  { label: 'Settings', icon: 'Settings' },
];

export const buyerNav: NavItem[] = [
  { label: 'Overview', icon: 'LayoutDashboard' },
  { label: 'Recommendations', icon: 'Sparkles' },
  { label: 'Recently Viewed', icon: 'Activity' },
  { label: 'My Favorites', icon: 'Heart', badge: '3' },
  { label: 'Mortgage Tracker', icon: 'Wallet' },
  { label: 'Messages', icon: 'MessageSquare', badge: '2' },
  { label: 'Viewing Requests', icon: 'Eye' },
  { label: 'Offers', icon: 'FileCheck' },
  { label: 'Settings', icon: 'Settings' },
];

export const ownerNav: NavItem[] = [
  { label: 'Overview', icon: 'LayoutDashboard' },
  { label: 'My Property Requests', icon: 'Home', badge: '1' },
  { label: 'Verification Progress', icon: 'ShieldCheck', badge: '2' },
  { label: 'Listing Journey', icon: 'Route' },
  { label: 'Messages', icon: 'MessageSquare', badge: '5' },
  { label: 'Offers', icon: 'FileCheck', badge: '3' },
  { label: 'Rental Income', icon: 'Wallet' },
  { label: 'Analytics', icon: 'TrendingUp' },
  { label: 'Settings', icon: 'Settings' },
];

export const agentNav: NavItem[] = [
  { label: 'Overview', icon: 'LayoutDashboard' },
  { label: 'My Listings', icon: 'Building2' },
  { label: 'Leads', icon: 'Target', badge: '12' },
  { label: 'Clients', icon: 'UserCircle' },
  { label: 'Appointments', icon: 'Calendar', badge: '3' },
  { label: 'Deals', icon: 'Briefcase' },
  { label: 'Commissions', icon: 'DollarSign' },
];

export const agencyNav: NavItem[] = [
  { label: 'Overview', icon: 'LayoutDashboard' },
  { label: 'Listings', icon: 'Building2', badge: '42' },
  { label: 'Agents', icon: 'Users', badge: '14' },
  { label: 'Leads', icon: 'Target', badge: '8' },
  { label: 'Clients', icon: 'UserCircle' },
  { label: 'Performance', icon: 'TrendingUp' },
  { label: 'Commissions', icon: 'DollarSign' },
];

export const adminNav: NavItem[] = [
  { label: 'Overview', icon: 'LayoutDashboard' },
  { label: 'Listings', icon: 'Building2' },
  { label: 'Verification Queue', icon: 'ShieldCheck', badge: '14' },
  { label: 'Owners', icon: 'UserCircle' },
  { label: 'Buyers', icon: 'Heart' },
  { label: 'Agents', icon: 'Users' },
  { label: 'Agencies', icon: 'Building2' },
  { label: 'Complaints', icon: 'MessageSquare', badge: '5' },
  { label: 'Reports', icon: 'FileBarChart' },
  { label: 'Finance', icon: 'Landmark' },
  { label: 'Settings', icon: 'Settings' },
];

export const superAdminNav: NavItem[] = [
  { label: 'Business Health', icon: 'Activity' },
  { label: 'Revenue', icon: 'Banknote' },
  { label: 'Management', icon: 'Briefcase' },
  { label: 'Procurement', icon: 'ShoppingCart' },
  { label: 'Finance', icon: 'Landmark' },
  { label: 'Reports', icon: 'FileBarChart' },
  { label: 'Fraud Alerts', icon: 'ShieldAlert', badge: '3' },
  { label: 'Property Intelligence', icon: 'Brain' },
  { label: 'Property Management', icon: 'Building2' },
  { label: 'Home Services', icon: 'Wrench' },
  { label: 'Admin Management', icon: 'UserCog' },
  { label: 'System Settings', icon: 'Settings' },
  { label: 'Agency Rankings', icon: 'Crown' },
  { label: 'Charts', icon: 'PieChart' },
  { label: 'Analytics', icon: 'TrendingUp' },
];

export const managementNav: NavItem[] = [
  { label: 'Overview', icon: 'LayoutDashboard' },
  { label: 'Team Management', icon: 'Users' },
  { label: 'Performance', icon: 'TrendingUp' },
  { label: 'Department Oversight', icon: 'Building2' },
  { label: 'Reports', icon: 'FileBarChart' },
];

export const procurementNav: NavItem[] = [
  { label: 'Vendor Directory', icon: 'Users' },
  { label: 'Vendor Details', icon: 'UserCircle' },
  { label: 'RFQs', icon: 'MessageSquare' },
  { label: 'Purchase Requests', icon: 'FileCheck', badge: '12' },
  { label: 'Purchase Orders', icon: 'ShoppingCart' },
  { label: 'Contracts', icon: 'Handshake' },
  { label: 'Inventory', icon: 'Package' },
  { label: 'Assets', icon: 'Building2' },
  { label: 'Invoices', icon: 'FileBarChart', badge: '4' },
  { label: 'Budget', icon: 'PieChart' },
  { label: 'Payments', icon: 'Wallet' },
  { label: 'Reports', icon: 'TrendingUp' },
];

export const financeNav: NavItem[] = [
  { label: 'Revenue', icon: 'TrendingUp' },
  { label: 'Transactions', icon: 'Activity' },
  { label: 'Owner Payments', icon: 'Banknote' },
  { label: 'Agency Earnings', icon: 'Building2' },
  { label: 'Agent Commissions', icon: 'Users' },
  { label: 'Invoices', icon: 'FileBarChart' },
  { label: 'Refunds', icon: 'MessageSquare', badge: '3' },
  { label: 'Mortgage Statistics', icon: 'PieChart' },
  { label: 'Budget', icon: 'Wallet' },
  { label: 'Reports', icon: 'FileCheck' },
];

export const intelligenceNav: NavItem[] = [
  { label: 'Market Trends', icon: 'TrendingUp' },
  { label: 'ROI Calculator', icon: 'Calculator' },
  { label: 'Rental Yield', icon: 'PieChart' },
  { label: 'Growth Forecast', icon: 'LineChart' },
  { label: 'Neighborhood Insights', icon: 'MapPin' },
  { label: 'Heat Map', icon: 'Map' },
  { label: 'Comparable Properties', icon: 'Home' },
];

export const propertyManagerNav: NavItem[] = [
  { label: 'Tenants', icon: 'Users' },
  { label: 'Rent Collection', icon: 'Banknote' },
  { label: 'Maintenance', icon: 'Wrench' },
  { label: 'Lease Tracking', icon: 'FileText' },
  { label: 'Documents', icon: 'FileCheck' },
  { label: 'Inspections', icon: 'Eye' },
  { label: 'Expenses', icon: 'Wallet' },
  { label: 'Income', icon: 'TrendingUp' },
  { label: 'Analytics', icon: 'PieChart' },
];

export const homeServicesNav: NavItem[] = [
  { label: 'Cleaning', icon: 'Sparkles' },
  { label: 'Moving', icon: 'Truck' },
  { label: 'Painting', icon: 'Paintbrush' },
  { label: 'Electrical', icon: 'Zap' },
  { label: 'Plumbing', icon: 'Droplet' },
  { label: 'Security', icon: 'Shield' },
  { label: 'Architecture', icon: 'PenTool' },
  { label: 'Interior Design', icon: 'Palette' },
  { label: 'Furniture', icon: 'Armchair' },
  { label: 'Smart Home', icon: 'Wifi' },
  { label: 'Landscaping', icon: 'Leaf' },
];

export const kpis = [
  { label: 'Total Revenue', value: '₦4.82B', delta: '+18.2%', up: true, icon: 'TrendingUp', spark: [20, 35, 28, 44, 38, 55, 62, 58, 72, 80] },
  { label: 'Active Listings', value: '12,418', delta: '+6.4%', up: true, icon: 'Building2', spark: [40, 42, 45, 43, 48, 52, 55, 58, 60, 64] },
  { label: 'Deals Closed', value: '1,294', delta: '+12.1%', up: true, icon: 'CheckCircle2', spark: [15, 22, 18, 30, 28, 40, 38, 50, 55, 60] },
  { label: 'Active Users', value: '88,210', delta: '+9.7%', up: true, icon: 'Users', spark: [30, 35, 42, 48, 52, 58, 65, 70, 78, 85] },
];

export const revenueMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const revenueData = [320, 410, 380, 520, 490, 610, 680, 640, 760, 820, 790, 910];

export const agencyRankings = [
  { name: 'Meridian Luxury', deals: 312, revenue: '₦1.2B', rating: 4.9, trend: 'up' },
  { name: 'Atlas Realty', deals: 401, revenue: '₦980M', rating: 4.7, trend: 'up' },
  { name: 'Crest & Crown', deals: 289, revenue: '₦860M', rating: 4.8, trend: 'down' },
  { name: 'Sterling Homes', deals: 234, revenue: '₦640M', rating: 4.8, trend: 'up' },
  { name: 'Pinnacle Estates', deals: 198, revenue: '₦520M', rating: 4.6, trend: 'up' },
];

export const agentPerformance = [
  { name: 'Adaeze Okonkwo', agency: 'Meridian Luxury', deals: 42, value: '₦680M', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Tunde Bakare', agency: 'Crest & Crown', deals: 38, value: '₦540M', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Ngozi Eze', agency: 'Atlas Realty', deals: 35, value: '₦490M', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Femi Adeola', agency: 'Sterling Homes', deals: 31, value: '₦420M', avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=200' },
];

export const fraudAlerts = [
  { severity: 'critical', title: 'Duplicate listing detected', detail: 'Lekki Phase 1 — 2 agents listing same coordinates', time: '12m ago' },
  { severity: 'high', title: 'Unverified document upload', detail: 'Agency: Pinnacle Estates — title deed mismatch', time: '1h ago' },
  { severity: 'medium', title: 'Price manipulation flag', detail: 'Asokoro property repriced 3x in 24h', time: '3h ago' },
];

export const verificationQueue = [
  { id: 'VQ-2041', property: 'Garden Court Villa', type: 'Document', submitted: '2h ago', status: 'pending' },
  { id: 'VQ-2040', property: 'Aurora Smart Studio', type: 'Inspection', submitted: '5h ago', status: 'review' },
  { id: 'VQ-2039', property: 'Marina View Apartment', type: ROLES.AGENT, submitted: '8h ago', status: 'pending' },
  { id: 'VQ-2038', property: 'The Continental Duplex', type: 'Premium', submitted: '1d ago', status: 'review' },
];

export const complaints = [
  { id: 'C-882', subject: 'Delayed inspection schedule', user: 'Bisi W.', priority: 'high', status: 'open' },
  { id: 'C-881', subject: 'Payment plan clarification', user: 'Chidi O.', priority: 'medium', status: 'progress' },
  { id: 'C-880', subject: 'Agent response time', user: 'Amara E.', priority: 'low', status: 'resolved' },
];

export const dealPipeline = [
  { stage: 'Lead', count: 420, value: '₦12.4B' },
  { stage: 'Viewing', count: 210, value: '₦7.8B' },
  { stage: 'Offer', count: 98, value: '₦4.2B' },
  { stage: 'Verification', count: 64, value: '₦2.9B' },
  { stage: 'Closing', count: 31, value: '₦1.4B' },
];

export const userGrowthMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const userGrowthData = [12, 18, 24, 31, 38, 46, 52, 61, 68, 74, 82, 88];

export type Review = {
  id: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
};

export const reviews: Review[] = [
  {
    id: 'r1',
    author: 'Oluwaseun Adebayo',
    role: 'Property Investor',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    date: '2 weeks ago',
    text: 'An absolutely seamless experience from start to finish. The level of professionalism and market knowledge demonstrated was exceptional. I felt completely confident throughout the entire purchasing process.'
  },
  {
    id: 'r2',
    author: 'Grace Ibeh',
    role: 'Homeowner',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    date: '1 month ago',
    text: 'I was blown away by the attention to detail. Every question was answered promptly, and the negotiation was handled with utmost care. Highly recommended for anyone looking for luxury real estate.'
  },
  {
    id: 'r3',
    author: 'David Nwachukwu',
    role: 'Corporate Client',
    avatar: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 4,
    date: '3 months ago',
    text: 'Very professional team. They understood our corporate housing needs perfectly and delivered options that were exactly what we asked for. The only minor issue was a slight delay in document processing, but overall great service.'
  }
];

