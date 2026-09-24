// Import the shared HTTP client so authenticated requests receive the JWT automatically.
import http from './http';

// Define the API methods used by the Property Details Contact Agent flow.
export const inquiryApi = {
  // POST /inquiries -> { inquiry, conversation, initialMessage, created }
  createInquiry: (payload, idempotencyKey) =>
    http.post('/inquiries', payload, {
      headers: {
        'X-Idempotency-Key': idempotencyKey,
      },
    }),
};
