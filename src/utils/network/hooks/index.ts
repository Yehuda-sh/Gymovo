// src/utils/network/hooks/index.ts
// React hooks עבור רשת

import { useEffect, useState, useRef, useCallback } from "react";
import NetInfo from "@react-native-community/netinfo";
import { NetworkStatus } from "../types";
import { checkInternetConnection } from "../connection";

/**
 * Hook לבדיקת מצב הרשת
 */
export const useNetworkStatus = (): NetworkStatus => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [networkType, setNetworkType] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
      setNetworkType(state.type);
    });

    // בדיקה ראשונית
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected ?? false);
      setNetworkType(state.type);
    });

    return unsubscribe;
  }, []);

  return { isConnected, networkType };
};

/**
 * Hook לבדיקת חיבור עם polling
 * @param interval מרווח בדיקה במילישניות
 */
export const useNetworkMonitor = (interval: number = 10000) => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkConnection = useCallback(async () => {
    const connected = await checkInternetConnection();
    setIsOnline(connected);
    setLastChecked(new Date());
  }, []);

  useEffect(() => {
    // בדיקה ראשונית
    checkConnection();

    // התחלת polling
    intervalRef.current = setInterval(checkConnection, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkConnection, interval]);

  return {
    isOnline,
    lastChecked,
    checkNow: checkConnection,
  };
};

/**
 * Hook לביצוע פעולה כאשר החיבור חוזר
 * @param onReconnect פונקציה לביצוע כאשר החיבור חוזר
 */
export const useOnReconnect = (onReconnect: () => void) => {
  const { isConnected } = useNetworkStatus();
  const prevConnected = useRef<boolean | null>(null);

  useEffect(() => {
    if (prevConnected.current === false && isConnected === true) {
      onReconnect();
    }
    prevConnected.current = isConnected;
  }, [isConnected, onReconnect]);
};

/**
 * Hook לביצוע פעולה כאשר החיבור נפסק
 * @param onDisconnect פונקציה לביצוע כאשר החיבור נפסק
 */
export const useOnDisconnect = (onDisconnect: () => void) => {
  const { isConnected } = useNetworkStatus();
  const prevConnected = useRef<boolean | null>(null);

  useEffect(() => {
    if (prevConnected.current === true && isConnected === false) {
      onDisconnect();
    }
    prevConnected.current = isConnected;
  }, [isConnected, onDisconnect]);
};

/**
 * Hook לביצוע retry של פונקציה
 * @param fn הפונקציה לביצוע
 * @param deps dependencies לפונקציה
 */
export const useRetry = <T>(
  fn: () => Promise<T>,
  deps: React.DependencyList = []
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fn();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, deps);

  const retry = useCallback(() => {
    execute();
  }, [execute]);

  return {
    data,
    error,
    isLoading,
    retry,
    execute,
  };
};

/**
 * Hook לביצוע fetch עם retry אוטומטי
 * @param url כתובת ה-API
 * @param options אפשרויות הבקשה
 * @param autoFetch האם לבצע fetch אוטומטי
 */
export const useFetch = <T>(
  url: string,
  options: RequestInit = {},
  autoFetch: boolean = true
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
};
