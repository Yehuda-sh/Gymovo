// src/screens/home/HomeScreen.tsx
// מסך הבית מאוזן - קומפקטי עם גלילה מינימלית

import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";

import { useUserStore } from "../../stores/userStore";
import { useHomeData } from "./hooks/useHomeData";
import { RootStackParamList } from "../../types/navigation";
import { unifiedDesignSystem } from "../../theme/unifiedDesignSystem";
import {
  HomeHeader,
  StatsButton,
  QuickActionsSection,
  MotivationCard,
  WelcomeMessage,
  QuickStartFAB,
  RecentWorkoutsSection,
  RecommendedPlanCard,
} from "./components";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// צבעים מהמערכת המאוחדת
const { colors, spacing, typography, shadows } = unifiedDesignSystem;

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <LinearGradient
      colors={colors.gradients.background}
      style={StyleSheet.absoluteFillObject}
    />
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.loadingText}>טוען...</Text>
  </View>
);

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const user = useUserStore((state) => state.user);
  const { dashboardData, loading, refreshing, onRefresh } = useHomeData(user);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* שורת כותרת עליונה עם אייקון */}
      <View style={styles.topBar}>
        <MaterialIcons
          name="home"
          size={28}
          color={colors.primary}
          style={{ marginLeft: spacing.sm }}
        />
        <Text style={styles.screenTitle}>בית</Text>
      </View>
      {/* קו highlight מתחת לכותרת */}
      <View style={styles.titleUnderline} />

      {/* רקע גרדיאנט */}
      <LinearGradient
        colors={colors.gradients.background}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + spacing.md },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <HomeHeader user={user} />
        </View>

        {/* Welcome Message */}
        <WelcomeMessage dashboardData={dashboardData || null} />

        {/* Stats Button */}
        <View style={styles.statsSection}>
          <StatsButton dashboardData={dashboardData || null} />
        </View>
        {/* מרווח בין סטטיסטיקות לפעולות מהירות */}
        <View style={{ height: spacing.lg }} />
        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitleXL}>פעולות מהירות</Text>
          <QuickActionsSection
            dashboardData={{
              activePlans: dashboardData?.activePlans?.length || 0,
              weeklyStats: {
                completedWorkouts:
                  dashboardData?.weeklyStats?.completedWorkouts || 0,
              },
            }}
          />
        </View>
        {/* מרווח בין פעולות מהירות ליעד השבועי */}
        <View style={{ height: spacing.lg }} />
        {/* Motivation Card */}
        <View style={styles.motivationSection}>
          <Text style={styles.sectionTitleXL}>היעד השבועי שלך</Text>
          <MotivationCard dashboardData={dashboardData} />
        </View>

        {/* Recent Workouts */}
        {dashboardData?.recentWorkouts &&
          dashboardData.recentWorkouts.length > 0 && (
            <View style={styles.recentSection}>
              <RecentWorkoutsSection dashboardData={dashboardData} />
            </View>
          )}

        {/* Recommended Plan (if exists) */}
        {dashboardData?.todaysWorkout && (
          <View style={styles.recommendedSection}>
            <Text style={styles.sectionTitle}>תוכנית מומלצת להיום</Text>
            <RecommendedPlanCard
              plan={dashboardData.todaysWorkout}
              onPress={() => {
                navigation.navigate("Main", { screen: "StartWorkout" });
              }}
            />
          </View>
        )}

        {/* Extra spacing for tab bar */}
        <View style={{ height: spacing.lg }} />
      </ScrollView>

      {/* Quick Start FAB */}
      <QuickStartFAB />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 80, // מרווח לטאב בר
  },
  headerSection: {
    marginBottom: spacing.lg,
  },
  statsSection: {
    marginBottom: spacing.xl,
  },
  actionsSection: {
    marginBottom: spacing.xl,
    height: 260,
  },
  motivationSection: {
    marginBottom: spacing.xl,
    minHeight: 120,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: "right",
    marginBottom: spacing.sm,
    textShadowColor: shadows.glow.shadowColor,
    textShadowOffset: shadows.glow.shadowOffset,
    textShadowRadius: shadows.glow.shadowRadius,
  },
  recentSection: {
    marginBottom: spacing.xl,
  },
  recommendedSection: {
    marginBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.textSecondary,
  },
  topBar: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    zIndex: 2,
  },
  screenTitle: {
    fontSize: typography.fontSize.xxl, // כותרת גדולה
    fontWeight: typography.fontWeight.heavy,
    color: colors.text,
    textAlign: "right",
    flex: 1,
  },
  sectionTitleXL: {
    fontSize: typography.fontSize.xl, // כותרת סקשן גדולה
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: "right",
    marginBottom: spacing.xs,
    marginTop: spacing.xs,
    alignSelf: "flex-end",
    position: "relative",
  },
  titleUnderline: {
    alignSelf: "flex-end",
    height: 3,
    width: 36,
    backgroundColor: colors.primary,
    borderRadius: unifiedDesignSystem.borderRadius.full,
    marginBottom: spacing.md,
    marginRight: spacing.lg,
  },
});

export default HomeScreen;
