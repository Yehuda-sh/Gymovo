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
import WeeklyStats from "./components/WeeklyStats";
import QuickActionsSection from "./components/QuickActionsSection";
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
      paddingVertical: isSmallDevice ? theme.spacing.sm : theme.spacing.md,
    },
    section: {
      marginBottom: sectionSpacing,
    },
    sectionTitle: {
      fontSize: titleFontSize,
      fontWeight: "800",
      color: theme.colors.text,
      textAlign: "right",
      marginBottom: isSmallDevice ? theme.spacing.md : theme.spacing.lg,
      paddingHorizontal: screenPadding,
      letterSpacing: -0.5,
      lineHeight: isSmallDevice ? 28 : 32,
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

        {/* Weekly Stats Section */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>השבוע שלך</Text>
          <WeeklyStats dashboardData={dashboardData} />
        </View>

        {/* Quick Actions Section */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>פעולות מהירות</Text>
          <QuickActionsSection dashboardData={dashboardData} />
        </View>

        {/* Today's Workout */}
        {dashboardData?.todaysWorkout && (
          <View style={dynamicStyles.section}>
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

        {/* Recent Workouts */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>אימונים אחרונים</Text>
          <View style={dynamicStyles.sectionContent}>
            <RecentWorkoutsSection dashboardData={dashboardData} />
          </View>
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
    height: 100,
  },
});

export default HomeScreen;
