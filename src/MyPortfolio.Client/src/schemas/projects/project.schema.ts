import { z } from "zod";

export const projectItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  techstack: z.string(),
  link: z.string().url(),
  mediaUrl: z.string().url().nullable(),
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
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  techstack: z.string().min(1, "Techstack is required"), // comma-separated string
  link: z.string().url("Must be a valid URL"),
});

export type ProjectListResponse = z.infer<typeof projectListSchema>;

export type ProjectItem = z.infer<typeof projectItemSchema>;

export type ProjectListData = ProjectListResponse["data"];

export type ProjectInput = z.infer<typeof ProjectInputSchema>;