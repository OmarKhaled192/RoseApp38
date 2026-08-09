import { PaginationMetadata } from "./models/pagination";

export interface BaseResponse<P> {
  status: boolean;
  code: number;
  message?: string;
  payload: P;
}

export type PaginatedResponse<T> = BaseResponse<{
  data: T[];
  metadata: PaginationMetadata;
}>;

export interface ApiResponse<T, P extends Record<string, unknown> = { data: T; metadata: PaginationMetadata }> {
  status: boolean;
  code: number;
  payload: P;
  message?: string;
}

export interface LoadingState {
  isLoading: boolean;
}

export type DataResponse<T> = BaseResponse<T>;
