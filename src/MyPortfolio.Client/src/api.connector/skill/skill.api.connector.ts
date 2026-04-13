import {
  skillListSchema,
  skillItemSchema,
  SkillInputSchema,
  type SkillListData,
  type SkillItem,
  type SkillInput,
} from "@/schemas/skills/skill.schema";

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

export const skillApiConnector = {
  getSkills: async (page: number = 1, pageSize: number = 10, search?: string, sortBy?: string): Promise<SkillListData> => {
    const params: any = { page, pageSize };
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;
    const response = await api.get("/skill", { params });
    return skillListSchema.parse(response.data).data;
  },

  createSkill: async (data: SkillInput): Promise<SkillItem> => {
    const validData = SkillInputSchema.parse(data);

    const response = await api.post("/skill", validData);
    return skillItemSchema.parse(response.data.data);
  },

  updateSkill: async (
    id: string,
    data: SkillInput
  ): Promise<SkillItem> => {
    const validData = SkillInputSchema.parse(data);

    const response = await api.patch(`/skill/${id}`, validData);
    return skillItemSchema.parse(response.data.data);
  },

  deleteSkill: async (id: string): Promise<void> => {
    await api.delete(`/skill/${id}`);
  },
};