export enum PaymentMethod {
  CreditCard = 'CREDIT_CARD',
  CashOnDelivery = 'CASH_ON_DELIVERY',
}

export interface CreateOrderRequest {
  addressId: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
}
