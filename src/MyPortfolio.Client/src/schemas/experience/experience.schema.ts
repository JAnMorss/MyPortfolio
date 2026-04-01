import { z } from "zod";

export const experienceItemSchema = z.object({
  id: z.string().uuid(),
  companyName: z.string(),
  startDate: z.string(), 
  endDate: z.string().nullable(), 
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  userId: z.string().uuid(),
});

export const experienceListSchema = z.object({
  data: z.object({
    items: z.array(experienceItemSchema),
    totalCount: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
  }),
  message: z.string(),
});

export const ExperienceInputSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  startDate: z.string(), 
  endDate: z.string().nullable().optional(),
  description: z.string().min(1, "Description is required"),
});

export type ExperienceItem = z.infer<typeof experienceItemSchema>;

export type ExperienceListResponse = z.infer<typeof experienceListSchema>;

export type ExperienceListData = ExperienceListResponse["data"];

export type ExperienceInput = z.infer<typeof ExperienceInputSchema>;