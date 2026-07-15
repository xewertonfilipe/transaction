import { navigateToUrl } from "single-spa";
import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3000/",
});

http.interceptors.request.use(
  function (config) {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    navigateToUrl("/");
    return config;
  },
  function (error) {
    navigateToUrl("/");
    return Promise.reject(error);
  }
);

export default http;
