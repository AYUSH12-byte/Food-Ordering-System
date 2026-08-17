import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:7000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT automatically
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle authentication errors
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401
    ) {
      const currentPath =
        window.location.pathname;

      // Don't redirect repeatedly from login/register
      if (
        currentPath !== "/login" &&
        currentPath !== "/register"
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href =
          "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;