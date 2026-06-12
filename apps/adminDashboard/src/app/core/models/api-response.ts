export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  status: boolean;
  code: number;
  payload: {
    data: T;
    metadata: PaginationMetadata;
  };
}
