export interface PaymentIntentResponse {
  paymentId: string;
  provider: string;
  checkoutUrl: string;
}
