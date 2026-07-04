export interface CategoryItem {
  id: string;
  label: string;
  badge?: string;
  icon?: string; // PrimeIcons class, e.g. 'pi pi-id-card'
  children?: CategoryItem[];
}

export interface OccasionItem {
  id: string;
  label: string;
  image: string;
}

export interface ProductFilters {
  categoryId: string | null;
  occasionIds: string[];
  rating: number | null;
  priceFrom: number | null;
  priceTo: number | null;
}

export const EMPTY_FILTERS: ProductFilters = {
  categoryId: null,
  occasionIds: [],
  rating: null,
  priceFrom: null,
  priceTo: null,
};
