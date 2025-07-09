// src/theme/design/spacing/index.ts
// מערכת רווחים עקבית ומדורגת

/**
 * מערכת רווחים בת 8 נקודות
 * נבנית על בסיס של 4px כיחידה בסיסית
 */
export const spacing = {
  // שמות תיאוריים
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
  enormous: 64,

  // גישה מספרית מהירה
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 32,
  8: 40,
  9: 48,
  10: 64,
} as const;

/**
 * טיפוס עבור מפתחות הרווחים
 */
export type SpacingKey = keyof typeof spacing;

/**
 * טיפוס עבור ערכי הרווחים
 */
export type SpacingValue = (typeof spacing)[SpacingKey];

/**
 * פונקציה לקבלת ערך רווח
 * @param key - מפתח הרווח
 * @returns ערך הרווח בפיקסלים
 */
export const getSpacing = (key: SpacingKey): SpacingValue => {
  return spacing[key];
};

/**
 * פונקציה לקבלת רווח מותאם
 * @param base - רווח בסיסי
 * @param multiplier - מכפיל
 * @returns ערך רווח מותאם
 */
export const getCustomSpacing = (
  base: SpacingKey,
  multiplier: number
): number => {
  return spacing[base] * multiplier;
};

/**
 * רווחים נפוצים למרכיבים
 */
export const componentSpacing = {
  // Buttons
  buttonPadding: {
    small: { vertical: spacing.sm, horizontal: spacing.md },
    medium: { vertical: spacing.md, horizontal: spacing.xl },
    large: { vertical: spacing.lg, horizontal: spacing.xxl },
  },

  // Cards
  cardPadding: {
    small: spacing.md,
    medium: spacing.xl,
    large: spacing.xxxl,
  },

  // Inputs
  inputPadding: {
    vertical: spacing.md,
    horizontal: spacing.lg,
  },

  // Containers
  containerPadding: {
    screen: spacing.xl,
    content: spacing.lg,
    section: spacing.md,
  },

  // Lists
  listSpacing: {
    itemGap: spacing.md,
    sectionGap: spacing.xxl,
  },
} as const;

/**
 * רווחים עבור מסכי נייד
 */
export const mobileSpacing = {
  safeAreaTop: 44,
  safeAreaBottom: 34,
  tabBarHeight: 80,
  headerHeight: 56,
  navigationPadding: spacing.lg,
} as const;

/**
 * פונקציה לחישוב רווח עבור רשתות
 * @param columns - מספר עמודות
 * @param gap - רווח בין עמודות
 * @param containerWidth - רוחב הקונטיינר
 * @returns רוחב עמודה
 */
export const calculateGridItemWidth = (
  columns: number,
  gap: SpacingValue,
  containerWidth: number
): number => {
  const totalGap = (columns - 1) * gap;
  return (containerWidth - totalGap) / columns;
};
