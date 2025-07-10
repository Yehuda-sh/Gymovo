// src/theme/rtl.ts
// מערכת RTL מרכזית לכל האפליקציה

import { I18nManager, Platform, TextStyle, ViewStyle } from "react-native";

// Force RTL layout
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

/**
 * RTL Configuration
 */
const rtlConfig = {
  isRTL: true,
  textAlign: "right" as const,
  flexDirection: "row-reverse" as const,
};

/**
 * RTL Text Styles
 */
const rtlText: TextStyle = {
  textAlign: "right",
  writingDirection: "rtl",
};

/**
 * RTL View Styles
 */
const rtlView: ViewStyle = {
  flexDirection: "row-reverse",
};

/**
 * RTL Safe Styles - מתאים סגנונות לכיוון RTL
 */
const rtlSafe = {
  // Text alignment
  textAlign: (
    align: "left" | "right" | "center" | "auto" = "right"
  ): TextStyle => {
    if (align === "center") return { textAlign: "center" };
    if (align === "left") return { textAlign: "right" }; // Flip for RTL
    if (align === "right") return { textAlign: "left" }; // Flip for RTL
    return { textAlign: "right" }; // Default RTL
  },

  // Flex direction
  flexDirection: (
    direction: "row" | "row-reverse" | "column" | "column-reverse" = "row"
  ): ViewStyle => {
    if (direction === "row") return { flexDirection: "row-reverse" };
    if (direction === "row-reverse") return { flexDirection: "row" };
    return { flexDirection: direction };
  },

  // Margins
  marginLeft: (value: number): ViewStyle => ({ marginRight: value }),
  marginRight: (value: number): ViewStyle => ({ marginLeft: value }),

  // Paddings
  paddingLeft: (value: number): ViewStyle => ({ paddingRight: value }),
  paddingRight: (value: number): ViewStyle => ({ paddingLeft: value }),

  // Positions
  left: (value: number | string): ViewStyle => ({ right: value as any }),
  right: (value: number | string): ViewStyle => ({ left: value as any }),

  // Border radius
  borderTopLeftRadius: (value: number): ViewStyle => ({
    borderTopRightRadius: value,
  }),
  borderTopRightRadius: (value: number): ViewStyle => ({
    borderTopLeftRadius: value,
  }),
  borderBottomLeftRadius: (value: number): ViewStyle => ({
    borderBottomRightRadius: value,
  }),
  borderBottomRightRadius: (value: number): ViewStyle => ({
    borderBottomLeftRadius: value,
  }),
};

/**
 * Common RTL Styles
 */
const rtlStyles = {
  // Container styles
  container: {
    flex: 1,
    ...rtlText,
  } as ViewStyle,

  // Row layouts
  row: {
    flexDirection: "row-reverse" as const,
    alignItems: "center" as const,
  } as ViewStyle,

  rowSpaceBetween: {
    flexDirection: "row-reverse" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  } as ViewStyle,

  // Text styles
  text: {
    textAlign: "right" as const,
    writingDirection: "rtl" as const,
  } as TextStyle,

  centerText: {
    textAlign: "center" as const,
  } as TextStyle,

  // Input styles
  input: {
    textAlign: "right" as const,
    writingDirection: "rtl" as const,
  } as TextStyle,

  // Button styles
  buttonRow: {
    flexDirection: "row-reverse" as const,
    gap: 12,
  } as ViewStyle,

  // Icon with text
  iconText: {
    flexDirection: "row-reverse" as const,
    alignItems: "center" as const,
    gap: 8,
  } as ViewStyle,

  // List item
  listItem: {
    flexDirection: "row-reverse" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
  } as ViewStyle,

  // Card header
  cardHeader: {
    flexDirection: "row-reverse" as const,
    justifyContent: "space-between" as const,
    alignItems: "flex-start" as const,
  } as ViewStyle,

  // Form field
  formField: {
    textAlign: "right" as const,
    writingDirection: "rtl" as const,
  } as TextStyle,

  // Stats row
  statsRow: {
    flexDirection: "row-reverse" as const,
    justifyContent: "space-around" as const,
  } as ViewStyle,

  // Navigation buttons
  navButtons: {
    flexDirection: "row-reverse" as const,
    justifyContent: "space-between" as const,
  } as ViewStyle,

  // Tab bar
  tabBar: {
    flexDirection: "row-reverse" as const,
  } as ViewStyle,

  // Modal actions
  modalActions: {
    flexDirection: "row-reverse" as const,
    justifyContent: "flex-start" as const,
    gap: 12,
  } as ViewStyle,
};

