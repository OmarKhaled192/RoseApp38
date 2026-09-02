export interface CreateCheckoutSessionRequest {
  orderId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionPayload {
  checkoutUrl: string;
  sessionId: string;
  expiresAt: string;
  reused: boolean;
}

export interface CheckoutSessionStatusPayload {
  sessionId: string;
  paymentStatus: string;
  sessionStatus: string;
  amountTotal: number;
  currency: string;
  order: {
    orderId: string;
    paymentStatus: string;
  };
}
