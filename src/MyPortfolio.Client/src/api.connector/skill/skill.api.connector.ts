import {
  skillListSchema,
  skillItemSchema,
  SkillInputSchema,
  type SkillListData,
  type SkillItem,
  type SkillInput,
} from "@/schemas/skills/skill.schema";

import { createApiClient } from "@/api.connector/axios.client";

const api = createApiClient();

export const skillApiConnector = {
  getSkills: async (page: number = 1, pageSize: number = 10, search?: string, sortBy?: string): Promise<SkillListData> => {
    const params: any = { page, pageSize };
    if (search) params.search = search;
    if (sortBy) params.sortBy = sortBy;
    const response = await api.get("/skill", { params });
    return skillListSchema.parse(response.data).data;
  },

  getAllSkills: async (): Promise<SkillItem[]> => {
    const allSkills: SkillItem[] = [];
    let page = 1;
    const pageSize = 50;

    while (true) {
      const data = await skillApiConnector.getSkills(page, pageSize);
      allSkills.push(...data.items);

      if (allSkills.length >= data.totalCount) {
        break;
      }

      page += 1;
    }

    return allSkills;
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