export interface CategoryItem {
  id: string;
  label: string;
  badge?: string;
  icon?: string; 
  image?: string;
  children?: CategoryItem[];
}

export interface IOccasion {
 id: string;
  title: string;
  image: string;
}


export interface ProductFilters {
  categoryIds: string[];
  occasionIds: string[];
  rating: number | null;
  priceFrom: number | null;
  priceTo: number | null;
}

export const EMPTY_FILTERS: ProductFilters = {
  categoryIds: [],
  occasionIds: [],
  rating: null,
  priceFrom: null,
  priceTo: null,
};
