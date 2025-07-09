// src/utils/idGenerator.ts
// מחולל זיהויים ייחודיים עם יכולות מתקדמות

// Types
export interface IdGeneratorOptions {
  prefix?: string;
  suffix?: string;
  length?: number;
  includeTimestamp?: boolean;
  separator?: string;
}

export type IdFormat = "short" | "long" | "timestamp" | "uuid-like";

/**
 * יצירת זיהוי ייחודי מבוסס timestamp ומספר אקראי
 * @param options - אפשרויות יצירת זיהוי
 * @returns string - זיהוי ייחודי
 */
export const generateId = (options: IdGeneratorOptions = {}): string => {
  const {
    prefix = "",
    suffix = "",
    separator = "_",
    includeTimestamp = true,
    length = 9,
  } = options;

  let id = "";

  if (prefix) {
    id += prefix + separator;
  }

  if (includeTimestamp) {
    id += Date.now().toString();
  }

  if (length > 0) {
    if (includeTimestamp) {
      id += separator;
    }
    id += Math.random()
      .toString(36)
      .substring(2, 2 + length);
  }

  if (suffix) {
    id += separator + suffix;
  }

  return id;
};

/**
 * יצירת זיהוי קצר יותר לשימוש פנימי
 * @param length - אורך הזיהוי (ברירת מחדל: 8)
 * @returns string - זיהוי קצר
 */
export const generateShortId = (length: number = 8): string => {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
};

/**
 * יצירת זיהוי דמוי UUID
 * @returns string - זיהוי בפורמט UUID
 */
export const generateUuidLike = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * יצירת זיהוי עבור workout sets
 * @param prefix - קידומת לזיהוי
 * @param exerciseId - זיהוי התרגיל (אופציונלי)
 * @returns string - זיהוי עם קידומת
 */
export const generateSetId = (
  prefix: string = "set",
  exerciseId?: string
): string => {
  const parts = [prefix];

  if (exerciseId) {
    parts.push(exerciseId);
  }

  parts.push(generateShortId());
  return parts.join("_");
};

/**
 * יצירת זיהוי עבור תרגילים באימון
 * @param exerciseId - זיהוי התרגיל הבסיסי
 * @param workoutId - זיהוי האימון (אופציונלי)
 * @returns string - זיהוי תרגיל באימון
 */
export const generateWorkoutExerciseId = (
  exerciseId: string,
  workoutId?: string
): string => {
  const parts = [exerciseId];

  if (workoutId) {
    parts.push(workoutId);
  }

  parts.push(generateShortId());
  return parts.join("_");
};

/**
 * בדיקה מתקדמת אם זיהוי הוא תקני
 * @param id - הזיהוי לבדיקה
 * @returns boolean - האם הזיהוי תקני
 */
export const isValidId = (id: string): boolean => {
  if (typeof id !== "string" || id.length === 0) {
    return false;
  }

  // לא מכיל רווחים או תווים מיוחדים
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    return false;
  }

  // לא מתחיל או מסתיים עם _ או -
  if (
    id.startsWith("_") ||
    id.startsWith("-") ||
    id.endsWith("_") ||
    id.endsWith("-")
  ) {
    return false;
  }

  return true;
};

/**
 * יצירת זיהוי עבור תוכניות אימון
 * @param prefix - קידומת (plan, day, exercise)
 * @param format - פורמט הזיהוי
 * @returns string - זיהוי מלא
 */
export const generatePlanId = (
  prefix: string = "plan",
  format: IdFormat = "timestamp"
): string => {
  switch (format) {
    case "short":
      return `${prefix}_${generateShortId()}`;
    case "long":
      return `${prefix}_${generateShortId(12)}`;
    case "uuid-like":
      return `${prefix}_${generateUuidLike()}`;
    case "timestamp":
    default:
      return `${prefix}_${Date.now()}_${generateShortId()}`;
  }
};

/**
 * ניקוי זיהוי מתווים לא חוקיים
 * @param id - זיהוי לניקוי
 * @param replacement - תו החלפה (ברירת מחדל: '_')
 * @returns string - זיהוי נקי
 */
export const sanitizeId = (id: string, replacement: string = "_"): string => {
  return id
    .replace(/[^a-zA-Z0-9_-]/g, replacement)
    .toLowerCase()
    .replace(/^[_-]+|[_-]+$/g, "") // הסר _ או - מהתחלה והסוף
    .replace(/[_-]{2,}/g, replacement); // מספר _ או - רצופים -> אחד
};

/**
 * יצירת זיהוי עבור פריט ספציפי
 * @param type - סוג הפריט (workout, exercise, set, plan)
 * @param name - שם הפריט (אופציונלי)
 * @param format - פורמט הזיהוי
 * @returns string - זיהוי מובנה
 */
export const generateTypedId = (
  type: string,
  name?: string,
  format: IdFormat = "timestamp"
): string => {
  const prefix = name ? `${type}_${sanitizeId(name)}` : type;
  return generatePlanId(prefix, format);
};

/**
 * מפרק זיהוי מורכב לחלקים
 * @param id - זיהוי לפירוק
 * @param separator - מפריד (ברירת מחדל: '_')
 * @returns object - חלקי הזיהוי
 */
export const parseId = (id: string, separator: string = "_") => {
  const parts = id.split(separator);

  return {
    prefix: parts[0] || "",
    timestamp: parts.find((part) => /^\d{13}$/.test(part)) || null,
    suffix: parts[parts.length - 1] || "",
    parts: parts,
    isTimestamped: parts.some((part) => /^\d{13}$/.test(part)),
  };
};

/**
 * יצירת זיהוי עם עיכוב קבוע למיון
 * @param prefix - קידומת
 * @param sequence - מספר סידורי
 * @returns string - זיהוי עם מספר סידורי
 */
export const generateSequentialId = (
  prefix: string = "item",
  sequence: number
): string => {
  const paddedSequence = sequence.toString().padStart(6, "0");
  return `${prefix}_${paddedSequence}_${generateShortId(4)}`;
};

/**
 * יצירת זיהוי ידידותי לקריאה
 * @param words - מילים לזיהוי
 * @param separator - מפריד
 * @returns string - זיהוי קריא
 */
export const generateReadableId = (
  words: string[],
  separator: string = "-"
): string => {
  const cleanWords = words.map((word) => sanitizeId(word));
  return cleanWords.join(separator) + separator + generateShortId(4);
};
