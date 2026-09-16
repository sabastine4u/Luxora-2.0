// Import the shared HTTP client used by the authenticated dashboard APIs.
import http from './http';

// Define the Owner analytics API methods.
export const analyticsApi = {
  // GET /analytics/owner -> real Owner analytics from the backend.
  getOwnerAnalytics: () => http.get('/analytics/owner'),
  // Separate Intelligence namespace; this does not alter Owner analytics.
  getIntelligenceOverview: (params = {}) => http.get('/intelligence/overview', { params }),
  getIntelligenceCounts: () => http.get('/intelligence/counts'),
  getMarketTrends: (params = {}) => http.get('/intelligence/market-trends', { params }),
  getNeighborhoods: (params = {}) => http.get('/intelligence/neighborhoods', { params }),
  getHeatMap: (params = {}) => http.get('/intelligence/heat-map', { params }),
  getComparables: (params = {}) => http.get('/intelligence/comparables', { params }),
  getRentalYield: (params = {}) => http.get('/intelligence/rental-yield', { params }),
  calculateROI: (payload) => http.post('/intelligence/roi-calculation', payload),
  getGrowthForecast: (params = {}) => http.get('/intelligence/growth-forecast', { params }),
  getInvestmentScores: (params = {}) => http.get('/intelligence/investment-scores', { params }),
  getRiskAnalysis: (params = {}) => http.get('/intelligence/risk-analysis', { params }),
  getIntelligenceReports: (params = {}) => http.get('/intelligence/reports', { params }),
  getIntelligenceAlerts: (params = {}) => http.get('/intelligence/alerts', { params }),
};
