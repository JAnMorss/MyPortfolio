import axios, { AxiosHeaders, type AxiosInstance, type InternalAxiosRequestConfig, type AxiosRequestConfig } from "axios";

const API_BASE_URL = "http://localhost:8026/api/v1";
const AUTH_BASE_URL = "http://localhost:8026/api/v1/auth";

export const forceLogout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  window.dispatchEvent(new Event("forceLogout"));
};

export const refreshAccessToken = async (): Promise<{ token: string; refreshToken: string }> => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    forceLogout();
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post(
      `${AUTH_BASE_URL}/refresh-token`,
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    if (!data?.token || !data?.refreshToken) {
      throw new Error("Invalid refresh token response");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);

    return { token: data.token, refreshToken: data.refreshToken };
  } catch (error) {
    forceLogout();
    if (axios.isAxiosError(error) && error.response?.data) {
      throw error;
    }
    throw error;
  }
};

export const createApiClient = (baseURL: string = API_BASE_URL): AxiosInstance => {
  const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem("token");
      if (token) {
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }
        config.headers.set("Authorization", `Bearer ${token}`);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (!axios.isAxiosError(error) || !error.config) {
        return Promise.reject(error);
      }

      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const { token } = await refreshAccessToken();
          if (!originalRequest.headers) {
            originalRequest.headers = new AxiosHeaders();
          }
          originalRequest.headers.set("Authorization", `Bearer ${token}`);
          return api(originalRequest as AxiosRequestConfig);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};
