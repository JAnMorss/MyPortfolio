import {
  educationListSchema,
  educationItemSchema,
  EducationInputSchema,
  type EducationListData,
  type EducationItem,
  type EducationInput,
} from "@/schemas/educations/education.schema";

import { createApiClient } from "@/api.connector/axios.client";

const api = createApiClient();

export const educationApiConnector = {
  getEducations: async (page: number = 1, pageSize: number = 10, search?: string, sortBy?: string): Promise<EducationListData> => {
    const params: any = { page, pageSize };
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;
    const response = await api.get("/educations", { params });
    return educationListSchema.parse(response.data).data;
  },

  getEducationById: async (id: string): Promise<EducationItem> => {
    const response = await api.get(`/educations/${id}`);
    return educationItemSchema.parse(response.data.data);
  },

  createEducation: async (
    data: EducationInput
  ): Promise<EducationItem> => {
    const validData = EducationInputSchema.parse(data);

    const response = await api.post("/educations", validData);
    return educationItemSchema.parse(response.data.data);
  },

  updateEducation: async (
    id: string,
    data: EducationInput
  ): Promise<EducationItem> => {
    const validData = EducationInputSchema.parse(data);

    const response = await api.patch(`/educations/${id}`, validData);
    return educationItemSchema.parse(response.data.data);
  },

  deleteEducation: async (id: string): Promise<void> => {
    await api.delete(`/educations/${id}`);
  },
};