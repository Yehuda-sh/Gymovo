// src/theme/design/tokens/index.ts
// טוקנים בסיסיים לעיצוב

/**
 * מערכת border radius
 */
export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  round: 50,
  full: 999,
} as const;

/**
 * טיפוס עבור מפתחות border radius
 */
export type BorderRadiusKey = keyof typeof borderRadius;

/**
 * נקודות שבירה למסכים שונים
 */
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
} as const;

/**
 * מידות מסכים נפוצות
 */
export const screenSizes = {
  // Mobile
  mobileSmall: 320,
  mobileMedium: 375,
  mobileLarge: 414,

  // Tablet
  tabletSmall: 768,
  tabletMedium: 820,
  tabletLarge: 1024,

  // Desktop
  desktopSmall: 1280,
  desktopMedium: 1440,
  desktopLarge: 1920,
} as const;

/**
 * גבולות לעובי קווים
 */
export const borderWidths = {
  none: 0,
  hairline: 0.5,
  thin: 1,
  thick: 2,
  thicker: 3,
  thickest: 4,
} as const;

/**
 * אטימות סטנדרטית
 */
export const opacity = {
  transparent: 0,
  faint: 0.1,
  light: 0.2,
  medium: 0.4,
  semiopaque: 0.6,
  opaque: 0.8,
  solid: 1,
} as const;

/**
 * גדלים לאייקונים
 */
export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
  huge: 64,
  massive: 80,
} as const;

/**
 * גבהים נפוצים לרכיבים
 */
export const heights = {
  input: 48,
  inputSmall: 36,
  inputLarge: 56,
  button: 48,
  buttonSmall: 36,
  buttonLarge: 56,
  tabBar: 80,
  header: 56,
  headerLarge: 96,
  card: 120,
  cardSmall: 80,
  cardLarge: 160,
} as const;

/**
 * רוחבים נפוצים לרכיבים
 */
export const widths = {
  full: "100%",
  half: "50%",
  third: "33.333%",
  quarter: "25%",
  auto: "auto",
} as const;

/**
 * מרווחים לאלמנטים פלקסיבליים
 */
export const flexValues = {
  none: 0,
  auto: "auto",
  initial: "initial",
  inherit: "inherit",
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
} as const;

/**
 * z-index layers
 */
export const zIndex = {
  base: 0,
  content: 10,
  nav: 100,
  modal: 1000,
  overlay: 1100,
  tooltip: 1200,
  toast: 1300,
  max: 9999,
} as const;

/**
 * פונקציה לקבלת border radius
 * @param key - מפתח הרדיוס
 * @returns ערך הרדיוס
 */
export const getBorderRadius = (key: BorderRadiusKey): number => {
  return borderRadius[key];
};

/**
 * פונקציה לבדיקת breakpoint
 * @param width - רוחב המסך
 * @returns שם הbreakpoint
 */
export const getBreakpoint = (width: number): keyof typeof breakpoints => {
  if (width >= breakpoints.xxl) return "xxl";
  if (width >= breakpoints.xl) return "xl";
  if (width >= breakpoints.lg) return "lg";
  if (width >= breakpoints.md) return "md";
  if (width >= breakpoints.sm) return "sm";
  return "xs";
};

/**
 * פונקציה ליצירת responsive value
 * @param values - ערכים לפי breakpoints
 * @param currentWidth - רוחב נוכחי
 * @returns ערך מתאים
 */
export const getResponsiveValue = <T>(
  values: Partial<Record<keyof typeof breakpoints, T>>,
  currentWidth: number
): T | undefined => {
  const breakpoint = getBreakpoint(currentWidth);

  // חפש את הערך המתאים החל מהbreakpoint הנוכחי וכלפי מטה
  const breakpointOrder: (keyof typeof breakpoints)[] = [
    "xxl",
    "xl",
    "lg",
    "md",
    "sm",
    "xs",
  ];
  const currentIndex = breakpointOrder.indexOf(breakpoint);

  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const key = breakpointOrder[i];
    if (values[key] !== undefined) {
      return values[key];
    }
  }

  return undefined;
};

/**
 * טוקנים עבור מרכיבי כושר
 */
export const fitnessTokens = {
  // Exercise card sizes
  exerciseCard: {
    height: heights.card,
    width: "100%",
    borderRadius: borderRadius.lg,
  },

  // Set input sizes
  setInput: {
    height: heights.inputSmall,
    width: 60,
    borderRadius: borderRadius.sm,
  },

  // Progress indicators
  progressBar: {
    height: 4,
    borderRadius: borderRadius.full,
  },

  // Timer display
  timer: {
    height: 120,
    width: 200,
    borderRadius: borderRadius.xl,
  },

  // Stat cards
  statCard: {
    height: 80,
    width: 100,
    borderRadius: borderRadius.md,
  },
} as const;
