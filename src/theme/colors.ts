// src/theme/colors.ts - 🎨 Enhanced Professional Color System

export interface ColorScheme {
  // Primary Brand Colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;

  // Status Colors
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  info: string;
  infoLight: string;

  // Background Colors
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    card: string;
    modal: string;
    overlay: string;
    gradient: {
      start: string;
      end: string;
    };
  };

  // Text Colors
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    accent: string;
    link: string;
    disabled: string;
  };

  // Border Colors
  border: {
    light: string;
    medium: string;
    heavy: string;
    focus: string;
    error: string;
  };

  // Shadow Colors
  shadow: {
    light: string;
    medium: string;
    heavy: string;
    colored: string;
  };

  // Component Specific Colors
  components: {
    button: {
      primary: string;
      secondary: string;
      disabled: string;
      text: string;
    };
    input: {
      background: string;
      border: string;
      placeholder: string;
    };
    card: {
      background: string;
      border: string;
      shadow: string;
    };
    navigation: {
      background: string;
      active: string;
      inactive: string;
      indicator: string;
    };
  };

  // Workout Specific Colors
  workout: {
    difficulty: {
      beginner: string;
      intermediate: string;
      advanced: string;
    };
    rating: {
      star: string;
      starEmpty: string;
    };
    progress: {
      background: string;
      fill: string;
      text: string;
    };
    muscle: {
      chest: string;
      back: string;
      legs: string;
      shoulders: string;
      arms: string;
      core: string;
    };
  };
}

// 🌞 Light Theme
export const lightColors: ColorScheme = {
  // Primary Brand Colors
  primary: "#007AFF",
  primaryLight: "#4DA6FF",
  primaryDark: "#0056CC",
  secondary: "#5856D6",
  secondaryLight: "#8B89FF",
  secondaryDark: "#3F3EAD",

  // Status Colors
  success: "#34C759",
  successLight: "#6EE087",
  warning: "#FF9500",
  warningLight: "#FFB84D",
  error: "#FF3B30",
  errorLight: "#FF6B63",
  info: "#5AC8FA",
  infoLight: "#8ADDFF",

  // Background Colors
  background: {
    primary: "#FFFFFF",
    secondary: "#F8F9FA",
    tertiary: "#F2F2F7",
    card: "#FFFFFF",
    modal: "rgba(255, 255, 255, 0.98)",
    overlay: "rgba(0, 0, 0, 0.5)",
    gradient: {
      start: "#FAFBFC",
      end: "#F0F2F5",
    },
  },

  // Text Colors
  text: {
    primary: "#1C1C1E",
    secondary: "#6B7280",
    tertiary: "#9CA3AF",
    inverse: "#FFFFFF",
    accent: "#007AFF",
    link: "#007AFF",
    disabled: "#C7C7CC",
  },

  // Border Colors
  border: {
    light: "#E5E7EB",
    medium: "#D1D5DB",
    heavy: "#9CA3AF",
    focus: "#007AFF",
    error: "#FF3B30",
  },

  // Shadow Colors
  shadow: {
    light: "rgba(0, 0, 0, 0.05)",
    medium: "rgba(0, 0, 0, 0.1)",
    heavy: "rgba(0, 0, 0, 0.15)",
    colored: "rgba(0, 122, 255, 0.2)",
  },

  // Component Specific Colors
  components: {
    button: {
      primary: "#007AFF",
      secondary: "#F2F2F7",
      disabled: "#C7C7CC",
      text: "#FFFFFF",
    },
    input: {
      background: "#F2F2F7",
      border: "#E5E7EB",
      placeholder: "#9CA3AF",
    },
    card: {
      background: "#FFFFFF",
      border: "#E5E7EB",
      shadow: "rgba(0, 0, 0, 0.08)",
    },
    navigation: {
      background: "#FFFFFF",
      active: "#007AFF",
      inactive: "#9CA3AF",
      indicator: "#007AFF",
    },
  },

  // Workout Specific Colors
  workout: {
    difficulty: {
      beginner: "#34C759",
      intermediate: "#FF9500",
      advanced: "#FF3B30",
    },
    rating: {
      star: "#FF9500",
      starEmpty: "#D1D5DB",
    },
    progress: {
      background: "#E5E7EB",
      fill: "#007AFF",
      text: "#1C1C1E",
    },
    muscle: {
      chest: "#FF6B6B",
      back: "#4ECDC4",
      legs: "#45B7D1",
      shoulders: "#96CEB4",
      arms: "#FFEAA7",
      core: "#DDA0DD",
    },
  },
};

