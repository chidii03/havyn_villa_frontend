import { z } from "zod";

/**
 * Mirrors the backend's pagination envelope
 * (apps/api/.../common/web/PageResponse.java, project-docs/architecture/03-api-design.md#conventions):
 * `{ data, page, size, total, nextCursor }`.
 */
export function pageResponseSchema<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    data: z.array(item),
    page: z.number().int().nonnegative(),
    size: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    nextCursor: z.string().nullable(),
  });
}

export type PageResponse<T> = {
  data: T[];
  page: number;
  size: number;
  total: number;
  nextCursor: string | null;
};
