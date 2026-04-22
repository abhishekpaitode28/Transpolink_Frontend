// TODO: Define generic API wrapper interfaces used across all HTTP responses

// TODO: ApiResponse<T> — wraps a single item response
// Fields: data (T), message (string), success (boolean)
export interface ApiResponse<T> {
  // TODO: add fields
}

// TODO: PagedResponse<T> — wraps paginated list responses
// Fields: items (T[]), totalCount, pageNumber, pageSize
export interface PagedResponse<T> {
  // TODO: add fields
}
