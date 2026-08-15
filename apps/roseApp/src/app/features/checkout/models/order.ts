export interface Order {
  id?: string;
  orderId?: string;
  addressId: string;
  paymentMethod: string;
  couponCode: string;
  notes: string;
}
