// src/hooks/useExercises.ts

import { useQuery } from "@tanstack/react-query";
import { fetchAllExercises } from "../services/wgerApi";

/**
 * Hook לשליפת רשימת כל התרגילים מה-API.
 * משתמש ב-staleTime כדי לשמור את המידע במטמון (cache) למשך שעה,
 * ובכך חוסך קריאות רשת מיותרות.
 */
export const useExercises = () => {
  return useQuery({
    queryKey: ["exercises"],
    queryFn: fetchAllExercises,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });
};
/**
 * הערה:
 * - ניתן להוסיף אפשרות לטעינה מחדש של התרגילים על ידי קריאה ל-hook עם refetch.
 * - ניתן להוסיף טיפול בשגיאות במידה ויש בעיות בטעינת התרגילים מה-API.
 */
