export interface MarketMetric {
  label: string;
  value: string;
  delta: string;
  up: boolean;
}

export interface ComparableProperty {
  id: string;
  address: string;
  bedsBaths: string;
  size: string;
  date: string;
  price: string;
  type: string;
  yearBuilt?: number;
  condition?: string;
  distance?: string;
}

export interface ForecastScenario {
  id: string;
  name: string;
  horizon: number;
  expectedGrowth: number;
  description: string;
  dataPoints: number[];
}

export interface InvestmentScore {
  id: string;
  propertyId: string;
  address: string;
  score: number;
  recommendation: 'Buy' | 'Hold' | 'Sell';
  capRate: string;
  cashOnCash: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  appreciation: string;
}

export interface MarketTrend {
  id: string;
  region: string;
  averagePrice: string;
  averageRent: string;
  daysOnMarket: number;
  inventoryLevel: 'Low' | 'Normal' | 'High';
  date: string;
}

export interface NeighborhoodInsight {
  id: string;
  name: string;
  growthRate: string;
  safetyScore: number;
  amenityScore: number;
  schoolRating: number;
  medianPrice: string;
  trend: 'Rising' | 'Stable' | 'Declining';
}

export interface HeatMapRegion {
  id: string;
  name: string;
  intensity: number;
  metricValue: string;
}

export interface ExecutiveReport {
  id: string;
  title: string;
  date: string;
  author: string;
  status: 'Draft' | 'Published';
  type: 'Market Analysis' | 'Investment Strategy' | 'Quarterly Review';
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  confidence: number;
  impact: 'High' | 'Medium' | 'Low';
  dateGenerated: string;
  category: string;
}

export interface MarketAlert {
  id: string;
  title: string;
  description: string;
  threshold: string;
  type: 'Price Drop' | 'Demand Spike' | 'Inventory Alert';
  status: 'Active' | 'Triggered' | 'Resolved';
  date: string;
}

export interface RiskAnalysisItem {
  id: string;
  factor: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  probability: number;
  mitigation: string;
  impact: string;
}

export interface PriceHistoryItem {
  id: string;
  date: string;
  price: number;
  event: string;
}
