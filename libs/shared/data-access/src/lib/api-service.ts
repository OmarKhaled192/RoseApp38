import { HttpClient, HttpParams, httpResource, HttpResourceRef } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@org/environments';
import { ApiResponse, DataResponse } from './api-response';
import { PaginationMetadata } from './models/pagination';
import { inject, Injector, runInInjectionContext } from '@angular/core';

type Primitive = string | number | boolean;
export type QueryParams = Record<string, Primitive | null | undefined>;

export abstract class ApiService<T> {
  protected baseUrl = environment.baseUrl;
  protected abstract endpoint: string;
  private injector = inject(Injector);
  constructor(protected http: HttpClient) { }

  private get fullUrl(): string {
    return `${this.baseUrl}/${this.endpoint}`;
  }

  getById<R = T>(id: number | string): Observable<ApiResponse<R>> {
    return this.http.get<ApiResponse<R>>(`${this.fullUrl}/${id}`);
  }



  getByIdList<R = T, P extends Record<string, unknown> = { data: R; metadata: PaginationMetadata }>(
    id: number | string
  ): Observable<ApiResponse<R, P>> {
    return this.http.get<ApiResponse<R, P>>(`${this.fullUrl}/${id}`);
  }

  get<R = T>(params?: QueryParams): Observable<R> {
    return this.http.get<R>(this.fullUrl, {
      params: this.buildParams(params)
    });
  }

  getList<R = T>(params?: QueryParams): Observable<ApiResponse<R[]>> {
    return this.http.get<ApiResponse<R[]>>(this.fullUrl, {
      params: this.buildParams(params)
    });
  }

  getListResource<R = T>(params?: () => QueryParams): HttpResourceRef<ApiResponse<R[]> | undefined> {
    return runInInjectionContext(this.injector, () =>
      httpResource<ApiResponse<R[]>>(() => {
        const queryString = this.buildParams(params?.()).toString();
        return queryString ? `${this.fullUrl}?${queryString}` : this.fullUrl;
      })
    );
  }

  getListResourceData<R = T>(path?: string, params?: () => QueryParams): HttpResourceRef<DataResponse<R> | undefined> {
    const url = path ? `${this.fullUrl}${path}` : this.fullUrl;
    return runInInjectionContext(this.injector, () =>
      httpResource<DataResponse<R> | undefined>(() => {
        const queryString = this.buildParams(params?.()).toString();
        return queryString ? `${url}?${queryString}` : url;
      })
    );
  }

  getResourceById<R = T>(id: string | (() => string)): HttpResourceRef<DataResponse<R> | undefined> {
    return httpResource<DataResponse<R>>(() => {
      const resourceId = typeof id === 'function' ? id() : id;
      return `${this.fullUrl}/${resourceId}`;
    });
  }

  post<B, R = T>(body: B, path?: string): Observable<DataResponse<R>> {
    const url = path ? `${this.fullUrl}${path}` : this.fullUrl;
    return this.http.post<DataResponse<R>>(url, body);
  }

  put<B, R = T>(id: number | string, body: B): Observable<R> {
    return this.http.put<R>(`${this.fullUrl}/${id}`, body);
  }


  patch<B, R = T>(id: number | string, body: B): Observable<R> {
    return this.http.patch<R>(`${this.fullUrl}/${id}`, body);
  }

  patchAllItem<B, R = T>(body: B): Observable<R> {
    return this.http.patch<R>(`${this.fullUrl}`, body);
  }


  deleteAll<R = T>(path?: string): Observable<R> {
    const url = path ? `${this.fullUrl}${path}` : this.fullUrl;
    return this.http.delete<R>(url);
  }

  delete<R = T>(id: number | string): Observable<R> {
    return this.http.delete<R>(`${this.fullUrl}/${id}`);
  }

  private buildParams(params?: QueryParams): HttpParams {
    let httpParams = new HttpParams();

    if (!params) return httpParams;

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return httpParams;
  }
}
