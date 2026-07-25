import { Category, SubCategory } from "./category"
import { Count, Review } from "./review"

export interface ProductData {
  id: string
  title: string
  description: string
  rating: number
  ratings: number
  stock: number
  price: string
  discountType: 'PERCENT' | 'FIXED' | null;
  discountValue: string | null;
  cover: string
  gallery: string
  categoryId: string
  subCategoryId: string
  immutable: boolean
  createdAt: string
  updatedAt: string
  category: Category
  subCategory: SubCategory
  occasions: []
  reviews: Review[]
  _count: Count
}

export interface Product {
  product: ProductData
}
