import { HttpClient, HttpParams, httpResource, HttpResourceRef } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@org/environments';
import { ApiResponse, DataResponse } from './api-response';
import { PaginationMetadata } from './models/pagination';

type Primitive = string | number | boolean;
export type QueryParams = Record<string, Primitive | null | undefined>;

export abstract class ApiService<T> {
  protected baseUrl = environment.baseUrl;
  protected abstract endpoint: string;

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
    return httpResource<ApiResponse<R[]>>(() => {
      const queryString = this.buildParams(params?.());
      return queryString ? `${this.fullUrl}?${queryString}` : this.fullUrl;
    });
  }

  getResourceById<R = T>(id: string): HttpResourceRef<DataResponse<R> | undefined> {
  return httpResource<DataResponse<R>>(() => {
     return `${this.fullUrl}/${id}`;
    });
  }

  post<B, R = T>(body: B, path?: string): Observable<DataResponse<R>> {
    const url = path ? `${this.fullUrl}${path}` : this.fullUrl;
    return this.http.post<DataResponse<R>>(url, body);
  }

  put<B, R = T>(body: B): Observable<R> {
    return this.http.put<R>(this.fullUrl, body);
  }


  delete<R = T>(): Observable<R> {
    return this.http.delete<R>(this.fullUrl);
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
