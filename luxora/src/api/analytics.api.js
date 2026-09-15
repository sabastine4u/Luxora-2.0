// Import the shared HTTP client used by the authenticated dashboard APIs.
import http from './http';

// Define the Owner analytics API methods.
export const analyticsApi = {
  // GET /analytics/owner -> real Owner analytics from the backend.
  getOwnerAnalytics: () => http.get('/analytics/owner'),
};