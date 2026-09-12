import { QueryParams } from '@org/data-access';

export interface CategoryCount {
  products: number;
}

export interface CategoryItem {
  id: string;
  title: string;
  description?: string;
  image: string;
  immutable?: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: CategoryCount;
}

export interface CategoryQuery extends QueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateCategoryDto {
  title: string;
  description?: string;
  image: string;
}

export interface UpdateCategoryDto {
  title?: string;
  description?: string;
  image?: string;
}

export interface UploadPayload {
  url: string;
}

export interface UploadResponse {
  status: boolean;
  code: number;
  payload: UploadPayload;
  message?: string;
}

export interface CategoryTableRow {
  id: string;
  name: string;
  products: string;
  image?: string;
  raw: CategoryItem;
  [key: string]: unknown;
}
