// src/screens/plans/plans-screen/utils.ts
// פונקציות עזר וקבועים למסך תוכניות האימון

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types/navigation";
import { designSystem } from "../../../theme/designSystem";
import { Plan } from "../../../types/plan";
import { Animated, Dimensions } from "react-native";

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// מצב הפילטר הנוכחי במסך
export type FilterType = "all" | "mine" | "public";

// מידע על פילטר בודד
export interface FilterInfo {
  id: FilterType;
  label: string;
  icon: string;
}

// פרמטרים לרכיב תג
export interface TagProps {
  text: string;
  color?: string;
  icon?: string;
}

// פרמטרים לרכיב חיפוש
export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

// פרמטרים לרכיב פילטרים
export interface FilterTabsProps {
  selected: FilterType;
  onSelect: (filter: FilterType) => void;
}

// פרמטרים לרכיב EmptyState
export interface EmptyStateProps {
  onCreatePlan: () => void;
}

// קבועים
export const filtersList: FilterInfo[] = [
  { id: "all", label: "הכל", icon: "apps" },
  { id: "mine", label: "שלי", icon: "person" },
  { id: "public", label: "ציבוריות", icon: "globe" },
];

// פונקציות עזר

// קבלת גרדיאנט לפי רמת קושי
export const getDifficultyGradient = (difficulty?: string): string[] => {
  switch (difficulty) {
    case "beginner":
      return ["#00C9FF", "#0081FF"];
    case "intermediate":
      return ["#FC466B", "#3F5EFB"];
    case "advanced":
      return ["#FF416C", "#FF4B2B"];
    default:
      return designSystem.gradients.primary.colors;
  }
};

// עיכוב אנימציה לפי אינדקס
export const getAnimationDelay = (index: number): number => {
  return index * 150;
};

// יצירת אנימציית לחיצה
export const createPressAnimation = (scaleAnim: Animated.Value) => {
  return Animated.sequence([
         Animated.spring(scaleAnim, {
       toValue: 0.95,
       useNativeDriver: true,
     }),
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }),
  ]);
};

// יצירת אנימציית כניסה מרכזית
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
      useNativeDriver: true,
    }),
    Animated.spring(headerScale, {
      toValue: 1,
      delay: 200,
      ...designSystem.animations.easings.bounce,
      useNativeDriver: true,
    }),
  ]);
};

// סינון תוכניות לפי חיפוש
export const filterPlansBySearch = (
  plans: Plan[],
  searchQuery: string
): Plan[] => {
  if (!searchQuery.trim()) {
    return plans;
  }

  const query = searchQuery.toLowerCase();
  return plans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(query) ||
      plan.description?.toLowerCase().includes(query) ||
      plan.tags?.some((tag) => tag.toLowerCase().includes(query))
  );
};

// קבלת ממדי מסך
export const getScreenDimensions = () => {
  return Dimensions.get("window");
};
