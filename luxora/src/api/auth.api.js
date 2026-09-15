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

        // PATCH /auth/profile -> { user }
    // Updates the authenticated user's basic profile information.
    updateProfile: (payload) =>
        http.patch('/auth/profile', payload),

    // PATCH /auth/profile/photo -> { user }
// Upload a new profile picture for the authenticated user.
uploadProfilePhoto: (file) => {
    const formData = new FormData();

    // Attach the selected image under the backend's expected field name.
    formData.append('avatar', file);

    return http.patch('/auth/profile/photo', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
},
    // PATCH /auth/change-password -> change the authenticated user's password.
    changePassword: (currentPassword, newPassword) =>
        http.patch('/auth/change-password', {
            currentPassword,
            newPassword,
        }),
};