// src/utils/network/types/index.ts
// טיפוסים עבור utilities של רשת

// שגיאת רשת מותאמת
export interface NetworkError extends Error {
  statusCode?: number;
  retry?: () => Promise<any>;
  isNetworkError: boolean;
}

// אפשרויות retry
export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number) => void;
}

// מצב רשת
export interface NetworkStatus {
  isConnected: boolean | null;
  networkType: string | null;
}

// קבועים עבור status codes
export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 408,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// טיפוס עבור HTTP status
export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];

// אפשרויות API call
export interface ApiCallOptions extends RequestInit {
  retryOptions?: RetryOptions;
  showErrorDialog?: boolean;
  customErrorMessage?: string;
} 