// src/theme/authTheme.ts
// 🎨 מערכת עיצוב מאוחדת למסכי Auth - מבוססת על העיצוב האהוב של LoginScreen, WelcomeScreen, SignupScreen

import { Platform, TextStyle, ViewStyle } from "react-native";

// 🎨 פלטת צבעים ראשית
export const authColors = {
  // צבעי גרדיאנט ראשיים
  gradients: {
    primary: ["#667eea", "#764ba2"] as [string, string],
    secondary: ["#764ba2", "#667eea"] as [string, string],
    background: ["#0f0c29", "#302b63", "#24243e"] as [string, string, string],
    dark: ["#1a1a2e", "#16213e", "#0f3460"] as [string, string, string],
    overlay: ["#000000", "#130F40"] as [string, string],
    success: ["#00ff88", "#00d68f"] as [string, string],
    error: ["#ff3366", "#ff5252"] as [string, string],
    warning: ["#FFD23F", "#FFB74D"] as [string, string],
  },

  // צבעים בודדים
  primary: "#667eea",
  secondary: "#764ba2",
  accent: "#00ff88",

  // רקעים
  background: "transparent", // כי אנחנו משתמשים בגרדיאנט
  surface: "rgba(0, 0, 0, 0.3)",
  surfaceLight: "rgba(255, 255, 255, 0.05)",

  // טקסט
  text: "#ffffff",
  textSecondary: "rgba(255, 255, 255, 0.8)",
  textMuted: "rgba(255, 255, 255, 0.5)",

  // מצבים
  error: "#ff3366",
  success: "#00ff88",
  warning: "#FFD23F",
  info: "#667eea",

  // גבולות
  border: "rgba(255, 255, 255, 0.2)",
  borderLight: "rgba(255, 255, 255, 0.1)",
  borderActive: "#667eea",
  borderError: "#ff3366",

  // אינפוטים
  inputBackground: "rgba(0, 0, 0, 0.4)",
  inputBorder: "rgba(102, 126, 234, 0.4)",
  inputBorderActive: "#667eea",
  inputBorderError: "#ff3366",

  // אפקטים
  glow: "rgba(102, 126, 234, 0.3)",
  shadow: "rgba(0, 0, 0, 0.5)",
};

// 📐 מידות וגדלים
export const authDimensions = {
  // רווחים
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },

  // רדיוסים
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    round: 9999,
  },

  // גדלי פונט
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    xxxl: 40,
    hero: 48,
  },

  // גבהים
  heights: {
    input: 56,
    button: 56,
    buttonSmall: 44,
    logo: 100,
    logoSmall: 80,
  },
};

// 🎯 סגנונות רכיבים
export const authComponents = {
  // רקע גרדיאנט
  backgroundGradient: {
    props: {
      colors: authColors.gradients.background,
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    } as ViewStyle,
  },

  // לוגו
  logo: {
    container: {
      width: authDimensions.heights.logo,
      height: authDimensions.heights.logo,
      borderRadius: authDimensions.heights.logo / 2,
      backgroundColor: authColors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: authColors.glow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 15,
      elevation: 12,
    } as ViewStyle,

    glow: {
      position: "absolute",
      width: authDimensions.heights.logo + 20,
      height: authDimensions.heights.logo + 20,
      borderRadius: (authDimensions.heights.logo + 20) / 2,
      backgroundColor: authColors.accent,
      opacity: 0.3,
    } as ViewStyle,
  },

  // כותרות
  title: {
    hero: {
      fontSize: authDimensions.fontSize.hero,
      fontWeight: "700",
      color: authColors.text,
      textAlign: "center",
      letterSpacing: -1,
    } as TextStyle,

    primary: {
      fontSize: authDimensions.fontSize.xxxl,
      fontWeight: "700",
      color: authColors.text,
      textAlign: "center",
    } as TextStyle,

    secondary: {
      fontSize: authDimensions.fontSize.xl,
      fontWeight: "600",
      color: authColors.text,
      textAlign: "center",
    } as TextStyle,
  },

  // טקסטים
  text: {
    subtitle: {
      fontSize: authDimensions.fontSize.md,
      color: authColors.textSecondary,
      textAlign: "center",
      lineHeight: 24,
      fontWeight: "400",
    } as TextStyle,

    muted: {
      fontSize: authDimensions.fontSize.sm,
      color: authColors.textMuted,
      textAlign: "center",
    } as TextStyle,

    link: {
      fontSize: authDimensions.fontSize.sm,
      color: authColors.primary,
      textDecorationLine: "underline",
    } as TextStyle,
  },

  // אינפוטים
  input: {
    container: {
      marginBottom: authDimensions.spacing.md,
    } as ViewStyle,

    wrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: authColors.inputBackground,
      borderRadius: authDimensions.borderRadius.lg,
      borderWidth: 1,
      borderColor: authColors.inputBorder,
      height: authDimensions.heights.input,
    } as ViewStyle,

    field: {
      flex: 1,
      paddingHorizontal: authDimensions.spacing.md,
      fontSize: authDimensions.fontSize.md,
      color: authColors.text,
    } as TextStyle,

    icon: {
      marginLeft: authDimensions.spacing.md,
    } as ViewStyle,

    // מצבים
    active: {
      borderColor: authColors.inputBorderActive,
    } as ViewStyle,

    error: {
      borderColor: authColors.inputBorderError,
    } as ViewStyle,
  },

  // כפתורים
  button: {
    primary: {
      container: {
        borderRadius: authDimensions.borderRadius.lg,
        overflow: "hidden",
        shadowColor: authColors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
      } as ViewStyle,

      gradient: {
        colors: authColors.gradients.primary,
        props: {
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        },
        style: {
          paddingVertical: authDimensions.spacing.lg - 6,
          alignItems: "center",
          justifyContent: "center",
        } as ViewStyle,
      },

      text: {
        fontSize: authDimensions.fontSize.lg,
        fontWeight: "700",
        color: authColors.text,
        textAlign: "center",
      } as TextStyle,
    },

    secondary: {
      container: {
        backgroundColor: authColors.surfaceLight,
        borderColor: authColors.border,
        borderWidth: 1,
        borderRadius: authDimensions.borderRadius.lg,
        paddingVertical: authDimensions.spacing.lg - 6,
      } as ViewStyle,

      text: {
        fontSize: authDimensions.fontSize.md,
        fontWeight: "600",
        color: authColors.textSecondary,
        textAlign: "center",
      } as TextStyle,
    },

    ghost: {
      container: {
        paddingVertical: authDimensions.spacing.md,
        paddingHorizontal: authDimensions.spacing.lg,
      } as ViewStyle,

      text: {
        fontSize: authDimensions.fontSize.sm,
        color: authColors.primary,
        textDecorationLine: "underline",
      } as TextStyle,
    },
  },

  // כרטיסים
  card: {
    container: {
      backgroundColor: authColors.surface,
      borderRadius: authDimensions.borderRadius.xl,
      padding: authDimensions.spacing.lg,
      borderWidth: 1,
      borderColor: authColors.borderLight,
    } as ViewStyle,

    blur: {
      props: {
        intensity: 80,
        tint: "dark",
      },
      style: {
        borderRadius: authDimensions.borderRadius.xl,
      } as ViewStyle,
    },
  },

  // הודעות שגיאה
  error: {
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 51, 102, 0.1)",
      borderColor: "rgba(255, 51, 102, 0.3)",
      borderWidth: 1,
      borderRadius: authDimensions.borderRadius.md,
      padding: authDimensions.spacing.md,
    } as ViewStyle,

    text: {
      color: authColors.error,
      fontSize: authDimensions.fontSize.sm,
      marginLeft: authDimensions.spacing.sm,
      flex: 1,
    } as TextStyle,
  },
};

