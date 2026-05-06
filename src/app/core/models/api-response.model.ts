// Define generic API wrapper interfaces used across all HTTP responses
export interface ApiResponse<T> {
  success: boolean,
  message: string,
  data: T | null;
}

// PagedResponse<T> — wraps paginated list responses
export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
