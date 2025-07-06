// src/hooks/useDebounce.ts

import { useEffect, useState } from "react";

/**
 * Hook גנרי לעיכוב עדכון של ערך (debounce).
 * שימושי למניעת פעולות תכופות, כמו חיפוש בכל הקלדה.
 * @param value הערך המקורי
 * @param delay זמן ההשהיה במילישניות
 * @returns הערך המעודכן לאחר ההשהיה
 */
export function useDebounce<T>(value: T, delay: number): T {
  // מצב פנימי שמחזיק את הערך המעודכן
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // הגדרת טיימר שמעדכן את הערך רק לאחר שזמן ה-delay עבר
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    // ניקוי הטיימר הקודם בכל פעם שהערך המקורי או ה-delay משתנים
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
