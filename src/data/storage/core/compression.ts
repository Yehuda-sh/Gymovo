// src/data/storage/core/compression.ts
// 🗜️ דחיסה ואופטימיזציה של נתוני אחסון

import { STORAGE_CONFIG } from "./retry";

/**
 * 🗜️ דחיסה בסיסית לנתונים גדולים
 * כרגע מיישם אזהרה, בעתיד ניתן להוסיף אלגוריתם דחיסה אמיתי
 */
export function compressData(data: string): string {
  if (data.length < STORAGE_CONFIG.compressionThreshold) {
    return data;
  }

  // כאן אפשר להוסיף אלגוריתם דחיסה אמיתי כמו LZ-string
  // לעכשיו, רק מסמנים שהנתונים גדולים
  if (__DEV__) {
    console.warn(
      `📦 Large data detected (${data.length} chars), consider implementing compression`
    );
  }

  return data;
}

/**
 * 📦 פירוק דחיסה (לעתיד)
 */
export function decompressData(compressedData: string): string {
  // כרגע רק מחזירים את הנתונים כמו שהם
  // בעתיד יחזירו פה את הפירוק
  return compressedData;
}

/**
 * 📏 מחזיר גודל נתונים בפורמט קריא
 */
export function formatDataSize(sizeInBytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = sizeInBytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * ⚖️ מחזיר גודל string בבייטים (הערכה)
 */
export function getStringSize(str: string): number {
  // הערכה פשוטה - כל תו = 2 בייטים (UTF-16)
  return str.length * 2;
}

/**
 * 📊 מחזיר סטטיסטיקות על גודל הנתונים
 */
export function analyzeDataSize(data: string): {
  size: number;
  sizeFormatted: string;
  isLarge: boolean;
  shouldCompress: boolean;
  estimatedCompressionRatio: number;
} {
  const size = getStringSize(data);
  const isLarge = size > STORAGE_CONFIG.compressionThreshold;

  // הערכה פשוטה של יחס דחיסה לפי סוג התוכן
  let estimatedCompressionRatio = 0.7; // 30% הקטנה ברירת מחדל

  // JSON עם הרבה repetition - דחיסה טובה יותר
  if (data.includes('{"') && data.includes('"}')) {
    estimatedCompressionRatio = 0.5; // 50% הקטנה
  }

  // נתונים עם הרבה מספרים - דחיסה פחות יעילה
  if (/\d+\.\d+/g.test(data)) {
    estimatedCompressionRatio = 0.8; // 20% הקטנה
  }

  return {
    size,
    sizeFormatted: formatDataSize(size),
    isLarge,
    shouldCompress: isLarge,
    estimatedCompressionRatio,
  };
}

/**
 * 🧹 מייעל JSON להעסמת שטח
 * מסיר רווחים מיותרים ושדות ריקים
 */
export function optimizeJsonString(jsonString: string): string {
  try {
    const parsed = JSON.parse(jsonString);
    const optimized = removeEmptyFields(parsed);

    // JSON.stringify בלי רווחים
    return JSON.stringify(optimized);
  } catch (error) {
    // אם לא JSON תקף, מחזירים כמו שהיה
    return jsonString;
  }
}

/**
 * 🗑️ מסיר שדות ריקים מobject באופן רקורסיבי
 */
function removeEmptyFields(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj
      .map(removeEmptyFields)
      .filter((item) => item !== null && item !== undefined);
  }

  if (typeof obj === "object") {
    const cleaned: any = {};

    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = removeEmptyFields(value);

      // השאר רק ערכים שאינם ריקים
      if (
        cleanedValue !== null &&
        cleanedValue !== undefined &&
        cleanedValue !== "" &&
        !(Array.isArray(cleanedValue) && cleanedValue.length === 0) &&
        !(
          typeof cleanedValue === "object" &&
          Object.keys(cleanedValue).length === 0
        )
      ) {
        cleaned[key] = cleanedValue;
      }
    }

    return cleaned;
  }

  return obj;
}

/**
 * 📈 מבצע אנליזת חסכון אחרי אופטימיזציה
 */
export function calculateOptimizationSavings(
  original: string,
  optimized: string
): {
  originalSize: number;
  optimizedSize: number;
  savings: number;
  savingsPercentage: number;
  savingsFormatted: string;
} {
  const originalSize = getStringSize(original);
  const optimizedSize = getStringSize(optimized);
  const savings = originalSize - optimizedSize;
  const savingsPercentage = (savings / originalSize) * 100;

  return {
    originalSize,
    optimizedSize,
    savings,
    savingsPercentage,
    savingsFormatted: formatDataSize(savings),
  };
}

/**
 * 🔄 פונקציה מובלת לאופטימיזציה מלאה
 */
export function smartOptimize(data: string): {
  optimizedData: string;
  analysis: ReturnType<typeof analyzeDataSize>;
  savings: ReturnType<typeof calculateOptimizationSavings>;
} {
  const analysis = analyzeDataSize(data);
  let optimizedData = data;

  // נסה אופטימיזציה של JSON
  if (analysis.isLarge) {
    optimizedData = optimizeJsonString(data);

    // אם האופטימיזציה לא עזרה הרבה, השתמש בדחיסה
    const afterOptAnalysis = analyzeDataSize(optimizedData);
    if (afterOptAnalysis.shouldCompress) {
      optimizedData = compressData(optimizedData);
    }
  }

  const savings = calculateOptimizationSavings(data, optimizedData);

  if (__DEV__ && savings.savingsPercentage > 10) {
    console.log(
      `📊 Data optimization saved ${
        savings.savingsFormatted
      } (${savings.savingsPercentage.toFixed(1)}%)`
    );
  }

  return {
    optimizedData,
    analysis,
    savings,
  };
}
