import http from "./http";

export const propertyLocationApi = {
  getPropertyLocations: () =>
    http.get("/property-locations"),
};