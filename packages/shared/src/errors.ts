import { z } from "zod";

export const errorDetailSchema = z.object({
  field: z.string(),
  message: z.string(),
});
export type ErrorDetail = z.infer<typeof errorDetailSchema>;

export const apiErrorBodySchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.array(errorDetailSchema).optional(),
  traceId: z.string().optional(),
});
export type ApiErrorBody = z.infer<typeof apiErrorBodySchema>;

export const apiErrorResponseSchema = z.object({
  error: apiErrorBodySchema,
});
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
