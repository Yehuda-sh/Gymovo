// src/utils/idGenerator.ts - מחולל זיהויים ייחודיים מתקדם

import { Platform } from "react-native";

// טיפוסים
export interface IdGeneratorOptions {
  prefix?: string;
  suffix?: string;
  length?: number;
  includeTimestamp?: boolean;
  includeDate?: boolean;
  separator?: string;
  uppercase?: boolean;
  customPattern?: string;
}

export type IdFormat =
  | "short"
  | "long"
  | "timestamp"
  | "uuid"
  | "uuid-v4"
  | "nanoid"
  | "sequential"
  | "readable"
  | "hash";

export interface ParsedId {
  prefix?: string;
  timestamp?: number;
  date?: string;
  suffix?: string;
  parts: string[];
  isValid: boolean;
  format?: IdFormat;
  metadata?: Record<string, any>;
}

// קבועים
const ID_PATTERNS = {
  alphanumeric: /^[a-zA-Z0-9_-]+$/,
  timestamp: /^\d{13}$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  date: /^\d{4}-\d{2}-\d{2}$/,
} as const;

// אלפבית בטוח לזיהויים קריאים
const SAFE_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZabcdefghjkmnpqrstvwxyz";

// Cache לזיהויים שנוצרו (למניעת כפילויות)
const idCache = new Set<string>();

/**
 * יצירת זיהוי ייחודי מתקדם
 * @param options - אפשרויות יצירת זיהוי
 * @returns string - זיהוי ייחודי
 */
export const generateId = (options: IdGeneratorOptions = {}): string => {
  const {
    prefix = "",
    suffix = "",
    separator = "_",
    includeTimestamp = true,
    includeDate = false,
    length = 9,
    uppercase = false,
    customPattern,
  } = options;

  let id = "";
  const parts: string[] = [];

  // הוספת prefix
  if (prefix) {
    parts.push(prefix);
  }

  // הוספת תאריך
  if (includeDate) {
    const date = new Date().toISOString().split("T")[0];
    parts.push(date);
  }

  // הוספת timestamp
  if (includeTimestamp) {
    parts.push(Date.now().toString());
  }

  // הוספת מחרוזת אקראית
  if (length > 0) {
    const randomPart = customPattern
      ? generateFromPattern(customPattern)
      : generateRandomString(length);
    parts.push(randomPart);
  }

  // הוספת suffix
  if (suffix) {
    parts.push(suffix);
  }

  // חיבור החלקים
  id = parts.join(separator);

  // המרה לאותיות גדולות אם נדרש
  if (uppercase) {
    id = id.toUpperCase();
  }

  // וידוא ייחודיות
  if (idCache.has(id)) {
    // אם הזיהוי כבר קיים, נוסיף מספר אקראי נוסף
    id += separator + generateRandomString(4);
  }

  idCache.add(id);

  // ניקוי cache אם גדול מדי (מניעת בעיות זיכרון)
  if (idCache.size > 10000) {
    idCache.clear();
  }

  return id;
};

/**
 * יצירת מחרוזת אקראית בטוחה
 * @param length - אורך המחרוזת
 * @returns string - מחרוזת אקראית
 */
const generateRandomString = (length: number): string => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += SAFE_ALPHABET.charAt(
      Math.floor(Math.random() * SAFE_ALPHABET.length)
    );
  }
  return result;
};

/**
 * יצירת זיהוי מתבנית מותאמת אישית
 * @param pattern - תבנית (X=אות, 9=ספרה, *=אקראי)
 * @returns string - זיהוי לפי תבנית
 */
const generateFromPattern = (pattern: string): string => {
  return pattern.replace(/[X9*]/g, (char) => {
    switch (char) {
      case "X":
        return String.fromCharCode(65 + Math.floor(Math.random() * 26));
      case "9":
        return Math.floor(Math.random() * 10).toString();
      case "*":
        return SAFE_ALPHABET.charAt(
          Math.floor(Math.random() * SAFE_ALPHABET.length)
        );
      default:
        return char;
    }
  });
};

/**
 * יצירת זיהוי קצר לשימוש פנימי
 * @param length - אורך הזיהוי (ברירת מחדל: 8)
 * @returns string - זיהוי קצר
 */
export const generateShortId = (length: number = 8): string => {
  return generateRandomString(length);
};

/**
 * יצירת UUID v4 תקני
 * @returns string - UUID בפורמט תקני
 */
