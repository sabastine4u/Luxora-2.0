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
};