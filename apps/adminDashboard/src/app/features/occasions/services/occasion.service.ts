import { HttpClient, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse, ApiService, DataResponse, PaginationMetadata, QueryParams } from '@org/data-access';
import { Observable } from 'rxjs';
import { CreateOccasionPayload, Occasion, UpdateOccasionPayload } from '../models/occasion.model';

@Injectable({
  providedIn: 'root',
})
export class OccasionService extends ApiService<Occasion> {
  protected override endpoint = 'occasions';

  constructor() {
    super(inject(HttpClient));
  }

  getOccasions(
    params?: () => QueryParams,
  ): HttpResourceRef<
    ApiResponse<Occasion[], { data: Occasion[]; metadata: PaginationMetadata }> | undefined
  > {
    return this.getListResource<Occasion>(params);
  }

  getOccasionsList(params?: QueryParams): Observable<ApiResponse<Occasion[]>> {
    return this.getList<Occasion>(params);
  }

  getOccasion(id: string): HttpResourceRef<DataResponse<Occasion> | undefined> {
    return this.getResourceById(id);
  }

  createOccasion(payload: CreateOccasionPayload): Observable<DataResponse<Occasion>> {
    return this.post<CreateOccasionPayload, Occasion>(payload);
  }

  updateOccasion(id: string, payload: UpdateOccasionPayload): Observable<DataResponse<Occasion>> {
    return this.patch<UpdateOccasionPayload, DataResponse<Occasion>>(id, payload);
  }

  deleteOccasion(id: string): Observable<unknown> {
    return this.delete(id);
  }
}