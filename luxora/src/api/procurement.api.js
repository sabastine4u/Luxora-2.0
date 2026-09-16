import http from './http';

export const PROCUREMENT_DATA_CHANGED = 'luxora:procurement-data-changed';

// The shared sidebar listens for this event and refreshes its live counts
// after a successful Procurement mutation.
export const notifyProcurementDataChanged = () => {
  window.dispatchEvent(new Event(PROCUREMENT_DATA_CHANGED));
};

// Procurement records are typed by the backend so one API module covers the
// coherent operational ledger without duplicating transport code per tab.
export const procurementApi = {
  getOverview: () => http.get('/procurement/overview'),
  getCounts: () => http.get('/procurement/counts'),
  getReport: () => http.get('/procurement/reports'),
  list: (recordType, params = {}) => http.get(`/procurement/${recordType}`, { params }),
  create: (recordType, payload) => http.post(`/procurement/${recordType}`, payload),
  update: (recordType, recordId, payload) => http.patch(`/procurement/${recordType}/${recordId}`, payload),
};
