import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiError } from "../types";

const api = axios.create({
  baseURL: "https://salaestudio-api.aaron-navarro.workers.dev/api",
});

// antes de cada request le pongo el token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// si el back responde 401 cierro la sesion y mando al login
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // en el login no, porque ahi el 401 es contraseña mala y quiero mostrar el mensaje
    if (error.response?.status === 401 && !error.config?.url?.includes("/auth/login")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