// 🎭 אנימציות
export const authAnimations = {
  // תזמונים
  durations: {
    fast: 200,
    normal: 300,
    slow: 600,
    verySlow: 1000,
  },

  // Easing
  easing: {
    bounce: {
      tension: 100,
      friction: 8,
    },
    smooth: {
      tension: 50,
      friction: 7,
    },
  },

  // אנימציות נפוצות
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: 600,
  },

  slideUp: {
    from: { translateY: 50 },
    to: { translateY: 0 },
    duration: 400,
  },

  scale: {
    from: { scale: 0.9 },
    to: { scale: 1 },
    duration: 300,
  },
};

// 🛠️ פונקציות עזר
export const authHelpers = {
  // יצירת צל
  createShadow: (
    color: string,
    opacity: number = 0.3,
    radius: number = 10
  ) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: radius / 2,
  }),

  // יצירת גרדיאנט props
  createGradientProps: (colors: string[], horizontal = false) => ({
    colors,
    start: { x: 0, y: 0 },
    end: horizontal ? { x: 1, y: 0 } : { x: 0, y: 1 },
  }),

  // בדיקת פלטפורמה
  isIOS: Platform.OS === "ios",
  isAndroid: Platform.OS === "android",
};

// 🎯 דוגמאות שימוש
export const authThemeExamples = {
  // רקע מלא עם גרדיאנט
  fullScreenWithGradient: `
    <View style={{ flex: 1 }}>
      <LinearGradient
        {...authComponents.backgroundGradient.props}
        style={StyleSheet.absoluteFillObject}
      />
      {/* התוכן שלך */}
    </View>
  `,

  // כפתור ראשי
  primaryButton: `
    <TouchableOpacity style={authComponents.button.primary.container}>
      <LinearGradient
        {...authComponents.button.primary.gradient.props}
        colors={authComponents.button.primary.gradient.colors}
        style={authComponents.button.primary.gradient.style}
      >
        <Text style={authComponents.button.primary.text}>התחבר</Text>
      </LinearGradient>
    </TouchableOpacity>
  `,

  // אינפוט עם אייקון
  inputWithIcon: `
    <View style={authComponents.input.container}>
      <View style={[authComponents.input.wrapper, hasError && authComponents.input.error]}>
        <Ionicons name="mail" size={20} color={authColors.textMuted} style={authComponents.input.icon} />
        <TextInput
          style={authComponents.input.field}
          placeholder="אימייל"
          placeholderTextColor={authColors.textMuted}
        />
      </View>
    </View>
  `,
};

// Export default theme object
export default {
  colors: authColors,
  dimensions: authDimensions,
  components: authComponents,
  animations: authAnimations,
  helpers: authHelpers,
};
