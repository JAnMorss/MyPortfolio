import { z } from "zod";

export const projectItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  techstack: z.string(),
  link: z.string().url(),
  mediaUrls: z.array(z.string().url()).nullable(), 
  createdAt: z.string(), 
  updatedAt: z.string().nullable(),
  userId: z.string().uuid(),
});

export const projectListSchema = z.object({
  data: z.object({
    items: z.array(projectItemSchema),
    totalCount: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
  }),
  message: z.string(),
});

export const ProjectInputSchema = z.object({
  title: z.string(),
  description: z.string(),
  techstack: z.string(),
  link: z.string(),
});

export const ProjectMediaSchema = z.object({
  data: z.object({
    mediaUrls: z.array(z.string()),
  }),
  message: z.string(),
});

export type ProjectListResponse = z.infer<typeof projectListSchema>;
export type ProjectItem = z.infer<typeof projectItemSchema>;
export type ProjectListData = ProjectListResponse["data"];
export type ProjectInput = z.infer<typeof ProjectInputSchema>;
export type ProjectMediaData = z.infer<typeof ProjectMediaSchema>["data"];