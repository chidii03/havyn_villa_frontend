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