/**
 * RTL Icons - איקונים עם כיוון נכון
 */
const rtlIcons = {
  // Navigation
  back: Platform.OS === "ios" ? "chevron-forward" : "arrow-forward",
  forward: Platform.OS === "ios" ? "chevron-back" : "arrow-back",

  // Arrows
  arrowLeft: "arrow-forward",
  arrowRight: "arrow-back",

  // Chevrons
  chevronLeft: "chevron-forward",
  chevronRight: "chevron-back",

  // Play controls
  next: "play-skip-back",
  previous: "play-skip-forward",
};

/**
 * RTL Helper Functions
 */
const rtlHelpers = {
  // Get correct icon based on RTL
  getIcon: (ltrIcon: string, rtlIcon: string): string => {
    return I18nManager.isRTL ? rtlIcon : ltrIcon;
  },

  // Flip style based on RTL
  flipStyle: <T extends ViewStyle | TextStyle>(style: T): T => {
    const flipped = { ...style };

    // Flip margins
    if ("marginLeft" in flipped && flipped.marginLeft !== undefined) {
      flipped.marginRight = flipped.marginLeft;
      delete flipped.marginLeft;
    }
    if ("marginRight" in flipped && flipped.marginRight !== undefined) {
      flipped.marginLeft = flipped.marginRight;
      delete flipped.marginRight;
    }

    // Flip paddings
    if ("paddingLeft" in flipped && flipped.paddingLeft !== undefined) {
      flipped.paddingRight = flipped.paddingLeft;
      delete flipped.paddingLeft;
    }
    if ("paddingRight" in flipped && flipped.paddingRight !== undefined) {
      flipped.paddingLeft = flipped.paddingRight;
      delete flipped.paddingRight;
    }

    // Flip positions
    if ("left" in flipped && flipped.left !== undefined) {
      flipped.right = flipped.left;
      delete flipped.left;
    }
    if ("right" in flipped && flipped.right !== undefined) {
      flipped.left = flipped.right;
      delete flipped.right;
    }

    // Flip flex direction
    if ("flexDirection" in flipped) {
      if (flipped.flexDirection === "row") {
        flipped.flexDirection = "row-reverse";
      } else if (flipped.flexDirection === "row-reverse") {
        flipped.flexDirection = "row";
      }
    }

    // Flip text align
    if ("textAlign" in flipped) {
      if (flipped.textAlign === "left") {
        flipped.textAlign = "right";
      } else if (flipped.textAlign === "right") {
        flipped.textAlign = "left";
      }
    }

    return flipped;
  },

  // Conditional RTL style
  conditionalStyle: (rtlStyle: any, ltrStyle: any) => {
    return I18nManager.isRTL ? rtlStyle : ltrStyle;
  },
};

/**
 * Export all RTL utilities
 */
export default {
  config: rtlConfig,
  text: rtlText,
  view: rtlView,
  safe: rtlSafe,
  styles: rtlStyles,
  icons: rtlIcons,
  helpers: rtlHelpers,
};

// Named exports for easier destructuring
export {
  rtlConfig,
  rtlText,
  rtlView,
  rtlSafe,
  rtlStyles,
  rtlIcons,
  rtlHelpers,
};
