import axios from "axios";

// Determine the base URL.
// If VITE_API_BASE_URL is provided, use it.
// Otherwise, fallback to the Render production API URL.
const baseURL = import.meta.env.VITE_API_BASE_URL || "https://backend-7hhj.onrender.com/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
