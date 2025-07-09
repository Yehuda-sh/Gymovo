// src/utils/networkUtils.ts
// נקודת כניסה ראשית לכל שירותי הרשת - קובץ מעודכן

// ייבוא כל הפונקציות מהמודולים החדשים
import {
  checkInternetConnection,
  withNetworkCheck,
  withRetry,
  apiCall,
  useNetworkStatus,
  showNetworkError,
  createNetworkError,
  enhanceError,
  CancelableRequest,
  cancelableApiCall,
} from "./network";

// תאימות לאחור - שמירה על exports הישנים
export {
  checkInternetConnection,
  withNetworkCheck,
  withRetry as fetchWithRetry,
  apiCall,
  useNetworkStatus,
  showNetworkError,
  createNetworkError,
  enhanceError,
  CancelableRequest,
  cancelableApiCall,
};