// 🌙 Dark Theme
export const darkColors: ColorScheme = {
  // Primary Brand Colors
  primary: "#0A84FF",
  primaryLight: "#64B5F6",
  primaryDark: "#1976D2",
  secondary: "#5E5CE6",
  secondaryLight: "#9C9CFF",
  secondaryDark: "#4A47B8",

  // Status Colors
  success: "#30D158",
  successLight: "#64DD7B",
  warning: "#FF9F0A",
  warningLight: "#FFB84D",
  error: "#FF453A",
  errorLight: "#FF6B63",
  info: "#64D2FF",
  infoLight: "#8ADDFF",

  // Background Colors
  background: {
    primary: "#000000",
    secondary: "#1C1C1E",
    tertiary: "#2C2C2E",
    card: "#1C1C1E",
    modal: "rgba(28, 28, 30, 0.98)",
    overlay: "rgba(0, 0, 0, 0.7)",
    gradient: {
      start: "#1C1C1E",
      end: "#000000",
    },
  },

  // Text Colors
  text: {
    primary: "#FFFFFF",
    secondary: "#EBEBF5",
    tertiary: "#8E8E93",
    inverse: "#000000",
    accent: "#0A84FF",
    link: "#0A84FF",
    disabled: "#48484A",
  },

  // Border Colors
  border: {
    light: "#38383A",
    medium: "#48484A",
    heavy: "#636366",
    focus: "#0A84FF",
    error: "#FF453A",
  },

  // Shadow Colors
  shadow: {
    light: "rgba(0, 0, 0, 0.2)",
    medium: "rgba(0, 0, 0, 0.3)",
    heavy: "rgba(0, 0, 0, 0.4)",
    colored: "rgba(10, 132, 255, 0.3)",
  },

  // Component Specific Colors
  components: {
    button: {
      primary: "#0A84FF",
      secondary: "#2C2C2E",
      disabled: "#48484A",
      text: "#FFFFFF",
    },
    input: {
      background: "#1C1C1E",
      border: "#38383A",
      placeholder: "#8E8E93",
    },
    card: {
      background: "#1C1C1E",
      border: "#38383A",
      shadow: "rgba(0, 0, 0, 0.3)",
    },
    navigation: {
      background: "#1C1C1E",
      active: "#0A84FF",
      inactive: "#8E8E93",
      indicator: "#0A84FF",
    },
  },

  // Workout Specific Colors
  workout: {
    difficulty: {
      beginner: "#30D158",
      intermediate: "#FF9F0A",
      advanced: "#FF453A",
    },
    rating: {
      star: "#FF9F0A",
      starEmpty: "#48484A",
    },
    progress: {
      background: "#38383A",
      fill: "#0A84FF",
      text: "#FFFFFF",
    },
    muscle: {
      chest: "#FF6B6B",
      back: "#4ECDC4",
      legs: "#45B7D1",
      shoulders: "#96CEB4",
      arms: "#FFEAA7",
      core: "#DDA0DD",
    },
  },
};

// 🎨 Current Theme Management
let currentTheme: "light" | "dark" = "light";

export const getCurrentColors = (): ColorScheme => {
  return currentTheme === "light" ? lightColors : darkColors;
};

export const setTheme = (theme: "light" | "dark") => {
  currentTheme = theme;
};

export const toggleTheme = () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  return currentTheme;
};

// 🚀 Default export for backward compatibility
export const colors = lightColors;

// 🎯 Utility Functions
export const getStatusColor = (
  status: "success" | "warning" | "error" | "info",
  light = false
) => {
  const colors = getCurrentColors();
  switch (status) {
    case "success":
      return light ? colors.successLight : colors.success;
    case "warning":
      return light ? colors.warningLight : colors.warning;
    case "error":
      return light ? colors.errorLight : colors.error;
    case "info":
      return light ? colors.infoLight : colors.info;
    default:
      return colors.primary;
  }
};

