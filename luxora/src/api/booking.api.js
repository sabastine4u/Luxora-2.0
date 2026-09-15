// Import the shared HTTP client so the authenticated Buyer token is added automatically.
import http from './http';

// Define the API methods used by the Buyer Viewing Requests feature.
export const bookingApi = {
  // GET /bookings/my -> { results, data: { bookings } }
  getMyBookings: () =>
    http.get('/bookings/my'),

    // GET /bookings/agency -> returns viewing requests for the authenticated Agency's properties.
  getAgencyBookings: () =>
    http.get('/bookings/agency'),

  // POST /bookings -> { data: { booking } }
  createBooking: (bookingData) =>
    http.post('/bookings', bookingData),

  
 // PATCH /bookings/:bookingId/cancel -> cancels the Buyer's viewing request.
cancelBooking: (bookingId) =>
  http.patch(`/bookings/${bookingId}/cancel`),


// PATCH /bookings/:bookingId/reschedule -> reschedules the Buyer's viewing request.
rescheduleBooking: (bookingId, rescheduleData) =>
  http.patch(`/bookings/${bookingId}/reschedule`, rescheduleData),

};


