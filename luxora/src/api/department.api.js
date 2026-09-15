import http from "./http";

export const departmentApi = {
  // GET /departments
  getDepartments: () =>
    http.get("/departments"),
};