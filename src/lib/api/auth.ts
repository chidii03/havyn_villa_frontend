import type {
  AuthResponse,
  ConfirmPasswordResetInput,
  LoginInput,
  RegisterInput,
  RequestPasswordResetInput,
  UpdateMeInput,
  UserSummary,
} from "@havyn/shared";
import { apiFetch } from "./http";

export function register(input: RegisterInput) {
  return apiFetch<AuthResponse>("/api/v1/auth/register", { method: "POST", body: input });
}

export function login(input: LoginInput) {
  return apiFetch<AuthResponse>("/api/v1/auth/login", { method: "POST", body: input });
}

export function googleLogin(idToken: string) {
  return apiFetch<AuthResponse>("/api/v1/auth/google", { method: "POST", body: { idToken } });
}

/** Web relies on the httpOnly cookie; refreshToken is only needed for a mobile client. */
export function refresh(refreshToken?: string) {
  return apiFetch<AuthResponse>("/api/v1/auth/refresh", { method: "POST", body: { refreshToken } });
}

export function logout(refreshToken?: string) {
  return apiFetch<void>("/api/v1/auth/logout", { method: "POST", body: { refreshToken } });
}

export function verifyEmail(token: string) {
  return apiFetch<void>("/api/v1/auth/verify-email", { method: "POST", body: { token } });
}

export function requestPasswordReset(input: RequestPasswordResetInput) {
  return apiFetch<void>("/api/v1/auth/password-reset/request", { method: "POST", body: input });
}

export function confirmPasswordReset(input: ConfirmPasswordResetInput) {
  return apiFetch<void>("/api/v1/auth/password-reset/confirm", { method: "POST", body: input });
}

export function getMe(accessToken: string) {
  return apiFetch<UserSummary>("/api/v1/me", { accessToken });
}

export function updateMe(accessToken: string, input: UpdateMeInput) {
  return apiFetch<UserSummary>("/api/v1/me", { method: "PATCH", accessToken, body: input });
}
