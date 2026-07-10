import { 
  ShieldCheck, BadgeCheck, Compass, Brain, Sparkles, KeyRound, Package, Wrench, FileCheck, Eye, Award, TrendingUp, Percent, BarChart3, Wallet
} from 'lucide-react';


// Hero
export const propertyTypes = ['Any Type', 'Apartment', 'Duplex', 'Villa', 'Studio', 'Land', 'Office'];
export const locations = ['Any Location', 'Lagos', 'Abuja', 'Port Harcourt', 'Lekki', 'Eko Atlantic'];
export const budgets = ['Any Budget', '₦50M – ₦100M', '₦100M – ₦300M', '₦300M – ₦700M', '₦700M+'];

// WhyLuxora
export const pillars = [
  { icon: ShieldCheck, title: 'Trust', desc: 'Every listing, agent, and agency is vetted through our multi-layer verification system.' },
  { icon: BadgeCheck, title: 'Verification', desc: 'Documents, physical inspections, and agent reviews — all checked before a property goes live.' },
  { icon: Wallet, title: 'Affordability', desc: 'Transparent mortgage calculators and flexible payment plans that fit your real budget.' },
  { icon: Compass, title: 'Guided Transactions', desc: 'From first viewing to final handover, our team guides you through every step.' },
  { icon: Brain, title: 'Property Intelligence', desc: 'Investment scores, rental yield, and area growth data to help you decide with confidence.' },
  { icon: Sparkles, title: 'Premium Experience', desc: 'A platform built to Apple-level standards — clean, fast, and beautifully designed.' },
];

// ServicesEcosystem
export const services = [
  { icon: KeyRound, title: 'Property Management', desc: 'Full-service management for owners — tenant sourcing, rent collection, maintenance, and reporting.', tag: 'For Owners' },
  { icon: Package, title: 'Procurement', desc: 'Source building materials, fittings, and furnishings through our vetted supplier network.', tag: 'For Builders' },
  { icon: Wallet, title: 'Mortgage Assistance', desc: 'Get pre-approved, compare lenders, and access flexible payment plans tailored to you.', tag: 'For Buyers' },

  { icon: Wrench, title: 'Home Services', desc: 'Cleaning, repairs, renovations, and moving — book trusted professionals in minutes.', tag: 'For Everyone' },
  { icon: Brain, title: 'Property Intelligence', desc: 'Investment scores, market analytics, and area growth data to power your decisions.', tag: 'For Investors' },
];

// TrustVerification
export const badges = [
  { icon: <Eye className="h-6 w-6" />, title: 'Agent Reviewed', desc: 'Every listing is vetted by a verified Luxora agent before it goes live.' },
  { icon: <FileCheck className="h-6 w-6" />, title: 'Documents Verified', desc: 'Title deeds, ownership records, and legal documents are authenticated.' },
  { icon: <ShieldCheck className="h-6 w-6" />, title: 'Physical Inspection', desc: 'Our team physically inspects properties to confirm condition and location.' },
  { icon: <Award className="h-6 w-6" />, title: 'Premium Verified', desc: 'The highest tier — all checks passed with a premium service guarantee.' },
];

// InvestmentIntelligence
export const metrics = [
  { label: 'Investment Score', value: '92', suffix: '/100', icon: BarChart3, color: 'text-emerald-400', trend: '+8 pts' },
  { label: 'Rental Yield', value: '7.8', suffix: '%', icon: Percent, color: 'text-gold-400', trend: '+0.4%' },
  { label: 'Area Growth', value: '14.2', suffix: '%', icon: TrendingUp, color: 'text-blue-400', trend: '+2.1%' },
];

export const areas = [
  { name: 'Eko Atlantic', score: 94, yield: '8.2%', growth: '+18%' },
  { name: 'Lekki Phase 1', score: 89, yield: '7.5%', growth: '+14%' },
  { name: 'Maitama, Abuja', score: 91, yield: '6.9%', growth: '+12%' },
  { name: 'Banana Island', score: 96, yield: '9.1%', growth: '+22%' },
];

// Affordability
export const plans = [
  { name: '12 Months', rate: '8.5%', desc: 'Short-term accelerated plan' },
  { name: '24 Months', rate: '11.0%', desc: 'Balanced monthly payments' },
  { name: '36 Months', rate: '13.5%', desc: 'Most popular payment plan' },
  { name: '60 Months', rate: '16.0%', desc: 'Extended flexibility' },
];

// Navbar
export const navLinks = ['Buy', 'Rent', 'Lease', 'Sell Property', 'Agencies', 'Services', 'About', 'Contact', 'Notification Center', 'Workflow Engine', 'Document Center', 'CRM Center', 'Finance Center', 'Compliance Center', 'Human Resources'];

// Footer
export const footerColumns = [
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Press', 'Partnerships', 'Contact'],
  },
  {
    title: 'Services',
    links: ['Property Management', 'Procurement', 'Mortgage Assistance', 'Home Services', 'Property Intelligence'],
  },
  {
    title: 'Properties',
    links: ['Buy', 'Rent', 'Lease', 'Sell Property', 'Short Let'],
  },
  {
    title: 'Agencies',
    links: ['Become a Partner', 'Agency Dashboard', 'Agent Verification', 'Rankings', 'Resources'],
  },
  {
    title: 'Resources',
    links: ['Help Center', 'Blog', 'Market Reports', 'API Docs', 'Community'],
  },
];