export const getDifficultyColor = (
  difficulty: "beginner" | "intermediate" | "advanced"
) => {
  const colors = getCurrentColors();
  return colors.workout.difficulty[difficulty];
};

export const getMuscleColor = (muscle: string) => {
  const colors = getCurrentColors();
  const muscleMap: { [key: string]: string } = {
    chest: colors.workout.muscle.chest,
    back: colors.workout.muscle.back,
    legs: colors.workout.muscle.legs,
    shoulders: colors.workout.muscle.shoulders,
    arms: colors.workout.muscle.arms,
    core: colors.workout.muscle.core,
    biceps: colors.workout.muscle.arms,
    triceps: colors.workout.muscle.arms,
    quadriceps: colors.workout.muscle.legs,
    hamstrings: colors.workout.muscle.legs,
    calves: colors.workout.muscle.legs,
    abs: colors.workout.muscle.core,
  };

  return muscleMap[muscle.toLowerCase()] || colors.primary;
};

// 🎨 Color Utilities
export const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const lightenColor = (hex: string, percent: number) => {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const B = ((num >> 8) & 0x00ff) + amt;
  const G = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
      (G < 255 ? (G < 1 ? 0 : G) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

export const darkenColor = (hex: string, percent: number) => {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const B = ((num >> 8) & 0x00ff) - amt;
  const G = (num & 0x0000ff) - amt;
  return (
    "#" +
    (
      0x1000000 +
      (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
      (B > 255 ? 255 : B < 0 ? 0 : B) * 0x100 +
      (G > 255 ? 255 : G < 0 ? 0 : G)
    )
      .toString(16)
      .slice(1)
  );
};

// 🎯 Predefined Color Combinations
export const colorCombinations = {
  primary: {
    background: getCurrentColors().primary,
    text: getCurrentColors().text.inverse,
    border: getCurrentColors().primary,
  },
  secondary: {
    background: getCurrentColors().secondary,
    text: getCurrentColors().text.inverse,
    border: getCurrentColors().secondary,
  },
  success: {
    background: getCurrentColors().success,
    text: getCurrentColors().text.inverse,
    border: getCurrentColors().success,
  },
  warning: {
    background: getCurrentColors().warning,
    text: getCurrentColors().text.inverse,
    border: getCurrentColors().warning,
  },
  error: {
    background: getCurrentColors().error,
    text: getCurrentColors().text.inverse,
    border: getCurrentColors().error,
  },
  neutral: {
    background: getCurrentColors().background.secondary,
    text: getCurrentColors().text.primary,
    border: getCurrentColors().border.light,
  },
};

// 🎨 Gradient Definitions
export const gradients = {
  primary: [getCurrentColors().primary, getCurrentColors().primaryDark],
  secondary: [getCurrentColors().secondary, getCurrentColors().secondaryDark],
  success: [
    getCurrentColors().success,
    darkenColor(getCurrentColors().success, 20),
  ],
  warning: [
    getCurrentColors().warning,
    darkenColor(getCurrentColors().warning, 20),
  ],
  error: [getCurrentColors().error, darkenColor(getCurrentColors().error, 20)],
  background: [
    getCurrentColors().background.gradient.start,
    getCurrentColors().background.gradient.end,
  ],
  muscle: {
    chest: [
      getCurrentColors().workout.muscle.chest,
      darkenColor(getCurrentColors().workout.muscle.chest, 20),
    ],
    back: [
      getCurrentColors().workout.muscle.back,
      darkenColor(getCurrentColors().workout.muscle.back, 20),
    ],
    legs: [
      getCurrentColors().workout.muscle.legs,
      darkenColor(getCurrentColors().workout.muscle.legs, 20),
    ],
    shoulders: [
      getCurrentColors().workout.muscle.shoulders,
      darkenColor(getCurrentColors().workout.muscle.shoulders, 20),
    ],
    arms: [
      getCurrentColors().workout.muscle.arms,
      darkenColor(getCurrentColors().workout.muscle.arms, 20),
    ],
    core: [
      getCurrentColors().workout.muscle.core,
      darkenColor(getCurrentColors().workout.muscle.core, 20),
    ],
  },
};

// 🎯 Export everything for easy access
export { lightColors, darkColors, colorCombinations, gradients };
