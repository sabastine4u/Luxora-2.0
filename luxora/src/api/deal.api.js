import http from "./http";

export const dealApi = {
  // Get Deals visible to the authenticated user.
  getMyDeals: () =>
    http.get("/deals/my"),

  // Get one Deal by ID.
  getDealById: (dealId) =>
    http.get(`/deals/${dealId}`),

    // Buyer/Owner/Agent/Admin: mark the agreement as completed.
  completeAgreement: (dealId) =>
    http.patch(
      `/deals/${dealId}/agreement-complete`,
    ),


      // Buyer/Owner/Agent/Admin: cancel an active Deal before payment verification/finalization.
  cancelDeal: (dealId, reason) =>
    http.patch(
      `/deals/${dealId}/cancel`,
      {
        reason,
      },
    ),
    
  // Finance/Admin: verify payment on an Agreement-completed Deal.
  verifyPayment: (dealId) =>
    http.patch(
      `/deals/${dealId}/payment-verify`,
    ),

  // Finance/Admin: complete a Payment-verified Deal.
  completeDeal: (dealId) =>
    http.patch(
      `/deals/${dealId}/complete`,
    ),
};