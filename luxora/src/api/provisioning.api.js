import http from './http';

export const provisioningApi = {
    // POST /users/admin -> { user }  (Super Admin only)
    createAdmin: (fullName, email, password, department) =>
        http.post('/users/admin', { fullName, email, password, department }),

    // POST /agencies -> { agency, temporaryPassword }  (Admin or Super Admin)
    createAgency: (agencyName, contactPerson, email, phone) =>
        http.post('/agencies', { agencyName, contactPerson, email, phone }),

    // POST /users/internal-staff -> { user }  (Admin or Super Admin)
    // role must be one of the 6 whitelisted internal roles
    createInternalStaff: (fullName, email, password, role, department) =>
        http.post('/users/internal-staff', { fullName, email, password, role, department }),
};
