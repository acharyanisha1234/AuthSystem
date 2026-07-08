import axios from "axios";


// AXIOS INSTANCE – Centralized HTTP client for all API calls
const API = axios.create({
  // baseURL is empty → relative to the current origin (frontend server).
  // If frontend and backend are on different ports, you should set this to
  // your backend URL (e.g., "http://localhost:5000").
  baseURL: '',

  // withCredentials: true → send cookies (refreshToken) automatically with every request
  withCredentials: true,

  // Default headers: JSON content type
  headers: { "Content-Type": "application/json" },
});


// REQUEST INTERCEPTOR – Add access token to every outgoing request
API.interceptors.request.use(
  (config) => {
    // Retrieve the access token from localStorage (set on login)
    const token = localStorage.getItem("token");

    // If a token exists, attach it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Return the modified config
    return config;
  },
  (error) => {
    // If the request setup fails, reject the promise
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR – Handle 401 errors by refreshing the token

API.interceptors.response.use(
  // Pass through successful responses
  (response) => response,

  // Catch errors (primarily 401 Unauthorized)
  async (error) => {
    // Store the original request so we can retry it later
    const originalRequest = error.config;

    // Check if the error is a 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Mark this request as "retried" to avoid infinite loops
      originalRequest._retry = true;

      try {
        // Attempt to refresh the access token using the refreshToken cookie
        // The refresh token is sent automatically because withCredentials = true
        const refreshResponse = await axios.get("/api/auth/refresh", {
          withCredentials: true,
        });

        // Extract the new access token from the response
        const { accessToken } = refreshResponse.data;

        if (accessToken) {
          // Save the new token to localStorage
          localStorage.setItem("token", accessToken);

          // Update the Authorization header of the original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          // Retry the original request with the new token
          return API(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails (e.g., expired refresh token), the user must log out
        // Clear stored credentials and redirect to the login page
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect to the homepage (or login page)
        window.location.href = "/";

        // Reject the promise with the refresh error
        return Promise.reject(refreshError);
      }
    }

    // If it's not a 401 or we already retried, just propagate the error
    return Promise.reject(error);
  }
);

// Export the configured axios instance
export default API;