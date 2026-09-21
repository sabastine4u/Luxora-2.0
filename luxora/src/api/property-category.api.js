import http from "./http";

export const propertyCategoryApi = {
  getPropertyCategories: () =>
    http.get("/property-categories"),
};