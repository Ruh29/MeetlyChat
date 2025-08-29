// import axios from "axios";
// import store from "../redux/store";
// import { setTokens, logout } from "../redux/authSlice";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api",
//   withCredentials: true
// });

// // attach access token
// API.interceptors.request.use((config) => {
//   const state = store.getState();
//   const token = state.auth.accessToken;
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // refresh on 401
// let refreshing = null;

// API.interceptors.response.use(
//   (res) => res,
//   async (err) => {
//     const original = err.config;
//     if (err.response?.status === 401 && !original._retry) {
//       original._retry = true;

//       if (!refreshing) {
//         refreshing = axios.post("http://localhost:5000/api/auth/refresh-token", {}, { withCredentials: true })
//           .then((r) => {
//             store.dispatch(setTokens({ accessToken: r.data.accessToken, refreshToken: r.data.refreshToken }));
//             return r.data.accessToken;
//           })
//           .catch(() => {
//             store.dispatch(logout());
//             throw err;
//           })
//           .finally(() => { refreshing = null; });
//       }

//       const newAccess = await refreshing;
//       original.headers.Authorization = `Bearer ${newAccess}`;
//       return axios(original);
//     }
//     return Promise.reject(err);
//   }
// );

// export default API;

// src/api/axios.js
// import axios from "axios";
// import store from "../redux/store";
// import { setTokens, logout } from "../redux/authSlice";

// const API = axios.create({ baseURL: "http://localhost:5000" });

// API.interceptors.response.use(
//   (res) => res,
//   async (err) => {
//     const originalRequest = err.config;
//     if (err.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const state = store.getState().auth;
//         const { refreshToken } = state;
//         const res = await axios.post("http://localhost:5000/api/auth/refresh", { refreshToken });
//         store.dispatch(setTokens(res.data));
//         originalRequest.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
//         return API(originalRequest);
//       } catch (refreshErr) {
//         store.dispatch(logout());
import axios from 'axios';
import store from '../redux/store';
import { setTokens, logout } from '../redux/authSlice';

// Simple API configuration - use environment variable or fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://meetly-chat.vercel.app/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor - attach access token
API.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const state = store.getState();
      const refreshToken = state.auth.refreshToken;

      if (!refreshToken) {
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post('http://localhost:5002/api/auth/refresh-token', 
          { refreshToken },
          { withCredentials: true }
        );
        
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        store.dispatch(setTokens({ 
          accessToken, 
          refreshToken: newRefreshToken || refreshToken 
        }));
        
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;