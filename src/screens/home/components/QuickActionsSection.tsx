// src/screens/home/components/QuickActionsSection.tsx
// קטע פעולות מהירות עם גריד RTL נכון - סגנון ישראלי

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { theme } from "../../../theme";
import { RootStackParamList } from "../../../types/navigation";
import { DashboardData, QuickAction } from "../types";
import { useResponsiveDimensions } from "../../../hooks/useDeviceInfo";

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

interface QuickActionsSectionProps {
  dashboardData: DashboardData | null;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Quick Action Card Component with RTL design
 */
const QuickActionCard: React.FC<{ action: QuickAction }> = ({ action }) => {
  const { isSmallDevice } = useResponsiveDimensions();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePress = () => {
    handlePressOut();
    setTimeout(() => action.onPress(), 100);
  };

  // Get gradient colors based on action color
  const getGradientColors = (baseColor: string): readonly [string, string] => {
    const gradientMap: Record<string, readonly [string, string]> = {
      [theme.colors.primary]: ["#667eea", "#764ba2"] as const,
      [theme.colors.accent]: ["#f093fb", "#f5576c"] as const,
      [theme.colors.success]: ["#4facfe", "#00f2fe"] as const,
      [theme.colors.warning]: ["#43e97b", "#38f9d7"] as const,
    };
    return gradientMap[baseColor] || (["#667eea", "#764ba2"] as const);
  };

  // RTL Card styles
  const cardStyles = StyleSheet.create({
    actionCard: {
      flex: 1,
      height: isSmallDevice ? 85 : 95,
      borderRadius: 16,
      padding: isSmallDevice ? theme.spacing.sm : theme.spacing.md,
      alignItems: "center",
      justifyContent: "center",
      margin: isSmallDevice ? 4 : 6,
      opacity: action.disabled ? 0.6 : 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    cardContent: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    iconContainer: {
      width: isSmallDevice ? 32 : 36,
      height: isSmallDevice ? 32 : 36,
      borderRadius: isSmallDevice ? 16 : 18,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: isSmallDevice ? 4 : 6,
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.25)",
    },
    actionTitle: {
      fontSize: isSmallDevice ? 12 : 13,
      fontWeight: "800",
      color: "#FFFFFF",
      textAlign: "center", // RTL - מרכז הכרטיס
      marginBottom: 1,
      letterSpacing: -0.3,
      textShadowColor: "rgba(0, 0, 0, 0.3)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    actionSubtitle: {
      fontSize: isSmallDevice ? 9 : 10,
      color: "rgba(255, 255, 255, 0.85)",
      textAlign: "center", // RTL - מרכז הכרטיס
      fontWeight: "500",
      lineHeight: isSmallDevice ? 11 : 12,
    },
  });

  const gradientColors = getGradientColors(action.color);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={action.disabled}
        activeOpacity={1}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={cardStyles.actionCard}
        >
          {/* Glow effect overlay */}
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 16,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              opacity: glowAnim,
            }}
          />

          <View style={cardStyles.cardContent}>
            <View style={cardStyles.iconContainer}>
              <Ionicons
                name={action.icon as any}
                size={isSmallDevice ? 16 : 18}
                color="rgba(255, 255, 255, 0.95)"
              />
            </View>
            <Text style={cardStyles.actionTitle}>{action.title}</Text>
            <Text style={cardStyles.actionSubtitle}>{action.subtitle}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

/**
 * Quick Actions Section Component - RTL Grid Layout
 */
const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  dashboardData,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const { isSmallDevice, screenPadding } = useResponsiveDimensions();

  // RTL Order - מסדר RTL נכון לאפליקציות עבריות
  const quickActions: QuickAction[] = [
    {
      title: "התחל אימון",
      subtitle: "בחר תוכנית",
      icon: "play-circle" as any,
      color: theme.colors.primary,
      onPress: () => navigation.navigate("StartWorkout"),
      disabled: !dashboardData?.activePlans.length,
    },
    {
      title: "תוכניות שלי",
      subtitle: `${dashboardData?.activePlans.length || 0} תוכניות`,
      icon: "list" as any,
      color: theme.colors.accent,
      onPress: () => navigation.navigate("Plans" as any),
    },
    {
      title: "היסטוריה",
      subtitle: `${dashboardData?.recentWorkouts.length || 0} אימונים`,
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

  // RTL Grid layout styles
  const gridStyles = StyleSheet.create({
    container: {
      paddingHorizontal: screenPadding,
    },
    gridContainer: {
      flexDirection: "row-reverse", // RTL - מתחיל מימין
      flexWrap: "wrap",
      marginHorizontal: -4,
    },
    row: {
      flexDirection: "row-reverse", // RTL - בתוך השורה גם מימין לשמאל
      flex: 1,
      marginBottom: isSmallDevice ? 4 : 6,
    },
  });

  return (
    <View style={gridStyles.container}>
      <View style={gridStyles.gridContainer}>
        {/* שורה ראשונה RTL */}
        <View style={gridStyles.row}>
          <QuickActionCard action={quickActions[0]} />
          <QuickActionCard action={quickActions[1]} />
        </View>

        {/* שורה שנייה RTL */}
        <View style={gridStyles.row}>
          <QuickActionCard action={quickActions[2]} />
          <QuickActionCard action={quickActions[3]} />
        </View>
      </View>
    </View>
  );
};

export default QuickActionsSection;
