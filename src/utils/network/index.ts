// src/utils/network/index.ts
// נקודת כניסה ראשית לכל שירותי הרשת

// Types
export * from "./types";

// Connection utilities
export * from "./connection";

// Retry logic
export * from "./retry";

// API helpers
export * from "./api";

// React hooks
export * from "./hooks";

// Error handling
export * from "./errors";

// Cancelable requests
export * from "./cancelable";

// הגדרות ברירת מחדל
export const NETWORK_CONFIG = {
  DEFAULT_TIMEOUT: 10000,
  DEFAULT_RETRY_COUNT: 3,
  DEFAULT_RETRY_DELAY: 1000,
  DEFAULT_BACKOFF_MULTIPLIER: 2,
} as const;
