import { User } from '../../../../../../authApp/src/app/features/auth/models/register';
export interface Review {
  id: string
  userId: string
  productId: string
  headline: string
  content: string
  rating: number
  createdAt: string
  updatedAt: string
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
