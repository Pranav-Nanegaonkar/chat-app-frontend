import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  // baseURL: import.meta.env.MODE ==="development" ? import.meta.env.VITE_API_URL + "/api" : "/api", // e.g. "http://localhost:5000/api"
  timeout: 10000,
  withCredentials: true, // cookies enabled
});

// api.interceptors.request.use(
//   (config) => {
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     const { config } = error;

//     // Prevent infinite retry loop
//     if (config._retry) {
//       return Promise.reject(error);
//     }

//     // --------------------------
//     // 1️⃣ ACCESS TOKEN EXPIRED
//     // --------------------------
//     if (
//       error.response?.data?.status === 401 &&
//       error.response?.data?.message === "UNAUTHORIZED"
//     ) {
//       config._retry = true;

//       try {
//         // attempt refresh token
//         await api.get("/auth/refresh");

//         // retry the original request
//         return api(config);
//       } catch (err) {
//         const refreshErr = err as AxiosError<{
//           status: number;
//           message: string;
//         }>;

//         // ------------------------------
//         // 2️⃣ REFRESH TOKEN ALSO INVALID
//         // ------------------------------
//         if (
//           refreshErr.response?.data?.status === 401 &&
//           refreshErr.response?.data?.message === "UNAUTHORIZED_NO_REFRESH"
//         ) {
//           console.log("⛔ Refresh token expired → redirecting to login...");

//           // FORCE LOGOUT → Redirect to login page
//           // window.location.href = "/login";
//         }

//         console.log("ResponseInterceptor:", refreshErr);
//         return Promise.reject(refreshErr);
//       }
//     }

//     // --------------------------
//     // 3️⃣ OTHER ERRORS
//     // --------------------------
//     return Promise.reject(error);
//   }
// );

export default api;
