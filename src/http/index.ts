import axios from "axios";

const API_BASE_URL =
  process.env.VITE_API_BASE_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3000");

const http = axios.create({
  baseURL: `${API_BASE_URL.replace(/\/$/, "")}/`,
});

http.interceptors.request.use(
  function (config) {
    const token =
      sessionStorage.getItem("accessToken") ?? sessionStorage.getItem("token");

    config.headers = config.headers ?? {};

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default http;
