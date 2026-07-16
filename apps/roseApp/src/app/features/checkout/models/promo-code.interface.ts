export interface PromoCode {
  code: string;
  type: 'PERCENT' | 'FIXED';
  value: number;
  minPurchase: number;
  maxDiscount: number;
  usageLimit: number;
  validFrom: string;      
  validUntil: string;
  isActive: boolean;
}