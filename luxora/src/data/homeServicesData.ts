import type { ServiceCategory, ServiceProvider, ServiceRequest, Booking, ProviderPayout, ServiceFinancialTransaction } from '../types';

export const serviceCategories: ServiceCategory[] = [
  { id: 'cat-1', name: 'Cleaning', description: 'Deep cleaning, standard cleaning, move-in/out.', icon: 'Sparkles', activeProviders: 45, activeRequests: 120, monthlyRevenue: 8400000, status: 'Active' },
  { id: 'cat-2', name: 'Electrical', description: 'Wiring, repairs, lighting installations.', icon: 'Zap', activeProviders: 28, activeRequests: 85, monthlyRevenue: 6200000, status: 'Active' },
  { id: 'cat-3', name: 'Plumbing', description: 'Pipe repairs, installations, water heater services.', icon: 'Droplet', activeProviders: 32, activeRequests: 90, monthlyRevenue: 5800000, status: 'Active' },
  { id: 'cat-4', name: 'Moving', description: 'Relocation services, packing, transport.', icon: 'Truck', activeProviders: 15, activeRequests: 40, monthlyRevenue: 4500000, status: 'Active' },
  { id: 'cat-5', name: 'Painting', description: 'Interior and exterior painting services.', icon: 'Paintbrush', activeProviders: 22, activeRequests: 55, monthlyRevenue: 3800000, status: 'Active' },
  { id: 'cat-6', name: 'Security', description: 'CCTV installation, security personnel.', icon: 'Shield', activeProviders: 18, activeRequests: 30, monthlyRevenue: 5200000, status: 'Active' },
  { id: 'cat-7', name: 'Smart Home', description: 'Home automation, IoT setups.', icon: 'Wifi', activeProviders: 10, activeRequests: 25, monthlyRevenue: 4100000, status: 'Active' },
  { id: 'cat-8', name: 'Landscaping', description: 'Garden design, lawn maintenance.', icon: 'Leaf', activeProviders: 14, activeRequests: 20, monthlyRevenue: 2900000, status: 'Active' },
];

export const serviceProviders: ServiceProvider[] = [
  { id: 'PRV-001', name: 'Pristine Cleaners', category: 'Cleaning', rating: 4.9, reviews: 124, completedJobs: 450, revenue: 12500000, status: 'Active', verificationStatus: 'Verified', contactEmail: 'contact@pristine.com', contactPhone: '+234 800 111 2222' },
  { id: 'PRV-002', name: 'Volt Electricians', category: 'Electrical', rating: 4.8, reviews: 89, completedJobs: 320, revenue: 9800000, status: 'Active', verificationStatus: 'Verified', contactEmail: 'info@voltelectric.com', contactPhone: '+234 800 333 4444' },
  { id: 'PRV-003', name: 'AquaPlumb Services', category: 'Plumbing', rating: 4.6, reviews: 110, completedJobs: 380, revenue: 8600000, status: 'Active', verificationStatus: 'Verified', contactEmail: 'support@aquaplumb.ng', contactPhone: '+234 800 555 6666' },
  { id: 'PRV-004', name: 'SafeGuard Pro', category: 'Security', rating: 4.9, reviews: 65, completedJobs: 150, revenue: 15200000, status: 'Active', verificationStatus: 'Verified', contactEmail: 'admin@safeguard.com', contactPhone: '+234 800 777 8888' },
  { id: 'PRV-005', name: 'EcoLawn Care', category: 'Landscaping', rating: 4.7, reviews: 42, completedJobs: 180, revenue: 4500000, status: 'Inactive', verificationStatus: 'Verified', contactEmail: 'hello@ecolawn.com', contactPhone: '+234 800 999 0000' },
];

export const serviceRequests: ServiceRequest[] = [
  { id: 'REQ-2025-001', customerId: 'CUST-001', customerName: 'Dr. Ayo Balogun', category: 'Electrical', description: 'Complete rewiring of 4-bedroom duplex.', location: 'Victoria Island, Lagos', priority: 'High', status: 'Pending', createdAt: '2025-10-01' },
  { id: 'REQ-2025-002', customerId: 'CUST-002', customerName: 'Sarah Jenkins', category: 'Cleaning', description: 'Deep cleaning before move-in.', location: 'Lekki Phase 1, Lagos', priority: 'Medium', status: 'Assigned', assignedProviderId: 'PRV-001', assignedProviderName: 'Pristine Cleaners', createdAt: '2025-10-02' },
  { id: 'REQ-2025-003', customerId: 'CUST-003', customerName: 'Chief Olatunji', category: 'Security', description: 'Installation of 8 CCTV cameras.', location: 'Ikoyi, Lagos', priority: 'High', status: 'In Progress', assignedProviderId: 'PRV-004', assignedProviderName: 'SafeGuard Pro', createdAt: '2025-10-03' },
  { id: 'REQ-2025-004', customerId: 'CUST-004', customerName: 'Ngozi Okorie', category: 'Plumbing', description: 'Leaking water heater repair.', location: 'Abuja Central', priority: 'Emergency', status: 'Completed', assignedProviderId: 'PRV-003', assignedProviderName: 'AquaPlumb Services', createdAt: '2025-10-04' },
];

export const bookings: Booking[] = [
  { id: 'BKG-1001', customerId: 'CUST-002', customerName: 'Sarah Jenkins', providerId: 'PRV-001', providerName: 'Pristine Cleaners', category: 'Cleaning', date: '2025-10-15', time: '09:00 AM', status: 'Scheduled', amount: 35000 },
  { id: 'BKG-1002', customerId: 'CUST-003', customerName: 'Chief Olatunji', providerId: 'PRV-004', providerName: 'SafeGuard Pro', category: 'Security', date: '2025-10-12', time: '10:00 AM', status: 'In Progress', amount: 250000 },
  { id: 'BKG-1003', customerId: 'CUST-004', customerName: 'Ngozi Okorie', providerId: 'PRV-003', providerName: 'AquaPlumb Services', category: 'Plumbing', date: '2025-10-05', time: '14:00 PM', status: 'Completed', amount: 45000 },
];

export const providerPayouts: ProviderPayout[] = [
  { id: 'PAY-101', providerId: 'PRV-001', providerName: 'Pristine Cleaners', amount: 1250000, date: '2025-09-30', status: 'Paid', period: 'Sept 2025' },
  { id: 'PAY-102', providerId: 'PRV-002', providerName: 'Volt Electricians', amount: 890000, date: '2025-09-30', status: 'Paid', period: 'Sept 2025' },
  { id: 'PAY-103', providerId: 'PRV-004', providerName: 'SafeGuard Pro', amount: 2100000, date: '2025-10-15', status: 'Pending', period: 'Oct 2025 (Mid)' },
];

export const serviceTransactions: ServiceFinancialTransaction[] = [
  { id: 'TRX-5001', date: '2025-10-01', description: 'Customer Payment - Cleaning', type: 'Revenue', amount: 35000, status: 'Completed' },
  { id: 'TRX-5002', date: '2025-10-02', description: 'Luxora Platform Commission (10%)', type: 'Commission', amount: 3500, status: 'Completed' },
  { id: 'TRX-5003', date: '2025-10-03', description: 'Provider Payout - SafeGuard Pro', type: 'Payout', amount: 2100000, status: 'Pending' },
];
