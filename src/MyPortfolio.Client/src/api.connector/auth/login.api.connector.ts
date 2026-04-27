import { loginInputSchema, loginResponseSchema, type LoginApiResponse } from "@/schemas/login/login.schema";
import { validationResponseSchema } from "@/schemas/ValidationError/validationError.schema";
import axios, { AxiosHeaders, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { refreshAccessToken } from "@/api.connector/axios.client";

const BASE_URL = "http://localhost:8026/api/v1/auth";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      if (!config.headers) config.headers = new AxiosHeaders();
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response?.data) {
      const parsed = validationResponseSchema.safeParse(error.response.data);
      if (parsed.success) return Promise.reject({ type: "validation", data: parsed.data });
    }
    return Promise.reject(error);
  }
);

export const loginApiConnector = {
  login: async (data: unknown): Promise<LoginApiResponse> => {
    const validRequest = loginInputSchema.parse(data);
    const response = await api.post("/login", validRequest);
    const parsedResponse = loginResponseSchema.parse(response.data);

    if ("data" in parsedResponse) {
      const { token, refreshToken } = parsedResponse.data;
      localStorage.setItem("token", token);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    }

    return parsedResponse;
  },

  refreshToken: async (): Promise<{ token: string; refreshToken: string }> => {
    return await refreshAccessToken();
  },

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  },

  get: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.get(url, config);
    return response.data;
  },

  post: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.post(url, data, config);
    return response.data;
  },
};