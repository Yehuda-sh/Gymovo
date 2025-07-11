// src/screens/home/HomeScreen.tsx
// מסך הבית הראשי עם תיקוני RTL מלאים + Responsive

import * as Haptics from "expo-haptics";
import React from "react";
import {
  RefreshControl,
  ScrollView,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  I18nManager,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useUserStore } from "../../stores/userStore";
import { theme } from "../../theme";
import { RootStackParamList } from "../../types/navigation";
import { useHomeData } from "./hooks/useHomeData";
import HomeHeader from "./components/HomeHeader";
import StatsButton from "./components/StatsButton";
import QuickActionsSection from "./components/QuickActionsSection";
import MotivationCard from "./components/MotivationCard";
import RecommendedPlanCard from "./components/RecommendedPlanCard";
import RecentWorkoutsSection from "./components/RecentWorkoutsSection";
import { useResponsiveDimensions } from "../../hooks/useDeviceInfo";
import DevResponsiveInfo from "../../components/DevResponsiveInfo";

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Loading screen component
 */
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
    <Text style={styles.loadingText}>טוען נתונים...</Text>
  </View>
);

/**
 * Main home screen component with dashboard and quick actions
 */
const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const user = useUserStore((state) => state.user);
  const { dashboardData, loading, refreshing, onRefresh } = useHomeData(user);

  const { isSmallDevice, screenPadding, sectionSpacing, titleFontSize } =
    useResponsiveDimensions();

  if (loading) {
    return <LoadingScreen />;
  }

  // Dynamic styles for responsive design
  const dynamicStyles = StyleSheet.create({
    headerContainer: {
      paddingHorizontal: screenPadding,
      paddingVertical: isSmallDevice ? theme.spacing.xs / 2 : theme.spacing.xs, // מקוצר לגריד
    },
    section: {
      marginBottom: isSmallDevice ? theme.spacing.sm : theme.spacing.md, // מקוצר דרסטית לגריד
    },
    sectionTitle: {
      fontSize: titleFontSize + 1, // מקוצר מ-+2
      fontWeight: "900",
      color: theme.colors.text,
      textAlign: "right",
      marginBottom: isSmallDevice ? theme.spacing.sm : theme.spacing.md, // מקוצר דרסטית
      paddingHorizontal: screenPadding,
      letterSpacing: -0.8,
      lineHeight: isSmallDevice ? 24 : 28, // מקוצר מ-30/36
      textShadowColor: "rgba(0, 0, 0, 0.1)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    sectionContent: {
      paddingHorizontal: screenPadding,
    },
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Header */}
        <View style={dynamicStyles.headerContainer}>
          <HomeHeader user={user} />
        </View>

        {/* Stats Button - Compact */}
        <StatsButton dashboardData={dashboardData} />

        {/* Quick Actions Section */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>פעולות מהירות</Text>
          <QuickActionsSection dashboardData={dashboardData} />
        </View>

        {/* Motivation Card - חזרה לפעילות! */}
        <MotivationCard dashboardData={dashboardData} />

        {/* Today's Workout - more compact */}
        {dashboardData?.todaysWorkout && (
          <View style={{ marginBottom: theme.spacing.sm }}>
            <Text style={dynamicStyles.sectionTitle}>האימון להיום</Text>
            <View style={dynamicStyles.sectionContent}>
              <RecommendedPlanCard
                plan={dashboardData.todaysWorkout}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  navigation.navigate("StartWorkout");
                }}
              />
            </View>
          </View>
        )}

        {/* Recent Workouts - compact */}
        <View style={{ marginBottom: theme.spacing.xs }}>
          <RecentWorkoutsSection dashboardData={dashboardData} />
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* רכיב פיתוח - מידע responsive */}
      <DevResponsiveInfo />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  bottomSpacing: {
    height: 30, // מקוצר עוד יותר לגריד
  },
});

export default HomeScreen;
