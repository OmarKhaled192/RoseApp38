export interface GetOrdersResponse {
  status: boolean;
  code: number;
  payload: OrdersPayload;
}

export interface OrdersPayload {
  data: Order[];
  metadata: OrderMetadata;
}

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  couponId: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  stripePaymentIntentId: string | null;
  subtotal: string;
  discount: string;
  shipping: string;
  total: string;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
  address: Address;
  coupon: Coupon;
  orderItems: OrderItem[];
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Address {
  id: string;
  userId: string;
  title: string;
  isPrimary: boolean;
  city: string;
  street: string;
  phone: string;
  latitude: string;
  longitude: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: string;
  value: string;
  minPurchase: string;
  maxDiscount: string;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: string;
  createdAt: string;
  product: Product;
}

export interface Product {
  id: string;
  title: string;
  cover: string;
}

export interface OrderMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}