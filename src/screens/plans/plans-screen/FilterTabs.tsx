// src/screens/plans/plans-screen/FilterTabs.tsx
// רכיב פילטרים מתקדם עם אנימציות וגרדיאנטים

import React, { useRef } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import LinearGradient from "react-native-linear-gradient";
import { designSystem } from "../../../theme/designSystem";
import { FilterTabsProps, filtersList, createPressAnimation } from "./utils";

// רכיב פילטרים עם אנימציות חלקות וגרדיאנטים יפים
const FilterTabs: React.FC<FilterTabsProps> = ({ selected, onSelect }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterTabs}
      contentContainerStyle={styles.filterTabsContent}
    >
      {filtersList.map((filter) => {
        const isActive = selected === filter.id;
        const scaleAnim = useRef(new Animated.Value(1)).current;

        const handlePress = () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

          // הפעלת אנימציית לחיצה
          createPressAnimation(scaleAnim).start();

          onSelect(filter.id);
        };

        return (
          <Animated.View
            key={filter.id}
            style={{ transform: [{ scale: scaleAnim }] }}
          >
            <TouchableOpacity
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={handlePress}
            >
              {isActive ? (
                <LinearGradient
                  colors={designSystem.gradients.primary.colors}
                  style={styles.filterTabGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={filter.icon as any} size={16} color="#fff" />
                  <Text
                    style={[styles.filterTabText, styles.filterTabTextActive]}
                  >
                    {filter.label}
                  </Text>
                </LinearGradient>
              ) : (
                <>
                  <Ionicons
                    name={filter.icon as any}
                    size={16}
                    color={designSystem.colors.neutral.text.secondary}
                  />
                  <Text style={styles.filterTabText}>{filter.label}</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filterTabs: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterTabsContent: {
    gap: 12,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: designSystem.colors.background.elevated,
    borderWidth: 1,
    borderColor: designSystem.colors.neutral.border,
    gap: 8,
    minWidth: 100,
    justifyContent: "center",
    ...designSystem.shadows.sm,
  },
  filterTabActive: {
    borderColor: "transparent",
    ...designSystem.shadows.md,
  },
  filterTabGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: -20,
    marginVertical: -12,
    justifyContent: "center",
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: designSystem.colors.neutral.text.secondary,
  },
  filterTabTextActive: {
    color: "#fff",
  },
});

export default FilterTabs;
