import { CardData } from "@org/ui";
import { ProductData } from "../models/product";

export function mapProductToCardData(product: ProductData): CardData {
  const price = Number(product.price);
  const hasDiscount = product.discountType && product.discountValue;
  const oldPrice = hasDiscount
    ? product.discountType === 'PERCENT'
      ? price / (1 - Number(product.discountValue) / 100)
      : price + Number(product.discountValue)
    : undefined;

  return {
    id: product.id,
    title: product.title,
    subtitle: product.subCategory?.title,
    image: product.cover,
    price,
    oldPrice: oldPrice ? Math.round(oldPrice * 100) / 100 : undefined,
    currency: 'EGP',
    rating: product.rating,
    badges: product.stock <= 0 ? ['out-of-stock'] : [],
  };
}
