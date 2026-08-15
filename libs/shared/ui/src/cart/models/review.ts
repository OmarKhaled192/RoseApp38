import { User } from "./register"

export interface Review {
  id: string | number;
  userId: string
  productId: string
  headline: string
  content: string
  rating: number
  createdAt: string
  updatedAt: string
  name: string
  user: User
}

export interface Count {
  reviews: number
  cartItems: number
  wishlistItems: number
}

export interface ReviewRequest {
   productId:string,
    headline: string,
    content: string,
    rating: number
}
