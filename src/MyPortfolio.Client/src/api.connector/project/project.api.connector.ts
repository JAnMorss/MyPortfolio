import {
  projectListSchema,
  projectItemSchema,
  ProjectInputSchema,
  type ProjectListData,
  type ProjectItem,
  type ProjectInput,
  ProjectMediaSchema
} from "@/schemas/projects/project.schema";

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

export const projectApiConnector = {
  getProjects: async (): Promise<ProjectListData> => {
    const response = await api.get("/project");
    return projectListSchema.parse(response.data).data;
  },

  getProjectById: async (id: string): Promise<ProjectItem> => {
    const response = await api.get(`/project/${id}`);
    return projectItemSchema.parse(response.data.data);
  },

  createProject: async (data: ProjectInput): Promise<ProjectItem> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized");

    const validData = ProjectInputSchema.parse(data);
    const response = await api.post(`/project`, validData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return projectItemSchema.parse(response.data.data);
  },

  updateProject: async (id: string, data: ProjectInput): Promise<ProjectItem> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized");

    const validData = ProjectInputSchema.parse(data);
    const response = await api.patch(`/project/${id}`, validData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return projectItemSchema.parse(response.data.data);
  },

  deleteProject: async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized");

    await api.delete(`/project/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getProjectMedia: async (id: string) => {
    const response = await api.get(`/project/media/${id}`);

    const parsed = ProjectMediaSchema.parse(response.data);

    return parsed.data; 
  },

  updateProjectMedia: async (id: string, file: File): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized");

    const formData = new FormData();
    formData.append("file", file);

    await api.put(`/project/${id}/media`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
