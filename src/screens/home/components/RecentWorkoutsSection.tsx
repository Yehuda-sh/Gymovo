// src/screens/home/components/RecentWorkoutsSection.tsx
// קטע אימונים אחרונים עם עיצוב RTL נכון

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { theme } from "../../../theme";
import { RootStackParamList } from "../../../types/navigation";
import { DashboardData } from "../types";
import { useResponsiveDimensions } from "../../../hooks/useDeviceInfo";
import EmptyState from "./EmptyState";
import WorkoutCard from "./WorkoutCard";

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

interface RecentWorkoutsSectionProps {
  dashboardData: DashboardData | null;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Recent workouts section with proper RTL layout
 */
const RecentWorkoutsSection: React.FC<RecentWorkoutsSectionProps> = ({
  dashboardData,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const { isSmallDevice } = useResponsiveDimensions();

  // אם אין אימונים אחרונים
  if (!dashboardData?.recentWorkouts.length) {
    return <EmptyState />;
  }

  // רק 2 אימונים אחרונים לחיסכון מקסימלי במקום לגריד
  const recentWorkouts = dashboardData.recentWorkouts.slice(0, 2);

  const handleViewAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Workouts" as any);
  };

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xs,
    },
    // RTL Header - כותרת מימין, כפתור משמאל
    header: {
      flexDirection: "row-reverse", // RTL - מימין לשמאל
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    sectionTitle: {
      fontSize: isSmallDevice ? 18 : 20,
      fontWeight: "900",
      color: theme.colors.text,
      textAlign: "right", // RTL
      letterSpacing: -0.6,
    },
    // כפתור "ראה הכל" - כפתור משני בצד שמאל
    viewAllButton: {
      flexDirection: "row", // RTL - אייקון לפני טקסט
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    viewAllText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.primary,
      marginRight: theme.spacing.xs, // RTL - מרווח מימין לאייקון
    },
    workoutsList: {
      gap: theme.spacing.xs,
    },
    bottomSpacing: {
      height: 20,
    },
  });

  return (
    <View style={styles.container}>
      {/* RTL Header - כותרת מימין, כפתור משמאל */}
      <View style={styles.header}>
        {/* כותרת בצד ימין */}
        <Text style={styles.sectionTitle}>אימונים אחרונים</Text>

        {/* כפתור "ראה הכל" בצד שמאל */}
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={handleViewAll}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>ראה הכל</Text>
          <Ionicons
            name="chevron-back" // RTL - חץ לשמאל
            size={16}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* רשימת אימונים */}
      <View style={styles.workoutsList}>
        {recentWorkouts.map((workout, index) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            isCompact={true}
            animationDelay={index * 100}
            onPress={() =>
              navigation.navigate("WorkoutSummary", {
                workoutData: workout,
              })
            }
          />
        ))}
      </View>

      {/* Bottom spacing for tab bar */}
      <View style={styles.bottomSpacing} />
    </View>
  );
};

export default RecentWorkoutsSection;
