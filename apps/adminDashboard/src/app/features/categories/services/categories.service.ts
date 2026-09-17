import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, ApiService, DataResponse } from '@org/data-access';
import {
  Category,
  CategoryItem,
  CategoryQuery,
  CreateCategoryDto,
  UpdateCategoryDto,
  UploadResponse,
} from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService extends ApiService<Category> {
  protected override endpoint = 'categories';

  constructor() {
    super(inject(HttpClient));
  }

  /**
   * Signal-based HttpResource for reactive queries in components.
   */

  getCategoriesResource(params: () => CategoryQuery) {
    return this.getListResourceData<CategoryItem>('', params);
  }
  /**
   * Standard Observable query for paginated categories.
   */
  getCategoriesList(params?: CategoryQuery): Observable<ApiResponse<CategoryItem[]>> {
    return this.getList<CategoryItem>(params);
  }

  /**
   * Fetch a single category by ID.
   */

  
   getCategoryById(id: string) {
      return this.getResourceById<CategoryItem>(id);
    }

  /**
   * Create a new category (Admin only).
   */
  createCategory(body: CreateCategoryDto): Observable<DataResponse<CategoryItem>> {
    return this.post<CreateCategoryDto, CategoryItem>(body);
  }

  /**
   * Update category by ID (Admin only).
   */
  updateCategory(id: string, body: UpdateCategoryDto): Observable<CategoryItem> {
    return this.patch<UpdateCategoryDto, CategoryItem>(id, body);
  }

  /**
   * Delete category by ID (Admin only).
   */
  deleteCategory(id: string): Observable<void> {
    return this.delete<void>(id);
  }

  /**
   * Upload an image to the temporary cache (/api/upload).
   */
  uploadImage(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<UploadResponse>(`${this.baseUrl}/upload`, formData);
  }
}
