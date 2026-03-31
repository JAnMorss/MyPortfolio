import { z } from "zod";

export const LevelEnum = z.enum(["0", "1", "2"]);

export const LevelLabel: Record<string, string> = {
  "0": "Beginner",
  "1": "Intermediate",
  "2": "Advanced",
};

export const skillItemSchema = z.object({
  id: z.string().uuid(),
  skillName: z.string(),

  level: z.union([z.number(), z.string()]).transform((val) =>
    String(val)
  ),

  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  userId: z.string().uuid(),
});

export const skillListSchema = z.object({
  data: z.object({
    items: z.array(skillItemSchema),
    totalCount: z.number(),
    page: z.number(),
    pageSize: z.number(),
  }),
  message: z.string(),
});

export const SkillInputSchema = z.object({
  skillName: z.string().min(1, "Skill is required"),
  level: z.number().min(0).max(2),
});

export type SkillItem = z.infer<typeof skillItemSchema>;
export type SkillListResponse = z.infer<typeof skillListSchema>;
export type SkillListData = SkillListResponse["data"];
export type SkillInput = z.infer<typeof SkillInputSchema>;