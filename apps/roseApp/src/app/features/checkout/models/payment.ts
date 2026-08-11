export interface CreatePaymentIntentRequest {
  orderId: string;
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
  paymentMethodId: string;
}
