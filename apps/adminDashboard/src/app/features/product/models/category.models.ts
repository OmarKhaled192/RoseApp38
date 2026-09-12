export interface ICategory {
  id: string;
  title: string;
  description: string;
  image: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
  subCategories: SubCategory[];
  _count: CategoryCount;
}

export interface SubCategory {
  id: string;
  title: string;
}

export interface CategoryCount {
  products: number;
}
