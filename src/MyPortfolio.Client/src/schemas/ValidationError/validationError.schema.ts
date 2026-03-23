import { z } from "zod";

export const validationErrorSchema = z.object({
  propertyName: z.string(),
  errorMessage: z.string()
});

export const validationResponseSchema = z.object({
  type: z.string(),
  title: z.string(),
  status: z.number(),
  detail: z.string(),
  errors: z.array(validationErrorSchema)
});

export type ValidationError = z.infer<typeof validationErrorSchema>;
export type ValidationResponse = z.infer<typeof validationResponseSchema>;