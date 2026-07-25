import { CardData, ProductData } from "@org/ui";

export function mapProductToCardData(product: ProductData): CardData {
  const price = Number(product.price);
  const hasDiscount = product.discountType && product.discountValue;
  const oldPrice = hasDiscount
    ? product.discountType === 'PERCENT'
      ? price / (1 - Number(product.discountValue) / 100)
      : price + Number(product.discountValue)
    : undefined;

  const badges: string[] = [];

  if (product.stock <= 0) {
    badges.push('out-of-stock');
  } else {
    if (product.rating && product.rating >= 4) badges.push('hot');

    if (product.createdAt) {
      const createdDate = new Date(product.createdAt);
      const today = new Date();
      const diffInDays =
        (today.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
      if (diffInDays <= 6) badges.push('new');
    }
  }

  return {
    id: product.id,
    title: product.title,
    subtitle: product.subCategory?.title,
    wishlist: product._count.wishlistItems,
    create: product.createdAt,
    image: product.cover,
    price,
    oldPrice: oldPrice ? Math.round(oldPrice * 100) / 100 : undefined,
    currency: 'EGP',
    rating: product.rating,
    badges: badges,
    stock: product.stock,
  };
}
