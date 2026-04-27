import {
  experienceListSchema,
  experienceItemSchema,
  ExperienceInputSchema,
  type ExperienceListData,
  type ExperienceItem,
  type ExperienceInput,
} from "@/schemas/experience/experience.schema";

import { createApiClient } from "@/api.connector/axios.client";

const api = createApiClient();

export const experienceApiConnector = {
  getExperiences: async (page: number = 1, pageSize: number = 10, search?: string, sortBy?: string): Promise<ExperienceListData> => {
    const params: any = { page, pageSize };
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;
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