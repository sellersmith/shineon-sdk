/** SDK client configuration */
export interface ShineOnConfig {
  /** API access token */
  token: string;
  /** Base URL override (default: https://api.shineon.com) */
  baseUrl?: string;
  /** Request timeout in ms (default: 30000) */
  timeout?: number;
  /** Max retry attempts for rate-limited requests (default: 3) */
  maxRetries?: number;
}

/** Standard error response from ShineOn API */
export interface ApiErrorResponse {
  error: string;
}

/** Generic API response wrapper — currently a pass-through */
export type ApiResponse<T> = T;

/** Pagination params for orders (page + limit) */
export interface OrderPaginationParams {
  page?: number;
  /** Max 250, default 50 */
  limit?: number;
}

/** Pagination params for product templates (page + per_page) */
export interface TemplatePaginationParams {
  page?: number;
  /** Default 15 */
  per_page?: number;
}

/** Pagination meta returned by product templates endpoint */
export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

/** Pagination links returned by product templates endpoint */
export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

/** Paginated response shape (used by product templates) */
export interface PaginatedResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

/** HTTP methods used by the SDK */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/** Response from GET /v1/whoami */
export interface WhoAmIResponse {
  [key: string]: unknown;
}
