import { ProductData } from "./product";

export interface CartItem {
  id?: string;
  userId?: string;
  productId: string;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
  product?: ProductData;
}
 
export interface CartSummary {
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string | null;
}
 
export interface Cart {
  cartItems: CartItem[];
  summary: CartSummary;
}
 