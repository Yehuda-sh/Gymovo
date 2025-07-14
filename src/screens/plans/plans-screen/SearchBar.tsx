// src/screens/plans/plans-screen/SearchBar.tsx
// רכיב חיפוש מתקדם עם אנימציות וניקוי

import React, { useRef, useEffect, useCallback, memo } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { colors } from "../../../theme/colors";
import { SearchBarProps } from "./utils";

// הגדרת designSystem מקומית
const designSystem = {
  colors: {
    background: {
      elevated: colors.surface,
    },
    neutral: {
      text: {
        primary: colors.text,
        tertiary: colors.textMuted,
      },
      border: colors.border,
    },
    primary: {
      main: colors.primary,
    },
  },
  shadows: {
    sm: Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  animations: {
    easings: {
      bounce: {
        tension: 50,
        friction: 5,
      },
    },
  },
};

// רכיב חיפוש עם אנימציית כניסה וכפתור ניקוי
const SearchBar: React.FC<SearchBarProps> = memo(
  ({ value, onChangeText, placeholder = "חפש תוכנית..." }) => {
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const focusAnim = useRef(new Animated.Value(0)).current;
    const inputRef = useRef<TextInput>(null);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    useEffect(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        ...designSystem.animations.easings.bounce,
        useNativeDriver: true,
      }).start();
    }, [scaleAnim]);

    // אנימציית פוקוס
    const handleFocus = useCallback(() => {
      Animated.timing(focusAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }, [focusAnim]);

    const handleBlur = useCallback(() => {
      Animated.timing(focusAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }, [focusAnim]);

    // ניקוי השדה עם haptic feedback
    const handleClear = useCallback(() => {
      if (Platform.OS === "ios") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onChangeText("");
      inputRef.current?.focus();
    }, [onChangeText]);

    // צבע גבול דינמי בזמן פוקוס
    const borderColor = focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [
        isDark ? colors.borderLight : colors.border,
        designSystem.colors.primary.main,
      ],
    });

    // צבעים דינמיים לפי תמה
    const dynamicColors = {
      background: isDark ? colors.surface : "#FFFFFF",
      text: isDark ? colors.text : "#1F2937",
      placeholder: isDark ? colors.textMuted : "#9CA3AF",
      icon: isDark ? colors.textSecondary : "#6B7280",
      border: isDark ? colors.borderLight : colors.border,
    };

    return (
      <Animated.View
        style={[
          styles.searchContainer,
          {
            transform: [{ scale: scaleAnim }],
            backgroundColor: dynamicColors.background,
            borderColor: borderColor as any,
          },
        ]}
      >
        <Ionicons name="search" size={20} color={dynamicColors.icon} />
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={dynamicColors.placeholder}
          style={[styles.searchInput, { color: dynamicColors.text }]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="never" // נשתמש בכפתור מותאם אישית
        />
        {value !== "" && (
          <Animated.View
            style={{
              opacity: value ? 1 : 0,
              transform: [
                {
                  scale: value ? 1 : 0.8,
                },
              ],
            }}
          >
            <TouchableOpacity
              onPress={handleClear}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.clearButton}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={dynamicColors.icon}
              />
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    );
  }
);

SearchBar.displayName = "SearchBar";

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 14 : 12,
    marginHorizontal: 20,
    marginVertical: 12,
    gap: 12,
    borderWidth: 1.5,
    ...designSystem.shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    textAlign: "right",
    paddingVertical: 0, // למנוע padding נוסף ב-Android
  },
  clearButton: {
    padding: 4,
  },
});

export default SearchBar;
