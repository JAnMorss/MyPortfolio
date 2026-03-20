import { z } from "zod";

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const loginResponseSchema = z.object({
  data: z.object({
    token: z.string().min(1),
    refreshToken: z.string().min(1)
  }),
  message: z.string()
});