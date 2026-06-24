export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T, P extends Record<string, unknown> = { data: T;  metadata: PaginationMetadata }> {
  status: boolean;
  code: number;
  payload: P;
  message?: string;
}

