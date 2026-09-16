import http from './http';

export const PROPERTY_MANAGEMENT_DATA_CHANGED = 'luxora:property-management-data-changed';
export const notifyPropertyManagementDataChanged = () => window.dispatchEvent(new Event(PROPERTY_MANAGEMENT_DATA_CHANGED));

const root = '/property-management';

// Property Manager transport lives here so dashboard components never create
// their own HTTP clients or invent route names.
export const propertyManagementApi = {
  properties: () => http.get(`${root}/properties`),
  summary: () => http.get(`${root}/summary`),
  analytics: () => http.get(`${root}/analytics`),
  documents: () => http.get(`${root}/documents`),
  list: (resource, params = {}) => http.get(`${root}/${resource}`, { params }),
  get: (resource, id) => http.get(`${root}/${resource}/${id}`),
  create: (resource, payload) => http.post(`${root}/${resource}`, payload),
  update: (resource, id, payload) => http.patch(`${root}/${resource}/${id}`, payload),
  renewLease: (id, payload) => http.patch(`${root}/leases/${id}/renew`, payload),
  terminateLease: (id, payload) => http.patch(`${root}/leases/${id}/terminate`, payload),
  assignWorkOrder: (id, payload) => http.patch(`${root}/work-orders/${id}/assign`, payload),
  updateWorkOrderStatus: (id, payload) => http.patch(`${root}/work-orders/${id}/status`, payload),
  bulkAssignWorkOrders: (payload) => http.patch(`${root}/work-orders/bulk-assign`, payload),
  completeInspection: (id, payload) => http.patch(`${root}/inspections/${id}/complete`, payload),
  updatePaymentStatus: (id, payload) => http.patch(`${root}/payments/${id}/status`, payload),
  approveExpense: (id) => http.patch(`${root}/expenses/${id}/approve`),
};
