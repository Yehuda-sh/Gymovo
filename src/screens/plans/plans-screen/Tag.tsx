// src/screens/plans/plans-screen/Tag.tsx
// רכיב תג גמיש עם אייקון ועיצוב מותאם

import React, { memo, useMemo } from "react";
import { View, Text, StyleSheet, useColorScheme, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";
import { TagProps } from "./utils";

// הגדרת designSystem מקומית
const designSystem = {
  colors: {
    primary: {
      main: colors.primary,
    },
  },
};

// פונקציית עזר ליצירת צבע עם שקיפות
const withOpacity = (color: string, opacity: number): string => {
  // אם הצבע כבר כולל שקיפות, נחזיר אותו כמו שהוא
  if (color.includes("rgba")) return color;

  // המרה מ-hex ל-rgba
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// רכיב תג מעוצב עם אייקון אופציונלי
const Tag: React.FC<TagProps> = memo(
  ({ text, color = designSystem.colors.primary.main, icon }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    // חישוב צבעים דינמיים
    const dynamicColors = useMemo(() => {
      const baseColor = color || designSystem.colors.primary.main;

      return {
        backgroundColor: withOpacity(baseColor, isDark ? 0.2 : 0.15),
        borderColor: withOpacity(baseColor, isDark ? 0.4 : 0.3),
        textColor: isDark ? colors.text : baseColor,
        iconColor: isDark ? colors.text : baseColor,
      };
    }, [color, isDark]);

    return (
      <View
        style={[
          styles.tag,
          {
            backgroundColor: dynamicColors.backgroundColor,
            borderColor: dynamicColors.borderColor,
          },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon as any}
            size={12}
            color={dynamicColors.iconColor}
            style={styles.icon}
          />
        )}
        <Text
          style={[
            styles.tagText,
            {
              color: dynamicColors.textColor,
            },
          ]}
          numberOfLines={1}
        >
          {text}
        </Text>
      </View>
    );
  }
);

Tag.displayName = "Tag";

const styles = StyleSheet.create({
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    marginHorizontal: 4,
    gap: 4,
    maxWidth: 150, // למנוע תגים ארוכים מדי
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    flexShrink: 1, // לאפשר קיצור טקסט ארוך
  },
  icon: {
    marginTop: Platform.OS === "android" ? -1 : 0, // תיקון יישור ב-Android
  },
});

export default Tag;
