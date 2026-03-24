import { z } from "zod";

export const userProfileSchema = z.object({
  data: z.object({
    id: z.string(),
    fullName: z.string(),
    age: z.number().int().nonnegative(),
    role: z.string(),
    email: z.string(),
    photo: z.string(),
    headLine: z.string(),
    about: z.string(),
    updatedAt: z.string().nullable() 
  }),
  message: z.string()
});

export const UpdateUserProfileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  age: z.number(),
  headLine: z.string(),
  about: z.string(),
});

export type UserProfileResponse = z.infer<typeof userProfileSchema>;

export type UserProfileData = UserProfileResponse["data"];

export type UpdateUserProfileInput = z.infer<typeof UpdateUserProfileSchema>;