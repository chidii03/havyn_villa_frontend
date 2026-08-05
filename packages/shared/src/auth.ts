import { z } from "zod";

/**
 * Mirrors apps/api/.../auth/web/*Request.java — kept in lockstep by hand since the
 * backend doesn't (yet) publish a machine-readable schema. If a constraint changes on
 * one side, update the other.
 */
export const registerSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address").max(255),
  password: z.string().min(8, "Use at least 8 characters").max(100),
  fullName: z.string().trim().min(1, "Name is required").max(120),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const requestPasswordResetSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
});
export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>;

export const confirmPasswordResetSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8, "Use at least 8 characters").max(100),
});
export type ConfirmPasswordResetInput = z.infer<typeof confirmPasswordResetSchema>;

export const updateMeSchema = z.object({
  fullName: z.string().trim().max(120).optional(),
  phone: z.string().trim().max(30).optional(),
});
export type UpdateMeInput = z.infer<typeof updateMeSchema>;

/** Mirrors auth/web/UserSummary.java. */
export interface UserSummary {
  id: string;
  email: string;
  emailVerified: boolean;
  roles: string[];
  fullName: string | null;
  phone: string | null;
  avatarUrl: string | null;
}

/** Mirrors auth/web/AuthResponse.java. */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: UserSummary;
}
