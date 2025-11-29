// src/api/api.js
import axios from "axios";

// إنشاء instance
const api = axios.create({
  baseURL: "https://api.maaashi.com/api",
  withCredentials: true, // مهم للكوكيز
});

// دالة لتجديد التوكن باستخدام Axios
const refreshAccessToken = async () => {
  try {
    const { data, status } = await api.post("/refresh-token");
    if (status !== 200) throw new Error("Failed to refresh token");
    return data.access_token; // السيرفر بيرجع توكن جديد
  } catch (err) {
    console.error("Refresh token failed:", err);
    return null;
  }
};

// request interceptor لإضافة التوكن
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor لتجديد التوكن عند 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        localStorage.setItem("access_token", newToken);
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest); // إعادة المحاولة
      }
    }
    return Promise.reject(error);
  }
);

export default api;
