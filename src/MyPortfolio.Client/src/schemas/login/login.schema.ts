import { z } from "zod";

export const loginInputSchema = z.object({
  email: z.string(),
  password: z.string()
});

export const loginResponseSchema = z.object({
  data: z.object({
    token: z.string(),
    refreshToken: z.string()
  }),
  message: z.string()
});

export type LoginApiResponse = z.infer<typeof loginResponseSchema>;