// src/navigation/components/TabBarIcon.tsx
// רכיב אייקונים לטאב בר עם מפת אייקונים מאורגנת

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { colors } from "../../theme/colors";

interface TabBarIconProps {
  routeName: string;
  focused: boolean;
  size: number;
}

type IconName = keyof typeof Ionicons.glyphMap;

interface IconConfig {
  focused: IconName;
  unfocused: IconName;
}

/**
 * מפת אייקונים לכל טאב באפליקציה
 */
const iconMap: Record<string, IconConfig> = {
  Home: {
    focused: "home",
    unfocused: "home-outline",
  },
  Plans: {
    focused: "list",
    unfocused: "list-outline",
  },
  StartWorkout: {
    focused: "play-circle",
    unfocused: "play-circle-outline",
  },
  Workouts: {
    focused: "barbell",
    unfocused: "barbell-outline",
  },
  Profile: {
    focused: "person",
    unfocused: "person-outline",
  },
};

/**
 * רכיב אייקון לטאב בר - מציג אייקון מתאים לכל טאב
 */
export const TabBarIcon: React.FC<TabBarIconProps> = ({
  routeName,
  focused,
  size,
}) => {
  const iconConfig = iconMap[routeName];
  const iconName = iconConfig
    ? iconConfig[focused ? "focused" : "unfocused"]
    : "help-outline";

  return (
    <Ionicons
      name={iconName}
      size={size}
      color={focused ? colors.primary : colors.textSecondary}
    />
  );
};

export default TabBarIcon;
