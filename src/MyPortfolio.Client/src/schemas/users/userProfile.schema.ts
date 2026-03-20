import { z } from "zod";

export const userProfileSchema = z.object({
  data: z.object({
    id: z.string().uuid(),
    fullName: z.string(),
    age: z.number().int().nonnegative(),
    role: z.string(),
    email: z.string().email(),
    photo: z.string().url(),
    headLine: z.string(),
    about: z.string(),
    updatedAt: z.string().nullable() 
  }),
  message: z.string()
});

export type UserProfileResponse = z.infer<typeof userProfileSchema>;

export type UserProfileData = UserProfileResponse["data"];