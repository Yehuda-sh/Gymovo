// src/screens/home/components/QuickActionsSection.tsx
// קטע פעולות מהירות עם גלילה אופקית RTL מלאה

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useRef, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { theme } from "../../../theme";
import { RootStackParamList } from "../../../types/navigation";
import { DashboardData, QuickAction } from "../types";

interface QuickActionsSectionProps {
  dashboardData: DashboardData | null;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Quick Action Card Component
 */
const QuickActionCard: React.FC<{ action: QuickAction }> = ({ action }) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    action.onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={action.disabled}
      activeOpacity={0.8}
      style={[
        styles.actionCard,
        {
          backgroundColor: `${action.color}10`,
          borderColor: `${action.color}30`,
          opacity: action.disabled ? 0.5 : 1,
        },
      ]}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: `${action.color}20` }]}
      >
        <Ionicons name={action.icon as any} size={24} color={action.color} />
      </View>
      <Text style={styles.actionTitle}>{action.title}</Text>
      <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
    </TouchableOpacity>
  );
};

/**
 * Quick Actions Section Component
 */
const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  dashboardData,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const scrollViewRef = useRef<ScrollView>(null);

  // Scroll to end on mount for RTL
  useEffect(() => {
    if (I18nManager.isRTL && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, []);

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
      color: theme.colors.accent,
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
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {quickActions.map((action, index) => (
          <View key={index} style={styles.cardWrapper}>
            <QuickActionCard action={action} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -theme.spacing.lg,
  },
  scrollView: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xs,
  },
  cardWrapper: {
    marginHorizontal: theme.spacing.sm / 2,
  },
  actionCard: {
    width: 150,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  actionSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});

export default QuickActionsSection;
