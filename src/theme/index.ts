// src/theme/index.ts
// 🎨 מערכת Theme מרכזית עם מערכת עיצוב מאוחדת

import { unifiedDesignSystem, designGuidelines } from "./unifiedDesignSystem";

// ייצוא מערכת העיצוב המאוחדת כמערכת ברירת המחדל
export const theme = unifiedDesignSystem;

// ייצוא רכיבים ספציפיים לנוחות
export const {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  animation,
  button,
  card,
  screen,
  input,
  modal,
} = unifiedDesignSystem;

// ייצוא הנחיות עיצוב
export { designGuidelines };

// ייצוא ברירת מחדל
export default theme;
