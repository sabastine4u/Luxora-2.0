const TOKEN_KEY = 'Luxora_Token';
const USER_KEY = 'Luxora_User';

export const getToken = ()  => {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
        return null; //localStorage can throw in private-mode /  sandboxed iframes
    };
};

// Saves the JWT after a successful login/register so future requests are authenticated.
// Called once, right after the backend returns { token, user }.
export const setToken = (token) => {
    try {
        localStorage.setItem(TOKEN_KEY, token);
    } catch {
        /* storage unavailable (private mode, etc.) - user just won't stay logged in */
    }
};


//Can be used for logout and to send the user out back to login page when the token expire
export const clearToken = () => {
    try {
       localStorage.removeItem(TOKEN_KEY);
       localStorage.removeItem(USER_KEY); 
    } catch {
        /*  nothing to clear*/
    }
};
