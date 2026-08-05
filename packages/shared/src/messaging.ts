/**
 * Mirrors apps/api/.../messaging/web/*.java — kept in lockstep by hand, see
 * property.ts's own note. New this session (prompt 30): the backend has existed
 * since prompt 16/session 17, but no frontend (web or mobile) ever consumed it, so
 * no shared types existed for it yet either.
 */

/** Mirrors messaging/web/ConversationSummary.java. */
export interface ConversationSummary {
  id: string;
  propertyId: string;
  propertyTitle: string;
  hostId: string;
  guestId: string;
  bookingId: string | null;
  lastMessageAt: string | null;
  createdAt: string;
}

/** Mirrors messaging/web/MessageSummary.java. */
export interface MessageSummary {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

/** Mirrors messaging/web/StartConversationRequest.java. */
export interface StartConversationRequest {
  bookingId?: string | null;
  body: string;
}

/** Mirrors messaging/web/SendMessageRequest.java. */
export interface SendMessageRequest {
  body: string;
}
