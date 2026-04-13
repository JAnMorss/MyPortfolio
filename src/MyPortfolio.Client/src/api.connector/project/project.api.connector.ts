import {
  projectListSchema,
  projectItemSchema,
  ProjectInputSchema,
  type ProjectListData,
  type ProjectItem,
  type ProjectInput,
  ProjectMediaSchema,
  type ProjectMediaData
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
  getProjects: async (page: number = 1, pageSize: number = 10, search?: string, sortBy?: string): Promise<ProjectListData> => {
    const params: any = { page, pageSize };
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;
    const response = await api.get("/project", { params });
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

  getProjectMedia: async (projectId: string): Promise<ProjectMediaData> => {
    const response = await api.get(`/project/${projectId}/media`);
    const parsed = ProjectMediaSchema.parse(response.data);
    return parsed.data; 
  },

  addProjectMedia: async (
    projectId: string,
    file: File
  ): Promise<void> => {
    const formData = new FormData();

    formData.append("files", file);

    await api.post(`/project/${projectId}/media`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  removeProjectMedia: async (
    projectId: string,
    mediaUrl: string
  ): Promise<void> => {
    await api.delete(`/project/${projectId}/media`, {
      params: { mediaUrl },
    });
  },
};
