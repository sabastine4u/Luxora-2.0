import http from './http';

export const authApi = {
    // POST /auth/login -> { token, user}
    login: (email, password) => 
        http.post('/auth/login', { email, password }), 
};