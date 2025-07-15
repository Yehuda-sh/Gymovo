// src/screens/home/components/StatsButton.tsx
// כפתור סטטיסטיקות אולטרה קומפקטי עם מערכת עיצוב מאוחדת

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { DashboardData } from "../types";
import { unifiedDesignSystem } from "../../../theme/unifiedDesignSystem";
import { useEffect, useRef } from "react";

const { colors, spacing, typography, borderRadius, shadows } =
  unifiedDesignSystem;

interface StatsButtonProps {
  dashboardData: DashboardData | null;
}

const StatsButton: React.FC<StatsButtonProps> = ({ dashboardData }) => {
  const stats = dashboardData?.weeklyStats || {
    completedWorkouts: 0,
    totalDuration: 0,
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Open stats modal
  };

  // אנימציית pulse לאייקון
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityLabel="סטטיסטיקות"
      style={({ pressed }) => [
        styles.container,
        pressed && { transform: [{ scale: 0.97 }] },
      ]}
    >
      <LinearGradient
        colors={[colors.gradients.primary[0], colors.gradients.primary[1]]}
        style={styles.inner}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* אייקון גדול ברקע */}
        <Animated.View
          style={[styles.bgIcon, { transform: [{ scale: pulseAnim }] }]}
          pointerEvents="none"
        >
          <Ionicons
            name="stats-chart"
            size={96}
            color={colors.primary}
            style={{ opacity: 0.12, position: "absolute", left: -12, top: -18 }}
          />
        </Animated.View>
        <View style={styles.iconContainer}>
          <Ionicons name="stats-chart" size={32} color={colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>סטטיסטיקות</Text>
          <View style={styles.titleUnderline} />
          <Text style={styles.stats}>
            {stats.completedWorkouts} אימונים •{" "}
            {Math.round(stats.totalDuration / 60)} שעות
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    ...shadows.lg,
    marginBottom: spacing.md,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  inner: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    position: "relative",
    width: "100%",
    minHeight: 72,
  },
  bgIcon: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 0,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
    zIndex: 2,
  },
  textContainer: {
    flex: 1,
    zIndex: 2,
  },
  title: {
    fontSize: typography.fontSize.lg, // פונט גדול יותר
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: "right",
  },
  titleUnderline: {
    alignSelf: "flex-end",
    height: 2,
    width: 28,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs,
    marginTop: -spacing.xs,
  },
  stats: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    opacity: 0.92, // טקסט משני בהיר יותר
  },
});

export default StatsButton;
