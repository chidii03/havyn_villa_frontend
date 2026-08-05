import { apiFetch } from "./http";

export interface SupportChatMessage {
  id: string | null;
  role: "USER" | "ASSISTANT";
  body: string;
  createdAt: string | null;
}

export interface SupportChatResponse {
  messages: SupportChatMessage[];
}

export function getSupportChat(accessToken: string) {
  return apiFetch<SupportChatResponse>("/api/v1/support/chat", { accessToken });
}

export function sendSupportChatMessage(accessToken: string, message: string) {
  return apiFetch<SupportChatResponse>("/api/v1/support/chat", {
    method: "POST",
    accessToken,
    body: { message },
  });
}
