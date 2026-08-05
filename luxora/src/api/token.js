const TOKEN_KEY = 'Luxora_Token';
const USER_KEY = 'Luxora_User';

export const getToken = ()  => {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
        return null; //localStorage can throw in private-mode /  sandboxed iframes
    };
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
