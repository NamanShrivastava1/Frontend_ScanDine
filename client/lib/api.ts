import axios from "axios";

// Determine the base URL.
// If VITE_API_BASE_URL is provided, use it. Otherwise, throw an error to prevent misconfiguration.
const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error("VITE_API_BASE_URL is not defined");
}

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
