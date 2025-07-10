// src/screens/plans/plans-screen/SearchBar.tsx
// רכיב חיפוש מתקדם עם אנימציות וניקוי

import React, { useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { designSystem } from "../../../theme/designSystem";
import { SearchBarProps } from "./utils";

// רכיב חיפוש עם אנימציית כניסה וכפתור ניקוי
const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "חפש תוכנית...",
}) => {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      ...designSystem.animations.easings.bounce,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[styles.searchContainer, { transform: [{ scale: scaleAnim }] }]}
    >
      <Ionicons
        name="search"
        size={20}
        color={designSystem.colors.neutral.text.tertiary}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={designSystem.colors.neutral.text.tertiary}
        style={styles.searchInput}
      />
      {value !== "" && (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <Ionicons
            name="close-circle"
            size={20}
            color={designSystem.colors.neutral.text.tertiary}
          />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: designSystem.colors.background.elevated,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: designSystem.colors.neutral.border,
    ...designSystem.shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: designSystem.colors.neutral.text.primary,
    textAlign: "right",
  },
});

export default SearchBar;
