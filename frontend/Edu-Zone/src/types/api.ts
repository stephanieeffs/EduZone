export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T> {
  data: T;
  error?: ApiError;
}

export interface RequestOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}
