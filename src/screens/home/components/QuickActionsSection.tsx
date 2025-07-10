// src/screens/home/components/QuickActionsSection.tsx
// קטע פעולות מהירות עם גלילה אופקית RTL מלאה + Responsive

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
import { useResponsiveDimensions } from "../../../hooks/useDeviceInfo";

interface QuickActionsSectionProps {
  dashboardData: DashboardData | null;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Quick Action Card Component
 */
const QuickActionCard: React.FC<{ action: QuickAction }> = ({ action }) => {
  const { isSmallDevice, iconSize, iconContainerSize, cardPadding } =
    useResponsiveDimensions();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    action.onPress();
  };

  // Dynamic styles for responsive design
  const dynamicStyles = StyleSheet.create({
    actionCard: {
      width: isSmallDevice ? 140 : 160,
      padding: isSmallDevice ? theme.spacing.lg : theme.spacing.xl,
      borderRadius: theme.borderRadius.xl,
      alignItems: "center",
      borderWidth: 1.5,
      backgroundColor: `${action.color}10`,
      borderColor: `${action.color}30`,
      opacity: action.disabled ? 0.5 : 1,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
    },
    iconContainer: {
      width: isSmallDevice ? 52 : 56,
      height: isSmallDevice ? 52 : 56,
      borderRadius: (isSmallDevice ? 52 : 56) / 2,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: isSmallDevice ? theme.spacing.md : theme.spacing.lg,
      backgroundColor: `${action.color}20`,
      borderWidth: 2,
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    actionTitle: {
      fontSize: isSmallDevice ? 15 : 17,
      fontWeight: "700",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: isSmallDevice ? theme.spacing.xs : theme.spacing.sm,
      letterSpacing: -0.3,
    },
    actionSubtitle: {
      fontSize: isSmallDevice ? 12 : 14,
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontWeight: "500",
      lineHeight: isSmallDevice ? 16 : 18,
    },
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={action.disabled}
      activeOpacity={0.8}
      style={dynamicStyles.actionCard}
    >
      <View style={dynamicStyles.iconContainer}>
        <Ionicons
          name={action.icon as any}
          size={isSmallDevice ? iconSize - 2 : iconSize}
          color={action.color}
        />
      </View>
      <Text style={dynamicStyles.actionTitle}>{action.title}</Text>
      <Text style={dynamicStyles.actionSubtitle}>{action.subtitle}</Text>
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
  const { isSmallDevice, screenPadding } = useResponsiveDimensions();

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

  // Dynamic styles for the container
  const dynamicStyles = StyleSheet.create({
    container: {
      marginHorizontal: -screenPadding,
    },
    scrollContent: {
      paddingHorizontal: screenPadding,
      paddingVertical: theme.spacing.xs,
    },
    cardWrapper: {
      marginHorizontal: isSmallDevice ? theme.spacing.xs : theme.spacing.sm / 2,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={dynamicStyles.scrollContent}
        style={styles.scrollView}
      >
        {quickActions.map((action, index) => (
          <View key={index} style={dynamicStyles.cardWrapper}>
            <QuickActionCard action={action} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
  },
});

export default QuickActionsSection;
