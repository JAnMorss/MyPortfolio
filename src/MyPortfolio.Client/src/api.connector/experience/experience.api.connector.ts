import {
  experienceListSchema,
  experienceItemSchema,
  ExperienceInputSchema,
  type ExperienceListData,
  type ExperienceItem,
  type ExperienceInput,
} from "@/schemas/experience/experience.schema";

import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  AxiosHeaders,
  type AxiosResponse,
} from "axios";

const BASE_URL = "http://localhost:8026/api/v1";

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
  (response: AxiosResponse) => response,
  (error) => Promise.reject(error)
);

export const experienceApiConnector = {
  getExperiences: async (page: number = 1, pageSize: number = 10, search?: string): Promise<ExperienceListData> => {
    const params: any = { page, pageSize };
    if (search) params.search = search;
    const response = await api.get("/experience", { params });
    return experienceListSchema.parse(response.data).data;
  },

  getExperienceById: async (id: string): Promise<ExperienceItem> => {
    const response = await api.get(`/experience/${id}`);
    return experienceItemSchema.parse(response.data.data);
  },

  createExperience: async (
    data: ExperienceInput
  ): Promise<ExperienceItem> => {
    const validData = ExperienceInputSchema.parse(data);

    const response = await api.post("/experience", validData);
    return experienceItemSchema.parse(response.data.data);
  },

  updateExperience: async (
    id: string,
    data: ExperienceInput
  ): Promise<ExperienceItem> => {
    const validData = ExperienceInputSchema.parse(data);

    const response = await api.patch(`/experience/${id}`, validData);
    return experienceItemSchema.parse(response.data.data);
  },

  deleteExperience: async (id: string): Promise<void> => {
    await api.delete(`/experience/${id}`);
  },
};