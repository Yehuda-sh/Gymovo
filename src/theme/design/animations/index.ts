// src/theme/design/animations/index.ts
// מערכת אנימציות עקבית עם תזמון ופונקציות מעבר

/**
 * זמני אנימציות סטנדרטיים
 */
export const timing = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
  slowest: 750,
} as const;

/**
 * פונקציות מעבר (easing functions)
 */
export const easing = {
  // CSS easing functions
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",

  // Custom cubic-bezier curves
  smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
  snappy: "cubic-bezier(0.4, 0, 0.6, 1)",
  bouncy: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",

  // React Native equivalents
  spring: { tension: 100, friction: 8 },
  bounce: { tension: 50, friction: 4 },
  gentle: { tension: 120, friction: 10 },
} as const;

/**
 * טיפוסים עבור מפתחות התזמון
 */
export type TimingKey = keyof typeof timing;

/**
 * פונקציה לקבלת זמן אנימציה
 * @param key - מפתח התזמון
 * @returns זמן האנימציה במילישניות
 */
export const getTiming = (key: TimingKey): number => {
  return timing[key];
};

/**
 * הגדרות אנימציה נפוצות
 */
export const presets = {
  // אנימציות בסיסיות
  fadeIn: {
    duration: timing.normal,
    easing: easing.easeOut,
  },

  fadeOut: {
    duration: timing.fast,
    easing: easing.easeIn,
  },

  slideIn: {
    duration: timing.normal,
    easing: easing.smooth,
  },

  slideOut: {
    duration: timing.fast,
    easing: easing.smooth,
  },

  // אנימציות אינטראקטיביות
  buttonPress: {
    duration: timing.fast,
    easing: easing.snappy,
  },

  buttonRelease: {
    duration: timing.normal,
    easing: easing.smooth,
  },

  // אנימציות מודאליות
  modalAppear: {
    duration: timing.slow,
    easing: easing.smooth,
  },

  modalDisappear: {
    duration: timing.normal,
    easing: easing.easeIn,
  },

  // אנימציות רשימות
  listItemAppear: {
    duration: timing.normal,
    easing: easing.smooth,
  },

  listItemDisappear: {
    duration: timing.fast,
    easing: easing.easeIn,
  },
} as const;

/**
 * אנימציות עבור מעברים בין מסכים
 */
export const screenTransitions = {
  // Push/Pop navigation
  push: {
    duration: timing.slow,
    easing: easing.smooth,
  },

  pop: {
    duration: timing.normal,
    easing: easing.easeOut,
  },

  // Modal presentations
  present: {
    duration: timing.slow,
    easing: easing.smooth,
  },

  dismiss: {
    duration: timing.normal,
    easing: easing.easeIn,
  },

  // Tab switching
  tabSwitch: {
    duration: timing.fast,
    easing: easing.snappy,
  },
} as const;

/**
 * אנימציות עבור רכיבי כושר
 */
export const fitnessAnimations = {
  // Timer animations
  timerTick: {
    duration: timing.fast,
    easing: easing.snappy,
  },

  timerComplete: {
    duration: timing.slower,
    easing: easing.bouncy,
  },

  // Progress animations
  progressFill: {
    duration: timing.slow,
    easing: easing.smooth,
  },

  progressComplete: {
    duration: timing.normal,
    easing: easing.bouncy,
  },

  // Set completion
  setComplete: {
    duration: timing.normal,
    easing: easing.smooth,
  },

  // Workout transitions
  exerciseChange: {
    duration: timing.normal,
    easing: easing.smooth,
  },

  restPeriod: {
    duration: timing.fast,
    easing: easing.easeOut,
  },

  // Stats updates
  statUpdate: {
    duration: timing.slow,
    easing: easing.smooth,
  },
} as const;

/**
 * פונקציה ליצירת אנימציה מותאמת
 * @param duration - משך האנימציה
 * @param easingFunction - פונקצית המעבר
 * @param delay - עיכוב התחלה
 * @returns אובייקט אנימציה
 */
export const createAnimation = (
  duration: number = timing.normal,
  easingFunction: string = easing.smooth,
  delay: number = 0
) => {
  return {
    duration,
    easing: easingFunction,
    delay,
  };
};

/**
 * פונקציה לקבלת אנימציה עבור מצב
 * @param isEntering - האם הרכיב נכנס או יוצא
 * @param isInteractive - האם זה רכיב אינטראקטיבי
 * @returns הגדרות אנימציה
 */
export const getStateAnimation = (
  isEntering: boolean = true,
  isInteractive: boolean = false
) => {
  if (isInteractive) {
    return isEntering ? presets.buttonPress : presets.buttonRelease;
  }
  return isEntering ? presets.fadeIn : presets.fadeOut;
};

/**
 * עיכובים עבור אנימציות מדורגות
 */
export const staggerDelays = {
  listItems: 50,
  cards: 100,
  buttons: 25,
  stats: 150,
} as const;

/**
 * פונקציה לחישוב עיכוב מדורג
 * @param index - אינדקס הפריט
 * @param baseDelay - עיכוב בסיסי
 * @returns עיכוב מחושב
 */
export const getStaggerDelay = (
  index: number,
  baseDelay: number = staggerDelays.listItems
): number => {
  return index * baseDelay;
};
