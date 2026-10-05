// Import the shared HTTP client so the authenticated Buyer token is attached automatically.
import http from "./http";

// Define the API methods used by the Buyer Offers feature.
export const offerApi = {
  // GET /offers/my -> { results, data: { offers } }
  getMyOffers: () =>
    http.get("/offers/my"),

  // GET /offers/owner -> { results, data: { offers } }
getOwnerOffers: () =>
  http.get("/offers/owner"),

// GET /offers/agency
// Fetch Offers associated with Properties belonging to the authenticated Agency.
getAgencyOffers: () =>
  http.get('/offers/agency'),

// GET /offers/agent
// Fetch Offers assigned to the authenticated Agent.
getAgentOffers: () =>
  http.get('/offers/agent'),

// GET /offers/admin
// Fetch Offers only for Properties created by the authenticated Admin.
getAdminOffers: () =>
  http.get('/offers/admin'),

// GET /offers/super-admin
// Fetch Offers only for Properties created by the authenticated Super Admin.
getSuperAdminOffers: () =>
  http.get('/offers/super-admin'),

  // POST /offers -> { data: { offer } }
  createOffer: (offerData) =>
    http.post("/offers", offerData),

  // PATCH /offers/:offerId/withdraw -> { data: { offer } }
withdrawOffer: (offerId) =>
  http.patch(`/offers/${offerId}/withdraw`),

// Accept an incoming Offer as the authenticated Owner.
acceptOffer: (offerId) =>
  http.patch(`/offers/${offerId}/accept`),

// Reject an incoming Offer as the authenticated Owner.
rejectOffer: (offerId) =>
  http.patch(`/offers/${offerId}/reject`),

// Submit a counter offer to the Buyer.
counterOffer: (offerId, counterOfferData) =>
  http.patch(`/offers/${offerId}/counter`, counterOfferData),

acceptCounterOffer: (offerId) =>
  http.patch(`/offers/${offerId}/accept-counter`),

rejectCounterOffer: (offerId) =>
  http.patch(`/offers/${offerId}/reject-counter`),

buyerCounterOffer: (offerId, counterData) =>
  http.patch(`/offers/${offerId}/buyer-counter`, counterData),

};