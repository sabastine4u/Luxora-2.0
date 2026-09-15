// Import the shared HTTP client so the authenticated Owner token is attached automatically.
import http from './http';

// Define the API methods used by the Owner Rental Income feature.
export const paymentApi = {
  // GET /payments/owner -> { results, data: { payments } }
  getOwnerPayments: () =>
    http.get('/payments/owner'),
};