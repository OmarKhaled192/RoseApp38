import { InjectionToken } from "@angular/core";
import { CartItem } from "../models/cart.interface";

export interface CartPort {
  addToCart(item: CartItem): void;
}

export const CART_PORT = new InjectionToken<CartPort>('CART_PORT');