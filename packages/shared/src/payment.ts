/** Mirrors payments/web/PaymentIntentResponse.java. */
export interface PaymentIntentResponse {
  paymentId: string;
  provider: string;
  checkoutUrl: string;
}
