import { z } from "zod";

export const educationItemSchema = z.object({
  id: z.string().uuid(),
  school: z.string(),
  degree: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  userId: z.string().uuid(),
});

export const educationListSchema = z.object({
  data: z.object({
    items: z.array(educationItemSchema),
    totalCount: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
  }),
  message: z.string(),
});

export const EducationInputSchema = z.object({
  school: z.string().min(1, "School is required"),
  degree: z.string().min(1, "Degree is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().nullable().optional(),
  description: z.string().min(1, "Description is required"),
});

export type EducationItem = z.infer<typeof educationItemSchema>;

export type EducationListResponse = z.infer<typeof educationListSchema>;

export type EducationListData = EducationListResponse["data"];

export type EducationInput = z.infer<typeof EducationInputSchema>;