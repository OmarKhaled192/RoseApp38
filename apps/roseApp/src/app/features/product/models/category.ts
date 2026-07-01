export interface Category {
  id: string
  title: string
  description: string
  image: string
  immutable: boolean
  createdAt: string
  updatedAt: string
}

export interface SubCategory {
  id: string
  title: string
  description: string
  image: string
  categoryId: string
  immutable: boolean
  createdAt: string
  updatedAt: string
}
