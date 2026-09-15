import http from "./http";

export const homeServicesApi = {
  getOverview: () =>
    http.get("/home-services/overview"),

  getServiceRequests: (params = {}) =>
    http.get("/home-services/requests", {
      params,
    }),

  createServiceRequest: (data) =>
    http.post("/home-services/requests", data),

  assignServiceRequest: (requestId, data) =>
    http.patch(
      `/home-services/requests/${requestId}/assign`,
      data,
    ),

  rejectServiceRequest: (requestId, data = {}) =>
    http.patch(
      `/home-services/requests/${requestId}/reject`,
      data,
    ),

    getServiceProviders: (params = {}) =>
  http.get("/home-services/providers", {
    params,
  }),

createServiceProvider: (data) =>
  http.post("/home-services/providers", data),

approveServiceProvider: (providerId) =>
  http.patch(
    `/home-services/providers/${providerId}/approve`,
  ),

suspendServiceProvider: (providerId) =>
  http.patch(
    `/home-services/providers/${providerId}/suspend`,
  ),

  getServiceBookings: (params = {}) =>
  http.get("/home-services/bookings", {
    params,
  }),

updateServiceBookingStatus: (bookingId, status) =>
  http.patch(
    `/home-services/bookings/${bookingId}/status`,
    { status },
  ),

  getServiceCategories: () =>
  http.get("/home-services/categories"),

createServiceCategory: (data) =>
  http.post("/home-services/categories", data),

updateServiceCategory: (categoryId, data) =>
  http.patch(
    `/home-services/categories/${categoryId}`,
    data,
  ),

toggleServiceCategory: (categoryId) =>
  http.patch(
    `/home-services/categories/${categoryId}/toggle`,
  ),

  getFinancials: () =>
  http.get("/home-services/financials"),

  getAnalytics: () =>
  http.get("/home-services/analytics"),

  getSettings: () =>
  http.get("/home-services/settings"),

updateSettings: (data) =>
  http.patch(
    "/home-services/settings",
    data,
  ),

};



