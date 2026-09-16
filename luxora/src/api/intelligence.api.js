import { analyticsApi } from './analytics.api';

// Dedicated alias for the existing Intelligence namespace. Owner analytics remains isolated.
export const intelligenceApi = {
  getOverview: analyticsApi.getIntelligenceOverview,
  getCounts: analyticsApi.getIntelligenceCounts,
  getMarketTrends: analyticsApi.getMarketTrends,
  getNeighborhoods: analyticsApi.getNeighborhoods,
  getHeatMap: analyticsApi.getHeatMap,
  getComparables: analyticsApi.getComparables,
  getRentalYield: analyticsApi.getRentalYield,
  calculateROI: analyticsApi.calculateROI,
  getROICalculation: analyticsApi.calculateROI,
  getGrowthForecast: analyticsApi.getGrowthForecast,
  getInvestmentScores: analyticsApi.getInvestmentScores,
  getRiskAnalysis: analyticsApi.getRiskAnalysis,
  getReports: analyticsApi.getIntelligenceReports,
  getAlerts: analyticsApi.getIntelligenceAlerts,
};
