export type BadgeType = 'new' | 'sale' | 'hot' | 'out-of-stock' | string;

export interface CardAction {
  label: string;
  icon: string;
  isDisabled?: boolean;
  variant?: 'primary' | 'ghost';
  action: () => void;
}

export interface CardData {
  id: string;
  image?: string;
  title: string;
  subtitle?: string;
  rating?: number;
  price?: number;
  oldPrice?: number;
  currency?: string;
  badges?: BadgeType[];
  inStock?: boolean;
  wishlist: number;
  create: string;
  stock?: number;
}
