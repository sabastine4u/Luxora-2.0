import http from './http';

export const authApi = {
    // POST /auth/login -> { token, user}
    login: (email, password) => 
        http.post('/auth/login', { email, password }), 

    // POST /auth/register -> { user }  (note: register does NOT return a token - see auth.controller.js)
    // Backend expects these exact field names: fullName, email, password, role
    register: (fullName, email, password, role) =>
        http.post('/auth/register', { fullName, email, password, role }),


    // GET /auth/me -> { user }
    // Requires a valid token (http.js's request interceptor attaches it automatically).
    // Used on page load/refresh to check "is this token still actually valid?"
    getMe: () =>
        http.get('/auth/me'),
};