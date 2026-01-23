
import axios, { AxiosError } from "axios";
import { useAuthStore } from "../store/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  // baseURL: import.meta.env.MODE ==="development" ? import.meta.env.VITE_API_URL + "/api" : "/api", // e.g. "http://localhost:5000/api"
  // timeout: 10000,
  withCredentials: true, // cookies enabled
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ status: number; message: string }>) => {
    if (
      error.response?.data?.status === 401 &&
      error.response?.data?.message === "UNAUTHORIZED"
    ) {
      
      const { logout } = useAuthStore.getState();

      logout()
      // hard redirect (safe outside React)
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
