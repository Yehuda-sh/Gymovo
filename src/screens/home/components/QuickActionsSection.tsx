// src/screens/home/components/QuickActionsSection.tsx - רכיב פעולות מהירות עם מערכת עיצוב מאוחדת

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../../types/navigation";
import { unifiedDesignSystem } from "../../../theme/unifiedDesignSystem";

const { colors, spacing, typography, borderRadius, shadows } =
  unifiedDesignSystem;
const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

interface QuickActionsSectionProps {
  dashboardData?: {
    activePlans?: number;
    weeklyStats?: {
      completedWorkouts?: number;
    };
  };
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  dashboardData,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const actions = [
    {
      id: "start",
      title: "התחל אימון",
      subtitle: "בחר תוכנית",
      icon: "play-circle",
      gradient: [colors.workoutActive, "#00b248"] as [string, string],
      onPress: () => navigation.navigate("Main", { screen: "StartWorkout" }),
    },
    {
      id: "plans",
      title: "תוכניות שלי",
      subtitle: `${dashboardData?.activePlans || 0} פעילות`,
      icon: "list",
      gradient: [colors.primary, colors.secondary] as [string, string],
      onPress: () => navigation.navigate("Main", { screen: "Plans" }),
    },
    {
      id: "history",
      title: "היסטוריה",
      subtitle: `${dashboardData?.weeklyStats?.completedWorkouts || 0} השבוע`,
      icon: "barbell-outline",
      gradient: [colors.warning, "#F57C00"] as [string, string],
      onPress: () => navigation.navigate("Main", { screen: "Workouts" }),
    },
    {
      id: "profile",
      title: "פרופיל",
      subtitle: "הגדרות",
      icon: "person-outline",
      gradient: [colors.accent, "#E91E63"] as [string, string],
      onPress: () => navigation.navigate("Main", { screen: "Profile" }),
    },
  ];

  const handlePress = (action: (typeof actions)[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    action.onPress();
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {actions.map((action) => (
          <Pressable
            key={action.id}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && { transform: [{ scale: 0.96 }] },
            ]}
            onPress={() => handlePress(action)}
            accessibilityLabel={action.title}
          >
            <LinearGradient
              colors={
                action.gradient.length === 2
                  ? action.gradient
                  : [colors.primary, colors.secondary]
              }
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={action.icon as any} size={28} color="#ffffff" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{action.title}</Text>
                <Text style={styles.subtitle}>{action.subtitle}</Text>
              </View>
            </LinearGradient>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  actionButton: {
    width: (width - spacing.lg * 3) / 2,
    height: 120,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.lg, // צל עמוק יותר
    borderWidth: 1.5,
    borderColor: "#fff", // מסגרת לבנה דקה
  },
  gradient: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: "space-between",
  },
  iconContainer: {
    alignSelf: "flex-end",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: "#ffffff",
    marginBottom: spacing.xs,
    textAlign: "right",
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "right",
  },
});

export default QuickActionsSection;
