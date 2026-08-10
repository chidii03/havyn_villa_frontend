import { apiErrorResponseSchema } from "@havyn/shared";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: { field: string; message: string }[];
  readonly traceId?: string;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: { field: string; message: string }[],
    traceId?: string,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.traceId = traceId;
  }
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  accessToken?: string;
  body?: unknown;
  /** Forward an explicit Cookie header for server-side calls — see lib/api/server.ts. */
  cookie?: string;
}

/**
 * Thin fetch wrapper: JSON in/out, Bearer auth, and parses the backend's
 * `{ error: { code, message, details, traceId } }` envelope into a typed
 * {@link ApiError} — see project-docs/architecture/03-api-design.md#errors.
 *
 * `credentials: "include"` sends/receives the httpOnly `havyn_refresh` cookie even
 * though the API is on a different origin in dev (localhost:3000 -> :8080); the
 * backend's CORS config allows credentials from the exact WEB_BASE_URL origin.
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { accessToken, body, cookie, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  // A failure response isn't guaranteed to be our JSON envelope — a reverse proxy
  // returning an HTML error page for a 502/504 is common and must not crash this with
  // a raw SyntaxError.
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = undefined;
  }

  if (!response.ok) {
    const parsed = apiErrorResponseSchema.safeParse(data);
    if (parsed.success) {
      const { code, message, details, traceId } = parsed.data.error;
      throw new ApiError(response.status, code, message, details, traceId);
    }
    throw new ApiError(response.status, "UNKNOWN_ERROR", `Request failed with status ${response.status}`);
  }

  return data as T;
}
