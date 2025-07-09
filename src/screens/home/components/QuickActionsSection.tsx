// src/screens/home/components/QuickActionsSection.tsx
// קטע פעולות מהירות עם גלילה אופקית

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { ScrollView, View } from "react-native";

import { Spacer, Typography } from "../../../components/ui";
import { theme } from "../../../theme";
import { RootStackParamList } from "../../../types/navigation";
import { DashboardData, QuickAction } from "../types";
import QuickActionCard from "./QuickActionCard";

interface QuickActionsSectionProps {
  dashboardData: DashboardData | null;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Section component for quick actions with horizontal scrolling
 */
const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  dashboardData,
}) => {
  const navigation = useNavigation<NavigationProp>();

  // 🎯 מערך פעולות מהירות
  const quickActions: QuickAction[] = [
    {
      title: "התחל אימון",
      subtitle: "בחר תוכנית וקדימה",
      icon: "play-circle" as any,
      color: theme.colors.primary,
      onPress: () => navigation.navigate("StartWorkout"),
      disabled: !dashboardData?.activePlans.length,
    },
    {
      title: "תוכניות שלי",
      subtitle: `${dashboardData?.activePlans.length || 0} תוכניות פעילות`,
      icon: "list" as any,
      color: theme.colors.secondary,
      onPress: () => navigation.navigate("Plans" as any),
    },
    {
      title: "היסטוריה",
      subtitle: `${dashboardData?.recentWorkouts.length || 0} אימונים אחרונים`,
      icon: "bar-chart" as any,
      color: theme.colors.success,
      onPress: () => navigation.navigate("Workouts" as any),
    },
    {
      title: "הגדרות",
      subtitle: "התאם אישית",
      icon: "settings" as any,
      color: theme.colors.warning,
      onPress: () => navigation.navigate("Settings"),
    },
  ];

  return (
    <View>
      <Typography variant="h3">פעולות מהירות</Typography>
      <Spacer size="md" />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingRight: theme.spacing.md,
          gap: theme.spacing.md,
        }}
      >
        {quickActions.map((action, index) => (
          <QuickActionCard key={index} action={action} />
        ))}
      </ScrollView>
    </View>
  );
};

export default QuickActionsSection;
