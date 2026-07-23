import { User } from "../cart/models/register";

export interface ReviewCard {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  review: string;
  date: string;
  user?: User;
}
