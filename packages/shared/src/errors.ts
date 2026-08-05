import { z } from "zod";

/**
 * Mirrors the backend's consistent error envelope
 * (apps/api/.../common/error/ErrorResponse.java, project-docs/architecture/03-api-design.md#errors):
 * `{ "error": { "code", "message", "details": [...], "traceId" } }`.
 */
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