export const generateUUID = (): string => {
  // פונקציה מותאמת למובייל ללא crypto API
  const d = new Date().getTime();
  const d2 =
    Platform.OS === "ios" || Platform.OS === "android"
      ? performance.now()
      : (performance && performance.now && performance.now() * 1000) || 0;

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * יצירת nanoid (כמו UUID אבל קצר יותר)
 * @param size - גודל הזיהוי (ברירת מחדל: 21)
 * @returns string - nanoid
 */
export const generateNanoId = (size: number = 21): string => {
  let id = "";
  for (let i = 0; i < size; i++) {
    id += SAFE_ALPHABET.charAt(
      Math.floor(Math.random() * SAFE_ALPHABET.length)
    );
  }
  return id;
};

/**
 * יצירת זיהוי קריא (מילים + מספרים)
 * @param words - מערך מילים
 * @param separator - מפריד
 * @returns string - זיהוי קריא
 */
export const generateReadableId = (
  words: string[] = [],
  separator: string = "-"
): string => {
  const adjectives = ["strong", "fit", "power", "swift", "iron"];
  const nouns = ["workout", "lift", "pump", "gains", "beast"];

  if (words.length === 0) {
    words = [
      adjectives[Math.floor(Math.random() * adjectives.length)],
      nouns[Math.floor(Math.random() * nouns.length)],
    ];
  }

  const cleanWords = words.map((word) => sanitizeId(word));
  return cleanWords.join(separator) + separator + generateShortId(4);
};

/**
 * יצירת זיהוי סדרתי עם padding
 * @param prefix - קידומת
 * @param sequence - מספר סידורי
 * @param padding - אורך padding (ברירת מחדל: 6)
 * @returns string - זיהוי סדרתי
 */
export const generateSequentialId = (
  prefix: string = "item",
  sequence: number,
  padding: number = 6
): string => {
  const paddedSequence = sequence.toString().padStart(padding, "0");
  return `${prefix}_${paddedSequence}`;
};

/**
 * יצירת זיהוי לפי פורמט ספציפי
 * @param format - פורמט הזיהוי
 * @param prefix - קידומת אופציונלית
 * @returns string - זיהוי בפורמט המבוקש
 */
export const generateIdByFormat = (
  format: IdFormat,
  prefix?: string
): string => {
  const base = prefix ? `${prefix}_` : "";

  switch (format) {
    case "short":
      return base + generateShortId(6);

    case "long":
      return base + generateShortId(12);

    case "timestamp":
      return base + Date.now() + "_" + generateShortId(4);

    case "uuid":
    case "uuid-v4":
      return generateUUID();

    case "nanoid":
      return generateNanoId();

    case "sequential":
      // בפועל יש צורך במנגנון ספירה חיצוני
      return base + Date.now().toString().slice(-6);

    case "readable":
      return generateReadableId();

    case "hash":
      // hash פשוט מבוסס זמן ומספר אקראי
      return (
        base +
        btoa(Date.now().toString())
          .replace(/[^a-zA-Z0-9]/g, "")
          .slice(0, 8)
      );

    default:
      return generateId({ prefix });
  }
};

/**
 * יצירת זיהוי עבור אובייקטים ספציפיים בגימובו
 */
export const gymovo = {
  // זיהוי אימון
  workout: (userId?: string): string => {
    const prefix = userId ? `workout_${sanitizeId(userId)}` : "workout";
    return generateId({ prefix, length: 6 });
  },

  // זיהוי תרגיל באימון
  exercise: (workoutId: string, exerciseId: string): string => {
    return `${workoutId}_ex_${exerciseId}_${generateShortId(4)}`;
  },

  // זיהוי סט
  set: (exerciseId: string, setNumber: number): string => {
    return `${exerciseId}_set_${setNumber}_${generateShortId(4)}`;
  },

  // זיהוי תוכנית
  plan: (name?: string): string => {
    const prefix = name ? `plan_${sanitizeId(name)}` : "plan";
    return generateId({ prefix, includeDate: true, length: 4 });
  },

  // זיהוי יום בתוכנית
  planDay: (planId: string, dayNumber: number): string => {
    return `${planId}_day_${dayNumber}`;
  },

  // זיהוי תרגיל מותאם אישית
  customExercise: (userId: string): string => {
    return generateId({
      prefix: `custom_ex_${sanitizeId(userId)}`,
      length: 6,
    });
  },

  // זיהוי הישג
  achievement: (type: string): string => {
    return generateId({
      prefix: `achievement_${sanitizeId(type)}`,
      includeTimestamp: true,
      length: 4,
    });
  },

  // זיהוי שיא אישי
  personalRecord: (exerciseId: string, userId: string): string => {
    return `pr_${sanitizeId(userId)}_${exerciseId}_${Date.now()}`;
  },
};

/**
 * פירוק וניתוח זיהוי
 * @param id - זיהוי לניתוח
 * @param separator - מפריד (ברירת מחדל: '_')
 * @returns ParsedId - אובייקט מפורק
 */
export const parseId = (id: string, separator: string = "_"): ParsedId => {
  if (!id || typeof id !== "string") {
    return {
      parts: [],
      isValid: false,
    };
  }

  const parts = id.split(separator);
  const parsed: ParsedId = {
    parts,
    isValid: isValidId(id),
  };

  // ניסיון לזהות prefix
  if (parts.length > 0 && isNaN(Number(parts[0]))) {
    parsed.prefix = parts[0];
  }

  // ניסיון לזהות timestamp
  const timestampPart = parts.find((part) => ID_PATTERNS.timestamp.test(part));
  if (timestampPart) {
    parsed.timestamp = parseInt(timestampPart);
  }

  // ניסיון לזהות תאריך
  const datePart = parts.find((part) => ID_PATTERNS.date.test(part));
  if (datePart) {
    parsed.date = datePart;
  }

  // ניסיון לזהות suffix
  if (parts.length > 1 && !timestampPart && !datePart) {
    const lastPart = parts[parts.length - 1];
    if (isNaN(Number(lastPart))) {
      parsed.suffix = lastPart;
    }
  }

  // ניסיון לזהות פורמט
  if (ID_PATTERNS.uuid.test(id)) {
    parsed.format = "uuid";
  } else if (parsed.timestamp) {
    parsed.format = "timestamp";
  } else if (parts.length === 1 && parts[0].length <= 8) {
    parsed.format = "short";
  }

  return parsed;
};

/**
 * בדיקה אם זיהוי תקני
 * @param id - זיהוי לבדיקה
 * @param options - אפשרויות בדיקה
 * @returns boolean - האם הזיהוי תקני
 */
export const isValidId = (
  id: string,
  options: {
    allowEmpty?: boolean;
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
  } = {}
): boolean => {
  const {
    allowEmpty = false,
    pattern = ID_PATTERNS.alphanumeric,
    minLength = 1,
    maxLength = 255,
  } = options;

  // בדיקות בסיסיות
  if (!id || typeof id !== "string") {
    return allowEmpty && !id;
  }

  // בדיקת אורך
  if (id.length < minLength || id.length > maxLength) {
    return false;
  }

  // בדיקת תבנית
  if (!pattern.test(id)) {
    return false;
  }

  // בדיקת תווים בתחילה ובסוף
  if (/^[_-]|[_-]$/.test(id)) {
    return false;
  }

  return true;
};

/**
 * ניקוי זיהוי מתווים לא חוקיים
 * @param id - זיהוי לניקוי
 * @param options - אפשרויות ניקוי
 * @returns string - זיהוי נקי
 */
export const sanitizeId = (
  id: string,
  options: {
    replacement?: string;
    lowercase?: boolean;
    maxLength?: number;
  } = {}
): string => {
  const { replacement = "_", lowercase = true, maxLength = 50 } = options;

  let sanitized = id
    .replace(/[^a-zA-Z0-9_-]/g, replacement)
    .replace(/^[_-]+|[_-]+$/g, "") // הסרת תווים מיוחדים מההתחלה והסוף
    .replace(/[_-]{2,}/g, replacement); // החלפת רצף של תווים מיוחדים

  if (lowercase) {
    sanitized = sanitized.toLowerCase();
  }

  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized || "id";
};

/**
 * השוואת זיהויים (case insensitive)
 * @param id1 - זיהוי ראשון
 * @param id2 - זיהוי שני
 * @returns boolean - האם הזיהויים זהים
 */
export const compareIds = (id1: string, id2: string): boolean => {
  if (!id1 || !id2) return false;
  return id1.toLowerCase().trim() === id2.toLowerCase().trim();
};

/**
 * יצירת hash מזיהוי (לצורכי השוואה או אינדוקס)
 * @param id - זיהוי
 * @returns number - hash code
 */
export const hashId = (id: string): number => {
  let hash = 0;
  if (!id || id.length === 0) return hash;

  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash);
};

// ייצוא ברירת מחדל
export default {
  generate: generateId,
  generateShort: generateShortId,
  generateUUID,
  generateNanoId,
  generateByFormat: generateIdByFormat,
  parse: parseId,
  validate: isValidId,
  sanitize: sanitizeId,
  compare: compareIds,
  hash: hashId,
  gymovo,
};
