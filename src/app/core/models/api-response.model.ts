// Define generic API wrapper interfaces used across all HTTP responses
export interface ApiResponse<T> {
  success: boolean,
  message: string,
  data: T | null;
}

export interface PagedResult<T> {
  items:      T[];
  totalCount: number;
  page:       number;
  pageSize:   number;
}
