// src/screens/auth/convert-guest/components/ConvertHeader.tsx
import React, { memo } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface ConvertHeaderProps {
  title: string;
  subtitle: string;
  daysUntilExpiry: number;
  workoutCount: number;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  headerScale: Animated.Value;
}

const colors = {
  primary: "#FF6B35",
  text: "#FFFFFF",
  textSecondary: "#94A3B8",
  warning: "#F59E0B",
  error: "#EF4444",
};

const ConvertHeader: React.FC<ConvertHeaderProps> = memo(
  ({
    title,
    subtitle,
    daysUntilExpiry,
    workoutCount,
    fadeAnim,
    slideAnim,
    headerScale,
  }) => {
    const urgencyColor =
      daysUntilExpiry <= 3
        ? colors.error
        : daysUntilExpiry <= 7
        ? colors.warning
        : colors.primary;

    return (
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: headerScale },
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* כותרת ראשית */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* אזהרת תפוגה */}
        {daysUntilExpiry > 0 && (
          <LinearGradient
            colors={[urgencyColor + "20", urgencyColor + "10"]}
            style={styles.urgencyBanner}
          >
            <View style={styles.urgencyContent}>
              <Ionicons
                name={daysUntilExpiry <= 3 ? "warning" : "time-outline"}
                size={20}
                color={urgencyColor}
              />
              <Text style={[styles.urgencyText, { color: urgencyColor }]}>
                נותרו {daysUntilExpiry} ימים לתפוגת החשבון
              </Text>
            </View>
          </LinearGradient>
        )}

        {/* סטטיסטיקות */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="fitness-outline" size={20} color={colors.primary} />
            <Text style={styles.statText}>{workoutCount} אימונים נשמרו</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="shield-checkmark"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.statText}>גיבוי מאובטח</Text>
          </View>
        </View>
      </Animated.View>
    );
  }
);

ConvertHeader.displayName = "ConvertHeader";

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  urgencyBanner: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    width: "100%",
  },
  urgencyContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  urgencyText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
});

export default ConvertHeader;
