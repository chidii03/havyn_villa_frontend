import type { PaymentIntentResponse } from "@havyn/shared";
import { apiFetch } from "./http";

/** Creates a server-authorized hosted checkout session for an existing booking hold. */
export function createPaymentIntent(accessToken: string, bookingId: string) {
  return apiFetch<PaymentIntentResponse>("/api/v1/payments/intent", {
    method: "POST",
    accessToken,
    body: { bookingId },
  });
}
