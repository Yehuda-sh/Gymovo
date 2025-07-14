// src/screens/plans/plans-screen/utils.ts
// פונקציות עזר וקבועים למסך תוכניות האימון - גרסה משופרת

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types/navigation";
import { colors } from "../../../theme/colors";
import { Plan } from "../../../types/plan";
import { Animated, Dimensions, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// הגדרת designSystem מקומית עד ליצירת הקובץ המלא
const designSystem = {
  colors: {
    primary: {
      main: colors.primary,
      dark: colors.primaryDark,
    },
    secondary: {
      main: colors.secondary,
    },
    semantic: {
      success: colors.success,
      error: colors.error,
      warning: colors.warning,
    },
    neutral: {
      text: {
        primary: colors.text,
        secondary: colors.textSecondary,
        tertiary: colors.textMuted,
      },
    },
  },
  gradients: {
    primary: {
      colors: [colors.primary, colors.primaryDark],
    },
  },
  animations: {
    easings: {
      spring: {
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      },
      bounce: {
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      },
    },
  },
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// מצב הפילטר הנוכחי במסך
export type FilterType = "all" | "mine" | "recommended";

// מידע על פילטר בודד
export interface FilterInfo {
  id: FilterType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
}

// פרמטרים לרכיב תג
export interface TagProps {
  text: string;
  color?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

// פרמטרים לרכיב חיפוש
export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

// פרמטרים לרכיב פילטרים
export interface FilterTabsProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    mine: number;
    recommended: number;
  };
}

// פרמטרים לרכיב EmptyState
export interface EmptyStateProps {
  message: string;
  actionText?: string;
  onAction?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

// קבועים משופרים
export const filtersList: FilterInfo[] = [
  {
    id: "all",
    label: "הכל",
    icon: "apps" as keyof typeof Ionicons.glyphMap,
    color: colors.primary,
  },
  {
    id: "mine",
    label: "שלי",
    icon: "person" as keyof typeof Ionicons.glyphMap,
    color: colors.secondary,
  },
  {
    id: "recommended",
    label: "מומלצות",
    icon: "star" as keyof typeof Ionicons.glyphMap,
    color: colors.warning,
  },
];

// פונקציות עזר משופרות

// קבלת גרדיאנט לפי רמת קושי עם fallback בטוח
export const getDifficultyGradient = (difficulty?: string): string[] => {
  const gradients = {
    beginner: ["#00C9FF", "#0081FF"],
    intermediate: ["#FC466B", "#3F5EFB"],
    advanced: ["#FF416C", "#FF4B2B"],
  };

  return (
    gradients[difficulty as keyof typeof gradients] ||
    designSystem.gradients.primary.colors
  );
};

// קבלת טקסט עברי לרמת קושי
export const getDifficultyText = (difficulty?: string): string => {
  const texts = {
    beginner: "מתחילים",
    intermediate: "מתקדמים",
    advanced: "מומחים",
  };

  return texts[difficulty as keyof typeof texts] || "כללי";
};

// עיכוב אנימציה מתקדם לפי אינדקס
export const getAnimationDelay = (
  index: number,
  baseDelay: number = 100
): number => {
  // עיכוב מדורג עם עקומה לוגריתמית למניעת עיכובים ארוכים מדי
  const maxDelay = 800;
  const delay = baseDelay * Math.log(index + 1);
  return Math.min(delay, maxDelay);
};

// יצירת אנימציית לחיצה עם haptic feedback
export const createPressAnimation = (
  scaleAnim: Animated.Value,
  withHaptic: boolean = true
) => {
  if (withHaptic && Platform.OS === "ios") {
    import("expo-haptics").then((Haptics) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    });
  }

  return Animated.sequence([
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      tension: 100,
      friction: 10,
      useNativeDriver: true,
    }),
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    }),
  ]);
};

// יצירת אנימציית כניסה מרכזית משופרת
export const createEntranceAnimation = (
  fadeAnim: Animated.Value,
  slideAnim: Animated.Value,
  headerScale: Animated.Value
) => {
  return Animated.parallel([
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }),
    Animated.spring(slideAnim, {
      toValue: 0,
      ...designSystem.animations.easings.spring,
    }),
    Animated.spring(headerScale, {
      toValue: 1,
      delay: 200,
      ...designSystem.animations.easings.bounce,
    }),
  ]);
};

// סינון תוכניות מתקדם עם דירוג רלוונטיות
export const filterPlansBySearch = (
  plans: Plan[],
  searchQuery: string
): Plan[] => {
  if (!searchQuery.trim()) {
    return plans;
  }

  const query = searchQuery.toLowerCase().trim();

  // חישוב ציון רלוונטיות לכל תוכנית
  const plansWithScore = plans.map((plan) => {
    let score = 0;

    // התאמה מדויקת בשם - ציון גבוה
    if (plan.name.toLowerCase() === query) score += 100;
    else if (plan.name.toLowerCase().includes(query)) score += 50;

    // התאמה בתיאור
    if (plan.description?.toLowerCase().includes(query)) score += 30;

    // התאמה בתגים
    if (plan.tags?.some((tag) => tag.toLowerCase() === query)) score += 40;
    else if (plan.tags?.some((tag) => tag.toLowerCase().includes(query)))
      score += 20;

    // התאמה בקבוצות שרירים
    if (
      plan.targetMuscleGroups?.some((muscle) =>
        muscle.toLowerCase().includes(query)
      )
    )
      score += 25;

    // התאמה ברמת קושי
    const difficultyText = getDifficultyText(plan.difficulty);
    if (difficultyText.includes(query)) score += 15;

    return { plan, score };
  });

  // החזרת תוכניות עם ציון גדול מ-0, ממוינות לפי רלוונטיות
  return plansWithScore
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.plan);
};

// קבלת ממדי מסך עם מידע נוסף
export const getScreenDimensions = () => {
  const { width, height } = Dimensions.get("window");
  const isSmallScreen = height < 700;
  const isTablet = width > 768;

  return {
    width,
    height,
    isSmallScreen,
    isTablet,
    isLandscape: width > height,
  };
};

// קבלת טקסט סטטוס לתוכנית
export const getPlanStatusText = (plan: Plan): string => {
  if (plan.isActive) return "פעיל";
  // הסרתי את isCompleted כי לא קיים ב-Plan
  return "לא פעיל";
};

// קבלת צבע סטטוס לתוכנית
export const getPlanStatusColor = (plan: Plan): string => {
  if (plan.isActive) return designSystem.colors.secondary.main;
  // הסרתי את isCompleted כי לא קיים ב-Plan
  return designSystem.colors.neutral.text.tertiary;
};

// פונקציה לחישוב משך זמן כולל של תוכנית
export const calculatePlanDuration = (plan: Plan): number => {
  return (
    plan.days?.reduce(
      (total, day) => total + (day.estimatedDuration || 30),
      0
    ) || 0
  );
};

// פונקציה לחישוב מספר תרגילים כולל
export const calculateTotalExercises = (plan: Plan): number => {
  return (
    plan.days?.reduce(
      (total, day) => total + (day.exercises?.length || 0),
      0
    ) || 0
  );
};

// פורמט תאריך לעברית
export const formatDateHebrew = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// בדיקה אם תוכנית פעילה
export const isPlanActive = (plan: Plan): boolean => {
  return plan.isActive || false;
};

// בדיקה אם תוכנית של המשתמש
export const isUserPlan = (plan: Plan, userId?: string): boolean => {
  return !!userId && plan.userId === userId;
};
