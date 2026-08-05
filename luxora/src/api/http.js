import axios from "axios";
import getToken from "./token";

//let the dev proxy handle forwarding without any env file at all
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 3000, // 3 seconds timeout- generous enough for the PDF generation endpoints
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// -- Request interceptor: attach the bearer token -------------------

http.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export class ApiError extends Error {
  constructor({ message, status, code, errors, isNetwork, isCancel }) {
    super(message);
    this.name = "ApiError";
    this.status = status ?? null; //http status, or null if never sent
    this.code = code ?? null; //axios code e.g 'ECONNABORTED
    this.errors = errors ?? null; // FIELD-LEVEL VALIDATION ERRORS from the API, if any
    this.isNetwork = Boolean(isNetwork);
    this.isCancel = Boolean(isCancel);
  }
}

http.interceptors.response.use((response) => {
  //Binary responses (PDF Downloads) must pass through untouched - there is no JSON envelop to unwrap
  const responseType = response.config?.responseType;
  if (responseType === "blob" || responseType === "arraybuffer") {
    return response.data;
  }
  const body = response.data;

  // the backend wraps everything as { success, message, ...payload} We handle the payload straight back so the callers get the data , not the envlope
  if (body && typeof body === 'object' && 'success' in body) {
    const{ success, message, ...rest } = body;
    return rest; // e.g {token, user } or { data, pagnation} or {}
  }
  //Anything not wrapped (shouldnt happen with this API)passes through .
  return body;
},
(error) => {
    //1.Request was cancelled (component unmounted, superseded search, etc)
    if(axios.isCancel(error)) {
        return Promise.reject(
            new ApiError({ message: 'Request cancelled', isCancel: true })
        );
    }


//2. No response reached us - network down, DNS, CORS, or timeout.
if (!error.response){
    const isTimeout = error.code === 'ECONNABORTED';
    return Promise.reject(
        new ApiError({
            message: isTimeout ? 'The request timed out. Please try again.' : 
            'Network error. Check your connection and try again.',
            code: error.code,
            isNetwork: true,
        })
    );
}

//3. The server responded with an error status code (4xx, 5xx)
const { status, data } = error.response;

//401 anywhere means the session is dead. Clear it and bounce to login- but not while the user is on the login request itself, or we'd wipe the "invalid credentials" message before they can read it .
const isLoginCall = error.config?.url?.includes('/auth/login');
if(status === 401 && !isLoginCall){
    clearToken(); 
    // Preserve where they were so login can send them back afterwards.
    if(typeof window !== 'undefined' && window.location.pathname.startsWith('/app')){
        const next = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.assign(`/login?session=expired&next=${next}`);
    }
}
return Promise.reject(
    new ApiError({
        message: data?.message || `Request failed(${status})`,
        status, 
        errors: data?.errors || null,
    })
);

}

);

export default http;
